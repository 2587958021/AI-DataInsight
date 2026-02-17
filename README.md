# DataInsight AI - 智能数据分析平台

## 项目简介

DataInsight AI 是一个面向非技术人员的 AI 驱动数据分析工具，通过自然语言交互降低数据分析门槛，让每个人都能轻松获取数据洞察。

## 在线演示

- **GitHub Pages**: https://2587958021.github.io/AI-DataInsight
- **GitHub 仓库**: https://github.com/2587958021/AI-DataInsight
- **Gitee 仓库**: https://gitee.com/wyl20041025/ai-datainsight

## 核心功能

- **自然语言查询**: 用中文描述数据需求，AI 自动生成 SQL
- **智能可视化**: 自动识别数据类型，生成最佳图表（折线图、柱状图、饼图等）
- **数据洞察**: AI 分析数据趋势，提供业务建议
- **查询历史**: 保存查询记录，支持快速重新执行

## 技术栈

- **前端**: Vue 3 + Vite + Canvas API
- **后端**: Node.js + Express（可选，支持模拟数据演示）
- **AI 能力**: 智谱 AI GLM-4-Flash
- **部署**: GitHub Pages

## 本地开发

```bash
# 克隆项目
git clone https://github.com/2587958021/AI-DataInsight.git

# 安装前端依赖
cd AI-DataInsight/frontend
npm install

# 启动开发服务器
npm run dev

# 构建（可选）
npm run build
```

## 支持的查询类型

- 月度/季度销售分析
- 产品类别统计
- 热销产品排行
- 用户城市分布
- 用户年龄分布
- 订单状态统计
- 支付方式分析

## 项目结构

```
AI-DataInsight/
├── frontend/          # Vue3 前端项目
│   ├── src/
│   │   ├── components/   # 组件
│   │   ├── App.vue       # 主应用
│   │   └── main.js       # 入口
│   └── dist/          # 构建输出
├── backend/           # Express 后端（可选）
│   ├── app.js         # 主服务
│   └── package.json
├── PRD.md             # 产品需求文档
└── README.md          # 项目说明
```

## 开发者

- **姓名**: 吴叶龙
- **邮箱**: w2587913928@163.com
- **开发时间**: 2025年2月

## 许可证

MIT License
