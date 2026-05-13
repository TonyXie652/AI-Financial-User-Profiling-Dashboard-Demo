import React from 'react';

import Header from '../partials/Header';
import DashboardCard01 from '../partials/dashboard/DashboardCard01';
import DashboardCard02 from '../partials/dashboard/DashboardCard02';
import DashboardCard03 from '../partials/dashboard/DashboardCard03';
import DashboardCard04 from '../partials/dashboard/DashboardCard04';
import DashboardCard05 from '../partials/dashboard/DashboardCard05';
import DashboardCard06 from '../partials/dashboard/DashboardCard06';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import DashboardCard08 from '../partials/dashboard/DashboardCard08';
import DashboardCard09 from '../partials/dashboard/DashboardCard09';

function Dashboard({ sidebarOpen, setSidebarOpen, timeRange, setTimeRange }) {

  return (
    <>
      {/* Site header */}
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />

      <main className="grow bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

          {/* Dashboard actions */}
          <div className="sm:flex sm:justify-between sm:items-center mb-8">

            {/* Left: Title */}
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">数据总览</h1>
            </div>

          </div>

          {/* Cards */}
          <div className="grid grid-cols-12 gap-6">

            {/* 1. 顶部 KPI 卡片 */}
            <DashboardCard01 />
            <DashboardCard02 />
            <DashboardCard03 />
            {/* 2. AI画像引擎运行概览 */}
            <DashboardCard09 />
            {/* 3. KPI统计折线图 */}
            <DashboardCard06 timeRange={timeRange} />
            {/* 4. 核心人群洞察 + AI总结分析 */}
            <DashboardCard07 />
            <DashboardCard08 />
            {/* 补充分布视图：弱化并下移 */}
            <DashboardCard04 />
            {/* 5. 后台AI重点关注用户 */}
            <DashboardCard05 />
          </div>
        </div>
      </main>
    </>
  );
}

export default Dashboard;
