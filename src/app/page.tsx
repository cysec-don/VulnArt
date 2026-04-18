'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth-store';
import { ArtworkCard } from '@/components/artwork-card';
import {
  Palette,
  ArrowRight,
  ShoppingBag,
  Gavel,
  Clock,
  Sparkles,
  TrendingUp,
  Shield,
} from 'lucide-react';

const categoryPreviews = [
  { name: 'Classical', slug: 'classical', description: 'Timeless masterpieces', color: 'from-amber-200 to-orange-200 dark:from-amber-900/40 dark:to-orange-900/40', count: 10 },
  { name: 'Modern', slug: 'modern', description: 'Bold contemporary visions', color: 'from-violet-200 to-pink-200 dark:from-violet-900/40 dark:to-pink-900/40', count: 10 },
  { name: 'Cyberpunk', slug: 'cyberpunk', description: 'Neon-lit futures', color: 'from-cyan-200 to-teal-200 dark:from-cyan-900/40 dark:to-teal-900/40', count: 10 },
  { name: 'Abstract', slug: 'abstract', description: 'Beyond the visible', color: 'from-rose-200 to-red-200 dark:from-rose-900/40 dark:to-red-900/40', count: 10 },
  { name: 'Realistic', slug: 'realistic', description: 'Hyper-real detail', color: 'from-emerald-200 to-green-200 dark:from-emerald-900/40 dark:to-green-900/40', count: 10 },
];

export default function HomePage() {
  const { fetchUser } = useAuthStore();
  const [featuredArtworks, setFeaturedArtworks] = useState<any[]>([]);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadFeatured = async () => {
      try {
        const res = await fetch('/api/artworks?limit=8');
        if (res.ok && !cancelled) {
          const data = await res.json();
          setFeaturedArtworks(data.artworks || []);
        }
      } catch {
        // ignore
      }
    };
    loadFeatured();
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      {/* FLAG: w3lcome_to_vuln_art - hidden in HTML source */}
      {/* FLAG{w3lcome_to_vuln_art} */}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-rose-950/10" />
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-300 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-300 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-sm font-medium mb-8"
            >
              <Sparkles className="h-4 w-4" />
              Discover extraordinary art
            </motion.div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="block">Where Art Meets</span>
              <span className="block bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
                Digital Collection
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-10">
              Browse, buy, rent, and auction extraordinary artworks from world-class artists.
              Your next masterpiece awaits.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-lg px-8 h-12"
                asChild
              >
                <Link href="/gallery">
                  Explore Gallery
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 h-12"
                asChild
              >
                <Link href="/auctions">
                  <Gavel className="mr-2 h-5 w-5" />
                  Live Auctions
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-3xl mx-auto"
          >
            {[
              { icon: Palette, label: 'Artworks', value: '50+' },
              { icon: ShoppingBag, label: 'Collectors', value: '1.2K' },
              { icon: Gavel, label: 'Auctions', value: '4 Live' },
              { icon: TrendingUp, label: 'Volume', value: '$2.4M' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="h-5 w-5 mx-auto text-amber-600 mb-2" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Browse by Category</h2>
            <p className="text-muted-foreground text-lg">
              Explore our curated collections across five distinct styles
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {categoryPreviews.map((cat, index) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href={`/gallery?category=${cat.slug}`}>
                  <Card className="group overflow-hidden border-border/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                    <div className={`aspect-[3/2] bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                      <div className="text-center p-4 transition-transform duration-300 group-hover:scale-105">
                        <p className="font-semibold text-lg">{cat.name}</p>
                        <p className="text-sm opacity-70">{cat.description}</p>
                      </div>
                    </div>
                    <CardContent className="p-3 text-center">
                      <p className="text-sm text-muted-foreground">{cat.count} artworks</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Featured Artworks */}
      {featuredArtworks.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-muted/30">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Featured Artworks</h2>
            <p className="text-muted-foreground text-lg">
              Handpicked masterpieces from our collection
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {featuredArtworks.map((artwork, index) => (
              <ArtworkCard key={artwork.id} artwork={artwork} index={index} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Button size="lg" variant="outline" asChild>
              <Link href="/gallery">
                View All Artworks
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">How It Works</h2>
          <p className="text-muted-foreground text-lg">
            Three ways to enjoy extraordinary art
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: ShoppingBag,
              title: 'Buy & Own',
              description: 'Purchase artworks outright and add them to your permanent collection. Full ownership, full beauty.',
            },
            {
              icon: Clock,
              title: 'Rent & Enjoy',
              description: 'Rent artworks by the day for your space or digital display. Flexible durations, affordable prices.',
            },
            {
              icon: Gavel,
              title: 'Bid & Win',
              description: 'Participate in live auctions for exclusive pieces. Place your bid and compete with collectors worldwide.',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
            >
              <Card className="h-full border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600 via-orange-600 to-rose-600 p-8 sm:p-12 text-center text-white"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Start Your Collection Today
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of art enthusiasts and begin your journey into the world of digital art collection.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 h-12 bg-white text-amber-700 hover:bg-amber-50"
                asChild
              >
                <Link href="/register">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
