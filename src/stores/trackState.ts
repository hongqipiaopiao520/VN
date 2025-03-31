/**
 * @Author: levi levihuang@xiaoe-tech.com
 * @Date: 2025-03-31 16:05:00
 * @LastEditors: levi levihuang@xiaoe-tech.com
 * @LastEditTime: 2025-03-31 16:05:00
 * @FilePath: src/stores/trackState.ts
 * @Description: 轨道信息
 */

import { defineStore } from 'pinia';
import { MP4Clip } from '@webav/av-cliper';
export const useTrackState = defineStore('trackState', () => {
	const trackList = reactive([]);
	const decoderMap = new Map<string, MP4Clip>();

	function setDecoderMap(id:string, clip:MP4Clip) {
		decoderMap.set(id, clip);
		console.log('setDecoderMap=====>', decoderMap);
	}
	function getDecoder(id:string) {
		return decoderMap.get(id);
	}
	function addTrack(newItem) {
		console.log('newTem=====>', newItem);
		trackList.push({
			type: newItem.type,
			list: [newItem]
		});
		console.log('trackList=====>', trackList);
	}
	return {
		trackList,
		decoderMap,
		addTrack,
		setDecoderMap,
		getDecoder
	};
});
