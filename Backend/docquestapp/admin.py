from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import *
from .models import *

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ("email", "is_staff", "is_active",)
    list_filter = ("email", "is_staff", "is_active",)
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email", "password1", "password2", "is_staff",
                "is_active", "groups", "user_permissions"
            )}
        ),
    )
    search_fields = ("email",)
    ordering = ("email",)

class RolesAdmin(admin.ModelAdmin):
    form = RoleCreationForm

    fields = ["role", "code"]
    list_display = ["roleID", "role"]

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


# additions for trial
class ProjectAdmin(admin.ModelAdmin):
    fields = [
        'projectTitle', 'userID', 'programCategory', 'projectType', 'projectCategory',
        'researchTitle', 'program', 'accreditationLevel', 'college', 'projectLocationID',
        'agency', 'targetImplementation', 'totalHours', 'background', 'projectComponent',
        'beneficiaries', 'totalBudget', 'moaID'
    ]
    list_display = ['projectTitle', 'userID', 'programCategory', 'projectType', 'college']

class ProponentsAdmin(admin.ModelAdmin):
    list_display = ["project", "proponent"]  # Fields to display in the list view
    list_filter = ["project"]  # Filter by project to easily categorize
    search_fields = ["proponent", "project__projectTitle"]  # Search fields for ease of navigation

admin.site.register(Project, ProjectAdmin)
admin.site.register(MOA)
admin.site.register(Proponents, ProponentsAdmin)

#end of trial

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Roles, RolesAdmin)
admin.site.register(Region, RegionAdmin)
admin.site.register(Province, ProvinceAdmin)
admin.site.register(City, CityAdmin)
admin.site.register(Barangay, BarangayAdmin)
admin.site.register(Address, AddressAdmin)
admin.site.register(PartnerAgency, PartnerAgencyAdmin)