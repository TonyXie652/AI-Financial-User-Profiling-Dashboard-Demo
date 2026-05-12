import React, { useRef, useEffect, useState } from 'react';
import { useThemeProvider } from '../utils/ThemeContext';

import { chartColors } from './ChartjsConfig';
import {
  Chart, DoughnutController, ArcElement, TimeScale, Tooltip,
} from 'chart.js';
import 'chartjs-adapter-moment';

Chart.register(DoughnutController, ArcElement, TimeScale, Tooltip);

function DoughnutChart({
  data,
  width,
  height
}) {

  const [chart, setChart] = useState(null)
  const canvas = useRef(null);
  const legend = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';
  const { tooltipTitleColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors; 
  const sliceBorderColor = darkMode ? '#1F2937' : '#FFFFFF';

  useEffect(() => {
    const ctx = canvas.current;
    // eslint-disable-next-line no-unused-vars
    const newChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        ...data,
        datasets: data.datasets.map((dataset) => ({
          ...dataset,
          borderColor: sliceBorderColor,
        })),
      },
      options: {
        cutout: '0%',
        layout: {
          padding: 24,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            titleColor: darkMode ? tooltipTitleColor.dark : tooltipTitleColor.light,
            bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
            backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
            borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
          },
          sliceLabels: {
            borderColor: darkMode ? '#1F2937' : '#FFFFFF',
          },
        },
        interaction: {
          intersect: true,
          mode: 'nearest',
        },
        animation: {
          duration: 500,
        },
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
      plugins: [
        {
          id: 'sliceLabels',
          afterDatasetsDraw(c) {
            const { ctx } = c;
            const dataset = c.data.datasets[0];
            const values = dataset.data;
            const total = values.reduce((sum, value) => sum + value, 0);
            const arcs = c.getDatasetMeta(0).data;

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '700 18px Inter, sans-serif';

            arcs.forEach((arc, index) => {
              if (!c.getDataVisibility(index)) return;

              const { x, y, innerRadius, outerRadius, startAngle, endAngle } = arc;
              const angle = (startAngle + endAngle) / 2;
              const radius = innerRadius + (outerRadius - innerRadius) * 0.58;
              const labelX = x + Math.cos(angle) * radius;
              const labelY = y + Math.sin(angle) * radius;
              const percentage = total ? Math.round((values[index] / total) * 100) : 0;

              ctx.fillStyle = index === 2 ? '#FFFFFF' : '#111827';
              ctx.fillText(`${percentage}%`, labelX, labelY);
            });

            ctx.restore();
          },
        },
        {
          id: 'htmlLegend',
          afterUpdate(c) {
            const ul = legend.current;
            if (!ul) return;

            while (ul.firstChild) {
              ul.firstChild.remove();
            }

            const items = c.options.plugins.legend.labels.generateLabels(c);
            items.forEach((item) => {
              const li = document.createElement('li');
              li.style.margin = '4px';

              const button = document.createElement('button');
              button.classList.add('btn-xs', 'bg-white', 'dark:bg-gray-700', 'text-gray-500', 'dark:text-gray-400', 'shadow-xs', 'shadow-black/[0.08]', 'rounded-full');
              button.style.opacity = item.hidden ? '.3' : '';
              button.onclick = () => {
                c.toggleDataVisibility(item.index);
                c.update();
              };

              const box = document.createElement('span');
              box.style.display = 'block';
              box.style.width = '8px';
              box.style.height = '8px';
              box.style.backgroundColor = item.fillStyle;
              box.style.borderRadius = '4px';
              box.style.marginRight = '4px';
              box.style.pointerEvents = 'none';

              const label = document.createElement('span');
              label.style.display = 'flex';
              label.style.alignItems = 'center';
              label.appendChild(document.createTextNode(item.text));

              li.appendChild(button);
              button.appendChild(box);
              button.appendChild(label);
              ul.appendChild(li);
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
      chart.options.plugins.tooltip.titleColor = tooltipTitleColor.dark;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
      chart.options.plugins.sliceLabels.borderColor = '#1F2937';
    } else {
      chart.options.plugins.tooltip.titleColor = tooltipTitleColor.light;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
      chart.options.plugins.sliceLabels.borderColor = '#FFFFFF';
    }
    chart.data.datasets.forEach((dataset) => {
      dataset.borderColor = darkMode ? '#1F2937' : '#FFFFFF';
    });
    chart.update('none');
  }, [currentTheme]);

  return (
    <div className="grow flex flex-col justify-center">
      <div className="min-h-[300px]">
        <canvas ref={canvas} width={width} height={height}></canvas>
      </div>
      <div className="px-5 pt-2 pb-6">
        <ul ref={legend} className="flex flex-wrap justify-center -m-1"></ul>
      </div>
    </div>
  );
}

export default DoughnutChart;
