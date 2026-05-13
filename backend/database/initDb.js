const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "finance_demo.db");
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    city TEXT,
    occupation TEXT,
    user_type TEXT,
    register_date TEXT
  );

  CREATE TABLE IF NOT EXISTS user_behavior (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    login_count_30d INTEGER,
    active_days_30d INTEGER,
    avg_session_minutes REAL,
    last_visit_date TEXT,
    page_views_30d INTEGER,
    search_count_30d INTEGER,
    ai_chat_count_30d INTEGER,
    report_downloads_30d INTEGER,
    watchlist_count INTEGER,
    click_membership_page_30d INTEGER,
    click_product_detail_30d INTEGER,
    content_favorite_count_30d INTEGER,
    share_count_30d INTEGER,
    comment_count_30d INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS user_asset_risk (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    preferred_assets TEXT,
    estimated_asset_level TEXT,
    questionnaire_risk_level TEXT,
    behavior_risk_level TEXT,
    risk_mismatch INTEGER,
    risk_mismatch_reason TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS user_scores (
    user_id TEXT PRIMARY KEY,
    conversion_value INTEGER,
    asset_risk_value INTEGER,
    content_value INTEGER,
    retention_value INTEGER,
    digital_service_value INTEGER,
    compliance_trust_value INTEGER,
    total_value_score INTEGER,
    value_level TEXT,
    updated_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS user_ai_analysis (
    user_id TEXT PRIMARY KEY,
    main_conclusion TEXT,
    key_reasons TEXT,
    operation_suggestion TEXT,
    ai_confidence REAL,
    updated_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

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

console.log("创建成功，数据库位置：", dbPath);

db.close();
