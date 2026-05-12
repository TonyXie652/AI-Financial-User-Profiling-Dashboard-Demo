import React from 'react';

function DashboardCard08() {
  const insights = [
    {
      label: '总体判断',
      text: '当前总用户数为 55,429 人，高价值用户 17,489 人，占比约 32%，整体用户质量保持在较高水平。',
    },
    {
      label: '增长机会',
      text: '系统识别出新增潜力高价值用户 621 人，建议优先推送进阶产品、会员权益和个性化资产配置方案。',
    },
    {
      label: '风险预警',
      text: '流失风险用户为 9,962 人，占比约 18%，未来 7 天预计有 123 人进入高风险流失状态，需要触发挽回策略。',
    },
  ];

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl transition-colors duration-500">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">AI总览分析</h2>
      </header>
      <div className="px-5 py-4 space-y-4">
        <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
          AI 综合用户画像、价值分层和流失风险后判断：当前用户规模与结构保持稳定，短期增长重点应放在潜力高价值用户转化和风险用户召回上。
        </p>
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
