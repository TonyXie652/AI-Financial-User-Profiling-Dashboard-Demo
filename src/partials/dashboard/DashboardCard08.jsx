import React from 'react';

function DashboardCard08() {
  const insights = [
    {
      label: '模型发现',
      text: '高活跃低转化用户上升6.8%，用户频繁查看行情，但较少使用分析工具。',
    },
    {
      label: '隐性风险',
      text: '部分用户从“深度分析”退化为“只看行情”，存在早期流失信号。',
    },
    {
      label: '推荐动作',
      text: '优先对潜在高价值用户推送进阶产品，对流失风险用户推送权益提醒。',
    },
    {
      label: '预期收益',
      text: '工具复用预测 +12%，付费转化率预计提升 4%–7%。',
    },
  ];

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white hover:bg-blue-50/40 dark:bg-gray-900 dark:hover:bg-white/[0.04] shadow-xs dark:shadow-[0_12px_28px_rgba(0,0,0,0.26)] rounded-xl transition-colors duration-300">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">AI总结分析</h2>
      </header>
      <div className="px-5 py-4 space-y-4">
        <div className="space-y-3">
          {insights.map((item) => (
            <div key={item.label} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/40">
              <div className="mb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">{item.label}</div>
              <div className="text-sm leading-6 text-gray-800 dark:text-gray-100">{item.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardCard08;
