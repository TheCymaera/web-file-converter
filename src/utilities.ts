import { createFFmpeg } from '@ffmpeg/ffmpeg/dist/ffmpeg.min.js';

export const ffmpeg = (createFFmpeg as typeof import("@ffmpeg/ffmpeg").createFFmpeg)({
	corePath: 'https://unpkg.com/@ffmpeg/core@^0.11.0/dist/ffmpeg-core.js',
});

// for debugging
window["ffmpeg"] = ffmpeg;
export const ffmpegLoaded = ffmpeg.load();

export function saveURL(url: string, fileName: string) {
	const a = document.createElement('a');
	a.href = url;
	a.download = fileName;
	a.click();
}