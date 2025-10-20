'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { TabOption } from '@/components/ui/Tabs';
import { ReferralChartData } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
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
          'rgba(34, 197, 94, 0.8)',
          'rgba(234, 179, 8, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(234, 179, 8, 1)',
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
          label: function(context: any) {
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

  const timeSeriesData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Converted',
        data: data.convertedData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Pending',
        data: data.pendingData,
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Converted',
        data: data.convertedData,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Pending',
        data: data.pendingData,
        backgroundColor: 'rgba(234, 179, 8, 0.8)',
        borderColor: 'rgb(234, 179, 8)',
        borderWidth: 1,
      },
    ],
  };

  const timeSeriesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
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

  const getChartComponent = () => {
    if (timeRange === 'daily') {
      return <Line data={timeSeriesData} options={timeSeriesOptions} />;
    } else if (timeRange === 'monthly') {
      return <Bar data={barData} options={timeSeriesOptions} />;
    } else {
      return <Bar data={barData} options={timeSeriesOptions} />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">
          Status Distribution
        </h3>
        <div className="h-64">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Referrals Over Time
        </h3>
        <div className="h-64">
          {getChartComponent()}
        </div>
      </div>
    </div>
  );
}
