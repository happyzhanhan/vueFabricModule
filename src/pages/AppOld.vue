<template>
  <div id="app">
    <div>
      <inputSearchVue pname="width" v-model="width"></inputSearchVue>
      <inputSearchVue pname="height" v-model="height"></inputSearchVue>
      <inputSearchVue pname="background" v-model="background"></inputSearchVue>
      <button @click="changeWH">改变宽高颜色</button>
      <button @click="changecolor">改变背景颜色</button>
      <!-- <button @click="changebox">改变窗口大小</button> -->
      <button @click="getZoom">getZoom</button>
      <button @click="preview">预览</button>
      <button @click="cut">当前元素剪切</button>
      <button @click="$refs.canvas.setSrc($refs.canvas.getEditObj(), 'http://183.134.78.46:81/group1/M00/01/10/rBMAA2KHVGqAbqkLAAAMyF15P_k114.png')">改变url</button>
      <button @click="$refs.canvas.setSrc($refs.canvas.getEditObj(), 'http://183.134.78.46:81/group1/M00/01/10/rBMAA2KHXi6AeIf6AAAHJzlefYU987.png')">改变url</button>
    </div>
    <p>缩放：{{zoom}}</p>
    <div>
      <button @click="$refs.canvas.changemoveing(true)">可以移动</button>
      <button @click="$refs.canvas.changemoveing(false)">不可移动</button>
      |
      <button @click="$refs.canvas.changeLeftTop()">↖</button>
      <button @click="$refs.canvas.changeOrigin()">·</button>
      |
      <button @click="$refs.canvas.changeBigZoom()">适配</button>
      <button @click="$refs.canvas.changeOneZoom()">1:1</button>
      |
      <button @click="copy">复制</button>
      <button @click="$refs.canvas.paste()">粘贴</button>
      <button @click="$refs.canvas.copypaste()">复制粘贴</button>
      |
      <button @click="$refs.canvas.toTopLayer()">置顶</button>
      <button @click="$refs.canvas.toLastLayer()">上移一层</button>
      <button @click="$refs.canvas.toNextLayer()">下移一层</button>
      <button @click="$refs.canvas.toBottomLayer()">置底</button>

    </div>

    <div style="position: fixed; top:0; left:0; display: flex; flex-direction: column;">
      <button @click="draw('Rect')">矩形</button>
      <button @click="draw('Rectangle')">圆角矩形</button>
      <button @click="draw('Circle')">椭圆</button>
      <button @click="draw('Dottedline')">线段</button>
    </div>

    <div style="position: fixed; top:0; left:80px; display: flex; flex-direction: column;">
      <button @click="draw('Parallelogram')">平行四边形</button>
      <button @click="draw('EqualCircle')">正圆</button>
      <button @click="draw('EqualTriangle')">正三角形</button>
      <button @click="draw('star')">五角星</button>
      <button @click="draw('Hexagon')">六边形</button>
    </div>

    <div style="position: fixed; top:0; left:180px; display: flex; flex-direction: column;">
      <button @click="draw('Image')">Image</button>
      <button @click="draw('Icon')">Icon</button>
      <button @click="draw('duanImage')">duanImage</button>
      <button @click="draw('equalImage')">equalImage</button>
    </div>

    <div style="position: fixed; top:0; left:280px; display: flex; flex-direction: column;">
      <button @click="draw('Barcode')">Barcode</button>
      <button @click="draw('Qrcode')">Qrcode</button>
      <button @click="draw('tableList')">tableList</button>
    </div>

    <div style="position: fixed; top:0; left:380px; display: flex; flex-direction: column;">
      <button @click="draw('Text')">Text</button>
      <button @click="draw('Time')">Time</button>
      <button @click="draw('Itext')">Itext</button>
      <button @click="draw('Textbox')">Textbox</button>
      <button @click="draw('TextRect')">TextRect</button>
      <!-- <button @click="draw('TextRectBox')">TextRectBox</button> -->
      <button @click="draw('Html')">Html</button>
    </div>

     <div style="position: fixed; top:0; right:20px; display: flex; flex-direction: column;">
      <button @click="$refs.canvas.toHorizontalCenterDistribution()">水平居中分布</button>
      <button @click="$refs.canvas.toVerticalCenterDistribution()">垂直居中分布</button>
     </div>

    <div style="position: fixed; top:0; right:120px; display: flex; flex-direction: column;">
      <button @click="$refs.canvas.toTopAlign()">顶对齐</button>
      <button @click="$refs.canvas.toVerticalCenterAlign()">垂直居中对齐</button>
      <button @click="$refs.canvas.toBottomAlign()">底对齐</button>
     </div>

    <div style="position: fixed; top:0; right:220px; display: flex; flex-direction: column;">
      <button @click="$refs.canvas.toLeftAlign()">左对齐</button>
      <button @click="$refs.canvas.toHorizontalCenterAlign()">水平居中对齐</button>
      <button @click="$refs.canvas.toRightAlign()">右对齐</button>
     </div>

     <!-- <div style="position: fixed; top:0; left:480px; display: flex; flex-direction: column;">
      <button @click="draw('table')">table==tableList</button>
      <button @click="draw('tableView')">tableView</button>
      <button @click="draw('tableList')">tableList</button>
    </div> -->

    <div style="position: fixed; top:0; right:320px; display: flex; flex-direction: column;">
      <button @click="changeTextType">切换自适应</button>
      <button @click="changeTextStyle">改变文本换行</button>
      <button @click="$refs.canvas.exitEditing()">退出编辑</button>

      <button @click="setNewTable">改变表格</button>
     </div>

    <div style="position: fixed; top:0; left:480px; display: flex; flex-direction: column;">
      <button @click="draw('TextRect')">TextRect</button>
      <button @click="draw('textboxnew')">textboxnew</button>
     </div>

    <div style="position: fixed; top:300; right:20px; display: flex; flex-direction: column;">
      <p>id:{{curobj.id}}</p>
      <p>layer:{{curobj.layer}}</p>
      <p>isType:{{curobj.isType}}</p>
     </div>

    <!-- <router-view/> -->
    <div class="canvasbox" id="canvasbox" v-if="showcanvasbox">
    <vuefabricmodule ref="canvas" :idno="id" :width="parseInt(width)" :height="parseInt(height)" :boxWidth="boxWidth" :boxHeight="boxHeight" :zoom="parseFloat(zoom)" showRule="NONE" :backgroundColor="background" @changeZoomTo="changeZoomTo" @deleteidsdata="deleteidsdata" @idAdd="idAdd" @deleteId="deleteId" @selectId="selectId" @canvasToData="canvasToData" @object:rotated="objectrotated" @object:scaled="objectscaled" @object:moved="objectmoved" @object:modified="objectmodified"></vuefabricmodule>
    </div>
  </div>
</template>

<script>
import { debounce } from './utils/debounceThrottle.js' // 事件注册
import inputSearchVue from './components/inputSearch.vue'
import vuefabricmodule from './components/vuefabricmodule.vue'
export default {
  name: 'App',
  components: {
    inputSearchVue, vuefabricmodule
  },
  data () {
    return {
      id: 1,
      width: '2000',
      height: '600',
      boxWidth: 800,
      boxHeight: document.documentElement.clientHeight - 200,
      background: '#f0f',
      zoom: 1,
      showcanvasbox: true,
      curobj: {},
      textJSON: {
        DottedlineType: undefined,
        angle: 0,
        backgroundColor: '',
        barcodeType: undefined,
        barlineWidth: undefined,
        clipTo: null,
        col: undefined,
        color: '#0ff',
        component: 'component',
        content: undefined,
        copyId: undefined,
        eyeshow: true,
        fill: '#0ff',
        fillRule: 'nonzero',
        flipX: false,
        flipY: false,
        fontColor: undefined,
        fontSize: undefined,
        globalCompositeOperation: 'source-over',
        hasControls: true,
        height: 100,
        id: 2,
        imgText: undefined,
        isDiff: 'static',
        isElasticSize: undefined,
        isType: 'Rect',
        layer: undefined,
        layoutElementId: undefined,
        left: 296.19,
        lineColor: undefined,
        maxLines: undefined,
        minFontSize: undefined,
        name: 'Rect',
        ncol: undefined,
        newline: undefined,
        nrow: undefined,
        offsetLeft: undefined,
        offsetTop: undefined,
        omitStyle: undefined,
        omitStyleText: undefined,
        opacity: 1,
        originX: 'left',
        originXY: undefined,
        originY: 'top',
        paintFirst: 'fill',
        postfix: undefined,
        prefix: undefined,
        rectColor: undefined,
        row: undefined,
        rx: 0,
        ry: 0,
        scaleX: 1,
        scaleY: 1,
        screenIndex: 0,
        selectable: true,
        shadow: null,
        skewX: 0,
        skewY: 0,
        stroke: '',
        strokeDashArray: [0, 0],
        strokeDashOffset: 0,
        strokeLineCap: 'butt',
        strokeLineJoin: 'miter',
        strokeMiterLimit: 4,
        strokeWidth: 0,
        sysId: undefined,
        tableStyle: undefined,
        tables: undefined,
        textRectData: undefined,
        textback: undefined,
        textdemo: undefined,
        top: 300.42,
        transformMatrix: null,
        type: 'rect',
        version: '3.6.1',
        verticalSpace: undefined,
        visible: true,
        width: 200,
        xLeft: undefined,
        xRight: undefined,
        yBot: undefined,
        yTop: undefined,
        zIndex: 1
      }
    }
  },
  mounted () {
    let that = this
    window.onresize = function () {
      debounce(() => { // 防抖执行计算画布宽高
        that.changebox()
      }, 1000)
    }
  },
  methods: {
    // 改变画布窗口大小
    changebox () {
      this.$nextTick(() => {
        this.boxWidth = document.documentElement.clientWidth
        this.boxHeight = document.documentElement.clientHeight - 200
      })
    },
    // 改变宽高颜色
    changeWH () {
      console.log('width:', this.width, 'height:', this.height)
      this.$refs.canvas.changeWH({width: parseInt(this.width), height: parseInt(this.height), backgroundColor: this.background})
    },
    // 改变画布颜色
    changecolor () {
      this.$refs.canvas.changeBackgroundColor('')
    },
    // 点击画组件
    async draw (name) {
      // this.id = this.id + 1
      let canvaobj, options
      let colors = ['#0ff', '#00f', '#000', '#f00', '#ff0', '#fff', '#eee', '#ccc', '#efe', '#ef5']
      let i = (Math.random() + '').charAt(3)
      switch (name) {
        case 'Rect':
          options = {
            left: 10,
            top: 10,
            width: 200,
            height: 100,
            color: colors[i],
            opacity: 0.5,
            visible: true
          }
          break
        case 'Rectangle':
          options = {
            left: 220,
            top: 10,
            width: 200,
            height: 100,
            color: colors[i],
            visible: true
          }
          break
        case 'Circle':
          options = {
            left: 440,
            top: 10,
            width: 200,
            height: 100,
            color: colors[i],
            visible: true
          }
          break
        case 'Dottedline':
          options = {
            left: 660,
            top: 40,
            width: 200,
            height: 3,
            strokeWidth: 3,
            DottedlineType: 1,
            color: colors[i],
            visible: true
          }
          break

        case 'Image':
          let imgurl = 'http://img.daimg.com/uploads/allimg/201010/3-2010101J545.jpg' // 'http://183.134.78.46:81/group1/M00/01/10/rBMAA2KHQraAE4fbAAAIabvbb5U379.jpg'
          options = {
            left: 10,
            top: 200,
            width: 200,
            height: 100,
            src: imgurl,
            url: imgurl,
            opacity: 0.5,
            visible: true
          }
          // let img = await this.loadImage(imgurl)
          // console.log(img)
          break
        case 'Icon':
          let iconurl = 'http://img.daimg.com/uploads/allimg/201010/3-2010101J545.jpg'
          options = {
            left: 100,
            top: 200,
            width: 200,
            height: 100,
            src: iconurl,
            url: iconurl,
            visible: true
          }
          let iimg = await this.loadImage(iconurl)
          console.log(iimg)
          break
        case 'equalImage':
          let url = 'http://img.daimg.com/uploads/allimg/201010/3-2010101J545.jpg'
          options = {
            left: 220,
            top: 200,
            width: 200,
            height: 100,
            src: url,
            url: url,
            visible: true
          }
          let imgnew = await this.loadImage(url)
          console.log(imgnew)
          break

        case 'Barcode':
          options = {
            left: 60,
            top: 0,
            width: 500,
            height: 100,
            hasRotatingPoint: false,
            imgText: '69012345679',
            color: '#000',
            bgcolor: '#999',
            visible: true,
            angle: 0

          }
          break

        case 'Qrcode':
          options = {
            left: 200,
            top: 0,
            width: 500,
            height: 500,
            barcodeType: 0, // 0:原二维码 1:datamaxtri
            hasRotatingPoint: false,
            imgText: '69012345679',
            lineColor: '#ff0',
            bgcolor: '#f00',
            visible: true
          }
          break

        case 'Text':
          options = {
            left: 22,
            top: 500,
            fontFamily: '微软雅黑',
            width: 500,
            height: 300,
            fontSize: 20,
            textdemo: '我是Text',

            hasRotatingPoint: true,
            visible: true

            // fontWeight:'bold',
            //  linethrough:true,
            //  underline:true,
            //  fontStyle:"italic"

          }
          break
        case 'Time':
          options = {
            left: 150,
            top: 500,
            fontFamily: '微软雅黑',
            width: 500,
            fontSize: 20,
            textdemo: '2022.05.23 15:23:12',

            hasRotatingPoint: true,
            visible: true

            // fontWeight:'bold',
            //  linethrough:true,
            //  underline:true,
            //  fontStyle:"italic"

          }
          break
        case 'Itext':
          options = {
            left: 402,
            top: 500,
            fontFamily: '微软雅黑',
            width: 200,
            height: 200,
            fontSize: 20,
            textdemo: 'Itext',

            hasRotatingPoint: true,
            visible: true
          }
          break
        case 'Textbox':
          options = {
            left: 502,
            top: 500,
            fontFamily: '微软雅黑',
            width: 200,
            height: 200,
            fontSize: 20,
            textdemo: 'Textbox',

            hasRotatingPoint: true,
            visible: true
          }
          break

        case 'TextRect':
          options = {
            left: 100,
            top: 0,
            hasRotatingPoint: true,
            width: 400,
            height: 100,
            fontColor: '#000',
            rectColor: '',
            fill: '#fff',
            /* stroke:'#f00', */
            strokeWidth: 0,
            xLeft: 0,
            yTop: 0,
            xRight: 0,
            yBot: 0,
            fontFamily: '微软雅黑',

            visible: true,
            fontSize: 100,
            textdemo: '测试的',
            originXY: ['right', 'bottom'],

            isElasticSize: 0,

            maxLines: 3,
            omitStyleText: '...',
            omitStyle: 1,
            newline: '',
            minFontSize: 12,
            textAlign: 'left',
            verticalSpace: 0

            // fontWeight: 'bold',
            // linethrough: true,
            // underline: true,
            // fontStyle: 'italic'

          }
          break
        case 'textboxnew':
          options = {
            left: 22,
            top: 10,
            hasRotatingPoint: true,
            width: 50,
            height: 30,
            visible: true
          }
          break
        case 'TextRectBox':
          options = {
            left: 60,
            top: 29,
            angle: 0, // 外部
            barcodeType: 10,

            color: '#000000',
            conRealResult: 1,
            content: '思源黑体%在线显示文字多多展示会怎么样的显示清空呢',
            dateFormat: 'YYYY.MM.dd HH:mm:ss',
            decimalSeparator: '.',
            fieldCode: '',
            fillColor: '',
            fontSize: 14,
            fontType: '微软雅黑',
            height: 100,

            horizontalAlign: 0,
            verticalAlign: 0,

            icon: null,
            ifBold: 1,
            ifCondition: 0,
            ifItalic: 1,
            ifStrikeThrough: 1,
            ifUnderline: 1,

            itemOrder: 1,
            itemPictureNameId: null,
            layer: 0,

            textAdvanceProperty: 0, // 是否自适应
            verticalSpace: 0,
            lineBreak: '%',
            maxLines: 2,
            minFontSize: 12,
            omitStyle: 1,

            postfix: '/500g',
            prefix: '$',

            scaleX: 0,
            scaleY: 0,
            screenIndex: 0,
            templateBaseId: 790,
            thousandSeparator: ',',
            type: 1,

            width: 500,

            visible: true
          }
          break
        case 'Html':
          options = {
            left: 200,
            top: 40,
            width: 186,
            height: 50,
            fontSize: 16,
            content: '',
            visible: true
          }
          break

        case 'table':
          options = {
            left: 800,
            top: 40,
            visible: true
          }
          break
        case 'tableView':
          options = {
            left: 600,
            top: 40,
            width: 186,
            height: 50,
            fontSize: 16,
            content: '',
            visible: true
          }
          break
        case 'tableList':
          options = {
            left: 0,
            top: 0,
            width: 186,
            height: 50,
            visible: true,

            tabledata: {
              tableinfo: {
                id: this.id,
                sysId: null,
                layer: this.id,
                layoutElementId: this.id,
                layoutId: null,

                left: 0,
                top: 0,
                width: 184,
                height: 134,

                row: 3,
                col: 3,
                titleLineHeight: 52,
                bodyLineHeight: 40,
                times: 5,
                animate: 0,
                borderWidth: 1,
                borderColor: '#00FF00',
                borderType: 0,
                bgColors: ['#A4CFFC', '#AACF98']

              },
              tableList: [{
                id: null,
                layoutTableInformationId: null,
                type: 0,
                col: 1,
                width: 60,
                height: 50,
                fontType: '微软雅黑',
                fontSize: 20,
                fontColor: '#FFFFFF',
                value: 'Title',
                bgColor: '#0000FF',
                position: 5,
                fieldCode: 'itemTitle',
                fieldType: 0
              }, {
                id: null,
                layoutTableInformationId: null,
                type: 0,
                col: 2,
                width: 60,
                height: 50,
                fontType: '微软雅黑',
                fontSize: 20,
                fontColor: '#FFFFFF',
                value: 'Title',
                bgColor: '#0000FF',
                position: 5,
                fieldCode: 'price',
                fieldType: 1
              }, {
                id: null,
                layoutTableInformationId: null,
                type: 0,
                col: 3,
                width: 60,
                height: 50,
                fontType: '微软雅黑',
                fontSize: 20,
                fontColor: '#FFFFFF',
                value: 'Title',
                bgColor: '#0000FF',
                position: 5,
                fieldCode: 'unit',
                fieldType: 1
              }, {
                id: null,
                layoutTableInformationId: null,
                type: 1,
                col: 1,
                width: 60,
                height: 40,
                fontType: '微软雅黑',
                fontSize: 14,
                fontColor: '#000000',
                value: 'DATA',
                bgColor: '#EEEEEE',
                position: 5,
                fieldCode: 'itemTitle',
                fieldType: 0
              }, {
                id: null,
                layoutTableInformationId: null,
                type: 1,
                col: 2,
                width: 60,
                height: 40,
                fontType: '微软雅黑',
                fontSize: 14,
                fontColor: '#ff0000',
                value: 'DATA',
                bgColor: '#EEEEEE',
                position: 5,
                fieldCode: 'price',
                fieldType: 1
              }, {
                id: null,
                layoutTableInformationId: null,
                type: 1,
                col: 3,
                width: 60,
                height: 40,
                fontType: '微软雅黑',
                fontSize: 12,
                fontColor: '#000000',
                value: 'DATA',
                bgColor: '#EEEEEE',
                position: 9,
                fieldCode: 'unit',
                fieldType: 1
              }]
            }
          }
          break
        default:
          options = {
            left: 0,
            top: 0,
            visible: true
          }
      }
      // options.id = JSON.parse(JSON.stringify(this.id))
      console.warn('创建类型：', name)
      options.id = this.id
      canvaobj = await this.$refs.canvas.createElement(name, options)
      console.log('canvaobj:', canvaobj.id)
      this.id = this.id + 1
      // canvaobj.setControlsVisibility({
      //   mtr: false
      // })
      console.log(this.$refs.canvas.toJson(), this.$refs.canvas.getObjectsNew())
      this.textJSON = this.$refs.canvas.toJson(canvaobj)
    },
    loadImage (url) {
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.setAttribute('crossOrigin', 'Anonymous')
        img.src = url
        img.onload = async () => {
          resolve(img)
        }
        img.onerror = async (err) => {
          reject(err)
        }
      })
    },
    deleteidsdata (ids) {
      console.log('删除的id', ids)
    },
    canvasToData (obj, name) {
      console.log('键盘移动回调：', name, obj)
    },
    objectrotated (obj) {
      console.log('objectrotated', obj)
    },
    objectscaled (obj) {
      console.log('objectscaled', obj)
    },
    objectmoved (obj) {
      console.log('objectmoved', obj)
    },
    objectmodified (obj) {
      console.log('0 --- objectmodified', obj)
    },
    // 新增回调
    idAdd (id) {
      console.log('新增id:', id)
    },
    // 删除回调
    deleteId (ids) {
      console.log('删除id:', ids)
    },
    // 选择回调
    selectId (ids) {
      console.log('选择id:', ids)
      if (ids.length === 1) {
        this.curobj = this.$refs.canvas.getEditObj()
      } else {
        this.curobj = {}
      }
    },
    // 缩放回调
    changeZoomTo (zoom) {
      this.zoom = parseFloat(zoom.toFixed(2))
    },
    copy () {
      let copydata = this.$refs.canvas.copyData()
      console.log(copydata)
    },
    // 获取坐标的
    getLocalPointer () {
      this.$refs.canvas.getLocalPointer()
    },
    getZoom () {
      console.log(this.$refs.canvas.getZoom())
    },
    async preview () {
      let img = await this.$refs.canvas.toDataUrlImg()
      console.log('preview', img)
    },
    async cut () {
      let obj = this.$refs.canvas.getEditObj()
      console.log(obj)
      let img = await this.$refs.canvas.toCutObject(obj)
      console.log('cut', img)
    },
    changeTextType () {
      let obj = this.$refs.canvas.getEditObj()
      if (obj.isType !== 'TextRect') { return }
      if (obj.isElasticSize === 0) {
        obj.isElasticSize = 2
      } else {
        obj.isElasticSize = 0
      }
      this.$refs.canvas.changeTextType(obj, 'text123456')
    },
    changeTextStyle () {
      let obj = this.$refs.canvas.getEditObj()
      if (obj.isType !== 'TextRect') { return }
      if (obj.isElasticSize === 0) {
        obj.text.maxLines = 2
        obj.text.verticalSpace = 100
        obj.text.omitStyleText = '…'
        obj.text.newline = '|'
        this.$refs.canvas.textIsUsually(obj, '我|是一段文字我想看看|看切换换行的效果等等问题哦')
      }
      // this.$refs.canvas.renderCanvas() // 画布渲染变化
    },
    // 重置表格
    setNewTable () {
      let cur = this.$refs.canvas.getEditObj()
      console.log('setNewTable', cur)
      let table = {
        tableinfo: {
          id: this.id,
          sysId: null,
          layer: this.id,
          layoutElementId: this.id,
          layoutId: null,

          left: 0,
          top: 0,
          width: 184,
          height: 134,

          row: 3,
          col: 3,
          titleLineHeight: 52,
          bodyLineHeight: 40,
          times: 5,
          animate: 0,
          borderWidth: 1,
          borderColor: '#ff0000',
          borderType: 0,
          bgColors: ['#A4CFFC', '#AACF98']

        },
        tableList: [{
          id: null,
          layoutTableInformationId: null,
          type: 0,
          col: 1,
          width: 60,
          height: 50,
          fontType: '微软雅黑',
          fontSize: 20,
          fontColor: '#ff0000',
          value: 'Title',
          bgColor: '#FAF6C1',
          position: 5,
          fieldCode: 'itemTitle',
          fieldType: 0
        }, {
          id: null,
          layoutTableInformationId: null,
          type: 0,
          col: 2,
          width: 60,
          height: 50,
          fontType: '微软雅黑',
          fontSize: 20,
          fontColor: '#ff0000',
          value: 'Title',
          bgColor: '#FAF6C1',
          position: 5,
          fieldCode: 'price',
          fieldType: 1
        }, {
          id: null,
          layoutTableInformationId: null,
          type: 0,
          col: 3,
          width: 60,
          height: 50,
          fontType: '微软雅黑',
          fontSize: 20,
          fontColor: '#ff0000',
          value: 'Title',
          bgColor: '#FAF6C1',
          position: 5,
          fieldCode: 'unit',
          fieldType: 1
        }, {
          id: null,
          layoutTableInformationId: null,
          type: 1,
          col: 1,
          width: 60,
          height: 40,
          fontType: '微软雅黑',
          fontSize: 14,
          fontColor: '#000000',
          value: 'DATA',
          bgColor: '#EEEEEE',
          position: 5,
          fieldCode: 'itemTitle',
          fieldType: 0
        }, {
          id: null,
          layoutTableInformationId: null,
          type: 1,
          col: 2,
          width: 60,
          height: 40,
          fontType: '微软雅黑',
          fontSize: 14,
          fontColor: '#ff0000',
          value: 'DATA',
          bgColor: '#EEEEEE',
          position: 5,
          fieldCode: 'price',
          fieldType: 1
        }, {
          id: null,
          layoutTableInformationId: null,
          type: 1,
          col: 3,
          width: 60,
          height: 40,
          fontType: '微软雅黑',
          fontSize: 12,
          fontColor: '#000000',
          value: 'DATA',
          bgColor: '#EEEEEE',
          position: 9,
          fieldCode: 'unit',
          fieldType: 1
        }]
      }
      this.$refs.canvas.setNewTable(cur, table)
    }

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.canvasbox{
  width: 800px;
  /* height: 800px; */
  overflow: auto;
  margin: 0 auto;
  border:1px solid #ddd;
}
/*新样式 统一滚动条*/
::-webkit-scrollbar {
    width: 8px;
    height: 10px;
    background-color: #ebeef5;
}
::-webkit-scrollbar-thumb {
    border-radius:20px;
    /*box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);*/
    background-color: rgba(160, 160, 160, .61);
    cursor: pointer;
}
::-webkit-scrollbar-track{
    /*box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);*/
    border-radius: 10px;
    background:rgba(216, 216, 216, 0.5);
}
</style>
