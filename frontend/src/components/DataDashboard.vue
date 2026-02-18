<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

const charts = ref({})

const chartConfigs = [
  {
    id: 'monthlySales',
    title: '月度销售额趋势',
    type: 'line',
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      datasets: [{
        label: '销售额（万元）',
        data: [125, 118, 142, 156, 168, 185, 192, 178, 195, 210, 245, 268],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true
      }]
    }
  },
  {
    id: 'categorySales',
    title: '产品类别销售分析',
    type: 'bar',
    data: {
      labels: ['智能手机', '笔记本', '平板', '智能手表', '耳机', '智能家居'],
      datasets: [{
        label: '销售额（万元）',
        data: [856, 642, 385, 298, 425, 312],
        backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']
      }]
    }
  },
  {
    id: 'cityDistribution',
    title: '用户城市分布',
    type: 'doughnut',
    data: {
      labels: ['北京', '上海', '广州', '深圳', '杭州', '其他'],
      datasets: [{
        data: [2850, 2620, 1980, 2240, 1680, 3620],
        backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#e4e7ed']
      }]
    }
  },
  {
    id: 'orderStatus',
    title: '订单状态统计',
    type: 'pie',
    data: {
      labels: ['已完成', '待发货', '配送中', '已取消', '退款中'],
      datasets: [{
        data: [15280, 2340, 1890, 680, 420],
        backgroundColor: ['#43e97b', '#4facfe', '#667eea', '#f5576c', '#fa709a']
      }]
    }
  }
]

onMounted(() => {
  chartConfigs.forEach(config => {
    const ctx = document.getElementById(config.id)
    if (ctx) {
      charts.value[config.id] = new Chart(ctx, {
        type: config.type,
        data: config.data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 15,
                font: { size: 12 }
              }
            },
            title: {
              display: true,
              text: config.title,
              font: { size: 14, weight: 'bold' },
              padding: 15
            }
          },
          scales: config.type === 'doughnut' || config.type === 'pie' ? {} : {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(0,0,0,0.05)' }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      })
    }
  })
})
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h2>📊 数据仪表盘</h2>
      <p>实时数据可视化，直观展示业务关键指标</p>
    </div>
    
    <div class="charts-grid">
      <div v-for="config in chartConfigs" :key="config.id" class="chart-card">
        <div class="chart-container">
          <canvas :id="config.id"></canvas>
        </div>
      </div>
    </div>
    
    <!-- 数据表格 -->
    <div class="data-table-section">
      <h3>📋 热销产品 TOP10</h3>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>排名</th>
              <th>产品名称</th>
              <th>销量</th>
              <th>销售额</th>
              <th>增长率</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in [
              { name: 'iPhone 15 Pro', sales: 3250, amount: '¥1,298万', growth: '+25%' },
              { name: 'AirPods Pro 2', sales: 2890, amount: '¥289万', growth: '+18%' },
              { name: 'MacBook Air M3', sales: 2180, amount: '¥1,090万', growth: '+32%' },
              { name: 'Switch OLED', sales: 2150, amount: '¥430万', growth: '+15%' },
              { name: '小米14 Ultra', sales: 2340, amount: '¥702万', growth: '+28%' },
              { name: 'iPad Pro 12.9', sales: 1650, amount: '¥660万', growth: '+12%' },
              { name: '索尼WH-1000XM5', sales: 1680, amount: '¥252万', growth: '+8%' },
              { name: 'iPad Air 5', sales: 1890, amount: '¥378万', growth: '+20%' },
              { name: '华为Mate 60', sales: 1980, amount: '¥594万', growth: '+45%' },
              { name: '戴森吸尘器', sales: 1420, amount: '¥284万', growth: '+10%' }
            ]" :key="index">
              <td class="rank">{{ index + 1 }}</td>
              <td class="product-name">{{ product.name }}</td>
              <td>{{ product.sales.toLocaleString() }} 件</td>
              <td class="amount">{{ product.amount }}</td>
              <td class="growth">{{ product.growth }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.dashboard-header {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.dashboard-header h2 {
  font-size: 20px;
  color: #303133;
  margin-bottom: 8px;
}

.dashboard-header p {
  color: #909399;
  font-size: 14px;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.chart-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.chart-container {
  height: 300px;
  position: relative;
}

.data-table-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.data-table-section h3 {
  font-size: 18px;
  color: #303133;
  margin-bottom: 16px;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e4e7ed;
}

th {
  background: #f5f7fa;
  font-weight: 600;
  color: #606266;
  font-size: 14px;
}

td {
  color: #303133;
  font-size: 14px;
}

.rank {
  font-weight: 700;
  color: #667eea;
}

.product-name {
  font-weight: 500;
}

.amount {
  color: #67c23a;
  font-weight: 600;
}

.growth {
  color: #67c23a;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
