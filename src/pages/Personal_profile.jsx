import React, { useEffect, useMemo, useState } from "react";

import RadarChart, { buildRadarDataset } from "../charts/RadarChart";
import Header from "../partials/Header";
import { calculateUserScores } from "../utils/calculateUserScores";

const profileCardClass = "bg-white hover:bg-blue-50/40 dark:bg-gray-900 dark:hover:bg-white/[0.04] shadow-xs hover:shadow-md dark:shadow-[0_12px_28px_rgba(0,0,0,0.26)] dark:hover:shadow-[0_16px_34px_rgba(0,0,0,0.34)] rounded-xl transition-all duration-300 hover:-translate-y-0.5";
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

function formatManualReview(value) {
  return value ? "是" : "否";
}

function BasicDataSection({ title, children }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-bold text-gray-500 dark:text-gray-400">
        [{title}]
      </div>
      <div className="text-xs font-semibold leading-5 text-gray-800 dark:text-gray-100">
        {children}
      </div>
    </div>
  );
}

function BasicDataChart({ profile }) {
  const behavior = profile.behavior || {};
  const risk = profile.risk || {};
  const aiUsage = profile.aiUsage || {};
  const chartRows = [
    { label: "活跃", value: safeNumber(behavior.active_days_30d), max: 20 },
    { label: "登录", value: safeNumber(behavior.login_count_30d), max: 30 },
    { label: "浏览", value: safeNumber(behavior.page_views_30d), max: 220 },
    { label: "搜索", value: safeNumber(behavior.search_count_30d), max: 40 },
    { label: "收藏", value: safeNumber(behavior.content_favorite_count_30d), max: 15 },
    { label: "AI", value: safeNumber(behavior.ai_chat_count_30d), max: 15 },
    { label: "完成", value: safeNumber(aiUsage.ai_completion_rate), max: 1 },
    {
      label: "风险",
      value:
        safeNumber(risk.complaint_count_30d) +
        safeNumber(risk.abnormal_login_count_30d) +
        safeNumber(risk.sensitive_operation_count_30d) +
        (risk.manual_review_flag ? 1 : 0),
      max: 6,
    },
  ];

  return (
    <div className="hidden min-w-[148px] rounded-lg bg-slate-50 px-3 py-3 dark:bg-gray-800/70 2xl:block">
      <div className="mb-2 flex items-center justify-between border-b border-gray-300 pb-1 text-[11px] font-bold text-gray-500 dark:border-gray-600 dark:text-gray-400">
        <span>指标表图</span>
        <span className="text-gray-400">i</span>
      </div>
      <div className="relative space-y-1.5">
        <div className="absolute left-[calc(42%+31px)] top-0 h-full w-px bg-gray-600/70 dark:bg-gray-400/60" />
        {chartRows.map((row) => {
          const width = Math.max(18, Math.min(100, (row.value / row.max) * 100));
          const displayValue = row.max === 1 ? `${Math.round(row.value * 100)}` : row.value;

          return (
            <div key={row.label} className="grid grid-cols-[42%_1fr] items-center gap-2 text-[10px]">
              <span className="truncate font-semibold text-gray-500 dark:text-gray-400">{row.label}</span>
              <div className="relative h-4 overflow-hidden rounded-sm bg-gray-200 dark:bg-gray-700">
                <div
                  className="absolute inset-y-0 left-1/2 rounded-sm bg-blue-200 dark:bg-blue-500/30"
                  style={{ width: `${width / 2}%` }}
                />
                <div
                  className="absolute inset-y-0 right-1/2 rounded-sm bg-blue-200 dark:bg-blue-500/30"
                  style={{ width: `${width / 2}%` }}
                />
                <div className="absolute left-1/2 top-0 h-full w-px bg-blue-700/60 dark:bg-blue-200/70" />
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-blue-900 dark:text-blue-100">
                  {displayValue}
                </span>
              </div>
            </div>
          );
        })}
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

  return (
    <div className="flex h-full min-h-[360px] gap-4 px-5 py-4">
      <div className="min-w-0 flex-1">
        <h2 className="mb-4 text-base font-bold text-gray-800 dark:text-gray-100">
          基础数据层
        </h2>
        <div className="space-y-3">
          <BasicDataSection title="活跃行为">
            30天活跃 {safeNumber(behavior.active_days_30d)}天｜登录 {safeNumber(behavior.login_count_30d)}次｜最近访问 {formatVisitDate(behavior.last_visit_date)}
          </BasicDataSection>
          <BasicDataSection title="内容行为">
            浏览 {safeNumber(behavior.page_views_30d)}｜搜索 {safeNumber(behavior.search_count_30d)}｜研报下载 {safeNumber(behavior.report_downloads_30d)}｜收藏 {safeNumber(behavior.content_favorite_count_30d)}
          </BasicDataSection>
          <BasicDataSection title="AI使用">
            AI问答 {safeNumber(behavior.ai_chat_count_30d)}次｜完成率 {formatPercent(aiUsage.ai_completion_rate)}｜正反馈 {positiveFeedback} / {positiveFeedback + negativeFeedback}
          </BasicDataSection>
          <BasicDataSection title="资产风险">
            偏好 {formatPreferredAssets(assetRisk.preferred_assets)}｜问卷 {assetRisk.questionnaire_risk_level || "--"}｜行为 {assetRisk.behavior_risk_level || "--"}
          </BasicDataSection>
          <BasicDataSection title="合规信号">
            投诉 {safeNumber(risk.complaint_count_30d)}｜异常登录 {safeNumber(risk.abnormal_login_count_30d)}｜敏感操作 {safeNumber(risk.sensitive_operation_count_30d)}｜人工复核 {formatManualReview(risk.manual_review_flag)}
          </BasicDataSection>
        </div>
      </div>
      <BasicDataChart profile={profile} />
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
            <section className={`${profileCardClass} col-span-full min-h-[360px] xl:col-span-8`}>
              {radarData && (
                <div className="flex h-full min-h-[360px] flex-col items-start px-5 py-4">
                  <div className="mb-2 flex w-full max-w-[620px] items-center justify-start gap-10">
                    <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
                      综合价值雷达模型
                    </h2>
                    <div className="flex items-center gap-5 text-xs font-semibold text-gray-600 dark:text-gray-300">
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
                  <div key={selectedUser?.id} className="radar-reveal min-h-0 w-full max-w-[600px] grow origin-center">
                    <RadarChart data={radarData} />
                  </div>
                </div>
              )}
            </section>
            <section className={`${profileCardClass} col-span-full min-h-[360px] xl:col-span-4`}>
              {selectedProfile && <BasicDataLayerCard profile={selectedProfile} />}
            </section>
            <section className={`${profileCardClass} col-span-full min-h-[184px] xl:col-span-8`} />
            <section className={`${profileCardClass} col-span-full min-h-[184px] xl:col-span-4`} />
          </div>
        </div>
      </main>
    </>
  );
}

export default Personal_profile;
