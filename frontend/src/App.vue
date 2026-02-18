<script setup>
import { ref, onMounted } from 'vue'
import QueryInput from './components/QueryInput.vue'
import ResultDisplay from './components/ResultDisplay.vue'
import QueryHistory from './components/QueryHistory.vue'
import DataDashboard from './components/DataDashboard.vue'

const currentResult = ref(null)
const queryHistory = ref([])
const activeTab = ref('dashboard')

const handleQueryResult = (result) => {
  currentResult.value = result
  queryHistory.value.unshift({
    id: Date.now(),
    query: result.query,
    timestamp: new Date().toLocaleString()
  })
  activeTab.value = 'analysis'
}

// 快速统计数据
const stats = ref([
  { label: '总销售额', value: '¥2,182万', change: '+23.5%', up: true },
  { label: '订单总数', value: '20,610', change: '+15.2%', up: true },
  { label: '用户数量', value: '18,990', change: '+8.7%', up: true },
  { label: '平均客单价', value: '¥1,058', change: '+5.3%', up: true }
])
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">📊</div>
          <div>
            <h1 class="logo">DataInsight AI</h1>
            <p class="subtitle">智能数据分析平台 - 用自然语言探索数据</p>
          </div>
        </div>
        <nav class="nav-tabs">
          <button 
            :class="['nav-tab', { active: activeTab === 'dashboard' }]"
            @click="activeTab = 'dashboard'"
          >
            📈 数据概览
          </button>
          <button 
            :class="['nav-tab', { active: activeTab === 'analysis' }]"
            @click="activeTab = 'analysis'"
          >
            🔍 智能分析
          </button>
        </nav>
      </div>
    </header>

    <main class="main">
      <!-- 数据概览页 -->
      <div v-if="activeTab === 'dashboard'" class="dashboard-page">
        <!-- 统计卡片 -->
        <div class="stats-grid">
          <div v-for="(stat, index) in stats" :key="index" class="stat-card">
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-value">{{ stat.value }}</div>
            <div :class="['stat-change', stat.up ? 'up' : 'down']">
              {{ stat.up ? '↑' : '↓' }} {{ stat.change }}
            </div>
          </div>
        </div>
        
        <!-- 数据仪表盘 -->
        <DataDashboard />
      </div>

      <!-- 智能分析页 -->
      <div v-else class="analysis-page">
        <div class="left-panel">
          <QueryInput @result="handleQueryResult" />
          <QueryHistory :history="queryHistory" />
        </div>
        <div class="right-panel">
          <ResultDisplay :result="currentResult" />
        </div>
      </div>
    </main>

    <footer class="footer">
      <p>© 2024 DataInsight AI | 开发者：吴叶龙 | 基于 Vue3 + Node.js + 智谱AI</p>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f5f7fa;
  min-height: 100vh;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 0;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-icon {
  font-size: 48px;
}

.logo {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
}

.nav-tabs {
  display: flex;
  gap: 12px;
}

.nav-tab {
  padding: 10px 24px;
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-tab:hover {
  background: rgba(255,255,255,0.3);
}

.nav-tab.active {
  background: white;
  color: #667eea;
}

.main {
  flex: 1;
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* 仪表盘页 */
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 8px;
}

.stat-change {
  font-size: 13px;
  font-weight: 600;
}

.stat-change.up {
  color: #67c23a;
}

.stat-change.down {
  color: #f56c6c;
}

/* 分析页 */
.analysis-page {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 20px;
}

.left-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-panel {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  min-height: 600px;
}

.footer {
  background: white;
  padding: 20px;
  text-align: center;
  color: #909399;
  font-size: 14px;
  border-top: 1px solid #e4e7ed;
}

@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .analysis-page {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-tabs {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
