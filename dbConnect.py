from pymongo import MongoClient

def dbConnect():
    client = MongoClient('mongodb://gse_chatbot:appDWr!te0!321@mgdb-dgodev-npd1-1.cisco.com:27060,mgdb-dgodev-npd2-1.cisco.com:27060,mgdb-dgodev-npd3-1.cisco.com:27060/chatbot_db?replicaSet=dgodevnpdrs',ssl=True)
    db=client.chatbot_db
    return db


