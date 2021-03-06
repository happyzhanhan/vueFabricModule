# vue-fabric-module

> vue-fabric-module :【基于vue2.0 fabric.js开发的画布组件，支持业务以下：创建圆形，矩形，文本，条码，二维码，图片，表格等等，画布的图册移动，隐藏，删除，画布的撤销、还原、缩放、对齐、居中、预览和保存等】The canvas component developed based on vue2.0 fabric.js supports the following businesses: creating circles, rectangles, texts, barcodes, QR codes, pictures, tables, etc., moving, hiding, deleting, and canceling canvases. Restore, zoom, align, center, preview and save, etc.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test

# use
npm install vuefabricmoudle --save
```
## 依赖
下载到本地 static/js/文件下
[customiseControls.js](https://github.com/happyzhanhan/vueFabricModule/blob/master/static/js/customiseControls.js).
[fabric5.js](https://github.com/happyzhanhan/vueFabricModule/blob/master/static/js/fabric5.js).
[datamatrix.js](https://github.com/happyzhanhan/vueFabricModule/blob/master/static/js/datamatrix.js).
[polyfill.min.js](https://github.com/happyzhanhan/vueFabricModule/blob/master/static/js/polyfill.min.js).
[browser.min.js](https://github.com/happyzhanhan/vueFabricModule/blob/master/static/js/browser.min.js).

## 在index.html引入
```
<script type="text/javascript" src="./static/js/polyfill.min.js"></script>
<script type="text/javascript" src="./static/js/browser.min.js"></script>

<script type="text/javascript" src="./static/js/fabric5.js"></script>
<script type="text/javascript" src="./static/js/customiseControls.js"></script>
<script type="text/javascript" src="./static/js/datamatrix.js"></script>
```

## 在main.js中引入
```
import 'vuefabricmodule/dist/vue-fabric-module.css'; //这个如果没有引入，则元素上鼠标右键不显示
import vuefabricmodule from 'vuefabricmodule'
...
Vue.use(vuefabricmodule)
```

如果需要动态生成条码和二维码
```
import JsBarcode from 'jsbarcode'
import jrQrcode from 'jr-qrcode'
...
new Vue({
  el: '#app',
  ...
  JsBarcode,  
  jrQrcode,
  ...
  })
```

## 组件使用
使用格式
```
<vuefabricmodule ref="canvas" :width="parseInt(width)" :height="parseInt(height)" :boxWidth="1200" :boxHeight="800" :zoom="parseFloat(zoom)" showRule="ALL" :backgroundColor="background" @changeZoomTo="changeZoomTo"></vuefabricmodule>
```
### 默认参数
| Name            | Type   | Default                            | Description   |
| --------------- | ------ | ---------------------------------- | ------------- |
| width           | Number | 300                                | 画布宽        |
| height          | Number | 200                                | 画布高        |
| backgroundColor | String | #fff                               | 画布颜色      |
| boxWidth        | Number | 1200                               | 窗口宽        |
| boxHeight       | Number | 800                                | 窗口高        |
| BgColor         | String | #f1f1f1                            | 窗口背景颜色  |
| zoom            | Number | 1                                  | 缩放比        |
| showRule        | String | NONE(ALL,NONE,HORIZONTAL,VERTICAL) | 标尺          |

### 回调函数
| Function    | Params    | Description     |
| ----------- | ------    | ------------    |
|changeZoomTo | zoom      | 缩放大小回调    |
|deleteidsdata| [id]      | 回调删除的元素id|
|canvasToData | name, obj | 键盘移动回调|


### 事件
使用格式
```
 <vuefabricmodule ref="canvas" @mouse:down="mouseDown" ></vuefabricmodule>
```

#### 鼠标事件

| name           | Type  | Description    |
| -------------- | ----- | -------------- |
| mouse:down     | event | mouse down     |
| mouse:up       | event | mouse up       |
| mouse:move     | event | mouse move     |
| mouse:dblclick | event | mouse dblclick |
| mouse:over     | event | mouse over     |
| mouse:out      | event | mouse out      |

#### 其它事件

| name                     | Type  | Description                                    |
| ------------------------ | ----- | ---------------------------------------------- |
| selection:created        | event | 选中 canvas 元素对象，单选和多选都会触发此事件  |
| selection:updated        | event | selection updated                              |
| selection:cleared        | event | selection cleared                              |
| before:selection:cleared | event | before selection cleared                       |
| object:added             | event | 当有元素被添加进来时候触发                      |
| object:removed           | event | object removed                                 |
| object:modified          | event | object modified                                |
| object:rotating          | event | object rotating                                |
| object:scaling           | event | object scaling                                 |
| object:moving            | event | object moving                                  |
| object:rotated           | event | object rotated                                 |
| object:scaled            | event | object scaled                                  |
| object:moved             | event | object moved                                   |

### 方法调用
调用格式：
```
this.$refs.canvas.方法名(params)
```

> changeWH(options) 改变宽高，并且居中适配显示

 options:{}
 
| options        | Type   | Default             | Description   |
| -------------- | ------ | ------------------- | ------------- |
|width           | Number | this.width          | 重置宽        |
|height          | Number | this.height         | 重置高        |
|backgroundColor | String | this.backgroundColor| 重置画布颜色  |

 使用：
```
 this.$refs.canvas.changeWH({width: 1000, height: 800, backgroundColor: '#ff0'})
```

> changeBackgroundColor(color) 仅改变画布颜色

参数：

| options        | Type    | Default             | Description                                  |
| -------------- | ------  | ------------------- | -------------------------------------------- |
| color          | String  | '#fff'              | 画布颜色                                     |

 使用：
```
 this.$refs.canvas.changeBackgroundColor('#ff0')
```

> changemoveing(bol) 改变画布操作状态是 抓手：可以移动、缩放，不可选择， 箭头：不可移动缩放，可选择

参数：

| options        | Type    | Default             | Description                                  |
| -------------- | ------  | ------------------- | -------------------------------------------- |
| bol            | Boolean | false               | true:可以移动缩放抓手，false:不可移动缩放箭头 |

 使用：
```
 this.$refs.canvas.changemoveing(true)
```

> changeLeftTop() 按当前比例左上对齐窗口

参数：无

 使用：
```
 this.$refs.canvas.changemoveing()
```

> changeOrigin() 按当前比例居中对齐窗口

参数：无

 使用：
```
  this.$refs.canvas.changeOrigin()
```

> changeBigZoom() 画布适配当前窗口

参数：无

 使用：
```
  this.$refs.canvas.changeBigZoom()
```

> changeOneZoom() 画布1:1居中显示

参数：无

 使用：
```
  this.$refs.canvas.changeOneZoom()
```

> getEditObj() 获取当前活跃的元素

参数：无

 使用：
```
  this.$refs.canvas.getEditObj()
```

> removeEditObj() 删除当前活跃的元素（右键调用此）

参数：无

 使用：
```
  this.$refs.canvas.removeEditObj()
```

> setActiveObject(obj) 设置元素为活跃元素

参数：
obj

 使用：
```
  this.$refs.canvas.setActiveObject(obj)
```

> copypaste() 复制粘贴活跃元素，坐标往右下偏移10像素（右键调用此）

参数：无

 使用：
```
  this.$refs.canvas.copypaste()
```

> getObjectsNew() 获取画布所有元素

参数：无

 使用：
```
  this.$refs.canvas.getObjectsNew()
```


> discardActive() 画布所有元素取消活跃状态

参数：无

 使用：
```
  this.$refs.canvas.discardActive()
```


> createElement(name, options) 画布创建元素

参数：

| name         | options| default             | Description   |
| ------------ | ------ | ------------------- | ------------- |
|Rect          | width,height, | {width:xx,height:xx,}                  | 矩形          |
|Rectangle     | width,height, | {width:xx,height:xx,}                  | 圆角矩形      |
|Parallelogram | width,height, | {width:xx,height:xx,}                  | 平行四边形    |
|Circle        | width,height, | {width:xx,height:xx,}                  | 椭圆形        |
|EqualCircle   | width,height, | {width:xx,height:xx,}                  | 正圆          |
|Dottedline    | width,height, | {width:xx,height:xx,}                  | 线段          |
|EqualTriangle | width,height, | {width:xx,height:xx,}                  | 等边三角形    |
|star          | width,height, | {width:xx,height:xx,}                  | 五角星        |
|Hexagon       | width,height, | {width:xx,height:xx,}                  | 正六边形      |
|Image         | width,height, | {width:xx,height:xx,}                  | 图片          |
|Icon          | width,height, | {width:xx,height:xx,}                  | 静态图片      |
|equalImage    | width,height, | {width:xx,height:xx,}                  | 保持居中的图片|
|Barcode       | width,height, | {width:xx,height:xx,}                  | 条码          |
|Qrcode        | width,height, | {width:xx,height:xx,}                  | 二维码        |
|Time          | width,height, | {width:xx,height:xx,}                  | 时间文字      |
|Itext         | width,height, | {width:xx,height:xx,}                  | 当行编辑文本  |
|Textbox       | width,height, | {width:xx,height:xx,}                  | 文本域        |
|TextRect      | width,height, | {width:xx,height:xx,}                  | 限制宽高的文本|
|Html          | width,height, | {width:xx,height:xx,}                  | html          |
|table         | width,height, | {width:xx,height:xx,}                  | 表格          |

使用：
```
this.$refs.canvas.createElement(name, options)
```

> toHorizontalCenterDistribution() 水平居中分布

参数：无

对象：画布中的活跃对象

 使用：
```
  this.$refs.canvas.toHorizontalCenterDistribution()
```

> toVerticalCenterDistribution() 垂直居中分布

参数：无

对象：画布中的活跃对象

 使用：
```
  this.$refs.canvas.toVerticalCenterDistribution()
```

> toLeftAlign() 左对齐

参数：无

对象：画布中的活跃对象

 使用：
```
  this.$refs.canvas.toLeftAlign()
```

> toHorizontalCenterAlign() 水平居中对齐

参数：无

对象：画布中的活跃对象

 使用：
```
  this.$refs.canvas.toHorizontalCenterAlign()
```

> toRightAlign() 右对齐

参数：无

对象：画布中的活跃对象

 使用：
```
  this.$refs.canvas.toRightAlign()
```

> toTopAlign() 顶对齐

参数：无

对象：画布中的活跃对象

 使用：
```
  this.$refs.canvas.toTopAlign()
```

> toVerticalCenterAlign() 垂直居中对齐

参数：无

对象：画布中的活跃对象

 使用：
```
  this.$refs.canvas.toVerticalCenterAlign()
```

> toBottomAlign() 底对齐

参数：无

对象：画布中的活跃对象

 使用：
```
  this.$refs.canvas.toBottomAlign()
```

> moveToshow(object, index) 移动层级

参数：object, index


 使用：
```
  this.$refs.canvas.moveToshow(object, index)
```

> toCutObject(object) 画布单个元素预览

参数：object


 使用：
```
  this.$refs.canvas.toCutObject(object)
```

> toDataUrlImg 画布预览

参数：无


 使用：
```
  this.$refs.canvas.toDataUrlImg()
```

## Changelog

### 2022.05.16

> v0.0.1 \* 项目初始化

### 2022.05.17

> v0.0.2 \* 项目可引用

### 2022.05.18

> v0.0.3 \* 画布初始化，新增API和接口文档

- 新增api 改变画布宽高和颜色

### 2022.05.18

> v0.0.4 v0.0.5\* 新增API和接口文档,导出画布组件

- 新增api 改变画布操作状态是 抓手：可以移动、缩放，不可选择， 箭头：不可移动缩放，可选择
- 新增api 按当前比例左上对齐窗口
- 新增api 按当前比例居中对齐窗口
- 新增api 画布适配当前窗口
- 新增api 画布1:1居中显示

### 2022.05.19

> v0.0.6 \* 新增API和接口文档,新增组件，组件右键操作，部分键盘快捷键

- 新增api 仅改变画布颜色
- 新增api 获取当前活跃的元素
- 新增api 删除当前活跃的元素（右键调用此）
- 新增api 设置元素为活跃元素
- 新增api 复制粘贴活跃元素，坐标往右下偏移10像素（右键调用此）
- 新增api 获取画布所有元素
- 新增api 画布所有元素取消活跃状态
- 新增api 画布创建元素
- 新增回调函数 删除回调ids,键盘移动回调
- 新增功能 全局键盘事件（window.event.keyCode===46：delete删除所有活跃元素；37：左移1像素；38：上移1像素；39：右移1像素；40：下移1像素）
- 新增功能 元素右键事件（图层：上移一层，下移一层，置顶，置底；复制；删除）

### 2022.05.23

> v0.0.7 \* 新增API和接口文档,新增组件，验证复制和组团复制

- 新增的组件验证是否可以复制
- 条码和二维码的缩放图片重绘
- 鼠标感应元素，出现虚线框；移动元素，元素透明度降到0.8可以看到下面的图层
- 新增二维码创建的方法
- 新增条码创建的方法
- 新增表格创建的方法
- 示例中，监听窗口大小改变画布大小

### 2022.05.25

> v0.0.8 \* 修复画布的点击感应透明的问题,修复条码不能旋转的问题

### 2022.05.26

> v0.0.9 \* 新增API接口

- 新增api 水平居中分布
- 新增api 垂直居中分布
- 新增api 左对齐
- 新增api 水平居中对齐
- 新增api 右对齐
- 新增api 顶对齐
- 新增api 垂直居中对齐
- 新增api 底对齐 
- 新增api 移动层级

### 2022.05.27

> v0.0.11 \* 新增API接口

- 新增api 回调选择的id集合
- 新增api 新增根据ids id删除元素的接口
- 新增api 新增根据ids id设置元素活跃的接口
- 修复 宽高颜色设置的bug
- 背景颜色允许不填透明色，但是加边框
- 修复文本TextRect组件多选选择移动的bug

> v0.0.12 \* 修复bug

- 修复组合shift选择没有返回id
- 新增选择的id回调selectId
- 根据id删除新增动画效果

### 2022.05.30

> v0.0.13 \* 新增几个事件的回调
> v0.0.14 \* 页面渲染的方法和布局回调改变
> v0.0.15 \* getZoom获取当前缩放
> v0.0.16 \* canvasToData横纵对齐回调

### 2022.05.31

> v0.0.17 \* 新增api 画布预览和画布内组件切割生成图片

- Image元素换方法解决预览跨域报错

### 2022.06.02

> v0.0.18 \*新增api 文本自适应的类型改变和文字改变

- 修复二维码缩放图层置顶问题，文本条码图片新增图层参数

> v0.0.19 \* 新增api 文本退出编辑的
> v0.0.20
- 退出编辑修复取消选中文本的bug
> v0.0.21
- 多个文本编辑组件的退出编辑

### 2022.06.03
> v0.0.22 
- 修复文本的图层问题
> v0.0.23
- 修复图层排序问题
> v0.0.24
- 修复图层排序置顶置底问题
> v0.0.25
- 修复图层排序置顶置底问题