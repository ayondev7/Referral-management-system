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

const gradientClasses: Record<string, string> = {
  'gradient-blue': 'border-l-4 border-l-blue-600 bg-blue-50/50',
  'gradient-green': 'border-l-4 border-l-emerald-600 bg-emerald-50/50',
  'gradient-purple': 'border-l-4 border-l-purple-600 bg-purple-50/50',
};

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, gradient }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`${gradient ? gradientClasses[gradient] || '' : ''}`}>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-slate-900 opacity-80 uppercase tracking-wide">{title}</p>
            <h2 className="text-4xl font-bold text-slate-900">{value}</h2>
          </div>
          {icon && <div className="text-5xl opacity-20">{icon}</div>}
        </div>
      </Card>
    </motion.div>
  );
};
