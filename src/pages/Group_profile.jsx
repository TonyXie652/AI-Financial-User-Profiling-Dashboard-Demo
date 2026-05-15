import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "../partials/Header";

const TOTAL_PEOPLE = 55429;
const modalCardClass =
  "rounded-2xl border border-gray-200/70 bg-white/85 shadow-sm transition-all duration-300 hover:border-blue-200/80 hover:bg-white hover:shadow-md dark:border-gray-800 dark:bg-gray-900/80 dark:hover:border-blue-500/30 dark:hover:bg-gray-900";

//虚拟数据集（模拟非真实）
const categoryProfileData = [
  {
    id: "market_tracking",
    label: "行情追踪型",
    value: 22,
    color: "#ef7f93",
    desc: "高频查看行情、指数、个股异动，对实时市场变化敏感，访问行为受市场波动影响明显。",
    aiInsight: "AI判断该群体适合推送行情异动提醒、自选股预警和短周期市场快讯。",

    overview: {
      peopleCount: 12194,
      activeLevel: "高",
      mainAssets: ["股票", "ETF", "指数"],
      contentPreference: ["行情快讯", "个股资讯", "热点新闻"],
      behaviorPattern: "开盘前后访问集中，突发新闻后回访明显。",
      conversionStage: "中高潜力",
    },

    relations: [
      {
        target: "转化潜力型",
        strength: 76,
        reason: "实时需求高，愿为提醒和高级行情付费，提升转化。",
      },
      {
        target: "风险预警型",
        strength: 64,
        reason: "行情波动触发止损焦虑，会转向风险提示降低损失。",
      },
      {
        target: "AI工具偏好型",
        strength: 58,
        reason: "追踪行情后需要解释异动，AI解读能提升决策效率。",
      },
    ],

    commonBehaviors: [
      "开盘前后访问频率明显提升",
      "自选股查看次数较高",
      "对突发市场新闻点击率高",
      "更关注指数、个股涨跌和板块异动",
    ],

    aiExplanation: {
      inputSignals: [
        { signal: "30日活跃≥24天", weight: 31 },
        { signal: "开盘前后访问≥18次", weight: 29 },
        { signal: "自选股查看≥45次", weight: 24 },
        { signal: "突发新闻后2h回访", weight: 16 },
      ],
      judgement: "该群体主要由实时市场变化驱动，信息需求偏短周期、即时性和提醒型。",
      labels: ["行情敏感", "高频回访", "短周期关注", "提醒依赖"],
    },

    valueScores: {
      activeValue: 88,
      contentValue: 74,
      assetRiskValue: 66,
      conversionValue: 72,
      aiServiceValue: 61,
      complianceTrustValue: 82,
    },

    operationSuggestion: {
      priority: "高",
      action: "优先推送行情异动提醒、自选股预警和热点快讯。",
      executor: "行情内容运营、推送运营、数据运营",
      goal: "提升回访频率，并引导其使用高级提醒和行情分析工具。",
    },
  },

  {
    id: "deep_research",
    label: "深度研究型",
    value: 16,
    color: "#f2b84b",
    desc: "偏好研报、行业分析、宏观数据和长文本内容，决策周期较长，但内容消费深度高。",
    aiInsight: "AI判断该群体更适合推荐深度研报、行业专题和高级投研工具。",

    overview: {
      peopleCount: 8869,
      activeLevel: "中高",
      mainAssets: ["股票", "基金", "行业指数"],
      contentPreference: ["深度研报", "行业分析", "宏观解读"],
      behaviorPattern: "单次停留时间较长，研报下载和收藏行为明显。",
      conversionStage: "高价值培育",
    },

    relations: [
      {
        target: "AI工具偏好型",
        strength: 72,
        reason: "研报信息量大，AI摘要可降低理解成本并增强粘性。",
      },
      {
        target: "稳健配置型",
        strength: 61,
        reason: "研究结论沉淀成配置方案，推动长期持仓与留存。",
      },
      {
        target: "转化潜力型",
        strength: 55,
        reason: "深度资料依赖强，高级数据权限可转化付费需求。",
      },
    ],

    commonBehaviors: [
      "研报阅读和下载频率较高",
      "偏好行业专题和宏观分析",
      "单次访问时长较长",
      "收藏、回看和深度浏览行为明显",
    ],

    aiExplanation: {
      inputSignals: [
        { signal: "30日研报下载≥18篇", weight: 34 },
        { signal: "长文停留≥12分钟", weight: 28 },
        { signal: "行业搜索≥30次", weight: 22 },
        { signal: "收藏回看≥15次", weight: 16 },
      ],
      judgement: "该群体不是由短期行情驱动，而是由研究需求和决策准备驱动。",
      labels: ["深度阅读", "研究导向", "高内容价值", "长周期决策"],
    },

    valueScores: {
      activeValue: 76,
      contentValue: 91,
      assetRiskValue: 78,
      conversionValue: 69,
      aiServiceValue: 73,
      complianceTrustValue: 86,
    },

    operationSuggestion: {
      priority: "高",
      action: "推荐行业专题、研报合集、AI研报摘要和高级数据工具。",
      executor: "投研内容运营、研究员、内容编辑",
      goal: "提升内容粘性，并引导其转化为深度投研工具用户。",
    },
  },

  {
    id: "steady_allocation",
    label: "稳健配置型",
    value: 19,
    color: "#67d6a1",
    desc: "关注基金、ETF、债券等中低风险资产，偏好长期配置和风险分散。",
    aiInsight: "AI判断该群体适合推荐资产配置方案、组合回测和风险分散建议。",

    overview: {
      peopleCount: 10532,
      activeLevel: "中",
      mainAssets: ["基金", "ETF", "债券"],
      contentPreference: ["资产配置", "基金评级", "风险分散"],
      behaviorPattern: "访问频率不一定最高，但内容选择稳定，关注长期收益和风险控制。",
      conversionStage: "稳定留存",
    },

    relations: [
      {
        target: "深度研究型",
        strength: 63,
        reason: "配置决策需证据支撑，研报分析能提升方案可信度。",
      },
      {
        target: "风险预警型",
        strength: 57,
        reason: "稳健用户重视回撤，波动时转向预警保护持仓。",
      },
      {
        target: "转化潜力型",
        strength: 49,
        reason: "组合优化需求明确，筛选和回测工具可促成付费。",
      },
    ],

    commonBehaviors: [
      "更关注基金、ETF、债券等资产",
      "较少追逐短期热点",
      "偏好风险评级和收益稳定性信息",
      "对组合配置和资产分散内容更敏感",
    ],

    aiExplanation: {
      inputSignals: [
        { signal: "基金访问占比≥68%", weight: 34 },
        { signal: "低风险资产点击≥28次", weight: 27 },
        { signal: "短线内容点击≤5次", weight: 21 },
        { signal: "配置内容收藏≥12次", weight: 18 },
      ],
      judgement: "该群体以长期配置和风险控制为主要需求，适合稳健型内容和工具触达。",
      labels: ["长期配置", "风险分散", "稳健偏好", "低波动需求"],
    },

    valueScores: {
      activeValue: 68,
      contentValue: 72,
      assetRiskValue: 87,
      conversionValue: 64,
      aiServiceValue: 58,
      complianceTrustValue: 90,
    },

    operationSuggestion: {
      priority: "中高",
      action: "推荐基金筛选、组合回测、风险分散和长期配置专题。",
      executor: "资产配置运营、基金产品运营、财富顾问",
      goal: "增强长期留存，并提升其对配置工具和顾问服务的使用率。",
    },
  },

  {
    id: "ai_tool_preference",
    label: "AI工具偏好型",
    value: 14,
    color: "#61b7ed",
    desc: "更愿意使用 AI 问答、智能摘要、智能选股等辅助工具，对新功能接受度高。",
    aiInsight: "AI判断该群体对智能投研功能接受度较高，可作为 AI 功能重点运营人群。",

    overview: {
      peopleCount: 7760,
      activeLevel: "高",
      mainAssets: ["股票", "ETF", "基金"],
      contentPreference: ["AI解读", "智能摘要", "策略问答"],
      behaviorPattern: "AI问答、智能摘要和智能筛选功能使用频繁，反馈行为较明显。",
      conversionStage: "AI功能转化重点",
    },

    relations: [
      {
        target: "深度研究型",
        strength: 74,
        reason: "AI解读降低研报门槛，引导用户消费更深内容。",
      },
      {
        target: "行情追踪型",
        strength: 58,
        reason: "AI解释热点更快，促使用户回到行情页持续追踪。",
      },
      {
        target: "转化潜力型",
        strength: 68,
        reason: "智能服务体验好，高级AI权限更容易形成付费。",
      },
    ],

    commonBehaviors: [
      "AI问答次数较高",
      "偏好使用智能摘要和智能分析",
      "愿意尝试新功能入口",
      "对 AI 输出结果有反馈行为",
    ],

    aiExplanation: {
      inputSignals: [
        { signal: "AI问答使用≥35次", weight: 36 },
        { signal: "AI摘要使用≥22次", weight: 27 },
        { signal: "工具入口点击≥28次", weight: 23 },
        { signal: "结果正向反馈≥12次", weight: 14 },
      ],
      judgement: "该群体的核心价值不只来自传统内容消费，而是来自对智能服务的高接受度。",
      labels: ["AI高接受", "工具驱动", "智能投研", "功能尝鲜"],
    },

    valueScores: {
      activeValue: 82,
      contentValue: 77,
      assetRiskValue: 70,
      conversionValue: 76,
      aiServiceValue: 93,
      complianceTrustValue: 81,
    },

    operationSuggestion: {
      priority: "高",
      action: "优先展示 AI投研助手、智能摘要、智能选股和个性化解释功能。",
      executor: "AI产品运营、算法产品经理、增长运营",
      goal: "提升 AI 功能渗透率，并形成高级智能工具的付费转化。",
    },
  },

  {
    id: "conversion_potential",
    label: "转化潜力型",
    value: 18,
    color: "#5aa7e8",
    desc: "频繁访问产品页、会员页或高级功能，但尚未完成付费转化，处于决策临界阶段。",
    aiInsight: "AI判断该群体具备较高商业转化潜力，适合展示权益对比和限时体验。",

    overview: {
      peopleCount: 9977,
      activeLevel: "中高",
      mainAssets: ["股票", "基金", "ETF"],
      contentPreference: ["会员权益", "产品详情", "高级功能"],
      behaviorPattern: "多次进入产品详情页或会员页，但付费动作尚未完成。",
      conversionStage: "高转化潜力",
    },

    relations: [
      {
        target: "行情追踪型",
        strength: 76,
        reason: "付费意愿来自实时机会，高级行情可承接交易需求。",
      },
      {
        target: "AI工具偏好型",
        strength: 68,
        reason: "愿试高级功能，AI分析能放大效率并推动订阅。",
      },
      {
        target: "深度研究型",
        strength: 55,
        reason: "决策前需更多依据，高级研报可承接付费兴趣。",
      },
    ],

    commonBehaviors: [
      "会员页访问次数较多",
      "产品详情页点击频繁",
      "高级功能入口停留时间较长",
      "存在多次浏览但未付费的犹豫行为",
    ],

    aiExplanation: {
      inputSignals: [
        { signal: "产品页访问≥20次", weight: 32 },
        { signal: "会员页访问≥16次", weight: 29 },
        { signal: "高级功能停留≥10分钟", weight: 24 },
        { signal: "试用入口点击≥9次", weight: 15 },
      ],
      judgement: "该群体已表现出明确兴趣，但仍缺少完成转化的触发因素。",
      labels: ["付费临界", "权益敏感", "高频试用", "转化待激活"],
    },

    valueScores: {
      activeValue: 79,
      contentValue: 73,
      assetRiskValue: 69,
      conversionValue: 91,
      aiServiceValue: 75,
      complianceTrustValue: 80,
    },

    operationSuggestion: {
      priority: "高",
      action: "展示会员权益对比、限时体验、核心功能试用和个性化推荐理由。",
      executor: "会员增长运营、商业化产品运营、客户成功",
      goal: "降低决策门槛，推动从兴趣用户转化为付费用户。",
    },
  },

  {
    id: "risk_warning",
    label: "风险预警型",
    value: 11,
    color: "#8c63e6",
    desc: "近期活跃下降、访问间隔拉长，或出现风险关注增强、合规信号异常等情况，存在沉默或流失风险。",
    aiInsight: "AI判断该群体需要通过热点内容、持仓风险提醒或个性化召回策略进行唤醒。",

    overview: {
      peopleCount: 6097,
      activeLevel: "偏低",
      mainAssets: ["股票", "基金", "高波动资产"],
      contentPreference: ["风险提示", "市场回撤", "合规提醒"],
      behaviorPattern: "近期访问下降，部分用户在市场波动或风险事件后短暂回访。",
      conversionStage: "流失预警 / 风险干预",
    },

    relations: [
      {
        target: "行情追踪型",
        strength: 64,
        reason: "风险事件先来自行情异动，回看行情可定位原因。",
      },
      {
        target: "稳健配置型",
        strength: 57,
        reason: "风险敏感后偏向低波动配置，帮助恢复长期信任。",
      },
      {
        target: "转化潜力型",
        strength: 42,
        reason: "需要诊断和提醒工具，风险服务可转成付费入口。",
      },
    ],

    commonBehaviors: [
      "近期活跃天数下降",
      "访问间隔变长",
      "风险类内容点击增加",
      "对持仓波动和市场回撤信息更敏感",
    ],

    aiExplanation: {
      inputSignals: [
        { signal: "14日活跃下降≥65%", weight: 33 },
        { signal: "最近访问间隔≥12天", weight: 26 },
        { signal: "风险内容点击≥18次", weight: 24 },
        { signal: "异常提醒触发≥7次", weight: 17 },
      ],
      judgement: "该群体既可能存在流失风险，也可能存在风险认知增强，需要优先解释和安抚。",
      labels: ["流失预警", "风险敏感", "需召回", "合规关注"],
    },

    valueScores: {
      activeValue: 46,
      contentValue: 58,
      assetRiskValue: 62,
      conversionValue: 41,
      aiServiceValue: 49,
      complianceTrustValue: 54,
    },

    operationSuggestion: {
      priority: "中高",
      action: "推送持仓风险提醒、市场波动解释、轻量召回内容和人工服务入口。",
      executor: "客户成功、客服团队、合规风控运营",
      goal: "降低沉默和投诉风险，恢复基础活跃与信任。",
    },
  },
];

function polarToCartesian(center, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: center + radius * Math.cos(angleInRadians),
    y: center + radius * Math.sin(angleInRadians),
  };
}

function describeDonutSegment(center, outerRadius, innerRadius, startAngle, endAngle) {
  const outerStart = polarToCartesian(center, outerRadius, startAngle);
  const outerEnd = polarToCartesian(center, outerRadius, endAngle);
  const innerStart = polarToCartesian(center, innerRadius, startAngle);
  const innerEnd = polarToCartesian(center, innerRadius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", outerStart.x, outerStart.y,
    "A", outerRadius, outerRadius, 0, largeArcFlag, 1, outerEnd.x, outerEnd.y,
    "L", innerEnd.x, innerEnd.y,
    "A", innerRadius, innerRadius, 0, largeArcFlag, 0, innerStart.x, innerStart.y,
    "Z",
  ].join(" ");
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");

  if (normalized.length !== 6) {
    return null;
  }

  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function blendColor(baseHex, targetHex, amount) {
  const base = hexToRgb(baseHex);
  const target = hexToRgb(targetHex);

  if (!base || !target) {
    return baseHex;
  }

  const blendChannel = (channel) =>
    Math.round(base[channel] + (target[channel] - base[channel]) * amount);

  return `rgb(${blendChannel("r")}, ${blendChannel("g")}, ${blendChannel("b")})`;
}

function CategoryRadarCard({ onCategoryClick }) {
  const [hoveredLabel, setHoveredLabel] = useState(null);
  const [hoveredCenter, setHoveredCenter] = useState(false);

  const total = categoryProfileData.reduce((sum, item) => sum + item.value, 0);

  const center = 150;
  const outerRadius = 108;
  const innerRadius = 82;
  const labelRadius = (outerRadius + innerRadius) / 2;
  const gap = 9;

  let currentAngle = -8;

  return (
    <motion.div
      className="flex w-full items-center justify-center overflow-visible"
      initial={{
        opacity: 0,
        scale: 0.9,
        filter: "blur(2px) brightness(1.12)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: "blur(0px) brightness(1)",
      }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <svg
        className="h-[620px] w-[760px] overflow-visible"
        viewBox="-30 -10 360 300"
        role="img"
        aria-label="群体画像类型占比"
      >
        {categoryProfileData.map((item) => {
          const segmentAngle = (item.value / total) * 360;
          const startAngle = currentAngle + gap / 2;
          const endAngle = currentAngle + segmentAngle - gap / 2;
          const midAngle = (startAngle + endAngle) / 2;
          const labelPosition = polarToCartesian(center, labelRadius, midAngle);

          currentAngle += segmentAngle;

          const isHovered = hoveredLabel === item.label;
          const hoverOffset = isHovered ? 5 : 0;
          const offsetX = Math.cos(((midAngle - 90) * Math.PI) / 180) * hoverOffset;
          const offsetY = Math.sin(((midAngle - 90) * Math.PI) / 180) * hoverOffset;

          const lineStart = polarToCartesian(center, outerRadius + 5, midAngle);
          const lineMiddle = polarToCartesian(center, outerRadius + 18, midAngle);

          const isRightSide = lineMiddle.x >= center;
          const lineEndX = isRightSide ? 310 : -10;
          const textX = isRightSide ? lineEndX + 6 : lineEndX - 6;
          const textAnchor = isRightSide ? "start" : "end";

          const userCount = Math.round((item.value / 100) * TOTAL_PEOPLE);

          return (
            <g
              key={item.label}
              onMouseEnter={() => setHoveredLabel(item.label)}
              onMouseLeave={() => setHoveredLabel(null)}
              className="cursor-pointer"
            >
              {/* 透明命中区域：专门负责稳定 hover，不参与视觉显示 */}
              <path
                d={describeDonutSegment(
                  center,
                  outerRadius + 18,
                  innerRadius - 16,
                  startAngle,
                  endAngle
                )}
                fill={item.color}
                opacity="0"
                pointerEvents="all"
                onClick={(event) => onCategoryClick(event, item)}
              />

              {/* 真正显示和移动的内容 */}
              <g
                className="transition-all duration-500 ease-out"
                style={{
                  transform: `translate(${offsetX}px, ${offsetY}px) scale(${isHovered ? 1.05 : 1})`,
                  transformOrigin: `${center}px ${center}px`,
                  filter: isHovered
                    ? "brightness(1.12) drop-shadow(0 4px 10px rgba(0,0,0,0.14))"
                    : "brightness(1)",
                  pointerEvents: "none",
                }}
              >
                <path
                  d={describeDonutSegment(center, outerRadius, innerRadius, startAngle, endAngle)}
                  fill={item.color}
                  stroke={item.color}
                  strokeWidth="6"
                  strokeLinejoin="round"
                />

                <text
                  x={labelPosition.x}
                  y={labelPosition.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-white text-[10px] font-bold"
                >
                  {item.value}%
                </text>

                <polyline
                  points={`${lineStart.x},${lineStart.y} ${lineMiddle.x},${lineMiddle.y} ${lineEndX},${lineMiddle.y}`}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="1.2"
                  opacity={isHovered ? "1" : "0.75"}
                />

                <circle
                  cx={lineStart.x}
                  cy={lineStart.y}
                  r="1.6"
                  fill={item.color}
                />

                <text
                  x={textX}
                  y={lineMiddle.y - 4}
                  textAnchor={textAnchor}
                  className="fill-gray-800 text-[7px] font-bold dark:fill-gray-100"
                >
                  {item.label}
                </text>

                <text
                  x={textX}
                  y={lineMiddle.y + 7}
                  textAnchor={textAnchor}
                  fill={item.color}
                  className="text-[6px] font-semibold"
                >
                  {item.value}% - {userCount}人
                </text>
              </g>
            </g>
          );
        })}

        <g
          onMouseEnter={() => setHoveredCenter(true)}
          onMouseLeave={() => setHoveredCenter(false)}
          className="cursor-pointer transition-all duration-300 ease-out"
          style={{
            transform: `scale(${hoveredCenter ? 1.06 : 1})`,
            transformOrigin: `${center}px ${center}px`,
            filter: hoveredCenter
              ? "brightness(1.1) drop-shadow(0 4px 10px rgba(0,0,0,0.12))"
              : "brightness(1)",
          }}
        >
          <circle
            cx={center}
            cy={center}
            r="48"
            fill="white"
            className="dark:fill-gray-900"
          />

          <text
            x={center}
            y={center - 4}
            textAnchor="middle"
            className="pointer-events-none fill-gray-900 text-[14px] font-bold dark:fill-gray-100"
          >
            {TOTAL_PEOPLE}
          </text>

          <text
            x={center}
            y={center + 10}
            textAnchor="middle"
            className="pointer-events-none fill-gray-400 text-[10px] font-semibold dark:fill-gray-500"
          >
            总人数
          </text>
        </g>
      </svg>
    </motion.div>
  );
}

//左上角群体关系气泡节点图
function GroupRelationGraph({ category, allCategories }) {
  const [hoveredNode, setHoveredNode] = useState(null);

  const [graphMouse, setGraphMouse] = useState({
    x: 0,
    y: 0,
    active: false,
  });

  const handleGraphMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    setGraphMouse({
      x,
      y,
      active: true,
    });
  };

  const handleGraphMouseLeave = () => {
    setGraphMouse({
      x: 0,
      y: 0,
      active: false,
    });
  };

  const getNodeOffset = (index = 0, strength = 1) => {
    if (!graphMouse.active) {
      return { x: 0, y: 0 };
    }

    const depth = 5 + index * 1.8;

    return {
      x: graphMouse.x * depth * strength,
      y: graphMouse.y * depth * strength,
    };
  };

  const graphTilt = {
    rotateX: graphMouse.active ? graphMouse.y * -3 : 0,
    rotateY: graphMouse.active ? graphMouse.x * 3.5 : 0,
  };

  const activeNodeId = hoveredNode;

  if (!category || !category.relations?.length) return null;

  const centerNode = {
    id: category.label,
    x: 270,
    y: 170,
    r: 60,
  };

  const getCategoryColor = (label) => {
    const matched = allCategories.find((item) => item.label === label);
    return matched?.color || "#94a3b8";
  };

  const createSeededRandom = (seedText) => {
    let seed = 0;

    for (let i = 0; i < seedText.length; i += 1) {
      seed = (seed * 31 + seedText.charCodeAt(i)) % 2147483647;
    }

    return () => {
      seed = (seed * 48271) % 2147483647;
      return seed / 2147483647;
    };
  };

  const generateRandomNodePositions = ({
    count,
    centerX,
    centerY,
    minDistance = 155,
    minRadius = 160,
    maxRadius = 230,
    bounds = {
      minX: 42,
      maxX: 498,
      minY: 36,
      maxY: 324,
    },
    seedText,
  }) => {
    const random = createSeededRandom(seedText);
    const positions = [];

    for (let i = 0; i < count; i += 1) {
      let bestPosition = null;
      let bestDistanceScore = -Infinity;

      for (let attempt = 0; attempt < 80; attempt += 1) {
        const angle = random() * Math.PI * 2;
        const radius = minRadius + random() * (maxRadius - minRadius);

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        const insideBounds =
          x >= bounds.minX &&
          x <= bounds.maxX &&
          y >= bounds.minY &&
          y <= bounds.maxY;

        if (!insideBounds) continue;

        const distances = positions.map((position) => {
          const dx = position.x - x;
          const dy = position.y - y;
          return Math.sqrt(dx * dx + dy * dy);
        });

        const nearestDistance = distances.length ? Math.min(...distances) : Infinity;

        if (nearestDistance >= minDistance) {
          bestPosition = { x, y };
          break;
        }

        if (nearestDistance > bestDistanceScore) {
          bestDistanceScore = nearestDistance;
          bestPosition = { x, y };
        }
      }

      positions.push(bestPosition || {
        x: centerX + Math.cos((i / count) * Math.PI * 2) * minRadius,
        y: centerY + Math.sin((i / count) * Math.PI * 2) * minRadius,
      });
    }

    return positions;
  };

  const randomPositions = useMemo(() => {
    return generateRandomNodePositions({
      count: category.relations.length,
      centerX: centerNode.x,
      centerY: centerNode.y,
      minDistance: 160,
      minRadius: 170,
      maxRadius: 240,
      seedText: category.id || category.label,
    });
  }, [category.id, category.label, category.relations.length]);

  const relatedNodes = category.relations.map((relation, index) => {
    const position = randomPositions[index];
    const color = getCategoryColor(relation.target);

    return {
      ...relation,
      id: relation.target,
      x: position.x,
      y: position.y,
      r: 42 + (relation.strength / 100) * 8,
      color,
      lightColor: blendColor(color, "#ffffff", 0.4),
      darkColor: blendColor(color, "#0f172a", 0.2),
    };
  });

  const gradientPrefix = `relation-graph-${category.id || "category"}`;
  const centerLightColor = blendColor(category.color, "#ffffff", 0.42);
  const centerDarkColor = blendColor(category.color, "#0f172a", 0.24);

  const shortLabelMap = {
    行情追踪型: ["行情", "追踪型"],
    深度研究型: ["深度", "研究型"],
    稳健配置型: ["稳健", "配置型"],
    AI工具偏好型: ["AI工具", "偏好型"],
    转化潜力型: ["转化", "潜力型"],
    风险预警型: ["风险", "预警型"],
  };

  const getNodeLabelLines = (label) => {
    return shortLabelMap[label] || [label];
  };

  // 连线停在圆边
  const getEdgePoints = (x1, y1, r1, x2, y2, r2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    const ux = dx / dist;
    const uy = dy / dist;

    return {
      startX: x1 + ux * r1,
      startY: y1 + uy * r1,
      endX: x2 - ux * r2,
      endY: y2 - uy * r2,
    };
  };

  const getStableLineAngle = (x1, y1, x2, y2) => {
    let angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

    // 只在初始位置判断一次，避免鼠标移动时来回翻转
    if (angle > 90) {
      angle -= 180;
    }

    if (angle < -90) {
      angle += 180;
    }

    return angle;
  };

  // 关联度放在线上
  const getLineLabel = (x1, y1, x2, y2, strength, stableAngle) => {
    const t = 0.58;

    return {
      midX: x1 + (x2 - x1) * t,
      midY: y1 + (y2 - y1) * t,
      angle: stableAngle,
      text: `${strength}%`,
    };
  };

  return (
    <div className="flex h-full min-h-[300px] flex-col px-5 py-4">
      <div className="mb-2">
        <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
          群体关系网络
        </h2>
        <p className="mt-1 text-[11px] font-normal leading-4 text-gray-400 dark:text-gray-400">
          展示当前群体与其他群体的迁移、转化或行为关联。
        </p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
        {/* 左侧节点图 */}
        <div className="flex min-h-0 items-center justify-center [perspective:900px]">
          <motion.svg
            viewBox="0 0 560 360"
            className="h-[280px] w-full max-w-[540px] -translate-y-[8%] overflow-visible"
            onMouseMove={handleGraphMouseMove}
            onMouseLeave={handleGraphMouseLeave}
            animate={{
              rotateX: graphTilt.rotateX,
              rotateY: graphTilt.rotateY,
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            style={{
              transformOrigin: "50% 50%",
              transformStyle: "preserve-3d",
            }}
          >
            <defs>
              <filter
                id={`${gradientPrefix}-node-shadow`}
                x="-45%"
                y="-45%"
                width="190%"
                height="190%"
                colorInterpolationFilters="sRGB"
              >
                <feDropShadow
                  dx="0"
                  dy="10"
                  stdDeviation="8"
                  floodColor="rgb(15, 23, 42)"
                  floodOpacity="0.12"
                />
              </filter>

              <filter
                id={`${gradientPrefix}-line-shadow`}
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
                colorInterpolationFilters="sRGB"
              >
                <feDropShadow
                  dx="0"
                  dy="3"
                  stdDeviation="2"
                  floodColor="rgb(15, 23, 42)"
                  floodOpacity="0.14"
                />
              </filter>

              <radialGradient
                id={`${gradientPrefix}-center`}
                cx="50%"
                cy="50%"
                r="72%"
              >
                <stop offset="0%" stopColor={centerLightColor} />
                <stop offset="76%" stopColor={category.color} />
                <stop offset="100%" stopColor={centerDarkColor} />
              </radialGradient>

              {relatedNodes.map((node, index) => (
                <React.Fragment key={`defs-${node.target}`}>
                  <radialGradient
                    id={`${gradientPrefix}-node-${index}`}
                    cx="50%"
                    cy="50%"
                    r="72%"
                  >
                    <stop offset="0%" stopColor={node.lightColor} />
                    <stop offset="78%" stopColor={node.color} />
                    <stop offset="100%" stopColor={node.darkColor} />
                  </radialGradient>

                  <linearGradient
                    id={`${gradientPrefix}-line-${index}`}
                    x1={centerNode.x}
                    y1={centerNode.y}
                    x2={node.x}
                    y2={node.y}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor={category.color} stopOpacity="0.66" />
                    <stop offset="100%" stopColor={node.color} stopOpacity="0.74" />
                  </linearGradient>
                </React.Fragment>
              ))}
            </defs>
            {/* 连线 + 线上的关联度 */}
            {relatedNodes.map((node, index) => {
              const centerOffset = getNodeOffset(0, 0.45);
              const nodeOffset = getNodeOffset(index + 1, 1);

              const animatedCenter = {
                ...centerNode,
                x: centerNode.x + centerOffset.x,
                y: centerNode.y + centerOffset.y,
              };

              const animatedNode = {
                ...node,
                x: node.x + nodeOffset.x,
                y: node.y + nodeOffset.y,
              };

              const edge = getEdgePoints(
                animatedCenter.x,
                animatedCenter.y,
                animatedCenter.r,
                animatedNode.x,
                animatedNode.y,
                animatedNode.r
              );

              // 用默认位置算固定角度，不用动态位置算角度
              const baseEdge = getEdgePoints(
                centerNode.x,
                centerNode.y,
                centerNode.r,
                node.x,
                node.y,
                node.r
              );

              const stableAngle = getStableLineAngle(
                baseEdge.startX,
                baseEdge.startY,
                baseEdge.endX,
                baseEdge.endY
              );

              const lineLabel = getLineLabel(
                edge.startX,
                edge.startY,
                edge.endX,
                edge.endY,
                node.strength,
                stableAngle
              );

              return (
                <g key={`line-${node.target}`}>
                  <motion.line
                    x1={edge.startX}
                    y1={edge.startY}
                    x2={edge.endX}
                    y2={edge.endY}
                    stroke={`url(#${gradientPrefix}-line-${index})`}
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    filter={`url(#${gradientPrefix}-line-shadow)`}
                    animate={{
                      x1: edge.startX,
                      y1: edge.startY,
                      x2: edge.endX,
                      y2: edge.endY,
                    }}
                    transition={{
                      duration: 0.18,
                      ease: "easeOut",
                    }}
                  />

                    <motion.g
                      animate={{
                        x: lineLabel.midX,
                        y: lineLabel.midY,
                      }}
                      style={{
                        rotate: `${lineLabel.angle}deg`,
                      }}
                      transition={{
                        duration: 0.18,
                        ease: "easeOut",
                      }}
                    >
                    <rect
                      x={-22}
                      y={-10}
                      width={44}
                      height={20}
                      rx={10}
                      className="fill-white/95 dark:fill-gray-900/95"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      className="fill-gray-800 text-[11px] font-bold dark:fill-gray-100"
                    >
                      {lineLabel.text}
                    </text>
                  </motion.g>
                </g>
              );
            })}

            {/* 中心节点 */}
            <motion.g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode(centerNode.id)}
              onMouseLeave={() => setHoveredNode(null)}
              animate={{
                x: getNodeOffset(0, 0.45).x,
                y: getNodeOffset(0, 0.45).y,
                scale: hoveredNode === centerNode.id ? 1.08 : 1,
                filter:
                  hoveredNode === centerNode.id
                    ? "brightness(1.08) drop-shadow(0 10px 18px rgba(15,23,42,0.24))"
                    : "brightness(1) drop-shadow(0 0px 0px rgba(15,23,42,0))",
              }}
              transition={{
                duration: 0.18,
                ease: "easeOut",
              }}
              style={{
                transformOrigin: `${centerNode.x}px ${centerNode.y}px`,
              }}
            >
              <circle
                cx={centerNode.x}
                cy={centerNode.y}
                r={centerNode.r}
                fill={`url(#${gradientPrefix}-center)`}
                filter={`url(#${gradientPrefix}-node-shadow)`}
              />
              <circle
                cx={centerNode.x}
                cy={centerNode.y}
                r={centerNode.r - 1}
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />

              {getNodeLabelLines(category.label).map((line, index) => (
                <text
                  key={line}
                  x={centerNode.x}
                  y={centerNode.y - 8 + index * 18}
                  textAnchor="middle"
                  className="pointer-events-none fill-gray-900 text-[14px] font-black dark:fill-white"
                >
                  {line}
                </text>
              ))}
            </motion.g>

            {/* 外围节点 */}
            {relatedNodes.map((node, index) => {
              const labelLines = getNodeLabelLines(node.target);
              const isHovered = activeNodeId === node.id;
              const nodeOffset = getNodeOffset(index + 1, 1);

              return (
                <motion.g
                  key={node.target}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  animate={{
                    x: nodeOffset.x,
                    y: nodeOffset.y,
                    scale: isHovered ? 1.1 : 1,
                    filter: isHovered
                      ? "brightness(1.1) drop-shadow(0 8px 14px rgba(15,23,42,0.22))"
                      : "brightness(1) drop-shadow(0 0px 0px rgba(15,23,42,0))",
                  }}
                  transition={{
                    duration: 0.18,
                    ease: "easeOut",
                  }}
                  style={{
                    transformOrigin: `${node.x}px ${node.y}px`,
                  }}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r}
                    fill={`url(#${gradientPrefix}-node-${index})`}
                    filter={`url(#${gradientPrefix}-node-shadow)`}
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r - 1}
                    fill="none"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="1"
                  />

                  {labelLines.map((line, lineIndex) => (
                    <text
                      key={`${node.target}-${line}`}
                      x={node.x}
                      y={node.y - 7 + lineIndex * 17}
                      textAnchor="middle"
                      className="pointer-events-none fill-gray-900 text-[12px] font-black dark:fill-white"
                    >
                      {line}
                    </text>
                  ))}
                </motion.g>
              );
            })}
          </motion.svg>
        </div>

        {/* 右侧关系摘要 */}
        <div className="flex min-h-0 flex-col justify-start gap-4 overflow-hidden pt-8">
          {category.relations.map((relation) => {
            const relationColor = getCategoryColor(relation.target);
            const isRelationActive = activeNodeId === relation.target;

            return (
              <div
                key={relation.target}
                className={`group cursor-pointer border-l-2 py-2 pl-4 transition-all duration-300 ${
                  isRelationActive ? "translate-x-0.5" : "hover:translate-x-0.5"
                }`}
                onMouseEnter={() => setHoveredNode(relation.target)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ borderColor: relationColor }}
              >
                <div className="mb-1 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full transition-transform duration-300 ${
                        isRelationActive ? "scale-125" : "group-hover:scale-125"
                      }`}
                      style={{ backgroundColor: relationColor }}
                    />
                    <span className="truncate text-xs font-bold text-gray-800 dark:text-gray-100">
                      {category.label} → {relation.target}
                    </span>
                  </div>

                  <span className="shrink-0 text-[11px] font-bold text-gray-900 dark:text-gray-100">
                    关联度 {relation.strength}%
                  </span>
                </div>

                <p
                  className={`line-clamp-2 text-[11px] leading-5 transition-colors duration-300 ${
                    isRelationActive
                      ? "text-gray-700 dark:text-gray-300"
                      : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
                  }`}
                >
                  {relation.reason}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

//群体基础数据组件
function GroupBasicDataTable({ category }) {
  const overview = category?.overview;

  if (!overview) return null;

  const tableRows = [
    {
      label: "群体人数",
      value: `${overview.peopleCount.toLocaleString()} 人`,
    },
    {
      label: "整体占比",
      value: `${category.value}%`,
    },
    {
      label: "活跃水平",
      value: overview.activeLevel,
    },
    {
      label: "主要资产",
      value: overview.mainAssets.join(" / "),
    },
    {
      label: "内容偏好",
      value: overview.contentPreference.join(" / "),
    },
    {
      label: "阶段判断",
      value: overview.conversionStage,
    },
  ];

  return (
    <div className="flex h-full min-h-[260px] flex-col px-5 py-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
          群体基础数据
        </h2>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200/70 dark:border-gray-800">
        <table className="w-full table-fixed border-collapse">
          <tbody>
            {tableRows.map((row) => (
              <tr
                key={row.label}
                className="border-b border-gray-100 last:border-b-0 transition-colors duration-200 hover:bg-blue-50/40 dark:border-gray-800 dark:hover:bg-white/[0.04]"
              >
                <td className="w-[34%] bg-gray-50/80 px-3 py-2.5 text-[12px] font-semibold text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                  {row.label}
                </td>

                <td className="px-3 py-2.5 text-right text-[12px] font-bold leading-5 text-gray-800 dark:text-gray-100">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 rounded-xl bg-gray-50 px-3 py-2.5 text-[11px] font-medium leading-5 text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
        {overview.behaviorPattern}
      </div>
    </div>
  );
}

//AI决策解释组件
function SignalWeightBars({ category }) {
  const explanation = category?.aiExplanation;
  const signals = explanation?.inputSignals || [];

  if (!signals?.length) return null;

  const maxWeight = Math.max(...signals.map((item) => item.weight), 1);

  return (
    <div className="flex h-full flex-col px-5 py-4">
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 md:grid-cols-[minmax(0,25rem)_1px_minmax(0,1fr)]">
        <div className="flex min-h-0 flex-col">
          <div className="mb-4 grid grid-cols-[8.25rem_minmax(0,1fr)] items-center gap-2.5">
            <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
              AI决策解释
            </h2>
            <span className="text-right text-[11px] font-semibold text-gray-400 dark:text-gray-500">
              权重
            </span>
          </div>

          <div className="flex flex-1 flex-col justify-center gap-3">
            {signals.map((item) => {
              const barWidth = `${Math.max((item.weight / maxWeight) * 100, 10)}%`;

              return (
                <div
                  key={item.signal}
                  className="grid grid-cols-[8.25rem_minmax(0,1fr)] items-center gap-2.5"
                >
                  <span className="truncate text-[11.5px] font-medium leading-6 text-gray-500 dark:text-gray-400">
                    {item.signal}
                  </span>

                  <div className="relative h-8 rounded-full bg-transparent">
                    <motion.div
                      className="flex h-full items-center justify-end rounded-full pr-3 text-right shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_6px_14px_rgba(15,23,42,0.08)]"
                      style={{ backgroundColor: category.color }}
                      initial={{ width: 0 }}
                      animate={{ width: barWidth }}
                      transition={{
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <span className="text-sm font-black leading-none text-gray-900 dark:text-gray-950">
                        {item.weight}%
                      </span>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden bg-gray-200/80 dark:bg-gray-800 md:block" />

        <div className="flex min-h-0 flex-col py-1">
          <div>
            <h2 className="mb-2 text-base font-black text-gray-800 dark:text-gray-100">
              结论
            </h2>
            <p className="text-[12px] font-medium leading-6 text-gray-500 dark:text-gray-400">
              {explanation.judgement}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-2">
            {explanation.labels.map((label) => (
              <span
                key={label}
                className="min-w-0 rounded-full px-3 py-1 text-center text-[11px] font-semibold text-gray-800 dark:text-gray-100"
                style={{ backgroundColor: category.color }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


// AI运营建议组件
function OperationSuggestionCard({ category }) {
  const suggestion = category?.operationSuggestion;

  if (!suggestion) return null;

  const formatExecutorList = (text) => text?.replace(/[、，,]\s*/g, " / ");
  const detailSections = [
    { title: "推荐动作", content: suggestion.action },
    { title: "执行人群", content: formatExecutorList(suggestion.executor) },
    { title: "运营目标", content: suggestion.goal },
  ].filter((item) => item.content);

  return (
    <motion.div
      className="flex h-full flex-col rounded-2xl bg-white px-5 py-[12.48px] shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700/60"
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* 标题 */}
      <div className="pb-[8.32px]">
        <h2 className="text-base font-black text-gray-800 dark:text-gray-100">
          运营建议
        </h2>
      </div>

      {/* 分割线 */}
      <div className="h-px bg-gray-200/80 dark:bg-gray-700" />

      <div className="mt-[10.4px] space-y-[10.4px]">
        <p className="text-[12px] leading-[18.72px] text-gray-700 dark:text-gray-300">
          <span className="font-bold text-gray-800 dark:text-gray-100">
            优先级：
          </span>
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {suggestion.priority}
          </span>
        </p>

        {detailSections.map((item) => (
          <div key={item.title}>
            <p className="text-[12px] font-bold leading-[17.68px] text-gray-800 dark:text-gray-100">
              {item.title}
            </p>
            <p className="mt-[1.04px] pl-2 text-[11px] font-medium leading-[16.64px] text-gray-600 dark:text-gray-300">
              {item.content}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}


//弹窗组件
function CategoryDetailModal({ category, originRect, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 背景遮罩 */}
      <motion.div
        className="absolute inset-0 bg-black/45 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* 弹窗主体 */}
      <motion.div
        className="fixed z-10 overflow-hidden bg-gray-50 shadow-2xl ring-1 ring-black/10 dark:bg-gray-950 dark:ring-white/10"
        initial={{
          left: originRect.left,
          top: originRect.top,
          width: originRect.width,
          height: originRect.height,
          opacity: 0.6,
          borderRadius: 999,
          x: 0,
        }}
        animate={{
          left: "50%",
          top: "5vh",
          width: "min(90vw, 1180px)",
          height: "90vh",
          opacity: 1,
          borderRadius: 28,
          x: "-50%",
        }}
        exit={{
          left: originRect.left,
          top: originRect.top,
          width: originRect.width,
          height: originRect.height,
          opacity: 0,
          borderRadius: 999,
          x: 0,
        }}
        transition={{
          duration: 0.36,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* 顶部配色条 */}
        {/* 顶部标题配色条 */}
        <div
          className="flex h-20 w-full items-center px-8"
          style={{ backgroundColor: category.color }}
        >
          <div>
            <p className="text-xs font-bold text-white/75">
              群体画像详情
            </p>
            <h2 className="mt-1 text-2xl font-black text-white">
              {category.label}&nbsp;&nbsp;({category.value}%)
            </h2>
          </div>
        </div>

        {/* 四个显示框区域 */}
        <div className="h-[calc(100%-5rem)] overflow-y-auto p-6">
          <div className="grid h-full grid-cols-12 gap-6">
            {/* 左上：群体关系网络 */}
            <section className={`${modalCardClass} col-span-full min-h-[260px] overflow-hidden xl:col-span-8`}>
              <GroupRelationGraph
                category={category}
                allCategories={categoryProfileData}
              />
            </section>

            {/* 右上：群体基础概览 */}
            <section className={`${modalCardClass} col-span-full min-h-[260px] overflow-hidden xl:col-span-4`}>
              <GroupBasicDataTable category={category} />
            </section>

            {/* 左下：AI决策解释 */}
            <section className={`${modalCardClass} col-span-full min-h-[220px] xl:col-span-8`}>
              <SignalWeightBars category={category} />
            </section>

            {/* 右下：六维价值与运营建议 */}
            <section className={`${modalCardClass} col-span-full min-h-[220px] xl:col-span-4`}>
              <OperationSuggestionCard category={category} />
            </section>
          </div>
        </div>

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-500 transition hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          X
        </button>

      </motion.div>
    </motion.div>
  );
}

//背景美化组件
function InteractiveParticleBackground({ mouse }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 页面基础淡光 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(59,130,246,0.06),transparent_36%),radial-gradient(circle_at_82%_18%,rgba(139,92,246,0.05),transparent_30%),radial-gradient(circle_at_18%_82%,rgba(16,185,129,0.045),transparent_32%)]" />

      {/* 鼠标附近的淡淡光晕 */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(96,165,250,0.10), rgba(96,165,250,0.06) 14%, transparent 34%)`,
        }}
        transition={{
          duration: 0.22,
          ease: "easeOut",
        }}
      />
    </div>
  );
}

function Group_profile({ sidebarOpen, setSidebarOpen }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [originRect, setOriginRect] = useState(null);

  const [mouse, setMouse] = useState({
    x: 50,
    y: 50,
  });

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setMouse({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleCategoryClick = (event, category) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setOriginRect({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    });

    setSelectedCategory(category);
  };

  const closeDetail = () => {
    setSelectedCategory(null);
  };

  return (
    <>
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        variant="v3"
      />

      <main
        onMouseMove={handleMouseMove}
        className="relative grow overflow-hidden bg-gray-50 transition-colors duration-300 dark:bg-gray-950"
      >
        <InteractiveParticleBackground mouse={mouse} />

        <div
          className={`relative z-10 flex min-h-full w-full items-center justify-center overflow-visible px-4 py-8 transition duration-300 sm:px-6 lg:px-8 ${
            selectedCategory ? "scale-[0.98] blur-sm brightness-75" : ""
          }`}
        >
          <CategoryRadarCard onCategoryClick={handleCategoryClick} />
        </div>

        <AnimatePresence>
          {selectedCategory && originRect && (
            <CategoryDetailModal
              category={selectedCategory}
              originRect={originRect}
              onClose={closeDetail}
            />
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

export default Group_profile;
