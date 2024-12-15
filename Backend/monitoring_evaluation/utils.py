from django.core.mail import send_mail

# Check if a user has any of the allowed roles.
def has_role(user, allowed_roles):
    return user.roles.filter(code__in=allowed_roles).exists()


def send_reminder_email(subject, message, recipient_list, sender_email):
    send_mail(
        subject,
        message,
        sender_email,  # Dynamic sender email (logged-in user)
        recipient_list,
        fail_silently=False,
    )

