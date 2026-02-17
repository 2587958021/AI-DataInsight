<script setup>
const tables = [
  {
    name: 'orders (订单表)',
    description: '存储所有订单信息',
    columns: [
      { name: 'id', type: 'INT', desc: '订单ID' },
      { name: 'user_id', type: 'INT', desc: '用户ID' },
      { name: 'product_id', type: 'INT', desc: '产品ID' },
      { name: 'quantity', type: 'INT', desc: '数量' },
      { name: 'amount', type: 'DECIMAL', desc: '金额' },
      { name: 'order_date', type: 'DATE', desc: '订单日期' },
      { name: 'status', type: 'VARCHAR', desc: '状态' }
    ]
  },
  {
    name: 'products (产品表)',
    description: '存储产品信息',
    columns: [
      { name: 'id', type: 'INT', desc: '产品ID' },
      { name: 'name', type: 'VARCHAR', desc: '产品名称' },
      { name: 'category', type: 'VARCHAR', desc: '类别' },
      { name: 'price', type: 'DECIMAL', desc: '价格' },
      { name: 'stock', type: 'INT', desc: '库存' },
      { name: 'created_at', type: 'DATE', desc: '创建时间' }
    ]
  },
  {
    name: 'users (用户表)',
    description: '存储用户信息',
    columns: [
      { name: 'id', type: 'INT', desc: '用户ID' },
      { name: 'name', type: 'VARCHAR', desc: '姓名' },
      { name: 'email', type: 'VARCHAR', desc: '邮箱' },
      { name: 'age', type: 'INT', desc: '年龄' },
      { name: 'city', type: 'VARCHAR', desc: '城市' },
      { name: 'register_date', type: 'DATE', desc: '注册日期' }
    ]
  }
]

const sampleQuestions = [
  '查询2024年各月份的销售额',
  '统计每个产品类别的平均价格',
  '找出销量最高的前10个产品',
  '计算2024年每个季度的总收入',
  '查询北京用户的平均年龄',
  '统计每个城市的用户数量'
]
</script>

<template>
  <div class="data-info">
    <h3 class="info-title">📊 演示数据说明</h3>
    
    <div class="info-section">
      <p class="info-desc">
        当前为演示环境，使用模拟电商数据。AI 会根据你的自然语言查询生成 SQL 语句，
        并返回模拟的数据分析结果。
      </p>
    </div>

    <div class="info-section">
      <h4>数据库表结构</h4>
      <div class="tables-list">
        <div v-for="table in tables" :key="table.name" class="table-card">
          <h5 class="table-name">{{ table.name }}</h5>
          <p class="table-desc">{{ table.description }}</p>
          <div class="columns-list">
            <div v-for="col in table.columns" :key="col.name" class="column-item">
              <span class="col-name">{{ col.name }}</span>
              <span class="col-type">{{ col.type }}</span>
              <span class="col-desc">{{ col.desc }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="info-section">
      <h4>推荐查询示例</h4>
      <div class="sample-list">
        <div v-for="(question, index) in sampleQuestions" :key="index" class="sample-item">
          {{ index + 1 }}. {{ question }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.data-info {
  padding: 24px;
}

.info-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.info-section {
  margin-bottom: 24px;
}

.info-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 12px;
}

.info-desc {
  color: #666;
  line-height: 1.6;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.tables-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.table-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.table-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.table-desc {
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 12px;
}

.columns-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
}

.column-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}

.col-name {
  font-weight: 500;
  color: #333;
}

.col-type {
  color: #667eea;
  font-size: 0.75rem;
  background: rgba(102, 126, 234, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.col-desc {
  color: #888;
  font-size: 0.8rem;
}

.sample-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sample-item {
  padding: 10px 14px;
  background: #f0f7ff;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #555;
  border-left: 3px solid #667eea;
}
</style>
