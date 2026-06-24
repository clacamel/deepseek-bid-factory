const express = require('express');
const cors = require('cors');
require('dotenv').config();

const generateRoutes = require('./routes/generate');

const app = express();

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 路由
app.use('/api/generate', generateRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '🚀 DeepSeek标书系统运行中' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 DeepSeek标书系统运行中`);
  console.log(`📍 后端: http://localhost:${PORT}`);
  console.log(`✅ API 健康检查: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
