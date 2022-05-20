<template>
  <div id="app">
    <div>
      <inputSearchVue pname="width" v-model="width"></inputSearchVue>
      <inputSearchVue pname="height" v-model="height"></inputSearchVue>
      <inputSearchVue pname="background" v-model="background"></inputSearchVue>
      <button @click="commit">改变宽高</button>
      <button @click="changecolor">改变背景颜色</button>
      <button @click="changebox">改变窗口大小</button>
      <button @click="createImgae">createImgae</button>
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

    </div>

    <div style="position: fixed; top:0; left:0; display: flex; flex-direction: column;">
      <button @click="draw('Rect')">矩形</button>
      <button @click="draw('Rectangle')">圆角矩形</button>
      <button @click="draw('Circle')">椭圆</button>
      <button @click="draw('Dottedline')">线段</button>
    </div>

    <!-- <div style="position: fixed; top:0; left:80px; display: flex; flex-direction: column;">
      <button @click="draw('Parallelogram')">平行四边形</button>
      <button @click="draw('EqualCircle')">正圆</button>
      <button @click="draw('EqualTriangle')">正三角形</button>
      <button @click="draw('star')">五角星</button>
      <button @click="draw('Hexagon')">六边形</button>
    </div> -->

    <div style="position: fixed; top:0; left:180px; display: flex; flex-direction: column;">
      <button @click="draw('Image')">Image</button>
      <button @click="draw('Icon')">Icon</button>
      <button @click="draw('duanImage')">duanImage</button>
      <button @click="draw('equalImage')">equalImage</button>
    </div>

    <!-- <router-view/> -->
    <div class="canvasbox" id="canvasbox" v-if="showcanvasbox">
    <vuefabricmodule ref="canvas" :idno="id" :width="parseInt(width)" :height="parseInt(height)" :boxWidth="boxWidth" :boxHeight="boxHeight" :zoom="parseFloat(zoom)" showRule="ALL" :backgroundColor="background" @changeZoomTo="changeZoomTo" @deleteidsdata="deleteidsdata" @idAdd="idAdd" @canvasToData="canvasToData" ></vuefabricmodule>
    </div>
  </div>
</template>

<script>
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
      boxWidth: document.documentElement.clientWidth,
      boxHeight: document.documentElement.clientHeight - 200,
      background: '#f0f',
      zoom: 1,
      showcanvasbox: true,
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
      that.changebox()
    }
  },
  methods: {
    // 改变画布窗口大小
    changebox () {
      this.boxWidth = document.documentElement.clientWidth
      this.boxHeight = document.documentElement.clientHeight - 200
      this.showcanvasbox = false
      setTimeout(() => {
        this.showcanvasbox = true
      }, 100)
    },
    commit () {
      console.log('width:', this.width, 'height:', this.height)
      this.$refs.canvas.changeWH({width: parseInt(this.width), height: parseInt(this.height), backgroundColor: this.background})
    },
    changecolor () {
      this.$refs.canvas.changeBackgroundColor('#f00')
    },
    changeZoomTo (zoom) {
      this.zoom = parseFloat(zoom.toFixed(2))
    },
    // 点击画组件
    async draw (name) {
      this.id = this.id + 1
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
          let imgurl = 'http://183.134.78.46:81/group1/M00/01/10/rBMAA2KHQraAE4fbAAAIabvbb5U379.jpg'
          options = {
            left: 10,
            top: 10,
            width: 200,
            height: 100,
            src: imgurl,
            url: imgurl,
            visible: true
          }
          let img = await this.loadImage(imgurl)
          console.log(img)
          break
        case 'equalImage':
          let url = 'http://183.134.78.46:81/group1/M00/01/10/rBMAA2KHVGqAbqkLAAAMyF15P_k114.png'
          options = {
            left: 10,
            top: 10,
            width: 200,
            height: 100,
            src: url,
            url: url,
            visible: true
          }
          let imgnew = await this.loadImage(url)
          console.log(imgnew)
          break

        case 'TextRect':
          options = {
            left: 22,
            top: 10,
            hasRotatingPoint: true,
            width: 400,
            height: 100,
            fontColor: '#f00',
            rectColor: '',
            /* stroke:'#f00', */
            strokeWidth: 0,
            xLeft: 0,
            yTop: 0,
            xRight: 0,
            yBot: 0,
            fontFamily: '微软雅黑',
            textAlign: 'right',
            maxLines: 3,
            omitStyleText: '...',
            omitStyle: 1,
            newline: '',
            minFontSize: 12,
            isElasticSize: 2,
            visible: true,
            fontSize: 20,
            textdemo: '123',
            originXY: ['right', 'bottom']

            // fontWeight:'bold',
            //  linethrough:true,
            //  underline:true,
            //  fontStyle:"italic"

          }
          break

        case 'TextRectBox':
          options = {
            left: 60,
            top: 29,
            angle: 0, // 外部
            barcodeType: 10,

            /* borderColor: "#f00",
                    borderType: 3,
                    lineWeight: 5, */

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
            ifBold: 0,
            ifCondition: 0,
            ifItalic: 0,
            ifStrikeThrough: 0,
            ifUnderline: 0,

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
        case 'Barcode':
          options = {
            left: 60,
            top: 40,
            width: 200,
            height: 30,
            hasRotatingPoint: false,
            imgText: '69012345679',
            color: '#f00',
            visible: true

          }
          break
        case 'Qrcode':
          options = {
            left: 100,
            top: 40,
            width: 50,
            height: 50,
            barcodeType: 1,
            hasRotatingPoint: false,
            imgText: '69012345679',
            color: '#f00',
            lineColor: '#ff0000',
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
        default:
          options = {
            left: 0,
            top: 0,
            visible: true
          }
      }
      options.id = JSON.parse(JSON.stringify(this.id))
      canvaobj = await this.$refs.canvas.createElement(name, options)
      console.log('canvaobj:', canvaobj)
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
    idAdd () {
      console.log('复制新增')
    },
    copy () {
      let copydata = this.$refs.canvas.copyData()
      console.log(copydata)
    },
    // 获取坐标的
    getLocalPointer () {
      this.$refs.canvas.getLocalPointer()
    },
    createImgae () {
      let url = 'http://183.134.78.46:81/group1/M00/01/10/rBMAA2KHVGqAbqkLAAAMyF15P_k114.png'
      let options = {
        left: 10,
        top: 10,
        width: 200,
        height: 100,
        src: url,
        url: url,
        visible: true
      }
      this.$refs.canvas.createImage(url, options)
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
  width: 100%;
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
