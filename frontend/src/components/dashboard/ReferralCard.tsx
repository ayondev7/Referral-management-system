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
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="referral-card">
        <h3 className="referral-title">Your Referral Link</h3>
        <div className="referral-content">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="referral-input"
          />
          <Button onClick={handleCopy} variant="primary" size="md">
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <p className="referral-description">
          Share this link with friends. Earn 2 credits when they make their first purchase!
        </p>
      </Card>
    </motion.div>
  );
};
