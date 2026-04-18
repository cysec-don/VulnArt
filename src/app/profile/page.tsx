'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store/auth-store';
import { FlagSubmitForm } from '@/components/flag-submit-form';
import {
  User,
  ShoppingBag,
  Clock,
  Gavel,
  Trophy,
  DollarSign,
  Calendar,
  Package,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, fetchUser } = useAuthStore();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [flagSubmissions, setFlagSubmissions] = useState<any[]>([]);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      let cancelled = false;
      const load = async () => {
        try {
          const [purchasesRes, rentalsRes, bidsRes] = await Promise.all([
            fetch('/api/users/purchases'),
            fetch('/api/users/rentals'),
            fetch('/api/users/bids'),
          ]);
          if (cancelled) return;
          if (purchasesRes.ok) {
            const data = await purchasesRes.json();
            setPurchases(data.purchases || []);
          }
          if (rentalsRes.ok) {
            const data = await rentalsRes.json();
            setRentals(data.rentals || []);
          }
          if (bidsRes.ok) {
            const data = await bidsRes.json();
            setBids(data.bids || []);
          }
        } catch {
          // ignore
        }
      };
      load();
      return () => { cancelled = true; };
    }
  }, [user, isLoading]);

  if (isLoading || !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-2xl font-bold">
                {user.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{user.name || user.username}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    className={
                      user.role === 'admin'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        : user.role === 'premium'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                        : ''
                    }
                    variant="secondary"
                  >
                    {user.role === 'admin' ? '👑 Admin' : user.role === 'premium' ? '⭐ Premium' : '👤 Member'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Member since {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-3xl font-bold text-amber-600">
                  ${user.balance.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <ShoppingBag className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{purchases.length}</p>
                <p className="text-sm text-muted-foreground">Purchases</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                <Clock className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rentals.length}</p>
                <p className="text-sm text-muted-foreground">Rentals</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                <Gavel className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{bids.length}</p>
                <p className="text-sm text-muted-foreground">Bids</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="purchases" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="purchases">
            <ShoppingBag className="h-4 w-4 mr-1 sm:mr-2 hidden sm:inline" />
            Purchases
          </TabsTrigger>
          <TabsTrigger value="rentals">
            <Clock className="h-4 w-4 mr-1 sm:mr-2 hidden sm:inline" />
            Rentals
          </TabsTrigger>
          <TabsTrigger value="bids">
            <Gavel className="h-4 w-4 mr-1 sm:mr-2 hidden sm:inline" />
            Bids
          </TabsTrigger>
          <TabsTrigger value="rewards">
            <Trophy className="h-4 w-4 mr-1 sm:mr-2 hidden sm:inline" />
            Rewards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>Artworks you&apos;ve purchased</CardDescription>
            </CardHeader>
            <CardContent>
              {purchases.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No purchases yet</p>
              ) : (
                <div className="space-y-3">
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{purchase.artwork?.title || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{purchase.artwork?.artist}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">${purchase.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rentals">
          <Card>
            <CardHeader>
              <CardTitle>Rental History</CardTitle>
              <CardDescription>Artworks you&apos;re renting</CardDescription>
            </CardHeader>
            <CardContent>
              {rentals.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No rentals yet</p>
              ) : (
                <div className="space-y-3">
                  {rentals.map((rental) => (
                    <div key={rental.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-cyan-600" />
                        <div>
                          <p className="font-medium text-sm">{rental.artwork?.title || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{rental.artwork?.artist}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">${rental.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {rental.isActive ? 'Active' : 'Expired'} • Until {new Date(rental.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bids">
          <Card>
            <CardHeader>
              <CardTitle>Bid History</CardTitle>
              <CardDescription>Your auction bids</CardDescription>
            </CardHeader>
            <CardContent>
              {bids.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No bids yet</p>
              ) : (
                <div className="space-y-3">
                  {bids.map((bid) => (
                    <div key={bid.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Gavel className="h-5 w-5 text-violet-600" />
                        <div>
                          <p className="font-medium text-sm">{bid.auction?.artwork?.title || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{bid.auction?.artwork?.artist}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">${bid.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(bid.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards">
          <div className="space-y-6">
            <FlagSubmitForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
