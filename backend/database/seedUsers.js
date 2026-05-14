const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "finance_demo.db");
const db = new Database(dbPath);

const ensureColumn = (tableName, columnName, columnType) => {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
  if (!columns.some((column) => column.name === columnName)) {
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`);
  }
};

ensureColumn("user_behavior", "click_membership_page_30d", "INTEGER");
ensureColumn("user_behavior", "click_product_detail_30d", "INTEGER");
ensureColumn("user_behavior", "content_favorite_count_30d", "INTEGER");
ensureColumn("user_behavior", "share_count_30d", "INTEGER");
ensureColumn("user_behavior", "comment_count_30d", "INTEGER");
ensureColumn("user_ai_analysis", "key_labels", "TEXT");

const stringifyKeyLabels = (labels) => JSON.stringify(labels);

db.exec(`
  CREATE TABLE IF NOT EXISTS user_risk (
    user_id TEXT PRIMARY KEY,
    complaint_count_30d INTEGER,
    abnormal_login_count_30d INTEGER,
    sensitive_operation_count_30d INTEGER,
    manual_review_flag INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS user_ai_usage (
    user_id TEXT PRIMARY KEY,
    ai_completion_rate REAL,
    ai_positive_feedback_count INTEGER,
    ai_negative_feedback_count INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// 先清空旧数据，方便反复测试
db.exec(`
  DELETE FROM user_ai_usage;
  DELETE FROM user_risk;
  DELETE FROM user_ai_analysis;
  DELETE FROM user_scores;
  DELETE FROM user_asset_risk;
  DELETE FROM user_behavior;
  DELETE FROM users;
`);

const insertUser = db.prepare(`
  INSERT INTO users (
    id, name, age, gender, city, occupation, user_type, register_date
  ) VALUES (
    @id, @name, @age, @gender, @city, @occupation, @user_type, @register_date
  )
`);

const insertBehavior = db.prepare(`
  INSERT INTO user_behavior (
    user_id, login_count_30d, active_days_30d, avg_session_minutes,
    last_visit_date, page_views_30d, search_count_30d, ai_chat_count_30d,
    report_downloads_30d, watchlist_count, click_membership_page_30d,
    click_product_detail_30d, content_favorite_count_30d, share_count_30d,
    comment_count_30d
  ) VALUES (
    @user_id, @login_count_30d, @active_days_30d, @avg_session_minutes,
    @last_visit_date, @page_views_30d, @search_count_30d, @ai_chat_count_30d,
    @report_downloads_30d, @watchlist_count, @click_membership_page_30d,
    @click_product_detail_30d, @content_favorite_count_30d, @share_count_30d,
    @comment_count_30d
  )
`);

const insertAssetRisk = db.prepare(`
  INSERT INTO user_asset_risk (
    user_id, preferred_assets, estimated_asset_level,
    questionnaire_risk_level, behavior_risk_level,
    risk_mismatch, risk_mismatch_reason
  ) VALUES (
    @user_id, @preferred_assets, @estimated_asset_level,
    @questionnaire_risk_level, @behavior_risk_level,
    @risk_mismatch, @risk_mismatch_reason
  )
`);

const insertScores = db.prepare(`
  INSERT INTO user_scores (
    user_id, conversion_value, asset_risk_value, content_value,
    retention_value, digital_service_value, compliance_trust_value,
    total_value_score, value_level, updated_at
  ) VALUES (
    @user_id, @conversion_value, @asset_risk_value, @content_value,
    @retention_value, @digital_service_value, @compliance_trust_value,
    @total_value_score, @value_level, @updated_at
  )
`);

const insertAiAnalysis = db.prepare(`
  INSERT INTO user_ai_analysis (
    user_id, main_conclusion, key_reasons, key_labels,
    operation_suggestion, ai_confidence, updated_at
  ) VALUES (
    @user_id, @main_conclusion, @key_reasons, @key_labels,
    @operation_suggestion, @ai_confidence, @updated_at
  )
`);

const insertRisk = db.prepare(`
  INSERT INTO user_risk (
    user_id, complaint_count_30d, abnormal_login_count_30d,
    sensitive_operation_count_30d, manual_review_flag
  ) VALUES (
    @user_id, @complaint_count_30d, @abnormal_login_count_30d,
    @sensitive_operation_count_30d, @manual_review_flag
  )
`);

const insertAiUsage = db.prepare(`
  INSERT INTO user_ai_usage (
    user_id, ai_completion_rate, ai_positive_feedback_count,
    ai_negative_feedback_count
  ) VALUES (
    @user_id, @ai_completion_rate, @ai_positive_feedback_count,
    @ai_negative_feedback_count
  )
`);

const users = [
  {
    id: "U1001",
    name: "张明",
    age: 32,
    gender: "男",
    city: "上海",
    occupation: "互联网产品经理",
    user_type: "高潜转化型用户",
    register_date: "2025-09-12",

    behavior: {
      login_count_30d: 22,
      active_days_30d: 18,
      avg_session_minutes: 16.5,
      last_visit_date: "2026-05-12",
      page_views_30d: 186,
      search_count_30d: 34,
      ai_chat_count_30d: 12,
      report_downloads_30d: 5,
      watchlist_count: 18,
      click_membership_page_30d: 3,
      click_product_detail_30d: 6,
      content_favorite_count_30d: 9,
      share_count_30d: 2,
      comment_count_30d: 1,
    },

    assetRisk: {
      preferred_assets: "基金,债券,ETF",
      estimated_asset_level: "中高",
      questionnaire_risk_level: "稳健型",
      behavior_risk_level: "平衡型",
      risk_mismatch: 1,
      risk_mismatch_reason: "问卷偏稳健，但近期浏览了较多中高波动 ETF 内容",
    },

    scores: {
      conversion_value: 82,
      asset_risk_value: 76,
      content_value: 78,
      retention_value: 84,
      digital_service_value: 81,
      compliance_trust_value: 92,
      total_value_score: 82,
      value_level: "A",
      updated_at: "2026-05-13",
    },

    aiAnalysis: {
      main_conclusion:
        "该用户属于高潜转化型用户，近期行为从资讯浏览转向资产配置研究。",
      key_reasons: JSON.stringify([
        "近30天活跃18天，访问频率稳定",
        "多次查看基金配置和债券市场内容",
        "AI问答完成率较高，数字化服务接受度强",
      ]),
      key_labels: stringifyKeyLabels([
        ["高活跃", "稳定访问"],
        ["配置意图", "稳健偏好"],
        ["AI接受度", "服务粘性"],
      ]),
      operation_suggestion:
        "建议推荐基金组合分析、宏观研报会员权益和稳健型资产配置内容。",
      ai_confidence: 0.86,
      updated_at: "2026-05-13",
    },

    risk: {
      complaint_count_30d: 0,
      abnormal_login_count_30d: 0,
      sensitive_operation_count_30d: 1,
      manual_review_flag: 0,
    },

    aiUsage: {
      ai_completion_rate: 0.78,
      ai_positive_feedback_count: 4,
      ai_negative_feedback_count: 1,
    },
  },

  {
    id: "U1002",
    name: "李雪",
    age: 28,
    gender: "女",
    city: "杭州",
    occupation: "市场运营",
    user_type: "流失预警型用户",
    register_date: "2025-11-03",

    behavior: {
      login_count_30d: 4,
      active_days_30d: 3,
      avg_session_minutes: 3.8,
      last_visit_date: "2026-04-29",
      page_views_30d: 21,
      search_count_30d: 5,
      ai_chat_count_30d: 1,
      report_downloads_30d: 0,
      watchlist_count: 5,
      click_membership_page_30d: 0,
      click_product_detail_30d: 2,
      content_favorite_count_30d: 1,
      share_count_30d: 0,
      comment_count_30d: 0,
    },

    assetRisk: {
      preferred_assets: "股票,热点资讯",
      estimated_asset_level: "中",
      questionnaire_risk_level: "平衡型",
      behavior_risk_level: "平衡型",
      risk_mismatch: 0,
      risk_mismatch_reason: "问卷风险偏好与实际浏览内容基本一致",
    },

    scores: {
      conversion_value: 42,
      asset_risk_value: 58,
      content_value: 46,
      retention_value: 31,
      digital_service_value: 49,
      compliance_trust_value: 95,
      total_value_score: 50,
      value_level: "C",
      updated_at: "2026-05-13",
    },

    aiAnalysis: {
      main_conclusion:
        "该用户近期活跃度明显下降，存在较高流失风险。",
      key_reasons: JSON.stringify([
        "近30天仅活跃3天",
        "最近一次访问距离当前时间较久",
        "内容阅读深度下降，AI工具使用频率较低",
      ]),
      key_labels: stringifyKeyLabels([
        ["低活跃", "流失预警"],
        ["访问间隔", "召回触点"],
        ["低互动", "AI低频"],
      ]),
      operation_suggestion:
        "建议推送个性化热点资讯、短内容摘要和限时会员体验权益。",
      ai_confidence: 0.79,
      updated_at: "2026-05-13",
    },

    risk: {
      complaint_count_30d: 1,
      abnormal_login_count_30d: 1,
      sensitive_operation_count_30d: 0,
      manual_review_flag: 0,
    },

    aiUsage: {
      ai_completion_rate: 0.42,
      ai_positive_feedback_count: 1,
      ai_negative_feedback_count: 2,
    },
  },

  {
    id: "U1003",
    name: "王伟",
    age: 41,
    gender: "男",
    city: "北京",
    occupation: "企业财务负责人",
    user_type: "高净值稳健配置型用户",
    register_date: "2024-12-18",

    behavior: {
      login_count_30d: 26,
      active_days_30d: 21,
      avg_session_minutes: 18.2,
      last_visit_date: "2026-05-13",
      page_views_30d: 214,
      search_count_30d: 28,
      ai_chat_count_30d: 9,
      report_downloads_30d: 7,
      watchlist_count: 22,
      click_membership_page_30d: 4,
      click_product_detail_30d: 8,
      content_favorite_count_30d: 11,
      share_count_30d: 2,
      comment_count_30d: 2,
    },

    assetRisk: {
      preferred_assets: "基金,债券,ETF,固收+",
      estimated_asset_level: "高",
      questionnaire_risk_level: "稳健型",
      behavior_risk_level: "稳健型",
      risk_mismatch: 0,
      risk_mismatch_reason: "问卷风险偏好与近期固收类、基金组合类浏览行为一致",
    },

    scores: {
      conversion_value: 88,
      asset_risk_value: 91,
      content_value: 84,
      retention_value: 90,
      digital_service_value: 82,
      compliance_trust_value: 100,
      total_value_score: 89,
      value_level: "S",
      updated_at: "2026-05-13",
    },

    aiAnalysis: {
      main_conclusion:
        "该用户活跃度高且资产配置意图明确，适合优先推荐稳健型组合服务和高阶投研内容。",
      key_reasons: JSON.stringify([
        "近30天活跃21天，最近一次访问为当天",
        "多次查看产品详情和下载研报，说明配置决策已进入比较阶段",
        "风险偏好与行为表现一致，合规信任风险较低",
      ]),
      key_labels: stringifyKeyLabels([
        ["高活跃", "即时访问"],
        ["产品比较", "决策推进"],
        ["风险匹配", "高信任"],
      ]),
      operation_suggestion:
        "建议推送稳健组合方案、固收+专题研报和专属顾问预约入口。",
      ai_confidence: 0.9,
      updated_at: "2026-05-13",
    },

    risk: {
      complaint_count_30d: 0,
      abnormal_login_count_30d: 0,
      sensitive_operation_count_30d: 0,
      manual_review_flag: 0,
    },

    aiUsage: {
      ai_completion_rate: 0.84,
      ai_positive_feedback_count: 6,
      ai_negative_feedback_count: 1,
    },
  },

  {
    id: "U1004",
    name: "刘芳",
    age: 35,
    gender: "女",
    city: "深圳",
    occupation: "跨境电商运营",
    user_type: "内容驱动成长型用户",
    register_date: "2025-06-21",

    behavior: {
      login_count_30d: 16,
      active_days_30d: 12,
      avg_session_minutes: 12.4,
      last_visit_date: "2026-05-10",
      page_views_30d: 146,
      search_count_30d: 23,
      ai_chat_count_30d: 7,
      report_downloads_30d: 3,
      watchlist_count: 12,
      click_membership_page_30d: 2,
      click_product_detail_30d: 5,
      content_favorite_count_30d: 13,
      share_count_30d: 4,
      comment_count_30d: 3,
    },

    assetRisk: {
      preferred_assets: "基金,ETF,热点资讯",
      estimated_asset_level: "中高",
      questionnaire_risk_level: "平衡型",
      behavior_risk_level: "平衡型",
      risk_mismatch: 0,
      risk_mismatch_reason: "收藏和分享较多投教内容，风险偏好与中等波动产品关注一致",
    },

    scores: {
      conversion_value: 68,
      asset_risk_value: 76,
      content_value: 81,
      retention_value: 72,
      digital_service_value: 70,
      compliance_trust_value: 100,
      total_value_score: 75,
      value_level: "A",
      updated_at: "2026-05-13",
    },

    aiAnalysis: {
      main_conclusion:
        "该用户对内容互动响应积极，适合通过投教内容和轻量产品对比逐步促进转化。",
      key_reasons: JSON.stringify([
        "收藏、分享和评论行为活跃，内容偏好明确",
        "搜索和AI问答频次中等，仍处于学习和筛选阶段",
        "近期访问稳定，无明显风险预警信号",
      ]),
      key_labels: stringifyKeyLabels([
        ["内容互动", "偏好明确"],
        ["学习阶段", "筛选中"],
        ["稳定访问", "低风险"],
      ]),
      operation_suggestion:
        "建议推送ETF入门专题、基金对比工具和内容收藏后的延伸阅读提醒。",
      ai_confidence: 0.83,
      updated_at: "2026-05-13",
    },

    risk: {
      complaint_count_30d: 0,
      abnormal_login_count_30d: 0,
      sensitive_operation_count_30d: 0,
      manual_review_flag: 0,
    },

    aiUsage: {
      ai_completion_rate: 0.73,
      ai_positive_feedback_count: 5,
      ai_negative_feedback_count: 1,
    },
  },

  {
    id: "U1005",
    name: "陈杰",
    age: 29,
    gender: "男",
    city: "成都",
    occupation: "软件工程师",
    user_type: "AI工具偏好型用户",
    register_date: "2025-03-08",

    behavior: {
      login_count_30d: 19,
      active_days_30d: 15,
      avg_session_minutes: 14.1,
      last_visit_date: "2026-05-12",
      page_views_30d: 122,
      search_count_30d: 31,
      ai_chat_count_30d: 14,
      report_downloads_30d: 2,
      watchlist_count: 10,
      click_membership_page_30d: 1,
      click_product_detail_30d: 4,
      content_favorite_count_30d: 6,
      share_count_30d: 1,
      comment_count_30d: 1,
    },

    assetRisk: {
      preferred_assets: "ETF,股票,基金",
      estimated_asset_level: "中",
      questionnaire_risk_level: "平衡型",
      behavior_risk_level: "积极型",
      risk_mismatch: 1,
      risk_mismatch_reason: "问卷偏平衡，但近期AI问答和搜索更关注高波动资产",
    },

    scores: {
      conversion_value: 55,
      asset_risk_value: 64,
      content_value: 60,
      retention_value: 75,
      digital_service_value: 86,
      compliance_trust_value: 77,
      total_value_score: 66,
      value_level: "B",
      updated_at: "2026-05-13",
    },

    aiAnalysis: {
      main_conclusion:
        "该用户高度依赖AI工具进行投资筛选，但实际风险偏好可能高于问卷结果，需要加强适当性提示。",
      key_reasons: JSON.stringify([
        "AI问答次数接近上限，数字服务接受度高",
        "搜索集中在ETF和股票方向，行为风险高于问卷风险",
        "近期仍保持较高登录频率，具备持续运营价值",
      ]),
      key_labels: stringifyKeyLabels([
        ["AI高频", "数字偏好"],
        ["风险偏移", "高波动关注"],
        ["高登录", "持续运营"],
      ]),
      operation_suggestion:
        "建议在AI问答结果中增加风险揭示，并推荐波动说明、资产配置模拟器和适当性复核入口。",
      ai_confidence: 0.87,
      updated_at: "2026-05-13",
    },

    risk: {
      complaint_count_30d: 0,
      abnormal_login_count_30d: 1,
      sensitive_operation_count_30d: 1,
      manual_review_flag: 0,
    },

    aiUsage: {
      ai_completion_rate: 0.91,
      ai_positive_feedback_count: 7,
      ai_negative_feedback_count: 1,
    },
  },

  {
    id: "U1006",
    name: "赵敏",
    age: 46,
    gender: "女",
    city: "南京",
    occupation: "医院科室主任",
    user_type: "低频高价值保守型用户",
    register_date: "2024-09-30",

    behavior: {
      login_count_30d: 8,
      active_days_30d: 6,
      avg_session_minutes: 9.6,
      last_visit_date: "2026-05-06",
      page_views_30d: 64,
      search_count_30d: 11,
      ai_chat_count_30d: 3,
      report_downloads_30d: 4,
      watchlist_count: 8,
      click_membership_page_30d: 2,
      click_product_detail_30d: 3,
      content_favorite_count_30d: 4,
      share_count_30d: 0,
      comment_count_30d: 0,
    },

    assetRisk: {
      preferred_assets: "债券,基金,固收+",
      estimated_asset_level: "高",
      questionnaire_risk_level: "保守型",
      behavior_risk_level: "稳健型",
      risk_mismatch: 1,
      risk_mismatch_reason: "问卷偏保守，但近期开始关注固收+和基金组合，存在轻微风险偏好上移",
    },

    scores: {
      conversion_value: 52,
      asset_risk_value: 78,
      content_value: 48,
      retention_value: 50,
      digital_service_value: 43,
      compliance_trust_value: 77,
      total_value_score: 61,
      value_level: "B",
      updated_at: "2026-05-13",
    },

    aiAnalysis: {
      main_conclusion:
        "该用户访问频率不高但资产层级较高，适合以低打扰、高信任的方式提供稳健配置服务。",
      key_reasons: JSON.stringify([
        "资产层级高，偏好债券和固收类资产",
        "访问频率偏低但有研报下载和会员页点击",
        "问卷风险和行为风险存在轻微不一致，需要温和提示",
      ]),
      key_labels: stringifyKeyLabels([
        ["高资产", "固收偏好"],
        ["低频高值", "研报触达"],
        ["风险校准", "温和提示"],
      ]),
      operation_suggestion:
        "建议推送低频高质量月度配置报告、稳健组合说明和一对一顾问服务邀约。",
      ai_confidence: 0.81,
      updated_at: "2026-05-13",
    },

    risk: {
      complaint_count_30d: 0,
      abnormal_login_count_30d: 0,
      sensitive_operation_count_30d: 1,
      manual_review_flag: 0,
    },

    aiUsage: {
      ai_completion_rate: 0.61,
      ai_positive_feedback_count: 2,
      ai_negative_feedback_count: 1,
    },
  },

  {
    id: "U1007",
    name: "周磊",
    age: 33,
    gender: "男",
    city: "武汉",
    occupation: "销售经理",
    user_type: "风险预警需安抚型用户",
    register_date: "2025-01-15",

    behavior: {
      login_count_30d: 11,
      active_days_30d: 8,
      avg_session_minutes: 7.2,
      last_visit_date: "2026-05-08",
      page_views_30d: 88,
      search_count_30d: 17,
      ai_chat_count_30d: 5,
      report_downloads_30d: 1,
      watchlist_count: 14,
      click_membership_page_30d: 0,
      click_product_detail_30d: 7,
      content_favorite_count_30d: 3,
      share_count_30d: 1,
      comment_count_30d: 2,
    },

    assetRisk: {
      preferred_assets: "股票,ETF,热点资讯",
      estimated_asset_level: "中",
      questionnaire_risk_level: "积极型",
      behavior_risk_level: "激进型",
      risk_mismatch: 1,
      risk_mismatch_reason: "近期频繁查看高波动产品详情，行为风险高于问卷风险",
    },

    scores: {
      conversion_value: 53,
      asset_risk_value: 58,
      content_value: 47,
      retention_value: 50,
      digital_service_value: 51,
      compliance_trust_value: 52,
      total_value_score: 53,
      value_level: "C",
      updated_at: "2026-05-13",
    },

    aiAnalysis: {
      main_conclusion:
        "该用户对高波动资产兴趣较高，同时存在投诉和敏感操作记录，需优先进行风险安抚与适当性校验。",
      key_reasons: JSON.stringify([
        "产品详情点击较多但研报下载少，可能偏短线热点驱动",
        "存在投诉和敏感操作记录，合规信任分受压",
        "行为风险高于问卷风险，需要及时干预",
      ]),
      key_labels: stringifyKeyLabels([
        ["热点驱动", "低研究"],
        ["合规压力", "敏感操作"],
        ["风险升高", "及时干预"],
      ]),
      operation_suggestion:
        "建议推送风险提示、持仓波动解释内容，并触发人工顾问跟进确认投资适当性。",
      ai_confidence: 0.84,
      updated_at: "2026-05-13",
    },

    risk: {
      complaint_count_30d: 2,
      abnormal_login_count_30d: 1,
      sensitive_operation_count_30d: 2,
      manual_review_flag: 1,
    },

    aiUsage: {
      ai_completion_rate: 0.58,
      ai_positive_feedback_count: 1,
      ai_negative_feedback_count: 3,
    },
  },
];

const insertAll = db.transaction((users) => {
  for (const user of users) {
    insertUser.run({
      id: user.id,
      name: user.name,
      age: user.age,
      gender: user.gender,
      city: user.city,
      occupation: user.occupation,
      user_type: user.user_type,
      register_date: user.register_date,
    });

    insertBehavior.run({
      user_id: user.id,
      ...user.behavior,
    });

    insertAssetRisk.run({
      user_id: user.id,
      ...user.assetRisk,
    });

    insertScores.run({
      user_id: user.id,
      ...user.scores,
    });

    insertAiAnalysis.run({
      user_id: user.id,
      ...user.aiAnalysis,
    });

    insertRisk.run({
      user_id: user.id,
      ...user.risk,
    });

    insertAiUsage.run({
      user_id: user.id,
      ...user.aiUsage,
    });
  }
});

insertAll(users);

console.log("假人数据插入成功！");

db.close();
