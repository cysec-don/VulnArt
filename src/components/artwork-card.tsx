'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gavel } from 'lucide-react';

const categoryColors: Record<string, string> = {
  classical: 'from-amber-200 to-orange-200 dark:from-amber-900/40 dark:to-orange-900/40',
  modern: 'from-violet-200 to-pink-200 dark:from-violet-900/40 dark:to-pink-900/40',
  cyberpunk: 'from-cyan-200 to-teal-200 dark:from-cyan-900/40 dark:to-teal-900/40',
  abstract: 'from-rose-200 to-red-200 dark:from-rose-900/40 dark:to-red-900/40',
  realistic: 'from-emerald-200 to-green-200 dark:from-emerald-900/40 dark:to-green-900/40',
};

const categoryAccent: Record<string, string> = {
  classical: 'text-amber-700 dark:text-amber-300',
  modern: 'text-violet-700 dark:text-violet-300',
  cyberpunk: 'text-cyan-700 dark:text-cyan-300',
  abstract: 'text-rose-700 dark:text-rose-300',
  realistic: 'text-emerald-700 dark:text-emerald-300',
};

interface ArtworkCardProps {
  artwork: {
    id: string;
    title: string;
    artist: string;
    category: string;
    price: number;
    rentPrice: number;
    image?: string;
    isForAuction: boolean;
    auctions?: { currentPrice: number }[];
  };
  index?: number;
}

export function ArtworkCard({ artwork, index = 0 }: ArtworkCardProps) {
  const colorClass = categoryColors[artwork.category] || categoryColors.abstract;
  const accentClass = categoryAccent[artwork.category] || categoryAccent.abstract;
  const auctionPrice = artwork.auctions?.[0]?.currentPrice;
  const [imgError, setImgError] = useState(false);

  const hasImage = artwork.image && !imgError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/artwork/${artwork.id}`}>
        <Card className="group overflow-hidden border-border/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-1 cursor-pointer">
          <div className={`relative aspect-[4/3] bg-gradient-to-br ${colorClass} flex items-center justify-center overflow-hidden`}>
            {hasImage ? (
              <Image
                src={artwork.image!}
                alt={artwork.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="text-center p-6 transition-transform duration-300 group-hover:scale-105">
                <p className={`text-lg font-semibold ${accentClass} opacity-80`}>
                  {artwork.title}
                </p>
                <p className="text-sm text-muted-foreground mt-1 opacity-60">
                  by {artwork.artist}
                </p>
              </div>
            )}
            {artwork.isForAuction && (
              <div className="absolute top-3 right-3 z-10">
                <Badge className="bg-amber-600 text-white hover:bg-amber-700 shadow-lg">
                  <Gavel className="h-3 w-3 mr-1" />
                  Auction
                </Badge>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-sm truncate">{artwork.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{artwork.artist}</p>
              </div>
              <Badge variant="secondary" className="text-[10px] shrink-0">
                {artwork.category}
              </Badge>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
              {artwork.isForAuction && auctionPrice ? (
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Current Bid</p>
                  <p className="text-sm font-bold text-amber-600">${auctionPrice.toLocaleString()}</p>
                </div>
              ) : (
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Price</p>
                  <p className="text-sm font-bold">${artwork.price.toLocaleString()}</p>
                </div>
              )}
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Rent/day</p>
                <p className="text-sm font-medium text-muted-foreground">${artwork.rentPrice}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
