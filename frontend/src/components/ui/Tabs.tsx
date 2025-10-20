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
}

export default function Tabs<T extends string = TabOption>({ tabs, activeTab, onTabChange }: TabsProps<T>) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-slate-200 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center justify-center h-9 px-6 rounded-md text-sm font-medium transition-all ${
            activeTab === tab.id
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
