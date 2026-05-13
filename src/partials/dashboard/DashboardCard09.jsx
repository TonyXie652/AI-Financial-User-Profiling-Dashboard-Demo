import React from 'react';

const financePalette = {
  primaryBlue: '#2F6FDB',
  signalRed: '#C2413F',
  slateGray: '#475569',
};

const inputFactors = [
  {
    factor: '访问频次变化',
    weight: 28,
    description: '活跃趋势',
    color: financePalette.primaryBlue,
  },
  {
    factor: '行情浏览深度',
    weight: 22,
    description: '关注强度',
    color: financePalette.primaryBlue,
  },
  {
    factor: '分析工具使用率',
    weight: 18,
    description: '专业程度',
    color: financePalette.slateGray,
  },
  {
    factor: '付费权益点击',
    weight: 16,
    description: '转化意愿',
    color: financePalette.signalRed,
  },
];

const outputResults = [
  {
    result: '用户价值评分',
    value: '78 / 100',
    meaning: '用户质量较高',
  },
  {
    result: '流失风险指数',
    value: '31%',
    meaning: '存在续费风险',
  },
  {
    result: '付费转化潜力',
    value: '42%',
    meaning: '可重点运营',
  },
  {
    result: '推荐干预优先级',
    value: '高',
    meaning: '优先触达风险用户',
  },
];

function DashboardCard09() {
  return (
    <div className="col-span-full bg-white hover:bg-blue-50/40 dark:bg-gray-900 dark:hover:bg-white/[0.04] shadow-xs dark:shadow-[0_12px_28px_rgba(0,0,0,0.26)] rounded-xl transition-colors duration-300">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">AI画像引擎运行概览</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              关键输入因子经过AI画像模型后，生成用户价值、风险和运营优先级判断。
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-5 p-5 xl:grid-cols-[minmax(0,1fr)_120px_minmax(0,1fr)]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">AI输入因子</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="w-[34%] p-2 rounded-l-lg">
                  <div className="text-left">输入因子</div>
                </th>
                <th className="w-[28%] p-2">
                  <div className="text-left">权重</div>
                </th>
                <th className="w-[38%] p-2 rounded-r-lg">
                  <div className="text-left">说明</div>
                </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                {inputFactors.map((item) => (
                  <tr key={item.factor}>
                    <td className="p-2 align-middle">
                      <div className="font-semibold text-gray-800 dark:text-gray-100">{item.factor}</div>
                    </td>
                    <td className="p-2 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                          <div
                            className="h-2.5 rounded-full"
                            style={{ width: `${item.weight}%`, backgroundColor: item.color }}
                          />
                        </div>
                        <span className="w-9 text-right font-semibold text-gray-800 dark:text-gray-100">
                          {item.weight}%
                        </span>
                      </div>
                    </td>
                    <td className="p-2 align-middle">
                      <div className="text-gray-500 dark:text-gray-400">{item.description}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="flex w-full flex-row items-center justify-center gap-2 rounded-lg bg-gray-50 px-3 py-3 text-xs font-semibold text-gray-600 dark:bg-gray-800/60 dark:text-gray-300 xl:flex-col xl:py-5">
            <span className="whitespace-nowrap">输入因子</span>
            <span className="text-base leading-none text-gray-400 dark:text-gray-500 xl:rotate-90">→</span>
            <span className="whitespace-nowrap text-gray-800 dark:text-gray-100">AI画像模型</span>
            <span className="text-base leading-none text-gray-400 dark:text-gray-500 xl:rotate-90">→</span>
            <span className="whitespace-nowrap">输出结果</span>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">AI输出结果</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="w-[34%] p-2 rounded-l-lg">
                  <div className="text-left">输出结果</div>
                </th>
                <th className="w-[28%] p-2">
                  <div className="text-left">数值</div>
                </th>
                <th className="w-[38%] p-2 rounded-r-lg">
                  <div className="text-left">业务含义</div>
                </th>
              </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                {outputResults.map((item) => (
                  <tr key={item.result}>
                    <td className="p-2 align-middle">
                      <div className="font-semibold text-gray-800 dark:text-gray-100">{item.result}</div>
                    </td>
                    <td className="p-2 align-middle">
                      <div className="font-semibold text-violet-600 dark:text-violet-400">{item.value}</div>
                    </td>
                    <td className="p-2 align-middle">
                      <div className="text-gray-500 dark:text-gray-400">{item.meaning}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardCard09;
