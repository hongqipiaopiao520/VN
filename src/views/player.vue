<!--
  * @Author: levi levihuang@xiaoe-tech.com
  * @Date: 2025-03-18 16:54:59
  * @LastEditors: levi levihuang@xiaoe-tech.com
  * @LastEditTime: 2025-03-18 16:54:59
  * @FilePath: src/views/player.vue
  * @Description: 播放
-->
<template>
    <div class="video-handler">
        <header>
            <video-upload @update="handleUpdate" />
        </header>
        <canvas ref="playerCanvas" class="absolute left-0 right-0 top-0 bottom-0 m-auto bg-gray-900" id="player" :style="{ zoom: scale, width: `${playerWidth}px`, height: `${playerHeight}px` }" />
        <VideoItem :trackItem="item" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import VideoUpload from '@/components/videoUpload.vue';
import { getMD5 } from '@/utils/file';
// import { videoDecoder } from '@/utils/webcodecs';
import { MP4Clip } from '@webav/av-cliper';
import { useTrackState } from '@/stores/trackState';
import VideoItem from '@/components/videoItem.vue';

const trackState = useTrackState();
const playerCanvas = ref(null);
const playerContext = ref();
const playerWidth = ref(320);
const playerHeight = ref(240);
const scale = ref();
const videoInfo = ref();
let playStartFrame = ref(1e6);
const audioCtx = new AudioContext();
let startAt = 0;
let clip;
const handleUpdate = async files => {
    const id = await getMD5(await files[0].arrayBuffer());
    clip = new MP4Clip(files[0].stream());
    await clip.ready;
    console.log('clip=====>', clip);
    trackState.setDecoderMap(id, clip);
    trackState.addTrack({
        id,
        url: URL.createObjectURL(files[0]),
        type: 'video',
        name: files[0].name,
        format: files[0].type,
        width: clip.meta.width,
        height: clip.meta.height,
        duration: Math.round(clip.meta.duration / 1e6)
    });
    // await drawCanvas();
};

const item = computed(() => {
    return trackState?.trackList?.[0]?.list[0];
});
const drawCanvas = async() => {
    let startTime = performance.now();
    const times = 1;
    const timer = setInterval(async() => {
        const time = Math.round((performance.now() - startTime) * 1000) * times;
        // 获取当前帧
        const { video, state, audio } = await clip.tick(time);
        if (state === 'done') {
            clearInterval(timer);
            clip.destroy();
            await audioCtx.close();
            return;
        }
        // audio
        const len = audio[0].length;
        const buf = audioCtx.createBuffer(2, len, 48000);
        buf.copyToChannel(audio[0], 0);
        buf.copyToChannel(audio[1], 1);
        const source = audioCtx.createBufferSource();
        source.buffer = buf;
        source.connect(audioCtx.destination);
        startAt = Math.max(audioCtx.currentTime, startAt);
        source.start(startAt);
        startAt += buf.duration;
        console.log('source=====>', buf);
        // video
        console.log('frame=====>', audio, state, time);
        const offCanvas = new OffscreenCanvas(playerWidth.value, playerHeight.value);
        const ctx = offCanvas.getContext('2d');
        ctx.drawImage(video, 0, 0, video.codedWidth, video.codedHeight, 0, 0, playerWidth.value, playerHeight.value);
        playerContext.value.transferFromImageBitmap(offCanvas.transferToImageBitmap());
        // playStartFrame.value += 1e5;
    }, 1000 / 30);
};

// watch(() => playStartFrame.value, () => drawCanvas(), { deep: true });

onMounted(() => {
    // playerContext =
    playerContext.value = playerCanvas.value.getContext('bitmaprenderer');
    console.log('playerCanvas=====>', playerCanvas.value, playerCanvas.value.getContext('bitmaprenderer'));
});
// this.player.value.getContext('bitmaprenderer');
</script>

<style scoped lang="scss">
.video-handler {
	padding: 16px;
	min-height: 100vh;
	background-color: #FEFEFE;
}
</style>
