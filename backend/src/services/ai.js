const axios = require('axios');

const API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

if (!API_KEY) {
  console.error('❌ 错误: 未设置 DEEPSEEK_API_KEY');
  console.error('请在 backend/.env 中配置 DEEPSEEK_API_KEY');
}

async function callDeepSeek(prompt, maxTokens = 4000) {
  try {
    console.log('🤖 调用DeepSeek API...');
    
    const response = await axios.post(
      API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是中国顶级招投标专家，擅长政府级物业标书写作。请用专业、正式的语言生成标书内容。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: maxTokens,
        top_p: 0.95
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    const content = response.data.choices[0].message.content;
    console.log('✅ DeepSeek API 调用成功');
    return content;
  } catch (error) {
    if (error.response) {
      console.error('❌ API 错误:', error.response.status, error.response.data);
      throw new Error(`API错误: ${error.response.data.error?.message || '未知错误'}`);
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('API 请求超时，请重试');
    } else {
      console.error('❌ 错误:', error.message);
      throw error;
    }
  }
}

module.exports = { callDeepSeek };
