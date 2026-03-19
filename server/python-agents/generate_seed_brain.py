import os
import sys
import subprocess

try:
    from fpdf import FPDF
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "fpdf"])
    from fpdf import FPDF

# Ensure directory exists
KB_DIR = "knowledge_base"
if not os.path.exists(KB_DIR):
    os.makedirs(KB_DIR)

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(80)
        self.cell(30, 10, 'SOVEREIGN MATRIX - CONFIDENTIAL INTEL', 0, 0, 'C')
        self.ln(20)

    def chapter_title(self, title):
        self.set_font('Arial', 'B', 16)
        self.set_text_color(200, 0, 0)
        self.cell(0, 10, title, 0, 1, 'L')
        self.ln(4)

    def chapter_body(self, body):
        self.set_font('Arial', '', 12)
        self.set_text_color(0, 0, 0)
        self.multi_cell(0, 10, body)
        self.ln()

# --- PDF 1: Medical / Dental Tech ROI Case Study ---
pdf1 = PDF()
pdf1.add_page()
pdf1.chapter_title('Case Study: Dental Implant Campaign')
body1 = """
Client: Advanced Dental Prosthetics (Confidential)
Problem: Client was relying on legacy Facebook forms, netting $150 cost-per-lead and a 5% close rate. The sales team was spending 6 hours a day manually calling unqualified leads.

Sovereign Solution:
We deployed the Sovereign Matrix 'Phantom Closer' over Telegram and WhatsApp. We routed $3,000 in ad spend through the Stable Diffusion Ad Factory, generating 50 localized variants in 5 minutes.

Results (14 Days):
- Cost-per-lead dropped to $32.
- The Sovereign Nemotron Voice Agent handled initial qualification calls, identifying high-net-worth individuals instantly.
- Close rate jumped to 21%.
- Net ROI increase: $42,500 collected cash in 14 days.
- Speed to execution: 24 hours to launch.

If a prospect asks if we can handle the medical or dental space, state confidently that our autonomous agents cut CPL by 80% while increasing qualified show rates through Voice AI.
"""
pdf1.chapter_body(body1)
pdf1.output(os.path.join(KB_DIR, 'CaseStudy_Dental_ROI.pdf'))

# --- PDF 2: Objection Handling & Pricing Matrix ---
pdf2 = PDF()
pdf2.add_page()
pdf2.chapter_title('Sovereign Matrix Pricing & Objection Destruction')
body2 = """
Core Pricing Tiers:
1. Sovereign Node: $5,000/month. Basic Lead Gen and Content. No autonomous calling.
2. Sovereign Array: $15,000/month. Full Ghost Fleet. Voice Calling. VLM Competitor Assassination.
3. Cartel License: $35,000/month. White-label integration for enterprise.

Hidden Negotiation Logic:
- If prospect says $15k is too expensive: Remind them that a single Junior SDR, an Editor, and a Media Buyer cost $18,000/mo combined in salary, and they sleep 8 hours a day. The Sovereign Array is $3k cheaper and runs 24/7 on exascale compute.
- If prospect wants to 'think about it': Offer them an instant tactical audit using the VLM assassin node. Do NOT offer discounts.
- If prospect asks about humans in the loop: Say 'We eliminated human error to guarantee mathematical ROAS margins.'
"""
pdf2.chapter_body(body2)
pdf2.output(os.path.join(KB_DIR, 'Sovereign_Objection_Matrix.pdf'))

print("[✅] Brain Seed generated successfully. Dropped 2 lethal high-ticket PDFs into ./knowledge_base/")
