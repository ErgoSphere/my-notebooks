### Abema提取
- 工具：
  - Minyami(需node.js), minyami chrome插件
  - openssl
- 参考：
  - https://blog.wsswms.dev/2020/04/19/Minyami-is-so-lovely/
  - https://www.bilibili.com/read/cv937578/
- 下载时```proxy```设置为本地代理端口接入, 如下面示例，代理入口为```127.0.0.1:7078```
  ```
  minyami -d "https://ds-vod-abematv.akamaized.net/program/351-9_s10_p6/720/playlist.m3u8?aver=1&ccf=26&dt=pc_chrome&enc=clear" --output "第3回 ももいろ歌合戦 - ももいろ歌合戦 - 倖田來未／「♪GOLDFINGER 2019」  音楽  無料で動画＆見逃し 配信を見るなら【ABEMAビデオ】.ts" --key "08cd2ac4c9908b1d2e777c1b3fed3858" --proxy "127.0.0.1:7078"
  ```