import React, { useMemo, useState } from 'react';
import LineChart from '../../charts/LineChart02';

const financePalette = {
  primaryBlue: '#2F6FDB',
  signalRed: '#C2413F',
  accentTeal: '#14B8A6',
};

const DEFAULT_TIME_RANGE = '30d';
const DEFAULT_ACTIVE_GROUP = '用户价值';
const KPI_VALUE_MIN = 18;
const KPI_VALUE_MAX = 80;
const INVERTED_TREND_STEP = -2;
const EVEN_POINT_DRIFT = 0;
const ODD_POINT_DRIFT = 2;
const TREND_LINE_BORDER_WIDTH = 2;
const TREND_POINT_RADIUS = 0;
const TREND_POINT_HOVER_RADIUS = 4;
const TREND_POINT_BORDER_WIDTH = 0;
const TREND_CHART_CLIP_PADDING = 20;
const TREND_LINE_TENSION = 0.35;
const FORECAST_BORDER_DASH = [6, 5];
const KPI_TREND_CHART_DIMENSIONS = {
  width: 595,
  height: 248,
};
const METRIC_SHAPES = [
  {
    amplitude: 2.2,
    frequency: 0.75,
    phase: 0,
    slope: 1.4,
    variation: [0, 1, -1, 2, 0, -2, 1],
  },
  {
    amplitude: 3.2,
    frequency: 1.05,
    phase: 1.6,
    slope: -1.8,
    variation: [1, -2, 2, 3, -1, -3, 0, 2],
  },
  {
    amplitude: 2.8,
    frequency: 0.9,
    phase: 3.1,
    slope: 0.4,
    variation: [-1, 2, 0, -3, 1, 3, -2, 0],
  },
];

function padDateSegment(value) {
  return String(value).padStart(2, '0');
}

function createDateLabels(startDate, pointCount, stepDays = 1) {
  const [month, day, year] = startDate.split('-').map(Number);
  const start = new Date(year, month - 1, day);

  return Array.from({ length: pointCount }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index * stepDays);

    return [
      padDateSegment(date.getMonth() + 1),
      padDateSegment(date.getDate()),
      date.getFullYear(),
    ].join('-');
  });
}

const timeRangeConfig = {
  '7d': {
    label: '近7天',
    labels: ['05-07-2026', '05-08-2026', '05-09-2026', '05-10-2026', '05-11-2026', '05-12-2026', '05-13-2026'],
    historyPoints: 5,
    trend: 'short',
  },
  '30d': {
    label: '近30天',
    labels: createDateLabels('04-14-2026', 11, 3),
    historyPoints: 7,
    trend: 'medium',
  },
  '90d': {
    label: '近90天',
    labels: createDateLabels('02-13-2026', 14, 7),
    historyPoints: 10,
    trend: 'quarter',
  },
  '1y': {
    label: '近一年',
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
      color: financePalette.accentTeal,
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
      color: financePalette.accentTeal,
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
      color: financePalette.accentTeal,
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
      color: financePalette.accentTeal,
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
      color: financePalette.accentTeal,
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
  return Math.max(KPI_VALUE_MIN, Math.min(KPI_VALUE_MAX, value));
}

function interpolateSeries(anchors, pointCount) {
  if (anchors.length === pointCount) return anchors;
  if (pointCount <= 1) return anchors.slice(0, pointCount);

  return Array.from({ length: pointCount }, (_, index) => {
    const position = (index / (pointCount - 1)) * (anchors.length - 1);
    const leftIndex = Math.floor(position);
    const rightIndex = Math.min(leftIndex + 1, anchors.length - 1);
    const ratio = position - leftIndex;

    return anchors[leftIndex] + (anchors[rightIndex] - anchors[leftIndex]) * ratio;
  });
}

function applyMetricShape(values, item, startIndex = 0, shape = METRIC_SHAPES[0], totalPoints = values.length) {
  return values.map((value, index) => {
    const pointIndex = startIndex + index;
    const drift = item.invert
      ? pointIndex * INVERTED_TREND_STEP
      : pointIndex % 2 === 0
        ? EVEN_POINT_DRIFT
        : ODD_POINT_DRIFT;
    const progress = totalPoints > 1 ? pointIndex / (totalPoints - 1) : 0;
    const wave = Math.sin((pointIndex + shape.phase) * shape.frequency) * shape.amplitude;
    const variation = shape.variation[pointIndex % shape.variation.length];
    const momentum = (progress - 0.5) * shape.slope;

    return Math.round(clampValue(value + item.offset + drift + wave + variation + momentum));
  });
}

function createMetricSeries(item, rangeConfig, shape) {
  const { labels, historyPoints, trend } = rangeConfig;
  const baseSeries = rangeSeries[trend];
  const forecastPoints = labels.length - historyPoints;
  const history = interpolateSeries(baseSeries.history, historyPoints);
  const forecast = forecastPoints > 0
    ? interpolateSeries([history[history.length - 1], ...baseSeries.forecast.slice(1)], forecastPoints + 1).slice(1)
    : [];

  return applyMetricShape(
    [...history, ...forecast],
    item,
    0,
    shape,
    labels.length,
  );
}

function createTrendDatasets(item, rangeConfig, metricIndex) {
  const { historyPoints } = rangeConfig;
  const shape = METRIC_SHAPES[metricIndex % METRIC_SHAPES.length];
  const baseOptions = {
    fill: false,
    borderWidth: TREND_LINE_BORDER_WIDTH,
    pointRadius: TREND_POINT_RADIUS,
    pointHoverRadius: TREND_POINT_HOVER_RADIUS,
    pointBackgroundColor: item.color,
    pointHoverBackgroundColor: item.color,
    pointBorderWidth: TREND_POINT_BORDER_WIDTH,
    pointHoverBorderWidth: TREND_POINT_BORDER_WIDTH,
    clip: TREND_CHART_CLIP_PADDING,
    tension: TREND_LINE_TENSION,
    spanGaps: false,
    segment: {
      borderDash: (context) => (
        context.p0DataIndex >= historyPoints - 1 ? FORECAST_BORDER_DASH : undefined
      ),
    },
  };

  return {
    ...baseOptions,
    label: item.label,
    metricLabel: item.label,
    historyPoints,
    data: createMetricSeries(item, rangeConfig, shape),
    borderColor: item.color,
  };
}

function DashboardCard06({ timeRange = DEFAULT_TIME_RANGE }) {
  const [activeGroup, setActiveGroup] = useState(DEFAULT_ACTIVE_GROUP);
  const activeLines = kpiGroups[activeGroup];
  const rangeConfig = timeRangeConfig[timeRange] || timeRangeConfig[DEFAULT_TIME_RANGE];

  const chartData = useMemo(() => ({
    labels: rangeConfig.labels,
    datasets: activeLines.map((item, index) => createTrendDatasets(item, rangeConfig, index)),
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
        width={KPI_TREND_CHART_DIMENSIONS.width}
        height={KPI_TREND_CHART_DIMENSIONS.height}
      />
    </div>
  );
}

export default DashboardCard06;
