from django.contrib import admin
from django.urls import re_path, include, path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),

    # create role
    path('create_role', views.create_role),

    re_path('signup', views.signup),
    re_path('name_and_roles', views.name_and_roles),
    re_path('create_project', views.create_project),

    # edit user profile
    re_path('get_user_details', views.user_profile),
    path('edit_user_details/<int:pk>/', views.edit_profile),

    # create project
    path('create_project', views.create_project),

    re_path(r'^auth/', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.authtoken')),

    # get project
    path('get_project/<int:pk>/', views.get_project),
    path('get_project_status/<int:pk>/', views.get_project_status),

    # update signatory sa project
    # path('update_signatory_status/<int:signatory_id>/', views.update_signatory_status),

    #send notification
    path('send_notifications_to_director_and_staff', views.send_notifications_to_director_and_staff),

    #review post request
    path('create_review', views.create_review),

    #Director approve or deny project
    path('approve_or_deny_project/<int:review_id>/', views.approve_or_deny_project),

    #edit project
    path('edit_project/<int:project_id>/', views.edit_project),

    # get address
    path('get_regions', views.get_regions),
    path('get_provinces/<int:regionID>/', views.get_provinces),
    path('get_cities/<int:provinceID>/', views.get_cities),
    path('get_barangays/<int:cityID>/', views.get_barangays),

    re_path('test_token', views.test_token),
]

# /auth/users/ Register a new user

# log in
# /auth/token/login/

# access user’s details
# /auth/users/me/

# log out
# /auth/token/logout/