import React from 'react';

function DashboardCard07() {
  const groups = [
    {
      id: '0',
      category: '高价值核心用户',
      count: '17,489',
      trend: -14,
      ratio: '32%',
      analysis: '高留存 / 高复购',
    },
    {
      id: '1',
      category: '潜在高价值用户',
      count: '6,210',
      trend: 8,
      ratio: '11%',
      analysis: '活跃提升 / 可转化',
    },
    {
      id: '2',
      category: '流失风险用户',
      count: '9,962',
      trend: 11,
      ratio: '18%',
      analysis: '频次下降 / 需召回',
    },
    {
      id: '3',
      category: '短线交易用户',
      count: '8,430',
      trend: 3,
      ratio: '15%',
      analysis: '波动较高 / 适合提醒',
    },
    {
      id: '4',
      category: '稳健理财用户',
      count: '7,856',
      trend: -2,
      ratio: '14%',
      analysis: '风险偏低 / 可配置',
    },
    {
      id: '5',
      category: '专业研究用户',
      count: '5,482',
      trend: 6,
      ratio: '10%',
      analysis: '深度内容偏好',
    },
  ];

  return (
    <div className="col-span-full xl:col-span-6 bg-white hover:bg-blue-50/40 dark:bg-gray-900 dark:hover:bg-white/[0.04] shadow-xs dark:shadow-[0_12px_28px_rgba(0,0,0,0.26)] rounded-xl transition-colors duration-300">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">核心人群洞察</h2>
      </header>
      <div className="p-3">
        <table className="table-fixed w-full">
          <thead className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="w-[30%] px-3 py-3 whitespace-nowrap">
                <div className="font-semibold text-left">类别</div>
              </th>
              <th className="w-[18%] px-3 py-3 whitespace-nowrap">
                <div className="font-semibold text-left">人数</div>
              </th>
              <th className="w-[12%] px-3 py-3 whitespace-nowrap">
                <div className="font-semibold text-left">占比</div>
              </th>
              <th className="w-[40%] px-3 py-3">
                <div className="font-semibold text-left">AI分析</div>
              </th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
            {groups.map((group) => {
              const isGrowing = group.trend >= 0;
              return (
                <tr key={group.id}>
                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">{group.category}</div>
                  </td>
                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-left font-medium text-gray-700 dark:text-gray-300">
                      <span>{group.count}</span>
                      <span className={`text-xs font-semibold ${isGrowing ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isGrowing ? '↑' : '↓'}{Math.abs(group.trend)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <div className="text-left font-medium text-violet-600 dark:text-violet-400">{group.ratio}</div>
                  </td>
                  <td className="px-3 py-3.5 align-middle">
                    <div className="whitespace-normal break-words text-left text-xs leading-relaxed text-gray-500 dark:text-gray-400">{group.analysis}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardCard07;
