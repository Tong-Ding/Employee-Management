<template>
  <!-- 直接替换div -->
  <div id="app">
    <!-- 动态摄图组件，用来渲染与路由路径对应的组件 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
