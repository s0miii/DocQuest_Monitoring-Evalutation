from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import *
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q

User = get_user_model()

# signup
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = UserSignupSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(email=request.data['email'])
        user.set_password(request.data['password'])
        user.save()

        return Response({"message": "User created and role assigned",},
                            status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# inig login mag fetch user name and roles
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def name_and_roles(request):
    user = request.user  # Get the authenticated user from the request

    # Serialize user data
    user_serializer = UserLoginSerializer(instance=user)

    # Return combined response with user data and roles
    return Response({
        "userID": user_serializer.data['userID'],
        "firstname": user_serializer.data['firstname'],
        "lastname": user_serializer.data['lastname'],
        "roles": user_serializer.data['roles']
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user  # Get the authenticated user from the request

    # Serialize user data
    user_serializer = UserEditProfileSerializer(instance=user)

    # Return combined response with user data and roles
    return Response(user_serializer.data)

# edit user profile
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def edit_profile(request, pk):
    try:
        instance = CustomUser.objects.get(pk=pk)
    except CustomUser.DoesNotExist:
        return Response({"error": "Object not found."}),

    serializer = UserEditProfileSerializer(instance, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_role(request):
    role_serializer = RoleSerializer(data=request.data)

    if role_serializer.is_valid():
        role_serializer.save()
        return Response({"message": "Role successfuly created"}, status=status.HTTP_201_CREATED)

    return Response(role_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_project(request):
    serializer = PostProjectSerializer(data=request.data)

    if serializer.is_valid():
        # Create project
        project = serializer.save()

        if project.dateCreated and not project.uniqueCode:
            project.uniqueCode = f"{project.projectID}-{project.dateCreated.strftime('%Y%m%d')}"
        project.save()

        # Create deliverables
        deliverable_ids = request.data.get('deliverables', [])
        deliverables_data = [
            {
                'userID': request.user.userID,
                'projectID': project.projectID,
                'deliverableID': deliverable_id
            }
            for deliverable_id in deliverable_ids
        ]

        deliverables_serializer = UserProjectDeliverablesSerializer(
            data=deliverables_data, 
            many=True
        )
        
        if deliverables_serializer.is_valid():
            deliverables_serializer.save()
        else:
            # If deliverables creation fails, delete the project and return error
            project.delete()
            return Response(
                deliverables_serializer.errors, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create review
        try:
            content_type = ContentType.objects.get(model='project')
            reviewer_user = CustomUser.objects.filter(role__code='prch').first()
            
            if not reviewer_user:
                project.delete()
                return Response(
                    {"error": "No user with the 'director' role found."},
                    status=status.HTTP_404_NOT_FOUND
                )

            review_data = {
                'contentOwnerID': request.user.userID,
                'content_type': content_type.id,
                'source_id': project.projectID,
                'reviewedByID': reviewer_user.userID,
                'comment': '',
                'reviewStatus': 'pending'
            }
            
            review_serializer = ReviewSerializer(data=review_data)
            if review_serializer.is_valid():
                review_serializer.save()
            else:
                project.delete()
                return Response(
                    review_serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )

        except ContentType.DoesNotExist:
            project.delete()
            return Response(
                {"error": "Invalid content type specified"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create notifications for director and staff
        try:
            director_staff_users = CustomUser.objects.filter(
                role__code__in=['ecrd', 'estf']
            ).distinct()

            notifications = [
                Notification(
                    userID=user, # The current user being notified
                    content_type=content_type, # The content type object for 'project'
                    source_id=project.projectID, # ID of the newly created project
                    message='New project to review'
                )
                for user in director_staff_users
            ]

            Notification.objects.bulk_create(notifications)

        except Exception as e:
            project.delete()
            return Response(
                {"error": f"Error creating notifications: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({
            "message": "Project successfully created with deliverables, review, and notifications",
            "projectID": project.projectID
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_project(request, pk): 
    user = request.user  # Get the authenticated user

    # Try to fetch the project by its ID
    try:
        project = Project.objects.get(pk=pk)  # Use pk to fetch the project directly
    except Project.DoesNotExist:
        return Response({"detail": "Project not found."}, status=status.HTTP_404_NOT_FOUND)

    project_serializer = GetProjectSerializer(instance=project)
    return Response(project_serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_checklist(request):
    # Query all regions
    deliverables = Deliverables.objects.all()

    # Serialize the regions
    serializer = DeliverablesSerializer(deliverables, many=True)

    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_deliverables(request):
    serializer = UserProjectDeliverablesSerializer(data=request.data)

    if serializer.is_valid():
        deliverables = serializer.save()
        return Response({"message": "Deliverables successfuly created"}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_notifications_to_director_and_staff(request):
    # Get content type and object ID from request data
    content_type_model = request.data.get('content_type')
    source_id = request.data.get('source_id')

    # Determine the message based on content type
    if content_type_model.lower() == 'project':
        message = 'New project to review'
    elif content_type_model.lower() == 'moa':
        message = 'New MOA to review'
    else:
        return Response(
            {"error": "Invalid content type specified. Must be 'project' or 'moa'."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate if the content type exists in the ContentType table
    try:
        content_type = ContentType.objects.get(model=content_type_model.lower())
    except ContentType.DoesNotExist:
        return Response(
            {"error": "Invalid content type specified"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Filter users with roles 'director' or 'staff'
    director_staff_users = CustomUser.objects.filter(
        role__code__in=['ecrd', 'estf']
    ).distinct()

    # Create notifications for each user
    notifications = [
        Notification(
            userID=user,
            content_type=content_type,
            source_id=source_id,
            message=message
        )
        for user in director_staff_users
    ]

    # Bulk create notifications
    Notification.objects.bulk_create(notifications)

    # Serialize and return created notifications
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request):
    # Get the logged-in user as content owner
    content_owner = request.user

    # Extract content type and source ID from request data
    content_type_model = request.data.get('content_type')
    source_id = request.data.get('source_id')
    comment = request.data.get('comment', '')

    # Validate and retrieve the content type
    try:
        content_type = ContentType.objects.get(model=content_type_model.lower())
    except ContentType.DoesNotExist:
        return Response(
            {"error": "Invalid content type specified. Must be 'project' or 'moa'."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Find a user with the 'director' role to assign as reviewedBy
    try:
        director_user = CustomUser.objects.filter(role__code='ecrd').first()
        if not director_user:
            return Response(
                {"error": "No user with the 'director' role found."},
                status=status.HTTP_404_NOT_FOUND
            )
    except CustomUser.DoesNotExist:
        return Response(
            {"error": "Error retrieving director user."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Create the review instance
    review_data = {
        'contentOwnerID': content_owner.userID,
        'content_type': content_type.id,
        'source_id': source_id,
        'reviewedByID': director_user.userID,
        'comment': comment,
        'reviewStatus': 'pending'
    }
    
    serializer = ReviewSerializer(data=review_data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_or_deny_project(request, review_id):
    # List of roles that can approve/deny projects
    AUTHORIZED_ROLES = ['prch', 'cldn', 'ecrd']
    
    # Check if user has any of the authorized roles
    if not request.user.role.filter(code__in=AUTHORIZED_ROLES).exists():
        return Response(
            {"error": "You do not have the required permissions to perform this action."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        # Fetch the review instance
        review = Review.objects.get(reviewID=review_id)
        project = Project.objects.get(projectID=review.source_id)

        # Get the user's role code
        user_role = request.user.role.first().code

        # Determine approval or rejection
        action = request.data.get('action')
        comment = request.data.get('comment', '')

        # Initialize notification variables
        notification_user = None
        message = ''

        if action == 'approve':
            review.reviewStatus = 'approved'
            review.comment = comment
            # Increment approval counter
            review.approvalCounter += 1
            project.approvalCounter += 1
            
            # Determine notification recipient and message based on approval counter
            if review.approvalCounter == 1:
                review.reviewedByID = request.user
                review.reviewerResponsible = 'prch'
                # Notify CLDN role user after first approval (from PRCH)
                notification_user = CustomUser.objects.filter(role__code='cldn').first()
                message = f'Project "{project.projectTitle}" requires your review and approval'
                project.status = 'pending'
            
            elif review.approvalCounter == 2:
                review.reviewedByID = request.user
                review.reviewerResponsible = 'cldn'
                # Notify ECRD role user after second approval (from CLDN)
                notification_user = CustomUser.objects.filter(role__code='ecrd').first()
                message = f'Project "{project.projectTitle}" requires your final review and approval'
                project.status = 'pending'
            
            elif review.approvalCounter >= 3:
                review.reviewedByID = request.user
                review.reviewerResponsible = 'ecrd'
                # Notify content owner after final approval (from ECRD)
                notification_user = review.contentOwnerID
                message = f'Your project "{project.projectTitle}" has been fully approved and is ready to print'
                project.status = 'approved'
                
        elif action == 'deny':
            review.reviewStatus = 'rejected'
            review.comment = comment
            review.approvalCounter = 0  # Reset counter on rejection
            project.approvalCounter = 0
            project.status = 'rejected'
            review.reviewedByID = request.user
            review.reviewerResponsible = user_role
            notification_user = review.contentOwnerID
            message = f'Your project "{project.projectTitle}" has been rejected. Reason: {comment}'
        else:
            return Response(
                {"error": "Invalid action. Must be 'approve' or 'deny'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Save changes to the review and project
        review.save()
        project.save()

        # Create notification for the appropriate user
        if notification_user:
            notification = Notification.objects.create(
                userID=notification_user,
                content_type=ContentType.objects.get_for_model(Review),
                source_id=review.reviewID,
                message=message,
                status='Unread'
            )
            notification_serializer = NotificationSerializer(notification)
        else:
            notification_serializer = None

        # Serialize and return the updated review and notification
        review_serializer = ReviewSerializer(review)
        
        response_data = {
            "review": review_serializer.data,
            "project_status": project.status,
            "approval_counter": review.approvalCounter
        }

        if notification_serializer:
            response_data["notification"] = notification_serializer.data

        return Response(response_data, status=status.HTTP_200_OK)

    except Review.DoesNotExist:
        return Response({"error": "Review not found."}, status=status.HTTP_404_NOT_FOUND)
    except Project.DoesNotExist:
        return Response({"error": "Project not found."}, status=status.HTTP_404_NOT_FOUND)
    except CustomUser.DoesNotExist:
        return Response(
            {"error": "Could not find appropriate user to notify."}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_or_deny_moa(request, review_id):
    # List of roles that can approve/deny MOAs
    AUTHORIZED_ROLES = ['vpala', 'ecrd']
    
    # Check if user has any of the authorized roles
    if not request.user.role.filter(code__in=AUTHORIZED_ROLES).exists():
        return Response(
            {"error": "You do not have the required permissions to perform this action."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        # Fetch the review instance
        review = Review.objects.get(reviewID=review_id)
        moa = MOA.objects.get(moaID=review.source_id)

        # Get the user's role code
        user_role = request.user.role.first().code

        # Determine approval or rejection
        action = request.data.get('action')
        comment = request.data.get('comment', '')

        # Initialize notification variables
        notification_user = None
        message = ''

        if action == 'approve':
            review.reviewStatus = 'approved'
            review.comment = comment
            # Increment approval counter
            review.approvalCounter += 1
            moa.approvalCounter += 1
            
            # Determine notification recipient and message based on approval counter
            if review.approvalCounter == 1:
                review.reviewedByID = request.user
                review.reviewerResponsible = 'vpala'
                # Notify ECRD role user after first approval (from VPALA)
                notification_user = CustomUser.objects.filter(role__code='ecrd').first()
                message = f'MOA requires your final review and approval'
                moa.status = 'pending'
            
            elif review.approvalCounter >= 2:
                review.reviewedByID = request.user
                review.reviewerResponsible = 'ecrd'
                # After ECRD approval, notify staff users
                moa.status = 'approved'
                # First notify content owner
                notification_user = review.contentOwnerID
                message = f'Your MOA has been fully approved'
                
                # Then create notifications for all staff users
                staff_users = CustomUser.objects.filter(role__code='estf')
                for staff in staff_users:
                    Notification.objects.create(
                        userID=staff,
                        content_type=ContentType.objects.get_for_model(MOA),
                        source_id=moa.moaID,
                        message=f'New MOA has been approved and ready for implementation',
                        status='Unread'
                    )
                
        elif action == 'deny':
            review.reviewStatus = 'rejected'
            review.comment = comment
            review.approvalCounter = 0  # Reset counter on rejection
            moa.approvalCounter = 0
            moa.status = 'rejected'
            review.reviewedByID = request.user
            review.reviewerResponsible = user_role
            notification_user = review.contentOwnerID
            message = f'Your MOA has been rejected. Reason: {comment}'
        else:
            return Response(
                {"error": "Invalid action. Must be 'approve' or 'deny'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Save changes to the review and MOA
        review.save()
        moa.save()

        # Create notification for the appropriate user
        if notification_user:
            notification = Notification.objects.create(
                userID=notification_user,
                content_type=ContentType.objects.get_for_model(Review),
                source_id=review.reviewID,
                message=message,
                status='Unread'
            )
            notification_serializer = NotificationSerializer(notification)
        else:
            notification_serializer = None

        # Serialize and return the updated review and notification
        review_serializer = ReviewSerializer(review)
        
        response_data = {
            "review": review_serializer.data,
            "moa_status": moa.status,
            "approval_counter": review.approvalCounter
        }

        if notification_serializer:
            response_data["notification"] = notification_serializer.data

        return Response(response_data, status=status.HTTP_200_OK)

    except Review.DoesNotExist:
        return Response({"error": "Review not found."}, status=status.HTTP_404_NOT_FOUND)
    except MOA.DoesNotExist:
        return Response({"error": "MOA not found."}, status=status.HTTP_404_NOT_FOUND)
    except CustomUser.DoesNotExist:
        return Response(
            {"error": "Could not find appropriate user to notify."}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_project(request, project_id):
    try:
        project = Project.objects.get(pk=project_id)
    except Project.DoesNotExist:
        return Response({"error": "Project not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = UpdateProjectSerializer(instance=project, data=request.data, partial=True)
    if serializer.is_valid():
        project = serializer.save()

        # Update related many-to-many or reverse relationships
        if 'agency' in request.data:
            project.agency.set(request.data['agency'])

        if 'proponents' in request.data:
            project.proponents.set(request.data['proponents'])

        # Get all users with the 'Director' role code
        reviewer_role_code = 'prch'  # Assuming 'DIR' is the code for the Director role
        reviewer_users = CustomUser.objects.filter(role__code=reviewer_role_code)

        # Send notification to each director
        for director in reviewer_users:
            Notification.objects.create(
                userID=director,
                content_type=ContentType.objects.get_for_model(Project),
                source_id=project.projectID,
                message="Project has been updated and requires review."
            )

        # Assign a director as the reviewer (assuming one director for the review)
        if reviewer_users.exists():
            review = Review.objects.create(
                contentOwnerID=request.user,
                content_type=ContentType.objects.get_for_model(Project),
                source_id=project.projectID,
                reviewedByID=reviewer_users.first(),  # Assigning the first director found
                reviewStatus='pending',
                comment="Project has been edited and is pending approval."
            )

        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_moa(request):
    # Create a mutable copy of request.data so we can modify it
    data = request.data.copy()
    
    # Assign the authenticated user as userID
    data['userID'] = request.user.userID

    serializer = PostMOASerializer(data=data)

    if serializer.is_valid():
        moa = serializer.save(userID=request.user)

        if moa.dateCreated and not moa.uniqueCode:
            moa.uniqueCode = f"{moa.moaID}-{moa.dateCreated.strftime('%Y%m%d')}"
        moa.save()

        # Link the MOA to the specified Project
        project_id = data.get('projectID')
        if project_id:
            try:
                project = Project.objects.get(projectID=project_id)
                project.moaID = moa  # Assign the MOA instance directly
                project.save()
            except Project.DoesNotExist:
                return Response({"error": "Project not found."}, status=status.HTTP_404_NOT_FOUND)

        # Get all users with the 'Director' role code
        reviewer_role_code = 'prch'  # Assuming 'DIR' is the code for the Director role
        reviewer_users = CustomUser.objects.filter(role__code=reviewer_role_code)

        # Create notification
        for director in reviewer_users:
            Notification.objects.create(
                userID=director,
                content_type=ContentType.objects.get_for_model(MOA),
                source_id=moa.moaID,
                message="MOA has been submitted and requires review."
            )

        # Create a review for this MOA
        if reviewer_users.exists():
            review = Review.objects.create(
                contentOwnerID=request.user,
                content_type=ContentType.objects.get_for_model(MOA),
                source_id=moa.moaID,
                reviewedByID=reviewer_users.first(),  # Assigning the first director found
                reviewStatus='pending',
            )

        return Response({"message": "MOA submitted for review."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_moa(request, moa_id):
    try:
        moa = MOA.objects.get(pk=moa_id)
    except MOA.DoesNotExist:
        return Response({"error": "MOA not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = UpdateMOASerializer(instance=moa, data=request.data)
    if serializer.is_valid():
        moa = serializer.save()

        # Get all users with the 'Director' role code
        reviewer_role_code = 'prch'  # Assuming 'DIR' is the code for the Director role
        reviewer_users = CustomUser.objects.filter(role__code=reviewer_role_code)

        # Send notification to each director
        for director in reviewer_users:
            Notification.objects.create(
                userID=director,
                content_type=ContentType.objects.get_for_model(MOA),
                source_id=moa.moaID,
                message="MOA has been updated and requires review."
            )

        # Assign a director as the reviewer (assuming one director for the review)
        if reviewer_users.exists():
            review = Review.objects.create(
                contentOwnerID=request.user,
                content_type=ContentType.objects.get_for_model(MOA),
                source_id=moa.moaID,
                reviewedByID=reviewer_users.first(),  # Assigning the first director found
                reviewStatus='pending',
                comment="MOA has been edited and is pending approval."
            )

        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_document_pdf(request):
    serializer = DocumentPDFSerializer(data=request.data)
    if serializer.is_valid():
        document = serializer.save()

        # Determine the message and target user based on content type
        content_type = serializer.validated_data['content_type']
        source_id = serializer.validated_data['source_id']

        if content_type.model == 'project':
            # Retrieve the related Project instance
            try:
                project = Project.objects.get(pk=source_id)
                target_user = project.userID  # The user associated with the Project
                message = "Project is approved/complete signatures, prepare and submit MOA."
            except Project.DoesNotExist:
                return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
        
        elif content_type.model == 'moa':
            # Retrieve the related MOA instance
            try:
                moa = MOA.objects.get(pk=source_id)
                target_user = moa.userID  # The user associated with the MOA
                message = "MOA is approved, you can now start the project."
            except MOA.DoesNotExist:
                return Response({"error": "MOA not found"}, status=status.HTTP_404_NOT_FOUND)
        
        else:
            return Response({"error": "Invalid content type"}, status=status.HTTP_400_BAD_REQUEST)

       # Create a notification for the target user
        Notification.objects.create(
            user=target_user,
            message=message,
            timestamp=document.timestamp
        )

        return Response({"message": message}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['PATCH'])
# @permission_classes([IsAuthenticated])
# def update_signatory_status(request, signatory_id):
#     try:
#         # Fetch the Signatories instance by ID
#         signatory = Signatories.objects.get(pk=signatory_id)
#     except Signatories.DoesNotExist:
#         return Response({"error": "Signatory not found."}, status=status.HTTP_404_NOT_FOUND)

#     # Get the new approval status from the request data
#     new_status = request.data.get('approvalStatus')

#     if new_status not in dict(Signatories.APPROVAL_CHOICES).keys():
#         return Response({"error": "Invalid approval status."}, status=status.HTTP_400_BAD_REQUEST)

#     # Update the approval status
#     signatory.approvalStatus = new_status
    
#     # If the new status is approved, generate the signature code
#     if new_status == 'approved':
#         signatory.signatureCode = signatory.generate_signature_code()

#     # Save the updated signatory instance
#     signatory.save()

#     return Response({"message": "Approval status updated successfully.", "signatureCode": signatory.signatureCode}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_users_exclude_roles(request):
    # Filter users excluding those with role code "ecrd" or "estf"
    users = CustomUser.objects.exclude(role__code__in=["ecrd", "estf", "vpala"]).distinct()
    serializer = GetProponentsSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_agencies(request):
    agency = PartnerAgency.objects.all()

    agency_serializer = PartnerAgencySerializer(agency, many=True)

    return Response(agency_serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_agency(request):
    agency_serializer = PartnerAgencySerializer(data=request.data)

    if agency_serializer.is_valid():
        agency_serializer.save()
        return Response(agency_serializer.data, status=status.HTTP_201_CREATED)

    return Response(agency_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_regions(request):
    # Query all regions
    regions = Region.objects.all()

    # Serialize the regions
    region_serializer = RegionSerializer(regions, many=True)

    return Response(region_serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_provinces(request, regionID):
    
    try:
        region = Region.objects.get(pk=regionID)
    except Region.DoesNotExist:
        return Response({"detail": "Region not found."}, status=status.HTTP_404_NOT_FOUND)
    
    provinces = Province.objects.filter(regionID=region)

    provinces_serializer = GetProvinceSerializer(provinces, many=True)

    return Response(provinces_serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_cities(request, provinceID):

    try:
        province = Province.objects.get(pk=provinceID)
    except Province.DoesNotExist:
        return Response({"detail": "Province not found."}, status=status.HTTP_404_NOT_FOUND)

    cities = City.objects.filter(provinceID=province)

    cities_serializer = GetCitySerializer(cities, many=True)

    return Response(cities_serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_barangays(request, cityID):

    try:
        city = City.objects.get(pk=cityID)
    except City.DoesNotExist:
        return Response({"detail": "City not found."}, status=status.HTTP_404_NOT_FOUND)

    barangays = Barangay.objects.filter(cityID=city)

    barangays_serializer = GetBarangaySerializer(barangays, many=True)

    return Response(barangays_serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_programCategory(request):
    programCategory = ProgramCategory.objects.all()
    serializer = ProgramCategorySerializer(programCategory, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_projectCategory(request):
    projectCategory = ProjectCategory.objects.all()
    serializer = ProjectCategorySerializer(projectCategory, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_colleges(request):
    # Query all regions
    colleges = College.objects.all()

    # Serialize the regions
    college_serializer = CollegeSerializer(colleges, many=True)

    return Response(college_serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def get_programs(request):
    """
    Fetch programs for multiple colleges.
    Expects a POST request with a JSON body containing 'collegeIDs': [list of college IDs].
    """
    college_ids = request.data.get('collegeIDs', [])
    
    if not isinstance(college_ids, list) or not all(isinstance(id, int) for id in college_ids):
        return Response(
            {"detail": "Invalid input. 'collegeIDs' should be a list of integers."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Retrieve programs for the given colleges
    programs = Program.objects.filter(collegeID__in=college_ids)
    programs_serializer = ProgramSerializer(programs, many=True)

    return Response(programs_serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_project_status(request, pk):
    # Get all projects for the user with userID equal to pk
    projects = Project.objects.filter(userID=pk)

    # Serialize the project data
    serializer = GetProjectStatusSerializer(projects, many=True)

    # Return the serialized data as a JSON response
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_moa_status(request, pk):
    # Get all projects for the user with userID equal to pk
    moa = MOA.objects.filter(userID=pk)

    # Serialize the project data
    serializer = GetMoaSerializer(moa, many=True)

    # Return the serialized data as a JSON response
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_specific_moa(request, pk): 
    user = request.user  # Get the authenticated user

    # Try to fetch the project by its ID
    try:
        moa = MOA.objects.get(pk=pk)  # Use pk to fetch the project directly
    except MOA.DoesNotExist:
        return Response({"detail": "MOA not found."}, status=status.HTTP_404_NOT_FOUND)

    moa_serializer = GetSpecificMoaSerializer(instance=moa)
    return Response(moa_serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_review(request):
    user = request.user
    user_roles = user.role.all().values_list('code', flat=True)

    # Initialize an empty Q object for OR conditions
    review_conditions = Q()

    # Add condition for fully approved reviews (counter = 3)
    review_conditions |= Q(approvalCounter=3, reviewStatus='approved')

    # Add conditions based on user roles
    for role in user_roles:
        if role == 'prch':
            # PRCH sees reviews with counter = 0
            review_conditions |= Q(approvalCounter=0, reviewStatus='pending')
        elif role == 'cldn':
            # CLDN sees reviews with counter = 1
            review_conditions |= Q(approvalCounter=1, reviewStatus='pending')
        elif role == 'ecrd':
            # ECRD sees reviews with counter = 2
            review_conditions |= Q(approvalCounter=2, reviewStatus='pending')

        # All roles see reviews where they are responsible and counter = 0
        review_conditions |= Q(reviewerResponsible=role, approvalCounter=0)

    # Get reviews based on the constructed conditions
    reviews = Review.objects.filter(review_conditions).order_by('-reviewDate')

    serializer = ProjectReviewSerializer(reviews, many=True)
    return Response({
        "reviews": serializer.data,
        "user_roles": list(user_roles),  # Include user roles for debugging
        "total_count": reviews.count()
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed for {}".format(request.user.email))