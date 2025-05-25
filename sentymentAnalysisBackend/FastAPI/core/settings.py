from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Sentiment Analysis API"
    DATABASE_URL: str = "sqlite:///./users.db"
    CORS_ORIGINS: list = ["http://localhost:5173"]
    SECRET_KEY: str = "your-secret-key-for-jwt"  # Change this in production!
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30


settings = Settings()