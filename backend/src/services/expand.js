const { callDeepSeek } = require('./ai');

async function expandContent(content, context = '') {
  const prompt = `
请扩写以下内容，目标是增加5倍长度，同时保持内容质量和逻辑一致。

${context ? `【背景信息】\n${context}\n` : ''}
【原始内容】
${content}

【扩写要求】
1. 增加详细的执行步骤和流程
2. 补充具体的标准和规范
3. 添加风险控制和应急预案
4. 包含检查机制和验收标准
5. 加入案例说明和最佳实践
6. 确保内容专业、正式、完整

请直接返回扩写后的内容。
`;

  try {
    console.log('🔄 正在扩写内容...');
    const expandedContent = await callDeepSeek(prompt, 4000);
    return expandedContent;
  } catch (error) {
    console.error('❌ 内容扩写失败:', error.message);
    throw error;
  }
}

module.exports = { expandContent };
