<script setup>
import { ref } from 'vue'

const emit = defineEmits(['result'])

const query = ref('')
const loading = ref(false)
const error = ref('')

const sampleQueries = [
  '查询2024年各月份的销售额',
  '统计每个产品类别的平均价格',
  '找出销量最高的前10个产品',
  '计算2024年每个季度的总收入'
]

// 调用后端 API
const submitQuery = async () => {
  if (!query.value.trim()) return
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: query.value })
    })
    
    if (!response.ok) {
      throw new Error('请求失败')
    }
    
    const result = await response.json()
    emit('result', {
      query: query.value,
      ...result
    })
  } catch (err) {
    error.value = '请求失败，请确保后端服务已启动 (npm start in backend folder)'
    // 如果后端不可用，使用模拟数据
    const mockResult = generateMockResult(query.value)
    emit('result', {
      query: query.value,
      ...mockResult
    })
  } finally {
    loading.value = false
  }
}

// 备用：模拟数据生成
const generateMockResult = (q) => {
  if (q.includes('销售') || q.includes('收入')) {
    return {
      sql: `SELECT DATE_FORMAT(order_date, '%Y-%m') as month, SUM(amount) as total_sales\nFROM orders\nWHERE YEAR(order_date) = 2024\nGROUP BY month\nORDER BY month;`,
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
      sql: `SELECT category, AVG(price) as avg_price, COUNT(*) as product_count\nFROM products\nGROUP BY category\nORDER BY avg_price DESC;`,
      data: {
        type: 'bar',
        labels: ['电子产品', '家居用品', '服装配饰', '食品饮料', '图书文具'],
        datasets: [{
          label: '平均价格（元）',
          data: [2580, 680, 420, 85, 45],
          backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe']
        }]
      },
      insight: '电子产品类别平均价格最高（2580元），但数量相对较少。建议优化中低价位产品线以提升销量。'
    }
  } else {
    return {
      sql: `SELECT product_name, SUM(quantity) as total_quantity\nFROM order_items\nGROUP BY product_name\nORDER BY total_quantity DESC\nLIMIT 10;`,
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
</script>

<template>
  <div class="query-section">
    <div class="input-area">
      <textarea
        v-model="query"
        placeholder="请输入你的数据分析问题，例如：查询2024年各月份的销售额"
        @keydown.enter.prevent="submitQuery"
        :disabled="loading"
      ></textarea>
      <button 
        @click="submitQuery" 
        :disabled="loading || !query.trim()"
        class="submit-btn"
      >
        <span v-if="loading" class="loading-spinner"></span>
        <span v-else>🚀 分析</span>
      </button>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div class="sample-queries">
      <p>💡 试试这些问题：</p>
      <div class="query-tags">
        <span
          v-for="(q, index) in sampleQueries"
          :key="index"
          @click="query = q"
          class="query-tag"
        >
          {{ q }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.query-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.input-area {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

textarea {
  flex: 1;
  min-height: 80px;
  padding: 16px;
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  font-size: 15px;
  resize: vertical;
  transition: all 0.3s;
  font-family: inherit;
}

textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

textarea:disabled {
  background: #f5f7fa;
  cursor: not-allowed;
}

.submit-btn {
  padding: 0 32px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  color: #f56c6c;
  background: #fef0f0;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
}

.sample-queries {
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
}

.sample-queries p {
  color: #606266;
  font-size: 14px;
  margin-bottom: 12px;
}

.query-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.query-tag {
  padding: 8px 16px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 20px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s;
}

.query-tag:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}
</style>
