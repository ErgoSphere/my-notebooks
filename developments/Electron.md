### 解压查看asar文件

``` 
$ npm install asar -g
$ asar extract app.asar ./foldername
```

---
### electron vuex operation not permitted (200724 update)
工具运行权限所引起的，修改```package.json```启用管理员权限运行即可
```json
{
    "win": {
        "requestedExecutionLevel": "requireAdministrator"
    }
}
```

---
### Electron v9.0.0 无法关闭窗口的问题
```js
// < 9.0.0
remote.getCurrentWindow.close()
// >= 9.0.0
remote.getCurrentWindow.destroy()
```

---
### vuex-electron设置命名空间(namespace)后dispatch事件无法触发 (~ 200729)
未解。

---
### Electron build
- 如果require module时未找到相关依赖会导致所在JS阻塞中断
- 非渲染进程/主进程模块node native module不会打包入内，需要启用子进程的话子进程JS的引用模块必须放置在dependencies中才可打包入内，node native module无法打包的问题暂时使用同功效第三方依赖进行替代。 e.g: http -> express.js
- ```package.json```引入额外静态资源
```json
{
  "build": {
    "extraResources": [
      {
        "from": "./static/assistants",
        "to": "assistants",
        "filter": ["**/*"]
      }
    ]
  }
}
```
- ```package.json```打包为免安装执行文件
```json
{
  "build": {
    "win": {
      "target": ["portable"]
    }
  }
}
```

---
### the default value of app.allowRendererProcessReuse is deprecated
```js
// main.js
app.on('ready', () => {
    app.allowRendererProcessReuse = true
})
```

--- 

### electron-vue vuex 无法 dispatch
- refs: 
  - https://github.com/SimulatedGREG/electron-vue/issues/733
  - https://github.com/SimulatedGREG/electron-vue/issues/794
- 由默认使用了```vuex-electron```的```createSharedMutations```插件引起
- 如果不需要使用多窗口共享状态时可注释掉该插件
  ```js
  // store.js
  export default new Vuex.Store({
    plugins: [
      createPersistedState(),
      createSharedMutations() //注释本行
    ],
    strict: process.env.NODE_ENV == 'production'
  })
  ```
- 如果需要进多窗口共享的话, 则在主进程```main.js/index.js```内引入```store```文件
  ```js
  // main.js
  import { app, BrowserWindow, ipcMain } from 'electron'
  import './renderer/store'
  ```

---
### 外部浏览器启动 electron app
```html
<!--外部 a.html-->
<a href="loadApp://"></a>
```
打包时修改```package.json```:
```json
{
  "build": {
    "nsis": {
      "include": "build/installer.nsh" 
    }
  }
}
```
在```build```文件夹下建立```installer.nsh```
```
!macro customInstall
WriteRegStr HKCR "loadApp" "URL Protocol" ""
WriteRegStr HKCR "loadApp" "" "URL:loadApp Protocol Handler"
WriteRegStr HKCR "loadApp\shell\Open\command" "" '"$INSTDIR\ElectronApp.exe" "%1"'
!macroend
```

---
### webview及通信
```js
// main.js
let mainWindow = new BrowserWindow({
    webPrefernces: {
        webviewTag: true //default false
    }
})
```
通信组件页
```vue
<template>
  <!--nodeintegration: allow use node in html-->
  <webview src="../static/b.html" nodeintegration></webview>
</template>
<script>
import { ipcRenderer } from 'electron'
export default {
  data () {
    return {
      webview: null
    }
  },
  
  mounted () {
    this.webviewInit()
  },
  
  methods: {
    webviewInit: function () {
      let vm = this
      vm.webview = document.querySelector('webview')
      vm.webview.addEventListener('dom-ready', () => {
        vm.webview.send('msg', 'wow') //向 webview发送信息 
      })
      vm.webview.addEventListener('ipc-message', event => { //接收webview的信息 
        if (event.channel === 'message') {
          
        }
      })
    }
  }
}
</script>
```
用于```webview```的HTML页面必须放在```static```下且在```package.json```以```extraResource```的形式引用打包
```html
<!-- static/b.html -->
<script>
   const { ipcRenderer } = require('electron')
   ipcRenderer.on('msg', (e, str) => {
      console.log(str === 'wow')
      ipcRenderer.sendToHost("message")  //向webview所在页面发送信息
   })
</script>
```

---
### 构建后的APP开启devtool
- 大于等于5.0：主进程开启
```js
// main/index.js
mainWindow.webContents.openDevTools()
```
- 5.0以下：渲染进程开启
```js
// renderer/main.js
import { remote } from 'electron'
remote.globalShortcut.register('CommandOrControl+Shift+K', () => {
    remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
})
window.addEventListener('beforeunload', () => {
    remote.globalShortcut.unregisterAll()
})
```

---

### 调用第三方软件
```js
// main/index.js
let path = require('path')
let exec = require('child_process').exec
let isDev = process.env.NODE_ENV === "development";
app.on('ready', async () => {
    startProgram()
})
function startProgram () {
    let p = isDev ? 
        path.join(__static, "/printer/printWin.exe")
        : path.join(__dirname, "../../../static/printer/printWin.exe");
    exec(p, (err, stdout, stderr) => {
        if (err) {}
    })
}
function exitProgram () {
    exec('taskkill /IM "printWin.exe" /F', (err, stdout, stderr) => {
        if (err) {
            throw err
        }
    })
}
```

---
### 自动更新
```js
import { autoUpdater } from 'electron-updater'
function undateHandle () {
    autoUpdater.setFeedURL("")
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        const dialog = require('electron').dialog
        const dialogOpts = {
            type: '更新提示',
            buttons: ['立即重启', '稍后重启'],
            title: '软件更新',
            message: process.platform === 'win32' ? releaseNotes : releaseName,
            detail: '当前检测到可用更新包，是否立即重启APP进行软件更新？'
        }
        dialog.showMessageBox(dialogOpts, response => {
            if (response === 0) autoUpdater.quitAndInstall()
        })
    })
    autoUpdater.checkForUpdates()
}
```
