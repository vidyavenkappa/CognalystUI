from flask import Flask, send_from_directory, request, session, jsonify, make_response
from flask_cors import CORS
import requests
from datetime import datetime,timedelta
import pymongo 
import json
from bson import ObjectId
import nltk
from nltk.corpus import stopwords
from nltk.cluster.util import cosine_distance
import numpy as np
import networkx as nx
import dbConnect
from heapq import nlargest
from nltk.stem import WordNetLemmatizer
lemmatizer = WordNetLemmatizer()

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

myclient = pymongo.MongoClient("mongodb://localhost:27017")
print(myclient)
mydb = myclient["Cognalyst"]
print(mydb)
# mydb = dbConnect.dbConnect()
reviews_collection = mydb.reviews
keywords_collection = mydb.keywords
hypo_collection = mydb.hypo

import json
from watson_developer_cloud import NaturalLanguageUnderstandingV1
from watson_developer_cloud.natural_language_understanding_v1 \
import Features, EntitiesOptions, KeywordsOptions
import operator

natural_language_understanding = NaturalLanguageUnderstandingV1(
  version='2017-02-27',
    iam_apikey='gWio-Ss_0qCLMDKg8-FcuaEdkTIazavGW7sREyFCeZcM',
    url='https://gateway-lon.watsonplatform.net/natural-language-understanding/api')

app = Flask(__name__)
CORS(app)

@app.route('/addreview', methods=['POST'])
def add_review():
    b_name = json.loads(request.data)['b_name']
    review = json.loads(request.data)['review']
    user = json.loads(request.data)['user']
    user_rating = json.loads(request.data)['user_rating']
    time = datetime.now()

    document = {
                "b_name" : b_name,
                "review" : review,
                "user" : user,
                "created_at" : time,
                "rating" : 0,
                "manual_rating" : user_rating

            }
            
    reviews_collection.update_one({"b_name" : b_name,"review" : review,"user" : user,"created_at" : time},{"$set":document},upsert=True)
    review_doc_id = reviews_collection.find_one({"b_name" : b_name,
                "review" : review,
                "user" : user,
                "created_at" : time})["_id"]
    review_rating = 0
    count = 0
    predicted_rating = 0 

    for sub_line in review.split("."):
        print("subline:",sub_line,"len:",len(sub_line))
        if len(sub_line)>0:
            if len(sub_line)<=15:
                sub_line+=" is the thing i wanted to say."
            print(sub_line)
            response = natural_language_understanding.analyze(
            text=sub_line.lower(),
            features=Features(
                        keywords=KeywordsOptions(
                        sentiment=True,
                        emotion=True))).get_result()

    
    
            
            for i in response['keywords']:
                count+=1
                senti_score = i['sentiment']['score']
                relevancy_score = i['relevance']
                pos1 = i['emotion']['joy']
                neg1 = (i['emotion']['sadness'] + i['emotion']['fear'] + i['emotion']['fear'] + i['emotion']['disgust']) / 4
                # keyword_score = relevancy_score*((senti_score+(pos1-neg1))/2)
                keyword_score = relevancy_score*(senti_score)
                review_rating+= keyword_score
                time = datetime.now()
                kw_doc = {
                    "keyword" : i['text'],
                    "b_name" : b_name,
                    "score" : keyword_score,
                    "emotions" : i['emotion'],
                    "review_id" : review_doc_id,
                    "type" : i['sentiment']['label'],
                    "time" : time
                }
                keywords_collection.update_many({"b_name":b_name,"keyword" : i['text'],"time" : time}, {"$set":kw_doc} , upsert=True)
    print(count)
    if count>0:
        review_rating = review_rating/count

    x = hypo_collection.find_one({"b_name":b_name})
    A = x['min']
    B = x['max']
    if review_rating > B:
        hypo_collection.update_one({'b_name':b_name},{"$set": {"max": review_rating+0.1 }})
        B = review_rating+0.1
    if review_rating < A:
        hypo_collection.update_one({'b_name':b_name},{"$set": {"min": review-0.1 }})
        A = review_rating - 0.1
    predicted_rating = ((review_rating - A)*5)/(B-A)

    reviews_collection.update_one({"_id":review_doc_id},{"$set": {"rating":review_rating,"predicted_rating":predicted_rating}},upsert=True)
    return jsonify({"status":"success"})

@app.route('/getallreviews', methods=['POST'])
def get_all_reviews():
    b_name = json.loads(request.data)['b_name']
    all_reviews_docs = reviews_collection.find({"b_name":b_name})
    data = []
    for review in all_reviews_docs:
        review['_id'] = str(review['_id'])
        data.append(review)
    print(data)
    return jsonify({"status":"success","data":data})

@app.route('/gettopfivereviews', methods=['POST'])
def get_top_reviews():
    b_name = json.loads(request.data)['b_name']
    all_reviews_docs = reviews_collection.find({"b_name":b_name}).sort("rating",-1).limit(5)
    print(all_reviews_docs)
    data = []
    for review in all_reviews_docs:
        review['_id'] = str(review['_id'])
        data.append(review)
    print(data)

    return jsonify({"status":"success","data":data})
    

@app.route('/getbottomfivereviews', methods=['POST'])
def get_bottom_reviews():
    b_name = json.loads(request.data)['b_name']
    all_reviews_docs = reviews_collection.find({"b_name":b_name}).sort("rating",1).limit(5)
    print(all_reviews_docs)
    data = []
    for review in all_reviews_docs:
        review['_id'] = str(review['_id'])
        data.append(review)
    print(data)
    return jsonify({"status":"success","data":data})


@app.route('/getallpositive', methods=['POST'])
def get_all_positive():
    b_name = json.loads(request.data)['b_name']
    all_keys_docs = keywords_collection.find({"b_name":b_name,"type":"positive"}).sort("time",-1)
    print(all_keys_docs)
    data = []
    for keyword in all_keys_docs:
        keyword['_id'] = str(keyword['_id'])
        keyword['review_id'] = str(keyword['review_id'])
        
        data.append(keyword)
    print(data)

    return jsonify({"status":"success","data":data})

@app.route('/getallpositivewithscores', methods=['POST'])
def get_all_positive_with_scores():
    b_name = json.loads(request.data)['b_name']
    all_keys_docs = keywords_collection.find({"b_name":b_name,"type":"positive"}).sort("time",-1)
    print(all_keys_docs)
    keywords_with_scores={}
    for keyword in all_keys_docs:
        keyword['_id'] = str(keyword['_id'])
        keyword['review_id'] = str(keyword['review_id'])
        if(keyword["keyword"] in keywords_with_scores.keys()):
            keywords_with_scores[keyword["keyword"]].append(keyword["score"])
        else:
            keywords_with_scores[keyword["keyword"]]=[keyword["score"]]

    final_key_words={}
    for key,value in keywords_with_scores.items():
        final_key_words[key]=Average(value)
    print(final_key_words)
    final_key_words=sorted(final_key_words.items(), key = lambda x : x[1])
    print(final_key_words)
    #keywords_highest = nlargest(15, final_key_words, key = final_key_words.get)

    return jsonify({"status":"success","data":final_key_words})

def Average(lst):
    return sum(lst) / len(lst)

@app.route('/getallnegative', methods=['POST'])
def get_all_negative():
    b_name = json.loads(request.data)['b_name']
    all_keys_docs = keywords_collection.find({"b_name":b_name,"type":"negative"}).sort("time",-1)
    print(all_keys_docs)
    data = []
    for keyword in all_keys_docs:
        keyword['_id'] = str(keyword['_id'])
        keyword['review_id'] = str(keyword['review_id'])
        data.append(keyword)
    print(data)

    return jsonify({"status":"success","data":data})

@app.route('/gettenpositive', methods=['POST'])
def get_ten_positive():
    b_name = json.loads(request.data)['b_name']
    all_keys_docs = keywords_collection.find({"b_name":b_name,"type":"positive"}).sort("score",-1).limit(10)
    print(all_keys_docs)
    data = []
    for keyword in all_keys_docs:
        keyword['_id'] = str(keyword['_id'])
        keyword['review_id'] = str(keyword['review_id'])
        
        data.append(keyword)
    print(data)

    return jsonify({"status":"success","data":data})

@app.route('/gettennegative', methods=['POST'])
def get_ten_negative():
    b_name = json.loads(request.data)['b_name']
    all_keys_docs = keywords_collection.find({"b_name":b_name,"type":"negative"}).sort("score",1).limit(10)
    print(all_keys_docs)
    data = []
    for keyword in all_keys_docs:
        keyword['_id'] = str(keyword['_id'])
        keyword['review_id'] = str(keyword['review_id'])
        data.append(keyword)
    print(data)

    return jsonify({"status":"success","data":data})

@app.route('/getsummary', methods=['POST'])
def get_summary():
    data_reviews=[]
    stop_words = stopwords.words('english')
    b_name = json.loads(request.data)['b_name']
    all_reviews_docs = reviews_collection.find({"b_name":b_name})
    data = []
    for review in all_reviews_docs:
        review['_id'] = str(review['_id'])
        data.append(review)
    print(data)
    for data_review in data:
        data_reviews.append((data_review['review']).replace("[^a-zA-Z]", " ").split(" "))
    print(data_reviews)
    sentence_similarity_martix = build_similarity_matrix(data_reviews, stop_words)
    sentence_similarity_graph = nx.from_numpy_array(sentence_similarity_martix)
    scores = nx.pagerank(sentence_similarity_graph)
    ranked_sentence = sorted(((scores[i],s) for i,s in enumerate(data_reviews)), reverse=True)    
    print("Indexes of top ranked_sentence order are ", ranked_sentence) 
    top_n=3
    summarize_text = []   
    for i in range(top_n):
      summarize_text.append(" ".join(ranked_sentence[i][1]))
 
    # Step 5 - Offcourse, output the summarize texr
    print("Summarize Text: \n", ". ".join(summarize_text))
 
    return jsonify({"status":"success","data":". ".join(summarize_text)})
 
def build_similarity_matrix(sentences, stop_words):
    # Create an empty similarity matrix
    similarity_matrix = np.zeros((len(sentences), len(sentences)))
 
    for idx1 in range(len(sentences)):
        for idx2 in range(len(sentences)):
            if idx1 == idx2: #ignore if both are same sentences
                continue 
            similarity_matrix[idx1][idx2] = sentence_similarity(sentences[idx1], sentences[idx2], stop_words)
 
    return similarity_matrix
 
def sentence_similarity(sent1, sent2, stopwords=None):
    if stopwords is None:
        stopwords = []
 
    sent1 = [w.lower() for w in sent1]
    sent2 = [w.lower() for w in sent2]
 
    all_words = list(set(sent1 + sent2))
 
    vector1 = [0] * len(all_words)
    vector2 = [0] * len(all_words)
 
    # build the vector for the first sentence
    for w in sent1:
        if w in stopwords:
            continue
        vector1[all_words.index(w)] += 1
 
    # build the vector for the second sentence
    for w in sent2:
        if w in stopwords:
            continue
        vector2[all_words.index(w)] += 1
 
    return 1 - cosine_distance(vector1, vector2)
 
 
@app.route('/getrecentkeywords', methods=['POST']) #takes business name and since(number of seconds) and gives you the recent keywords
def get_recent():
    b_name = json.loads(request.data)['b_name']
    since = json.loads(request.data)['since']
    if since == "week":
        seconds = (604800/7) * 1
    elif since == "fortnight":
        seconds = (604800/7) * 2
    elif since == "month":
        seconds = (604800/7) * 3
    week_stamp = timedelta(seconds)
    x = datetime(2019,10,2) - datetime(1970,1,1)
    x_secs = x.total_seconds()
    print(x_secs)
    since_secs = x_secs - seconds
    print(since_secs)
    since_stamp =  datetime.fromtimestamp(int(since_secs))
    print(since_stamp)


    all_keys_docs = keywords_collection.find({"b_name":b_name,"time": { "$gt": since_stamp }}).sort("time",-1)
    print(all_keys_docs)
    data = []
    for keyword in all_keys_docs:
        print(keyword)
        keyword['_id'] = str(keyword['_id'])
        keyword['review_id'] = str(keyword['review_id'])
        data.append(keyword)
    print(data)

    return jsonify({"status":"success","data":data})

@app.route('/getrecentposkeywords', methods=['POST']) #takes business name and since(number of seconds) and gives you the recent keywords which are positive
def get_recent_pos():
    b_name = json.loads(request.data)['b_name']
    since = json.loads(request.data)['since']
    if since == "week":
        seconds = (604800/7) * 1
    elif since == "fortnight":
        seconds = (604800/7) * 2
    elif since == "month":
        seconds = (604800/7) * 3
    week_stamp = timedelta(seconds)
    x = datetime(2019,10,2) - datetime(1970,1,1)
    x_secs = x.total_seconds()
    print(x_secs)
    since_secs = x_secs - seconds
    print(since_secs)
    since_stamp =  datetime.fromtimestamp(int(since_secs))
    print(since_stamp)


    all_keys_docs = keywords_collection.find({"b_name":b_name,"type":"positive","time": { "$gt": since_stamp }}).sort("time",-1)
    print(all_keys_docs)
    data = []
    for keyword in all_keys_docs:
        print(keyword)
        keyword['_id'] = str(keyword['_id'])
        keyword['review_id'] = str(keyword['review_id'])
        data.append(keyword)
    print(data)

    return jsonify({"status":"success","data":data})


@app.route('/getrecentnegkeywords', methods=['POST']) #takes business name and since(number of seconds) and gives you the recent keywords which are postive
def get_recent_neg():
    b_name = json.loads(request.data)['b_name']
    since = json.loads(request.data)['since']
    if since == "week":
        seconds = (604800/7) * 1
    elif since == "fortnight":
        seconds = (604800/7) * 2
    elif since == "month":
        seconds = (604800/7) * 3
    week_stamp = timedelta(seconds)
    x = datetime(2019,10,2) - datetime(1970,1,1)
    x_secs = x.total_seconds()
    print(x_secs)
    since_secs = x_secs - seconds
    print(since_secs)
    since_stamp =  datetime.fromtimestamp(int(since_secs))
    print(since_stamp)


    all_keys_docs = keywords_collection.find({"b_name":b_name,"type":"negative","time": { "$gt": since_stamp }}).sort("time",1)
    print(all_keys_docs)
    data = []
    for keyword in all_keys_docs:
        print(keyword)
        keyword['_id'] = str(keyword['_id'])
        keyword['review_id'] = str(keyword['review_id'])
        data.append(keyword)
    print(data)

    return jsonify({"status":"success","data":data})

def common_member(a, b): 
    a_set = set(a) 
    b_set = set(b) 
    if (a_set & b_set): 
        return a_set & b_set
    else: 
        return "No common elements"


@app.route('/getnegativeintimeperiod', methods=['POST'])
def get_negative_in_time_period():

    b_name = json.loads(request.data)['b_name']
    initial_date_1=json.loads(request.data)['initial_date']
    final_date_1=json.loads(request.data)['final_date']
    final_date_1=format_dates(final_date_1)
    initial_date_1=format_dates(initial_date_1)
    final_date = datetime.strptime(final_date_1,"%a, %d %b %Y %X GMT")
    initial_date = datetime.strptime(initial_date_1,"%a, %d %b %Y %X GMT")

    all_reviews_docs = reviews_collection.find({"b_name":b_name,"created_at":{ "$lte":final_date, "$gte": initial_date}}).sort("rating",-1).limit(5)
    print(all_reviews_docs)
    data = []
    for review in all_reviews_docs:
        review['_id'] = str(review['_id'])
        data.append(review)
    print(data)

    return jsonify({"status":"success","data":data})


def format_dates(date):
    final_date = date.split('+')[0]
    new_date=final_date.split(' ')
    final_date=new_date[0]+", "+new_date[2]+" "+new_date[1]+" "+new_date[3]+" "+"00:00:00 GMT"
    return final_date

@app.route('/allratios', methods=['POST'])
def ranked_occurence():
  b_name =  json.loads(request.data)['b_name']
  all_keys_docs_positive = keywords_collection.find({"b_name":b_name,"type":"positive"}).sort("score",-1)
  scores= []
  keywords_positive = {}
  keywords_nouns_positive = {}
  for x in all_keys_docs_positive:
    keywords_positive[x['keyword']] = x['score']
    for word,pos in nltk.pos_tag(nltk.word_tokenize(x['keyword'])):
         if (pos == 'NN' or pos == 'NNP' or pos == 'NNS' or pos == 'NNPS'):
            word = lemmatizer.lemmatize(word)
            if word not in keywords_nouns_positive.keys():
              keywords_nouns_positive[word] = []
              keywords_nouns_positive[word].append(x['score'])
            else:
              keywords_nouns_positive[word].append(x['score'])
  
  all_keys_docs_negative = keywords_collection.find({"b_name":b_name,"type":"negative"}).sort("score",-1)
  scores= []
  keywords_negative = {}
  keywords_nouns_negative = {}
  for x in all_keys_docs_negative:
    keywords_negative[x['keyword']] = x['score']
    for word,pos in nltk.pos_tag(nltk.word_tokenize(x['keyword'])):
         if (pos == 'NN' or pos == 'NNP' or pos == 'NNS' or pos == 'NNPS'):
            word = lemmatizer.lemmatize(word)
            if word not in keywords_nouns_negative.keys():
              keywords_nouns_negative[word] = []
              keywords_nouns_negative[word].append(x['score'])
            else:
              keywords_nouns_negative[word].append(x['score'])  
  print(keywords_nouns_positive)  
  print(keywords_nouns_negative)

  common = common_member(list(keywords_nouns_negative.keys()) , list(keywords_nouns_positive.keys()))
  print(common)

  ratio_tuples = {}
  for i in keywords_nouns_positive.keys():
    if i not in ratio_tuples.keys():
      ratio_tuples[i] = [0,0]
    ratio_tuples[i][0] = len(keywords_nouns_positive[i])
  for i in keywords_nouns_negative.keys():
    if i not in ratio_tuples.keys():
      if i not in ratio_tuples.keys():
        ratio_tuples[i] = [0,0]
    ratio_tuples[i][1] = len(keywords_nouns_negative[i])
  
  percentage_tuples = {}
  for i in ratio_tuples.keys():
    pos = (ratio_tuples[i][0]/(ratio_tuples[i][0]+ratio_tuples[i][1]))*100
    neg = (ratio_tuples[i][1]/(ratio_tuples[i][0]+ratio_tuples[i][1]))*100
    percentage_tuples[i] = [pos,neg]
  
  print(percentage_tuples)
  data = percentage_tuples
  return jsonify({"status":"success","data":data})

@app.route('/allsortednouns', methods=['POST'])
def sorted_nouns():
  b_name =  json.loads(request.data)['b_name']
  all_keys_docs_positive = keywords_collection.find({"b_name":b_name,"type":"positive"}).sort("score",-1)
  scores= []
  keywords_positive = {}
  keywords_nouns_positive = {}
  keywords_nouns_positive_scores = {}
  keywords_nouns_negative_scores= {}
  for x in all_keys_docs_positive:
    keywords_positive[x['keyword']] = x['score']
    for word,pos in nltk.pos_tag(nltk.word_tokenize(x['keyword'])):
         if (pos == 'NN' or pos == 'NNP' or pos == 'NNS' or pos == 'NNPS'):
            word = lemmatizer.lemmatize(word)
            if word not in keywords_nouns_positive.keys():
              keywords_nouns_positive[word] = []
              keywords_nouns_positive[word].append(x['score'])
              keywords_nouns_positive_scores[word] = sum(keywords_nouns_positive[word])/len(keywords_nouns_positive[word])
            else:
              keywords_nouns_positive[word].append(x['score'])
              keywords_nouns_positive_scores[word] = sum(keywords_nouns_positive[word])/len(keywords_nouns_positive[word])
  
  all_keys_docs_negative = keywords_collection.find({"b_name":b_name,"type":"negative"}).sort("score",-1)
  scores= []
  keywords_negative = {}
  keywords_nouns_negative = {}
  for x in all_keys_docs_negative:
    keywords_negative[x['keyword']] = x['score']
    for word,pos in nltk.pos_tag(nltk.word_tokenize(x['keyword'])):
         if (pos == 'NN' or pos == 'NNP' or pos == 'NNS' or pos == 'NNPS'):
            word = lemmatizer.lemmatize(word)
            if word not in keywords_nouns_negative.keys():
              keywords_nouns_negative[word] = []
              keywords_nouns_negative[word].append(x['score'])
              keywords_nouns_negative_scores[word] = sum(keywords_nouns_negative[word])/len(keywords_nouns_negative[word])
            else:
              keywords_nouns_negative[word].append(x['score'])  
              keywords_nouns_negative_scores[word] = sum(keywords_nouns_negative[word])/len(keywords_nouns_negative[word])
  print(keywords_nouns_positive_scores) 
  print(keywords_nouns_negative_scores)

  common = common_member(list(keywords_nouns_negative.keys()) , list(keywords_nouns_positive.keys()))
  print(common)

  sorted_pos = sorted(keywords_nouns_positive_scores.items(), key=operator.itemgetter(1))
  sorted_neg = sorted(keywords_nouns_negative_scores.items(), key=operator.itemgetter(1))
  
  data={"pos":sorted_pos[::-1][0:10],"neg":sorted_neg[0:10]}

  return jsonify({"status":"success","data":data})


@app.route('/getallreviewssortedovertime', methods=['POST'])
def get_all_reviews_over_time():
    b_name = json.loads(request.data)['b_name']
    all_reviews_docs = reviews_collection.find({"b_name":b_name}).sort("created_at",-1)
    data = []
    for review in all_reviews_docs:
        review['_id'] = str(review['_id'])
        data.append(review)
    print(data)
    return jsonify({"status":"success","data":data})

@app.route('/getoverallsatisfaction', methods=['POST'])
def get_satisfaction():
    b_name = json.loads(request.data)['b_name']
    neg_count= keywords_collection.find({"b_name":b_name,"type":"negative"}).count()
    pos_count= keywords_collection.find({"b_name":b_name,"type":"positive"}).count()
    if (pos_count+neg_count)!=0:
        data = (pos_count/(pos_count+neg_count))*100
    else:
        data = 0
    print(data)

    return jsonify({"status":"success","satisfaction":data})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)

        








