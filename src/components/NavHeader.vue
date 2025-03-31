<!--
  * @Author: levi levihuang@xiaoe-tech.com
  * @Date: 2025-02-21 17:20:14
  * @LastEditors: levi levihuang@xiaoe-tech.com
  * @LastEditTime: 2025-02-21 17:20:14
  * @FilePath: src/components/nav-header.vue
  * @Description: 导航头部
-->
<template>
    <header class="nav-header">
        <router-link :to="{ path: '/article' }">
            文章
        </router-link>
        <div>
            管理
        </div>
        <div>
            推荐
        </div>
    </header>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.nav-header {
    position: fixed;
    top: 0;
    left: 0;
	z-index: 11;
    width: 100vw;
    height: var(--nav-header-height);
    border-bottom: 1px solid gray;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
	background: #f9f9f9;
}
</style>
