import React from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../../charts/LineChart01';
import EditMenu from '../../components/DropdownEditMenu';
import { createKpiSparklineDataset, KPI_SPARKLINE_DIMENSIONS } from './dashboardChartConfig';

function DashboardCard01() {

  const chartData = {
    labels: [
      '12-01-2022',
      '01-01-2023',
      '02-01-2023',
      '03-01-2023',
      '04-01-2023',
      '05-01-2023',
      '06-01-2023',
      '07-01-2023',
      '08-01-2023',
      '09-01-2023',
      '10-01-2023',
      '11-01-2023',
      '12-01-2023',
      '01-01-2024',
      '02-01-2024',
      '03-01-2024',
      '04-01-2024',
      '05-01-2024',
      '06-01-2024',
      '07-01-2024',
      '08-01-2024',
      '09-01-2024',
      '10-01-2024',
      '11-01-2024',
      '12-01-2024',
      '01-01-2025',
    ],
    datasets: [
      createKpiSparklineDataset([37200, 38150, 38980, 40240, 39720, 41580, 42960, 42140, 43890, 45210, 44650, 46320, 47180, 46840, 48620, 50130, 49380, 51240, 52680, 51910, 53760, 53120, 54680, 54190, 55240, 55429]),
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white hover:bg-blue-50/40 dark:bg-gray-900 dark:hover:bg-white/[0.04] shadow-xs dark:shadow-[0_12px_28px_rgba(0,0,0,0.26)] rounded-xl transition-colors duration-300">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">总用户数</h2>
          {/* Menu button */}
          <EditMenu align="right" className="relative inline-flex">
            <li>
              <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
                Option 1
              </Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
                Option 2
              </Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-red-500 hover:text-red-600 flex py-1 px-3" to="#0">
                Remove
              </Link>
            </li>
          </EditMenu>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">人数</div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">55,429</div>
          <div className="text-sm font-medium text-violet-600 px-1.5 bg-violet-500/10 rounded-full">+8%</div>
        </div>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow max-sm:max-h-[112px] xl:max-h-[112px]">
        {/* Change the height attribute to adjust the chart height */}
        <LineChart
          data={chartData}
          width={KPI_SPARKLINE_DIMENSIONS.width}
          height={KPI_SPARKLINE_DIMENSIONS.height}
        />
      </div>
      <div className="px-5 pb-5 pt-2 space-y-2">
        <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-[11px] font-semibold whitespace-nowrap text-gray-800 dark:bg-gray-700/40 dark:text-gray-100">
          <span>AI预测：未来7天+4.9%</span>
          <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-bold text-violet-600 dark:bg-violet-500/20 dark:text-violet-200">置信度：75%</span>
        </div>
        <div className="rounded-md bg-gray-50 px-3 py-2 text-[10px] font-semibold whitespace-nowrap text-gray-800 dark:bg-gray-700/40 dark:text-gray-100">
          预测原因：新增注册增长，回访率上升
        </div>
      </div>
    </div>
  );
}

export default DashboardCard01;
