import pymongo

myclient = pymongo.MongoClient("mongodb://https://b1236bc7.ngrok.io/")
print(myclient)

mydb = myclient["Cognalyst"]
print(mydb)

def insertdb(b_name):
    