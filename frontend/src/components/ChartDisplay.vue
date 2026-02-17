<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  data: Object
})

const canvasRef = ref(null)

const drawChart = () => {
  if (!canvasRef.value || !props.data) return
  
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas.getBoundingClientRect()
  
  canvas.width = width * 2
  canvas.height = height * 2
  ctx.scale(2, 2)
  
  const padding = 60
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2
  
  // 清空画布
  ctx.clearRect(0, 0, width, height)
  
  const { type, labels, datasets } = props.data
  
  if (type === 'line') {
    drawLineChart(ctx, labels, datasets, padding, chartWidth, chartHeight, width, height)
  } else if (type === 'pie' || type === 'doughnut') {
    drawPieChart(ctx, labels, datasets, width, height, type === 'doughnut')
  } else {
    drawBarChart(ctx, labels, datasets, padding, chartWidth, chartHeight, width, height)
  }
}

const drawLineChart = (ctx, labels, datasets, padding, chartWidth, chartHeight, width, height) => {
  const data = datasets[0].data
  const maxValue = Math.max(...data) * 1.1
  const minValue = 0
  
  // 绘制坐标轴
  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 1
  
  // Y轴
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, height - padding)
  ctx.stroke()
  
  // X轴
  ctx.beginPath()
  ctx.moveTo(padding, height - padding)
  ctx.lineTo(width - padding, height - padding)
  ctx.stroke()
  
  // 绘制Y轴刻度和标签
  ctx.fillStyle = '#666'
  ctx.font = '12px Arial'
  ctx.textAlign = 'right'
  for (let i = 0; i <= 5; i++) {
    const y = height - padding - (chartHeight * i / 5)
    const value = Math.round(maxValue * i / 5)
    ctx.fillText(value, padding - 10, y + 4)
    
    // 网格线
    if (i > 0) {
      ctx.strokeStyle = '#f0f0f0'
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }
  }
  
  // 绘制X轴标签
  ctx.textAlign = 'center'
  ctx.fillStyle = '#666'
  labels.forEach((label, i) => {
    const x = padding + (chartWidth * i / (labels.length - 1))
    ctx.fillText(label, x, height - padding + 20)
  })
  
  // 绘制折线
  ctx.strokeStyle = datasets[0].borderColor
  ctx.lineWidth = 3
  ctx.beginPath()
  
  data.forEach((value, i) => {
    const x = padding + (chartWidth * i / (labels.length - 1))
    const y = height - padding - (chartHeight * (value - minValue) / (maxValue - minValue))
    
    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()
  
  // 绘制数据点
  ctx.fillStyle = datasets[0].borderColor
  data.forEach((value, i) => {
    const x = padding + (chartWidth * i / (labels.length - 1))
    const y = height - padding - (chartHeight * (value - minValue) / (maxValue - minValue))
    
    ctx.beginPath()
    ctx.arc(x, y, 6, 0, Math.PI * 2)
    ctx.fill()
    
    // 白色内圆
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = datasets[0].borderColor
  })
  
  // 绘制标题
  ctx.fillStyle = '#333'
  ctx.font = 'bold 14px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(datasets[0].label, width / 2, 30)
}

const drawBarChart = (ctx, labels, datasets, padding, chartWidth, chartHeight, width, height) => {
  const data = datasets[0].data
  const colors = datasets[0].backgroundColor || '#667eea'
  const maxValue = Math.max(...data) * 1.1
  
  // 绘制坐标轴
  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 1
  
  // Y轴
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, height - padding)
  ctx.stroke()
  
  // X轴
  ctx.beginPath()
  ctx.moveTo(padding, height - padding)
  ctx.lineTo(width - padding, height - padding)
  ctx.stroke()
  
  // 绘制Y轴刻度
  ctx.fillStyle = '#666'
  ctx.font = '12px Arial'
  ctx.textAlign = 'right'
  for (let i = 0; i <= 5; i++) {
    const y = height - padding - (chartHeight * i / 5)
    const value = Math.round(maxValue * i / 5)
    ctx.fillText(value, padding - 10, y + 4)
  }
  
  // 绘制柱状图
  const barWidth = chartWidth / labels.length * 0.6
  const barSpacing = chartWidth / labels.length
  
  labels.forEach((label, i) => {
    const value = data[i]
    const barHeight = (value / maxValue) * chartHeight
    const x = padding + barSpacing * i + (barSpacing - barWidth) / 2
    const y = height - padding - barHeight
    
    // 绘制柱子
    const color = Array.isArray(colors) ? colors[i % colors.length] : colors
    ctx.fillStyle = color
    ctx.fillRect(x, y, barWidth, barHeight)
    
    // 绘制X轴标签
    ctx.fillStyle = '#666'
    ctx.font = '11px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(label, x + barWidth / 2, height - padding + 20)
    
    // 绘制数值
    ctx.fillStyle = '#333'
    ctx.font = 'bold 12px Arial'
    ctx.fillText(value, x + barWidth / 2, y - 8)
  })
  
  // 绘制标题
  ctx.fillStyle = '#333'
  ctx.font = 'bold 14px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(datasets[0].label, width / 2, 30)
}

const drawPieChart = (ctx, labels, datasets, width, height, isDoughnut) => {
  const data = datasets[0].data
  const colors = datasets[0].backgroundColor || ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe']
  const total = data.reduce((sum, val) => sum + val, 0)
  
  const centerX = width / 2
  const centerY = height / 2 + 20
  const radius = Math.min(width, height) / 3
  
  let currentAngle = -Math.PI / 2
  
  // 绘制饼图扇形
  data.forEach((value, i) => {
    const sliceAngle = (value / total) * 2 * Math.PI
    const color = Array.isArray(colors) ? colors[i % colors.length] : colors
    
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
    ctx.closePath()
    ctx.fill()
    
    // 绘制标签
    const labelAngle = currentAngle + sliceAngle / 2
    const labelX = centerX + Math.cos(labelAngle) * (radius + 30)
    const labelY = centerY + Math.sin(labelAngle) * (radius + 30)
    
    ctx.fillStyle = '#333'
    ctx.font = '11px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(labels[i], labelX, labelY)
    
    // 绘制百分比
    const percent = ((value / total) * 100).toFixed(1)
    const percentX = centerX + Math.cos(labelAngle) * (radius * 0.7)
    const percentY = centerY + Math.sin(labelAngle) * (radius * 0.7)
    
    ctx.fillStyle = 'white'
    ctx.font = 'bold 10px Arial'
    ctx.fillText(percent + '%', percentX, percentY)
    
    currentAngle += sliceAngle
  })
  
  // 如果是环形图，绘制中心空白
  if (isDoughnut) {
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI)
    ctx.fill()
    
    // 中心文字
    ctx.fillStyle = '#333'
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('总计', centerX, centerY - 10)
    ctx.font = 'bold 16px Arial'
    ctx.fillText(total.toLocaleString(), centerX, centerY + 15)
  }
  
  // 绘制标题
  ctx.fillStyle = '#333'
  ctx.font = 'bold 14px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(datasets[0].label, width / 2, 30)
}

onMounted(drawChart)
watch(() => props.data, drawChart, { deep: true })
</script>

<template>
  <div class="chart-display">
    <canvas ref="canvasRef" class="chart-canvas"></canvas>
  </div>
</template>

<style scoped>
.chart-display {
  width: 100%;
  height: 100%;
  min-height: 350px;
}

.chart-canvas {
  width: 100%;
  height: 100%;
}
</style>
