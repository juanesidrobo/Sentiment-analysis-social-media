import unittest
from src.core.sentiment_analyzer import SentimentAnalyzer

class TestSentimentAnalyzer(unittest.TestCase):

    def setUp(self):
        self.analyzer = SentimentAnalyzer()

    def test_analyze_positive_sentiment(self):
        result = self.analyzer.analyze("I love this product!")
        self.assertEqual(result, "positive")

    def test_analyze_negative_sentiment(self):
        result = self.analyzer.analyze("I hate this service!")
        self.assertEqual(result, "negative")

    def test_analyze_neutral_sentiment(self):
        result = self.analyzer.analyze("This is okay.")
        self.assertEqual(result, "neutral")

if __name__ == '__main__':
    unittest.main()