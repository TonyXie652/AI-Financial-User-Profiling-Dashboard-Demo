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

function Dashboard({ sidebarOpen, setSidebarOpen }) {

  return (
    <>

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
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

              {/* 总用户人数 */}
              <DashboardCard01 />
              {/* 高价值用户 */}
              <DashboardCard02 />
              {/* 流失风险用户 */}
              <DashboardCard03 />
              {/* 用户价值分布 */}
              <DashboardCard04 />
              {/* 精选高价值/风险用户表格 */}
              <DashboardCard05 />
              {/* KPI统计折线图 */}
              <DashboardCard06 />
              {/* 重点人群类别 */}
              <DashboardCard07 />
              {/* AI总览分析 */}
              <DashboardCard08 />
            </div>
          </div>
        </main>

    </>
  );
}

export default Dashboard;
