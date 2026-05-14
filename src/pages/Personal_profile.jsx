import React, { useEffect, useMemo, useState } from "react";

import RadarChart, { buildRadarDataset } from "../charts/RadarChart";
import Header from "../partials/Header";
import { calculateUserScores } from "../utils/calculateUserScores";

const profileCardClass = "bg-white hover:bg-blue-50/40 dark:bg-gray-900 dark:hover:bg-white/[0.04] shadow-xs hover:shadow-md dark:shadow-[0_12px_28px_rgba(0,0,0,0.26)] dark:hover:shadow-[0_16px_34px_rgba(0,0,0,0.34)] rounded-xl transition-all duration-300";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";
const RADAR_DIMENSION_COUNT = 6;
const TRADITIONAL_SCORE_WEIGHT = 0.6;
const AI_PREDICTION_SCORE_WEIGHT = 0.4;
const AI_SIGNAL_BASELINE = 0.5;
const AI_COMPLETION_BASELINE = 0.7;
const AI_HEAVY_USAGE_THRESHOLD = 0.75;
const DEFAULT_AI_COMPLETION_RATE = 0.6;
const AI_PREDICTION_FACTORS = {
  conversionIntent: 16,
  conversionActivity: 8,
  conversionFeedback: 1.2,
  assetWatchlist: 8,
  assetReport: 6,
  assetRiskMismatchPenalty: 10,
  assetRiskMatchBonus: 2,
  contentEngagement: 14,
  contentShare: 2,
  contentAiHeavyPenalty: 4,
  retentionActivity: 12,
  retentionRiskPenalty: 0.18,
  digitalAiAdoption: 18,
  digitalCompletion: 14,
  digitalFeedback: 1.4,
  complianceRiskPenalty: 0.55,
  complianceMismatchPenalty: 6,
  complianceMatchBonus: 3,
};
const RISK_PENALTY_FACTORS = {
  complaint: 7,
  abnormalLogin: 5,
  sensitiveOperation: 4,
  manualReview: 12,
  riskMismatch: 6,
};
const ACTIVE_PEER_PERCENT_BY_USER_ID = {
  U1001: 82,
  U1002: 18,
  U1003: 91,
  U1004: 76,
  U1005: 84,
  U1006: 42,
  U1007: 57,
};

function normalizeText(value) {
  return value.trim().toLocaleLowerCase("zh-CN");
}

function getSimilarityRank(name, query) {
  const normalizedName = normalizeText(name);
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return 0;
  if (normalizedName === normalizedQuery) return 0;
  if (normalizedName.startsWith(normalizedQuery)) return 1;
  if (normalizedName.includes(normalizedQuery)) return 2;
  return 3;
}

function getRadarValuesFromProfile(profile) {
  const calculatedScores = calculateUserScores(profile);

  return [
    calculatedScores.conversion_value,
    calculatedScores.asset_risk_value,
    calculatedScores.content_value,
    calculatedScores.retention_value,
    calculatedScores.digital_service_value,
    calculatedScores.compliance_trust_value,
  ];
}

function getBlendedRadarValues(profile) {
  const traditionalValues = getRadarValuesFromProfile(profile);
  const predictionValues = getAiPredictionValues(profile);

  return traditionalValues.map((value, index) => (
    clampScore(
      value * TRADITIONAL_SCORE_WEIGHT +
      predictionValues[index] * AI_PREDICTION_SCORE_WEIGHT
    )
  ));
}

function getAverageRadarValues(profiles) {
  if (!profiles.length) return null;

  const totals = profiles.reduce((nextTotals, profile) => {
    const values = getBlendedRadarValues(profile);
    return nextTotals.map((total, index) => total + values[index]);
  }, Array(RADAR_DIMENSION_COUNT).fill(0));

  return totals.map((total) => Math.round(total / profiles.length));
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function safeNumber(value, defaultValue = 0) {
  return typeof value === "number" && !Number.isNaN(value) ? value : defaultValue;
}

function getAiPredictionValues(profile) {
  const scores = calculateUserScores(profile);
  const behavior = profile.behavior || {};
  const assetRisk = profile.assetRisk || {};
  const risk = profile.risk || {};
  const aiUsage = profile.aiUsage || {};

  const activitySignal = Math.min(safeNumber(behavior.active_days_30d) / 20, 1);
  const intentSignal = Math.min(safeNumber(behavior.click_product_detail_30d) / 10, 1);
  const contentSignal = Math.min(safeNumber(behavior.content_favorite_count_30d) / 15, 1);
  const aiAdoptionSignal = Math.min(safeNumber(behavior.ai_chat_count_30d) / 15, 1);
  const reportSignal = Math.min(safeNumber(behavior.report_downloads_30d) / 8, 1);
  const watchlistSignal = Math.min(safeNumber(behavior.watchlist_count) / 20, 1);
  const aiCompletionSignal = safeNumber(aiUsage.ai_completion_rate, DEFAULT_AI_COMPLETION_RATE);
  const feedbackDelta = (
    safeNumber(aiUsage.ai_positive_feedback_count) -
    safeNumber(aiUsage.ai_negative_feedback_count)
  );
  const riskPenalty =
    safeNumber(risk.complaint_count_30d) * RISK_PENALTY_FACTORS.complaint +
    safeNumber(risk.abnormal_login_count_30d) * RISK_PENALTY_FACTORS.abnormalLogin +
    safeNumber(risk.sensitive_operation_count_30d) * RISK_PENALTY_FACTORS.sensitiveOperation +
    (risk.manual_review_flag ? RISK_PENALTY_FACTORS.manualReview : 0) +
    (assetRisk.risk_mismatch === 1 ? RISK_PENALTY_FACTORS.riskMismatch : 0);

  return [
    clampScore(
      scores.conversion_value +
      (intentSignal - AI_SIGNAL_BASELINE) * AI_PREDICTION_FACTORS.conversionIntent +
      (activitySignal - AI_SIGNAL_BASELINE) * AI_PREDICTION_FACTORS.conversionActivity +
      feedbackDelta * AI_PREDICTION_FACTORS.conversionFeedback
    ),
    clampScore(
      scores.asset_risk_value +
      (watchlistSignal - AI_SIGNAL_BASELINE) * AI_PREDICTION_FACTORS.assetWatchlist +
      (reportSignal - AI_SIGNAL_BASELINE) * AI_PREDICTION_FACTORS.assetReport -
      (assetRisk.risk_mismatch === 1
        ? AI_PREDICTION_FACTORS.assetRiskMismatchPenalty
        : -AI_PREDICTION_FACTORS.assetRiskMatchBonus)
    ),
    clampScore(
      scores.content_value +
      (contentSignal - AI_SIGNAL_BASELINE) * AI_PREDICTION_FACTORS.contentEngagement +
      (safeNumber(behavior.share_count_30d) - 2) * AI_PREDICTION_FACTORS.contentShare -
      (aiAdoptionSignal > AI_HEAVY_USAGE_THRESHOLD ? AI_PREDICTION_FACTORS.contentAiHeavyPenalty : 0)
    ),
    clampScore(
      scores.retention_value +
      (activitySignal - AI_SIGNAL_BASELINE) * AI_PREDICTION_FACTORS.retentionActivity -
      riskPenalty * AI_PREDICTION_FACTORS.retentionRiskPenalty
    ),
    clampScore(
      scores.digital_service_value +
      (aiAdoptionSignal - AI_SIGNAL_BASELINE) * AI_PREDICTION_FACTORS.digitalAiAdoption +
      (aiCompletionSignal - AI_COMPLETION_BASELINE) * AI_PREDICTION_FACTORS.digitalCompletion +
      feedbackDelta * AI_PREDICTION_FACTORS.digitalFeedback
    ),
    clampScore(
      scores.compliance_trust_value -
      riskPenalty * AI_PREDICTION_FACTORS.complianceRiskPenalty +
      (assetRisk.risk_mismatch === 1
        ? -AI_PREDICTION_FACTORS.complianceMismatchPenalty
        : AI_PREDICTION_FACTORS.complianceMatchBonus)
    ),
  ];
}

function formatVisitDate(dateStr) {
  if (!dateStr) return "--";
  const [, month, day] = dateStr.split("-");
  return month && day ? `${month}-${day}` : dateStr;
}

function formatPercent(value) {
  return `${Math.round(safeNumber(value) * 100)}%`;
}

function formatPreferredAssets(value) {
  if (!value) return "--";
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .join("/");
}

function formatContentPreference(assetRisk, behavior) {
  const assets = formatPreferredAssets(assetRisk.preferred_assets);
  const tags = assets === "--" ? [] : assets.split("/");

  if (safeNumber(behavior.search_count_30d) > 0 || safeNumber(behavior.page_views_30d) > 0) {
    tags.push("热点资讯");
  }

  if (safeNumber(behavior.ai_chat_count_30d) > 0) {
    tags.push("AI解读");
  }

  return tags.length ? [...new Set(tags)].join(" | ") : "--";
}

function formatManualReview(value) {
  return value ? "是" : "否";
}

function formatValueLevel(value) {
  return value ? `${value}级` : "--";
}

function formatProfileValue(value, suffix = "") {
  if (value === null || value === undefined || value === "") return "--";
  return `${value}${suffix}`;
}

function getValueLevelFromScore(score) {
  if (score >= 85) return "S";
  if (score >= 75) return "A";
  if (score >= 60) return "B";
  if (score >= 45) return "C";
  return "D";
}

function getHistoricalValueChange(profile) {
  const scores = profile.scores || calculateUserScores(profile);
  const behavior = profile.behavior || {};
  const risk = profile.risk || {};
  const assetRisk = profile.assetRisk || {};
  const currentScore = safeNumber(scores.total_value_score);
  const activeDays = safeNumber(behavior.active_days_30d);
  const activeMomentum = activeDays >= 15 ? 9 : activeDays >= 8 ? 5 : activeDays <= 4 ? -7 : 1;
  const riskDrag = Math.min(
    safeNumber(risk.complaint_count_30d) * 4 +
    safeNumber(risk.abnormal_login_count_30d) * 2 +
    safeNumber(risk.sensitive_operation_count_30d) * 3 +
    (risk.manual_review_flag ? 5 : 0) +
    (assetRisk.risk_mismatch === 1 ? 4 : 0),
    10
  );
  const previousScore = clampScore(currentScore - activeMomentum + riskDrag);

  return {
    previousLevel: getValueLevelFromScore(previousScore),
    currentLevel: scores.value_level || getValueLevelFromScore(currentScore),
  };
}

function getActivePeerPercent(profile) {
  if (ACTIVE_PEER_PERCENT_BY_USER_ID[profile.id] !== undefined) {
    return ACTIVE_PEER_PERCENT_BY_USER_ID[profile.id];
  }

  const activeDays = safeNumber(profile.behavior?.active_days_30d);
  return Math.max(12, Math.min(95, Math.round((activeDays / 20) * 100)));
}

function RadarProfileInfo({ profile }) {
  const valueLevel = profile.scores?.value_level || calculateUserScores(profile).value_level;
  const valueChange = getHistoricalValueChange(profile);
  const activePeerPercent = getActivePeerPercent(profile);
  const profileItems = [
    { label: "年龄", value: formatProfileValue(profile.age, "岁") },
    { label: "性别", value: formatProfileValue(profile.gender) },
    { label: "职业", value: formatProfileValue(profile.occupation) },
  ];

  return (
    <aside className="radar-reveal w-full rounded-lg border border-blue-100/80 bg-blue-50/45 px-4 py-4 dark:border-gray-700/70 dark:bg-gray-800/60 lg:max-w-[190px] xl:max-w-[200px]">
      <div className="mb-4 border-b border-blue-200/70 pb-3 dark:border-gray-700">
        <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          价值等级
        </div>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-3xl font-bold leading-none text-[#7c3aed] dark:text-violet-300">
            {formatValueLevel(valueLevel)}
          </span>
          <span className="h-px flex-1 bg-[#a855f7]/70 dark:bg-violet-300/60" />
        </div>
      </div>
      <dl className="space-y-3 text-xs font-semibold text-gray-600 dark:text-gray-300">
        {profileItems.map((item, index) => (
          <div key={item.label} className="grid grid-cols-[3rem_1fr] items-start gap-3">
            <dt className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  index === 1 ? "bg-[#2f6fdb]" : index === 2 ? "bg-[#7c3aed]" : "bg-[#a855f7]"
                }`}
              />
              {item.label}
            </dt>
            <dd className="min-w-0 break-words text-right text-gray-800 dark:text-gray-100">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 space-y-3 border-t border-blue-200/70 pt-4 text-xs font-semibold dark:border-gray-700">
        <section>
          <div className="mb-1 text-[11px] font-bold text-gray-500 dark:text-gray-400">
            历史变化
          </div>
          <div className="text-right text-xl font-bold leading-none text-[#7c3aed] dark:text-violet-300">
            {valueChange.previousLevel}→{valueChange.currentLevel}
          </div>
        </section>
        <section>
          <div className="mb-1 text-[11px] font-bold text-gray-500 dark:text-gray-400">
            人群对比
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            活跃指数高于同等级用户
          </div>
          <div className="mt-1 text-right text-xl font-bold leading-none text-[#2f6fdb] dark:text-blue-300">
            {activePeerPercent}%
          </div>
        </section>
      </div>
    </aside>
  );
}

function parseArrayValue(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];

  try {
    const parsedValue = JSON.parse(value);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function getFallbackKeyLabels(reason, index) {
  const text = String(reason);

  if (text.includes("AI")) return ["AI信号", "数字服务"];
  if (text.includes("风险") || text.includes("合规")) return ["风险信号", "适当性"];
  if (text.includes("活跃") || text.includes("访问") || text.includes("登录")) return ["活跃度", "访问频率"];
  if (text.includes("资产") || text.includes("基金") || text.includes("产品")) return ["配置意图", "资产偏好"];
  if (text.includes("内容") || text.includes("收藏") || text.includes("阅读")) return ["内容偏好", "互动行为"];

  return index === 1 ? ["用户信号", "行为洞察"] : ["运营触点", "价值线索"];
}

function getReasonJudgement(reason) {
  const text = String(reason);

  if (text.includes("投诉") || text.includes("敏感") || text.includes("异常") || text.includes("合规")) {
    return "合规信任压力上升";
  }
  if (text.includes("风险") || text.includes("问卷") || text.includes("行为")) {
    return "风险认知与实际行为需校验";
  }
  if (text.includes("产品") || text.includes("基金") || text.includes("配置") || text.includes("研报")) {
    return "兴趣明确但决策仍在推进";
  }
  if (text.includes("AI")) {
    return "数字服务接受度提升";
  }
  if (text.includes("活跃") || text.includes("访问") || text.includes("登录")) {
    return "活跃状态影响留存判断";
  }
  if (text.includes("收藏") || text.includes("分享") || text.includes("评论") || text.includes("内容")) {
    return "内容偏好明确且互动意愿增强";
  }

  return "行为信号可用于运营分层";
}

function KeyReasonWall({ profile }) {
  const reasons = parseArrayValue(profile.aiAnalysis?.key_reasons);
  const labels = parseArrayValue(profile.aiAnalysis?.key_labels);
  const cards = reasons.slice(0, 3).map((reason, index) => {
    const reasonLabels = Array.isArray(labels[index])
      ? labels[index].filter(Boolean).slice(0, 2)
      : [];

    return {
      reason,
      judgement: getReasonJudgement(reason),
      labels: reasonLabels.length ? reasonLabels : getFallbackKeyLabels(reason, index),
      tone: index === 1 ? "blue" : "green",
    };
  });

  if (!cards.length) return null;

  return (
    <div className="flex h-full min-h-[232px] flex-col px-5 py-4">
      <h2 className="mb-4 text-base font-bold text-gray-800 dark:text-gray-100">
        AI决策解释
      </h2>
      <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-3">
        {cards.map((card, index) => {
          const isBlue = card.tone === "blue";
          const cardClass = isBlue
            ? "border-blue-200 bg-blue-50/70 dark:border-blue-500/30 dark:bg-blue-500/10"
            : "border-emerald-200 bg-emerald-50/75 dark:border-emerald-500/30 dark:bg-emerald-500/10";
          const tagClass = isBlue
            ? "bg-white text-[#2f6fdb] dark:bg-blue-500/20 dark:text-blue-200"
            : "bg-white text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200";

          return (
            <article
              key={`${card.reason}-${index}`}
              className={`flex min-h-[136px] flex-col rounded-xl border px-4 py-4 shadow-[0_8px_18px_rgba(15,23,42,0.04)] ${cardClass}`}
            >
              <div className="flex min-h-[108px] flex-1 flex-col justify-between text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                <div>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">输入信号：</span>
                  <span>{card.reason}</span>
                </div>
                <div className="pl-5 text-violet-500 dark:text-violet-300">↓</div>
                <div>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">AI判断：</span>
                  <span>{card.judgement}</span>
                </div>
                <div className="pl-5 text-violet-500 dark:text-violet-300">↓</div>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-100">标签结果：</div>
                  <div className="mt-1 flex flex-wrap justify-end gap-2">
                    {card.labels.map((label) => (
                      <span
                        key={label}
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold leading-none ${tagClass}`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function BasicDataSection({ title, children }) {
  return (
    <div className="min-w-0">
      <div className="mb-0.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
        [{title}]
      </div>
      <div className="text-[13px] font-semibold leading-5 text-gray-800 dark:text-gray-100">
        {children}
      </div>
    </div>
  );
}

function BasicDataLayerCard({ profile }) {
  const behavior = profile.behavior || {};
  const assetRisk = profile.assetRisk || {};
  const risk = profile.risk || {};
  const aiUsage = profile.aiUsage || {};
  const positiveFeedback = safeNumber(aiUsage.ai_positive_feedback_count);
  const negativeFeedback = safeNumber(aiUsage.ai_negative_feedback_count);
  const overviewSections = [
    {
      title: "活跃概况",
      content: `30天活跃 ${safeNumber(behavior.active_days_30d)}天 | 登录 ${safeNumber(behavior.login_count_30d)}次 | 最近访问 ${formatVisitDate(behavior.last_visit_date)}`,
    },
    {
      title: "内容行为",
      content: `浏览 ${safeNumber(behavior.page_views_30d)} | 搜索 ${safeNumber(behavior.search_count_30d)} | 下载 ${safeNumber(behavior.report_downloads_30d)} | 收藏 ${safeNumber(behavior.content_favorite_count_30d)}`,
    },
    {
      title: "内容偏好",
      content: formatContentPreference(assetRisk, behavior),
    },
    {
      title: "AI互动",
      content: `问答 ${safeNumber(behavior.ai_chat_count_30d)} | 完成率 ${formatPercent(aiUsage.ai_completion_rate)} | 正反馈 ${positiveFeedback}/${positiveFeedback + negativeFeedback}`,
    },
    {
      title: "资产与风险",
      content: `偏好 ${formatPreferredAssets(assetRisk.preferred_assets)} | 问卷 ${assetRisk.questionnaire_risk_level || "--"} | 行为 ${assetRisk.behavior_risk_level || "--"}`,
    },
    {
      title: "合规信号",
      content: `投诉 ${safeNumber(risk.complaint_count_30d)} | 异常登录 ${safeNumber(risk.abnormal_login_count_30d)} | 敏感操作 ${safeNumber(risk.sensitive_operation_count_30d)} | 人工复核 ${formatManualReview(risk.manual_review_flag)}`,
    },
  ];

  return (
    <div className="flex h-full min-h-[420px] flex-col px-5 py-4">
      <h2 className="mb-3 text-base font-bold text-gray-800 dark:text-gray-100">
        用户数据概览
      </h2>
      <div className="mt-2 space-y-3.5 pl-3">
        {overviewSections.map((section) => (
          <BasicDataSection key={section.title} title={section.title}>
            {section.content}
          </BasicDataSection>
        ))}
      </div>
    </div>
  );
}

function buildActionSuggestion(profile) {
  const behavior = profile.behavior || {};
  const assetRisk = profile.assetRisk || {};
  const risk = profile.risk || {};
  const aiUsage = profile.aiUsage || {};
  const scores = profile.scores || calculateUserScores(profile);
  const complaintCount = safeNumber(risk.complaint_count_30d);
  const abnormalLoginCount = safeNumber(risk.abnormal_login_count_30d);
  const sensitiveOperationCount = safeNumber(risk.sensitive_operation_count_30d);
  const activeDays = safeNumber(behavior.active_days_30d);
  const productClicks = safeNumber(behavior.click_product_detail_30d);
  const aiChats = safeNumber(behavior.ai_chat_count_30d);
  const hasRiskAlert = (
    complaintCount > 0 ||
    abnormalLoginCount > 0 ||
    sensitiveOperationCount > 0 ||
    risk.manual_review_flag ||
    assetRisk.risk_mismatch === 1
  );
  const priority = hasRiskAlert || safeNumber(scores.total_value_score) >= 75 ? "高" : activeDays <= 5 ? "中" : "常规";
  const target = hasRiskAlert ? "人工顾问 / 运营" : aiChats >= 8 ? "AI运营 / 投顾" : "内容运营 / 投顾";
  const touch = hasRiskAlert
    ? "App弹窗 + 顾问电话"
    : activeDays <= 5
      ? "App Push + 短内容召回"
      : "站内推荐 + AI问答卡片";
  const triggerParts = [];

  if (complaintCount > 0) triggerParts.push(`投诉${complaintCount}次`);
  if (abnormalLoginCount > 0) triggerParts.push(`异常登录${abnormalLoginCount}次`);
  if (sensitiveOperationCount > 0) triggerParts.push(`敏感操作${sensitiveOperationCount}次`);
  if (assetRisk.risk_mismatch === 1) triggerParts.push("问卷与行为风险不一致");
  if (productClicks > 0) triggerParts.push(`产品点击${productClicks}次`);
  if (aiChats > 0) triggerParts.push(`AI问答${aiChats}次`);
  if (!triggerParts.length) triggerParts.push(`30天活跃${activeDays}天`);

  const content = hasRiskAlert
    ? "先解释近期风险信号，再进行风险适当性复核"
    : activeDays <= 5
      ? "推送轻量资讯与权益提醒，降低回访门槛"
      : profile.aiAnalysis?.operation_suggestion || "推送匹配内容与资产配置建议";
  const goal = hasRiskAlert
    ? "降低投诉风险，提升留存概率"
    : activeDays <= 5
      ? "提升回访率，减少流失风险"
      : "提升转化效率，增强持续运营价值";

  return [
    ["建议动作", ""],
    ["优先级", priority],
    ["执行对象", target],
    ["触达方式", touch],
    ["触发原因", triggerParts.slice(0, 4).join(" + ")],
    ["建议内容", content],
    ["目标", goal],
  ];
}

function AiAnalysisCard({ profile }) {
  const aiAnalysis = profile.aiAnalysis || {};
  const actionSuggestion = buildActionSuggestion(profile);

  return (
    <div className="flex h-full min-h-[232px] flex-col px-5 py-4">
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
          AI分析与结论
        </h2>
        <span className="shrink-0 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700 dark:bg-violet-500/20 dark:text-violet-200">
          置信度 {formatPercent(aiAnalysis.ai_confidence)}
        </span>
      </div>
      <div className="space-y-2.5 pl-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
        <section>
          <span className="text-[13px] font-semibold text-gray-800 dark:text-gray-100">结论：</span>
          <span className="text-[13px] text-gray-600 dark:text-gray-300">{aiAnalysis.main_conclusion || "--"}</span>
        </section>
        <div className="h-px bg-gray-200 dark:bg-gray-700" />
        <section>
          <div className="space-y-0.5 text-[13px] leading-5">
            {actionSuggestion.map(([label, value]) => (
              <div key={label}>
                {value ? (
                  <>
                    <span className="text-[13px] text-gray-800 dark:text-gray-100">{label}：</span>
                    <span className="text-[13px] text-gray-600 dark:text-gray-300">{value}</span>
                  </>
                ) : (
                  <span className="text-[13px] font-semibold text-gray-800 dark:text-gray-100">{label}：</span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Personal_profile({ sidebarOpen, setSidebarOpen }) {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [averageRadarValues, setAverageRadarValues] = useState(null);
  const [visibleUserName, setVisibleUserName] = useState("");
  const [visibleUserType, setVisibleUserType] = useState("");
  const [hiddenRadarLines, setHiddenRadarLines] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function loadUsers() {
      const response = await fetch(`${API_BASE}/api/users`);
      const nextUsers = await response.json();
      if (ignore) return;

      setUsers(nextUsers);

      const profiles = await Promise.all(
        nextUsers.map(async (user) => {
          const profileResponse = await fetch(`${API_BASE}/api/users/${user.id}/profile`);
          return profileResponse.json();
        })
      );

      if (!ignore) {
        setAverageRadarValues(getAverageRadarValues(profiles));
      }
    }

    loadUsers().catch(() => {
      if (!ignore) {
        setUsers([]);
        setAverageRadarValues(null);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      setSelectedProfile(null);
      return;
    }

    let ignore = false;

    async function loadProfile() {
      const response = await fetch(`${API_BASE}/api/users/${selectedUser.id}/profile`);
      const profile = await response.json();
      if (!ignore) {
        setSelectedProfile(profile);
      }
    }

    loadProfile().catch(() => {
      if (!ignore) {
        setSelectedProfile(null);
      }
    });

    return () => {
      ignore = true;
    };
  }, [selectedUser]);

  const searchSuggestions = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery);
    if (!normalizedQuery) return [];

    return users
      .filter((user) => {
        return normalizeText(user.name).includes(normalizedQuery);
      })
      .sort((first, second) => {
        const rankDelta = getSimilarityRank(first.name, searchQuery) - getSimilarityRank(second.name, searchQuery);
        if (rankDelta !== 0) return rankDelta;
        return first.name.localeCompare(second.name, "zh-CN");
      })
      .slice(0, 6);
  }, [searchQuery, users]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);

  };

  const handleSuggestionSelect = (user) => {
    setSelectedUser(user);
    setSearchQuery(user.name);
    setVisibleUserName(user.name);
    setVisibleUserType(user.user_type);
  };

  const radarData = useMemo(() => {
    if (!selectedProfile) return null;

    const nextRadarData = buildRadarDataset({
      currentUserValues: getBlendedRadarValues(selectedProfile),
      averageUserValues: averageRadarValues || undefined,
      predictionUserValues: getAiPredictionValues(selectedProfile),
    });

    return {
      ...nextRadarData,
      datasets: nextRadarData.datasets.map((dataset) => ({
        ...dataset,
        hidden: hiddenRadarLines.includes(dataset.label),
      })),
    };
  }, [averageRadarValues, hiddenRadarLines, selectedProfile]);

  const toggleRadarLine = (label) => {
    setHiddenRadarLines((currentLines) => (
      currentLines.includes(label)
        ? currentLines.filter((line) => line !== label)
        : [...currentLines, label]
    ));
  };

  return (
    <>
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        searchPlaceholder="查询用户名/编号"
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        searchSuggestions={searchSuggestions}
        onSearchSuggestionSelect={handleSuggestionSelect}
        currentUserName={visibleUserName}
        currentUserType={visibleUserType}
      />

      <main className="grow bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <div className="grid grid-cols-12 gap-6">
            <section className={`${profileCardClass} col-span-full min-h-[420px] xl:col-span-8`}>
              {radarData && (
                <div className="flex h-full min-h-[420px] flex-col items-start px-5 py-4">
                  <div className="flex min-h-0 w-full grow flex-col gap-4 lg:flex-row lg:items-stretch">
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="mb-2 flex w-full max-w-[620px] flex-wrap items-center justify-start gap-x-10 gap-y-2">
                        <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
                          综合价值雷达模型
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                          <button
                            type="button"
                            className={`flex items-center gap-2 transition-opacity duration-200 ${hiddenRadarLines.includes("当前用户") ? "opacity-40" : "opacity-100"}`}
                            onClick={() => toggleRadarLine("当前用户")}
                          >
                            <span>当前用户</span>
                            <span className="h-px w-7 bg-[#a855f7]" />
                          </button>
                          <button
                            type="button"
                            className={`flex items-center gap-2 transition-opacity duration-200 ${hiddenRadarLines.includes("总体平均") ? "opacity-40" : "opacity-100"}`}
                            onClick={() => toggleRadarLine("总体平均")}
                          >
                            <span>总体平均</span>
                            <span className="h-px w-7 bg-[#2f6fdb]" />
                          </button>
                          <button
                            type="button"
                            className={`flex items-center gap-2 transition-opacity duration-200 ${hiddenRadarLines.includes("AI预测") ? "opacity-40" : "opacity-100"}`}
                            onClick={() => toggleRadarLine("AI预测")}
                          >
                            <span>AI预测</span>
                            <span className="h-px w-7 border-t border-dashed border-[#7c3aed]" />
                          </button>
                        </div>
                      </div>
                      <div className="flex min-h-0 flex-1 items-center justify-center pt-2 lg:items-center lg:justify-start lg:pt-3">
                        <div key={selectedUser?.id} className="radar-reveal h-[290px] w-full max-w-[644px] origin-center">
                          <RadarChart data={radarData} />
                        </div>
                      </div>
                    </div>
                    {selectedProfile && <RadarProfileInfo profile={selectedProfile} />}
                  </div>
                </div>
              )}
            </section>
            <section className={`${profileCardClass} col-span-full min-h-[420px] xl:col-span-4`}>
              {selectedProfile && <BasicDataLayerCard profile={selectedProfile} />}
            </section>
            <section className={`${profileCardClass} col-span-full min-h-[232px] xl:col-span-8`}>
              {selectedProfile && <KeyReasonWall profile={selectedProfile} />}
            </section>
            <section className={`${profileCardClass} col-span-full min-h-[232px] xl:col-span-4`}>
              {selectedProfile && <AiAnalysisCard profile={selectedProfile} />}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default Personal_profile;
