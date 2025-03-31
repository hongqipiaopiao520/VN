<!--
  * @Author: levi levihuang@xiaoe-tech.com
  * @Date: 2025-03-14 18:07:07
  * @LastEditors: levi levihuang@xiaoe-tech.com
  * @LastEditTime: 2025-03-14 18:07:07
  * @FilePath: src/components/videoUpload.vue
  * @Description: 11111
-->
<template>
    <div class="video-upload">
        <n-button @click="upload" type="info">上传视频</n-button>
    </div>
</template>

<script setup lang="ts">
import { selectFile } from '@/utils/file';

const emit = defineEmits(['update']);
const upload = async() => {
    const files = await selectFile({ accept: '.mp4', multiple: false });
    console.log('files=====>', files[0].stream());
    emit('update', files);
};
</script>

<style scoped>

</style>
