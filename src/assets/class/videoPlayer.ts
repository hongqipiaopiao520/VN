/**
 * @Author: levi levihuang@xiaoe-tech.com
 * @Date: 2025-04-07 11:23:19
 * @LastEditors: levi levihuang@xiaoe-tech.com
 * @LastEditTime: 2025-04-07 11:23:19
 * @FilePath: src/assets/videoTrack.ts
 * @Description: 视频播放器
 */
import {Ref} from "vue";
import {useTrackState} from "@/stores/trackState";
import {usePlayerState} from "@/stores/playerState";

export class VideoPlayer {
	player: Ref<HTMLCanvasElement>; // 播放器
	playerContext: ImageBitmapRenderingContext | null = null;
	playerStore: Record<string, any>;
	trackState: Record<string, any>;
	containerSize: Record<string, any>;
	timer:number;
	clip;
	audioCtx;
	audioSource:AudioBufferSourceNode;
	constructor(options: Record<string, any>) {
		this.player = options.player;
		this.containerSize = options.containerSize;
		this.clip = options.clip
		console.log('toValue=====>', toValue(this.player),this.player)
		this.playerContext = toValue(this.player).getContext('bitmaprenderer');
		this.playerStore = usePlayerState();
		this.trackState = useTrackState();
		// this.initWatch();
	}
	/**
	 * @description:暂停
	 */
	stop() {
		this.audioSource?.stop();
		clearInterval(this.timer);
	}

	/**
	 * @description: 播放
	 * @param initTime 播放时间
	 */
	play(initTime?:number) {
		let curTime = initTime ?? this.playerStore.curTime
		curTime *= 1e6
		let startAt = 0;
		let first = true;
		this.audioCtx = new AudioContext()
		this.playerStore.isPause = false;
		this.stop();
		this.timer = setInterval(async() => {
			const { state, video, audio } = await this.clip.tick(Math.round(curTime));
			curTime += (1000 / 30) * 1000;
			this.playerStore.curTime = curTime / 1e6;
			if (state === 'done') {
				clearInterval(timer);
				return;
			}
			if (video != null && state === 'success') {
				this.#drawImage(video)
			}


			const len = audio[0]?.length ?? 0;
			if (len === 0) return;
			const buf = this.audioCtx.createBuffer(2, len, 48000);
			buf.copyToChannel(audio[0], 0);
			buf.copyToChannel(audio[1], 1);
			this.audioSource = this.audioCtx.createBufferSource();
			this.audioSource.buffer = buf;
			this.audioSource.connect(this.audioCtx.destination);
			// console.log('this.audioCtx=====>', this.audioCtx)
			startAt = Math.max(this.audioCtx.currentTime, startAt);
			this.audioSource.start(startAt);

			startAt += buf.duration;
		}, 1000 / 30);
	}
	/**
	 * @description: 设置视频当前帧
	 * @param initTime 播放时间
	 */
	async setCurImage( initTime?:number ) {
		console.log('1=====>',this)
		let curTime = initTime ?? this.playerStore.curTime
		curTime *= 1e6
		const { state, video } = await this.clip.tick(Math.round(curTime));
		if (video != null && state === 'success') {
			this.#drawImage(video)
		}
	}

	/**
	 * @description: 画图
	 * @param video 元素
	 */
	#drawImage(video) {
		const offCanvas = new OffscreenCanvas(this.playerStore.playerWidth, this.playerStore.playerHeight);
		const osCanvas = offCanvas.getContext('2d');
		osCanvas.drawImage(video, 0, 0, video.codedWidth, video.codedHeight, 0, 0, this.playerStore.playerWidth, this.playerStore.playerHeight);
		this.playerContext.transferFromImageBitmap(offCanvas.transferToImageBitmap());
		video.close();
	}


}




