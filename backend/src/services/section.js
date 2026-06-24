const { callDeepSeek } = require('./ai');

async function generateSection(sectionTitle, project) {
  const prompt = `
请生成标书中"${sectionTitle}"章节的完整内容。

【项目信息】
公司: ${project.company}
项目: ${project.project}
项目类型: ${project.type || '物业管理'}

【要求】
1. 字数: 8000字以上
2. 语言: 正式、专业的投标用语
3. 结构: 包含背景、目标、流程、标准、执行细节
4. 内容: 具体、可操作、符合行业规范
5. 风险控制: 需要包含质量控制、安全措施、应急预案

请直接生成内容，不需要标题。
`;

  try {
    console.log(`📝 正在生成章节: ${sectionTitle}`);
    const content = await callDeepSeek(prompt, 4000);
    return content;
  } catch (error) {
    console.error(`❌ 章节生成失败 (${sectionTitle}):`, error.message);
    throw error;
  }
}

module.exports = { generateSection };
