git add -A
git commit -m "Add dashboard with charts and data visualization"
git push github master

# 部署到 gh-pages
git subtree split --prefix frontend/dist -b gh-pages-temp
git push github gh-pages-temp:gh-pages --force
git branch -D gh-pages-temp

Write-Host "部署完成！访问: https://2587958021.github.io/AI-DataInsight"