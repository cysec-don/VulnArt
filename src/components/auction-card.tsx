'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gavel, Clock, TrendingUp } from 'lucide-react';

interface AuctionCardProps {
  auction: {
    id: string;
    startPrice: number;
    currentPrice: number;
    minBid: number;
    endTime: string;
    isActive: boolean;
    artwork: {
      id: string;
      title: string;
      artist: string;
      category: string;
      price: number;
      image?: string;
    };
    bids: {
      amount: number;
      user: { username: string };
      createdAt: string;
    }[];
  };
  onBid?: (auctionId: string, amount: number) => Promise<void>;
  userBalance?: number;
}

const categoryColors: Record<string, string> = {
  classical: 'from-amber-200 to-orange-200 dark:from-amber-900/40 dark:to-orange-900/40',
  modern: 'from-violet-200 to-pink-200 dark:from-violet-900/40 dark:to-pink-900/40',
  cyberpunk: 'from-cyan-200 to-teal-200 dark:from-cyan-900/40 dark:to-teal-900/40',
  abstract: 'from-rose-200 to-red-200 dark:from-rose-900/40 dark:to-red-900/40',
  realistic: 'from-emerald-200 to-green-200 dark:from-emerald-900/40 dark:to-green-900/40',
};

function CountdownTimer({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const update = () => {
      const end = new Date(endTime).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Ended');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <Clock className="h-3.5 w-3.5 text-amber-600" />
      <span className="font-medium">{timeLeft}</span>
    </div>
  );
}

export function AuctionCard({ auction, onBid, userBalance }: AuctionCardProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [isBidding, setIsBidding] = useState(false);
  const [imgError, setImgError] = useState(false);
  const colorClass = categoryColors[auction.artwork.category] || categoryColors.abstract;
  const hasImage = auction.artwork.image && !imgError;

  const handleBid = async () => {
    if (!onBid || !bidAmount) return;
    setIsBidding(true);
    try {
      await onBid(auction.id, parseFloat(bidAmount));
      setBidAmount('');
    } finally {
      setIsBidding(false);
    }
  };

  const suggestedBid = auction.currentPrice + auction.minBid;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="overflow-hidden border-border/50 transition-all hover:shadow-lg hover:shadow-amber-500/5">
        <div className={`aspect-[2/1] bg-gradient-to-br ${colorClass} flex items-center justify-center overflow-hidden relative`}>
          {hasImage ? (
            <Image
              src={auction.artwork.image!}
              alt={auction.artwork.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="text-center p-4">
              <p className="text-lg font-semibold opacity-80">{auction.artwork.title}</p>
              <p className="text-sm opacity-60">by {auction.artwork.artist}</p>
            </div>
          )}
        </div>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{auction.artwork.category}</Badge>
            <CountdownTimer endTime={auction.endTime} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Bid</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-amber-600" />
                <span className="text-lg font-bold text-amber-600">
                  ${auction.currentPrice.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Starting Price</span>
              <span className="text-sm">${auction.startPrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Min Bid Increment</span>
              <span className="text-sm">${auction.minBid.toLocaleString()}</span>
            </div>
          </div>

          {auction.bids && auction.bids.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Recent Bids</p>
              {auction.bids.slice(0, 3).map((bid, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{bid.user.username}</span>
                  <span className="font-medium">${bid.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          {onBid && (
            <div className="space-y-2 pt-2 border-t border-border/50">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder={`Min: $${suggestedBid.toLocaleString()}`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                />
                <Button
                  onClick={handleBid}
                  disabled={isBidding || !bidAmount}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <Gavel className="h-4 w-4 mr-1" />
                  Bid
                </Button>
              </div>
              {userBalance !== undefined && (
                <p className="text-xs text-muted-foreground">
                  Your balance: ${userBalance.toLocaleString()}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
