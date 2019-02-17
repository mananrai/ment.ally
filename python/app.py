#app.py
import http.client, urllib.request, urllib.parse, urllib.error, json
from flask import Flask, request, jsonify #import main Flask class and request object
from flask_cors import CORS

app = Flask(__name__) #create the Flask app
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['SESSION_TYPE'] = 'filesystem'
CORS(app)

def getSentiments(inputJson):
	print("-" * 50)
	print(inputJson)
	print("-" * 50)
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
		print("-" * 50)
		print(data)
		print("-" * 50)
		textScoreList = data["documents"]
		print("-" * 50)
		print(textScoreList)
		print("-" * 50)
		addEmojis(textScoreList)
		return textScoreList
	except Exception as e:
		print("-" * 50)
		print("ERROR: {}".format(e))
		print("-" * 50)
		# print("[Errno {0}] {1}".format(e.errno, e.strerror))

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

@app.route('/get_sentiment', methods=['POST'])
def get_sentiment():
	# if request.method == 'POST':
	req_data = request.get_json()
	response = getSentiments(req_data)#getSentiments(json.dumps(req_data))
	print(req_data)
	return jsonify(response)

if __name__ == '__main__':
	app.run(debug=True, port=5000)

