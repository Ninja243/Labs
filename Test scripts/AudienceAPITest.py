# This file tests the API's protected endpoint
# Based on https://manage.auth0.com/dashboard/eu/mweya-labs/apis/5e0f33cea4414107f2bd7929/test

import http.client
import ast
import jwt
conn = http.client.HTTPSConnection("mweya-labs.eu.auth0.com")
client_id = "7GnUDOPZ1mUSsxq2OFKQph1tPD36di7B"
client_secret = "YZrlCgybQcvvpZjC5t2KmBtAdgO8EwfkzvCn1DbKte_UPhzgcDsq9y7tTJiiX58y"
audience = "LabsGolangAPI"
grant_type = "client_credentials"
response_type = "code"
nonce = "nonce"
redirect_uri = "https://auth.expo.io/@mweya/labsclient"
connection = "google-oauth2"
scope = "openid profile email"

print("1. Get Token (POST)\n")

payload = "{\"client_id\":\"" + client_id + "\", \"client_secret\":\"" + \
    client_secret + "\", \"audience\":\""+audience + \
    "\", \"grant_type\":\""+grant_type+"\", \"scope\":\""+scope+"\"}"
headers = {'content-type': "application/json"}
print("Request:\n\tHeader\n"+str(headers)+"\n\tPayload\n"+payload)
conn.request("POST", "/oauth/token", payload, headers)

#print("1. Get Token (GET)")

#url = "/authorize?client_id=" + client_id  + "&audience=" + audience +  "&response_type="+response_type + "&nonce="+nonce + "&redirect_uri="+redirect_uri+"&connection="+connection
#conn.request("GET", url)

#print("Getting ->"+"https://mweya-labs.eu.auth0.com"+url)

res = conn.getresponse()
data = res.read()
print("\n\tResponse:\n" + data.decode("utf-8") + "\n\n")
#decoded = jwt.decode(data.decode("utf-8"), client_secret, algorithms=['RS256'])
# print("\n\tDecoded:\n"+decoded)

#print("2. Test Token\n")

#conn = http.client.HTTPSConnection("mweya-labs.eu.auth0.com")
#data = ast.literal_eval(data.decode("utf-8"))
#headers = {"authorization": data["token_type"]+" "+data["access_token"]}

#conn.request("GET", "/userInfo", headers=headers)

#res = conn.getresponse()
#data = res.read()

#print("Result: "+data.decode("utf-8"))


print("2. Test Token\n")

conn = http.client.HTTPSConnection("mweya-labs.eu.auth0.com")
data = ast.literal_eval(data.decode("utf-8"))
headers = {"authorization": data["token_type"]+" "+data["access_token"], "content-type":"application/json"}

conn.request("GET", "/userinfo", headers=headers)

res = conn.getresponse()
data = res.read()

print("Result: "+data.decode("utf-8"))
