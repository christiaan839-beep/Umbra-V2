const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log('Capturing Sovereign God-Brain UI...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Go to local dev server
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  // Wait for 3D components to render
  await new Promise(r => setTimeout(r, 2000));
  
  // Save to the agent's artifact directory directly
  const artifactDir = '/Users/christiaanwillemdewet/.gemini/antigravity/brain/6f5f2374-c532-48be-9dd6-1b7fbdd3ecad';
  const screenshotPath = path.join(artifactDir, 'sovereign_immersive_ui_verification_1.png');
  
  await page.screenshot({ path: screenshotPath });
  console.log(`Saved screenshot to ${screenshotPath}`);
  
  await browser.close();
})();
