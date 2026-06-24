const { callDeepSeek } = require('./ai');

async function generateOutline(project) {
  const prompt = `
请生成物业/政府招投标文件的完整目录结构。

【项目信息】
公司名称: ${project.company}
项目名称: ${project.project}
项目类型: ${project.type || '物业管理服务'}

【要求】
1. 生成9大一级章节
2. 每个章节包含3-5个二级小节
3. 结构要符合政府招投标规范
4. 返回JSON格式

返回格式:
{
  "sections": [
    {
      "id": 1,
      "title": "第一章 XX",
      "subsections": [
        {"id": "1.1", "title": "1.1 XXX"},
        {"id": "1.2", "title": "1.2 XXX"}
      ]
    }
  ]
}
`;

  try {
    const response = await callDeepSeek(prompt, 3000);
    
    // 解析 JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('无法解析生成的目录结构');
    }
    
    const outline = JSON.parse(jsonMatch[0]);
    console.log(`✅ 目录生成成功: ${outline.sections.length} 个章节`);
    return outline;
  } catch (error) {
    console.error('❌ 目录生成失败:', error.message);
    throw error;
  }
}

module.exports = { generateOutline };
