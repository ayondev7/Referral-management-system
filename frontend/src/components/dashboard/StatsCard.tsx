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
  'gradient-blue': 'border-2 border-blue-300/50 before:bg-gradient-to-br before:from-blue-500 before:to-cyan-600',
  'gradient-green': 'border-2 border-emerald-300/50 before:bg-gradient-to-br before:from-emerald-500 before:to-teal-600',
  'gradient-purple': 'border-2 border-purple-300/50 before:bg-gradient-to-br before:from-purple-500 before:to-pink-600',
};

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, gradient }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`relative overflow-hidden ${gradient ? gradientClasses[gradient] || '' : ''} before:content-[''] before:absolute before:inset-0 before:opacity-[0.08] before:z-0`}>
        <div className="relative z-10 flex justify-between items-center">
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
