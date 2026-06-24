const express = require('express');
const router = express.Router();

const { generateOutline } = require('../services/outline');
const { generateSection } = require('../services/section');
const { expandContent } = require('../services/expand');
const { reviewContent } = require('../services/review');

// 生成完整标书
router.post('/all', async (req, res) => {
  try {
    const project = req.body;
    
    console.log('\n📋 开始生成标书');
    console.log(`公司: ${project.company}`);
    console.log(`项目: ${project.project}\n`);

    // Step 1: 生成目录
    console.log('Step 1/4: 生成目录结构...');
    const outline = await generateOutline(project);
    
    // Step 2: 生成各章节内容
    console.log('Step 2/4: 生成章节内容...');
    let fullContent = `# ${project.project}招投标文件\n\n`;
    fullContent += `**投标单位**: ${project.company}\n`;
    fullContent += `**项目类型**: ${project.type || '物业管理'}\n\n`;
    
    for (let i = 0; i < outline.sections.length; i++) {
      const section = outline.sections[i];
      console.log(`  [${i + 1}/${outline.sections.length}] ${section.title}`);
      
      const sectionContent = await generateSection(section.title, project);
      fullContent += `\n\n## ${section.title}\n\n${sectionContent}`;
      
      // 避免API限流
      if (i < outline.sections.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Step 3: 扩写内容（可选）
    console.log('Step 3/4: 优化内容...');
    // const expandedContent = await expandContent(fullContent.substring(0, 2000), project.project);
    
    // Step 4: 审查内容
    console.log('Step 4/4: 审查质量...');
    const reviewResult = await reviewContent(fullContent);
    
    const wordCount = fullContent.length;
    
    console.log('\n✅ 标书生成完成！');
    console.log(`📊 统计: ${outline.sections.length} 章节, 约 ${Math.ceil(wordCount / 3)} 字\n`);
    
    res.json({
      success: true,
      content: fullContent,
      outline: outline,
      review: reviewResult,
      metadata: {
        company: project.company,
        project: project.project,
        sections: outline.sections.length,
        estimatedWords: Math.ceil(wordCount / 3),
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ 生成失败:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 只生成目录
router.post('/outline', async (req, res) => {
  try {
    const project = req.body;
    const outline = await generateOutline(project);
    res.json({ success: true, outline });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 生成单个章节
router.post('/section', async (req, res) => {
  try {
    const { sectionTitle, project } = req.body;
    const content = await generateSection(sectionTitle, project);
    res.json({ success: true, content });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
