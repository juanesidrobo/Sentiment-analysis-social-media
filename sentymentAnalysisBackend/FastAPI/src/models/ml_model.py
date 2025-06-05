from typing import Dict
import logging
from transformers import pipeline

logger = logging.getLogger(__name__)

class SentimentModel:
    _instance = None
    _model = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SentimentModel, cls).__new__(cls)
            cls._instance._initialize_model()
        return cls._instance
    
    def _initialize_model(self):
        """Inicializar el modelo de sentiment analysis"""
        try:
            self._model = pipeline(
                "sentiment-analysis",
                model="cardiffnlp/twitter-roberta-base-sentiment-latest",
                return_all_scores=True
            )
            logger.info("Modelo de sentiment analysis cargado exitosamente")
        except Exception as e:
            logger.error(f"Error cargando el modelo: {e}")
            self._model = None
    
    def predict(self, text: str) -> Dict:
        """Predecir sentimiento del texto"""
        if self._model is None:
            return {
                "sentiment": "neutral",
                "confidence": 0.5,
                "error": "Modelo no disponible"
            }
        
        try:
            results = self._model(text)
            
            # Mapear labels del modelo
            sentiment_map = {
                "LABEL_0": "negative",
                "LABEL_1": "neutral", 
                "LABEL_2": "positive"
            }
            
            # Obtener mejor resultado
            best_result = max(results[0], key=lambda x: x['score'])
            sentiment = sentiment_map.get(best_result['label'], best_result['label'].lower())
            confidence = best_result['score']
            
            return {
                "sentiment": sentiment,
                "confidence": round(confidence, 3),
                "method": "ml"
            }
        except Exception as e:
            logger.error(f"Error en predicción: {e}")
            return {
                "sentiment": "neutral",
                "confidence": 0.5,
                "error": str(e)
            }
    
    @property
    def is_available(self) -> bool:
        """Verificar si el modelo está disponible"""
        return self._model is not None