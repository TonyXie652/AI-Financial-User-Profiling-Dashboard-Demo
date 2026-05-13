import React from 'react';

const focusedUsers = [
  {
    name: '王女士',
    level: '高价值',
    churnRisk: '25.3%',
    basis: '服务剩余时间小于7天，未查看续费权益',
    action: '推送续费提醒',
  },
  {
    name: '孙先生',
    level: '中价值',
    churnRisk: '31.7%',
    basis: '内容浏览稳定，付费转化意愿偏弱',
    action: '推送入门体验包',
  },
  {
    name: '谷先生',
    level: '中价值',
    churnRisk: '38.6%',
    basis: '咨询点击率高，但停留时间较短',
    action: '优化推荐内容',
  },
  {
    name: '刘女士',
    level: '成长型',
    churnRisk: '17.5%',
    basis: '使用频率上升，开始关注深度研报',
    action: '推荐研报解读',
  },
  {
    name: '贺先生',
    level: '中高价值',
    churnRisk: '27.8%',
    basis: '高频查看行情，较少使用分析工具',
    action: '推荐智能选股',
  },
  {
    name: '陈女士',
    level: '潜在高价值',
    churnRisk: '22.4%',
    basis: '近14天自选资产数量增加，研报阅读完成率高',
    action: '推送会员试用',
  },
];

function DashboardCard05() {
  return (
    <div className="col-span-full xl:col-span-8 bg-white hover:bg-blue-50/40 dark:bg-gray-900 dark:hover:bg-white/[0.04] shadow-xs dark:shadow-[0_12px_28px_rgba(0,0,0,0.26)] rounded-xl transition-colors duration-300">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">后台AI重点关注用户</h2>
      </header>
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-fixed w-full dark:text-gray-300">
            <thead className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="w-[26%] px-3 py-3">
                  <div className="text-left">用户</div>
                </th>
                <th className="w-[24%] px-3 py-3">
                  <div className="text-left">价值等级</div>
                </th>
                <th className="w-[20%] px-3 py-3">
                  <div className="text-left">风险概率</div>
                </th>
                <th className="w-[30%] px-3 py-3">
                  <div className="text-left">推荐动作</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {focusedUsers.map((user) => (
                <tr key={user.name}>
                  <td className="px-3 py-4">
                    <div className="font-semibold text-gray-800 dark:text-gray-100">{user.name}</div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="font-medium text-gray-700 dark:text-gray-300">{user.level}</div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="font-semibold text-red-600 dark:text-red-400">{user.churnRisk}</div>
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className="font-medium text-violet-600 transition-colors duration-200 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                      title={`AI判断依据：${user.basis}`}
                      aria-label={`${user.action}，AI判断依据：${user.basis}`}
                    >
                      {user.action}
                    </span>
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

export default DashboardCard05;
