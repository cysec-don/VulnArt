'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Shield,
  Users,
  Database,
  Activity,
  AlertTriangle,
  Key,
  RefreshCw,
} from 'lucide-react';

export default function AdminPanelPage() {
  const { user, isLoading, fetchUser } = useAuthStore();
  const router = useRouter();
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [flags, setFlags] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [showMasterFlag, setShowMasterFlag] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }
  }, [user, isLoading]);

  const fetchAdminData = async () => {
    try {
      const [usersRes, flagsRes, statsRes] = await Promise.all([
        fetch('/api/admin/users'),
        user?.role === 'admin' ? fetch('/api/admin/flags') : Promise.resolve(null),
        fetch('/api/internal/stats'),
      ]);

      if (usersRes.ok) {
        const data = await usersRes.json();
        setAdminUsers(data.users || []);
      }
      if (flagsRes?.ok) {
        const data = await flagsRes.json();
        setFlags(data.flags || []);
      }
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    } catch {
      // ignore
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-amber-600" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            FLAG{h1dd3n_4dm1n_p4n3l}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          System administration — authorized personnel only
        </p>
      </motion.div>

      {!isAdmin && user && (
        <Card className="border-red-200 dark:border-red-900/50 mb-8">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You need admin privileges to access this panel.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Hint: Is there a way to change your role?
            </p>
          </CardContent>
        </Card>
      )}

      <Button onClick={fetchAdminData} className="mb-6 bg-amber-600 hover:bg-amber-700">
        <RefreshCw className="h-4 w-4 mr-2" />
        Load Admin Data
      </Button>

      {isAdmin && (
        <div className="space-y-6">
          {/* Master Flag */}
          <Card className="border-amber-300/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-amber-600" />
                Master Flag
              </CardTitle>
              <CardDescription>The ultimate flag for those who found this panel</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => setShowMasterFlag(!showMasterFlag)}
                className="mb-3"
              >
                {showMasterFlag ? 'Hide' : 'Reveal'} Master Flag
              </Button>
              {showMasterFlag && (
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <p className="font-mono text-lg font-bold text-amber-700 dark:text-amber-300">
                    FLAG{'{m4st3r_0f_vuln}'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Expert tier — 1000 points
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Stats */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-amber-600" />
                  System Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(stats.stats || {}).map(([key, value]) => (
                    <div key={key} className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold">{String(value)}</p>
                      <p className="text-xs text-muted-foreground capitalize">{key}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Users List */}
          {adminUsers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-amber-600" />
                  Registered Users ({adminUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {adminUsers.map((u) => (
                    <div key={u.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium text-sm">{u.username}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="secondary"
                          className={
                            u.role === 'admin'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              : ''
                          }
                        >
                          {u.role}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          ${u.balance.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Flags List */}
          {flags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-amber-600" />
                  All Flags ({flags.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {flags.map((flag: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-mono text-sm font-medium">{flag.flag}</p>
                        <p className="text-xs text-muted-foreground">{flag.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="secondary"
                          className={
                            flag.tier === 'expert'
                              ? 'bg-purple-100 text-purple-800'
                              : flag.tier === 'hard'
                              ? 'bg-red-100 text-red-800'
                              : flag.tier === 'medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-green-100 text-green-800'
                          }
                        >
                          {flag.tier}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{flag.points} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
