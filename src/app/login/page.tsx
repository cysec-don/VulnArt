'use client';

import { AuthForm } from '@/components/auth-form';
import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Developer note: default admin account is curator_mike / m1k3curat0r */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AuthForm mode="login" />
      </motion.div>
    </div>
  );
}
