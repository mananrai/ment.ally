# Download the helper library from https://www.twilio.com/docs/python/install
from twilio.rest import Client

# Your Account Sid and Auth Token from twilio.com/console
account_sid = 'ACaf6a830e53da8afedce6ea78eec8ccd2'
auth_token = '263c9c80bfc9529ce440fa1c5862c598'
client = Client(account_sid, auth_token)
from_ = '+12065382930'

def send_message(name, contact):
	message = client.messages \
	                .create(
	                     body="{} has been feeling low for a while. You should check on him.".format(name),
	                     from_=from_,
	                     to=contact
	                 )
