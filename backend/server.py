from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class NewsletterSubscriber(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: Optional[str] = None
    subscribed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NewsletterSubscribeRequest(BaseModel):
    email: EmailStr
    name: Optional[str] = None

class NewsletterResponse(BaseModel):
    success: bool
    message: str

class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    role: str
    content: str
    rating: int = 5

# Routes
@api_router.get("/")
async def root():
    return {"message": "AI-Powered Mind API"}

@api_router.post("/newsletter/subscribe", response_model=NewsletterResponse)
async def subscribe_newsletter(request: NewsletterSubscribeRequest):
    existing = await db.newsletter_subscribers.find_one({"email": request.email}, {"_id": 0})
    if existing:
        return NewsletterResponse(success=True, message="You're already subscribed!")
    
    subscriber = NewsletterSubscriber(email=request.email, name=request.name)
    doc = subscriber.model_dump()
    doc['subscribed_at'] = doc['subscribed_at'].isoformat()
    
    await db.newsletter_subscribers.insert_one(doc)
    return NewsletterResponse(success=True, message="Successfully subscribed!")

@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    return [
        Testimonial(id="1", name="Sarah Chen", role="Product Manager at Google", 
                   content="This book transformed how I approach complex problems.", rating=5),
        Testimonial(id="2", name="Marcus Johnson", role="Startup Founder",
                   content="I've read dozens of productivity books, but this one actually delivers.", rating=5),
        Testimonial(id="3", name="Emily Rodriguez", role="Data Scientist",
                   content="The section on decision-making frameworks alone is worth the price.", rating=5),
        Testimonial(id="4", name="David Kim", role="Engineering Director",
                   content="Finally, a book that bridges AI capabilities with human thinking.", rating=5)
    ]

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()