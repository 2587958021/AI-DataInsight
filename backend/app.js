const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// 模拟数据库表结构
const dbSchema = {
  tables: {
    orders: {
      columns: ['id', 'user_id', 'product_id', 'quantity', 'amount', 'order_date', 'status'],
      description: '订单表，存储所有订单信息'
    },
    products: {
      columns: ['id', 'name', 'category', 'price', 'stock', 'created_at'],
      description: '产品表，存储产品信息'
    },
    users: {
      columns: ['id', 'name', 'email', 'age', 'city', 'register_date'],
      description: '用户表，存储用户信息'
    }
  }
};

// 生成 SQL 的提示词模板
const generateSQLPrompt = (query) => {
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

// 模拟数据生成 - 丰富的数据集
const generateMockData = (sql) => {
  const sqlLower = sql.toLowerCase();
  
  // 1. 月度销售数据（12个月）
  if (sqlLower.includes('month') || sqlLower.includes('sales') || sqlLower.includes('销售额')) {
    return {
      type: 'line',
      labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      datasets: [{
        label: '销售额（万元）',
        data: [125, 118, 142, 156, 168, 185, 192, 178, 195, 210, 245, 268],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4
      }]
    };
  }
  
  // 2. 产品类别分析
  else if (sqlLower.includes('category') || sqlLower.includes('类别') || sqlLower.includes('分类')) {
    return {
      type: 'bar',
      labels: ['智能手机', '笔记本电脑', '平板电脑', '智能手表', '无线耳机', '智能家居', '数码配件', '摄影器材'],
      datasets: [{
        label: '销售额（万元）',
        data: [856, 642, 385, 298, 425, 312, 186, 245],
        backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#fa709a']
      }]
    };
  }
  
  // 3. 热销产品排行
  else if (sqlLower.includes('product') || sqlLower.includes('产品') || sqlLower.includes('销量') || sqlLower.includes('top')) {
    return {
      type: 'bar',
      labels: ['iPhone 15 Pro', 'MacBook Air M3', 'AirPods Pro 2', 'iPad Pro 12.9', '小米14 Ultra', '华为Mate 60', '戴森吸尘器', '索尼WH-1000XM5', 'Switch OLED', 'iPad Air 5'],
      datasets: [{
        label: '销量（件）',
        data: [3250, 2180, 2890, 1650, 2340, 1980, 1420, 1680, 2150, 1890],
        backgroundColor: '#667eea'
      }]
    };
  }
  
  // 4. 用户城市分布
  else if (sqlLower.includes('city') || sqlLower.includes('城市') || sqlLower.includes('地区')) {
    return {
      type: 'pie',
      labels: ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京', '其他'],
      datasets: [{
        label: '用户数量',
        data: [2850, 2620, 1980, 2240, 1680, 1420, 1180, 980, 1150, 2890],
        backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#feca57', '#ff9ff3']
      }]
    };
  }
  
  // 5. 用户年龄分布
  else if (sqlLower.includes('age') || sqlLower.includes('年龄')) {
    return {
      type: 'bar',
      labels: ['18-24岁', '25-30岁', '31-35岁', '36-40岁', '41-45岁', '46-50岁', '50岁以上'],
      datasets: [{
        label: '用户数量',
        data: [4250, 6820, 5680, 3240, 2180, 1650, 890],
        backgroundColor: '#764ba2'
      }]
    };
  }
  
  // 6. 订单状态统计
  else if (sqlLower.includes('status') || sqlLower.includes('状态')) {
    return {
      type: 'doughnut',
      labels: ['已完成', '待发货', '配送中', '已取消', '退款中'],
      datasets: [{
        label: '订单数量',
        data: [15280, 2340, 1890, 680, 420],
        backgroundColor: ['#43e97b', '#4facfe', '#667eea', '#f5576c', '#fa709a']
      }]
    };
  }
  
  // 7. 季度销售对比
  else if (sqlLower.includes('quarter') || sqlLower.includes('季度')) {
    return {
      type: 'bar',
      labels: ['2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4'],
      datasets: [{
        label: '销售额（万元）',
        data: [385, 509, 565, 723],
        backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c']
      }]
    };
  }
  
  // 8. 支付方式分布
  else if (sqlLower.includes('payment') || sqlLower.includes('支付')) {
    return {
      type: 'pie',
      labels: ['微信支付', '支付宝', '银行卡', '信用卡', '花呗分期'],
      datasets: [{
        label: '支付笔数',
        data: [8920, 7560, 2340, 1890, 1240],
        backgroundColor: ['#43e97b', '#4facfe', '#667eea', '#f5576c', '#fa709a']
      }]
    };
  }
  
  // 默认：热销产品
  else {
    return {
      type: 'bar',
      labels: ['iPhone 15 Pro', 'MacBook Air M3', 'AirPods Pro 2', 'iPad Pro 12.9', '小米14 Ultra', '华为Mate 60', '戴森吸尘器', '索尼WH-1000XM5', 'Switch OLED', 'iPad Air 5'],
      datasets: [{
        label: '销量（件）',
        data: [3250, 2180, 2890, 1650, 2340, 1980, 1420, 1680, 2150, 1890],
        backgroundColor: '#667eea'
      }]
    };
  }
};

// 分析接口
app.post('/api/analyze', async (req, res) => {
  const { query } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: '查询内容不能为空' });
  }
  
  try {
    // 1. 生成 SQL
    const sqlPrompt = generateSQLPrompt(query);
    let sql = await callAI(sqlPrompt);
    
    // 如果 AI 调用失败，使用默认 SQL
    if (!sql) {
      sql = `SELECT * FROM orders WHERE order_date >= '2024-01-01' LIMIT 100;`;
    }
    
    // 清理 SQL (移除 markdown 代码块标记)
    sql = sql.replace(/```sql\n?/g, '').replace(/```\n?/g, '').trim();
    
    // 2. 生成模拟数据
    const chartData = generateMockData(sql);
    
    // 3. 生成数据洞察
    const dataSummary = `数据集包含 ${chartData.labels.length} 个类别，主要数值范围在 ${Math.min(...chartData.datasets[0].data)} 到 ${Math.max(...chartData.datasets[0].data)} 之间`;
    const insightPrompt = generateInsightPrompt(query, sql, dataSummary);
    let insight = await callAI(insightPrompt);
    
    // 如果 AI 调用失败，使用默认洞察
    if (!insight) {
      insight = '数据显示了明显的趋势特征。建议关注关键指标变化，优化业务策略以提升整体表现。';
    }
    
    res.json({
      query,
      sql,
      data: chartData,
      insight
    });
    
  } catch (error) {
    console.error('分析失败:', error);
    res.status(500).json({ error: '分析过程出错', message: error.message });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`DataInsight AI 后端服务运行在 http://localhost:${PORT}`);
});
