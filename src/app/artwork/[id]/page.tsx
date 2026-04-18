'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';
import Image from 'next/image';
import {
  ShoppingBag,
  Clock,
  Gavel,
  ArrowLeft,
  DollarSign,
  Calendar,
  TrendingUp,
  Info,
} from 'lucide-react';

const categoryColors: Record<string, string> = {
  classical: 'from-amber-200 to-orange-200 dark:from-amber-900/40 dark:to-orange-900/40',
  modern: 'from-violet-200 to-pink-200 dark:from-violet-900/40 dark:to-pink-900/40',
  cyberpunk: 'from-cyan-200 to-teal-200 dark:from-cyan-900/40 dark:to-teal-900/40',
  abstract: 'from-rose-200 to-red-200 dark:from-rose-900/40 dark:to-red-900/40',
  realistic: 'from-emerald-200 to-green-200 dark:from-emerald-900/40 dark:to-green-900/40',
};

export default function ArtworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, fetchUser } = useAuthStore();
  const [artwork, setArtwork] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rentDays, setRentDays] = useState('30');
  const [bidAmount, setBidAmount] = useState('');
  const [isBuying, setIsBuying] = useState(false);
  const [isRenting, setIsRenting] = useState(false);
  const [isBidding, setIsBidding] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchArtwork();
    }
  }, [params.id]);

  const fetchArtwork = async () => {
    try {
      const res = await fetch(`/api/artworks/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setArtwork(data);
      } else {
        toast.error('Artwork not found');
      }
    } catch {
      toast.error('Failed to load artwork');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!user) {
      toast.error('Please sign in to purchase');
      router.push('/login');
      return;
    }
    setIsBuying(true);
    try {
      const res = await fetch('/api/marketplace/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artworkId: artwork.id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Purchase successful! 🎉');
        fetchUser();
        fetchArtwork();
      } else {
        toast.error(data.error || 'Purchase failed');
      }
    } catch {
      toast.error('Purchase failed');
    } finally {
      setIsBuying(false);
    }
  };

  const handleRent = async () => {
    if (!user) {
      toast.error('Please sign in to rent');
      router.push('/login');
      return;
    }
    setIsRenting(true);
    try {
      const res = await fetch('/api/marketplace/rent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artworkId: artwork.id, days: parseInt(rentDays) }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Rental successful! 🎉');
        if (data.hint) {
          toast.info('🔓 You discovered something interesting...');
        }
        fetchUser();
        fetchArtwork();
      } else {
        toast.error(data.error || 'Rental failed');
      }
    } catch {
      toast.error('Rental failed');
    } finally {
      setIsRenting(false);
    }
  };

  const handleBid = async () => {
    if (!user) {
      toast.error('Please sign in to bid');
      router.push('/login');
      return;
    }
    if (!bidAmount) return;
    setIsBidding(true);
    try {
      const auction = artwork.auctions?.[0];
      if (!auction) return;

      const res = await fetch('/api/marketplace/bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auctionId: auction.id, amount: parseFloat(bidAmount) }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Bid placed! 🎉');
        if (data.hint) {
          toast.info('🔓 You discovered something interesting...');
        }
        fetchUser();
        fetchArtwork();
      } else {
        toast.error(data.error || 'Bid failed');
      }
    } catch {
      toast.error('Bid failed');
    } finally {
      setIsBidding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-[4/3] bg-muted rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-20 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-xl text-muted-foreground">Artwork not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/gallery')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Gallery
        </Button>
      </div>
    );
  }

  const auction = artwork.auctions?.[0];
  const colorClass = categoryColors[artwork.category] || categoryColors.abstract;
  const totalRentCost = artwork.rentPrice * parseInt(rentDays || '0');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Button variant="ghost" className="mb-6" onClick={() => router.push('/gallery')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Gallery
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={`aspect-[4/3] bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center overflow-hidden relative`}>
            {artwork.image && !imgError ? (
              <Image
                src={artwork.image}
                alt={artwork.title}
                fill
                className="object-cover rounded-xl"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="text-center p-8">
                <p className="text-2xl font-semibold opacity-80">{artwork.title}</p>
                <p className="text-lg opacity-60 mt-2">by {artwork.artist}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="capitalize">{artwork.category}</Badge>
              {artwork.isForAuction && (
                <Badge className="bg-amber-600 text-white">
                  <Gavel className="h-3 w-3 mr-1" /> Auction
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold">{artwork.title}</h1>
            <p className="text-lg text-muted-foreground mt-1">by {artwork.artist}</p>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {artwork.description}
          </p>

          <Separator />

          {/* Buy Section */}
          {artwork.isForSale && !auction && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Purchase Price</p>
                    <p className="text-2xl font-bold">${artwork.price.toLocaleString()}</p>
                  </div>
                  <Button
                    onClick={handleBuy}
                    disabled={isBuying}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    {isBuying ? 'Processing...' : 'Buy Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rent Section */}
          {artwork.isForRent && !auction && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rent per day</p>
                    <p className="text-lg font-semibold">${artwork.rentPrice}/day</p>
                  </div>
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Number of days"
                    value={rentDays}
                    onChange={(e) => setRentDays(e.target.value)}
                    min="1"
                  />
                  <Button
                    onClick={handleRent}
                    disabled={isRenting}
                    className="bg-amber-600 hover:bg-amber-700 shrink-0"
                  >
                    {isRenting ? 'Renting...' : 'Rent'}
                  </Button>
                </div>
                {totalRentCost > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Total: ${totalRentCost.toLocaleString()} for {rentDays} days
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Auction Section */}
          {auction && (
            <Card className="border-amber-300/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-amber-600" />
                  Live Auction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Bid</p>
                    <p className="text-xl font-bold text-amber-600">
                      ${auction.currentPrice.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Starting Price</p>
                    <p className="text-lg font-semibold">${auction.startPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Min Bid Increment</p>
                    <p className="text-sm font-medium">${auction.minBid.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ends</p>
                    <p className="text-sm font-medium">{new Date(auction.endTime).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Input
                    type="number"
                    placeholder={`Min: $${(auction.currentPrice + auction.minBid).toLocaleString()}`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                  />
                  <Button
                    onClick={handleBid}
                    disabled={isBidding}
                    className="bg-amber-600 hover:bg-amber-700 shrink-0"
                  >
                    <Gavel className="mr-1 h-4 w-4" />
                    {isBidding ? 'Bidding...' : 'Place Bid'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Internal Notes - CTF: visible to all users */}
          {artwork.internalNotes && (
            <Card className="border-dashed border-amber-300/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-600">Internal Notes</span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">{artwork.internalNotes}</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
