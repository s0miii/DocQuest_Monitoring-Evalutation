from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.db import transaction

from .forms import *
from .models import *

# class CustomUserAdmin(UserAdmin):
#     add_form = CustomUserCreationForm
#     form = CustomUserChangeForm
#     model = CustomUser
#     list_display = ("email", "is_staff", "is_active",)
#     list_filter = ("email", "is_staff", "is_active",)
#     fieldsets = (
#         (None, {"fields": ("email", "password")}),
#         ("Permissions", {"fields": ("is_staff", "is_active", "groups", "user_permissions")}),
#     )
#     add_fieldsets = (
#         (None, {
#             "classes": ("wide",),
#             "fields": (
#                 "email", "password1", "password2", "is_staff",
#                 "is_active", "groups", "user_permissions"
#             )}
#         ),
#     )
#     search_fields = ("email",)
#     ordering = ("email",)

class CustomUserAdmin(admin.ModelAdmin):
    form = CustomUserForm
    
    list_display = ["userID", "email", "firstname", "lastname", "display_roles", "display_college", "display_program"]
    list_filter = ["role", "faculty__collegeID", "faculty__programID"]
    search_fields = ["email", "firstname", "lastname", "faculty__collegeID__title", "faculty__programID__title"]
    
    fieldsets = (
        (None, {
            'fields': ('email', 'password')
        }),
        ('Personal Information', {
            'fields': ('firstname', 'middlename', 'lastname', 'contactNumber')
        }),
        ('Roles and Assignments', {
            'fields': ('role', 'campus', 'college', 'program')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser'),
        }),
    )

    def save_model(self, request, obj, form, change):
        with transaction.atomic():
            # Hash password if it's new or changed
            if obj.pk is None or 'password' in form.changed_data:
                obj.set_password(obj.password)
            
            # Save the user first
            super().save_model(request, obj, form, change)
            
            # Handle faculty information
            college = form.cleaned_data.get('college')
            program = form.cleaned_data.get('program')
            
            if college or program:
                faculty, created = Faculty.objects.update_or_create(
                    userID=obj,
                    defaults={
                        'collegeID': college,
                        'programID': program
                    }
                )
            elif not (college or program):
                # Remove faculty record if no college/program is specified
                Faculty.objects.filter(userID=obj).delete()

    def display_roles(self, obj):
        return ", ".join([role.role for role in obj.role.all()])
    display_roles.short_description = 'Roles'

    def display_college(self, obj):
        try:
            faculty = obj.faculty_set.first()
            return faculty.collegeID.title if faculty and faculty.collegeID else '-'
        except:
            return '-'
    display_college.short_description = 'College'

    def display_program(self, obj):
        try:
            faculty = obj.faculty_set.first()
            return faculty.programID.title if faculty and faculty.programID else '-'
        except:
            return '-'
    display_program.short_description = 'Program'

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('role', 'faculty_set__collegeID', 'faculty_set__programID')

class FacultyAdmin(admin.ModelAdmin):
    list_display = ['facultyID', 'userID', 'collegeID', 'programID']
    list_select_related = ['userID', 'collegeID', 'programID']
    search_fields = ['userID__email', 'userID__firstname', 'userID__lastname']
    autocomplete_fields = ['userID', 'collegeID', 'programID']

class RolesAdmin(admin.ModelAdmin):
    form = RoleCreationForm

    fields = ["role", "code"]
    list_display = ["roleID", "role", "code"]

# class SignatoriesAdmin(admin.ModelAdmin):
#     fields = ["project", "userID", "signatureCode", "approvalStatus"]
#     list_display = ["project", "userID", "signatureCode", "approvalStatus"]

class RegionAdmin(admin.ModelAdmin):
    fields = ["region"]
    list_display = ["regionID", "region"]

class ProvinceAdmin(admin.ModelAdmin):
    fields = ["province", "regionID"]
    list_display = ["provinceID", "province", "regionID"]

class CityAdmin(admin.ModelAdmin):
    fields = ["city", "postalCode", "provinceID"]
    list_display = ["cityID", "city", "postalCode", "provinceID"]

class BarangayAdmin(admin.ModelAdmin):
    fields = ["barangay", "cityID"]
    list_display = ["barangayID", "barangay", "cityID"]

class AddressAdmin(admin.ModelAdmin):
    fields = ["street", "barangayID"]
    list_display = ["addressID", "street", "barangayID"]

class PartnerAgencyAdmin(admin.ModelAdmin):
    fields = ["agencyName", "addressID"]
    list_display = ["agencyID", "agencyName", "addressID"]

class ProgramCategoryAdmin(admin.ModelAdmin):
    fields = ["title"]
    list_display = ["programCategoryID", "title"]

class ProjectCategoryAdmin(admin.ModelAdmin):
    fields = ["title"]
    list_display = ["projectCategoryID", "title"]

class CampusAdmin(admin.ModelAdmin):
    fields = ["name"]
    list_display = ["campusID", "name"]

class CollegeAdmin(admin.ModelAdmin):
    fields = ["abbreviation", "title", "collegeDean", "campusID"]
    list_display = ["collegeID", "abbreviation", "title"]

class ProgramAdmin(admin.ModelAdmin):
    fields = ["abbreviation", "title", "programChair", "collegeID"]
    list_display = ["programID", "abbreviation", "title", "collegeID"]

class DeliverablesAdmin(admin.ModelAdmin):
    fields = ["deliverableName"]
    list_display = ["deliverableID", "deliverableName"]

# admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Roles, RolesAdmin)
admin.site.register(Region, RegionAdmin)
admin.site.register(Province, ProvinceAdmin)
admin.site.register(City, CityAdmin)
admin.site.register(Barangay, BarangayAdmin)
admin.site.register(Address, AddressAdmin)
admin.site.register(PartnerAgency, PartnerAgencyAdmin)
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(ProgramCategory, ProgramCategoryAdmin)
admin.site.register(ProjectCategory, ProjectCategoryAdmin)
admin.site.register(Campus, CampusAdmin)
admin.site.register(College, CollegeAdmin)
admin.site.register(Program, ProgramAdmin)
admin.site.register(Deliverables, DeliverablesAdmin)
# admin.site.register(Signatories, SignatoriesAdmin)