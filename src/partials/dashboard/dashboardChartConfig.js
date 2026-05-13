import { chartAreaGradient } from '../../charts/ChartjsConfig';
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

const KPI_LINE_COLOR_VAR = '--color-violet-500';
const KPI_GRADIENT_START = 0;
const KPI_GRADIENT_END = 1;
const KPI_GRADIENT_START_OPACITY = 0;
const KPI_GRADIENT_END_OPACITY = 0.2;
const KPI_LINE_BORDER_WIDTH = 2;
const KPI_POINT_RADIUS = 0;
const KPI_POINT_HOVER_RADIUS = 3;
const KPI_POINT_BORDER_WIDTH = 0;
const KPI_CHART_CLIP_PADDING = 20;
const KPI_LINE_TENSION = 0.2;

export const KPI_SPARKLINE_DIMENSIONS = {
  width: 389,
  height: 112,
};

export function createKpiSparklineDataset(data) {
  const lineColor = getCssVariable(KPI_LINE_COLOR_VAR);

  return {
    data,
    fill: true,
    backgroundColor: function(context) {
      const chart = context.chart;
      const { ctx, chartArea } = chart;
      return chartAreaGradient(ctx, chartArea, [
        {
          stop: KPI_GRADIENT_START,
          color: adjustColorOpacity(lineColor, KPI_GRADIENT_START_OPACITY),
        },
        {
          stop: KPI_GRADIENT_END,
          color: adjustColorOpacity(lineColor, KPI_GRADIENT_END_OPACITY),
        },
      ]);
    },
    borderColor: lineColor,
    borderWidth: KPI_LINE_BORDER_WIDTH,
    pointRadius: KPI_POINT_RADIUS,
    pointHoverRadius: KPI_POINT_HOVER_RADIUS,
    pointBackgroundColor: lineColor,
    pointHoverBackgroundColor: lineColor,
    pointBorderWidth: KPI_POINT_BORDER_WIDTH,
    pointHoverBorderWidth: KPI_POINT_BORDER_WIDTH,
    clip: KPI_CHART_CLIP_PADDING,
    tension: KPI_LINE_TENSION,
  };
}
