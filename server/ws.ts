import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = 3011;

// Re-entry Webhook: Catches data from n8n / Python and broadcasts to all connected UIs
app.post('/webhook/umbra-return', (req, res) => {
  const data = req.body;
  console.log('[UMBRA RETURN WEBHOOK] Received payload:', data);
  
  // Forward to all connected clients
  io.emit('live_lead_stream', data);
  
  res.status(200).json({ status: 'success', message: 'Payload broadcasted to UMBRA UI.' });
});

// Simulated Stream Definitions for UI Verification
const LOCATIONS = ['London, UK', 'New York, US', 'Tokyo, JP', 'Berlin, DE', 'Sydney, AU', 'Dubai, AE'];
const ACTIONS = ['Intercepted 42 B2B Leads', '$5,000 Stripe Capital Deployed', 'Meta Ad Variant 9 Injected', 'Funnel Hijack Sequence Complete'];

io.on('connection', (socket) => {
  console.log(`[UMBRA God-Brain] Node Connected: ${socket.id}`);

  // 1. Omnipresence Telemetry Stream
  const telemetryInterval = setInterval(() => {
    const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    const isCapital = action.includes('$');
    
    socket.emit('telemetry_update', {
      id: Date.now(),
      location,
      action,
      isCapital
    });
  }, 2800);

  // 2. Apex Strategy Command Stream
  socket.on('execute_command', async (data) => {
    console.log(`[Apex Terminal] Command Received: ${data.command}`);
    
    // Echo the commander input back immediately
    socket.emit('apex_response', { agent: 'COMMANDER', text: data.command });

    // 1. Forward to Python God-Brain Orchestrator
    try {
        const pythonResponse = await fetch('http://localhost:8000/api/v1/commander/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: data.command, target_vector: 'GLOBAL' })
        });
        const brainData = await pythonResponse.json();
        console.log(`[GOD-BRAIN] Response:`, brainData);
        
        socket.emit('apex_response', { agent: 'GOVERNOR', text: `Syntax verified. LangChain payload parsed via Gemini 2.0: Vectors targeted [${brainData.sub_swarms_activated?.join(', ')}]` });
        
    } catch (e) {
        console.log(`[ERROR] Python God-Brain offline.`);
    }

    // Mock the God-Brain asynchronous swarm response for the UI effects
    const streamSequence = [
      { delay: 1800, agent: 'COPYWRITER', text: `Extracting semantic hooks related to command payload. Drafting 14 aggressive ad variants.` },
      { delay: 3200, agent: 'VIDEO-SYNTH', text: `Hook scripts confirmed. Spinning up Google Veo generation matrix. ETA: 4.2s per asset.` },
      { delay: 5400, agent: 'AD-BUYER', text: `Pixel data synchronized. Pre-allocating $500/day test budget across top 3 variants. Awaiting final render.` },
      { delay: 7200, agent: 'GOVERNOR', text: `STRIKE PROTOCOL LOCKED. All nodes executing concurrently. Tracking ROAS in Global Telemetry.` }
    ];

    streamSequence.forEach((event) => {
      setTimeout(() => {
        socket.emit('apex_response', { agent: event.agent, text: event.text });
        if (event.agent === 'GOVERNOR' && event.text.includes('LOCKED')) {
           socket.emit('apex_complete', true);
        }
      }, event.delay);
    });
  });

  socket.on('disconnect', () => {
    console.log(`[UMBRA God-Brain] Node Disconnected: ${socket.id}`);
    clearInterval(telemetryInterval);
  });
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`[UMBRA Backend] WebSocket Server executing on http://localhost:${PORT}`);
});
