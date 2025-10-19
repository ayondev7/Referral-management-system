'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@components/ui/Card';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  gradient?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, gradient }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`stats-card ${gradient || ''}`}>
        <div className="stats-content">
          <div className="stats-info">
            <p className="stats-title">{title}</p>
            <h2 className="stats-value">{value}</h2>
          </div>
          {icon && <div className="stats-icon">{icon}</div>}
        </div>
      </Card>
    </motion.div>
  );
};
