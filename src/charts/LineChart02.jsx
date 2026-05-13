import React, { useRef, useEffect, useState } from 'react';
import { useThemeProvider } from '../utils/ThemeContext';

import { chartColors } from './ChartjsConfig';
import {
  Chart, LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip, Legend,
} from 'chart.js';
import 'chartjs-adapter-moment';

// Import utilities
import { formatThousands } from '../utils/Utils';

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip, Legend);

function LineChart02({
  data,
  timeUnit = 'month',
  width,
  height
}) {

  const [chart, setChart] = useState(null)
  const canvas = useRef(null);
  const legend = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';
  const { textColor, gridColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

  useEffect(() => {
    const ctx = canvas.current;
    if (!ctx) return undefined;
    Chart.getChart(ctx)?.destroy();
    // eslint-disable-next-line no-unused-vars
    const newChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        layout: {
          padding: 20,
        },
        scales: {
          y: {
            border: {
              display: false,
            },
            beginAtZero: true,
            max: 80,
            ticks: {
              stepSize: 20,
              callback: (value) => formatThousands(value),
              color: darkMode ? textColor.dark : textColor.light,
            },
            grid: {
              color: darkMode ? gridColor.dark : gridColor.light,
            },
          },
          x: {
            type: 'time',
            time: {
              parser: 'MM-DD-YYYY',
              unit: timeUnit,
              displayFormats: {
                day: 'MMM D',
                week: 'MMM D',
                month: 'MMM YY',
              },
            },
            border: {
              display: false,
            },
            grid: {
              display: false,
            },
            ticks: {
              autoSkipPadding: 48,
              maxRotation: 0,
              color: darkMode ? textColor.dark : textColor.light,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: () => false, // Disable tooltip title
              label: (context) => {
                const metric = context.dataset.metricLabel || context.dataset.label;
                const segment = context.dataset.segmentLabel ? ` · ${context.dataset.segmentLabel}` : '';
                return `${metric}${segment}: ${formatThousands(context.parsed.y)}`;
              },
            },
            bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
            backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
            borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
          },
        },
        interaction: {
          intersect: false,
          mode: 'nearest',
        },
        transitions: {
          show: {
            animations: {
              opacity: {
                from: 0,
                to: 1,
                duration: 420,
                easing: 'easeOutCubic',
              },
              y: {
                from: (context) => context.chart.scales.y.getPixelForValue(0),
                duration: 450,
                easing: 'easeOutCubic',
              },
            },
          },
          hide: {
            animations: {
              opacity: {
                to: 0,
                duration: 320,
                easing: 'easeInCubic',
              },
              y: {
                to: (context) => context.chart.scales.y.getPixelForValue(0),
                duration: 360,
                easing: 'easeInCubic',
              },
            },
          },
        },
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
      plugins: [
        {
          id: 'htmlLegend',
          afterUpdate(c) {
            const ul = legend.current;
            if (!ul) return;
            // Remove old legend items
            while (ul.firstChild) {
              ul.firstChild.remove();
            }

            const createButton = ({ text, color, active = true, onClick }) => {
              const li = document.createElement('li');
              li.style.flexShrink = '0';
              const button = document.createElement('button');
              button.style.display = 'inline-flex';
              button.style.alignItems = 'center';
              button.style.whiteSpace = 'nowrap';
              button.style.opacity = active ? '' : '.3';
              button.onclick = onClick;

              const box = document.createElement('span');
              box.style.display = 'block';
              box.style.width = '12px';
              box.style.height = '12px';
              box.style.borderRadius = '9999px';
              box.style.marginRight = '8px';
              box.style.backgroundColor = color;
              box.style.pointerEvents = 'none';

              const label = document.createElement('span');
              label.classList.add('text-gray-500', 'dark:text-gray-400');
              label.style.fontSize = '14px';
              label.style.lineHeight = 'calc(1.25 / 0.875)';
              const labelText = document.createTextNode(text);
              label.appendChild(labelText);
              li.appendChild(button);
              button.appendChild(box);
              button.appendChild(label);
              ul.appendChild(li);
            };

            const datasets = c.data.datasets;
            const metrics = datasets.reduce((items, dataset, index) => {
              if (!dataset.metricLabel || items.some((item) => item.label === dataset.metricLabel)) {
                return items;
              }

              items.push({
                label: dataset.metricLabel,
                color: dataset.borderColor,
                indexes: datasets
                  .map((candidate, candidateIndex) => (
                    candidate.metricLabel === dataset.metricLabel ? candidateIndex : null
                  ))
                  .filter((candidateIndex) => candidateIndex !== null),
                index,
              });
              return items;
            }, []);

            metrics.forEach((metric) => {
              createButton({
                text: metric.label,
                color: metric.color,
                active: metric.indexes.some((index) => c.isDatasetVisible(index)),
                onClick: () => {
                  const shouldShow = !metric.indexes.some((index) => c.isDatasetVisible(index));
                  metric.indexes.forEach((index) => {
                    c.setDatasetVisibility(index, shouldShow);
                  });
                  c.update();
                },
              });
            });
          },
        },
      ],
    });
    setChart(newChart);
    return () => newChart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!chart) return;

    if (darkMode) {
      chart.options.scales.x.ticks.color = textColor.dark;
      chart.options.scales.y.ticks.color = textColor.dark;
      chart.options.scales.y.grid.color = gridColor.dark;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
    } else {
      chart.options.scales.x.ticks.color = textColor.light;
      chart.options.scales.y.ticks.color = textColor.light;
      chart.options.scales.y.grid.color = gridColor.light;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
    }
    chart.update('none');
  }, [currentTheme]);

  useEffect(() => {
    if (!chart) return;

    chart.data = data;
    chart.options.scales.x.time.unit = timeUnit;
    chart.update();
  }, [chart, data, timeUnit]);

  return (
    <React.Fragment>
      <div className="px-5 py-3">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            实线为历史数据，虚线为AI预测趋势，具体数值可悬停查看。
          </p>
          <ul ref={legend} className="flex w-full flex-nowrap items-center gap-x-6 gap-y-2 overflow-x-auto whitespace-nowrap lg:w-auto lg:justify-end sm:gap-x-7"></ul>
        </div>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow">
        <canvas ref={canvas} width={width} height={height}></canvas>
      </div>
    </React.Fragment>
  );
}

export default LineChart02;
