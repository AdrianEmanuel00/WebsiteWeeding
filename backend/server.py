from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Depends, Request
from fastapi.responses import StreamingResponse, FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import resend
import qrcode
from io import BytesIO
import jwt
import bcrypt
import csv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend setup
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'adrianemanuel007@gmail.com')

# JWT setup
JWT_SECRET = os.environ.get('JWT_SECRET', 'wedding-secret-key-2026')
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD_HASH = bcrypt.hashpw(os.environ.get('ADMIN_PASSWORD', 'sara&adrian2026').encode(), bcrypt.gensalt()).decode()

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

api_router = APIRouter(prefix="/api")

# Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# === MODELS ===

class GuestMenu(BaseModel):
    name: str
    menu_type: str  # Standard/Vegetarian/Vegan/Fără porc/Copil

class RSVPCreate(BaseModel):
    guest_name: str
    attending: bool
    num_guests: int = 1
    guests: List[GuestMenu] = []
    allergies: Optional[str] = None
    message: Optional[str] = None

class RSVP(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    guest_name: str
    attending: bool
    num_guests: int
    guests: List[GuestMenu]
    allergies: Optional[str] = None
    message: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Photo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    original_filename: str
    uploader_name: Optional[str] = None
    media_type: str = "photo"  # photo/video
    status: str = "pending"  # pending/approved/rejected
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class AdminLogin(BaseModel):
    username: str
    password: str

class PhotoModerate(BaseModel):
    status: str  # approved/rejected

# === HELPERS ===

def verify_token(request: Request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Token invalid")
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirat")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalid")

async def send_rsvp_email(rsvp: RSVP):
    """Send email notification for RSVP"""
    if not resend.api_key:
        logger.warning("Resend API key not configured, skipping email")
        return
    
    guests_html = ""
    for guest in rsvp.guests:
        guests_html += f"<li>{guest.name} - {guest.menu_type}</li>"
    
    html_content = f"""
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2C3E30; border-bottom: 2px solid #8DA399; padding-bottom: 10px;">
            Confirmare nouă RSVP
        </h1>
        <p><strong>Nume:</strong> {rsvp.guest_name}</p>
        <p><strong>Participă:</strong> {'Da' if rsvp.attending else 'Nu'}</p>
        <p><strong>Număr persoane:</strong> {rsvp.num_guests}</p>
        <p><strong>Invitați:</strong></p>
        <ul>{guests_html}</ul>
        <p><strong>Alergii:</strong> {rsvp.allergies or 'Niciuna'}</p>
        <p><strong>Mesaj:</strong> {rsvp.message or '-'}</p>
        <hr style="border-color: #8DA399; margin: 20px 0;">
        <p style="color: #5C6B5F; font-size: 12px;">
            Trimis automat de pe site-ul nunții Sara & Adrian
        </p>
    </div>
    """
    
    try:
        params = {
            "from": SENDER_EMAIL,
            "to": [ADMIN_EMAIL],
            "subject": f"RSVP: {rsvp.guest_name} - {'Participă' if rsvp.attending else 'Nu participă'}",
            "html": html_content
        }
        await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent for RSVP: {rsvp.guest_name}")
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")

# === ROUTES ===

@api_router.get("/")
async def root():
    return {"message": "Wedding API - Sara & Adrian 2026"}

# RSVP Routes
@api_router.post("/rsvp", response_model=RSVP)
@limiter.limit("10/minute")
async def create_rsvp(request: Request, rsvp_data: RSVPCreate):
    rsvp = RSVP(**rsvp_data.model_dump())
    doc = rsvp.model_dump()
    await db.rsvps.insert_one(doc)
    
    # Send email notification
    asyncio.create_task(send_rsvp_email(rsvp))
    
    return rsvp

@api_router.get("/rsvp", response_model=List[RSVP])
async def get_rsvps(request: Request, _=Depends(verify_token)):
    rsvps = await db.rsvps.find({}, {"_id": 0}).to_list(1000)
    return rsvps

@api_router.delete("/rsvp/{rsvp_id}")
async def delete_rsvp(rsvp_id: str, request: Request, _=Depends(verify_token)):
    result = await db.rsvps.delete_one({"id": rsvp_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="RSVP not found")
    return {"message": "RSVP deleted"}

@api_router.get("/rsvp/export")
async def export_rsvps(request: Request, _=Depends(verify_token)):
    rsvps = await db.rsvps.find({}, {"_id": 0}).to_list(1000)
    
    output = BytesIO()
    output.write('\ufeff'.encode('utf-8'))  # BOM for Excel
    
    import io
    text_stream = io.TextIOWrapper(output, encoding='utf-8', newline='')
    writer = csv.writer(text_stream)
    writer.writerow(['Nume', 'Participă', 'Nr. Persoane', 'Invitați', 'Alergii', 'Mesaj', 'Data'])
    
    for rsvp in rsvps:
        guests_str = "; ".join([f"{g['name']} ({g['menu_type']})" for g in rsvp.get('guests', [])])
        writer.writerow([
            rsvp.get('guest_name', ''),
            'Da' if rsvp.get('attending') else 'Nu',
            rsvp.get('num_guests', 0),
            guests_str,
            rsvp.get('allergies', ''),
            rsvp.get('message', ''),
            rsvp.get('created_at', '')
        ])
    
    text_stream.flush()
    output.seek(0)
    
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=rsvp_export.csv"}
    )

# Photo Routes
@api_router.get("/photos")
async def get_photos(status: Optional[str] = None):
    query = {}
    if status:
        query["status"] = status
    else:
        query["status"] = "approved"
    photos = await db.photos.find(query, {"_id": 0}).to_list(1000)
    return photos

@api_router.get("/photos/all")
async def get_all_photos(request: Request, _=Depends(verify_token)):
    photos = await db.photos.find({}, {"_id": 0}).to_list(1000)
    return photos

UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

@api_router.post("/photos/upload")
@limiter.limit("30/minute")
async def upload_photo(
    request: Request,
    file: UploadFile = File(...),
    uploader_name: Optional[str] = None,
    media_type: Optional[str] = "photo"
):
    # Validate file type
    allowed_photo_types = ['image/jpeg', 'image/png', 'image/heic', 'image/heif']
    allowed_video_types = ['video/mp4', 'video/quicktime', 'video/mov', 'video/avi', 'video/x-msvideo']
    all_allowed = allowed_photo_types + allowed_video_types
    if file.content_type not in all_allowed:
        raise HTTPException(status_code=400, detail="Tip fișier invalid. Sunt acceptate: JPG, PNG, HEIC, MP4, MOV")

    # Detect actual media type from content_type
    detected_type = "video" if file.content_type in allowed_video_types else "photo"

    # Size limits: 20MB for photos, 500MB for videos
    max_size = 524288000 if detected_type == "video" else 20971520
    content = await file.read()
    if len(content) > max_size:
        limit_label = "500MB" if detected_type == "video" else "20MB"
        raise HTTPException(status_code=400, detail=f"Fișierul depășește limita de {limit_label}")

    # Generate unique filename
    ext = file.filename.split('.')[-1] if '.' in file.filename else ('mp4' if detected_type == 'video' else 'jpg')
    unique_filename = f"{uuid.uuid4()}.{ext}"
    file_path = UPLOAD_DIR / unique_filename

    # Save file
    with open(file_path, 'wb') as f:
        f.write(content)

    # Create record - auto approved
    photo = Photo(
        filename=unique_filename,
        original_filename=file.filename,
        uploader_name=uploader_name,
        media_type=detected_type,
        status="approved"
    )
    await db.photos.insert_one(photo.model_dump())

    return {"message": "Fișierul a fost încărcat cu succes", "photo": photo.model_dump()}

@api_router.get("/photos/file/{filename}")
async def get_photo_file(filename: str):
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Photo not found")
    return FileResponse(file_path)

@api_router.put("/photos/{photo_id}/moderate")
async def moderate_photo(photo_id: str, data: PhotoModerate, request: Request, _=Depends(verify_token)):
    if data.status not in ['approved', 'rejected']:
        raise HTTPException(status_code=400, detail="Status invalid")
    
    result = await db.photos.update_one(
        {"id": photo_id},
        {"$set": {"status": data.status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Photo not found")
    return {"message": f"Photo {data.status}"}

@api_router.delete("/photos/{photo_id}")
async def delete_photo(photo_id: str, request: Request, _=Depends(verify_token)):
    photo = await db.photos.find_one({"id": photo_id}, {"_id": 0})
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    # Delete file
    file_path = UPLOAD_DIR / photo['filename']
    if file_path.exists():
        file_path.unlink()
    
    await db.photos.delete_one({"id": photo_id})
    return {"message": "Photo deleted"}

# Admin Routes
@api_router.post("/admin/login")
async def admin_login(data: AdminLogin):
    if data.username != ADMIN_USERNAME:
        raise HTTPException(status_code=401, detail="Credențiale invalide")
    
    # For simplicity, check against env password directly
    if data.password != os.environ.get('ADMIN_PASSWORD', 'sara&adrian2026'):
        raise HTTPException(status_code=401, detail="Credențiale invalide")
    
    token = jwt.encode(
        {"username": data.username, "exp": datetime.now(timezone.utc).timestamp() + 86400},
        JWT_SECRET,
        algorithm='HS256'
    )
    return {"token": token}

@api_router.get("/stats")
async def get_stats(request: Request, _=Depends(verify_token)):
    rsvps = await db.rsvps.find({}, {"_id": 0}).to_list(1000)
    
    total_guests = 0
    attending = 0
    not_attending = 0
    menu_counts = {"Standard": 0, "Vegetarian": 0, "Vegan": 0, "Fără porc": 0, "Copil": 0}
    all_allergies = []
    
    for rsvp in rsvps:
        if rsvp.get('attending'):
            attending += 1
            total_guests += rsvp.get('num_guests', 0)
            for guest in rsvp.get('guests', []):
                menu_type = guest.get('menu_type', 'Standard')
                if menu_type in menu_counts:
                    menu_counts[menu_type] += 1
            if rsvp.get('allergies'):
                all_allergies.append(rsvp.get('allergies'))
        else:
            not_attending += 1
    
    photos_pending = await db.photos.count_documents({"status": "pending"})
    photos_approved = await db.photos.count_documents({"status": "approved"})
    
    return {
        "total_rsvps": len(rsvps),
        "attending": attending,
        "not_attending": not_attending,
        "total_guests": total_guests,
        "menu_counts": menu_counts,
        "allergies": all_allergies,
        "photos_pending": photos_pending,
        "photos_approved": photos_approved
    }

# QR Code
@api_router.get("/qrcode")
async def generate_qrcode():
    site_url = os.environ.get('SITE_URL', 'https://love-story-53.preview.emergentagent.com')
    
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(site_url)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img = img.resize((1024, 1024))
    
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    
    return StreamingResponse(buffer, media_type="image/png")

# Include router
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
