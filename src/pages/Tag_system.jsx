import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../partials/Header";

const tabs = [
  {
    id: "source",
    label: "标签来源",
    title: "标签来源与 AI 生成逻辑",
    subtitle: "说明标签如何被制作、生成，以及 AI 在其中承担的判断角色。",
  },
  {
    id: "category",
    label: "标签分类",
    title: "标签分类体系",
    subtitle: "展示当前标签体系的整体结构、标签总数和各类标签的含义。",
  },
  {
    id: "application",
    label: "应用场景",
    title: "标签应用场景",
    subtitle: "说明标签如何参与客户服务、用户画像描述和运营决策。",
  },
  {
    id: "evaluation",
    label: "效果评估",
    title: "标签效果与收益评估",
    subtitle: "展示标签当前准确率、覆盖率以及对业务指标带来的收益。",
  },
  {
    id: "risk",
    label: "风险与优化",
    title: "标签风险与优化机制",
    subtitle: "说明当前标签体系可能存在的问题，以及后续优化方向。",
  },
];

//上方选项框
export default function TagSystemTabs({ sidebarOpen, setSidebarOpen }) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [hoveredTab, setHoveredTab] = useState(null);

  const currentTab = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      {/* Header */}
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} variant="v3" />

      <main className="grow">
        <div className="w-full pt-0 pb-6">
          <div className="w-full bg-white pb-0 shadow-sm dark:bg-gray-800">
            {/* 横向选项框 */}
            <div className="relative border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-5 overflow-hidden">
                {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  onMouseEnter={() => setHoveredTab(tab.id)}
                  onMouseLeave={() => setHoveredTab(null)}
                  className={`relative flex h-9 font-semibold items-center justify-center whitespace-nowrap text-sm text-gray-500 transition-all duration-200 dark:text-gray-400 ${
                    hoveredTab === tab.id
                      ? "bg-gray-100 dark:bg-gray-700/70"
                      : "bg-transparent"
                  }`}
                >
                  {tab.label}

                  {hoveredTab === tab.id && (
                    <motion.div
                      layoutId="hoverTabUnderline"
                      className="absolute bottom-0 left-0 h-[2px] w-full bg-current"
                      transition={{
                        type: "spring",
                        stiffness: 360,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}