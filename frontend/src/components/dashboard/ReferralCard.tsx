'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';

interface ReferralCardProps {
  referralLink: string;
  compact?: boolean;
}

const ReferralCard: React.FC<ReferralCardProps> = ({ referralLink, compact = false }) => {
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
      className={compact ? 'mb-0' : 'mb-8'}
    >
  <Card className={(compact ? 'p-4 !shadow-none' : '')}>
        <h3
          className={
            compact
              ? 'text-lg font-semibold mb-2 text-slate-900'
              : 'text-2xl font-semibold mb-4 text-slate-900'
          }
        >
          Your Referral Link
        </h3>

        <div
          className={
            compact
              ? 'flex items-center gap-3 mb-2'
              : 'flex gap-4 mb-4 flex-col sm:flex-row'
          }
        >
          <input
            type="text"
            value={referralLink}
            readOnly
            className={
              (compact ? 'px-3 py-2 text-xs ' : 'px-4 py-3 text-sm ') +
              'flex-1 border border-slate-200 rounded-sm bg-white text-slate-900 font-mono'
            }
          />
          <Button onClick={handleCopy} variant="primary" size={compact ? 'sm' : 'md'}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>

        <p className={compact ? 'text-xs text-slate-900 opacity-70' : 'text-sm text-slate-900 opacity-70'}>
          Share this link with friends. Earn 2 credits when they make their first purchase!
        </p>
      </Card>
    </motion.div>
  );
};

export default ReferralCard;
