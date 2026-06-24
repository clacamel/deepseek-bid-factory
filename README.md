# 🏭 DeepSeek 标书AI工厂（MVP完整版）

**AI驱动的智能投标文件自动生成系统**

[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green)]()
[![Express](https://img.shields.io/badge/Express-4.18%2B-blue)]()
[![License](https://img.shields.io/badge/License-MIT-yellow)]()

---

## 🎯 核心功能

✅ **智能目录生成** - 自动拆分标书结构（9大章节）
✅ **内容自动生成** - AI生成8000+字/章节
✅ **内容扩写优化** - 质量控制和审查
✅ **Web可视化界面** - 开箱即用的前端
✅ **完整API接口** - 可集成到其他系统
✅ **本地部署** - 无需复杂配置

---

## 📊 能做什么

* 📋 **Demo演示** - 给客户展示标书自动生成能力
* 💼 **接单测试** - 验证市场需求
* 🔧 **私人使用** - 快速生成标书初稿
* 💰 **小规模收费** - 单份 99-299 元（MVP阶段）
* 🎓 **技术学习** - 理解AI标书生成的完整流程

---

## 🚀 快速开始

### ① 环境要求

- Node.js 14+
- DeepSeek API Key（免费申请）

### ② 获取 DeepSeek API Key

1. 访问 [DeepSeek官网](https://www.deepseek.com)
2. 注册账户并登录
3. 在「API管理」中创建新的 API Key
4. 复制 API Key

### ③ 安装依赖

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install
```

### ④ 配置 API Key

在 `backend/.env` 文件中添加你的 DeepSeek API Key：

```env
DEEPSEEK_API_KEY=sk-your-api-key-here
```

### ⑤ 启动后端服务

```bash
node src/app.js
```

你会看到：
```
🚀 DeepSeek标书系统运行中
📍 后端: http://localhost:3001
✅ API 健康检查: http://localhost:3001/api/health
```

### ⑥ 打开前端

直接在浏览器中打开：
```
frontend/index.html
```

或启动一个简单的HTTP服务器：
```bash
# 使用Python
python -m http.server 8000

# 然后访问
http://localhost:8000/frontend/index.html
```

### ⑦ 开始使用

1. 输入**投标单位名称**（必填）
2. 输入**项目名称**（必填）
3. 选择**项目类型**（可选）
4. 点击 **🚀 生成完整标书**
5. 等待生成完成（3-5分钟）
6. 查看结果或下载TXT文件

---

## 📁 项目结构

```
deepseek-bid-factory/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express服务器入口
│   │   ├── services/
│   │   │   ├── ai.js              # DeepSeek API调用
│   │   │   ├── outline.js         # 目录生成
│   │   │   ├── section.js         # 章节内容生成
│   │   │   ├── expand.js          # 内容扩写
│   │   │   └── review.js          # 内容审查
│   │   └── routes/
│   │       └── generate.js        # 生成接口
│   ├── .env                        # 环境配置（需要填入API Key）
│   ├── .env.example               # 环境配置示例
│   └── package.json
├── frontend/
│   └── index.html                 # 前端UI（开箱即用）
└── README.md
```

---

## 🔌 API 接口

### 生成完整标书

**POST** `/api/generate/all`

```json
{
  "company": "XX物业管理有限公司",
  "project": "XX政府园区物业管理服务",
  "type": "物业管理"
}
```

**响应**:
```json
{
  "success": true,
  "content": "标书完整内容",
  "outline": { ... },
  "review": { ... },
  "metadata": {
    "sections": 9,
    "estimatedWords": 50000
  }
}
```

### 仅生成目录

**POST** `/api/generate/outline`

### 生成单个章节

**POST** `/api/generate/section`

```json
{
  "sectionTitle": "第一章 公司简介",
  "project": { "company": "...", "project": "..." }
}
```

---

## 🎓 工作流程

```
用户输入
   ↓
生成目录结构（9大章节）
   ↓
逐章节生成内容（8000字/章）
   ↓
内容扩写优化
   ↓
质量审查
   ↓
输出完整标书（50,000+ 字）
   ↓
下载或查看
```

---

## 📈 性能指标

| 指标 | 数值 |
|------|------|
| 章节数 | 9 |
| 每章平均字数 | 8,000+ |
| 总字数 | 50,000+ |
| 生成时间 | 3-5 分钟 |
| 支持并发 | 1（MVP版本） |

---

## ⚙️ 环境变量

| 变量 | 说明 | 必需 |
|------|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API密钥 | ✅ |
| `PORT` | 服务器端口 | ❌ (默认3001) |
| `NODE_ENV` | 运行环境 | ❌ (默认development) |

---

## 🐛 常见问题

### Q: 为什么生成很慢？
A: 这是正常的。AI生成内容需要时间，首次生成可能需要3-5分钟。建议使用代理或VPN加速。

### Q: API Key在哪里获取？
A: 访问 [DeepSeek官网](https://www.deepseek.com) 注册后在API管理中生成。

### Q: 如何修改生成内容的质量？
A: 编辑 `backend/src/services/*.js` 中的提示词（prompt）。

### Q: 支持Word导出吗？
A: 当前版本只支持TXT下载。Word导出是后续付费版本的功能。

### Q: 能否部署到云端？
A: 可以！支持部署到阿里云、腾讯云等，详见下方。

---

## 🔄 下一步升级方案

### 如果你想继续升级，我可以帮你实现：

#### 🟢 **生产级版本**（推荐）
- ✅ 用户登录系统
- ✅ 微信支付集成
- ✅ 用户数据隔离
- ✅ 任务队列处理
- ✅ Word模板美化
- ✅ 多模型支持
- ✅ RAG知识库

#### 🔵 **SaaS商业版本**
- ✅ 多租户架构
- ✅ 企业级权限管理
- ✅ 数据库持久化
- ✅ 完整的用户中心
- ✅ 订阅制管理
- ✅ 企业级部署
- ✅ Docker容器化

#### 🟠 **一键部署版本**
- ✅ 阿里云快速部署
- ✅ 腾讯云集成
- ✅ Docker容器
- ✅ CI/CD流水线

**如果需要升级，直接告诉我：** 📝 "升级生产级版本" 或 "升级SaaS商业版本"

---

## 📊 商业模式

### MVP阶段（当前）
- 单份标书：99-199 元
- 月度套餐：5份/299元
- 年度套餐：50份/2999元

### 生产版本
- API接口：100元/月
- 企业版：1000元/月
- SaaS版本：3000元/月起

---

## 📞 技术支持

如有问题，请：
1. 检查 API Key 是否正确配置
2. 确保网络连接正常
3. 查看后端控制台日志
4. 提交 Issue 反馈

---

## 📄 许可证

MIT License - 可自由使用和修改

---

## 🙏 致谢

感谢 DeepSeek 提供强大的AI能力支持！

---

**👉 现在就开始吧！** 🚀

有任何问题或需要升级，随时告诉我！
