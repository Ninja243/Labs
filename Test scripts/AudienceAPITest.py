# This file tests the API's protected endpoint
# Based on https://manage.auth0.com/dashboard/eu/mweya-labs/apis/5e0f33cea4414107f2bd7929/test

import http.client
import ast
conn = http.client.HTTPSConnection("mweya-labs.eu.auth0.com")
client_id = "7GnUDOPZ1mUSsxq2OFKQph1tPD36di7B"
client_secret = "YZrlCgybQcvvpZjC5t2KmBtAdgO8EwfkzvCn1DbKte_UPhzgcDsq9y7tTJiiX58y"
audience = "LabsGolangAPI"
grant_type = "client_credentials"

print("1. Get Token\n")

payload = "{\"client_id\":\"" + client_id +  "\", \"client_secret\":\"" + client_secret + "\", \"audience\":\""+audience+"\", \"grant_type\":\""+grant_type+"\"}"
headers = { 'content-type': "application/json" }
print("Request:\n\tHeader\n"+str(headers)+"\n\tPayload\n"+payload)
conn.request("POST", "/oauth/token", payload, headers)
res = conn.getresponse()
data = res.read()
print("\n\tResponse:\n"+data.decode("utf-8")+"\n\n")

print("2. Test Token\n")

conn = http.client.HTTPSConnection("jl.x-mweya.duckdns.org")
data = ast.literal_eval(data.decode("utf-8"))
headers = {"authorization":data["token_type"]+" "+data["access_token"]}

conn.request("GET", "/api/private", headers=headers)

res = conn.getresponse()
data = res.read()

print("Result: "+data.decode("utf-8"))
