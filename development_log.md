# 仓库信息

开发者：Moeus
联系方式：2662717402@qq.com

# 关于配置

网页内左上角图标配置：
在components\icons.tsx内的Logo内进行设置，图标会在components\navbar.tsx内被引用
网页标签图标配置：
app\layout.tsx的metadata内配置
网页标签标题配置：
config\site.ts的name属性，会被app\layout.tsx引用

#　流体光标
有两部分组成，画布和监控函数
画布元素在根page内渲染，ID为fluid
监控函数在components\fluidcursor_monitor.tsx组件内
监控函数通过id获取canvas并对其进行修改实现流体光标

# 一些知识点

## 修复代码的格式问题

    修复所有文件的 Prettier 格式问题，换行符之类的不规范
    npx prettier --write .

    修复所有文件的 ESLint 问题（包括格式和代码规范），未保留空行的不规范
    npx eslint --fix .

“&nbsp;” 非断行空格，元素的text属性的尾部可以使用
