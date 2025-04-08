<!--
  * @Author: levi levihuang@xiaoe-tech.com
  * @Date: 2025-04-02 16:46:31
  * @LastEditors: levi levihuang@xiaoe-tech.com
  * @LastEditTime: 2025-04-02 16:46:31
  * @FilePath: src/components/timeLine/TimeLineCursor.vue
  * @Description: 11111
-->
<template>
    <div
        class="timeline-trackpad"
        :style="{ transform: `translate3d(${cursorTransformX},0px,0px)` }"
        @mousedown="onMouseDown"
    >
        <div class="timeline-cursor">
            <span
                class="timeline-cursor__point"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePlayerState } from '@/stores/playerState';
const props = defineProps({
    serifWidth: {
        type: Number,
        default: '40'
    }
});
const playerState = usePlayerState();
const isDragging = ref(false);
const cursorTransformX = computed(() => {
    if (isDragging.value) {
        if (moveX.value > 0) {
            return `${Math.round(startLeft + moveX.value)}px`;
        }
    }
    return `${Math.round(playerState.curTime * props.serifWidth)}px`;
});

let startX = -1;
let startLeft = 0;
let startTime = 0;
const moveX = ref(0);
const onMouseDown = (event: MouseEvent) => {
    playerState.isPause = true;
    isDragging.value = true;

    startX = event.x;
    startLeft = Math.round(playerState.curTime * props.serifWidth);
    startTime = playerState.curTime;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
};
const onMouseMove = (event: MouseEvent) => {
    if (isDragging.value) {
        // console.log('event.x - startX=====>', event.x - startX);
        moveX.value = (event.x - startX);
        const absTime = moveX.value / props.serifWidth;
        setPlayerCurTime(absTime);
    }
};

function onMouseUp(event: MouseEvent) {
    // console.log('onMouseUp=====>');
    isDragging.value = false;
    moveX.value = 0;
    startLeft = 0;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

const setPlayerCurTime = (absTime: number) => {
    const newTime = startTime + absTime;
    // console.log('time=====>', absTime, newTime);
    if (newTime < playerState.duration && newTime > 0) {
        playerState.curTime = newTime;
    }
};
</script>

<style scoped lang="scss">
.timeline-trackpad{
	height: 100px;
	//left: 200px;
	position: absolute;
	width: 20px;
	z-index: 2;
	cursor: move;
	//background-color: red;
	.timeline-cursor {
		width: 1px;
		height: 100%;
		background-color:rgb(243, 244, 246, 1);
		&__point {
			background-color:white;
			display: block;
			transform: translateX(-50%);
			width: 8px;
			height: 10px;
			&::after {
				content: '';
				display: block;
				position: absolute;
				top: 100%;
				border: 4px solid transparent;
				border-top-color: rgb(243, 244, 246, 1);
			}
		}
	}

}
</style>
