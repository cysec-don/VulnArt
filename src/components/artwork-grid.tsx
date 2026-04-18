'use client';

import { ArtworkCard } from './artwork-card';

interface ArtworkGridProps {
  artworks: any[];
}

export function ArtworkGrid({ artworks }: ArtworkGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {artworks.map((artwork, index) => (
        <ArtworkCard key={artwork.id} artwork={artwork} index={index} />
      ))}
    </div>
  );
}
