# Download the helper library from https://www.twilio.com/docs/python/install
from twilio.rest import Client

# Your Account Sid and Auth Token from twilio.com/console
account_sid = 'ACe644f8328e0ae4ffcdae613ce2be14f0'
auth_token = '1a8bc584d9a6f708c0df200cf061a970'
client = Client(account_sid, auth_token)
from_ = '+13476503435'

def send_message(name, contact):
	message = client.messages \
	                .create(
	                     body="{} has been feeling low for a while. You should check on him.".format(name),
	                     from_=from_,
	                     to=contact
	                 )
