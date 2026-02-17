<script setup>
defineProps({
  history: Array
})
</script>

<template>
  <div class="query-history-card">
    <h3 class="card-title">📜 查询历史</h3>
    
    <div v-if="history.length === 0" class="empty-history">
      <p>暂无查询记录</p>
    </div>
    
    <div v-else class="history-list">
      <div
        v-for="item in history"
        :key="item.id"
        class="history-item"
      >
        <p class="history-query">{{ item.query }}</p>
        <span class="history-time">{{ item.timestamp }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.query-history-card {
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

.empty-history {
  text-align: center;
  padding: 30px;
  color: #999;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.history-item {
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.history-query {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 6px;
  line-height: 1.4;
}

.history-time {
  font-size: 0.75rem;
  color: #999;
}
</style>
