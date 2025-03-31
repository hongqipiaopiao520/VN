interface FileUploadOptions {
	accept: string
	multiple: boolean
	max?: string
}
/**
 * 比较文件大小，第一个参数为文件大小，为纯数字，第二个参数为目标大小，是一个数字+单位的字符串，如'1MB'
 * @param size
 * @param target
 */
export const compareSize = (size: number, target: string): boolean => {
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = sizes.findIndex(item => item === target.replace(/\d+/, ''));
	return size > parseInt(target) * k ** i;
};

export const selectFile = (options: FileUploadOptions): Promise<File[]> => {
	return new Promise((resolve, reject) => {
		// 创建input[file]元素
		const input = document.createElement('input');
		// 设置相应属性
		input.setAttribute('type', 'file');
		input.setAttribute('accept', options.accept);
		if (options.multiple) {
			input.setAttribute('multiple', 'multiple');
		} else {
			input.removeAttribute('multiple');
		}
		// 绑定事件
		input.onchange = function() {
			let files = Array.from(this.files);
			// 获取文件列表
			if (files) {
				const length = files.length;
				files = files.filter(file => {
					if (options.max) {
						return !compareSize(file.size, options.max);
					} else {
						return true;
					}
				});
				if (files && files.length > 0) {
					if (length !== files.length) {
						// message.warning(`已过滤上传文件中大小大于${options.max}的文件`);
					}
					resolve(files);
				} else {
					// message.warning(`上传文件大小不能大于${options.max}`);
					reject(new Error(`上传文件大小不能大于${options.max}`));
				}
			} else {
				reject(new Error('No files selected'));
			}
		};

		input.oncancel = function() {
			reject(new Error('No files selected'));
		};
		input.click();
	});
};

export async function getMD5(arrayBuffer: ArrayBuffer) {
	const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function createFileWriter(
	extName = 'mp4'
): Promise<FileSystemWritableFileStream> {
	const fileHandle = await window.showSaveFilePicker({
		suggestedName: `WebAV-export-${Date.now()}.${extName}`
	});
	return fileHandle.createWritable();
}
