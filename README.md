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
[customiseControls.js](https://github.com/purestart/vue-fabric/blob/master/static/js/customiseControls.min.js).
[fabric5.js](https://github.com/purestart/vue-fabric/blob/master/static/js/fabric.min.js).
[datamatrix.js]().
[polyfill.min.js]().
[browser.min.js]().

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
import 'vuefabricmodule/dist/vue-fabric-module.css';
import vuefabricmodule from 'vuefabricmodule'
...
Vue.use(vuefabricmodule)
```

## 组件使用
> 使用格式
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
| Function    | Params | Description  |
| ----------- | ------ | ------------ |
|changeZoomTo | zoom   | 缩放大小回调 |

### 事件
> 使用格式
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

### 方法调用
> 调用格式
```
this.$refs.canvas.方法名(params)
```

 #### changeWH(options) 改变宽高，并且居中适配显示
 options:{}
| options        | Type   | Default             | Description   |
| -------------- | ------ | ------------------- | ------------- |
|width           | Number | this.width          | 重置宽        |
|height          | Number | this.height         | 重置高        |
|backgroundColor | String | this.backgroundColor| 重置画布颜色  |

 使用:
```
 this.$refs.canvas.changeWH({width: 1000, height: 800, backgroundColor: '#ff0'})
```

## Changelog

### 2022.05.16

> v0.0.1 \* 项目初始化

### 2022.05.17

> v0.0.2 \* 项目可引用

### 2022.05.18

> v0.0.3 \* 画布初始化，新增API和接口文档

### 2022.05.19

- 新增创建组件

