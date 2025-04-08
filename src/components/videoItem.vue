<!--
  * @Author: levi levihuang@xiaoe-tech.com
  * @Date: 2025-02-21 17:45:23
  * @LastEditors: levi levihuang@xiaoe-tech.com
  * @LastEditTime: 2025-02-21 17:45:24
  * @FilePath: src/views/article.vue
  * @Description: 11111
-->
<template>
    <div class="video-item">
        <TimeLineCursor :serifWidth="serifWidth" />
        <div style="position: absolute; left: 50vw;" v-show="loading">
            <n-spin size="small" />
        </div>
        <div class="time-line" ref="timeLineRef">
            <div class="time-line-ruler" :style="{ width: '40px' }" v-for="(item, index) in serifList" :key="item.curTime">
                <div class="serif" />
                <div v-show="item.curTime" class="label">{{ item.curTime }}</div>
            </div>
        </div>
        <div class="img-list">
            <div v-for="item in thumbnailsList" :key="item.ts">
                <span> {{ Math.floor(item.ts) }}</span>
                <img :src="item.img" alt="">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// import { MP4Clip } from '@webav/av-cliper';
import { useTrackState } from '@/stores/trackState';
import { formatTime, getUniformSubarray } from '@/utils';
import { usePlayerState } from '@/stores/playerState';
import TimeLineCursor from '@/components/timeLine/TimeLineCursor.vue';

const { trackItem } = defineProps({
    trackItem: {
        type: Object,
        default: () => ({})
    },
    scale: {
        type: Number,
        default: 1
    }
});
const loading = ref(false);
const trackState = useTrackState();
const playerState = usePlayerState();
const serifWidth = ref(40);

// 总宽度
const trackWidth = computed(() => {
    return trackItem.duration * serifWidth.value;
});
// 样式
const trackStyle = computed(() => {
    return {
        width: `${trackWidth.value}px`
    };
});
// 时间条
const serifList = computed(() => {
    if (!trackItem.duration) return [];
    const res = [];
    for (let i = 0; i < trackItem.duration; i++) {
        res[i] = {
            index: i,
            curTime: formatTime(i)
        };
    }
    return res;
});
const thumbnailsList = computed(() => {
    // 能放多少张图
    const sum = Math.floor(trackItem.duration * serifWidth.value / 50);
    const step = Math.floor(imgList.value.length / sum);
    console.log('sum,step=====>', sum, step, imgList.value.length);
    return getUniformSubarray(imgList.value, sum);
});
const imgList = ref([]);
const createdThumbnails = async(id:string) => {
    loading.value = true;
    let t = performance.now();
    const clip = trackState.getDecoder(trackItem.id);
    const list = await clip.thumbnails(50, {
        start: 0,
        step: 1e6
    });
    const cost = ((performance.now() - t) / 1000).toFixed(2);
    imgList.value = list.map(it => ({
        ts: it.ts / 1000000,
        img: URL.createObjectURL(it.img)
    }));
    loading.value = false;
    // console.log('imgList=====>', imgList.value, cost);
};

const initVideo = () => {
    // console.log('trackItem=====>', trackItem);
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
.video-item {
	position: relative;
	width: 90vw;
	overflow-x: auto;
	//padding: 16px;
	background: #202024;
	padding: 0 20px;
	min-height: 100px;
	scrollbar-width: thin;
	scrollbar-color: #545459 #202024;
	.time-line {
		display: flex;
		border-top: 1px solid hsla(0, 0%, 100%, .1);
		.time-line-ruler {
			align-items: flex-start;
			display: flex;
			flex-direction: column;
			flex-shrink: 0;
			padding-bottom: 5px;
			position: relative;
			.serif {
				background: #fffbf8;
				content: "";
				display: block;
				height: 6px;
				width: 1px;
			}
			.label {
				color: #fffbf8;
				font-size: 9px;
				line-height: 1.5;
				margin-top: 1px;
				padding: 0 3px;
				transform: translate(-50%);
			}
		}
	}
	.img-list {
		position: relative;
		display: flex;
		//border: solid 1px #333333;
		height: 32px;
		img {
			display: inline-block;
			width: 50px;
			height: 32px;
			object-fit: cover;
			//height: 100%;
		}
		span {
			position: absolute;
		}
	}
}
</style>
