/**
 * @Author: levi levihuang@xiaoe-tech.com
 * @Date: 2025-04-01 16:03:02
 * @LastEditors: levi levihuang@xiaoe-tech.com
 * @LastEditTime: 2025-04-01 16:03:02
 * @FilePath: src/utils/index.ts
 * @Description: 11111
 */

export function formatTime(seconds) {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

export function getUniformSubarray(array, m) {
	// 计算采样间隔
	const interval = array.length / m;

	// 使用顺序采样的方法选取元素
	const subarray = [];
	for (let i = 0; i < array.length && subarray.length < m; i += interval) {
		// 只有当元素数量还没有达到m时，才添加元素
		subarray.push(array[Math.min(Math.round(i), array.length - 1)]);
	}

	return subarray;
}
