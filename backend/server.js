const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "database", "finance_demo.db");
const db = new Database(dbPath);

function parseJsonArray(value) {
  if (!value) return [];

  try {
    const parsedValue = JSON.parse(value);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

// 获取所有用户
app.get("/api/users", (req, res) => {
  const users = db.prepare(`
    SELECT id, name, age, gender, city, occupation, user_type
    FROM users
  `).all();

  res.json(users);
});

// 获取单个用户完整画像
app.get("/api/users/:id/profile", (req, res) => {
  const { id } = req.params;

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  const behavior = db.prepare("SELECT * FROM user_behavior WHERE user_id = ?").get(id);
  const assetRisk = db.prepare("SELECT * FROM user_asset_risk WHERE user_id = ?").get(id);
  const scores = db.prepare("SELECT * FROM user_scores WHERE user_id = ?").get(id);
  const aiAnalysis = db.prepare("SELECT * FROM user_ai_analysis WHERE user_id = ?").get(id);
  const risk = db.prepare("SELECT * FROM user_risk WHERE user_id = ?").get(id);
  const aiUsage = db.prepare("SELECT * FROM user_ai_usage WHERE user_id = ?").get(id);

  if (!user) {
    return res.status(404).json({ message: "用户不存在" });
  }

  res.json({
    ...user,
    behavior,
    assetRisk,
    scores,
    risk,
    aiUsage,
    aiAnalysis: {
      ...aiAnalysis,
      key_reasons: parseJsonArray(aiAnalysis?.key_reasons),
      key_labels: parseJsonArray(aiAnalysis?.key_labels),
    },
  });
});

app.listen(PORT, () => {
  console.log(`后端服务已启动：http://localhost:${PORT}`);
});
