import { createFFmpeg } from '@ffmpeg/ffmpeg/dist/ffmpeg.min.js';

export const ffmpeg = (createFFmpeg as typeof import("@ffmpeg/ffmpeg").createFFmpeg)({
	corePath: 'https://unpkg.com/@ffmpeg/core@^0.11.0/dist/ffmpeg-core.js',
});

// for debugging
window["ffmpeg"] = ffmpeg;


let ffmpegLoaded: Promise<void>|undefined;
export function loadFFmpeg(): Promise<void> {
	if (!ffmpegLoaded) {
		ffmpegLoaded = ffmpeg.load();
	}
	return ffmpegLoaded;
}