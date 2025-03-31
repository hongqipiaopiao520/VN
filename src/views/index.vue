<template>
    <div class="canvas-wrap">
        <div ref="cvsWrapEl" class="w-640px h-360px" />
        <!--        <input -->
        <!--            type="radio" -->
        <!--            id="clip-source-remote" -->
        <!--            name="clip-source" -->
        <!--            :checked="clipSource === 'remote'" -->
        <!--            @change="setClipSource('remote')" -->
        <!--        > -->
        <!--        <label for="clip-source-remote"> 示例素材</label> -->
        <!--        <input -->
        <!--            type="radio" -->
        <!--            id="clip-source-local" -->
        <!--            name="clip-source" -->
        <!--            :checked="clipSource === 'local'" -->
        <!--            @change="setClipSource('local')" -->
        <!--        > -->
        <!--        <label for="clip-source-local"> 本地素材</label> -->
        <!--        <span class="mx-[10px]">|</span> -->
        <!--        <button class="mx-[10px]" @click="addVideo"> -->
        <!--            + 视频 -->
        <!--        </button> -->
        <!--        <button class="mx-[10px]" @click="addAudio"> -->
        <!--            + 音频 -->
        <!--        </button> -->
        <!--        <button class="mx-[10px]" @click="addImage"> -->
        <!--            + 图片 -->
        <!--        </button> -->
        <!--        <button class="mx-[10px]" @click="addText"> -->
        <!--            + 文字 -->
        <!--        </button> -->
        <!--        <span class="mx-[10px]">|</span> -->
        <button class="mr-10px" @click="togglePlay">
            {{ playing ? '暂停' : '播放' }}
        </button>
    <!--        <button class="mx-[10px]" @click="exportVideo"> -->
    <!--            导出视频 -->
    <!--        </button> -->
    <!--        <p /> -->
        <!--    <TimelineEditor -->
        <!--        :timelineData="tlData" -->
        <!--        :timelineState="tlState" -->
        <!--        @previewTime="onPreviewTime" -->
        <!--        @offsetChange="onOffsetChange" -->
        <!--        @durationChange="onDurationChange" -->
        <!--        @deleteAction="onDeleteAction" -->
        <!--        @splitAction="onSplitAction" -->
        <!--    /> -->
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, nextTick, watchEffect } from 'vue';
import { AVCanvas } from '@webav/av-canvas';
import {
    AudioClip,
    ImgClip,
    MP4Clip,
    VisibleSprite,
    renderTxt2ImgBitmap

} from '@webav/av-cliper';

// import { assetsPrefix, createFileWriter } from './utils';

// const uhaParam = new URLSearchParams(location.search).get('UHA');
// const __unsafe_hardwareAcceleration__ = [
//     'no-preference',
//     'prefer-hardware',
//     'prefer-software'
// ].includes(uhaParam) ? uhaParam : undefined;
//
// const actionSpriteMap = new WeakMap();
//
// const clipsSrc = assetsPrefix([
//     'video/bunny_0.mp4',
//     'audio/16kHz-1chan.mp3',
//     'img/bunny.png'
// ]);
//
const cvsWrapEl = ref<HTMLDivElement | null>(null);
const avCvs = ref(null);
const tlState = ref(null);
const playing = ref(false);
// const clipSource = ref('remote');
// const tlData = ref([
//     { id: '1-video', actions: [] },
//     { id: '2-audio', actions: [] },
//     { id: '3-img', actions: [] },
//     { id: '4-text', actions: [] }
// ]);
//

watchEffect(() => {
    if (cvsWrapEl.value) {
        console.log('newVal=====>', cvsWrapEl.value);
        avCvs.value = new AVCanvas(cvsWrapEl.value, {
            bgColor: '#000',
            width: 1280,
            height: 720
        });
        console.log('avCvs.value=====>', avCvs.value);
        avCvs.value.on('timeupdate', time => {
            if (tlState.value) {
                tlState.value.setTime(time / 1e6);
            }
        });
        avCvs.value.on('playing', () => {
            playing.value = true;
        });
        avCvs.value.on('paused', () => {
            playing.value = false;
        });
    }
});
// const setClipSource = source => {
//     clipSource.value = source;
// };
//
// const addSprite2Track = (trackId, spr, name) => {
//     const track = tlData.value.find(t => t.id === trackId);
//     if (!track) return null;
//
//     const start = spr.time.offset === 0
//         ? Math.max(...track.actions.map(a => a.end), 0) * 1e6
//         : spr.time.offset;
//
//     spr.time.offset = start;
//     if (spr.time.duration === Infinity) {
//         spr.time.duration = 10e6;
//     }
//
//     const action = {
//         id: Math.random().toString(),
//         start: start / 1e6,
//         end: (spr.time.offset + spr.time.duration) / 1e6,
//         effectId: '',
//         name
//     };
//
//     actionSpriteMap.set(action, spr);
//
//     track.actions.push(action);
//     tlData.value = tlData.value
//         .filter(t => t !== track)
//         .concat({ ...track })
//         .sort((a, b) => a.id.charCodeAt(0) - b.id.charCodeAt(0));
//     return action;
// };
//
// const addVideo = async() => {
//     let stream;
//     if (clipSource.value === 'local') {
//         const [fileHandle] = await window.showOpenFilePicker({
//             types: [{ accept: { 'video/*': ['.mp4', '.mov'] }}]
//         });
//         stream = (await fileHandle.getFile()).stream();
//     } else {
//         const response = await fetch(clipsSrc[0]);
//         stream = response.body;
//     }
//     const spr = new VisibleSprite(new MP4Clip(stream, { __unsafe_hardwareAcceleration__ }));
//     await avCvs.value.addSprite(spr);
//     addSprite2Track('1-video', spr, '视频');
// };
//
// const addAudio = async() => {
//     let stream;
//     if (clipSource.value === 'local') {
//         const [fileHandle] = await window.showOpenFilePicker({
//             types: [{ accept: { 'audio/*': ['.m4a', '.mp3'] }}]
//         });
//         stream = (await fileHandle.getFile()).stream();
//     } else {
//         const response = await fetch(clipsSrc[1]);
//         stream = response.body;
//     }
//     const spr = new VisibleSprite(new AudioClip(stream));
//     await avCvs.value.addSprite(spr);
//     addSprite2Track('2-audio', spr, '音频');
// };
//
// const addImage = async() => {
//     let args;
//     if (clipSource.value === 'local') {
//         const [fileHandle] = await window.showOpenFilePicker({
//             types: [{ accept: { 'image/*': ['.png', '.jpeg', '.jpg', '.gif'] }}]
//         });
//         const f = await fileHandle.getFile();
//         const stream = f.stream();
//         if (/\.gif$/.test(f.name)) {
//             args = { type: 'image/gif', stream };
//         } else {
//             args = stream;
//         }
//     } else {
//         const response = await fetch(clipsSrc[2]);
//         args = response.body;
//     }
//     const spr = new VisibleSprite(new ImgClip(args));
//     await avCvs.value.addSprite(spr);
//     addSprite2Track('3-img', spr, '图片');
// };
//
// const addText = async() => {
//     const spr = new VisibleSprite(
//         new ImgClip(await renderTxt2ImgBitmap('示例文字', 'font-size: 80px; color: red;'))
//     );
//     await avCvs.value.addSprite(spr);
//     addSprite2Track('4-text', spr, '文字');
// };

const togglePlay = () => {
    if (avCvs.value && tlState.value) {
        if (playing.value) {
            avCvs.value.pause();
        } else {
            avCvs.value.play({ start: tlState.value.getTime() * 1e6 });
        }
        playing.value = !playing.value;
    }
};
//
// const exportVideo = async() => {
//     if (avCvs.value) {
//         const combinator = await avCvs.value.createCombinator({ __unsafe_hardwareAcceleration__ });
//         const output = combinator.output();
//         output.pipeTo(await createFileWriter());
//     }
// };
//
// const onPreviewTime = time => {
//     avCvs.value.previewFrame(time * 1e6);
// };
//
// const onOffsetChange = action => {
//     const spr = actionSpriteMap.get(action);
//     if (spr) {
//         spr.time.offset = action.start * 1e6;
//     }
// };
//
// const onDurationChange = ({ action, start, end }) => {
//     const spr = actionSpriteMap.get(action);
//     if (spr) {
//         const duration = (end - start) * 1e6;
//         if (duration > spr.getClip().meta.duration) return false;
//         spr.time.duration = duration;
//         return true;
//     }
//     return false;
// };
//
// const onDeleteAction = action => {
//     const spr = actionSpriteMap.get(action);
//     if (spr) {
//         avCvs.value.removeSprite(spr);
//         actionSpriteMap.delete(action);
//         const track = tlData.value.find(t => t.actions.includes(action));
//         if (track) {
//             track.actions.splice(track.actions.indexOf(action), 1);
//             tlData.value = [...tlData.value];
//         }
//     }
// };
//
// const onSplitAction = async action => {
//     const spr = actionSpriteMap.get(action);
//     if (avCvs.value && spr && tlState.value) {
//         const time = tlState.value.getTime() * 1e6 - spr.time.offset;
//         const newClips = await spr.getClip().split(time);
//         avCvs.value.removeSprite(spr);
//         actionSpriteMap.delete(action);
//         const track = tlData.value.find(t => t.actions.includes(action));
//         if (track) {
//             track.actions.splice(track.actions.indexOf(action), 1);
//             tlData.value = [...tlData.value];
//             const sprsDuration = [time, spr.time.duration - time];
//             const sprsOffset = [spr.time.offset, spr.time.offset + time];
//             for (let i = 0; i < newClips.length; i++) {
//                 const clip = newClips[i];
//                 const newSpr = new VisibleSprite(clip);
//                 if (clip instanceof ImgClip) {
//                     newSpr.time.duration = sprsDuration[i];
//                 }
//                 newSpr.time.offset = sprsOffset[i];
//                 await avCvs.value.addSprite(newSpr);
//                 addSprite2Track(track.id, newSpr, action.name);
//             }
//         }
//     }
// };
//
// onMounted(async() => {
//     if (cvsWrapEl.value) {
//         avCvs.value = new AVCanvas(cvsWrapEl.value, {
//             bgColor: '#000',
//             width: 1280,
//             height: 720
//         });
//         avCvs.value.on('timeupdate', time => {
//             if (tlState.value) {
//                 tlState.value.setTime(time / 1e6);
//             }
//         });
//         avCvs.value.on('playing', () => {
//             playing.value = true;
//         });
//         avCvs.value.on('paused', () => {
//             playing.value = false;
//         });
//     }
// });
//
</script>

<style scoped lang="scss">
.canvas-wrap {
	min-height: 100vh;
	padding: 16px;
	/* 添加必要的样式 */
}
</style>
