import json
from watson_developer_cloud import NaturalLanguageUnderstandingV1
from watson_developer_cloud.natural_language_understanding_v1 \
import Features, EntitiesOptions, KeywordsOptions
import operator
import  pymongo

# natural_language_understanding = NaturalLanguageUnderstandingV1(
#   version='2017-02-27',
#     iam_apikey='gWio-Ss_0qCLMDKg8-FcuaEdkTIazavGW7sREyFCeZcM',
#     url='https://gateway-lon.watsonplatform.net/natural-language-understanding/api')
# response = natural_language_understanding.analyze(
#       text="Undoubtedly this place is the best in town for pan Asian food. There is no place in Bangalore which can beat their dumplings. This place is my all time favourite. They have got simple and decent ambience but their food is extravagant. We ordered soup, veg crystal dumplings, cheung fun ( a must try. Absolutely loved it), fried rice, chocolate pebble, macaroons. Desserts are exceptionally good here.. Especially their signature chocolate pebble will keep you drooling",
#       features=Features(
#                 keywords=KeywordsOptions(
#                   sentiment=True,
#                   emotion=True,
#                   ))).get_result()
# print(response)

myclient = pymongo.MongoClient("mongodb://localhost:27017")
print(myclient)
mydb = myclient["Cognalyst"]
print(mydb)
reviews_collection = mydb.reviews
keywords_collection = mydb.keywords
hypo_collection = mydb.hypo

all = reviews_collection.find({"b_name":"Om Made Cafe"})
for row in all:
  score = row['rating']
  id = row['_id']
  predicted = (((score + 0.15))*5)/((0.75+0.15))
  print(score,predicted)
  reviews_collection.update_many({"_id":id,"b_name":"Om Made Cafe",},{"$set": {"predicted_rating":predicted}})
