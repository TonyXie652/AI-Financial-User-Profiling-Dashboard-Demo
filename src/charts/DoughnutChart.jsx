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
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';
  const { tooltipTitleColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors; 

  useEffect(() => {
    const ctx = canvas.current;
    // eslint-disable-next-line no-unused-vars
    const newChart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        cutout: '0%',
        layout: {
          padding: {
            top: 24,
            right: 84,
            bottom: 24,
            left: 84,
          },
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
          externalLabels: {
            labelColor: darkMode ? '#F3F4F6' : '#1F2937',
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
          id: 'externalLabels',
          afterDatasetsDraw(c) {
            const { ctx } = c;
            const dataset = c.data.datasets[0];
            const values = dataset.data;
            const total = values.reduce((sum, value) => sum + value, 0);
            const arcs = c.getDatasetMeta(0).data;
            const labelColor = c.options.plugins.externalLabels.labelColor;

            ctx.save();
            ctx.font = '600 12px Inter, sans-serif';
            ctx.lineWidth = 1.5;

            arcs.forEach((arc, index) => {
              if (!c.getDataVisibility(index)) return;

              const { x, y, outerRadius, startAngle, endAngle } = arc;
              const angle = (startAngle + endAngle) / 2;
              const color = dataset.backgroundColor[index];
              const label = c.data.labels[index];
              const value = values[index];
              const percentage = total ? Math.round((value / total) * 100) : 0;
              const rightSide = Math.cos(angle) >= 0;
              const dotX = x + Math.cos(angle) * (outerRadius + 4);
              const dotY = y + Math.sin(angle) * (outerRadius + 4);
              const bendX = x + Math.cos(angle) * (outerRadius + 22);
              const bendY = y + Math.sin(angle) * (outerRadius + 22);
              const endX = bendX + (rightSide ? 46 : -46);
              const textX = endX + (rightSide ? 8 : -8);

              ctx.strokeStyle = color;
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(dotX, dotY, 3.5, 0, Math.PI * 2);
              ctx.fill();

              ctx.beginPath();
              ctx.moveTo(dotX, dotY);
              ctx.lineTo(bendX, bendY);
              ctx.lineTo(endX, bendY);
              ctx.stroke();

              ctx.textAlign = rightSide ? 'left' : 'right';
              ctx.fillStyle = labelColor;
              ctx.fillText(label, textX, bendY - 7);
              ctx.fillStyle = color;
              ctx.fillText(`${percentage}% ${value}`, textX, bendY + 10);
            });

            ctx.restore();
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
      chart.options.plugins.externalLabels.labelColor = '#F3F4F6';
    } else {
      chart.options.plugins.tooltip.titleColor = tooltipTitleColor.light;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
      chart.options.plugins.externalLabels.labelColor = '#1F2937';
    }
    chart.update('none');
  }, [currentTheme]);

  return (
    <div className="grow flex flex-col justify-center">
      <div className="min-h-[300px]">
        <canvas ref={canvas} width={width} height={height}></canvas>
      </div>
    </div>
  );
}

export default DoughnutChart;
