'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardContent, CardHeader } from '@/components/Card';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [farcasterFid, setFarcasterFid] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageUrl, setPageUrl] = useState('');

  const handleCreatePage = async () => {
    if (!isConnected || !address) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('creators')
        .insert({
          creator_address: address,
          username,
          bio,
          profile_image_url: profileImageUrl,
          farcaster_fid: farcasterFid ? parseInt(farcasterFid) : null,
        })
        .select();

      if (error) throw error;

      const newUrl = `${window.location.origin}/${username}`;
      setPageUrl(newUrl);
    } catch (error) {
      console.error('Error creating page:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <Card variant="elevated">
        <CardHeader>
          <h1 className="text-h1">Create Your TipBase Page</h1>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="text-center">
              <p className="mb-4">Connect your wallet to get started</p>
              <ConnectWalletButton />
            </div>
          ) : (
            <form className="space-y-4">
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <Input
                placeholder="Profile Image URL"
                value={profileImageUrl}
                onChange={(e) => setProfileImageUrl(e.target.value)}
              />
              <Input
                placeholder="Farcaster FID (optional)"
                value={farcasterFid}
                onChange={(e) => setFarcasterFid(e.target.value)}
              />
              <Button onClick={handleCreatePage} disabled={loading || !username}>
                {loading ? 'Creating...' : 'Create Page'}
              </Button>
            </form>
          )}
          {pageUrl && (
            <p className="mt-4 text-center">Your page: <a href={pageUrl} className="text-primary">{pageUrl}</a></p>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
