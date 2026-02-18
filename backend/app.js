const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');

// 加载 JSON 数据
async function loadData(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`加载 ${filename} 失败:`, error.message);
    return null;
  }
}

// 保存 JSON 数据
async function saveData(filename, data) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`保存 ${filename} 失败:`, error.message);
    return false;
  }
}

// 生成 SQL 的提示词模板
const generateSQLPrompt = (query, dbSchema) => {
  return `你是一个专业的数据分析师，擅长将自然语言转换为 SQL 查询。

数据库结构：
${JSON.stringify(dbSchema, null, 2)}

用户查询：${query}

请生成对应的 SQL 查询语句，只返回 SQL 代码，不要其他解释。
SQL 应该使用 MySQL 语法。`;
};

// 生成数据洞察的提示词模板
const generateInsightPrompt = (query, sql, dataSummary) => {
  return `你是一个专业的数据分析师，请根据以下信息提供数据洞察：

用户查询：${query}
生成的 SQL：${sql}
数据摘要：${dataSummary}

请提供：
1. 数据趋势分析
2. 关键发现
3. 业务建议

用中文回答，控制在 100-150 字。`;
};

// 调用大模型 API (使用智谱 AI - 免费额度)
const callAI = async (prompt) => {
  try {
    const response = await axios.post('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      model: 'glm-4-flash', // 免费模型
      messages: [
        { role: 'system', content: '你是一个专业的数据分析师。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI API 调用失败:', error.message);
    return null;
  }
};

// 从 JSON 文件获取数据
const getDataFromJSON = async (sql) => {
  const sqlLower = sql.toLowerCase();
  const salesData = await loadData('sales.json');
  
  if (!salesData) {
    return null;
  }
  
  // 根据 SQL 关键词匹配数据
  if (sqlLower.includes('month') || sqlLower.includes('sales') || sqlLower.includes('销售额')) {
    return salesData.monthly_sales;
  }
  else if (sqlLower.includes('category') || sqlLower.includes('类别') || sqlLower.includes('分类')) {
    return salesData.category_sales;
  }
  else if (sqlLower.includes('product') || sqlLower.includes('产品') || sqlLower.includes('销量') || sqlLower.includes('top')) {
    return salesData.top_products;
  }
  else if (sqlLower.includes('city') || sqlLower.includes('城市') || sqlLower.includes('地区')) {
    return salesData.city_distribution;
  }
  else if (sqlLower.includes('age') || sqlLower.includes('年龄')) {
    return salesData.age_distribution;
  }
  else if (sqlLower.includes('status') || sqlLower.includes('状态')) {
    return salesData.order_status;
  }
  else if (sqlLower.includes('quarter') || sqlLower.includes('季度')) {
    return salesData.quarterly_sales;
  }
  else if (sqlLower.includes('payment') || sqlLower.includes('支付')) {
    return salesData.payment_methods;
  }
  
  // 默认返回月度销售数据
  return salesData.monthly_sales;
};

// 数据分析 API
app.post('/api/analyze', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: '查询内容不能为空' });
    }
    
    // 加载数据库结构
    const dbData = await loadData('database.json');
    const dbSchema = dbData ? dbData.tables : {};
    
    // 生成 SQL
    const sqlPrompt = generateSQLPrompt(query, dbSchema);
    const sql = await callAI(sqlPrompt);
    
    if (!sql) {
      return res.status(500).json({ error: '生成 SQL 失败' });
    }
    
    // 从 JSON 文件获取数据
    const chartData = await getDataFromJSON(sql);
    
    if (!chartData) {
      return res.status(500).json({ error: '获取数据失败' });
    }
    
    // 生成数据洞察
    const dataSummary = JSON.stringify(chartData.datasets[0].data.slice(0, 5));
    const insightPrompt = generateInsightPrompt(query, sql, dataSummary);
    const insight = await callAI(insightPrompt) || '数据分析完成，建议关注关键指标变化趋势。';
    
    res.json({
      sql: sql,
      data: chartData,
      insight: insight
    });
    
  } catch (error) {
    console.error('分析失败:', error);
    res.status(500).json({ error: '分析失败: ' + error.message });
  }
});

// 获取所有数据 API
app.get('/api/data', async (req, res) => {
  try {
    const salesData = await loadData('sales.json');
    res.json(salesData);
  } catch (error) {
    res.status(500).json({ error: '获取数据失败' });
  }
});

// 获取数据库结构 API
app.get('/api/schema', async (req, res) => {
  try {
    const dbData = await loadData('database.json');
    res.json(dbData ? dbData.tables : {});
  } catch (error) {
    res.status(500).json({ error: '获取数据库结构失败' });
  }
});

// 更新数据 API
app.put('/api/data/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const newData = req.body;
    
    const salesData = await loadData('sales.json');
    if (!salesData) {
      return res.status(500).json({ error: '加载数据失败' });
    }
    
    salesData[key] = newData;
    const saved = await saveData('sales.json', salesData);
    
    if (saved) {
      res.json({ message: '数据更新成功', data: newData });
    } else {
      res.status(500).json({ error: '保存数据失败' });
    }
  } catch (error) {
    res.status(500).json({ error: '更新数据失败: ' + error.message });
  }
});

// 添加新数据 API
app.post('/api/data/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const newData = req.body;
    
    const salesData = await loadData('sales.json') || {};
    salesData[key] = newData;
    
    const saved = await saveData('sales.json', salesData);
    
    if (saved) {
      res.json({ message: '数据添加成功', data: newData });
    } else {
      res.status(500).json({ error: '保存数据失败' });
    }
  } catch (error) {
    res.status(500).json({ error: '添加数据失败: ' + error.message });
  }
});

// 删除数据 API
app.delete('/api/data/:key', async (req, res) => {
  try {
    const { key } = req.params;
    
    const salesData = await loadData('sales.json');
    if (!salesData || !salesData[key]) {
      return res.status(404).json({ error: '数据不存在' });
    }
    
    delete salesData[key];
    const saved = await saveData('sales.json', salesData);
    
    if (saved) {
      res.json({ message: '数据删除成功' });
    } else {
      res.status(500).json({ error: '保存数据失败' });
    }
  } catch (error) {
    res.status(500).json({ error: '删除数据失败: ' + error.message });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'DataInsight AI 后端服务运行中',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`DataInsight AI 后端服务运行在 http://localhost:${PORT}`);
  console.log(`数据目录: ${DATA_DIR}`);
});
