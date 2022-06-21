### 获取可下载格式

```
$ youtube-dl --list-format http://xxx.xxx.xx/xxxx
```

***```--list-format```不能使用```-f```替代，多数教程有误***

```
C:\Users\ErgoSphere>youtube-dl --list-format https://www.youtube.com/watch?v=Peai9E0SwW4
[youtube] Peai9E0SwW4: Downloading webpage
[info] Available formats for Peai9E0SwW4:
format code  extension  resolution note
249          webm       audio only tiny   51k , opus @ 50k (48000Hz), 17.00MiB
250          webm       audio only tiny   62k , opus @ 70k (48000Hz), 20.97MiB
251          webm       audio only tiny  107k , opus @160k (48000Hz), 38.08MiB
140          m4a        audio only tiny  133k , m4a_dash container, mp4a.40.2@128k (44100Hz), 52.64MiB
160          mp4        82x144     144p   39k , avc1.4d400b, 30fps, video only, 7.45MiB
133          mp4        136x240    144p   66k , avc1.4d400c, 30fps, video only, 12.23MiB
278          webm       144x256    144p  107k , webm container, vp9, 30fps, video only, 32.21MiB
134          mp4        202x360    240p  118k , avc1.4d400d, 30fps, video only, 31.56MiB
242          webm       240x426    240p  177k , vp9, 30fps, video only, 34.39MiB
135          mp4        270x480    240p  194k , avc1.4d4015, 30fps, video only, 60.34MiB
243          webm       360x640    360p  345k , vp9, 30fps, video only, 72.93MiB
136          mp4        406x720    360p  557k , avc1.4d401e, 30fps, video only, 134.12MiB
244          webm       480x854    480p  595k , vp9, 30fps, video only, 132.93MiB
18           mp4        202x360    240p  322k , avc1.42001E, 30fps, mp4a.40.2@ 96k (44100Hz), 131.08MiB
22           mp4        406x720    360p  458k , avc1.64001F, 30fps, mp4a.40.2@192k (44100Hz) (best)
```

### 下载视频

```
$ youtube-dl -f 244+140 http://xxx.xxx.xxx/xxx
```

由上面的format code得到音频 + 视频的组合，下载后会由```ffmepg```自动合并


```
C:\Users\ErgoSphere>youtube-dl -f 244+140 https://www.youtube.com/watch?v=Peai9E0SwW4
[youtube] Peai9E0SwW4: Downloading webpage
WARNING: Requested formats are incompatible for merge and will be merged into mkv.
[download] Destination: 7月1日登坂広臣Instagram-Peai9E0SwW4.f244.webm
[download] 100% of 132.93MiB in 00:36
[download] Destination: 7月1日登坂広臣Instagram-Peai9E0SwW4.f140.m4a
[download] 100% of 52.64MiB in 00:11
[ffmpeg] Merging formats into "7月1日登坂広臣Instagram-Peai9E0SwW4.mkv"
Deleting original file 7月1日登坂広臣Instagram-Peai9E0SwW4.f244.webm (pass -k to keep)
Deleting original file 7月1日登坂広臣Instagram-Peai9E0SwW4.f140.m4a (pass -k to keep)
```

- 下载位置即为命令行运行所在位置，如要修改使用```-o```参数

- windows下的智能代理可以不需要配置proxy，但mac下使用ss时需指定proxy, 并且要指定正确的套接格式（参考文档）

```
$ youtube-dl -f 140 https://www.youtube.com/watch?v=HeXbY5EFxrg --proxy socks5://127.0.0.1:1086
```