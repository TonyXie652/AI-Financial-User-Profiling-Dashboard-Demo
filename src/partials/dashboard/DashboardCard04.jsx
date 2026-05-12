import React from 'react';
import DoughnutChart from '../../charts/DoughnutChart';

function DashboardCard04() {
  const chartData = {
    labels: ['高价值', '中价值', '低价值', '流失风险'],
    datasets: [
      {
        label: '用户价值总体分布',
        data: [32, 40, 10, 18],
        backgroundColor: [
          '#22C55E',
          '#3B82F6',
          '#94A3B8',
          '#F97316',
        ],
        hoverBackgroundColor: [
          '#16A34A',
          '#2563EB',
          '#64748B',
          '#EA580C',
        ],
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 14,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl transition-colors duration-500">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">用户价值总体分布</h2>
      </header>
      <DoughnutChart data={chartData} width={389} height={300} />
    </div>
  );
}

export default DashboardCard04;
