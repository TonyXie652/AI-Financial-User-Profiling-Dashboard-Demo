import React, { useMemo, useState } from 'react';
import LineChart from '../../charts/LineChart02';

const financePalette = {
  primaryBlue: '#2F6FDB',
  signalRed: '#C2413F',
  slateGray: '#475569',
};

const timeRangeConfig = {
  '7d': {
    label: '近7天',
    unit: 'day',
    labels: ['05-07-2026', '05-08-2026', '05-09-2026', '05-10-2026', '05-11-2026', '05-12-2026', '05-13-2026'],
    historyPoints: 5,
    trend: 'short',
  },
  '30d': {
    label: '近30天',
    unit: 'day',
    labels: ['04-14-2026', '04-19-2026', '04-24-2026', '04-29-2026', '05-04-2026', '05-09-2026', '05-14-2026'],
    historyPoints: 5,
    trend: 'medium',
  },
  '90d': {
    label: '近90天',
    unit: 'week',
    labels: ['02-12-2026', '02-26-2026', '03-12-2026', '03-26-2026', '04-09-2026', '04-23-2026', '05-07-2026', '05-21-2026'],
    historyPoints: 6,
    trend: 'quarter',
  },
  '1y': {
    label: '近一年',
    unit: 'month',
    labels: ['06-01-2025', '07-01-2025', '08-01-2025', '09-01-2025', '10-01-2025', '11-01-2025', '12-01-2025', '01-01-2026', '02-01-2026', '03-01-2026', '04-01-2026', '05-01-2026', '06-01-2026'],
    historyPoints: 9,
    trend: 'year',
  },
};

const rangeSeries = {
  short: {
    history: [58, 61, 59, 65, 68],
    forecast: [68, 71, 73],
  },
  medium: {
    history: [46, 52, 57, 63, 66],
    forecast: [66, 70, 74],
  },
  quarter: {
    history: [42, 48, 51, 58, 64, 67],
    forecast: [67, 72, 76],
  },
  year: {
    history: [39, 42, 48, 44, 53, 51, 61, 66, 70],
    forecast: [70, 68, 74, 78, 76],
  },
};

const kpiGroups = {
  用户价值: [
    {
      label: '综合用户价值指数',
      color: financePalette.primaryBlue,
      offset: 0,
    },
    {
      label: '高价值用户数',
      color: financePalette.slateGray,
      offset: -8,
    },
    {
      label: '潜在付费用户数',
      color: financePalette.signalRed,
      offset: -18,
    },
  ],
  行为活跃: [
    {
      label: '日活跃指数',
      color: financePalette.primaryBlue,
      offset: 4,
    },
    {
      label: '工具使用指数',
      color: financePalette.slateGray,
      offset: -6,
    },
    {
      label: '内容浏览指数',
      color: financePalette.signalRed,
      offset: -12,
    },
  ],
  标签体系: [
    {
      label: '标签覆盖指数',
      color: financePalette.primaryBlue,
      offset: 2,
    },
    {
      label: '平均标签指数',
      color: financePalette.slateGray,
      offset: -9,
    },
    {
      label: '标签更新效率',
      color: financePalette.signalRed,
      offset: -15,
    },
  ],
  AI预测: [
    {
      label: '实际价值指数',
      color: financePalette.primaryBlue,
      offset: 5,
    },
    {
      label: 'AI预测价值',
      color: financePalette.slateGray,
      offset: -2,
    },
    {
      label: '流失风险指数',
      color: financePalette.signalRed,
      offset: -10,
      invert: true,
    },
  ],
  群体画像: [
    {
      label: '核心人群指数',
      color: financePalette.primaryBlue,
      offset: 1,
    },
    {
      label: '成长人群指数',
      color: financePalette.slateGray,
      offset: -11,
    },
    {
      label: '风险人群指数',
      color: financePalette.signalRed,
      offset: -6,
      invert: true,
    },
  ],
};

function clampValue(value) {
  return Math.max(18, Math.min(80, value));
}

function applyMetricShape(values, item) {
  return values.map((value, index) => {
    const drift = item.invert ? index * -2 : index % 2 === 0 ? 0 : 2;
    return clampValue(value + item.offset + drift);
  });
}

function createTrendDatasets(item, rangeConfig) {
  const { labels, historyPoints, trend } = rangeConfig;
  const baseSeries = rangeSeries[trend];
  const history = applyMetricShape(baseSeries.history.slice(0, historyPoints), item);
  const shapedForecast = applyMetricShape(baseSeries.forecast, item);
  const forecast = [
    history[history.length - 1],
    ...shapedForecast.slice(1),
  ];
  const forecastOffset = history.length - 1;
  const baseOptions = {
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
    spanGaps: false,
  };

  return [
    {
      ...baseOptions,
      label: `${item.label} 历史数据`,
      metricLabel: item.label,
      segmentLabel: '历史数据',
      data: [
        ...history,
        ...Array(labels.length - history.length).fill(null),
      ],
      borderColor: item.color,
    },
    {
      ...baseOptions,
      label: `${item.label} AI预测`,
      metricLabel: item.label,
      segmentLabel: 'AI预测',
      data: [
        ...Array(forecastOffset).fill(null),
        ...forecast,
      ],
      borderColor: item.color,
      borderDash: [6, 5],
    },
  ];
}

function DashboardCard06({ timeRange = '30d' }) {
  const [activeGroup, setActiveGroup] = useState('用户价值');
  const activeLines = kpiGroups[activeGroup];
  const rangeConfig = timeRangeConfig[timeRange] || timeRangeConfig['30d'];

  const chartData = useMemo(() => ({
    labels: rangeConfig.labels,
    datasets: activeLines.flatMap((item) => createTrendDatasets(item, rangeConfig)),
  }), [activeLines, rangeConfig]);

  return (
    <div className="flex flex-col col-span-full bg-white hover:bg-blue-50/40 dark:bg-gray-900 dark:hover:bg-white/[0.04] shadow-xs dark:shadow-[0_12px_28px_rgba(0,0,0,0.26)] rounded-xl transition-colors duration-300">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">KPI统计折线图</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              当前展示：
              <span className="font-semibold text-gray-800 dark:text-gray-100">{activeGroup} KPI</span>
              <span className="mx-2 text-gray-300 dark:text-gray-600">/</span>
              <span>{rangeConfig.label}</span>
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
                      ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/20'
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
      <LineChart
        data={chartData}
        timeUnit={rangeConfig.unit}
        width={595}
        height={248}
      />
    </div>
  );
}

export default DashboardCard06;
