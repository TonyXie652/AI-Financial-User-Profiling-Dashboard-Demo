import { useEffect, useRef, useState } from "react";
import { LayoutGroup, motion, AnimatePresence } from "framer-motion";
import Header from "../partials/Header";
import { useThemeProvider } from "../utils/ThemeContext";

// 顶部TagBar数据：
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

// Sankey Diagram Database：
const tagSourceGroups = [
  {
    id: "ltv",
    label: "LTV 用户长期价值",
    desc: "衡量用户在完整生命周期内可能带来的长期服务价值、留存价值和商业价值。",
    sources: [
      "注册时间",
      "留存周期",
      "活跃天数",
      "沉默天数",
      "使用深度",
      "历史付费记录",
      "产品页点击",
      "服务触达响应",
    ],
    effects: [
      "识别长期高价值用户",
      "判断用户未来服务价值",
      "辅助客户分层运营",
      "支持会员和专业服务转化策略",
    ],
  },
  {
    id: "pe",
    label: "PE 付费意愿",
    desc: "衡量用户对会员、研报、数据服务、专业功能等付费产品的兴趣和转化可能性。",
    sources: [
      "会员页点击",
      "产品详情页访问",
      "报告下载",
      "权益领取",
      "价格页停留",
      "客服咨询",
      "试用功能使用",
      "历史购买或续费记录",
    ],
    effects: [
      "识别高付费意愿用户",
      "判断会员转化可能性",
      "辅助付费产品推荐",
      "减少无效营销触达",
    ],
  },
  {
    id: "asset_preference",
    label: "资产偏好",
    desc: "识别用户重点关注的金融资产类型，用于内容推荐、服务匹配和投资偏好判断。",
    sources: [
      "自选股",
      "股票浏览",
      "ETF 浏览",
      "基金浏览",
      "债券关注",
      "指数查看",
      "A股 / 港股 / 美股访问",
      "行业板块关注",
    ],
    effects: [
      "判断用户关注的资产类别",
      "匹配资产相关资讯和研报",
      "支持个性化内容推荐",
      "辅助构建投资偏好画像",
    ],
  },
  {
    id: "risk_preference",
    label: "风险偏好",
    desc: "衡量用户对市场波动、亏损风险、高波动资产和避险资产的接受程度。",
    sources: [
      "风险测评结果",
      "高波动资产浏览",
      "避险资产关注",
      "亏损相关搜索",
      "风险提示点击",
      "市场下跌期间访问行为",
      "止损 / 回撤 / 暴跌关键词搜索",
    ],
    effects: [
      "判断用户风险承受能力",
      "避免内容和服务错配",
      "辅助投资者适当性判断",
      "优化风险提示和产品推荐",
    ],
  },
  {
    id: "investment_style",
    label: "投资风格",
    desc: "识别用户的投资决策方式，例如短线交易、长期配置、价值研究、成长偏好或事件驱动。",
    sources: [
      "行情查看频率",
      "个股搜索行为",
      "研报阅读深度",
      "技术指标使用",
      "宏观新闻浏览",
      "快讯点击",
      "公司公告查看",
      "模拟组合或资产配置行为",
    ],
    effects: [
      "判断用户投资决策风格",
      "区分短线型和长期配置型用户",
      "匹配不同深度的金融内容",
      "辅助生成更具体的用户画像",
    ],
  },
  {
    id: "content_demand",
    label: "内容需求",
    desc: "识别用户对资讯、研报、宏观、政策、行业、公司等金融内容的需求类型。",
    sources: [
      "财经新闻浏览",
      "研报阅读",
      "宏观数据查看",
      "政策内容关注",
      "行业分析浏览",
      "公司公告查看",
      "快讯点击",
      "搜索关键词",
    ],
    effects: [
      "判断用户内容兴趣方向",
      "提升资讯推荐准确性",
      "辅助专题和栏目运营",
      "提高内容点击和阅读深度",
    ],
  },
  {
    id: "engagement",
    label: "行为活跃度",
    desc: "衡量用户在平台上的访问频率、互动强度和功能使用深度。",
    sources: [
      "登录次数",
      "访问天数",
      "最近访问时间",
      "单次停留时长",
      "页面浏览量",
      "搜索次数",
      "收藏行为",
      "分享和评论行为",
    ],
    effects: [
      "判断用户活跃状态",
      "识别高频和低频用户",
      "辅助用户留存分析",
      "支持运营优先级排序",
    ],
  },
  {
    id: "churn_risk",
    label: "风险与流失信号",
    desc: "识别用户活跃下降、服务不匹配、负反馈和潜在流失风险。",
    sources: [
      "访问频率下降",
      "沉默天数增加",
      "搜索次数减少",
      "报告下载减少",
      "权益页不再点击",
      "推送关闭",
      "负反馈",
      "投诉或低评分记录",
    ],
    effects: [
      "提前识别流失风险",
      "辅助用户召回",
      "发现服务错配问题",
      "优化触达频率和触达内容",
    ],
  },
];
const sankeyOutputLabel = "画像标签输出";

// 标签分类数据库：
const tagTypeDatabase = [
  {
    id: "market_tracking",
    tagName: "行情追踪标签",
    tagCategory: "行为活跃标签",
    tagStrength: 86,
    strengthLevel: "高",
    definition:
      "高频关注指数、个股异动、涨跌幅榜和资金流向，对短期市场波动高度敏感。",

    coreMetrics: [
      {
        name: "行情访问频次",
        value: "42次/周",
        desc: "用户每周查看行情、指数、个股页面的频率。",
      },
      {
        name: "盘中访问占比",
        value: "76%",
        desc: "交易时段内访问行为占总访问行为的比例。",
      },
      {
        name: "自选股数量",
        value: "18只",
        desc: "用户加入自选列表的股票数量。",
      },
      {
        name: "资金流向点击率",
        value: "31%",
        desc: "用户对主力资金、北向资金、行业资金流向等内容的点击比例。",
      },
      {
        name: "技术指标使用率",
        value: "24%",
        desc: "用户查看K线、MACD、RSI、BOLL等技术指标的比例。",
      },
    ],

    financialFeatures: {
      focusAssets: ["A股", "指数", "ETF"],
      investmentStyle: ["短线交易", "趋势跟踪"],
      riskPreference: "中高风险",
      focusIndicators: [
        "涨跌幅",
        "成交量",
        "换手率",
        "主力净流入",
        "北向资金",
        "MACD",
        "RSI",
      ],
    },

    judgmentBasis:
      "近30日内，该用户多次查看涨跌幅榜、主力资金流向和自选股异动，盘中访问占比显著高于平台均值，因此归类为行情追踪型。",
  },

  {
    id: "deep_research",
    tagName: "深度研究标签",
    tagCategory: "内容需求标签",
    tagStrength: 82,
    strengthLevel: "高",
    definition:
      "偏好阅读研报、财报、行业专题和公司公告，倾向通过基本面信息进行投资判断。",

    coreMetrics: [
      {
        name: "研报阅读时长",
        value: "126分钟/月",
        desc: "用户在研究报告、专题分析页面的累计阅读时长。",
      },
      {
        name: "研报下载次数",
        value: "9次/月",
        desc: "用户下载券商研报、行业报告、公司深度报告的次数。",
      },
      {
        name: "财报页面访问次数",
        value: "34次/月",
        desc: "用户访问上市公司财务报表、业绩公告页面的次数。",
      },
      {
        name: "公司公告点击率",
        value: "28%",
        desc: "用户对定期报告、重大事项公告、业绩预告等内容的点击比例。",
      },
      {
        name: "内容收藏次数",
        value: "14次/月",
        desc: "用户收藏研报、资讯、专题内容的次数。",
      },
    ],

    financialFeatures: {
      focusAssets: ["A股", "港股", "行业指数"],
      investmentStyle: ["基本面分析", "中长期研究"],
      riskPreference: "中等风险",
      focusIndicators: [
        "ROE",
        "PE",
        "PB",
        "EPS",
        "营收增速",
        "净利润增速",
        "毛利率",
        "经营现金流",
        "行业景气度",
      ],
    },

    judgmentBasis:
      "近30日内，该用户在研报、财报和行业专题页面停留时间较长，且多次查看ROE、PE、PB、营收增速等基本面指标，因此归类为深度研究型。",
  },

  {
    id: "stable_allocation",
    tagName: "稳健配置标签",
    tagCategory: "资产偏好标签",
    tagStrength: 78,
    strengthLevel: "中高",
    definition:
      "偏好基金、ETF、债券和红利类资产，关注资产配置、组合稳定性和长期收益表现。",

    coreMetrics: [
      {
        name: "基金/ETF访问占比",
        value: "48%",
        desc: "用户访问基金、ETF相关页面的比例。",
      },
      {
        name: "债券内容访问占比",
        value: "19%",
        desc: "用户访问债券、债券基金、固收类内容的比例。",
      },
      {
        name: "资产配置工具使用次数",
        value: "7次/月",
        desc: "用户使用组合配置、收益测算、风险评估工具的次数。",
      },
      {
        name: "最大回撤关注度",
        value: "32%",
        desc: "用户查看基金或组合历史最大回撤指标的比例。",
      },
      {
        name: "组合波动率关注度",
        value: "27%",
        desc: "用户查看组合波动率、收益稳定性等指标的比例。",
      },
    ],

    financialFeatures: {
      focusAssets: ["基金", "ETF", "债券基金", "红利股"],
      investmentStyle: ["长期配置", "分散投资", "低波动策略"],
      riskPreference: "稳健型",
      focusIndicators: [
        "夏普比率",
        "最大回撤",
        "年化收益率",
        "波动率",
        "久期",
        "收益回撤比",
        "红利率",
      ],
    },

    judgmentBasis:
      "近30日内，该用户主要浏览基金、ETF和债券类内容，并多次查看最大回撤、夏普比率、波动率等风险调整后收益指标，因此归类为稳健配置型。",
  },

  {
    id: "high_risk_preference",
    tagName: "高风险偏好标签",
    tagCategory: "风险偏好标签",
    tagStrength: 74,
    strengthLevel: "中高",
    definition:
      "偏好高波动、高弹性资产，对题材股、杠杆工具、期权期货等高风险品种关注度较高。",

    coreMetrics: [
      {
        name: "高波动资产浏览占比",
        value: "41%",
        desc: "用户浏览高Beta、高换手率、高涨跌幅标的的比例。",
      },
      {
        name: "期货/期权访问次数",
        value: "11次/月",
        desc: "用户查看期货、期权等衍生品内容的次数。",
      },
      {
        name: "杠杆内容点击率",
        value: "22%",
        desc: "用户点击融资融券、杠杆交易、保证金交易内容的比例。",
      },
      {
        name: "题材股关注度",
        value: "37%",
        desc: "用户对热点题材、概念板块、短线龙头股的关注比例。",
      },
      {
        name: "风险提示点击率",
        value: "13%",
        desc: "用户点击风险公告、退市风险、异常波动提示的比例。",
      },
    ],

    financialFeatures: {
      focusAssets: ["题材股", "期货", "期权", "高Beta股票"],
      investmentStyle: ["短线博弈", "高弹性交易", "事件驱动"],
      riskPreference: "进取型",
      focusIndicators: [
        "Beta",
        "波动率",
        "VaR",
        "成交量",
        "换手率",
        "融资余额",
        "涨跌停",
        "流动性风险",
      ],
    },

    judgmentBasis:
      "近30日内，该用户频繁浏览高波动个股、题材板块和杠杆交易相关内容，对Beta、波动率、融资余额等指标关注度较高，因此归类为高风险偏好型。",
  },

  {
    id: "macro_policy_focus",
    tagName: "宏观政策关注标签",
    tagCategory: "内容需求标签",
    tagStrength: 80,
    strengthLevel: "高",
    definition:
      "重点关注宏观经济、政策变化、利率走势、汇率波动和国内外重大经济事件。",

    coreMetrics: [
      {
        name: "宏观新闻阅读占比",
        value: "36%",
        desc: "用户阅读宏观经济、政策、国际市场新闻的比例。",
      },
      {
        name: "政策解读点击率",
        value: "29%",
        desc: "用户点击财政政策、货币政策、监管政策解读内容的比例。",
      },
      {
        name: "经济数据访问次数",
        value: "21次/月",
        desc: "用户访问GDP、CPI、PMI、社融、M2等经济数据页面的次数。",
      },
      {
        name: "利率/汇率页面访问次数",
        value: "16次/月",
        desc: "用户查看利率、汇率、国债收益率等页面的次数。",
      },
      {
        name: "海外市场关注度",
        value: "23%",
        desc: "用户对美联储、美元指数、美股、全球市场内容的关注比例。",
      },
    ],

    financialFeatures: {
      focusAssets: ["指数", "债券", "外汇", "黄金", "大类资产"],
      investmentStyle: ["宏观驱动", "资产轮动", "政策敏感"],
      riskPreference: "中等风险",
      focusIndicators: [
        "GDP",
        "CPI",
        "PPI",
        "PMI",
        "社融",
        "M2",
        "利率",
        "汇率",
        "国债收益率",
        "美元指数",
      ],
    },

    judgmentBasis:
      "近30日内，该用户高频阅读宏观政策、经济数据和海外市场内容，并多次查看利率、汇率、CPI、PMI等指标，因此归类为宏观政策关注型。",
  },

  {
    id: "technical_analysis",
    tagName: "技术分析标签",
    tagCategory: "投资风格标签",
    tagStrength: 77,
    strengthLevel: "中高",
    definition:
      "偏好使用K线形态、成交量、均线系统和技术指标判断短中期价格趋势。",

    coreMetrics: [
      {
        name: "K线页面访问次数",
        value: "58次/月",
        desc: "用户查看个股、指数K线图的次数。",
      },
      {
        name: "技术指标切换次数",
        value: "43次/月",
        desc: "用户切换MACD、KDJ、RSI、BOLL等指标的次数。",
      },
      {
        name: "分钟线查看占比",
        value: "34%",
        desc: "用户查看1分钟、5分钟、15分钟等短周期K线的比例。",
      },
      {
        name: "成交量指标关注度",
        value: "39%",
        desc: "用户查看成交量、量比、换手率等交易活跃指标的比例。",
      },
      {
        name: "趋势指标使用率",
        value: "31%",
        desc: "用户使用均线、BOLL、MACD等趋势判断指标的比例。",
      },
    ],

    financialFeatures: {
      focusAssets: ["A股", "指数", "ETF", "期货"],
      investmentStyle: ["技术分析", "趋势交易", "短中线操作"],
      riskPreference: "中高风险",
      focusIndicators: [
        "K线",
        "MA均线",
        "MACD",
        "KDJ",
        "RSI",
        "BOLL",
        "成交量",
        "量比",
        "换手率",
      ],
    },

    judgmentBasis:
      "近30日内，该用户频繁查看K线图、分钟线和技术指标，且对成交量、均线、MACD、RSI等指标使用频率较高，因此归类为技术分析型。",
  },

  {
    id: "fund_preference",
    tagName: "基金偏好标签",
    tagCategory: "资产偏好标签",
    tagStrength: 72,
    strengthLevel: "中高",
    definition:
      "主要关注公募基金、基金经理、基金评级和基金历史业绩，偏好通过基金产品参与市场。",

    coreMetrics: [
      {
        name: "基金页面访问占比",
        value: "44%",
        desc: "用户访问基金净值、基金排行、基金详情页的比例。",
      },
      {
        name: "基金经理查看次数",
        value: "18次/月",
        desc: "用户查看基金经理履历、管理规模、历史业绩的次数。",
      },
      {
        name: "基金排行点击率",
        value: "26%",
        desc: "用户点击收益排行、评级排行、热销基金榜单的比例。",
      },
      {
        name: "基金净值查询次数",
        value: "32次/月",
        desc: "用户查看单位净值、累计净值、估算净值的次数。",
      },
      {
        name: "定投内容关注度",
        value: "21%",
        desc: "用户阅读基金定投、长期持有、组合配置内容的比例。",
      },
    ],

    financialFeatures: {
      focusAssets: ["主动权益基金", "指数基金", "债券基金", "混合基金"],
      investmentStyle: ["基金配置", "长期持有", "定投策略"],
      riskPreference: "稳健偏进取",
      focusIndicators: [
        "单位净值",
        "累计净值",
        "基金规模",
        "基金评级",
        "基金经理年限",
        "近一年收益率",
        "最大回撤",
        "夏普比率",
      ],
    },

    judgmentBasis:
      "近30日内，该用户主要访问基金详情、基金排行、基金经理和基金净值页面，并关注收益率、最大回撤、基金评级等指标，因此归类为基金偏好型。",
  },

  {
    id: "commercial_value",
    tagName: "高商业价值标签",
    tagCategory: "商业价值标签",
    tagStrength: 84,
    strengthLevel: "高",
    definition:
      "平台使用深度较高，具备较强付费意愿、留存价值和专业功能使用需求。",

    coreMetrics: [
      {
        name: "LTV预估",
        value: "¥820",
        desc: "用户生命周期内可能为平台贡献的综合价值。",
      },
      {
        name: "ARPU",
        value: "¥46/月",
        desc: "用户月均收入贡献水平。",
      },
      {
        name: "会员页点击次数",
        value: "5次/月",
        desc: "用户访问会员权益、付费服务页面的次数。",
      },
      {
        name: "专业工具使用次数",
        value: "13次/月",
        desc: "用户使用高级数据、智能选股、组合分析等工具的次数。",
      },
      {
        name: "30日留存率",
        value: "73%",
        desc: "用户未来30日继续活跃的概率。",
      },
    ],

    financialFeatures: {
      focusAssets: ["股票", "基金", "ETF", "数据终端服务"],
      investmentStyle: ["综合型", "工具驱动", "高频决策"],
      riskPreference: "中等风险",
      focusIndicators: [
        "LTV",
        "ARPU",
        "付费转化率",
        "留存率",
        "复购率",
        "功能使用深度",
        "研报下载量",
      ],
    },

    judgmentBasis:
      "近30日内，该用户多次访问会员页、使用专业工具并下载研报，平台活跃度和留存表现均高于平均水平，因此归类为高商业价值型。",
  },

  {
    id: "churn_risk",
    tagName: "流失风险标签",
    tagCategory: "商业价值标签",
    tagStrength: 69,
    strengthLevel: "中",
    definition:
      "近期活跃度、访问频次或核心功能使用深度明显下降，存在沉默或流失风险。",

    coreMetrics: [
      {
        name: "活跃天数下降幅度",
        value: "-42%",
        desc: "用户近30日活跃天数相比上一周期的下降幅度。",
      },
      {
        name: "回访间隔",
        value: "9天",
        desc: "用户最近两次访问之间的时间间隔。",
      },
      {
        name: "沉默天数",
        value: "12天",
        desc: "用户距离上一次访问平台的天数。",
      },
      {
        name: "核心功能使用下降",
        value: "-36%",
        desc: "用户使用自选股、研报、行情、工具等核心功能的下降幅度。",
      },
      {
        name: "内容互动下降",
        value: "-28%",
        desc: "用户收藏、分享、评论、下载等互动行为的下降幅度。",
      },
    ],

    financialFeatures: {
      focusAssets: ["历史关注资产不稳定"],
      investmentStyle: ["活跃度下降", "需求减弱"],
      riskPreference: "未知或变化中",
      focusIndicators: [
        "活跃天数",
        "访问频次",
        "回访间隔",
        "沉默天数",
        "功能使用深度",
        "留存率",
      ],
    },

    judgmentBasis:
      "近30日内，该用户访问频次、活跃天数和核心功能使用深度均出现明显下降，且回访间隔拉长，因此归类为流失风险型。",
  },
];

// 页面绘制组件：
function SankeyContentCard({ title, onClick, accent = false, layoutId }) {
  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      layout
      layoutId={layoutId}
      type={onClick ? "button" : undefined}
      onClick={onClick}
      transition={{
        layout: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.18 },
      }}
      className={`flex h-10 w-full items-center rounded-md border px-3 py-2 text-left shadow-sm transition-all duration-200 ${
        onClick ? "hover:-translate-y-0.5 hover:shadow-md" : ""
      } ${
        accent
          ? "border-lime-200 bg-lime-50/90 dark:border-lime-400/30 dark:bg-lime-400/10"
          : "border-gray-200 bg-white/95 dark:border-gray-700/70 dark:bg-gray-800/95"
      }`}
    >
      <div className="flex w-full items-center justify-between gap-3">
        <h4 className="min-w-0 truncate text-sm font-bold leading-5 text-gray-900 dark:text-gray-50">
          {title}
        </h4>
        <span className="shrink-0 text-sm font-bold leading-none text-gray-400 dark:text-gray-500">
          i
        </span>
      </div>
    </Component>
  );
}

function SankeyFlowLayer({ items, darkMode, flowAreaStyle, direction = "right", animateLines = false }) {
  const viewBoxHeight = 640;
  const sourceX = 16;
  const targetX = 304;
  const sourceNodeWidth = 18;
  const sourceNodeHeight = 14;
  const targetNodeWidth = 18;
  const targetNodeHeight = 56;
  const targetNodeY = 56;
  const sourceColor = darkMode ? "#f8fafc" : "#111827";
  const targetColor = darkMode ? "#a3e635" : "#8cc63f";
  const flowColor = darkMode ? "rgba(148, 163, 184, 0.32)" : "rgba(156, 163, 175, 0.28)";

  const getSourceY = (index) => {
    if (items.length <= 1) return targetNodeY + targetNodeHeight / 2;
    return 20 + (index * (viewBoxHeight - 40)) / (items.length - 1);
  };

  const getTargetY = (index) => {
    if (items.length <= 1) return targetNodeY + targetNodeHeight / 2;
    const offset = (index - (items.length - 1) / 2) * (targetNodeHeight / (items.length + 1)) * 0.62;
    return targetNodeY + targetNodeHeight / 2 + offset;
  };

  return (
    <div style={flowAreaStyle}>
      <svg
        viewBox={`0 0 320 ${viewBoxHeight}`}
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
        aria-hidden="true"
      >
        {items.map((item, index) => {
          const sourceY = getSourceY(index);
          const targetY = getTargetY(index);

          const path = direction === "left"
            ? `M ${targetX} ${targetY} C 192 ${targetY}, 126 ${sourceY}, ${sourceX + sourceNodeWidth} ${sourceY}`
            : `M ${sourceX + sourceNodeWidth} ${sourceY} C 126 ${sourceY}, 192 ${targetY}, ${targetX} ${targetY}`;

          return (
            <motion.path
              key={`flow-${item.id}`}
              d={path}
              fill="none"
              stroke={flowColor}
              strokeWidth="14"
              strokeLinecap="round"
              initial={animateLines ? { pathLength: 0, opacity: 0 } : false}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 0.48,
                delay: animateLines ? index * 0.035 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          );
        })}

        {items.map((item, index) => {
          const sourceY = getSourceY(index);

          return (
            <motion.rect
              key={`node-${item.id}`}
              x={sourceX}
              y={sourceY - sourceNodeHeight / 2}
              width={sourceNodeWidth}
              height={sourceNodeHeight}
              rx="4"
              fill={sourceColor}
              initial={animateLines ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.22, delay: animateLines ? index * 0.03 : 0 }}
            />
          );
        })}

        <motion.rect
          x={targetX}
          y={targetNodeY}
          width={targetNodeWidth}
          height={targetNodeHeight}
          rx="5"
          fill={targetColor}
          initial={animateLines ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  );
}

const tagBubbleColors = [
  "#3b82f6",
  "#ef4444",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
  "#f97316",
];

const tagBubbleLayout = [
  { x: 8, y: 12, size: 305, depth: 1.18 },
  { x: 48, y: 3, size: 175, depth: 0.84 },
  { x: 76, y: 18, size: 245, depth: 1 },
  { x: 24, y: 49, size: 135, depth: 0.7 },
  { x: 34, y: 25, size: 320, depth: 1.28 },
  { x: 66, y: 55, size: 205, depth: 0.9 },
  { x: 5, y: 67, size: 115, depth: 0.62 },
  { x: 38, y: 60, size: 270, depth: 1.06 },
  { x: 83, y: 72, size: 145, depth: 0.72 },
];

function TagCategoryBubbleMap({ tags }) {
  const bubbleStageRef = useRef(null);
  const pointerTargetRef = useRef({
    active: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const pointerFrameRef = useRef(null);
  const [pointer, setPointer] = useState({
    active: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === "dark";
  const [selectedTag, setSelectedTag] = useState(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateStageSize = () => {
      if (!bubbleStageRef.current) return;
      const rect = bubbleStageRef.current.getBoundingClientRect();
      setStageSize({ width: rect.width, height: rect.height });
    };

    updateStageSize();
    window.addEventListener("resize", updateStageSize);

    return () => {
      if (pointerFrameRef.current) {
        window.cancelAnimationFrame(pointerFrameRef.current);
      }
      window.removeEventListener("resize", updateStageSize);
    };
  }, []);

  function animatePointer() {
    setPointer((current) => {
      const target = pointerTargetRef.current;
      const deltaX = target.x - current.x;
      const deltaY = target.y - current.y;
      const distance = Math.hypot(deltaX, deltaY);
      const maxStep = 26;
      const stepRatio = distance > maxStep ? maxStep / distance : 1;
      const next = {
        active: target.active,
        width: target.width || current.width,
        height: target.height || current.height,
        x: current.x + deltaX * 0.18 * stepRatio,
        y: current.y + deltaY * 0.18 * stepRatio,
      };
      const stillMoving =
        Math.abs(next.x - target.x) > 0.2 ||
        Math.abs(next.y - target.y) > 0.2 ||
        current.active !== target.active;

      if (stillMoving) {
        pointerFrameRef.current = window.requestAnimationFrame(animatePointer);
      } else {
        pointerFrameRef.current = null;
      }

      return next;
    });
  }

  function startPointerAnimation() {
    if (!pointerFrameRef.current) {
      pointerFrameRef.current = window.requestAnimationFrame(animatePointer);
    }
  }

  function handlePointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerTargetRef.current = {
      active: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    };
    startPointerAnimation();
  }

  function handlePointerLeave() {
    pointerTargetRef.current = {
      ...pointerTargetRef.current,
      active: false,
    };
    startPointerAnimation();
  }

  function getBubbleOffset(bubble) {
    if (!pointer.active || pointer.width === 0 || pointer.height === 0) {
      return { x: 0, y: 0 };
    }

    const centerX = (pointer.width * bubble.x) / 100 + bubble.size / 2;
    const centerY = (pointer.height * bubble.y) / 100 + bubble.size / 2;
    const dx = pointer.x - centerX;
    const dy = pointer.y - centerY;
    const distance = Math.hypot(dx, dy);
    const influenceRadius = Math.max(470, bubble.size * 2.1);
    const influence = Math.max(0, 1 - distance / influenceRadius);
    const easedInfluence = 1 - Math.pow(1 - influence, 3);
    const strength = 0.132 * bubble.depth;
    const maxOffset = 28 * bubble.depth;
    const rawX = dx * easedInfluence * strength;
    const rawY = dy * easedInfluence * strength;
    const offsetDistance = Math.hypot(rawX, rawY);
    const offsetRatio = offsetDistance > maxOffset ? maxOffset / offsetDistance : 1;

    return {
      x: rawX * offsetRatio,
      y: rawY * offsetRatio,
    };
  }

  function getBubbleSize(index) {
    return tagBubbleLayout[index % tagBubbleLayout.length].size;
  }

  function getFocusTransform() {
    if (!selectedTag || stageSize.width === 0 || stageSize.height === 0) {
      return { x: 0, y: 0, scale: 1, opacity: 1, filter: "blur(0px)" };
    }

    const index = tags.findIndex((tag) => tag.id === selectedTag.id);
    const bubble = tagBubbleLayout[index % tagBubbleLayout.length];
    const size = getBubbleSize(index);
    const offset = getBubbleOffset({ ...bubble, size });
    const centerX = (stageSize.width * bubble.x) / 100 + size / 2 + offset.x;
    const centerY = (stageSize.height * bubble.y) / 100 + size / 2 + offset.y;
    const scale = 1.72;

    return {
      x: (stageSize.width / 2 - centerX) * 0.74,
      y: (stageSize.height / 2 - centerY) * 0.74,
      scale,
      opacity: 0.22,
      filter: "blur(12px)",
    };
  }

  const selectedTagIndex = selectedTag
    ? Math.max(0, tags.findIndex((tag) => tag.id === selectedTag.id))
    : 0;
  const selectedTagColor = tagBubbleColors[selectedTagIndex % tagBubbleColors.length];

  const categoryPagePattern = {
    backgroundImage: darkMode
      ? "radial-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px)"
      : "radial-gradient(rgba(148, 163, 184, 0.18) 1px, transparent 1px)",
    backgroundSize: "24px 24px",
  };

  return (
    <div
      className="relative min-h-[calc(100vh-146px)] w-full overflow-hidden bg-slate-50 px-8 py-7 dark:bg-gray-900"
      style={categoryPagePattern}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <p className="absolute left-8 top-5 z-10 text-xs text-gray-400 dark:text-gray-500">
        展示9种标签大类型，点击类型球查看更多信息。
      </p>

      <motion.div
        className="pointer-events-none absolute h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: darkMode
            ? "radial-gradient(circle, rgba(96, 165, 250, 0.16) 0%, rgba(96, 165, 250, 0.07) 34%, transparent 72%)"
            : "radial-gradient(circle, rgba(59, 130, 246, 0.16) 0%, rgba(59, 130, 246, 0.06) 34%, transparent 72%)",
          left: pointer.x,
          top: pointer.y,
        }}
        animate={{
          opacity: pointer.active ? 1 : 0,
        }}
        transition={{ duration: 0.24 }}
      />
      <motion.div
        ref={bubbleStageRef}
        className="relative mx-auto h-[calc(100vh-190px)] min-h-[640px] w-full max-w-[1520px]"
        animate={getFocusTransform()}
        transition={{ type: "spring", stiffness: 70, damping: 22, mass: 0.9 }}
      >
        {tags.map((tag, index) => {
          const bubble = tagBubbleLayout[index % tagBubbleLayout.length];
          const color = tagBubbleColors[index % tagBubbleColors.length];
          const size = getBubbleSize(index);
          const offset = getBubbleOffset({ ...bubble, size });

          return (
            <motion.div
              key={tag.id}
              className="absolute flex cursor-pointer items-center justify-center rounded-full text-center shadow-sm"
              onClick={() => setSelectedTag(tag)}
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: size,
                height: size,
                background: `
                  radial-gradient(circle at 70% 76%, rgba(0,0,0,0.22), transparent 42%),
                  linear-gradient(135deg, ${color}, ${color})
                `,
                opacity: 0.82,
                mixBlendMode: darkMode ? "screen" : "multiply",
                boxShadow: `
                  inset 0 0 26px rgba(255,255,255,0.16),
                  inset -20px -24px 36px rgba(15,23,42,0.22),
                  inset 0 0 42px ${color}66,
                  0 18px 48px ${color}38
                `,
              }}
              animate={{
                x: offset.x,
                y: offset.y,
              }}
              whileHover={{
                scale: 1.08,
                opacity: 0.92,
                boxShadow: `
                  inset 0 0 30px rgba(255,255,255,0.18),
                  inset -22px -26px 40px rgba(15,23,42,0.24),
                  inset 0 0 46px ${color}77,
                  0 0 52px ${color}99
                `,
                zIndex: 20,
              }}
              transition={{ type: "spring", stiffness: 58, damping: 22, mass: 1.1 }}
            >
              <div
                className="flex max-w-[70%] flex-col items-center justify-center text-center font-bold text-white drop-shadow-sm"
                style={{
                  fontSize: `${Math.max(12, Math.min(18, size / 15))}px`,
                  lineHeight: size < 150 ? 1.35 : 1.5,
                }}
              >
                <span>{tag.tagName}</span>
                <span
                  style={{
                    fontSize: `${Math.max(9, Math.min(12, size / 28))}px`,
                    lineHeight: 1.25,
                  }}
                >
                  标签强度：{tag.tagStrength}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {selectedTag && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center px-8 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
          >
            <motion.div
              className="relative h-[90%] w-[90%] rounded-xl border border-white/70 bg-white/88 p-7 shadow-[0_28px_80px_rgba(15,23,42,0.22)] backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/86"
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              <div
                className="mb-5 h-3 w-28 rounded-sm"
                style={{ backgroundColor: selectedTagColor }}
              />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                {selectedTag.tagName}
              </h3>
              <div className="mt-6 max-h-[calc(100%-88px)] overflow-y-auto pr-2">
                <table className="w-full table-fixed border-collapse overflow-hidden rounded-lg text-left text-sm">
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <th className="w-36 bg-gray-50 px-4 py-4 align-top font-semibold text-gray-600 dark:bg-gray-800/70 dark:text-gray-300">
                        标签强度
                      </th>
                      <td className="px-4 py-4 text-gray-800 dark:text-gray-100">
                        {selectedTag.tagStrength}
                      </td>
                    </tr>
                    <tr>
                      <th className="w-36 bg-gray-50 px-4 py-4 align-top font-semibold text-gray-600 dark:bg-gray-800/70 dark:text-gray-300">
                        定义
                      </th>
                      <td className="px-4 py-4 leading-7 text-gray-700 dark:text-gray-200">
                        {selectedTag.definition}
                      </td>
                    </tr>
                    <tr>
                      <th className="w-36 bg-gray-50 px-4 py-4 align-top font-semibold text-gray-600 dark:bg-gray-800/70 dark:text-gray-300">
                        核心指标
                      </th>
                      <td className="px-4 py-4">
                        <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                          <table className="w-full table-fixed border-collapse text-sm">
                            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-800/70 dark:text-gray-400">
                              <tr>
                                <th className="w-40 px-3 py-2 font-semibold">指标</th>
                                <th className="w-24 px-3 py-2 font-semibold">数值</th>
                                <th className="px-3 py-2 font-semibold">说明</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {selectedTag.coreMetrics.map((metric) => (
                                <tr key={metric.name}>
                                  <td className="px-3 py-2 font-medium text-gray-800 dark:text-gray-100">
                                    {metric.name}
                                  </td>
                                  <td className="px-3 py-2 text-gray-700 dark:text-gray-200">
                                    {metric.value}
                                  </td>
                                  <td className="px-3 py-2 leading-6 text-gray-600 dark:text-gray-300">
                                    {metric.desc}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th className="w-36 bg-gray-50 px-4 py-4 align-top font-semibold text-gray-600 dark:bg-gray-800/70 dark:text-gray-300">
                        金融特征
                      </th>
                      <td className="px-4 py-4 text-gray-700 dark:text-gray-200">
                        <div className="space-y-3">
                          <div>
                            <span className="mr-3 font-semibold text-gray-800 dark:text-gray-100">
                              关注资产
                            </span>
                            <span>{selectedTag.financialFeatures.focusAssets.join("、")}</span>
                          </div>
                          <div>
                            <span className="mr-3 font-semibold text-gray-800 dark:text-gray-100">
                              风险偏好
                            </span>
                            <span>{selectedTag.financialFeatures.riskPreference}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th className="w-36 bg-gray-50 px-4 py-4 align-top font-semibold text-gray-600 dark:bg-gray-800/70 dark:text-gray-300">
                        判断依据
                      </th>
                      <td className="px-4 py-4 leading-7 text-gray-700 dark:text-gray-200">
                        {selectedTag.judgmentBasis}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-xl leading-none text-gray-500 shadow-sm transition-colors duration-200 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                aria-label="关闭"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

//Drawing Sankey Diagram Component:
function TagSourceSankey({ groups }) {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [transitionPhase, setTransitionPhase] = useState("overview");
  const transitionTimersRef = useRef([]);
  const { currentTheme } = useThemeProvider();

  const isDetailView = Boolean(selectedGroup);
  const darkMode = currentTheme === "dark";
  const totalSourceCount = groups.reduce((total, group) => total + group.sources.length, 0);
  const flowAreaStyle = {
    height: "clamp(500px, calc(100vh - 260px), 620px)",
  };
  const pagePattern = {
    backgroundImage: darkMode
      ? "radial-gradient(rgba(148, 163, 184, 0.18) 1px, transparent 1px)"
      : "radial-gradient(rgba(148, 163, 184, 0.28) 1px, transparent 1px)",
    backgroundSize: "24px 24px",
  };

  useEffect(() => {
    return () => {
      transitionTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function clearTransitionTimers() {
    transitionTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    transitionTimersRef.current = [];
  }

  function queuePhase(phaseOrCallback, delay) {
    const timer = window.setTimeout(() => {
      if (typeof phaseOrCallback === "function") {
        phaseOrCallback();
        return;
      }

      setTransitionPhase(phaseOrCallback);
    }, delay);
    transitionTimersRef.current.push(timer);
  }

  function handleSelectGroup(group) {
    clearTransitionTimers();
    setSelectedGroup(group);
    setTransitionPhase("enterMove");
    queuePhase("enterLines", 320);
    queuePhase("detail", 820);
  }

  function handleReturnToOverview() {
    clearTransitionTimers();
    setTransitionPhase("exitMove");
    queuePhase("exitLines", 320);
    queuePhase(() => {
      setSelectedGroup(null);
      setTransitionPhase("overview");
    }, 820);
  }

  const overviewCards = groups.map((group) => ({
    id: group.id,
    title: group.label,
    onClick: () => handleSelectGroup(group),
  }));
  const detailCards = selectedGroup
    ? selectedGroup.sources.map((source) => ({
        id: `${selectedGroup.id}-${source}`,
        title: source,
      }))
    : [];
  const isReturning = transitionPhase === "exitMove" || transitionPhase === "exitLines";
  const isEntering = transitionPhase === "enterMove" || transitionPhase === "enterLines";
  const leftCards = selectedGroup && !isReturning ? detailCards : overviewCards;
  const flowCards = transitionPhase === "enterLines" || transitionPhase === "detail" ? detailCards : overviewCards;

  const rightCard = selectedGroup && transitionPhase !== "exitLines"
    ? {
        title: selectedGroup.label,
        onClick: handleReturnToOverview,
      }
    : {
        title: sankeyOutputLabel,
      };

  const showLeftCards = !isEntering || transitionPhase === "detail";
  const showSelectedCard = Boolean(selectedGroup) && transitionPhase !== "exitLines";
  const showOverviewOutput = !selectedGroup && transitionPhase === "overview";
  const flowDirection = transitionPhase === "enterLines" || transitionPhase === "detail" ? "left" : "right";
  const flowOpacity = transitionPhase === "enterMove" || transitionPhase === "exitMove" ? 0 : 1;
  const shouldAnimateFlow = transitionPhase === "enterLines" || transitionPhase === "exitLines";

return (
  <div
    className="relative min-h-[calc(100vh-101px)] w-full overflow-hidden bg-slate-50 px-5 py-5 dark:bg-gray-900"
    style={pagePattern}
  >
    {/* 详情页返回按钮 */}
    {isDetailView && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleReturnToOverview();
        }}
        className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-md bg-white text-gray-500 shadow-sm transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        title="返回总览"
      >
        &lt;
      </button>
    )}

    <LayoutGroup>
      <motion.div
        layout
        className="grid min-h-[620px] w-full gap-4 lg:h-[calc(100vh-141px)] lg:grid-cols-[minmax(260px,38%)_minmax(180px,24%)_minmax(260px,38%)]"
      >
        <section className="flex min-h-0 flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50">
              {isDetailView ? "来源信号" : "标签来源"}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {isDetailView
                ? `${selectedGroup.sources.length} 个输入因子`
                : `${groups.length} 个标签组 · ${totalSourceCount} 个信号`}
            </p>
          </div>
          <div className="flex flex-col justify-between" style={flowAreaStyle}>
            {showLeftCards && leftCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: selectedGroup && !isReturning ? -16 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.24,
                  delay: transitionPhase === "detail" ? index * 0.035 : 0,
                  ease: "easeOut",
                }}
              >
                <SankeyContentCard
                  title={card.title}
                  onClick={card.onClick}
                  layoutId={card.onClick ? `tag-card-${card.id}` : undefined}
                />
              </motion.div>
            ))}
          </div>
        </section>

        <div className="hidden min-h-0 flex-col lg:flex">
          <div className="mb-4 h-[44px]" />
          <motion.div
            animate={{ opacity: flowOpacity }}
            transition={{ duration: 0.18 }}
          >
            <SankeyFlowLayer
              key={`${flowDirection}-${transitionPhase === "detail" ? selectedGroup?.id : transitionPhase}`}
              items={flowCards}
              darkMode={darkMode}
              flowAreaStyle={flowAreaStyle}
              direction={flowDirection}
              animateLines={shouldAnimateFlow}
            />
          </motion.div>
        </div>

        <section className="flex min-h-0 flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50">
              {isDetailView ? "当前标签" : "本页输出"}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {isDetailView ? "详情视图" : "AI 标签结果"}
            </p>
          </div>
          <div className="pt-16" style={flowAreaStyle}>
            <AnimatePresence initial={false}>
              {showSelectedCard && (
                <SankeyContentCard
                  key={`selected-${selectedGroup.id}`}
                  title={rightCard.title}
                  onClick={rightCard.onClick}
                  accent={true}
                  layoutId={`tag-card-${selectedGroup.id}`}
                />
              )}

              {showOverviewOutput && (
                <motion.div
                  key="overview-output"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 18 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                >
                  <SankeyContentCard
                    title={rightCard.title}
                    accent={true}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </motion.div>
    </LayoutGroup>
  </div>
  );
}


// 上方选项框
export default function TagSystemTabs({ sidebarOpen, setSidebarOpen }) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [hoveredTab, setHoveredTab] = useState(null);

  const currentTab = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden">
      {/* Header */}
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        variant="v3"
      />

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
                    className={`relative flex h-9 items-center justify-center whitespace-nowrap text-sm font-semibold text-gray-500 transition-all duration-200 dark:text-gray-400 ${
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

            {/* 下方内容块 */}
            <div className="min-h-[calc(100vh-101px)] w-full bg-slate-50 dark:bg-gray-900">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="w-full"
                >
                  {activeTab === "source" && (
                    <div className="min-h-[calc(100vh-101px)] w-full">
                      <TagSourceSankey groups={tagSourceGroups} />
                    </div>
                  )}

                  {activeTab === "category" && (
                    <TagCategoryBubbleMap tags={tagTypeDatabase} />
                  )}

                  {activeTab !== "source" && activeTab !== "category" && (
                    <div className="min-h-[420px] w-full px-8 py-6">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        {currentTab.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                        {currentTab.subtitle}
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
