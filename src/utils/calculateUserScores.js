function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(value, max));
}

function normalize(value, max) {
  if (!value || value < 0) return 0;
  return clamp((value / max) * 100);
}

function safeNumber(value, defaultValue = 0) {
  return typeof value === "number" && !Number.isNaN(value)
    ? value
    : defaultValue;
}

function daysBetween(dateStr, todayStr = "2026-05-13") {
  const d1 = new Date(dateStr);
  const d2 = new Date(todayStr);

  if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) {
    return 999;
  }

  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
}

function getRecencyScore(lastVisitDate, todayStr = "2026-05-13") {
  const days = daysBetween(lastVisitDate, todayStr);

  if (days <= 1) return 100;
  if (days <= 3) return 85;
  if (days <= 7) return 65;
  if (days <= 14) return 40;
  return 20;
}

function getAssetLevelScore(level) {
  const map = {
    低: 40,
    中: 60,
    中高: 80,
    高: 95,
  };

  return map[level] || 60;
}

function getRiskMatchScore(questionnaireRiskLevel, behaviorRiskLevel, riskMismatch) {
  const riskLevelMap = {
    保守型: 1,
    稳健型: 2,
    平衡型: 3,
    积极型: 4,
    激进型: 5,
  };

  const q = riskLevelMap[questionnaireRiskLevel];
  const b = riskLevelMap[behaviorRiskLevel];

  if (!q || !b) {
    return riskMismatch === 1 ? 60 : 90;
  }

  const gap = Math.abs(q - b);

  if (gap === 0) return 100;
  if (gap === 1) return 80;
  if (gap === 2) return 60;
  return 40;
}

function getPositiveFeedbackScore(aiUsage = {}) {
  const positive = safeNumber(aiUsage.ai_positive_feedback_count);
  const negative = safeNumber(aiUsage.ai_negative_feedback_count);
  const total = positive + negative;

  if (total === 0) return 60;

  const positiveRateScore = (positive / total) * 100;
  const feedbackVolumeScore = normalize(total, 8);

  return positiveRateScore * 0.7 + feedbackVolumeScore * 0.3;
}

function getValueLevel(score) {
  if (score >= 85) return "S";
  if (score >= 75) return "A";
  if (score >= 60) return "B";
  if (score >= 45) return "C";
  return "D";
}

export function calculateUserScores(user, todayStr = "2026-05-13") {
  const behavior = user.behavior || {};
  const assetRisk = user.assetRisk || {};
  const risk = user.risk || {};
  const aiUsage = user.aiUsage || {};

  const loginScore = normalize(safeNumber(behavior.login_count_30d), 30);
  const activeDaysScore = normalize(safeNumber(behavior.active_days_30d), 20);
  const sessionDepthScore = normalize(safeNumber(behavior.avg_session_minutes), 20);
  const pageViewScore = normalize(safeNumber(behavior.page_views_30d), 200);
  const searchScore = normalize(safeNumber(behavior.search_count_30d), 40);
  const aiChatScore = normalize(safeNumber(behavior.ai_chat_count_30d), 15);
  const reportDownloadScore = normalize(safeNumber(behavior.report_downloads_30d), 8);
  const watchlistScore = normalize(safeNumber(behavior.watchlist_count), 20);

  const membershipScore = normalize(
    safeNumber(behavior.click_membership_page_30d),
    5
  );

  const productDetailScore = normalize(
    safeNumber(behavior.click_product_detail_30d),
    10
  );

  const favoriteScore = normalize(
    safeNumber(behavior.content_favorite_count_30d),
    15
  );

  const shareScore = normalize(safeNumber(behavior.share_count_30d), 5);
  const commentScore = normalize(safeNumber(behavior.comment_count_30d), 5);

  const recencyScore = getRecencyScore(behavior.last_visit_date, todayStr);

  const preferredAssets = assetRisk.preferred_assets
    ? assetRisk.preferred_assets.split(",").map((item) => item.trim())
    : [];

  const assetLevelScore = getAssetLevelScore(assetRisk.estimated_asset_level);

  const riskMatchScore = getRiskMatchScore(
    assetRisk.questionnaire_risk_level,
    assetRisk.behavior_risk_level,
    assetRisk.risk_mismatch
  );

  const assetDiversityScore = normalize(preferredAssets.length, 4);

  const assetIntentScore =
    productDetailScore * 0.6 +
    watchlistScore * 0.4;

  const aiCompletionScore = clamp(
    safeNumber(aiUsage.ai_completion_rate, 0.6) * 100
  );

  const aiFeedbackScore = getPositiveFeedbackScore(aiUsage);

  const conversionValue =
    membershipScore * 0.25 +
    productDetailScore * 0.25 +
    reportDownloadScore * 0.20 +
    watchlistScore * 0.15 +
    searchScore * 0.10 +
    aiChatScore * 0.05;

  const assetRiskValue =
    assetLevelScore * 0.30 +
    riskMatchScore * 0.30 +
    assetDiversityScore * 0.20 +
    assetIntentScore * 0.20;

  const contentValue =
    pageViewScore * 0.20 +
    sessionDepthScore * 0.20 +
    searchScore * 0.15 +
    reportDownloadScore * 0.20 +
    favoriteScore * 0.10 +
    shareScore * 0.075 +
    commentScore * 0.075;

  const interactionBreadthScore =
    pageViewScore * 0.5 +
    aiChatScore * 0.5;

  const retentionValue =
    activeDaysScore * 0.35 +
    loginScore * 0.20 +
    recencyScore * 0.20 +
    sessionDepthScore * 0.15 +
    interactionBreadthScore * 0.10;

  const digitalServiceValue =
    aiChatScore * 0.30 +
    aiCompletionScore * 0.25 +
    aiFeedbackScore * 0.20 +
    searchScore * 0.15 +
    reportDownloadScore * 0.10;

  const riskMismatchPenalty = assetRisk.risk_mismatch === 1 ? 15 : 0;
  const complaintPenalty = Math.min(
    safeNumber(risk.complaint_count_30d) * 15,
    40
  );
  const abnormalLoginPenalty = Math.min(
    safeNumber(risk.abnormal_login_count_30d) * 10,
    30
  );
  const sensitiveOperationPenalty = Math.min(
    safeNumber(risk.sensitive_operation_count_30d) * 8,
    30
  );
  const manualReviewPenalty = risk.manual_review_flag ? 25 : 0;

  const totalPenalty =
    riskMismatchPenalty +
    complaintPenalty +
    abnormalLoginPenalty +
    sensitiveOperationPenalty +
    manualReviewPenalty;

  const complianceTrustValue = clamp(100 - totalPenalty);

  const totalValueScore =
    conversionValue * 0.25 +
    assetRiskValue * 0.25 +
    contentValue * 0.15 +
    retentionValue * 0.15 +
    digitalServiceValue * 0.10 +
    complianceTrustValue * 0.10;

  return {
    conversion_value: Math.round(conversionValue),
    asset_risk_value: Math.round(assetRiskValue),
    content_value: Math.round(contentValue),
    retention_value: Math.round(retentionValue),
    digital_service_value: Math.round(digitalServiceValue),
    compliance_trust_value: Math.round(complianceTrustValue),
    total_value_score: Math.round(totalValueScore),
    value_level: getValueLevel(totalValueScore),

    detail_scores: {
      membershipScore: Math.round(membershipScore),
      productDetailScore: Math.round(productDetailScore),
      reportDownloadScore: Math.round(reportDownloadScore),
      watchlistScore: Math.round(watchlistScore),
      searchScore: Math.round(searchScore),
      aiChatScore: Math.round(aiChatScore),
      assetLevelScore: Math.round(assetLevelScore),
      riskMatchScore: Math.round(riskMatchScore),
      assetDiversityScore: Math.round(assetDiversityScore),
      recencyScore: Math.round(recencyScore),
      aiCompletionScore: Math.round(aiCompletionScore),
      aiFeedbackScore: Math.round(aiFeedbackScore),
      compliancePenalty: Math.round(totalPenalty),
    },
  };
}
