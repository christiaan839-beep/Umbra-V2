import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

// Define the environment variables safely
const appId = process.env.PUSHER_APP_ID || '';
const key = process.env.NEXT_PUBLIC_PUSHER_KEY || '';
const secret = process.env.PUSHER_SECRET || '';
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2';

/**
 * Server-side Pusher Instance
 * Used by backend API routes to broadcast events instantly
 * to the Swarm Dashboard via WebSockets.
 */
export const pusherServer = new PusherServer({
  appId,
  key,
  secret,
  cluster,
  useTLS: true,
});

/**
 * Client-side Pusher Instance
 * Used by React components to subscribe to channels
 * and listen for live events without polling the DB.
 */
export const pusherClient = (typeof window !== 'undefined' && key)
  ? new PusherClient(key, {
      cluster,
      authEndpoint: '/api/pusher/auth',
    })
  : null;
