<!--
  * @Author: levi levihuang@xiaoe-tech.com
  * @Date: 2025-02-21 17:45:23
  * @LastEditors: levi levihuang@xiaoe-tech.com
  * @LastEditTime: 2025-02-21 17:45:24
  * @FilePath: src/views/article.vue
  * @Description: 11111
-->
<template>
    <div class="video-handler">
        <n-spin :show="loading">
            <div class="img-list">
                <div v-for="item in imgList" :key="item.ts">
                    <span> 时间搓:{{ item.ts }}</span>
                    <img :src="item.img" alt="">
                </div>
            </div>
        </n-spin>
    </div>
</template>

<script setup lang="ts">
// import { MP4Clip } from '@webav/av-cliper';
import { ref, onUnmounted } from 'vue';
import { useTrackState } from '@/stores/trackState';

const { trackItem } = defineProps({
    trackItem: {
        type: Object,
        default: () => ({})
    }
});
const loading = ref(false);
const trackState = useTrackState();

const imgList = ref();
const createdThumbnails = async(id:string) => {
    loading.value = true;
    let t = performance.now();
    const clip = trackState.getDecoder(trackItem.id);
    const list = await clip.thumbnails(200, {
        start: 1e6,
        step: 1e6
    });
    const cost = ((performance.now() - t) / 1000).toFixed(2);
    imgList.value = list.map(it => ({
        ts: it.ts / 1000000,
        img: URL.createObjectURL(it.img)
    }));
    loading.value = false;
    console.log('imgList=====>', imgList.value, cost);
};

const initVideo = () => {
    console.log('trackItem=====>', trackItem);
    if (!trackItem.id) return;
    createdThumbnails();
};
watch(() => trackItem.id, initVideo, {
    flush: 'post',
    immediate: true
});

onUnmounted(() => {
    imgList.value?.forEach(item => {
        URL.revokeObjectURL(item);
    });
    // if (videoInfo.value?.url) {
    //     URL.revokeObjectURL(videoInfo.value.url);
    // }
});
</script>

<style scoped lang="scss">
.video-handler {
	padding: 16px;
	min-height: 100vh;
	background-color: #FEFEFE;
	header {
		text-align: left;
		margin-bottom: 16px;
	}

		.video-box {
			width: 320px;
			height: 180px;
		}
		.img-list {
			display: flex;
			border: solid 1px #333333;
			gap: 9px;
			padding: 0 32px;
			width: 100vw;
			height: 160px;
			overflow-y: auto;
			img {
				height: 80%;
			}
		}
}
</style>
