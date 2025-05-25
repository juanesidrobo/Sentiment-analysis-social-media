from fastapi import APIRouter, HTTPException
from models.ml_model import SentimentModel
from models.ml_schema import SentimentRequest, SentimentResponse

router = APIRouter()
model = SentimentModel()

@router.post("/sentimentAnaylisis/", response_model=SentimentResponse)
async def analyze_sentiment(request: SentimentRequest):
    try:
        analysis = model.predict(request.text)
        return {
            "text": request.text,
            "sentiment": analysis["sentiment"],
            "polarity": analysis["polarity"],
            "subjectivity": analysis["subjectivity"],
            "confidence": analysis["confidence"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))