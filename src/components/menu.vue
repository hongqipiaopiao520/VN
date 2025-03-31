<!--
  * @Author: levi levihuang@xiaoe-tech.com
  * @Date: 2025-03-17 10:39:58
  * @LastEditors: levi levihuang@xiaoe-tech.com
  * @LastEditTime: 2025-03-17 10:39:58
  * @FilePath: src/components/menu.vue
  * @Description: 11111
-->
<template>
    <div class="seat" :style="{ width: collapsed ? '48px' : '144px' }" />

    <div class="menu">
        <n-layout has-sider>
            <n-layout-sider
                bordered
                collapse-mode="width"
                :collapsed-width="48"
                :width="144"
                :collapsed="collapsed"
                show-trigger
                @collapse="collapsed = true"
                @expand="collapsed = false"
            >
                <n-menu
                    v-model:value="activeKey"
                    @collapse="collapsed = true"
                    :options="menuOptions"
                    :root-indent="12"
                    :indent="12"
                    :default-expanded-keys="defaultExpandedKeys"
                />
            </n-layout-sider>
        </n-layout>
    </div>
</template>

<script setup lang="ts">
import { MenuOption, NIcon } from 'naive-ui';
import type { Component } from 'vue';
import { PawOutline as PawIcon } from '@vicons/ionicons5';
import { h, ref } from 'vue';

const defaultExpandedKeys = ['bear-paw'];
const activeKey = ref<string | null>(null);
const collapsed = ref(false);
function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions: MenuOption[] = [
    {
        label: '熊掌',
        key: 'bear-paw',
        icon: renderIcon(PawIcon),
        children: [
            {
                label: '保护野生动物',
                key: 'protect-wild-animals'
            }
        ]
    }
];
</script>

<style scoped lang="scss">
.seat {
	opacity: 0;
	position: relative;
	top: 0;
	left: 0;
	height: 100vh;
}
.menu {
	background-color: #ffffff;
	position: fixed;
	left: 0;
	top: var(--nav-header-height);
	z-index: 10;
	height: 100vh;
}
</style>
