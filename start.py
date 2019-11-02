import json
from watson_developer_cloud import NaturalLanguageUnderstandingV1
from watson_developer_cloud.natural_language_understanding_v1 \
import Features, EntitiesOptions, KeywordsOptions
import operator

natural_language_understanding = NaturalLanguageUnderstandingV1(
  version='2017-02-27',
    iam_apikey='gWio-Ss_0qCLMDKg8-FcuaEdkTIazavGW7sREyFCeZcM',
    url='https://gateway-lon.watsonplatform.net/natural-language-understanding/api')

#each review is rated
#positive has all the postive keywords with their scores
#negative has all the negative keywords with their scores

#our_rating = relevancy((senti_score+(joy-avg(neg_emotions)))/2)

f = open("./restaurant/om_make_cafe.txt",'r')
processed_reviews = []
final_pos = {}
final_neg = {}
final_neu = {}
reviews = []
text = ""
# print(f.readlines())
# print(f.readlines()[0])
x = f.readlines()
for i in range(0,len(x)):
  if (x[i] != "\n"):
    text+=x[i].strip("\n")
    # print(text)
  else:
    reviews.append(text)
    text = ""

# print(len(reviews))
# for i in reviews:
#   print("----------------------")
#   print(i)
# exit(0)

for review_text in reviews:
  review_final = {}
  positive = {}
  negative = {}
  neutral = {}
  rating_score = 0
  print(review_text)
  # print(review_text.split("."))
  # print(review_text)
  for sub_line in review_text.split("."):
    print("subline:",sub_line)
    if len(sub_line)>0:
      response = natural_language_understanding.analyze(
          text=sub_line.lower(),
          features=Features(
                    keywords=KeywordsOptions(
                      sentiment=True,
                      emotion=True,
                      limit=2))).get_result()
      
      for i in response['keywords']:

        senti_score = i['sentiment']['score']
        relevancy_score = i['relevance']
        pos1 = i['emotion']['joy']
        neg1 = (i['emotion']['sadness'] + i['emotion']['fear'] + i['emotion']['fear'] + i['emotion']['disgust']) / 4
        # keyword_score = relevancy_score*((senti_score+(pos1-neg1))/2)
        keyword_score = relevancy_score*(senti_score)

        if (i['sentiment']['label'] == "positive"): #can change "postive" with something related to keyword_score
          positive[i['text']] =  keyword_score
          final_pos[i['text']] =  keyword_score
        
        if (i['sentiment']['label'] == "negative"):
          negative[i['text']] =  keyword_score
          final_neg[i['text']] =  keyword_score
        
        if (i['sentiment']['label'] == "neutral"):
          neutral[i['text']] =  keyword_score
          final_neu[i['text']] =  keyword_score

  print("positive:",positive)
  print("------------------------------------")
  print("negative:",negative)
  print("------------------------------------")
  print("neutral:",neutral)
  print("------------------------------------")

  count = 0 
  for x in positive.keys():
    rating_score+=positive[x]
    count+=1
  for x in negative.keys():
    rating_score+=negative[x]
    count+=1
  for x in neutral.keys():
    rating_score+=neutral[x]
    count+=1
  
  if count>0 :
    rating_score = rating_score/count
  else:
    rating_score = 0

  review_final['text'] = review_text
  review_final['positive'] = positive
  review_final['negative'] = negative
  review_final['neutral'] = neutral
  review_final['rating'] = rating_score

  print("Processed Review:",review_final)
  print("--------------------------------------------------")
  processed_reviews.append(review_final)

final_pos_list = sorted(final_pos.items(), key=operator.itemgetter(1))[::-1]
final_neg_list = sorted(final_neg.items(), key=operator.itemgetter(1))
final_neu_list = sorted(final_neu.items(), key=operator.itemgetter(1))[::-1] 

print(processed_reviews)
print("----------------------POSITIVE SORTED---------------------------------")
print(final_pos_list)
print("----------------------NEGATIVE SORTED---------------------------------")
print(final_neg_list)
print("----------------------NEUTRAL SORTED---------------------------------")
print(final_neu_list)
print("\n")
top_five_reviews = sorted(processed_reviews, key = lambda i: i['rating'])[::-1][0:5]
print("----------------------TOP FIVE REVIEWS---------------------------------")
# print(top_five_reviews)
for review in top_five_reviews:
  print("text:",review['text'])
  print("rating:",review['rating'])
  print("-------------------------------------------------------")

bottom_five_reviews = sorted(processed_reviews, key = lambda i: i['rating'])[0:5]
print("----------------------TOP FIVE NEGATIVE REVIEWS---------------------------------")
# print(top_five_reviews)
for review in bottom_five_reviews:
  print("text:",review['text'])
  print("rating:",review['rating'])
  print("-------------------------------------------------------")


 

