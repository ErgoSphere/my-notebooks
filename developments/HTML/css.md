### [CSS权重](https://juejin.cn/post/6844904014962753544)
- **内联样式**：一个标记为1，依次累加-1-0-0-0-
- **ID选择器**：一个标记为1，依次累加-0-1-0-0-
- **class, 属性， 伪类(:hover, visited, link, active)**：有一个标记为1，依次累加-0-0-1-0-
- **伪元素(before, after)，元素标签**：-0-0-0-1-
- __通配选择器(*), +, >, ~__：不加权重
- <code>!important</code>高于所有未指定，多个规则中同一属性都指定的话则相抵，依照上述情况比较计算

---
### [BFC(Block Format context/块级格式化上下文)](https://www.cnblogs.com/chen-cong/p/7862832.html)
内部元素和外部元素互不影响
- 创建
    1. html根
    2. float
    3. 绝对定位
    4. overflow非visible
    5. display为table或flex
- 用处
    1. 清除浮动: 未定高度的父盒子内，子类float没有办法撑开父容器，给父容器加上<code>overflow: hidden</code>，可撑开父容器，因为需要计算父容器高度才能知道在哪个地方遮盖，所以触发了高度的重新计算
    2. 防止同一BFC相领元素外边距重叠

---
### [弹盒及响应式](https://www.jianshu.com/p/c6cae35e2b93) 
- **应用**
1. 居中DIV
2. flex-wrap对多个盒子自动换行
3. 在盒子内部自动做等份处理 flex: 1(grown 1, shrink 1, basis 0)

- **居中显示某个DIV**
1. BFC
   ```html
   <div class="container">
     <div class="col"></div>
     <div class="col"></div>
     <div class="col"></div>
   </div>
   <style>
     .col:nth-of-type(1), .col:nth-of-type(2) {
       width: 100px;
       height: 300px;
     }
     .col:nth-of-type(1) {
       float: left
     }
     .col:nth-of-type(2) {
       float: right
     }
     .col:nth-of-type(3) {
       overflow: hidden; // create BFC
       height: 300px
     }
   </style>
   ```
2. absolute + CSS3 (IE8不支持)
   ```html
   <div class="parent">
     <div class="children"></div>
   </div>
   <style>
     .parent {
       position: relative;
     }
     .children {
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
     }
   </style>
   ```
3. flex (IE9不支持)
   ```html
   <div class="parent">
     <div class="children"></div>
   </div>
   <style>
     .parent {
       display: flex;
       align-items: center;
       justify-content: center;
     }
   </style>
   ```
4. table-cell(IE8不支持)
   ```html
   <div class="parent">
     <div class="children"></div>
   </div>
   <style>
     .parent {
       display: table;
       width: 100%;
       height: 100%
     }
     .children {
       display: table-cell;
       vertical-align: middle;
       text-align: center;
     }
   </style>
   ```
5. 伪类: 仅适用于子类为点或线
   ```html
   <div class="parent">
     <div class="children"></div>
   </div>
   <style>
     .parent {
       width: 300px;
       height: 300px;
       text-align: center;
     }
     .parent::before {
       content: "";
       display: inline-block;
       width: 0;
       height: 100%;
       vertical-align: middle;
     }
     .children {
       display: inline-block;
     }
   </style>
   ```

---
### 响应式布局
- 常见方案：
  - 媒体查询``@media``
  - Flexbox
  - Grid
  - rem/vw
  - 框架方案：Bootstrap，TailwindCSS
- 各单位：
  + **px**: 绝对单位，精确按像素显示，chrome强制最小为12px, 可使用```transform: scale``` hack
  + **em**: 相对单位，基准为父节点字体大小，自身定义了font-size的话则整个页面1em都是不一样的值
  + **rem**(css3): 相对单位，类root em，根椐节点html字体大小计算(例<code>1 rem = document.documentElement.clientWidth/10 + "px"</code>)，chrome/firefox/IE9
  + **vw, vh**: 相对单位，视窗宽高，IE9+部份支持
  + **vmin, vmax**: vw和vh中较小/大的

---
### width 覆盖
min-width > max-width > width (即使!important)

---
### 小型大写字母
```css
* {
    font-variant: small-caps
}
```

---
### 代码规范（书写顺序）
1. 布局定位：```display```, ```position```, etc
2. 自身属性：```width```, ```background```, etc
3. 文本属性：```font```, ```color```, etc
4. 其它属性：``transition``, ``cursor``, etc

---
### FLIP动画处理
- [https://juejin.cn/post/6844903772968206350](https://juejin.cn/post/6844903772968206350)
- [https://codesandbox.io/s/react-picture-preview-flip-demo-m5zbm?file=/src/App.js](https://codesandbox.io/s/react-picture-preview-flip-demo-m5zbm?file=/src/App.js)

---
### CSS像素，物理像素, viewport等
1. **CSS像素(CSS pixels)：px**
- px是相对单位，相对于设备像素(Device pixel)，是一个抽象概念，在谈论时一定要清楚它的上下文
- 同一设备上1px对应物理像素可变化
2. **物理像素/设备像素/DP(device-pixels)**
- 单位pt，在css中属于绝对单位，```1pt = 1/72inch```
- 设备像素比```DPR = DP/CSS pixel```
3. **设备独立像素/逻辑像素(DIP, Device Independent Pixel)**
- ```CSS pixel = DIP```
- ```window.devicePixelRatio = DP/DIP = DP/CSS pixel```，所以由这个值能得到1个css像素可以代表多少个物理像素
4. **设备像素比/DPR(device pixels ratio)**
- 描述为**未缩放状态下**<code>物理像素</code>和<code>CSS像素</code>的**初始比例**关系
5. **PPI(pixels per inch)**
>主屏尺寸： 5.5inch
>
> 主屏分辨率：1920 X 1080
>
> ppi = 斜边尺寸/主屏尺寸 = sqrt(1920^2 + 1080^2)/5.5
6. **viewport**
- layout viewport的宽度可用<code>document.documentElement.clientWidth</code>得出，layout viewport的宽度大于浏览器可视区域宽度(visual viewport)
- visual viewport的宽度可用<code>window.innerWidth</code>得出
- ideal viewport, 理想的viewport, 无固定尺寸，在任意分辨率的屏幕下针对ideal viewport设计的网站不需要用户手动缩放或横向滚动条，都可以完美呈现效果给用户
- 移动设备默认为layout viewport，可通过meta标签转为ideal viewport
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```
- 动态设置meta viewport
```js
//方法1
document.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">')
//方法2, 已有meta viewport
document.getElementsByTagName("meta")[0].setAttribute("content", "width=device-width")
```

---
### 使用@2x, @3x的图片的场景
```devicePixelRatio = 2/3```的时候
```scss
  @mixin bg-image($url) {
    background-image: url($url + "@2x.png");
    @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
      background-image: url($url + "@3x.png")
    }
  }
  .logo {
    $size: 30px;
    width: $size;
    height: $size;
    background-size: $size $size;
    background-repeat: no-repeat;
    @include bg-iamge("logo")
  }
 ```

---
### 实现1物理像素(1dp)边框
1. 由<code>window.devicePixelRatio</code>或逆算出对应px值（可能导致浏览器取px差异，兼容性差
2. 媒体查询，有同上毛病，且为非标准特性, Float px values may render differently on different browsers
   ```css
   .border {
     border: 1px solid #999;
   }
   @media screen and (-webkit-min-device-pixel-ratio: 2) {
     .border {
       border: 0.5px solid #999;
     }
   }
   @media screen and (-webkit-min-device-pixel-ratio: 3) {
     .border {
       border: 0.333333px solid #999;
     }
   }
   ```
3. viewport + rem: 动态修改meta
   ```html
   <meta name="viewport" id="dynamicViewport" content="initial-scale=1, maximum-scale=1, user-scalable=no">
   ```
   ```js
   let vp = document.getElementById("dynamicViewport")  
   let value = (1/window.devicePixelRatio).toFixed(2)
   let content = "width=device-width, initial-scale=" + value + ", maximum-scale=" + value + ", minimum-scale=" + value + ", user-scalable=no"
   vp.setAttribute("content", content)
   //字体大小
   let docEl = document.documentElement
   let fontSize = 10 * (docEl.clientWidth/320) + "px"
   docEl.style.fontSize = fontSize
   ``` 
4. 使用border-image: 圆角可能模糊
   ```css
   border-image-1px {
     border-width: 1px 0;
     -webkit-border-image: url("border.png") 2 0 stretch;
     border-image: url("border.png") 2 0 stretch;
   }
   ```
5. background-image渐变：无法实现圆角
   ```css
   .border {
      background-image: linear-gradient(180deg, red, red 50%, transparent 50%), linear-gradient(270deg, red, red 50%, transparent 50%), linear-gradient(0deg, red, red 50%, transparent 50%), linear-gradient(90deg, red, red 50%, transparent 50%);
      background-size: 100% 1px,1px 100% ,100% 1px, 1px 100%;
      background-repeat: no-repeat;
      background-position: top, right top,  bottom, left top;
      padding: 10px;
   }
   ```
6. box-shadow: 不好控制深色
   ```css
   div {
     box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.5)
   }
   ```
7. transform scale + devicePixelRatio(或媒体查询)
   ```
   scaleY = 1 / devicePixelRatio
   ```

---
### webp显示问题
低版本safari不一定显示
```js
//检测是否支持webp
const webpSupport = () => {
  let elem = document.createElement("canvas")
  if (elem.getContext && elem.getContext("2d")) {
    return elem.toDataURL("image/webp").indexOf("data:image/webp") === 0
  } else {
    return false //old browser like IE8, canvas is not supported
  }
}
```

---
### 盒模型
- IE盒模型（border-box）: width包括padding和border，```width = content + border + padding```
- css盒模型 (content-box): width不包括padding和border，```width = content```

---
### 行内元素（inline）和块级元素（block）
- inline不以新行开始，block新起一行
- inline只包括text和其他行内元素，block可含inline和其他块级元素
- 区别：盒模型中inline不支持设置宽高，支持水平/垂直方向的padding/border/margin，但垂直方向上的值不影响布局

---
### 页面导入样式时，使用```link```和```@import```有什么区别
1. 从属关系区别。 ```@import```是 CSS 提供的语法规则，只有导入样式表的作用；```link```是HTML提供的标签，不仅可以加
载CSS文件，还可以定义```RSS```、```rel```连接属性、引入网站图标等。
2. 加载顺序区别。加载页面时，```link```标签引入的CSS被同时加载；```@import```引入的CSS将在页面加载完毕后被加载, 同时其他加载资源必须等import引入完毕才继续。
3. 兼容性区别。```@import```是```CSS2.1```才有的语法，故只可在```IE5+```才能识别；```link```标签作为HTML元素，不存在兼容性问题。
4. DOM可控性区别。可以通过JS操作DOM ，插入link标签来改变样式；由于DOM方法是基于文档的，无法使用@import 的方式插入样式。

---
### 图片显示模糊的解决方案
- 使用<code>@media screen</code> + <code>devicePixelRatio</code>对应的倍率图片(@2x/@3x)
  ```css
  .image {
    background-image: url("test.png");
  }
  @media screen and (-webkit-min-device-pixel-ratio: 2) {
    .image {
       background-image: url("test@2x.png");
    }
  }
  ```
- 使用svg
- 使用<code>image-set</code>
  ```css
  .image {
    background-image: -webkit-image-set("test.png" 1x, "text@2x.png" 2x);
  }
  ```
- 使用<code>img</code>标签的<code>srcset</code>属性，由浏览器自动根椐像素密码匹配显示
  ```html
  <img src="test.png" srcset="test@2x.png 2x, test@3x.png 3x" />
  ```

---
### head标签中必不可少的标签
- ```<title>```

---
###  回流（重排/reflow）和重绘(repaint)
- 回流：回流是布局或者几何属性需要改变。回流必定会发生重绘，重绘不一定会引发回流。
- 重绘：由于节点的集合属性发生改变或者由于样式改变而不会影响布局的，成为重绘，例如 outline、visibility、color、background-color 等
- 优化：
  - 避免使用强制渲染刷新队列的函数，如```width```, ```height```, ```getBoundingClientRect```, ````scrollTop````, ```offsetTop```等
  - 使用```visibility（重绘）```替换```display: none（回流）```
  - 避免使用```table```
  - 避免使用```css表达式（回流）```
  - 动画效果应用到```position```属性为```absolute```或```fixed```的元素上

---
### ```animation-timing-function```使用贝塞尔曲线
- ```animation-timing-function: cubic-bezier(x1, y1, x2, y2)```
- 运动快慢由斜率```k```决定，```k1 = y1/x1```，```k2 = y2/x2```
- ```k > 0```快，```k < 0```慢

---
### 元素隐藏
- ``display: no`` : 不渲染
- ``visibility: hidden``：占位，不响应绑定的监听事件
- ``opacity: 0``：占位，响应事件
- ``z-index负值``
- ``clip/clip-path``：占位，不响应事件
- ``transform: scale(0, 0)``: 占位，不响应事件

---
### ``Flex``布局
- 子元素的``float``、``clear``、``vertical-align``属性将失效
- ``flex: 1``(grown 1, shrink 1, basis 0): 内部自动等份处理

---
### 浏览器如何给一个页面元素匹配CSS选择器及提高效率
- 从右到左进行匹配，如``p sapn``，浏览器先找到所有的``<span>``，然后继续向上查找直到找到``<p>``。对于特定的``<span>``，找到明确的``<p>``越快效率越高
- 选择器链越短，查找越快
- 避免使用标签选择器或者全体选择器，因为他们会匹配大量的元素
- 推荐使用明确的``class``去做选择器
- 避免因改变样式(布局，几何属性)导致的回流

---
### 使用``transform: translate()``替代``position: absolute``
- ``translate``仍正常占用文档空间，仅导致重绘；``absolute``会脱离当前文档流，布局变化导致回流
  - ``transform``使浏览器调用GPU，因此有更高的效率，更短的绘制时间和丝滑的动画表现；而``absolute``仅使用CPU运算

---
### 其它问题
1.
>**Q**: fixed定位没有按照窗口视图
>
>**A**: 视先元素含有transition非none时，定位容器由视口改为该祖先
2.
>**Q**: transform对普通元素的影响
>
>**A**: 提升元素的垂直地位；限制子元素中的position: fixed的跟随效果(未根椐视窗作定位)


   