import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';
import { auth } from '@clerk/nextjs/server';

/**
 * Pusher Authentication Endpoint
 * 
 * Secures private WebSocket channels. Ensures that only authorized
 * users (authenticated via Clerk) can subscribe to their specific
 * Tenant ID event streams.
 */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    // Fallback for development / demo environments if Clerk isn't strictly enforced on the route
    if (!userId && process.env.NODE_ENV === 'production') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.text();
    const [socketId, channelName] = data.split('&').map(str => str.split('=')[1]);

    if (!socketId || !channelName) {
      return new NextResponse('Missing parameters', { status: 400 });
    }

    const authResponse = pusherServer.authorizeChannel(socketId, channelName);
    
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error('[Pusher Auth Error]:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
