<script setup>
import { ref } from 'vue'

const emit = defineEmits(['result'])

const query = ref('')
const loading = ref(false)

const sampleQueries = [
  '查询2024年各月份的销售额',
  '统计每个产品类别的平均价格',
  '找出销量最高的前10个产品',
  '计算2024年每个季度的总收入'
]

// 纯前端版本 - 使用模拟数据
const submitQuery = async () => {
  if (!query.value.trim()) return
  
  loading.value = true
  
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // 生成模拟结果
  const mockResult = generateMockResult(query.value)
  emit('result', {
    query: query.value,
    ...mockResult
  })
  
  loading.value = false
}

const generateMockResult = (q) => {
  // 根据查询内容生成模拟结果
  if (q.includes('销售') || q.includes('收入')) {
    return {
      sql: `SELECT DATE_FORMAT(order_date, '%Y-%m') as month, SUM(amount) as total_sales
FROM orders
WHERE YEAR(order_date) = 2024
GROUP BY month
ORDER BY month;`,
      data: {
        type: 'line',
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [{
          label: '销售额（万元）',
          data: [120, 135, 158, 142, 168, 185],
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4
        }]
      },
      insight: '销售额呈现稳步上升趋势，6月达到峰值185万元，环比增长10.1%。建议关注增长驱动因素并制定下半年策略。'
    }
  } else if (q.includes('产品') || q.includes('类别')) {
    return {
      sql: `SELECT category, AVG(price) as avg_price, COUNT(*) as product_count
FROM products
GROUP BY category
ORDER BY avg_price DESC;`,
      data: {
        type: 'bar',
        labels: ['电子产品', '家居用品', '服装配饰', '食品饮料', '图书文具'],
        datasets: [{
          label: '平均价格（元）',
          data: [2580, 680, 420, 85, 45],
          backgroundColor: [
            '#667eea',
            '#764ba2',
            '#f093fb',
            '#f5576c',
            '#4facfe'
          ]
        }]
      },
      insight: '电子产品类别平均价格最高（2580元），但数量相对较少。建议优化中低价位产品线以提升销量。'
    }
  } else {
    return {
      sql: `SELECT product_name, SUM(quantity) as total_quantity
FROM order_items
GROUP BY product_name
ORDER BY total_quantity DESC
LIMIT 10;`,
      data: {
        type: 'bar',
        labels: ['iPhone 15', 'AirPods Pro', 'iPad Air', 'MacBook Air', '小米14', '华为P60', '戴森吸尘器', '索尼耳机', 'Switch游戏机', 'Kindle'],
        datasets: [{
          label: '销量（件）',
          data: [1250, 980, 856, 742, 698, 654, 589, 523, 487, 445],
          backgroundColor: '#667eea'
        }]
      },
      insight: 'iPhone 15 销量遥遥领先，数码产品整体表现强劲。建议增加热门产品库存并优化供应链响应速度。'
    }
  }
}

const useSample = (sample) => {
  query.value = sample
}
</script>

<template>
  <div class="query-input-card">
    <h3 class="card-title">💡 输入你的数据问题</h3>
    
    <div class="input-area">
      <textarea
        v-model="query"
        class="query-textarea"
        placeholder="例如：查询2024年各月份的销售额..."
        rows="4"
        @keydown.enter.prevent="submitQuery"
      ></textarea>
      
      <button
        class="submit-btn"
        :disabled="loading || !query.trim()"
        @click="submitQuery"
      >
        <span v-if="loading" class="loading-spinner"></span>
        <span v-else>🚀 分析数据</span>
      </button>
    </div>

    <div class="sample-queries">
      <p class="sample-title">💡 试试这些示例：</p>
      <div class="sample-tags">
        <span
          v-for="sample in sampleQueries"
          :key="sample"
          class="sample-tag"
          @click="useSample(sample)"
        >
          {{ sample }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.query-input-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.input-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.query-textarea {
  width: 100%;
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.3s;
  font-family: inherit;
}

.query-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.submit-btn {
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.sample-queries {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.sample-title {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 12px;
}

.sample-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sample-tag {
  padding: 8px 14px;
  background: #f5f5f5;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #555;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.sample-tag:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}
</style>
