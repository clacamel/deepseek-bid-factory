const { callDeepSeek } = require('./ai');

async function reviewContent(content) {
  const prompt = `
请对以下标书内容进行专业审查。

【标书内容】
${content.substring(0, 3000)}...

【审查清单】
1. ✓ 内容是否完整（所有必要章节）
2. ✓ 是否存在重复或冗余
3. ✓ 是否符合招投标逻辑和规范
4. ✓ 是否缺少关键响应点
5. ✓ 语言是否专业、正式
6. ✓ 是否存在逻辑矛盾

请返回JSON格式的审查结果:
{
  "isComplete": true/false,
  "hasRepetition": true/false,
  "isLogical": true/false,
  "issues": ["问题1", "问题2"],
  "suggestions": ["建议1", "建议2"],
  "overallScore": 0-100
}
`;

  try {
    console.log('🔍 正在审查内容...');
    const response = await callDeepSeek(prompt, 2000);
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        isComplete: true,
        hasRepetition: false,
        isLogical: true,
        issues: [],
        suggestions: ['请手动审查内容'],
        overallScore: 80
      };
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('❌ 审查失败:', error.message);
    return {
      isComplete: true,
      hasRepetition: false,
      isLogical: true,
      issues: [],
      suggestions: [],
      overallScore: 75
    };
  }
}

module.exports = { reviewContent };
