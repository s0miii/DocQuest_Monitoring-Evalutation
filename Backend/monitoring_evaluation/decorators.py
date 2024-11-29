from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from docquestapp.models import CustomUser


def role_required(allowed_role_codes):
    def decorator(view):
        # Check if the view is a class (CBV)
        if hasattr(view, "dispatch"):
            original_dispatch = view.dispatch

            @wraps(original_dispatch)
            def new_dispatch(self, request, *args, **kwargs):
                # Authentication Logic
                auth = TokenAuthentication()
                try:
                    user_auth_tuple = auth.authenticate(request)
                except:
                    return Response(
                        {"error": "Authentication credentials were not provided."},
                        status=status.HTTP_401_UNAUTHORIZED,
                        content_type="application/json",
                    )

                if user_auth_tuple is None:
                    return Response(
                        {"error": "Authentication credentials were not provided."},
                        status=status.HTTP_401_UNAUTHORIZED,
                        content_type="application/json",
                    )

                user, token = user_auth_tuple
                try:
                    custom_user = CustomUser.objects.get(userID=user.userID)
                except CustomUser.DoesNotExist:
                    return Response(
                        {"error": "User not found."},
                        status=status.HTTP_404_NOT_FOUND,
                        content_type="application/json",
                    )

                if not custom_user.role.filter(code__in=allowed_role_codes).exists():
                    return Response(
                        {"error": "You do not have the required role to access this feature."},
                        status=status.HTTP_403_FORBIDDEN,
                        content_type="application/json",
                    )

                return original_dispatch(self, request, *args, **kwargs)

            view.dispatch = new_dispatch
            return view

        # If it's not a CBV, assume it's a FBV
        @wraps(view)
        def wrapped_view(request, *args, **kwargs):
            # Authentication Logic (same as above)
            auth = TokenAuthentication()
            try:
                user_auth_tuple = auth.authenticate(request)
            except:
                return Response(
                    {"error": "Authentication credentials were not provided."},
                    status=status.HTTP_401_UNAUTHORIZED,
                    content_type="application/json",
                )

            if user_auth_tuple is None:
                return Response(
                    {"error": "Authentication credentials were not provided."},
                    status=status.HTTP_401_UNAUTHORIZED,
                    content_type="application/json",
                )

            user, token = user_auth_tuple
            try:
                custom_user = CustomUser.objects.get(userID=user.userID)
            except CustomUser.DoesNotExist:
                return Response(
                    {"error": "User not found."},
                    status=status.HTTP_404_NOT_FOUND,
                    content_type="application/json",
                )

            if not custom_user.role.filter(code__in=allowed_role_codes).exists():
                return Response(
                    {"error": "You do not have the required role to access this feature."},
                    status=status.HTTP_403_FORBIDDEN,
                    content_type="application/json",
                )

            return view(request, *args, **kwargs)

        return wrapped_view

    return decorator
