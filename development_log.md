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

# 带碰撞的背景光束组件(雨滴组件)

    组件在根page和artcle路由中渲染
    雨滴与page的层级z-index不在同一层，但整个组件是鼠标事件可穿透的，并且除了雨滴，其他部分都是透明
    雨滴的碰撞是以窗口底部为判断点
    每个雨滴都是规则预设的
    每个雨滴通过预设规则在CollisionMechanismProps通过useState改变key出发重现渲染，实现无限循环
    组件在服务端没有动画效果，客户端才开启动画

# page 的客户端渲染和服务端渲染分离
    每个page下，包括动态路由的page，在page.tsx下设置服务端预渲染的组、服务端计算、服务端api调用，服务端执行这些内容，然后再接入客户端渲染组件。
    被page调用的客户端组件可以是同一路由下的其他tsx，也可以是component下的组件。
    这样嵌套的方式可以避免在同一page下出现服务端渲染和客户端渲染冲突问题

# 一些知识点

## 修复代码的格式问题

    修复所有文件的 Prettier 格式问题，换行符之类的不规范
    npx prettier --write .

    修复所有文件的 ESLint 问题（包括格式和代码规范），未保留空行的不规范
    npx eslint --fix .

    “&nbsp;” 非断行空格，元素的text属性的尾部可以使用
