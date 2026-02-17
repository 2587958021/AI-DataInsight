<script setup>
import { computed } from 'vue'

const props = defineProps({
  result: Object
})

const hasResult = computed(() => props.result !== null)
</script>

<template>
  <div class="result-display">
    <div v-if="!hasResult" class="empty-state">
      <DataInfo />
    </div>

    <div v-else class="result-content">
      <div class="result-section">
        <h4 class="section-title">📝 生成的 SQL</h4>
        <pre class="sql-code"><code>{{ result.sql }}</code></pre>
      </div>

      <div class="result-section">
        <h4 class="section-title">📈 数据可视化</h4>
        <div class="chart-container">
          <ChartDisplay :data="result.data" />
        </div>
      </div>

      <div class="result-section insight-section">
        <h4 class="section-title">💡 AI 数据洞察</h4>
        <p class="insight-text">{{ result.insight }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import ChartDisplay from './ChartDisplay.vue'
import DataInfo from './DataInfo.vue'

export default {
  components: {
    ChartDisplay,
    DataInfo
  }
}
</script>

<style scoped>
.result-display {
  padding: 30px;
  height: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  text-align: center;
  color: #666;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #333;
}

.empty-state p {
  max-width: 400px;
  line-height: 1.6;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.result-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.sql-code {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}

.chart-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  min-height: 300px;
}

.insight-section {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border-left: 4px solid #667eea;
}

.insight-text {
  color: #555;
  line-height: 1.8;
  font-size: 1rem;
}
</style>
