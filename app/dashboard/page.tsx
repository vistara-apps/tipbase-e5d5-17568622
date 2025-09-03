'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components/AppShell';
import { Card, CardContent, CardHeader } from '@/components/Card';
import { ConnectWalletButton } from '@/components/ConnectWalletButton';

type Tip = {
  amount: string;
  supporter_address: string;
  timestamp: string;
  transaction_hash: string;
};

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [tips, setTips] = useState<Tip[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    if (!address) return;

    const fetchTips = async () => {
      const { data } = await supabase
        .from('tips')
        .select('*')
        .eq('creator_address', address)
        .order('timestamp', { ascending: false });

      if (data) {
        setTips(data);
        const total = data.reduce((sum, tip) => sum + parseFloat(tip.amount), 0);
        setTotalEarnings(total);
      }
    };
    fetchTips();
  }, [address]);

  if (!isConnected) {
    return (
      <AppShell>
        <div className="text-center py-8">
          <p className="mb-4">Connect wallet to view dashboard</p>
          <ConnectWalletButton />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Card variant="elevated">
        <CardHeader>
          <h1 className="text-h1">Creator Dashboard</h1>
          <p>Total Earnings: {totalEarnings} USDC</p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {tips.map((tip) => (
              <li key={tip.transaction_hash} className="border-b pb-2">
                <p>Amount: {tip.amount} USDC</p>
                <p>From: {tip.supporter_address.slice(0, 6)}...{tip.supporter_address.slice(-4)}</p>
                <p>Date: {new Date(tip.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </AppShell>
  );
}
