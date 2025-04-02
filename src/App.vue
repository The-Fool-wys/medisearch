<template>
  <div><router-view></router-view></div>
</template>

<script>
export default {

}
</script>

<style>
/* 全局样式 */
body, html {
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* 防止水平滚动条 */
}

/* 移除界面下端的分割线 */
.el-container {
  border: none !important; /* 移除容器的边框 */
}

.el-main {
  padding-bottom: 0 !important; /* 移除主内容区域的下边距 */
}

/* 移除可能的分割线 */
.el-footer {
  display: none !important; /* 如果有 footer，可以隐藏 */
}
</style> 