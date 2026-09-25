import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

pdf_filename = r"c:\Users\saura\OneDrive\Desktop\Healthcare Management Platform For Clinical Operations\MediSphere_Backend_Architecture_Flow.pdf"

doc = SimpleDocTemplate(
    pdf_filename,
    pagesize=letter,
    rightMargin=36,
    leftMargin=36,
    topMargin=36,
    bottomMargin=36
)

styles = getSampleStyleSheet()

# Custom styles
primary_color = colors.HexColor("#1A365D")   # Deep navy blue
secondary_color = colors.HexColor("#2B6CB0") # Teal blue
accent_color = colors.HexColor("#319795")    # Mint teal
bg_light = colors.HexColor("#F7FAFC")        # Soft gray/white background
code_bg = colors.HexColor("#EDF2F7")         # Code background gray
text_dark = colors.HexColor("#2D3748")

title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Heading1'],
    fontName='Helvetica-Bold',
    fontSize=22,
    leading=26,
    textColor=primary_color,
    alignment=TA_CENTER,
    spaceAfter=8
)

subtitle_style = ParagraphStyle(
    'DocSubtitle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=12,
    leading=16,
    textColor=secondary_color,
    alignment=TA_CENTER,
    spaceAfter=20
)

h1_style = ParagraphStyle(
    'H1',
    parent=styles['Heading2'],
    fontName='Helvetica-Bold',
    fontSize=14,
    leading=18,
    textColor=primary_color,
    spaceBefore=14,
    spaceAfter=8
)

h2_style = ParagraphStyle(
    'H2',
    parent=styles['Heading3'],
    fontName='Helvetica-Bold',
    fontSize=11,
    leading=15,
    textColor=secondary_color,
    spaceBefore=10,
    spaceAfter=4
)

body_style = ParagraphStyle(
    'Body',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9.5,
    leading=14,
    textColor=text_dark,
    spaceAfter=6
)

bullet_style = ParagraphStyle(
    'Bullet',
    parent=body_style,
    leftIndent=15,
    firstLineIndent=-10,
    spaceAfter=4
)

code_style = ParagraphStyle(
    'Code',
    parent=styles['Normal'],
    fontName='Courier',
    fontSize=8.5,
    leading=12,
    textColor=colors.HexColor("#1A202C")
)

script_style = ParagraphStyle(
    'Script',
    parent=styles['Normal'],
    fontName='Helvetica-Oblique',
    fontSize=9.5,
    leading=14,
    textColor=colors.HexColor("#2C5282")
)

story = []

# Title Section
story.append(Paragraph("MediSphere - Healthcare Management Platform", title_style))
story.append(Paragraph("Backend Flow & Microservices Architecture Guide (Technical Interview Ready)", subtitle_style))
story.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceAfter=15))

# High Level Flow
story.append(Paragraph("1. High-Level Architecture & Request Flow", h1_style))
flow_box_text = """
<b>REST API -----> HTTP REQUEST CALLS</b><br/>
<br/>
<b>REQUEST (JSON) ---> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;--- RESPONSE (JSON Data) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; APPLICATION</b><br/>
Frontend (React) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Submit / Fetch &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Backend Microservices<br/>
<br/>
<b>React (Frontend) -->(Click Event) ---> Spring Boot Java Application (Backend) ---> Database (MongoDB)</b>
"""

p_flow = Paragraph(flow_box_text, code_style)
t_flow = Table([[p_flow]], colWidths=[540])
t_flow.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), code_bg),
    ('PADDING', (0, 0), (-1, -1), 10),
    ('BOX', (0, 0), (-1, -1), 1, secondary_color),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
]))
story.append(t_flow)
story.append(Spacer(1, 12))

# Frontend Button Calls
story.append(Paragraph("2. Frontend Button Click to Backend API Calls", h1_style))
story.append(Paragraph("Frontend React (<code>apiConfig.js</code> &amp; <code>carePlanService.js</code>) se backend endpoints trigger hote hain:", body_style))

button_calls_text = """
<b>BUTTON 1 (Fetch Patients):</b><br/>
&nbsp;&nbsp;--&gt; CLICK --&gt; fetch("http://localhost:8080/api/patients", METHOD="GET")<br/><br/>
<b>BUTTON 2 (Generate CarePlan):</b><br/>
&nbsp;&nbsp;--&gt; CLICK --&gt; fetch("http://localhost:8080/api/careplan/generate", METHOD="POST", RequestBody: {"patientId": "saurabh"})<br/><br/>
<b>BUTTON 3 (AI Risk Prediction):</b><br/>
&nbsp;&nbsp;--&gt; CLICK --&gt; fetch("http://localhost:8080/api/prediction/predict", METHOD="POST", RequestBody: JSON Object)
"""
p_btn = Paragraph(button_calls_text, code_style)
t_btn = Table([[p_btn]], colWidths=[540])
t_btn.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), bg_light),
    ('PADDING', (0, 0), (-1, -1), 8),
    ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E0")),
]))
story.append(t_btn)
story.append(Spacer(1, 14))

# Microservices Breakdown
story.append(Paragraph("3. Backend Java Microservices Structure", h1_style))
story.append(Paragraph("Project <b>Spring Boot 3.4.1 (Java 21)</b> Microservices Architecture par aadharit hai, jo <b>Spring Cloud API Gateway</b> aur <b>Eureka Discovery Server</b> se routed hai.", body_style))

# Gateway & Discovery Table
services_overview_data = [
    [Paragraph("<b>Service Name</b>", body_style), Paragraph("<b>Port</b>", body_style), Paragraph("<b>Core Responsibility</b>", body_style)],
    [Paragraph("<b>api-gateway</b>", body_style), Paragraph("8080", body_style), Paragraph("Single Entry Point / Reverse Proxy / Central CORS & Routing", body_style)],
    [Paragraph("<b>discovery-server</b>", body_style), Paragraph("8761", body_style), Paragraph("Eureka Service Registry (Dynamic Service Lookup)", body_style)],
    [Paragraph("<b>healthcare-service</b>", body_style), Paragraph("8082", body_style), Paragraph("Patients, Care Plans, Vitals, Outcomes & Audit Logs", body_style)],
    [Paragraph("<b>auth-service</b>", body_style), Paragraph("8081", body_style), Paragraph("Authentication & User Role Management (Keycloak)", body_style)],
    [Paragraph("<b>prediction-service</b>", body_style), Paragraph("8084", body_style), Paragraph("AI Clinical Risk Prediction Engine", body_style)],
    [Paragraph("<b>explainability-service</b>", body_style), Paragraph("8085", body_style), Paragraph("XAI / SHAP Model Explainability Analysis", body_style)],
    [Paragraph("<b>fhir-service</b>", body_style), Paragraph("8083", body_style), Paragraph("HL7 FHIR Medical Data Standardization & Exchange", body_style)],
    [Paragraph("<b>model-service</b>", body_style), Paragraph("8086", body_style), Paragraph("ML Model Management Registry", body_style)],
]

t_overview = Table(services_overview_data, colWidths=[120, 50, 370])
t_overview.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#E2E8F0")),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E0")),
    ('PADDING', (0, 0), (-1, -1), 5),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
]))
story.append(t_overview)
story.append(Spacer(1, 14))

# Detailed Breakdown of Healthcare Service
story.append(Paragraph("4. Deep Dive: <code>healthcare-service</code> (Port 8082) Architecture", h1_style))
story.append(Paragraph("Ye sabse main operational microservice hai. Iska MVC-Layered Architecture niche anusar hai:", body_style))

hc_structure = """
<b>healthcare-service -- Port: 8082</b><br/>
&nbsp;&nbsp;src/main/resources/application.yml -&gt; server.port: 8082<br/><br/>
&nbsp;&nbsp;<b>-&gt; app</b> (HealthcareServiceApplication.java)<br/>
&nbsp;&nbsp;<b>-&gt; controller</b> -- RECEIVING ALL INCOMING HTTP REQUESTS<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|- PatientController.java (/api/patients)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|- CarePlanController.java (/api/careplan)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|- VitalsController.java (/api/vitals)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|- AuditController.java (/api/audit)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|- ConsentController.java (/api/consent)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|- DashboardController.java (/api/dashboard)<br/><br/>
&nbsp;&nbsp;<b>-&gt; service</b> -- BUSINESS LOGIC &amp; COMPUTATION<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|- CarePlanService.java<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|- AuditService.java<br/><br/>
&nbsp;&nbsp;<b>-&gt; repository</b> -- DATABASE INTERACTION (Spring Data MongoDB)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|- CarePlanRepository.java<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|- PatientRepository.java<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|- VitalsRepository.java<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|- OutcomeRepository.java<br/><br/>
&nbsp;&nbsp;<b>-&gt; model / entity</b> -- DATA STRUCTURE (POJO Classes)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|- CarePlan.java, Patient.java, VitalsRecord.java, Outcome.java
"""

p_hc = Paragraph(hc_structure, code_style)
t_hc = Table([[p_hc]], colWidths=[540])
t_hc.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), code_bg),
    ('PADDING', (0, 0), (-1, -1), 8),
    ('BOX', (0, 0), (-1, -1), 1, secondary_color),
]))
story.append(t_hc)
story.append(Spacer(1, 14))

# Database & Infrastructure Section
story.append(Paragraph("5. Database & Middleware Infrastructure", h1_style))
infra_bullets = [
    "<b>MongoDB Database (Port 27017):</b> Document-based NoSQL Database for storing Patients, Care Plans, Vitals, and Audit Logs.",
    "<b>Keycloak IAM (Port 9090):</b> Identity and Access Management Server handling OAuth2 / OpenID Connect authentication.",
    "<b>Apache Kafka &amp; Zookeeper (Port 9092 / 2181):</b> Event Streaming Platform for real-time vitals monitoring and automated anomaly alerts."
]
for bullet in infra_bullets:
    story.append(Paragraph(f"• {bullet}", bullet_style))

story.append(Spacer(1, 14))

# Step by Step Request Lifecycle
story.append(Paragraph("6. Step-by-Step Request Lifecycle (Execution Flow)", h1_style))
lifecycle_steps = [
    "<b>Step 1 (React UI Event):</b> User clicks on 'Generate AI Care Plan' button in Frontend.",
    "<b>Step 2 (HTTP Request):</b> React calls <code>POST http://localhost:8080/api/careplan/generate</code> with payload <code>{patientId: 'saurabh'}</code>.",
    "<b>Step 3 (API Gateway &amp; Eureka Routing):</b> Gateway matches route <code>/api/careplan/**</code> and queries Eureka Server for <code>healthcare-service</code> (port 8082).",
    "<b>Step 4 (Controller Layer):</b> Request reaches <code>CarePlanController.java</code>, where <code>@PostMapping('/generate')</code> maps the request body.",
    "<b>Step 5 (Service Layer Logic):</b> Controller calls <code>CarePlanService.generateCarePlan()</code> which evaluates risk score, BP vitals, and generates personalized recommendations.",
    "<b>Step 6 (Database Execution):</b> Service calls <code>CarePlanRepository.save()</code> which executes MongoDB insert/update command.",
    "<b>Step 7 (Audit Logging &amp; Response):</b> Audit log event is created via <code>AuditService</code> and JSON Response is returned to React UI for rendering."
]
for step in lifecycle_steps:
    story.append(Paragraph(step, bullet_style))

story.append(Spacer(1, 14))

# Interview Script Box
story.append(Paragraph("7. Interviewer Presentation Script (1-Minute Explanation)", h1_style))
script_box_text = """
<i>"Sir/Ma'am, humne ek <b>Microservices Architecture</b> build kiya hai Spring Boot (Java 21) me:</i><br/><br/>
1. <b>Client Layer:</b> Frontend (React) se jab user kisi action par click karta hai (e.g. Generate Care Plan), to ek fetch/Axios HTTP Request trigger hoti hai.<br/>
2. <b>API Gateway &amp; Service Discovery:</b> Request sabse pehle <b>API Gateway (Port 8080)</b> par aati hai. Gateway <b>Eureka Discovery Server (8761)</b> ka use karke request ko target Microservice par forward karta hai.<br/>
3. <b>Controller Layer (@RestController):</b> Microservice me request sabse pehle <b>Controller</b> receive karta hai (jaise <code>CarePlanController.java</code>).<br/>
4. <b>Service Layer (@Service):</b> Controller request ko <b>Service Layer</b> (<code>CarePlanService.java</code>) ko pass karta hai jaha Business Rules aur AI Logic processing hoti hai.<br/>
5. <b>Repository Layer (@Repository):</b> Service layer <b>Repository</b> (<code>CarePlanRepository.java</code>) ke dwara <b>MongoDB Database</b> me query execute karta hai.<br/>
6. <b>Response Flow:</b> Database se data milne ke baad Controller JSON Response banakar API Gateway ke raste React Frontend ko bhejta hai aur UI render ho jata hai."
"""

p_script = Paragraph(script_box_text, script_style)
t_script = Table([[p_script]], colWidths=[540])
t_script.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#EBF8FF")),
    ('PADDING', (0, 0), (-1, -1), 10),
    ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#3182CE")),
]))
story.append(t_script)

doc.build(story)
print("PDF successfully generated at:", pdf_filename)
