'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardContent, CardHeader } from '@/components/Card';
import { Avatar } from '@/components/Avatar';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';

type TimerProps = Promise<{
  username: string;
}>;

// USDC on Base
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const USDC_DECIMALS = 6;
const USDC_ABI = [
  {
    "constant": false,
    "inputs": [
      { "name": "to", "type": "address" },
      { "name": "value", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "name": "", "type": "bool" }],
    "type": "function"
  }
] as const;

type Creator = {
  creator_address: string;
  username: string;
  bio: string;
  profile_image_url: string;
  farcaster_fid: number | null;
};

export default async function TippingPage({ params }: { params: TimerProps }) {
  const { username } = await params;
  const { address: supporterAddress, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [tipAmount, setTipAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCreator = async () => {
      const { data } = await supabase
        .from('creators')
        .select('*')
        .eq('username', username)
        .single();
      setCreator(data);
    };
    fetchCreator();
  }, [username]);

  const handleTip = async (amount: string) => {
    if (!isConnected || !supporterAddress || !creator) return;

    setLoading(true);
    try {
      const value = parseUnits(amount, USDC_DECIMALS);
      const hash = await writeContractAsync({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [creator.creator_address, value],
      });

      // Log tip to Supabase
      await supabase.from('tips').insert({
        tip_id: hash,
        creator_address: creator.creator_address,
        supporter_address: supporterAddress,
        amount,
        transaction_hash: hash,
        timestamp: new Date().toISOString(),
      });

      setSuccess(true);
      // TODO: Send notifications (e.g., Farcaster cast if fid available)
    } catch (error) {
      console.error('Error sending tip:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!creator) return <div>Loading...</div>;

  return (
    <AppShell>
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar src={creator.profile_image_url || '/placeholder.svg'} alt={creator.username} size={48} />
            <div>
              <h1 className="text-h2">{creator.username}</h1>
              <p className="text-caption">{creator.bio}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="text-center">
              <p className="mb-4">Connect wallet to tip</p>
              <ConnectWalletButton />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Button onClick={() => handleTip('1')}>Tip 1 USDC</Button>
                <Button onClick={() => handleTip('5')}>Tip 5 USDC</Button>
                <Button onClick={() => handleTip('10')}>Tip 10 USDC</Button>
              </div>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Custom amount"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value)}
                />
                <Button onClick={() => handleTip(tipAmount)} disabled={!tipAmount || loading}>
                  {loading ? 'Tipping...' : 'Tip'}
                </Button>
              </div>
              {success && <p className="text-green-500">Tip sent successfully!</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
