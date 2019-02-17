#app.py
import http.client, urllib.request, urllib.parse, urllib.error, json
from os.path import isfile
from flask import Flask, request, jsonify #import main Flask class and request object
from flask_cors import CORS
from send_message import send_message

app = Flask(__name__) #create the Flask app
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['SESSION_TYPE'] = 'filesystem'
CORS(app)
DATA_FILENAME = "data_sentiment.json"
CONTACTS_FILENAME = "contacts.json"
def getSentiments(inputJson):
    headers = {
        # Request headers
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': '91744f48b62b4c4ea23e4102d0fc282b',
    }

    params = urllib.parse.urlencode({
    })

    try:
        conn = http.client.HTTPSConnection('westus.api.cognitive.microsoft.com')
        conn.request("POST", "/text/analytics/v2.0/sentiment?%s" % params, inputJson, headers)
        response = conn.getresponse()
        data = json.loads(response.read()) 
        conn.close()
        textScoreList = data["documents"]
        #addEmojis(textScoreList)
        return textScoreList
    except Exception as e:
        print("[Errno {0}] {1}".format(e.errno, e.strerror))

def getEmoji(score):
    emoji = "invalid"
    scoreBounds = {0.2: 'extreme-sad.png', 0.4: 'normal-sad.png', 0.6: 'neutral-face.png', 0.8: "normal-happy.png", 1: "extreme-happy.png"}
    for scoreIdx in sorted(scoreBounds.keys()):
        if(score <= scoreIdx):
            emoji = scoreBounds[scoreIdx]
            break
    return emoji

def addEmojis(textScoreList):
    for dictObj in textScoreList:
        dictObj['emoji'] = getEmoji(dictObj['score'])

def addToList(textScoreList):
	print(textScoreList)
	with open(DATA_FILENAME, mode='a', encoding='utf-8') as dataFile:
		for textScore in textScoreList:
			dataFile.write(str(textScore['score']) + "\n")

@app.route('/alert_contacts', methods=['GET'])
def alert_contacts():
	if request.method == 'GET':
		requestedName = request.args.get('name')
		with open(CONTACTS_FILENAME, mode='r', encoding='utf-8') as contactsFile:
			contacts = contactsFile.read().split('\n')
			for contact in contacts:
				name, contact_1, contact_2 = contact.split()
				if(name == requestedName):
					send_message(name, contact_1)
					send_message(name, contact_2)
		return "Success!"

@app.route('/get_sentiment', methods=['GET', 'POST'])
def get_sentiment():
	if request.method == 'POST':
		req_data = request.get_json()
		response = getSentiments(json.dumps(req_data))
		addToList(response)
		return jsonify(response)
	elif request.method == 'GET':
		response = "invalid"
		with open(DATA_FILENAME, mode='r', encoding='utf-8') as dataFile:
			textScores = dataFile.read().split()
			textScores = [float(textScore) for textScore in textScores]
			response = jsonify(textScores)
		return response
if __name__ == '__main__':
   app.run(debug=True, port=5000)