import React, { useMemo, useState } from 'react';
import LineChart from '../../charts/LineChart02';

const labels = [
  '01-01-2026',
  '01-08-2026',
  '01-15-2026',
  '01-22-2026',
  '01-29-2026',
  '02-05-2026',
  '02-12-2026',
  '02-19-2026',
  '02-26-2026',
  '03-05-2026',
  '03-12-2026',
  '03-19-2026',
];

const kpiGroups = {
  用户价值: [
    {
      label: '综合用户价值指数',
      data: [62, 66, 64, 71, 69, 76, 73, 79, 75, 82, 80, 86],
      color: '#8B5CF6',
    },
    {
      label: '高价值用户数',
      data: [52, 55, 58, 57, 63, 68, 66, 72, 76, 74, 81, 84],
      color: '#22C55E',
    },
    {
      label: '潜在付费用户数',
      data: [34, 38, 41, 43, 40, 48, 51, 49, 55, 58, 62, 65],
      color: '#3B82F6',
    },
  ],
  行为活跃: [
    {
      label: '日活跃指数',
      data: [48, 54, 52, 61, 58, 64, 69, 66, 72, 76, 74, 81],
      color: '#06B6D4',
    },
    {
      label: '访问频次指数',
      data: [36, 39, 45, 43, 51, 48, 55, 59, 57, 64, 68, 70],
      color: '#F59E0B',
    },
    {
      label: '沉默唤醒指数',
      data: [28, 31, 35, 33, 42, 39, 46, 44, 52, 49, 55, 59],
      color: '#A855F7',
    },
  ],
  标签体系: [
    {
      label: '标签覆盖指数',
      data: [42, 46, 51, 55, 57, 62, 66, 69, 72, 76, 79, 83],
      color: '#10B981',
    },
    {
      label: '平均标签指数',
      data: [38, 41, 45, 44, 50, 54, 52, 58, 61, 63, 68, 71],
      color: '#60A5FA',
    },
    {
      label: '标签更新效率',
      data: [31, 36, 34, 43, 47, 45, 53, 56, 54, 62, 65, 69],
      color: '#F97316',
    },
  ],
  AI预测: [
    {
      label: '实际价值',
      data: [70, 72, 75, 73, 78, 80, 77, 83, 85, 84, 88, 90],
      color: '#818CF8',
    },
    {
      label: 'AI预测价值',
      data: [44, 48, 51, 57, 55, 62, 66, 64, 71, 74, 78, 82],
      color: '#22C55E',
    },
    {
      label: '流失风险指数',
      data: [58, 55, 61, 57, 64, 60, 68, 65, 72, 69, 76, 73],
      color: '#F97316',
    },
  ],
  群体画像: [
    {
      label: '核心群体指数',
      data: [56, 60, 58, 65, 69, 66, 73, 75, 72, 80, 82, 86],
      color: '#14B8A6',
    },
    {
      label: '成长群体指数',
      data: [39, 44, 48, 46, 53, 57, 55, 63, 66, 64, 72, 75],
      color: '#3B82F6',
    },
    {
      label: '风险群体指数',
      data: [52, 49, 55, 51, 59, 56, 63, 60, 68, 65, 72, 70],
      color: '#F43F5E',
    },
  ],
};

function toDataset(item) {
  return {
    label: item.label,
    data: item.data,
    borderColor: item.color,
    fill: false,
    borderWidth: 2,
    pointRadius: 0,
    pointHoverRadius: 4,
    pointBackgroundColor: item.color,
    pointHoverBackgroundColor: item.color,
    pointBorderWidth: 0,
    pointHoverBorderWidth: 0,
    clip: 20,
    tension: 0.35,
  };
}

function DashboardCard06() {
  const [activeGroup, setActiveGroup] = useState('用户价值');
  const activeLines = kpiGroups[activeGroup];

  const chartData = useMemo(() => ({
    labels,
    datasets: activeLines.map(toDataset),
  }), [activeLines]);

  return (
    <div className="flex flex-col col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl transition-colors duration-500">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">KPI统计折线图</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              当前展示：
              <span className="font-semibold text-gray-800 dark:text-gray-100">{activeGroup} KPI</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(kpiGroups).map((group) => {
              const isActive = group === activeGroup;
              return (
                <button
                  key={group}
                  type="button"
                  onClick={() => setActiveGroup(group)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-violet-500 text-white shadow-sm shadow-violet-500/30'
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900 dark:bg-gray-700/60 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  {group}
                </button>
              );
            })}
          </div>
        </div>
      </header>
      <LineChart data={chartData} width={595} height={248} />
    </div>
  );
}

export default DashboardCard06;
