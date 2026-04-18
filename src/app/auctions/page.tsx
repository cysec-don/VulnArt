'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AuctionCard } from '@/components/auction-card';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';
import { Gavel, RefreshCw } from 'lucide-react';

export default function AuctionsPage() {
  const { user, fetchUser } = useAuthStore();
  const [auctions, setAuctions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/marketplace/auctions');
      if (res.ok) {
        const data = await res.json();
        setAuctions(data.auctions || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleBid = async (auctionId: string, amount: number) => {
    if (!user) {
      toast.error('Please sign in to place bids');
      return;
    }

    const res = await fetch('/api/marketplace/bid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auctionId, amount }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success('Bid placed successfully!');
      if (data.hint) {
        toast.info('🔓 You discovered something interesting...');
      }
      fetchUser();
      fetchAuctions();
    } else {
      toast.error(data.error || 'Bid failed');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
              <Gavel className="h-8 w-8 text-amber-600" />
              Live Auctions
            </h1>
            <p className="text-muted-foreground text-lg">
              Bid on exclusive artworks and compete with collectors worldwide
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchAuctions}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="rounded-xl bg-muted aspect-[2/1]" />
              <div className="mt-3 space-y-2 p-4">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : auctions.length === 0 ? (
        <div className="text-center py-20">
          <Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl text-muted-foreground">No active auctions</p>
          <p className="text-sm text-muted-foreground mt-2">Check back later for new auctions</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction: any) => (
            <AuctionCard
              key={auction.id}
              auction={auction}
              onBid={user ? handleBid : undefined}
              userBalance={user?.balance}
            />
          ))}
        </div>
      )}
    </div>
  );
}
