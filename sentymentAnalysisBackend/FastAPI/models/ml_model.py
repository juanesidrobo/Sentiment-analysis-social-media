import numpy as np
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from scipy.special import softmax

class SentimentModel:
    def __init__(self):
        # Initialize VADER analyzer
        self.vader = SentimentIntensityAnalyzer()
        
        # Initialize RoBERTa model
        self.MODEL = "cardiffnlp/twitter-roberta-base-sentiment"
        self.tokenizer = AutoTokenizer.from_pretrained(self.MODEL)
        self.roberta_model = AutoModelForSequenceClassification.from_pretrained(self.MODEL)
        
    def polarity_scores_roberta(self, text):
        """Get RoBERTa sentiment scores for the given text"""
        encoded_text = self.tokenizer(text, return_tensors='pt')
        output = self.roberta_model(**encoded_text)
        scores = output[0][0].detach().numpy()
        scores = softmax(scores)
        scores_dict = {
            'roberta_neg': scores[0],
            'roberta_neu': scores[1],
            'roberta_pos': scores[2]
        }
        return scores_dict

    def extract_features(self, text):
        """Extract features from both VADER and RoBERTa"""
        # VADER features
        vader_scores = self.vader.polarity_scores(text)
        
        # RoBERTa features
        roberta_scores = self.polarity_scores_roberta(text)
        
        # Combine features
        features = {
            'vader_neg': vader_scores['neg'],
            'vader_neu': vader_scores['neu'],
            'vader_pos': vader_scores['pos'],
            'vader_compound': vader_scores['compound'],
            'roberta_neg': roberta_scores['roberta_neg'],
            'roberta_neu': roberta_scores['roberta_neu'],
            'roberta_pos': roberta_scores['roberta_pos']
        }
        
        return features

    def predict(self, text):
        """Predict sentiment using combined VADER and RoBERTa scores"""
        features = self.extract_features(text)
        roberta_scores = self.polarity_scores_roberta(text)
        vader_scores = self.vader.polarity_scores(text)
        
        # Determine sentiment based on RoBERTa scores (most confident prediction)
        roberta_prediction = np.argmax([roberta_scores['roberta_neg'], 
                                      roberta_scores['roberta_neu'], 
                                      roberta_scores['roberta_pos']])
        
        # Map prediction to sentiment label
        if roberta_prediction == 2:  # Positive
            sentiment = "positive"
        elif roberta_prediction == 0:  # Negative
            sentiment = "negative"
        else:  # Neutral
            sentiment = "neutral"
        
        # Calculate confidence based on the highest RoBERTa score
        roberta_confidence = np.max([roberta_scores['roberta_neg'], 
                                   roberta_scores['roberta_neu'], 
                                   roberta_scores['roberta_pos']])
        
        # Calculate subjectivity (approximation using score variance)
        score_variance = np.var([roberta_scores['roberta_neg'], 
                               roberta_scores['roberta_neu'], 
                               roberta_scores['roberta_pos']])
        subjectivity = min(1.0, score_variance * 3)  # Scale to 0-1 range
        
        return {
            "sentiment": sentiment,
            "polarity": float(vader_scores['compound']),  # Keep VADER compound for polarity
            "subjectivity": float(subjectivity),
            "confidence": self._get_confidence_level(roberta_confidence),
            "roberta_scores": roberta_scores,
            "vader_scores": vader_scores
        }
    
    def _get_confidence_level(self, confidence):
        """Convert numerical confidence to categorical level"""
        if confidence > 0.8:
            return "high"
        elif confidence > 0.6:
            return "medium"
        else:
            return "low"
