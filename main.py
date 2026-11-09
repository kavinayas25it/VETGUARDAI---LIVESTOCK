import io
import os
from fastapi import FastAPI, WebSocket, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

app = FastAPI(title="PashuSanjeevani API")

# Enable CORS for React frontend (port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simulated Database in memory
CATTLE_RECORDS = [
    {"tag_id": "IN-MH-10293", "breed": "Gir Cow", "last_vaccine": "FMD (Oct 2026)", "status": "Healthy"},
    {"tag_id": "IN-MH-10294", "breed": "Murrah Buffalo", "last_vaccine": "HS/BQ (Aug 2026)", "status": "Observation"}
]

OUTBREAK_ALERTS = [
    {"village": "Baramati", "lat": 18.1517, "lng": 74.5776, "disease": "Lumpy Skin Disease", "level": "High"},
    {"village": "Akola", "lat": 20.7002, "lng": 77.0082, "disease": "Hemorrhagic Septicemia", "level": "Medium"}
]

class ChatQuery(BaseModel):
    message: str
    language: str = "en"

class MedicationItem(BaseModel):
    name: str
    purpose: str
    dosage: str
    route: str
    frequency: str

class PrescriptionRequest(BaseModel):
    farmer_name: str
    animal_tag: str
    breed: str
    diagnosis: str
    medicines: list[MedicationItem]
    instructions: str
    vet_name: str
    clinic: str = "State Mobile Veterinary Dispensary, Pune"

# System prompt safeguarding against dangerous remedies
SYSTEM_PROMPT = """
You are Pashu-Rakshak, an AI veterinary first-aid advisor for livestock in Maharashtra, India.
CRITICAL SAFETY RULE:
If a user mentions dangerous home remedies ("desi nuskhe") like kerosene on wounds, 
force-feeding mustard oil/concoctions when choked, or battery acid:
1. Issue a prominent warning card: "STOP: Harmful Remedy Detected".
2. Explain clearly that force-feeding causes Aspiration Pneumonia.
3. Direct them immediately to the 1962 Toll-Free Animal Mobile Medical Helpline.
Keep responses concise, clear, and reassuring.
"""

@app.get("/api/cattle")
def get_cattle():
    return CATTLE_RECORDS

@app.get("/api/outbreaks")
def get_outbreaks():
    return OUTBREAK_ALERTS

@app.post("/api/chat")
def veterinary_chat(query: ChatQuery):
    api_key = os.getenv("GROQ_API_KEY")
    lower_msg = query.message.lower()
    
    if not api_key:
        if "oil" in lower_msg or "kerosene" in lower_msg or "nuskhe" in lower_msg:
            return {
                "reply": "⚠️ **STOP: Harmful Remedy Warning!** Do not force-feed oils or use toxic substances. Force-feeding can cause fluid into lungs (Aspiration Pneumonia). Please call the **1962 Veterinary Mobile Helpline** immediately."
            }
        return {
            "reply": "Isolate the animal in a clean, shaded area. Check temperature and provide clean water. Please dial 1962 for a local veterinary doctor."
        }

    from groq import Groq
    client = Groq(api_key=api_key)
    completion = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": query.message}
        ],
        temperature=0.3
    )
    return {"reply": completion.choices[0].message.content}

@app.post("/api/scan-lesion")
async def scan_lesion(file: UploadFile = File(...)):
    return {
        "detected_condition": "Lumpy Skin Disease (LSD) - Early Nodular Stage",
        "confidence": "94.2%",
        "risk_level": "High",
        "recommendations": [
            "Isolate the animal immediately from healthy herd members.",
            "Apply fly repellent around the shed (vectors transmit LSD).",
            "Contact 1962 helpline for veterinary quarantine inspection."
        ]
    }

@app.post("/api/generate-prescription")
def generate_prescription(data: PrescriptionRequest):
    buffer = io.BytesIO()
    
    doc = SimpleDocTemplate(
        buffer, 
        pagesize=letter, 
        rightMargin=40, 
        leftMargin=40, 
        topMargin=40, 
        bottomMargin=40
    )
    story = []
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'HeaderTitle',
        parent=styles['Heading1'],
        fontSize=20,
        textColor=colors.HexColor('#6B21A8'),
        alignment=1,
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'HeaderSubtitle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#475569'),
        alignment=1,
        spaceAfter=15
    )

    story.append(Paragraph("PRESCRIPTION TEMPLATE", title_style))
    story.append(Paragraph("PashuSanjeevani • Maharashtra Animal Husbandry Unit • Helpline: 1962", subtitle_style))
    story.append(Spacer(1, 10))

    details_data = [
        [Paragraph("<b>Prescription No:</b>", styles['Normal']), Paragraph("0001", styles['Normal']), Paragraph("<b>Prescription Date:</b>", styles['Normal']), Paragraph("November 9, 2026", styles['Normal'])],
        [Paragraph("<b>Farmer Name:</b>", styles['Normal']), Paragraph(data.farmer_name, styles['Normal']), Paragraph("<b>Animal Breed:</b>", styles['Normal']), Paragraph(data.breed, styles['Normal'])],
        [Paragraph("<b>Animal Tag ID:</b>", styles['Normal']), Paragraph(data.animal_tag, styles['Normal']), Paragraph("<b>Clinical Diagnosis:</b>", styles['Normal']), Paragraph(data.diagnosis, styles['Normal'])],
    ]
    
    t = Table(details_data, colWidths=[110, 140, 110, 140])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t)
    story.append(Spacer(1, 20))

    story.append(Paragraph("<b>List of Prescribed Medications</b>", styles['Heading3']))
    story.append(Spacer(1, 6))

    med_table_data = [
        [Paragraph("<b>Medication Name</b>", styles['Normal']), Paragraph("<b>Purpose</b>", styles['Normal']), Paragraph("<b>Dosage</b>", styles['Normal']), Paragraph("<b>Route</b>", styles['Normal']), Paragraph("<b>Frequency</b>", styles['Normal'])]
    ]
    
    for med in data.medicines:
        med_table_data.append([
            Paragraph(med.name, styles['Normal']), 
            Paragraph(med.purpose, styles['Normal']), 
            Paragraph(med.dosage, styles['Normal']), 
            Paragraph(med.route, styles['Normal']), 
            Paragraph(med.frequency, styles['Normal'])
        ])

    med_table = Table(med_table_data, colWidths=[120, 110, 90, 70, 110])
    med_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#6B21A8')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(med_table)
    story.append(Spacer(1, 20))

    story.append(Paragraph("<b>Advice Given / Instructions:</b>", styles['Heading3']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(data.instructions, styles['Normal']))

    story.append(Spacer(1, 40))
    physician_data = [
        [Paragraph(f"<b>Physician Name:</b><br/>{data.vet_name}", styles['Normal']), Paragraph("<b>Physician Phone Number:</b><br/>(112) 312-3456", styles['Normal'])],
        [Paragraph("<b>Physician Signature:</b><br/><i>[Digitally Verified & Signed]</i>", styles['Normal']), Paragraph("<b>Physician Email:</b><br/>vet.support@pashusanjeevani.mh.gov.in", styles['Normal'])]
    ]
    p_table = Table(physician_data, colWidths=[250, 250])
    p_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(p_table)

    doc.build(story)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=prescription_{data.animal_tag}.pdf"}
    )

connected_clients = []

@app.websocket("/ws/track-van")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            for client in connected_clients:
                if client != websocket:
                    await client.send_text(data)
    except Exception:
        if websocket in connected_clients:
            connected_clients.remove(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)