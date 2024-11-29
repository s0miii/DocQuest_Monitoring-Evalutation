

# Check if a user has any of the allowed roles.
def has_role(user, allowed_roles):
    return user.roles.filter(code__in=allowed_roles).exists()
