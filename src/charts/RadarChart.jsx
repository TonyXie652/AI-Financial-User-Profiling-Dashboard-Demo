import React, { useEffect, useRef, useState } from "react";
import {
  Chart,
  Filler,
  LineElement,
  PointElement,
  RadarController,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import { useThemeProvider } from "../utils/ThemeContext";
import { adjustColorOpacity } from "../utils/Utils";
import { chartColors } from "./ChartjsConfig";

Chart.register(RadarController, RadialLinearScale, LineElement, PointElement, Filler, Tooltip);

function RadarChart({ data, width = 560, height = 290 }) {
  const canvas = useRef(null);
  const [chart, setChart] = useState(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === "dark";
  const { tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

  useEffect(() => {
    const ctx = canvas.current;
    if (!ctx) return undefined;

    Chart.getChart(ctx)?.destroy();

    const newChart = new Chart(ctx, {
      type: "radar",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 6,
            right: 28,
            bottom: 6,
            left: 28,
          },
        },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: {
              display: false,
              stepSize: 20,
            },
            pointLabels: {
              color: darkMode ? "#cbd5e1" : "#173b7a",
              font: {
                size: 11,
                weight: 700,
              },
            },
            angleLines: {
              color: darkMode ? "rgba(148, 163, 184, 0.22)" : "rgba(47, 111, 219, 0.16)",
              borderDash: [3, 4],
            },
            grid: {
              circular: true,
              color: darkMode ? "rgba(148, 163, 184, 0.18)" : "rgba(47, 111, 219, 0.13)",
            },
          },
        },
        elements: {
          line: {
            borderWidth: 2,
          },
          point: {
            radius: 3,
            hoverRadius: 4,
            borderWidth: 0,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
            backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
            borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
          },
        },
      },
    });

    setChart(newChart);
    return () => newChart.destroy();
  }, []);

  useEffect(() => {
    if (!chart) return;

    chart.data = data;
    chart.options.scales.r.pointLabels.color = darkMode ? "#cbd5e1" : "#173b7a";
    chart.options.scales.r.angleLines.color = darkMode ? "rgba(148, 163, 184, 0.22)" : "rgba(47, 111, 219, 0.16)";
    chart.options.scales.r.grid.color = darkMode ? "rgba(148, 163, 184, 0.18)" : "rgba(47, 111, 219, 0.13)";
    chart.options.plugins.tooltip.bodyColor = darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light;
    chart.options.plugins.tooltip.backgroundColor = darkMode ? tooltipBgColor.dark : tooltipBgColor.light;
    chart.options.plugins.tooltip.borderColor = darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light;
    chart.update("none");
  }, [chart, currentTheme, data]);

  return (
    <canvas ref={canvas} width={width} height={height} />
  );
}

export function buildRadarDataset({
  currentUserValues,
  averageUserValues = [68, 64, 72, 66, 70, 78],
  predictionUserValues = [86, 79, 82, 88, 84, 94],
}) {
  const currentColor = "#a855f7";
  const averageColor = "#2f6fdb";
  const predictionColor = "#7c3aed";

  return {
    labels: ["转化价值", "资产风险", "内容价值", "留存价值", "数字服务", "合规信任"],
    datasets: [
      {
        label: "当前用户",
        data: currentUserValues,
        borderColor: currentColor,
        backgroundColor: adjustColorOpacity(currentColor, 0.18),
        pointBackgroundColor: currentColor,
        pointBorderColor: currentColor,
        fill: true,
      },
      {
        label: "总体平均",
        data: averageUserValues,
        borderColor: averageColor,
        backgroundColor: adjustColorOpacity(averageColor, 0.08),
        pointBackgroundColor: averageColor,
        pointBorderColor: averageColor,
        fill: false,
      },
      {
        label: "AI预测",
        data: predictionUserValues,
        borderColor: predictionColor,
        backgroundColor: "transparent",
        pointBackgroundColor: predictionColor,
        pointBorderColor: predictionColor,
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };
}

export default RadarChart;
