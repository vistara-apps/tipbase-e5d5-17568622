// Note: Farcaster FrameSDK implementation needs verification for correct package.
// Assuming @farcaster/frame-sdk exports FrameSDK, but based on errors, might need adjustment.
// For now, returning a basic frame response.

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  // Fetch creator
  const { data: creator } = await supabase
    .from('creators')
    .select('creator_address')
    .eq('username', username)
    .single();

  if (!creator) {
    return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
  }

  // Basic frame response (adjust based on actual Farcaster SDK)
  const frameResponse = {
    image: 'https://example.com/tipbase-frame-image.png', // TODO: Generate dynamic image
    buttons: [
      { label: 'Tip Now', action: 'post', target: `${req.nextUrl.origin}/api/frame/tip/${username}` },
      { label: 'View Latest Tips', action: 'post', target: `${req.nextUrl.origin}/api/frame/latest-tips/${username}` },
    ],
    input: { text: 'Custom Tip Amount (USDC)' },
    postUrl: `${req.nextUrl.origin}/api/frame/tip/${username}`,
  };

  return NextResponse.json(frameResponse);
}

// TODO: Implement POST handlers for tip, latest-tips, custom amount
// For tip: Return frame with transaction action or redirect to app
// Integrate with OnchainKit for transaction frames if possible
