# 安全审计报告 — DeepSeek 标书 AI 工厂

**审计日期**: 2026-07-19  
**审计范围**: `/workspace`（Node.js + Express 后端，单文件 HTML 前端）  
**审计目标**: 识别中等严重度及以上、具备端到端利用路径的已确认漏洞。

---

## 执行摘要

本次审计覆盖了一个 MVP 阶段的 AI 标书生成系统。代码结构简单，无数据库、无文件系统操作、无传统认证/授权层，主要依赖 DeepSeek API 生成内容。审计发现 **3 项中等及以上严重度的已确认漏洞**：

1. **高危**：未认证 API 调用导致 DeepSeek API 配额耗尽 / 费用损失（CORS 放大了该风险）。
2. **中危**：前端使用 `innerHTML` 渲染 LLM 返回内容，存在可触发的 XSS。
3. **中危**：CORS 配置为允许任意来源，允许恶意网站在访客浏览器中跨站调用后端接口。

以下报告按严重度分组，给出攻击者画像、可控输入、完整代码路径、影响及修复建议。

---

## 严重度分级

| 等级 | 标识 | 说明 |
|------|------|------|
| 高危 | High | 可造成直接经济损失、敏感信息泄露或系统可用性严重受损 |
| 中危 | Medium | 可造成服务滥用、权限/资源消耗或需一定用户交互的代码执行 |
| 低危 | Low | 影响有限或利用条件苛刻 |

---

## 高危漏洞

### H-01：未认证调用导致 API 配额耗尽与费用损失

**严重度**: 高危  
**组件**: 后端 Express 路由  
**位置**: [backend/src/routes/generate.js](file:///workspace/backend/src/routes/generate.js#L10-L74)、[backend/src/services/outline.js](file:///workspace/backend/src/services/outline.js#L33-L44)、[backend/src/services/section.js](file:///workspace/backend/src/services/section.js#L22-L25)、[backend/src/services/ai.js](file:///workspace/backend/src/services/ai.js#L15-L40)

#### 攻击者画像
外部未认证用户，或结合 CORS 漏洞后任意第三方网站上的脚本。

#### 可控输入向量
`POST /api/generate/all` 的请求体，例如：

```json
{
  "company": "任意字符串",
  "project": "任意字符串",
  "type": "物业管理"
}
```

#### 端到端代码路径

1. 请求进入 [backend/src/app.js:15](file:///workspace/backend/src/app.js#L15)：`app.use('/api/generate', generateRoutes);`
2. 路由处理函数在 [backend/src/routes/generate.js:10](file:///workspace/backend/src/routes/generate.js#L10) 接收整个 `req.body` 作为 `project`：
   ```javascript
   const project = req.body;
   ```
3. 第 20 行调用 `generateOutline(project)`，进入 [backend/src/services/outline.js:33](file:///workspace/backend/src/services/outline.js#L33)，向 DeepSeek API 发起第一次请求。
4. 第 28–39 行循环调用 `generateSection(section.title, project)` 9 次，每次进入 [backend/src/services/section.js:22](file:///workspace/backend/src/services/section.js#L22)，向 DeepSeek API 发起后续请求。
5. 每个服务最终调用 [backend/src/services/ai.js:15](file:///workspace/backend/src/services/ai.js#L15)，使用环境变量 `DEEPSEEK_API_KEY` 调用 DeepSeek API。

#### 造成的影响
- **财务损失**：单次 `/api/generate/all` 调用会触发 1 次目录生成 + 9 次章节生成，共 10 次 DeepSeek API 请求。攻击者可通过脚本高频调用，快速消耗 API 配额并产生费用。
- **拒绝服务**：配额耗尽后，正常用户无法再生成标书。
- **CORS 放大**：由于 [backend/src/app.js:10](file:///workspace/backend/src/app.js#L10) 启用了无限制 CORS，恶意网站可在访客浏览器中发起相同请求，进一步放大攻击规模。

#### 修复建议
1. 为生成接口增加认证机制（如 API Key、JWT 登录或 IP 白名单）。
2. 增加速率限制（rate limiting），例如按用户/IP 限制 `/api/generate/all` 每小时调用次数。
3. 对请求体进行校验，限制 `company`、`project` 等字段长度，拒绝异常 payload。
4. 在生产环境配置 `NODE_ENV=production` 并记录访问日志用于审计。

---

## 中危漏洞

### M-01：前端 `innerHTML` 渲染 LLM 输出导致 XSS

**严重度**: 中危  
**组件**: 前端页面  
**位置**: [frontend/index.html:398-399](file:///workspace/frontend/index.html#L398-L399)

#### 攻击者画像
外部用户（通过钓鱼链接诱导受害者输入/点击），或本地用户主动输入恶意 payload。

#### 可控输入向量
`company`、`project` 等表单字段，或 LLM 在生成内容中自然包含的 HTML 标签。

#### 端到端代码路径

1. 用户在 [frontend/index.html:317-319](file:///workspace/frontend/index.html#L317-L319) 填写表单。
2. 通过 `fetch` 将数据发送到 `POST /api/generate/all`。
3. 后端将输入拼接到提示词中并发送至 DeepSeek。
4. 返回的 `data.content` 在 [frontend/index.html:398](file:///workspace/frontend/index.html#L398) 被直接写入 `innerHTML`：
   ```javascript
   html += data.content.replace(/\n/g, '<br/>');
   document.getElementById('output').innerHTML = html;
   ```
5. 如果攻击者在 `company` 中输入 `<img src=x onerror=alert(document.cookie)>`，LLM 很可能在生成标书时引用该“公司名称”，返回的内容中即包含可执行的 HTML/JS。

#### 造成的影响
- **反射型/存储型 XSS**：攻击者脚本在受害者浏览器中执行，可窃取 `document.cookie`、伪造用户请求、钓鱼或分发恶意软件。
- **品牌信任损害**：生成的标书内容可被注入恶意或不当信息。

#### 修复建议
1. 将 `innerHTML` 替换为 `textContent`，或使用安全的 Markdown 渲染库（如 `marked` + DOMPurify）。
2. 对后端返回的 LLM 内容在渲染前进行 HTML 转义或 sanitization。
3. 设置内容安全策略（CSP）以限制内联脚本执行。

---

### M-02：CORS 配置允许任意来源

**严重度**: 中危  
**组件**: 后端 Express 中间件  
**位置**: [backend/src/app.js:10](file:///workspace/backend/src/app.js#L10)

#### 攻击者画像
控制任意第三方网站的攻击者。

#### 可控输入向量
攻击者网站通过 JavaScript 向 `http://target:3001/api/generate/all` 发起跨域 POST 请求。

#### 端到端代码路径

1. [backend/src/app.js:10](file:///workspace/backend/src/app.js#L10) 全局启用无限制 CORS：
   ```javascript
   app.use(cors());
   ```
2. 受害者访问攻击者控制的网页，页面脚本自动调用后端生成接口。
3. 浏览器允许该跨域请求，后端消耗 DeepSeek API 配额。

#### 造成的影响
- **放大 API 滥用**：攻击者无需自己架设请求脚本，可利用大量访客浏览器分布式消耗 API 配额。
- **CSRF 类风险**：虽然请求为 JSON，但结合前端未做 CSRF 防护，可造成非预期资源消耗。

#### 修复建议
1. 将 CORS 限制为明确的前端域名：
   ```javascript
   app.use(cors({ origin: 'https://your-frontend-domain.com' }));
   ```
2. 如需本地开发，通过环境变量 `CORS_ORIGIN` 动态配置。
3. 对敏感写操作增加额外的 CSRF Token 或校验请求来源头。

---

## 低危 / 信息项（未纳入中等及以上确认漏洞）

| 编号 | 描述 | 原因 |
|------|------|------|
| L-01 | 错误信息直接返回给客户端 | 当前错误信息仅包含 API/通用错误，未泄露敏感路径或凭证，严重度低。 |
| L-02 | 无 TLS/HTTPS | 按 MVP/本地部署场景，TLS 通常由反向代理处理，未作为代码漏洞确认。 |
| L-03 | LLM 提示词注入 | 虽然存在提示注入可能，但当前系统无基于 LLM 输出的执行、访问控制或数据外发操作；影响主要被 XSS 覆盖，不再单独列为中危。 |

---

## 修复优先级建议

1. **立即处理**：H-01（未认证 API 滥用）—— 直接关联费用与可用性。
2. **尽快处理**：M-01（XSS）—— 影响用户安全与品牌。
3. **随后处理**：M-02（CORS）—— 与 H-01 配合可显著降低风险。

---

## 审计结论

本次审计确认了 **1 项高危漏洞和 2 项中危漏洞**，均具备从外部输入到实际影响的完整利用路径。建议优先为生成接口增加认证与速率限制，并替换前端不安全的 `innerHTML` 渲染方式。
