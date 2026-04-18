'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArtworkGrid } from '@/components/artwork-grid';
import { Search, SlidersHorizontal } from 'lucide-react';

const categories = [
  { slug: 'all', label: 'All' },
  { slug: 'classical', label: 'Classical' },
  { slug: 'modern', label: 'Modern' },
  { slug: 'cyberpunk', label: 'Cyberpunk' },
  { slug: 'abstract', label: 'Abstract' },
  { slug: 'realistic', label: 'Realistic' },
];

export default function GalleryPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [artworks, setArtworks] = useState<any[]>([]);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArtworks();
  }, [category, search]);

  const fetchArtworks = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.set('category', category);
      if (search) params.set('search', search);
      params.set('limit', '50');

      const res = await fetch(`/api/artworks?${params}`);
      if (res.ok) {
        const data = await res.json();
        setArtworks(data.artworks || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Gallery</h1>
        <p className="text-muted-foreground text-lg">
          Browse our collection of extraordinary artworks
        </p>
      </motion.div>

      {/* Filters */}
      <div className="space-y-4 mb-8">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search artworks, artists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.slug}
              variant={category === cat.slug ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory(cat.slug)}
              className={
                category === cat.slug
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : ''
              }
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="rounded-xl bg-muted aspect-[4/3]" />
              <div className="mt-3 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : artworks.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No artworks found</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search</p>
        </div>
      ) : (
        <ArtworkGrid artworks={artworks} />
      )}
    </div>
  );
}
