import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import joblib
import nltk
import os

nltk.download('vader_lexicon')
os.makedirs("models", exist_ok=True)

# Datos de ejemplo (¡Reemplázalos con tu dataset!)
data = pd.DataFrame({
    'text': ["I love this!", "Hate it", "Awesome", "Terrible"],
    'sentiment': [1, 0, 1, 0]
})

# Procesamiento
vader = SentimentIntensityAnalyzer()
vectorizer = TfidfVectorizer(max_features=1000)
tfidf = vectorizer.fit_transform(data['text'])

features = []
for text in data['text']:
    vader_scores = vader.polarity_scores(text)
    tfidf_vec = vectorizer.transform([text]).toarray()[0]
    features.append(list(vader_scores.values()) + list(tfidf_vec))

# Entrenamiento
model = RandomForestClassifier()
model.fit(features, data['sentiment'])

# Guardado
joblib.dump(model, 'models/sentiment_model.pkl')
joblib.dump(vectorizer, 'models/tfidf_vectorizer.pkl')