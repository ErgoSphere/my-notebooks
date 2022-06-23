### 剪片段
```
$ ffmpeg -i x.ts -ss 00:01:11 -t 00:00:06 -async 1 -vcodec copy -acodec copy y.mp4
$ ffmpeg -i x.ts -ss 00:01:11 -t 00:00:06 -async 1 -vcodec copy y.ts
$ ffmpeg -i Freak.m4a -vn -acodec copy -ss 00:00:06.800 -t 00:03:30 ff.m4a
```
- ss: 起始位
- t: 时长
- vcodec/acodec：转码

---
### 转GIF
```
$ ffmpeg -i x.mp4 --ss 00:00:01.55 -t 00:00:02.7 -vf scale=360:-1 -async 1 x.gif
```
- scale: 大小
- -1: 保持宽高比

---
### 慢放视频或GIF（需和GIF类分开步骤）
```
$ffmpeg -1 x.gif -filter:v "setpts=2.5*PTS" -async 1 x2.gif
```
- 1以上慢速， 以下加速

---
### 输出平滑的GIF
1. 选出所需要作为GIF的片段CUT
```
$ ffmpeg -i x.mp4 -ss 00:01:11 -t 00:00:06 -async 1 y.mpt
```
2. 再由该片段生成计算使用的调色盘（GIF无法表示256色）
```
$ ffmpeg -i y.mp4 -vf "palettegen" -y palette.png
```
3. 最后生成GIF
```
$ ffmpeg -i y.mp4 -i palette.png -lavfi "fps=15, scale=360:-1:flags=lanczos[x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" -y y.gif
```
- refs: https://life.craftz.dog/entry/generating-a-beautiful-gif-from-a-video-with-ffmpeg

---
### webm to mp4
```
$ ffmpeg -fflags +genpts -i 1.webm -r 24 1.mp4
```

---
### mp4 to mp3
```
$ ffmpeg -i video.mp4 -b:a 320K -vn music.mp3
```

---
### flv to mp3
```
$ ffmpeg -i input.flv -q:a 5 out.mp3
```

---
### 查看视频信息
```
$ ffmpeg -i x.mp4
```