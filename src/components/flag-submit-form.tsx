'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth-store';
import { Send, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FlagSubmitForm() {
  const { user } = useAuthStore();
  const [flag, setFlag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    valid: boolean;
    tier?: string;
    points?: number;
    message?: string;
    alreadySubmitted?: boolean;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag.trim()) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await fetch('/api/flags/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flag: flag.trim() }),
      });

      const data = await res.json();
      setResult(data);

      if (data.valid) {
        toast.success(data.alreadySubmitted ? 'Flag already submitted!' : '🎉 Flag accepted!');
        if (!data.alreadySubmitted) {
          setFlag('');
        }
      } else {
        toast.error('Invalid flag');
      }
    } catch {
      toast.error('Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Card className="border-dashed border-amber-300/50 dark:border-amber-700/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-600" />
          Feedback &amp; Rewards
        </CardTitle>
        <CardDescription>
          Found something interesting? Submit feedback codes for rewards!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Enter feedback code..."
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              className="font-mono text-sm"
            />
            <Button
              type="submit"
              disabled={isSubmitting || !flag.trim()}
              className="bg-amber-600 hover:bg-amber-700 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {result.valid ? (
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-sm">
                    <p className="font-medium">{result.alreadySubmitted ? 'Already submitted!' : '✅ Code accepted!'}</p>
                    {result.tier && (
                      <p className="text-xs mt-1">
                        Tier: <span className="font-medium capitalize">{result.tier}</span>
                        {result.points && ` • ${result.points} points`}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-sm">
                    Invalid feedback code. Keep exploring!
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </CardContent>
    </Card>
  );
}
