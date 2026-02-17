<script setup>
import { ref } from 'vue'
import QueryInput from './components/QueryInput.vue'
import ResultDisplay from './components/ResultDisplay.vue'
import QueryHistory from './components/QueryHistory.vue'

const currentResult = ref(null)
const queryHistory = ref([])

const handleQueryResult = (result) => {
  currentResult.value = result
  queryHistory.value.unshift({
    id: Date.now(),
    query: result.query,
    timestamp: new Date().toLocaleString()
  })
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1 class="logo">DataInsight AI</h1>
      <p class="subtitle">智能数据分析平台 - 用自然语言探索数据</p>
    </header>

    <main class="main">
      <div class="left-panel">
        <QueryInput @result="handleQueryResult" />
        <QueryHistory :history="queryHistory" />
      </div>
      <div class="right-panel">
        <ResultDisplay :result="currentResult" />
      </div>
    </main>
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.app {
  min-height: 100vh;
  padding: 20px;
}

.header {
  text-align: center;
  padding: 30px 0;
  color: white;
}

.logo {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.main {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.left-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-panel {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  min-height: 600px;
}

@media (max-width: 1024px) {
  .main {
    grid-template-columns: 1fr;
  }
}
</style>
