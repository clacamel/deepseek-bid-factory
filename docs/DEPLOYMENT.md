# 🚀 部署指南

## 本地部署

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境

编辑 `.env` 文件：

```env
DEEPSEEK_API_KEY=sk-your-key
PORT=3001
```

### 3. 启动服务

```bash
node src/app.js
```

---

## Docker 部署

### 创建 Dockerfile

```dockerfile
FROM node:16

WORKDIR /app

COPY backend/package.json .
RUN npm install --production

COPY backend/src ./src
COPY backend/.env .env

EXPOSE 3001

CMD ["node", "src/app.js"]
```

### 构建和运行

```bash
docker build -t deepseek-bid-factory .
docker run -p 3001:3001 deepseek-bid-factory
```

---

## 云端部署

### 阿里云 ECS

1. 创建 ECS 实例
2. 安装 Node.js
3. 上传代码
4. 运行服务
5. 配置安全组允许 3001 端口

### 腾讯云 CVM

类似阿里云流程

### Vercel/Netlify

部署前端到 Vercel，后端到单独的服务器

---

## SaaS 升级部署

如需升级到 SaaS 版本，需要：

- 数据库（MongoDB/MySQL）
- 用户认证（JWT）
- 支付网关（微信支付/支付宝）
- CDN（加速）
- 日志系统（ELK/Datadog）

---

## 性能优化

1. 启用缓存
2. 使用CDN
3. 数据库优化
4. 任务队列处理
5. 负载均衡

---

更多信息请参考 README.md
