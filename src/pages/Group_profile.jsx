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
        reason: "高频访问行情后，容易进入产品详情页或会员权益页。",
      },
      {
        target: "风险预警型",
        strength: 64,
        reason: "对短期波动敏感，市场下跌时更容易关注风险资讯。",
      },
      {
        target: "AI工具偏好型",
        strength: 58,
        reason: "常使用 AI 问答解释行情波动和个股异动原因。",
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
        "30天活跃天数较高",
        "行情页访问集中在交易时段",
        "自选股与指数页面访问频繁",
        "突发新闻后的回访率高",
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
        reason: "常使用 AI 摘要、研报提炼和行业问答辅助理解内容。",
      },
      {
        target: "稳健配置型",
        strength: 61,
        reason: "部分用户从行业研究逐渐转向长期配置和组合分析。",
      },
      {
        target: "转化潜力型",
        strength: 55,
        reason: "对高级数据、研报权限和投研工具存在潜在付费需求。",
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
        "研报下载次数高于平均水平",
        "长文本页面停留时间较长",
        "行业关键词搜索频繁",
        "收藏和二次访问比例较高",
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
        reason: "部分用户会通过研报和行业分析辅助长期配置决策。",
      },
      {
        target: "风险预警型",
        strength: 57,
        reason: "当市场波动加剧时，该群体会提高对风险提示和持仓稳定性的关注。",
      },
      {
        target: "转化潜力型",
        strength: 49,
        reason: "对组合分析、基金筛选和资产配置工具存在一定付费可能。",
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
        "基金和ETF相关页面访问占比较高",
        "风险等级偏中低",
        "短线行情页面访问频率较低",
        "资产配置类内容收藏较多",
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
        reason: "常用 AI 对研报和行业内容进行摘要、提炼和解释。",
      },
      {
        target: "行情追踪型",
        strength: 58,
        reason: "使用 AI 解释行情波动、个股异动和热点事件。",
      },
      {
        target: "转化潜力型",
        strength: 68,
        reason: "对高级 AI 工具、智能分析权限和会员功能接受度较高。",
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
        "AI问答次数高于平均水平",
        "AI摘要功能使用频率高",
        "智能工具入口点击率高",
        "AI正反馈数量较多",
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
        reason: "行情高频用户容易因实时提醒、高级行情工具产生付费意愿。",
      },
      {
        target: "AI工具偏好型",
        strength: 68,
        reason: "对高级 AI 功能存在较强兴趣，适合转化为智能工具用户。",
      },
      {
        target: "深度研究型",
        strength: 55,
        reason: "深度内容用户可能为高级研报和数据权限付费。",
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
        "产品详情点击次数高",
        "会员页访问频率高",
        "高级功能入口曝光后停留较久",
        "内容消费和工具使用均达到一定水平",
      ],
      judgement: "该群体已表现出明确兴趣，但仍缺少完成转化的触发因素。",
      labels: ["付费犹豫", "权益敏感", "高转化潜力", "临界决策"],
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
        reason: "市场剧烈波动时，行情追踪用户可能转入风险关注状态。",
      },
      {
        target: "稳健配置型",
        strength: 57,
        reason: "风险敏感用户可能逐渐转向更稳健的资产配置需求。",
      },
      {
        target: "转化潜力型",
        strength: 42,
        reason: "部分用户仍可能通过风险工具、组合诊断功能产生转化。",
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
        "30天活跃天数下降",
        "最近访问时间变远",
        "风险类内容点击比例上升",
        "部分用户存在异常登录、投诉或人工复核信号",
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

  const getNodeOffset = (node, index = 0, strength = 1) => {
    if (!graphMouse.active) {
      return { x: 0, y: 0 };
    }

    const depth = 5 + index * 1.8;

    return {
      x: graphMouse.x * depth * strength,
      y: graphMouse.y * depth * strength,
    };
  };

  if (!category || !category.relations?.length) return null;

  const centerNode = {
    id: category.label,
    x: 260,
    y: 170,
    r: 52,
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
    minDistance = 120,
    minRadius = 125,
    maxRadius = 205,
    bounds = {
      minX: 52,
      maxX: 468,
      minY: 46,
      maxY: 294,
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
      minDistance: 150,
      minRadius: 155,
      maxRadius: 225,
      seedText: category.id || category.label,
    });
  }, [category.id, category.label, category.relations.length]);

  const relatedNodes = category.relations.map((relation, index) => {
    const position = randomPositions[index];

    return {
      ...relation,
      id: relation.target,
      x: position.x,
      y: position.y,
      r: 42 + (relation.strength / 100) * 8,
      color: getCategoryColor(relation.target),
    };
  });


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
      <h2 className="mb-2 text-base font-bold text-gray-800 dark:text-gray-100">
        群体关系网络
      </h2>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
        {/* 左侧节点图 */}
        <div className="flex min-h-0 items-center justify-center">
          <svg
            viewBox="0 0 540 360"
            className="h-[270px] w-full max-w-[510px] overflow-visible"
            onMouseMove={handleGraphMouseMove}
            onMouseLeave={handleGraphMouseLeave}
          >
            {/* 连线 + 线上的关联度 */}
            {relatedNodes.map((node, index) => {
              const centerOffset = getNodeOffset(centerNode, 0, 0.45);
              const nodeOffset = getNodeOffset(node, index + 1, 1);

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
                    stroke="rgba(100,116,139,0.45)"
                    strokeWidth={1.9}
                    strokeLinecap="round"
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
            const centerOffset = getNodeOffset(centerNode, 0, 0.45);

            <motion.g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode(centerNode.id)}
              onMouseLeave={() => setHoveredNode(null)}
              animate={{
                x: getNodeOffset(centerNode, 0, 0.45).x,
                y: getNodeOffset(centerNode, 0, 0.45).y,
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
                fill={category.color}
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
              const isHovered = hoveredNode === node.id;
              const nodeOffset = getNodeOffset(node, index + 1, 1);

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
                    fill={node.color}
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
          </svg>
        </div>

        {/* 右侧关系摘要 */}
        <div className="flex min-h-0 flex-col justify-start gap-4 overflow-hidden pt-8">
          {category.relations.map((relation) => {
            const relationColor = getCategoryColor(relation.target);

            return (
              <div
                key={relation.target}
                className="group border-l-2 py-2 pl-4 transition-all duration-300 hover:translate-x-0.5"
                style={{ borderColor: relationColor }}
              >
                <div className="mb-1 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
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

                <p className="line-clamp-2 text-[11px] leading-5 text-gray-500 transition-colors duration-300 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300">
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
              <div className="flex h-full flex-col px-5 py-4">
                <h2 className="mb-3 text-base font-bold text-gray-800 dark:text-gray-100">
                  AI决策解释
                </h2>
              </div>
            </section>

            {/* 右下：六维价值与运营建议 */}
            <section className={`${modalCardClass} col-span-full min-h-[220px] xl:col-span-4`}>
              <div className="flex h-full flex-col px-5 py-4">
                <h2 className="mb-3 text-base font-bold text-gray-800 dark:text-gray-100">
                  六维价值与运营建议
                </h2>
              </div>
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