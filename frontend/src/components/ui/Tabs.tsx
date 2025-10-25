'use client';

import React from 'react';

export type TabOption = 'daily' | 'monthly' | 'yearly';

interface Tab<T extends string = TabOption> {
  id: T;
  label: string;
}

interface TabsProps<T extends string = TabOption> {
  tabs: Tab<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  className?: string;
}

export default function Tabs<T extends string = TabOption>({ tabs, activeTab, onTabChange, className }: TabsProps<T>) {
  return (
    <div className={`w-full bg-white rounded-lg shadow-sm border border-slate-200 p-1 ${className ?? ''}`}>
      <div className="flex w-full gap-2 rounded-md overflow-hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 min-w-0 flex items-center justify-center h-9 text-sm font-medium transition-all rounded-md ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="truncate px-4">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
