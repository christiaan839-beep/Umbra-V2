const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const rootDir = '/Users/christiaanwillemdewet/.gemini/antigravity/skills';
const targetFiles = [
  'social-media-agent/workflows/full_funnel.json',
  'social-media-agent/workflows/instagram_auto_post.json',
  'social-media-agent/workflows/youtube_auto_upload.json',
  'flywheel/aggregator.json',
  'flywheel/apollo_enrichment.json',
  'flywheel/pinecone_memory.json',
  'flywheel/pinecone_query.json',
  'flywheel/trend_scout.json',
  'flywheel/twilio_followup.json'
];

targetFiles.forEach(relPath => {
  const fullPath = path.join(rootDir, relPath);
  try {
    const rawData = fs.readFileSync(fullPath, 'utf8');
    const data = JSON.parse(rawData);
    
    if (!data.id) {
      // n8n expects a specific length string for IDs in some versions, randomUUID is standard
      data.id = crypto.randomUUID().split('-').join('').substring(0, 16); 
      fs.writeFileSync(fullPath, JSON.stringify(data, null, 4));
      console.log(`[PATCHED] Added ID ${data.id} to ${relPath}`);
    } else {
      console.log(`[SKIPPED] ${relPath} already has an ID`);
    }
  } catch (error) {
    console.error(`[ERROR] Failed to patch ${relPath}:`, error.message);
  }
});
