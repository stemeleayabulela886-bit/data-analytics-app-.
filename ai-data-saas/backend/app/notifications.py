from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_welcome_email(user_email):
    message = Mail(
        from_email='noreply@your-saas-app.com',
        to_emails=user_email,
        subject='Your Analysis is Ready!',
        plain_text_content='Log in to your dashboard to see your new predictions.'
    )
    sg = SendGridAPIClient('YOUR_SENDGRID_API_KEY')
    sg.send(message)