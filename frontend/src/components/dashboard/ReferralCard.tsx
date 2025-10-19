'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';

interface ReferralCardProps {
  referralLink: string;
}

export const ReferralCard: React.FC<ReferralCardProps> = ({ referralLink }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8"
    >
      <Card>
        <h3 className="text-2xl font-semibold mb-4 text-slate-900">Your Referral Link</h3>
        <div className="flex gap-4 mb-4 flex-col sm:flex-row">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 font-mono"
          />
          <Button onClick={handleCopy} variant="primary" size="md">
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <p className="text-sm text-slate-900 opacity-70">
          Share this link with friends. Earn 2 credits when they make their first purchase!
        </p>
      </Card>
    </motion.div>
  );
};
