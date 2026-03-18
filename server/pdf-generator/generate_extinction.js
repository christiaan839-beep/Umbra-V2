const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * BULLETPROOF PDF GENERATOR
 * This physically constructs the 'Extinction Protocol' Pitch Deck.
 */
async function generateSalesDeck(companyName, targetArr, currentAgencyCost) {
  console.log(`[SOVEREIGN] Generating Extinction Protocol for ${companyName}...`);
  
  let browser;
  try {
    // HEADLESS CHROME INSTANCE
    browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // BRUTAL, DEFENSE-CONTRACTOR STYLED HTML TEMPLATE
    const htmlContent = `
    <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap');
          body {
            font-family: 'Space Grotesk', sans-serif;
            background-color: #000000;
            color: #FFFFFF;
            margin: 0;
            padding: 80px;
          }
          .page {
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            page-break-after: always;
          }
          .title { font-size: 64px; font-weight: bold; margin-bottom: 20px; line-height: 1.1; }
          .subtitle { font-size: 24px; color: #888888; text-transform: uppercase; letter-spacing: 4px; }
          .highlight { color: #10B981; } /* Emerald */
          .metric-box {
            border: 1px solid rgba(255,255,255,0.1);
            background: rgba(255,100,100,0.05);
            padding: 30px;
            margin-top: 40px;
          }
          .footer { position: fixed; bottom: 40px; left: 80px; font-size: 12px; color: #555; text-transform: uppercase; letter-spacing: 2px; }
        </style>
      </head>
      <body>
        <!-- Cover Page -->
        <div class="page">
           <div class="subtitle">Sovereign Matrix // Tactical Division</div>
           <div class="title">The <span class="highlight">Extinction</span> Protocol.</div>
           <div style="font-size: 32px; color: #ccc; margin-top: 40px;">
             Prepared explicitly for the executive team at:<br/>
             <b>${companyName}</b>
           </div>
           <div class="footer">RESTRICTED INTEL // SOVEREIGN MATRIX 2026 // DO NOT DISTRIBUTE</div>
        </div>

        <!-- The Brutal Mathematics -->
        <div class="page">
           <div class="subtitle">Current Operational Threat</div>
           <div class="title">You are bleeding capital.</div>
           <div class="metric-box">
              <h3 style="color: #F87171; font-size: 24px; margin: 0;">Current Agency / Human Labor Burn Rate:</h3>
              <p style="font-size: 72px; font-weight: bold; margin: 10px 0; font-family: monospace;">$${currentAgencyCost.toLocaleString()}/mo</p>
              <ul style="font-size: 20px; color: #aaa; line-height: 1.8;">
                <li>Humans require sleep, weekends, and holidays.</li>
                <li>Humans write emails at 60 words per minute.</li>
                <li>Humans make spelling errors, break CRM rules, and miss follow-ups.</li>
              </ul>
           </div>
        </div>

        <!-- The Solution -->
        <div class="page">
           <div class="subtitle">The Sovereign Solution</div>
           <div class="title">Absolute AI Integration.</div>
           <div style="font-size: 24px; color: #aaa; margin-top: 40px; line-height: 1.6;">
             Sovereign Matrix replaces the <i>entire</i> marketing department with a 29-node autonomous swarm.
             <ul>
               <li><b>Nemotron OS Control:</b> Scrapes competitors locally at 1,000 pages per minute.</li>
               <li><b>NVIDIA Riva Voice:</b> Calls leads autonomously at 3AM and closes deals.</li>
               <li><b>Zero PII Leaks:</b> Secured natively by NeMo Guardrails.</li>
             </ul>
           </div>
           <div style="margin-top: 60px; padding: 30px; border: 1px solid #10B981; background: rgba(16,185,129,0.1);">
              <h2 style="color: #10B981; font-size: 40px; margin: 0;">Initiation Target: $5,000/mo</h2>
              <p style="font-size: 18px;">Replacing $${currentAgencyCost.toLocaleString()} in human labor immediately.</p>
           </div>
        </div>

      </body>
    </html>
    `;

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const outPath = path.join(__dirname, `Extinction_Protocol_${companyName.replace(/\s+/g, '_')}.pdf`);
    await page.pdf({
        path: outPath,
        format: 'A4',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    
    console.log(`✅ [SUCCESS] PDF Generated: ${outPath}`);
    
  } catch (err) {
    console.error(`❌ [FATAL] PDF Generation failed:`, err);
  } finally {
    if (browser) {
      await browser.close(); // Guarantee absolute memory safety
    }
  }
}

// CLI Execution trigger
const args = process.argv.slice(2);
if (args.length >= 2) {
    generateSalesDeck(args[0], 'EXEC', parseInt(args[1]));
} else {
    console.log("Usage: node generate_extinction.js 'Company Name' 15000");
}
