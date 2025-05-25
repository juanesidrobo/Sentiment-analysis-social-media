# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from fastapi.middleware.cors import CORSMiddleware
# from sqlalchemy import create_engine, Column, Integer, String
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker

# # Setup básico de la base de datos
# DATABASE_URL = "sqlite:///./users.db"
# engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
# Base = declarative_base()
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],  # origen del frontend
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Modelo de usuario
# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True)
#     username = Column(String, unique=True, index=True)
#     password = Column(String)

# Base.metadata.create_all(bind=engine)

# # Modelos de Pydantic
# class LoginData(BaseModel):
#     username: str
#     password: str

# # Endpoint de login
# @app.post("/login")
# def login(data: LoginData):
#     db = SessionLocal()
#     user = db.query(User).filter(User.username == data.username).first()
#     if not user or user.password != data.password:
#         raise HTTPException(status_code=401, detail="Invalid credentials")
#     return {"message": "Login successful", "token": "fake-jwt-token"}

# # Endpoint de registro
# @app.post("/register")
# def register(data: LoginData):
#     db = SessionLocal()
#     user = db.query(User).filter(User.username == data.username).first()
#     if user:
#         raise HTTPException(status_code=400, detail="Username already exists")
    
#     new_user = User(username=data.username, password=data.password)
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)
#     return {"message": "User registered successfully"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from endpoints import auth
from core.settings import settings
from db.base import Base
from db.session import engine
from endpoints.sentimentAnalysis import router as sentiment_router

# Create tables in database
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api", tags=["auth"])

app.include_router(sentiment_router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    from models.ml_model import SentimentModel
    SentimentModel()  # Carga el modelo al iniciar