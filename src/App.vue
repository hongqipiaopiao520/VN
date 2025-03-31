<template>
    <div class="app">
        <NavHeader />
        <!--        <Menu /> -->
        <router-view style="{flex: 1}" />
    </div>
</template>

<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
import Menu from '@/components/menu.vue';
import NavHeader from '@/components/NavHeader.vue';
</script>

<style scoped>
.app{
	background-color: #F1F2F4;
	//display: flex;
	padding-top:var(--nav-header-height);
}

.container {
	//margin-left: 160px;
}
</style>
