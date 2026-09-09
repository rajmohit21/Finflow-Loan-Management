import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))
        
        # Header (pages 2+)
        if self._pageNumber > 1:
            self.drawString(54, 750, "FinFlow Loan Management System — Master Integration & Testing Guide")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
            
        # Footer
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 50, 558, 50)
        
        self.setFont("Helvetica", 8)
        self.drawString(54, 36, "Confidential — FinFlow Microservices Platform")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, page_str)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=64
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Palette
    PRIMARY = colors.HexColor("#1E3A8A")
    SECONDARY = colors.HexColor("#2563EB")
    TEXT_DARK = colors.HexColor("#0F172A")
    BG_LIGHT = colors.HexColor("#F8FAFC")
    ACCENT_GREEN = colors.HexColor("#10B981")
    CODE_BG = colors.HexColor("#1E293B")
    
    # Custom Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY,
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#64748B"),
        spaceAfter=15
    )
    
    h1_style = ParagraphStyle(
        'SectionH1',
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=SECONDARY,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'BodyDark',
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=TEXT_DARK,
        spaceAfter=6
    )
    
    code_style = ParagraphStyle(
        'CodeBlock',
        fontName='Courier',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#38BDF8"),
        backColor=CODE_BG,
        borderColor=colors.HexColor("#334155"),
        borderWidth=1,
        borderPadding=6,
        spaceBefore=4,
        spaceAfter=8
    )

    tbl_text = ParagraphStyle(
        'TblText',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=TEXT_DARK
    )

    tbl_header = ParagraphStyle(
        'TblHeader',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    story = []
    
    # Title & Banner
    story.append(Paragraph("FinFlow Loan Management System", title_style))
    story.append(Paragraph("Master End-to-End Execution, Integration & Interface Testing Guide", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=SECONDARY, spaceAfter=15))
    
    # Executive Summary Card
    summary_text = (
        "<b>System Overview:</b> FinFlow is an enterprise microservices-based loan application, documentation, "
        "and underwriting platform. It connects an Angular frontend with a Spring Boot backend (Auth, Application, "
        "Document, Admin services), API Gateway (:8090), Eureka Service Discovery (:8761), Spring Cloud Config (:8888), "
        "MySQL relational databases, and RabbitMQ message broker."
    )
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 10))

    # SECTION 1: Build & Execution Sequence
    story.append(Paragraph("1. Exact Build & Execution Command Sequence", h1_style))
    story.append(Paragraph(
        "To rebuild the Java microservice JAR binaries from source code, clean previous container states, "
        "and spin up the complete infrastructure, execute the following commands in exact order from the project root:",
        body_style
    ))
    
    cmd_box = (
        "<b># Step 1: Navigate to the Root Project Directory</b><br/>"
        "cd \"c:\\Capg-CoreJAVA-Development\\Capgemini-Training\\All-Capg-Workspaces\\FinFlow Loan Management\"<br/><br/>"
        "<b># Step 2: Stop & Remove Existing Containers, Networks and Named Volumes</b><br/>"
        "docker-compose down -v<br/><br/>"
        "<b># Step 3: Rebuild All Java Microservice JARs (Parent POM)</b><br/>"
        "mvn clean package -DskipTests<br/><br/>"
        "<b># Step 4: Build Container Images and Launch Entire Stack</b><br/>"
        "docker-compose up --build -d<br/><br/>"
        "<b># Step 5: Check Running Container Health & Status</b><br/>"
        "docker-compose ps"
    )
    story.append(Paragraph(cmd_box, code_style))
    
    note_text = (
        "<b>Important Note on Command Flags:</b><br/>"
        "• Correct Spelling: Use <code>mvn clean package -DskipTests</code> (capital <b>T</b> in <code>skipTests</code>, "
        "and <code>clean</code> instead of <code>clear</code>).<br/>"
        "• The <code>-v</code> flag in <code>docker-compose down -v</code> resets MySQL database volumes to a clean state."
    )
    story.append(Paragraph(note_text, body_style))
    story.append(Spacer(1, 10))

    # SECTION 2: Sitemap & Credentials Table
    story.append(Paragraph("2. Master Services, Ports & Credentials Reference", h1_style))
    
    table_data = [
        [
            Paragraph("Service / Component", tbl_header),
            Paragraph("URL / Access Point", tbl_header),
            Paragraph("Port", tbl_header),
            Paragraph("Default Credentials / Role", tbl_header)
        ],
        [
            Paragraph("<b>Angular Frontend (Dev)</b>", tbl_text),
            Paragraph("http://localhost:4200", tbl_text),
            Paragraph("4200", tbl_text),
            Paragraph("Applicant: <code>rahul.sharma@example.com</code> / <code>password123</code>", tbl_text)
        ],
        [
            Paragraph("<b>Angular Frontend (Nginx)</b>", tbl_text),
            Paragraph("http://localhost", tbl_text),
            Paragraph("80", tbl_text),
            Paragraph("Admin: <code>admin@finflow.com</code> / <code>password123</code>", tbl_text)
        ],
        [
            Paragraph("<b>Unified Swagger UI</b>", tbl_text),
            Paragraph("http://localhost:8090/swagger-ui.html", tbl_text),
            Paragraph("8090", tbl_text),
            Paragraph("Supports all 4 microservices via Gateway", tbl_text)
        ],
        [
            Paragraph("<b>Eureka Dashboard</b>", tbl_text),
            Paragraph("http://localhost:8761", tbl_text),
            Paragraph("8761", tbl_text),
            Paragraph("N/A (Service Discovery Monitor)", tbl_text)
        ],
        [
            Paragraph("<b>RabbitMQ Console</b>", tbl_text),
            Paragraph("http://localhost:15672", tbl_text),
            Paragraph("15672", tbl_text),
            Paragraph("User: <code>admin</code> | Pass: <code>admin</code>", tbl_text)
        ],
        [
            Paragraph("<b>Config Server</b>", tbl_text),
            Paragraph("http://localhost:8888", tbl_text),
            Paragraph("8888", tbl_text),
            Paragraph("Central Git/Native Config", tbl_text)
        ]
    ]
    
    col_widths = [120, 160, 45, 179]
    t = Table(table_data, colWidths=col_widths)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('BOX', (0, 0), (-1, -1), 1, PRIMARY),
        ('BACKGROUND', (0, 1), (-1, 1), colors.white),
        ('BACKGROUND', (0, 2), (-1, 2), BG_LIGHT),
        ('BACKGROUND', (0, 3), (-1, 3), colors.white),
        ('BACKGROUND', (0, 4), (-1, 4), BG_LIGHT),
        ('BACKGROUND', (0, 5), (-1, 5), colors.white),
        ('BACKGROUND', (0, 6), (-1, 6), BG_LIGHT),
    ]))
    story.append(t)
    story.append(Spacer(1, 15))

    # SECTION 3: Step-by-Step UI Testing Guide
    story.append(Paragraph("3. Step-by-Step Web Interface User Testing Guide", h1_style))
    
    # Test Flow 1
    story.append(Paragraph("Test Flow A: User Registration & Sign In", h2_style))
    tf1_text = (
        "<b>1. Demo Applicant Sign In:</b><br/>"
        "• Open <code>http://localhost:4200/login</code>.<br/>"
        "• Click the <b>⚡ Quick Demo Login → 'Applicant Demo'</b> button.<br/>"
        "• Auto-fills Email: <code>rahul.sharma@example.com</code> and Password: <code>password123</code>.<br/>"
        "• Click <b>Sign In to Dashboard</b> to access <code>/applicant/dashboard</code>.<br/><br/>"
        "<b>2. New User Registration:</b><br/>"
        "• Navigate to <code>/register</code>.<br/>"
        "• <b>Full Legal Name:</b> <code>Amit Verma</code> | <b>Email:</b> <code>amit.verma@example.com</code><br/>"
        "• <b>Phone Number:</b> <code>9876501234</code> | <b>Role:</b> <code>Loan Applicant</code><br/>"
        "• <b>Password:</b> <code>SecurePass123</code> (Observe live green password strength indicator).<br/>"
        "• Accept Terms & click <b>Complete Registration</b>."
    )
    story.append(Paragraph(tf1_text, body_style))
    story.append(Spacer(1, 8))

    # Test Flow 2
    story.append(Paragraph("Test Flow B: 6-Step Loan Application Wizard", h2_style))
    tf2_text = (
        "Navigate to <code>/applicant/apply-loan</code> and fill out the fields:<br/>"
        "• <b>Step 1 (Personal):</b> DOB: <code>1990-08-20</code>, Address: <code>Flat 501, Blue Ridge</code>, City: <code>Pune</code>, State: <code>Maharashtra</code>, Pincode: <code>411057</code>.<br/>"
        "• <b>Step 2 (Employment):</b> Type: <code>Salaried</code>, Employer: <code>TCS Digital</code>, Title: <code>Software Architect</code>, Experience: <code>8</code> Years.<br/>"
        "• <b>Step 3 (Financials & DTI):</b> Monthly Income: <code>₹1,50,000</code>, Existing EMI: <code>₹20,000</code>, Credit Score: <code>810</code>.<br/>"
        "<i>Notice: DTI ratio auto-calculates to 13.3% with a green 'High Approval Probability' badge.</i><br/>"
        "• <b>Step 4 (Loan Specs & EMI):</b> Type: <code>HOME</code> (8.0% rate), Amount: <code>₹50,00,000</code>, Tenure: <code>240 Months</code>.<br/>"
        "<i>Notice: Interactive EMI Calculator updates to ₹41,822/mo and total interest payable.</i><br/>"
        "• <b>Step 5 (Document Upload):</b> Drag & drop Aadhaar / Salary Slip attachment.<br/>"
        "• <b>Step 6 (Review & Submit):</b> Check declaration box & click <b>Submit Loan Application</b>."
    )
    story.append(Paragraph(tf2_text, body_style))
    story.append(Spacer(1, 8))

    # Test Flow 3
    story.append(Paragraph("Test Flow C: Admin Underwriting & Decision Desk", h2_style))
    tf3_text = (
        "<b>1. Sign In as Admin Underwriter:</b><br/>"
        "• Login at <code>/login</code> with Email: <code>admin@finflow.com</code> / Pass: <code>password123</code>.<br/>"
        "• Redirection lands on <code>/admin/dashboard</code> showcasing portfolio risk charts.<br/><br/>"
        "<b>2. Review File & Make Decision:</b><br/>"
        "• Go to <code>/admin/applications</code> and click <b>Review File</b> on Application #101 or #102.<br/>"
        "• Inspect applicant profile, financials, and uploaded documents.<br/>"
        "• Enter Remarks: <code>Credit score verified. Approved for disbursement.</code><br/>"
        "• Click <b>Approve Loan</b>. Status updates instantly to <b>APPROVED</b>, and an audit report event is published to RabbitMQ!<br/><br/>"
        "<b>3. System Audit Stream:</b><br/>"
        "• Navigate to <code>/admin/reports</code> to inspect live RabbitMQ event logs."
    )
    story.append(Paragraph(tf3_text, body_style))
    story.append(Spacer(1, 10))

    # SECTION 4: Swagger Testing Guide
    story.append(Paragraph("4. Swagger API Sandbox Testing Guide", h1_style))
    swagger_text = (
        "1. Open <b>Unified Swagger UI:</b> <code>http://localhost:8090/swagger-ui.html</code>.<br/>"
        "2. Use top-right <b>'Select a definition'</b> dropdown to choose service (Auth, Application, Document, Admin).<br/>"
        "3. <b>Authenticate:</b> Call <code>POST /gateway/auth/login</code> with <code>{\"email\":\"john@example.com\",\"password\":\"password123\"}</code>.<br/>"
        "4. Copy the raw JWT token string.<br/>"
        "5. Click <b>Authorize 🔓</b> button, paste token, and click Authorize.<br/>"
        "6. <b>Test Application Service:</b> Call <code>GET /gateway/applications/calculate-rate?amount=500000&purpose=Home Purchase</code>.<br/>"
        "7. <b>Test Admin Decision:</b> Call <code>POST /gateway/admin/applications/101/decision</code> with payload <code>{\"decisionType\":\"APPROVED\",\"remarks\":\"Approved via Swagger\"}</code>."
    )
    story.append(Paragraph(swagger_text, body_style))
    
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated at: {filename}")

if __name__ == "__main__":
    output_pdf = r"c:\Capg-CoreJAVA-Development\Capgemini-Training\All-Capg-Workspaces\FinFlow Loan Management\FinFlow_Loan_Management_System_Master_Guide.pdf"
    build_pdf(output_pdf)
