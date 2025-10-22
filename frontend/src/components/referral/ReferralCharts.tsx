'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { TabOption } from '@/components/ui/Tabs';
import { ReferralChartData } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ReferralChartsProps {
  data: ReferralChartData;
  timeRange: TabOption;
}

export default function ReferralCharts({ data, timeRange }: ReferralChartsProps) {
  const doughnutData = {
    labels: ['Converted', 'Pending'],
    datasets: [
      {
        data: [data.converted, data.pending],
        backgroundColor: [
          'rgba(21, 93, 253, 0.8)',
          'rgba(21, 93, 253, 0.4)',
        ],
        borderColor: [
          'rgba(21, 93, 253, 1)',
          'rgba(21, 93, 253, 0.6)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: { label?: string; parsed: number; dataset: { data: number[] } }) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const barData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Converted',
        data: data.convertedData,
        backgroundColor: 'rgba(21, 93, 253, 0.8)',
        borderColor: 'rgb(21, 93, 253)',
        borderWidth: 1,
      },
      {
        label: 'Pending',
        data: data.pendingData,
        backgroundColor: 'rgba(21, 93, 253, 0.4)',
        borderColor: 'rgba(21, 93, 253, 0.6)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 13,
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4 text-center">
          Status Distribution
        </h3>
        <div className="h-56 sm:h-64">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">
          Referrals Over Time
        </h3>
        <div className="h-56 sm:h-64">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}
