<template>
  <nav-header></nav-header>
<!--  <video-->
<!--    muted-->
<!--    autoplay-->
<!--    preload="auto"-->
<!--    loop-->
<!--    src="https://assets.papegames.com/resources/cdn/20241114/1afe9b28d1c10b9d.mp4">-->
<!--  </video>-->
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavHeader from "./NavHeader.vue";

defineProps<{ msg: string }>()

const count = ref(0)
</script>


<style scoped>
.read-the-docs {
  color: #888;
}
</style>
