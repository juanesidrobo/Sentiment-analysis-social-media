from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from models.ml_model import SentimentModel

router = APIRouter()

class TextInput(BaseModel):
    text: str
    method: Optional[str] = "auto"

class SentimentResponse(BaseModel):
    text: str
    sentiment: str
    confidence: float
    method: str

# Inicializar modelo
sentiment_model = SentimentModel()

# Análisis básico por palabras clave
def keyword_analysis(text: str) -> dict:
    positive_words = ["good", "great", "excellent", "amazing", "wonderful", "fantastic", 
                     "love", "like", "happy", "best", "awesome", "perfect"]
    negative_words = ["bad", "terrible", "awful", "hate", "worst", "horrible", 
                     "sad", "angry", "disappointed", "disgusting"]
    
    text_lower = text.lower()
    pos_count = sum(1 for word in positive_words if word in text_lower)
    neg_count = sum(1 for word in negative_words if word in text_lower)
    
    if pos_count > neg_count:
        sentiment = "positive"
        confidence = min(0.6 + pos_count * 0.1, 0.9)
    elif neg_count > pos_count:
        sentiment = "negative"
        confidence = min(0.6 + neg_count * 0.1, 0.9)
    else:
        sentiment = "neutral"
        confidence = 0.5
    
    return {
        "sentiment": sentiment,
        "confidence": round(confidence, 3),
        "method": "keyword"
    }

@router.post("/sentiment/analyze", response_model=SentimentResponse)
async def analyze_sentiment(input_data: TextInput):
    """Analizar el sentimiento de un texto"""
    try:
        if not input_data.text.strip():
            raise HTTPException(status_code=400, detail="El texto no puede estar vacío")
        
        # Determinar método de análisis
        if input_data.method == "keyword":
            result = keyword_analysis(input_data.text)
        elif input_data.method == "ml" and sentiment_model.is_available:
            result = sentiment_model.predict(input_data.text)
        elif input_data.method == "auto":
            if sentiment_model.is_available:
                result = sentiment_model.predict(input_data.text)
            else:
                result = keyword_analysis(input_data.text)
        else:
            result = keyword_analysis(input_data.text)
        
        return SentimentResponse(
            text=input_data.text,
            sentiment=result["sentiment"],
            confidence=result["confidence"],
            method=result["method"]
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

@router.get("/sentiment/health")
async def sentiment_health():
    """Verificar estado del servicio de sentiment analysis"""
    return {
        "status": "healthy",
        "ml_model_available": sentiment_model.is_available,
        "methods": ["keyword", "ml", "auto"]
    }