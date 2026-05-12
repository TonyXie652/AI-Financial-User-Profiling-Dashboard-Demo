import React from 'react';

function DashboardCard07() {
  const groups = [
    {
      id: '0',
      category: '高价值核心用户',
      count: '17,489',
      ratio: '32%',
      analysis: '贡献稳定且复购意愿高，建议维持专属权益和高频触达。',
    },
    {
      id: '1',
      category: '潜在高价值用户',
      count: '6,210',
      ratio: '11%',
      analysis: '近期活跃度上升，可通过组合推荐提升转化概率。',
    },
    {
      id: '2',
      category: '流失风险用户',
      count: '9,962',
      ratio: '18%',
      analysis: '访问频次和交易意愿下降，建议优先触发挽回策略。',
    },
    {
      id: '3',
      category: '短线交易用户',
      count: '8,430',
      ratio: '15%',
      analysis: '行为波动较强，适合推送实时行情和短周期提醒。',
    },
    {
      id: '4',
      category: '稳健理财用户',
      count: '7,856',
      ratio: '14%',
      analysis: '偏好低风险配置，可推荐稳健型产品和定投方案。',
    },
    {
      id: '5',
      category: '专业研究用户',
      count: '5,482',
      ratio: '10%',
      analysis: '深度内容消费明显，适合开放高级研报和模型工具。',
    },
  ];

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl transition-colors duration-500">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">核心人群洞察</h2>
      </header>
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-fixed w-full min-w-[720px]">
            <thead className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="w-[23%] p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">类别</div>
                </th>
                <th className="w-[13%] p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">人数</div>
                </th>
                <th className="w-[10%] p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">占比</div>
                </th>
                <th className="w-[54%] p-2">
                  <div className="font-semibold text-left">AI分析</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {groups.map((group) => (
                <tr key={group.id}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">{group.category}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left font-medium text-gray-700 dark:text-gray-300">{group.count}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left font-medium text-green-500">{group.ratio}</div>
                  </td>
                  <td className="p-2">
                    <div className="text-left text-xs leading-5 text-gray-500 dark:text-gray-400">{group.analysis}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard07;
