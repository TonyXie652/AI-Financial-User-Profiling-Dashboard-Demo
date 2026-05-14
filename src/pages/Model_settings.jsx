import React from "react";

const modelSettingsCardClass = "bg-white hover:bg-blue-50/40 dark:bg-gray-900 dark:hover:bg-white/[0.04] shadow-xs hover:shadow-md dark:shadow-[0_12px_28px_rgba(0,0,0,0.26)] dark:hover:shadow-[0_16px_34px_rgba(0,0,0,0.34)] rounded-xl transition-all duration-300";

function AlgorithmOverviewCard() {
  const steps = [
    "用户基础数据和行为逻辑",
    "传统算法结果",
    "AI大模型评估结果",
    "用户画像描述",
    "相关运营建议",
  ];

  return (
    <section className={`${modelSettingsCardClass} col-span-full min-h-[142px]`}>
      <div className="flex min-h-[142px] flex-col px-5 py-4">
        <h2 className="mb-4 text-base font-bold text-gray-800 dark:text-gray-100">
          算法概览
        </h2>
        <div className="flex flex-1 flex-col justify-center gap-4 pl-3">
          <p className="text-sm font-semibold leading-6 text-gray-700 dark:text-gray-200">
            从用户基础数据和行为逻辑出发，综合传统算法结果和 AI 大模型评估结果，产出用户画像描述和相关运营建议。
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300">
            {steps.map((step, index) => (
              <React.Fragment key={step}>
                <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <span className="text-violet-500 dark:text-violet-300">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Model_settings() {
  return (
    <main className="grow bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="grid grid-cols-12 gap-6">
          <AlgorithmOverviewCard />
        </div>
      </div>
    </main>
  );
}

export default Model_settings;
