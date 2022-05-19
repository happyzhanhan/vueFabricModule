<template>
 <div class="bigbox" id="bigbox"  @contextmenu="showMenu">
  <canvas id="canvas" ></canvas>
  <vue-context-menu :contextMenuData="contextMenuData"
                    @toTopLayer="toTopLayer" @toLastLayer="toLastLayer" @toNextLayer="toNextLayer" @toBottomLayer="toBottomLayer"
                    @removeEditObj="removeEditObj" @copypaste="copypaste">
  </vue-context-menu>
 </div>
</template>

<script>
import html2canvas from 'html2canvas'
import vueContextMenu from '../examples/contextmenu.vue'

// import { on, off } from '../examples/event' // 事件监听
// import Utils from '../utils/utils'
// import initAligningGuidelines from '../utils/guidelines'
// require('../../static/js/fabric5.js')

export default {
  name: 'vuefabricmodule',
  components: {vueContextMenu, html2canvas},
  props: {
    width: {
      type: Number,
      default: 300
    },
    height: {
      type: Number,
      default: 200
    },
    boxWidth: {
      type: Number,
      default: 1200
    },
    boxHeight: {
      type: Number,
      default: 800
    },
    // 画布颜色
    backgroundColor: {
      type: String,
      default: '#ff0',
      required: false
    },
    // 遮罩颜色
    BgColor: {
      type: String,
      default: '#E1E6F6',
      required: false
    },
    showRule: {
      type: String,
      default: 'NONE'
    },
    // 初始化缩放比
    zoom: {
      type: Number,
      default: 1
    },
    showMouseRight: {
      type: Boolean,
      default: true
    },
    idno: {
      type: Number,
      default: 1,
      required: true
    }
  },
  data () {
    return {
      name: 'canvas',
      canvas: null,
      canvasZoom: 1,
      contextMenuData: {
        menuName: 'demo',
        axis: {
          x: null,
          y: null
        },
        menulists: [
          {
            fnHandler: '',
            icoName: 'fa fa-home fa-fw',
            btnName: '图层',
            children: [
              {
                fnHandler: 'toLastLayer',
                icoName: 'fa fa-home fa-fw',
                btnName: this.$t('m.MoveUpALayer')
              },
              {
                fnHandler: 'toNextLayer',
                icoName: 'fa fa-home fa-fw',
                btnName: this.$t('m.DownALayer')
              },
              {
                fnHandler: 'toTopLayer',
                icoName: 'fa fa-home fa-fw',
                btnName: this.$t('m.OnTheTopFloor')
              },
              {
                fnHandler: 'toBottomLayer',
                icoName: 'fa fa-home fa-fw',
                btnName: this.$t('m.AtTheBottom')
              }
            ]
          },
          {
            fnHandler: 'copypaste',
            icoName: 'fa fa-home fa-fw',
            btnName: this.$t('m.copy')
          },
          {
            fnHandler: 'removeEditObj',
            icoName: 'fa fa-home fa-fw',
            btnName: this.$t('m.delete')
          }
        ]
      },
      isMoveing: false, // 抓手可移动画布 ，箭头不可移动画布
      panning: false,
      cid: 1 // 底层获取id
    }
  },
  watch: {
    isMoveing (val, oldval) {
      if (val) {
        this.setCursor(2)
      } else {
        this.setCursor(99)
      }
    },
    idno (val, oldval) {
      this.cid = val
    }
  },
  mounted () {
    // eslint-disable-next-line no-undef
    this.canvas = new fabric.Canvas('canvas', { preserveObjectStacking: true })
    let canvas = this.canvas
    // initAligningGuidelines(canvas) // 辅助线问题
    canvas.controlsAboveOverlay = false
    canvas.skipOffscreen = true
    canvas.preserveObjectStacking = true
    canvas.selection = true // 不允许多选false;允许多选true
    canvas.selectionColor = 'rgba(0,98,178,0)' // 选择框样式定制
    canvas.selectionDashArray = [8, 3]
    canvas.selectionBorderColor = 'rgba(0,98,178,1)'
    canvas.selectionLineWidth = 2
    canvas.backgroundColor = this.BgColor
    // eslint-disable-next-line no-undef
    fabric.Canvas.prototype.rotationCursor = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5NzBBQTBGQ0Y4ODcxMUVBQURGNkU5NzQ3OUY4RTA5NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5NzBBQTBGREY4ODcxMUVBQURGNkU5NzQ3OUY4RTA5NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjk3MEFBMEZBRjg4NzExRUFBREY2RTk3NDc5RjhFMDk2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjk3MEFBMEZCRjg4NzExRUFBREY2RTk3NDc5RjhFMDk2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+QUJwRwAAAytJREFUeNrsVk1oGkEUXqVIqCRIhVICEsSTkFuwEPDaWiQ9NaQx6VGRaqCHQATBEFMKKUoLos0h4LV4aWxCbyqhEbx4CJJCwJMJRKVWxJ/EkJ/X9yabZd2oay+hhX7wsbPz3sybmTfv21UAAHdXUHJ3iL8rmEKh0CHdyASyhAQRC8gQ0izyNyCD9Lw1GeWsFxFvdDoduN1uSCQSUCqVQIxCoQChUAjMZjM5B5DTw8PDEAwG6f3Trfl6BFEgQzMzM3BwcAByaDabYLPZYHR0FJLJJOu73sdgwd65XC44Pz8XJjw+PoZYLAZ+vx+8Xi/b6enpqWBvtVqwu7vL2u12myZpywZDOCcnJ6FarbKBV1dXEI1GwWg0gkqlIgc/0qtWq2FiYgI2NjagVqt17LRer5NfvW8wxH0E7O3tCQMXFxfJEEWakCqRrxr5lBaQyWQ6gjUaDXJoyAV7gYDLy0s2iJJPiaZFdDmBRyMjI7C5udk1h2hvygX7jGADTk5OgG4i9hlFditym6ef8tcL3S7IPUklPEawRjqd5orFIjXzfP08M5lM35aXl5l9dXV1amtri8tms5xU8s7Ozuix3rfOEL8QbGWBQIDVjsj2FSGsnNrUh3yOnJLwSbdbLt3ZT8QDxM2uiiIbXR7xC8fncpvf+cOhoaGywWDgsNjpfRxtP/rJVZEPwlFAeohs67hbLpVKMVJbclSvPR4Pt7+/z62trbF3uWP8gmDHdHh4CBqNhjo1Ivs0MslzWtSvo8uEC2VjMd/UmZa7ja8QcHFxwQYtLS1R50cZ/SRpC66srAj59Pl8ZPANoiDfEYLszM3NUecHpFbiRykYR0ZI2kiuCEdHR6DX68lBP0gwm8ViYZJDIP1bWFgArVZ7o+x2pEupVMLY2BhEIhEmaQQSg/n5efLzdj2FHkfzfnZ2FiqVinA0+XyelYPdbgfaCWliuVzuUA2n00mDwz2PvE8u3mKBQzwel/3E7OzsAJ2GuC7/KBgf0IKMW61WCIfDkMvlmMiiQrCvApYAOBwO9tVGv5f95pINJtHEMDJHak6KhKwiU0gH3chB5lH8/5X754L9FmAAxKqp09gZRrsAAAAASUVORK5CYII=) 12 12, auto'
    // eslint-disable-next-line no-undef
    fabric.Object.prototype.originX = 'center' // 设置中心为左上角
    // eslint-disable-next-line no-undef
    fabric.Object.prototype.originY = 'center' // 设置中心为左上角
    // eslint-disable-next-line no-undef
    fabric.Canvas.prototype.customiseControls({
      tl: {
        action: 'scale'
      },
      tr: {
        action: 'scale'
      },
      bl: {
        action: 'scale'
      },
      br: {
        action: 'scale'
      },
      mb: {
        action: 'scaleY'
      },
      mt: {
        action: 'scaleY'
      },
      mr: {
        action: 'scaleX'
      },
      ml: {
        action: 'scaleX'
      },
      mtr: {
        action: 'rotate'
      }
    })
    // eslint-disable-next-line no-undef
    fabric.Object.prototype.borderColor = 'rgba(0,98,178,1)' // 元素框样式定制
    // eslint-disable-next-line no-undef
    fabric.Object.prototype.borderDashArray = [5, 3]
    // eslint-disable-next-line no-undef
    fabric.Object.prototype.cornerColor = 'rgba(0,98,178,1)'
    // eslint-disable-next-line no-undef
    fabric.Object.prototype.cornerStrokeColor = 'rgba(0,98,178,1)'
    // eslint-disable-next-line no-undef
    fabric.Object.prototype.cornerDashArray = [5, 3]
    // eslint-disable-next-line no-undef
    fabric.Object.prototype.hasControls = true

    this.canvas.setWidth(this.boxWidth)
    this.canvas.setHeight(this.boxHeight)

    this.changeBigZoom()
    setTimeout(() => {
      if (this.zoom !== 1) {
        this.setZoom(this.zoom) // 如果不是默认的1,则强制按父组件传入的比例显示
      }
    }, 100)

    this.initbg({backgroundColor: this.backgroundColor, width: this.width, height: this.height}) // 画布初始化
    this.getBlack({width: this.width, height: this.height}, this.BgColor) // 遮罩
    this.canvas.skipTargetFind = false
    this.setCursor(99)

    document.onkeydown = function (e) {
      let keyCode = window.event.keyCode
      if (keyCode === 46) { // Delete
        that.removeActiveObject()
      }
      if (keyCode === 37) { // ←
        e.preventDefault()
        e.stopPropagation()
        that.getEditObj().left = parseInt(that.getEditObj().left - 1)
        let objects = that.getObjectsNew()
        objects.forEach((obj, i) => {
          if (obj.id === that.getEditObj().id && obj.isType === 'TextRect-text') {
            obj.left = parseInt(obj.left - 1)
          }
        })
        that.$emit('canvasToData', that.getEditObj(), '左移-1 更新')

        that.getEditObj().setCoords()
        that.canvas.requestRenderAll()
        that.canvas.renderAll()
      }
      if (keyCode === 38) { // ↑
        e.preventDefault()
        e.stopPropagation()
        that.getEditObj().top = parseInt(that.getEditObj().top - 1)
        let objects = that.getObjectsNew()
        objects.forEach((obj, i) => {
          if (obj.id === that.getEditObj().id && obj.isType === 'TextRect-text') {
            obj.top = parseInt(obj.top - 1)
          }
        })
        that.$emit('canvasToData', that.getEditObj(), '上移-1 更新')

        that.getEditObj().setCoords()
        that.canvas.requestRenderAll()
        that.canvas.renderAll()
      }
      if (keyCode === 39) { // →
        e.preventDefault()
        e.stopPropagation()
        that.getEditObj().left = parseInt(that.getEditObj().left + 1)
        let objects = that.getObjectsNew()
        objects.forEach((obj, i) => {
          if (obj.id === that.getEditObj().id && obj.isType === 'TextRect-text') {
            obj.left = parseInt(obj.left + 1)
          }
        })
        that.$emit('canvasToData', that.getEditObj(), '右移+1 更新')

        that.getEditObj().setCoords()
        that.canvas.requestRenderAll()
        that.canvas.renderAll()
      }
      if (keyCode === 40) { // ↓
        e.preventDefault()
        e.stopPropagation()
        that.getEditObj().top = parseInt(that.getEditObj().top + 1)
        let objects = that.getObjectsNew()
        objects.forEach((obj, i) => {
          if (obj.id === that.getEditObj().id && obj.isType === 'TextRect-text') {
            obj.top = parseInt(obj.top + 1)
          }
        })
        that.$emit('canvasToData', that.getEditObj(), '下移+1 更新')

        that.getEditObj().setCoords()
        that.canvas.requestRenderAll()
        that.canvas.renderAll()
      }
    }

    let that = this
    this.canvas.on('mouse:wheel', function (e) {
      if (that.isMoveing) {
        var zoom = (event.deltaY > 0 ? -0.1 : 0.1) + that.canvas.getZoom()
        zoom = Math.max(0.1, zoom) // 最小为原来的1/10
        zoom = Math.min(10, zoom) // 最大是原来的10倍
        that.setZoom(zoom) // 改变画布的缩放
        e.e.preventDefault()
        e.e.stopPropagation()
      }
    })
    this.canvas.on('mouse:down', function (options) {
      if (that.isMoveing) { // 是否拖拽移动
        that.panning = true
        canvas.selection = false
      }
      that.$emit('mouse:down', options)
    })
    this.canvas.on('mouse:up', function (options) {
      if (that.isMoveing) { // 是否拖拽移动
        that.panning = false
        canvas.selection = true
      }
      that.$emit('mouse:up', options)
    })
    this.canvas.on('mouse:move', function (e) {
      if (that.isMoveing && that.panning && e && e.e) {
        // eslint-disable-next-line no-undef
        var delta = new fabric.Point(e.e.movementX, e.e.movementY)
        canvas.relativePan(delta)
      }
      that.$emit('mouse:move', e)
    })
  },
  methods: {
    // 初始化背景
    initbg (options) {
      let left = 0
      let top = 0
      if (this.boxWidth > this.width * this.canvasZoom) {
        left = this.boxWidth / 2 - this.width / 2
      } else {
        left = 0
      }
      if (this.boxHeight > this.height * this.canvasZoom) {
        top = this.boxHeight / 2 - this.height / 2
      } else {
        top = 0
      }
      console.log(top, left)
      this.xLeft = -left
      this.yTop = -top
      options = {
        width: options.width ? options.width : this.width,
        height: options.height ? options.height : this.height,
        backgroundColor: options.hasOwnProperty('backgroundColor') && Object.prototype.toString.call(options.backgroundColor) === '[object String]' && options.backgroundColor !== '' ? options.backgroundColor : '#fff'
      }
      // eslint-disable-next-line no-undef
      let rect = new fabric.Rect({
        left: left,
        top: top,
        width: options.width,
        height: options.height,
        fill: JSON.parse(JSON.stringify(options.backgroundColor)),

        component: 'canvasbg',
        type: 'sBg',
        originX: 'left',
        originY: 'top',
        name: 'background',
        selectable: false,
        hasControls: false,
        evented: false,
        visible: true,
        isType: 'Rect',
        isDiff: 'none',
        flipX: false,
        flipY: false,
        padding: 0,
        angle: 0,
        scaleX: 1,
        scaleY: 1,
        stopContextMenu: true, // 禁掉鼠标右键默认事件
        hoverCursor: 'default',
        strokeWidth: 0,
        stroke: null,
        excludeFromExport: true,
        perPixelTargetFind: false
      })
      this.canvas.add(rect)
      rect.sendToBack()
      this.canvas.requestRenderAll()
      this.canvas.renderAll()
    },
    // 遮罩置顶
    setTop () {
      let objects = this.canvas.getObjects()
      objects.forEach((obj) => {
        if (obj.type === 'sMask') {
          // console.log('遮罩置顶')
          obj.zIndex = -1
          obj.bringToFront()
          this.canvas.renderTop()
          this.canvas.renderAll()
        }
        if (obj.type === 'sRuler') {
          // console.log('遮罩置顶')
          obj.zIndex = -1
          obj.bringToFront()
          this.canvas.renderTop()
          this.canvas.renderAll()
        }
        if (obj.type === 'sBg') {
          // console.log('背景置底')
          obj.zIndex = -5
          obj.sendToBack()
          this.canvas.renderTop()
          this.canvas.renderAll()
        }
      })
    },
    // 画遮罩区域
    getBlack (options, color) {
      let that = this

      let x1, x2, y1, y2
      if (this.boxWidth > options.width * this.canvasZoom) {
        x1 = this.boxWidth / 2 - options.width / 2
        x2 = x1 + options.width
      } else {
        x1 = 0
        x2 = options.width
      }
      if (this.boxHeight > options.height * this.canvasZoom) {
        y1 = this.boxHeight / 2 - options.height / 2
        y2 = y1 + options.height
      } else {
        y1 = 0
        y2 = options.height
      }
      console.log(x1, x2, y1, y2)
      let bg = that.returnbg()
      // console.log(bg)
      that.canvas.remove(...that.canvas.getObjects('sMask'))
      const pathOption = {
        selectable: false,
        fill: color,
        hoverCursor: 'default',
        evented: false,
        excludeFromExport: true,
        hasControls: false,
        perPixelTargetFind: false,
        strokeWidth: 0,
        stroke: null,
        originX: 'left',
        originY: 'top',

        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        lockUniScaling: true,
        name: 'sMask',
        type: 'sMask'
      }
      // eslint-disable-next-line no-undef
      const rect1 = new fabric.Rect({
        ...pathOption,
        left: bg.left - 1000,
        top: bg.top - 2,
        width: 1000,
        height: 1000 + options.height
      })
      // eslint-disable-next-line no-undef
      const rect2 = new fabric.Rect({
        ...pathOption,
        left: bg.left - 1000,
        top: bg.top - 1000,
        width: 2000 + options.width,
        height: 1000
      })
      // eslint-disable-next-line no-undef
      const rect3 = new fabric.Rect({
        ...pathOption,
        left: options.width + bg.left,
        top: bg.top - 2,
        width: 1000,
        height: 1000 + options.height
      })
      // eslint-disable-next-line no-undef
      const rect4 = new fabric.Rect({
        ...pathOption,
        left: bg.left - 1000,
        top: options.height + bg.top,
        width: 2000 + options.width,
        height: 1000
      })
      that.canvas.add(rect1)
      rect1.bringToFront()

      that.canvas.add(rect2)
      rect2.bringToFront()

      that.canvas.add(rect3)
      rect3.bringToFront()

      that.canvas.add(rect4)
      rect4.bringToFront()

      that.canvas.requestRenderAll()
      that.canvas.renderAll()

      this.canvas.remove(...this.canvas.getObjects('sRuler')) // 删除已有的标尺
      setTimeout(() => {
        that.drawRulerInit({
          axisWidth: 1,
          lineColor: '#999',
          gridWidth: 30,
          gridHeight: 20,
          left: bg.left,
          top: bg.top,
          width: options.width,
          height: options.height
        }, this.showRule) // 画尺子
      }, 100)
    },
    // 改变宽高背景颜色
    changeWH (options) {
      if (!options) { return }
      options = {
        width: options.width ? options.width : this.width,
        height: options.height ? options.height : this.height,
        backgroundColor: options.backgroundColor !== '' ? options.backgroundColor : this.backgroundColor
      }
      let bg = this.returnbg()
      this.canvas.remove(bg)
      this.changeBigZoom()
      this.initbg(options)
      this.getBlack({width: options.width, height: options.height}, this.BgColor)
      this.$emit('canvasToData', bg, '画布宽高颜色改变')
      this.canvas.requestRenderAll()
      this.canvas.renderAll()
    },
    // 改变画布背景颜色
    changeBackgroundColor (color) {
      let bg = this.returnbg()
      bg.set({
        fill: color
      })
      this.$emit('canvasToData', bg, '画布颜色改变')
      this.canvas.requestRenderAll()
      this.canvas.renderAll()
    },
    // 设置缩放比
    setZoom (n) {
      this.canvasZoom = n
      let canvaCenterLeft = this.boxWidth / 2
      let canvaCenterTop = this.boxHeight / 2
      // console.log(canvaCenterLeft, canvaCenterTop)
      // eslint-disable-next-line no-undef
      let zoomPoint = new fabric.Point(canvaCenterLeft, canvaCenterTop) // 居中缩放中心
      this.canvas.zoomToPoint(zoomPoint, n)
      setTimeout(() => {
        this.canvas.renderAll()
        this.$emit('changeZoomTo', n)
      }, 100)
    },
    // 按照1:1缩放
    changeOneZoom () {
      this.canvas.setZoom(1)
      this.canvas.absolutePan({x: 0, y: 0})
      this.canvasZoom = 1
      this.$emit('changeZoomTo', 1)
    },
    // 按照当前缩放比居中
    changeOrigin () {
      let zoom = this.canvas.getZoom()
      this.changeOneZoom() // 先1:1 确定中心点
      this.setZoom(zoom)
    },
    // 画布左上对齐
    changeLeftTop () {
      let bg = this.returnbg()
      let zoom = this.canvas.getZoom()
      this.canvasZoom = zoom
      let canvaCenterLeft = this.boxWidth / 2 - this.width / 2
      let canvaCenterTop = this.boxHeight / 2 - this.height / 2
      console.log(bg.left, bg.top, zoom, Math.abs(canvaCenterLeft * zoom), Math.abs(canvaCenterTop * zoom))
      // eslint-disable-next-line no-undef
      let zoomPoint = new fabric.Point(canvaCenterLeft * zoom, canvaCenterTop * zoom) // 居中缩放中心
      this.canvas.absolutePan(zoomPoint)
      this.$emit('changeZoomTo', zoom)
      this.canvas.renderAll()
    },
    // 铺满
    changeBigZoom () {
      this.changeOneZoom() // 先1:1 确定中心点
      let zoom = 1
      if (this.boxWidth / this.boxHeight < (this.width) / (this.height)) {
        // console.log('宽扁')
        if (this.boxWidth < (this.width)) {
          zoom = this.boxWidth / (this.width) - 0.01
        } else {
          zoom = this.boxWidth / (this.width) - 0.01
        }
      } else {
        // console.log('瘦高')
        if (this.boxHeight < (this.height)) {
          zoom = this.boxHeight / (this.height) - 0.01
        } else {
          zoom = this.boxHeight / (this.height) - 0.01
        }
      }
      let Zoom = this.zoom
      if (this.width < this.boxWidth && this.height < this.boxHeight) {
        Zoom = Math.min((this.boxHeight / this.height - 0.01).toFixed(2), (this.boxWidth / this.width - 0.01).toFixed(2))
      } else if ((this.width < this.boxWidth || this.width === this.boxWidth) && this.height > this.boxHeight) {
        Zoom = (this.boxHeight / this.height - 0.01).toFixed(2)
      } else if (this.width > this.boxWidth && (this.height < this.boxHeight || this.height === this.boxHeight)) {
        Zoom = (this.boxWidth / this.width - 0.01).toFixed(2)
      } else if (this.width > this.boxWidth && this.height > this.boxHeight) {
        Zoom = Math.min((this.boxHeight / this.height - 0.01).toFixed(2), (this.boxWidth / this.width - 0.01).toFixed(2))
      } else {
        Zoom = 1
      }
      console.log('初始化缩放按最大的宽高适配：', Zoom)
      console.log('缩放：', zoom)
      this.setZoom(parseFloat(Zoom))
    },
    // 改变画布背景移动状态和鼠标手样式
    changemoveing (bol) {
      this.isMoveing = bol
      if (bol) {
        this.canvas.skipTargetFind = true
        this.setCursor(2)
      } else {
        this.canvas.skipTargetFind = false
        this.setCursor(99)
      }
    },
    // 设置鼠标手
    setCursor (status) {
      this.cursor = status
      switch (status) {
        // eslint-disable-next-line no-undef
        case 1:fabric.Canvas.prototype.defaultCursor = "url('data:image/ico;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADW1tZ4b29v/7Gxsf+hoaHn////IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANbW1nhvb2//sbGx/6Ghoef///8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9vb2LJeXl8VpaWnzx8fHif///wIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8G/v7+LP///0z///8YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////5////8P///+B////Af///gH///wD///4B///8A///+Af///AP///gH///wD///4B///8A///OAf//xgP//8QH///ED///xD///8b////H///gAB//4AAP/+AAD///h////8f////H////x////8f////H////x////////8=') ,auto" // 绘图
          break
        // eslint-disable-next-line no-undef
        case 2: fabric.Canvas.prototype.defaultCursor = 'grab' // 手掌
          break
          // eslint-disable-next-line no-undef
        case 3: fabric.Canvas.prototype.defaultCursor = 'grabbing' // 抓手
          break
          // eslint-disable-next-line no-undef
        case 4: fabric.Canvas.prototype.defaultCursor = 'zoom-in' // +
          break
          // eslint-disable-next-line no-undef
        case 5: fabric.Canvas.prototype.defaultCursor = 'zoom-out' // -
          break
          // eslint-disable-next-line no-undef
        default: fabric.Canvas.prototype.defaultCursor = 'default'
      }
    },
    // 返回背景
    returnbg () {
      let objects = this.canvas.getObjects()
      let returndata
      objects.forEach((one) => {
        if (one.type === 'sBg') {
          returndata = one
        }
      })
      return returndata
    },
    // 画标尺
    drawRulerInit (params, status) {
      switch (status) {
        case 'ALL':
          this.drawRulerH(params) // 画上边的标尺
          this.drawRulerV(params) // 画左侧的标尺
          break
        case 'HORIZONTAL':
          this.drawRulerH(params)
          break
        case 'VERTICAL':
          this.drawRulerV(params)
          break
        case 'NONE':
          break
        default:
          break
      }
    },
    // 画纵向标尺
    drawRulerH (params) {
      let that = this
      // 长线
      let objectline = []
      for (let i = 0; i < (params.width + 1) / 50; i++) {
        // eslint-disable-next-line no-undef
        let line = new fabric.Line([50 * i, 0, 50 * i, params.gridHeight], {
          stroke: params.lineColor,
          strokeWidth: params.axisWidth,
          strokeDashArray: [0, 0]
        })
        objectline.push(line)
      }
      let objecttext = []
      for (let i = 0; i < (params.width - 10) / 50; i++) {
        let data = i * 50 + ''
        // eslint-disable-next-line no-undef
        let text = new fabric.Text(data, {
          originX: 'left',
          originY: 'top',
          left: 50 * i + 5,
          top: params.gridHeight * 0.01,
          fill: params.lineColor,
          strokeWidth: 0.3,
          fontSize: 12
        })
        objecttext.push(text)
      }
      // 分隔短线
      let objectline2 = []
      for (let i = 0; i < (params.width) / 10; i++) {
        // eslint-disable-next-line no-undef
        let line = new fabric.Line([5 + 10 * i, params.gridHeight * 0.8, 5 + 10 * i, params.gridHeight], {
          stroke: params.lineColor,
          strokeWidth: params.axisWidth,
          strokeDashArray: [0, 0]
        })
        objectline2.push(line)
      }
      // 分隔长线
      let objectline3 = []
      for (let i = 0; i < (params.width) / 10; i++) {
        // eslint-disable-next-line no-undef
        let line = new fabric.Line([10 + 10 * i, params.gridHeight * 0.6, 10 + 10 * i, params.gridHeight], {
          stroke: params.lineColor,
          strokeWidth: params.axisWidth,
          strokeDashArray: [0, 0]
        })
        objectline3.push(line)
      }

      // eslint-disable-next-line no-undef
      let rulerPath = new fabric.Group([...objectline, ...objecttext, ...objectline2, ...objectline3], {
        originX: 'left',
        originY: 'top',
        selectable: false,
        excludeFromExport: true,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        lockUniScaling: true,
        hoverCursor: 'auto',
        name: 'sRuler',
        left: params.left,
        top: params.top - params.gridHeight,
        type: 'sRuler',
        evented: false
      })
      that.canvas.add(rulerPath)
      rulerPath.bringToFront()
      that.canvas.requestRenderAll()
      that.canvas.renderAll()
    },
    // 画横向标尺
    drawRulerV (params) {
      let that = this
      // 长线
      let objectline = []
      for (let i = 0; i < (params.height + 1) / 50; i++) {
        // eslint-disable-next-line no-undef
        let line = new fabric.Line([0, 50 * i, params.gridWidth, 50 * i], {
          originX: 'left',
          originY: 'top',
          stroke: params.lineColor,
          strokeWidth: params.axisWidth,
          strokeDashArray: [0, 0]
        })
        objectline.push(line)
      }
      let objecttext = []
      for (let i = 0; i < (params.height - 10) / 50; i++) {
        let data = i * 50 + ''
        for (let j = 0; j < data.length; j++) {
          // eslint-disable-next-line no-undef
          let text = new fabric.Text(data[j], {
            originX: 'left',
            originY: 'top',
            left: params.gridWidth * 0.01,
            top: j * 12 + (50 * i + 5),
            fill: params.lineColor,
            strokeWidth: 0.3,
            fontSize: 12,
            width: 12
          })
          objecttext.push(text)
        }
      }
      // 分隔短线
      let objectline2 = []
      for (let i = 0; i < (params.height) / 10; i++) {
        // eslint-disable-next-line no-undef
        let line = new fabric.Line([params.gridWidth * 0.8, 5 + 10 * i, params.gridWidth, 5 + 10 * i], {
          originX: 'left',
          originY: 'top',
          stroke: params.lineColor,
          strokeWidth: params.axisWidth,
          strokeDashArray: [0, 0]
        })
        objectline2.push(line)
      }
      // 分隔长线
      let objectline3 = []
      for (let i = 0; i < (params.height) / 10; i++) {
        // eslint-disable-next-line no-undef
        let line = new fabric.Line([params.gridWidth * 0.6, 10 + 10 * i, params.gridWidth, 10 + 10 * i], {
          originX: 'left',
          originY: 'top',
          stroke: params.lineColor,
          strokeWidth: params.axisWidth,
          strokeDashArray: [0, 0]
        })
        objectline3.push(line)
      }

      // eslint-disable-next-line no-undef
      let rulerPath = new fabric.Group([...objectline, ...objecttext, ...objectline2, ...objectline3], {
        originX: 'left',
        originY: 'top',
        selectable: false,
        excludeFromExport: true,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        lockUniScaling: true,
        hoverCursor: 'auto',
        name: 'sRuler',
        left: params.left - params.gridWidth,
        top: params.top,
        type: 'sRuler',
        evented: false
      })
      that.canvas.add(rulerPath)
      rulerPath.bringToFront()
      that.canvas.requestRenderAll()
      that.canvas.renderAll()
    },
    // 右键事件
    showMenu () {
      if (!this.showMouseRight) {
        return
      }
      var canvas = this.canvas

      var x = event.clientX
      var y = event.clientY
      var objects = canvas.getObjects()
      for (var i = objects.length - 1; i >= 0; i--) {
        var object = objects[i]
        if (object.visible) {
          //  console.log(object.component)
          if (object.component !== 'component') {
            // 判断不是背景也不是遮罩
            event.preventDefault()
            continue
          }

          if (canvas.containsPoint(event, object)) {
            console.log('鼠标右键事件')
            if (object.isType === 'TextRect-text') {
              // 如果是组合文本上的文本 则选中下面的矩形
              let objects = this.getObjectsNew()
              objects.forEach((obj) => {
                if (obj.id === object.id && obj.isType === 'TextRect') {
                  this.setActiveObject(obj)
                }
              })
            } else {
              this.setActiveObject(object)
            }

            this.contextMenuData.axis = {x, y}
            event.preventDefault()

            return
          }
        }
      }
    },
    // 置于顶层
    toTopLayer () {
      let obj = this.canvas.getActiveObject()
      if (!obj) {
        return
      }

      obj.bringToFront()
      let allobjects = this.getObjectsNew()
      allobjects.forEach((one) => {
        if (one.id === obj.id && one.isType === 'TextRect-text') {
          one.bringToFront()
        }
      })

      this.canvas.renderTop()
      this.canvas.renderAll()

      this.setTop() // 遮罩置顶，背景置底重置

      this.$emit('changeLayer', obj) // 层级变动回调
    },
    // 上移一层
    toLastLayer () {
      let obj = this.canvas.getActiveObject()
      if (!obj) {
        return
      }

      obj.bringForward(true)

      this.canvas.renderTop()
      this.canvas.renderAll()

      this.setTop() // 遮罩置顶，背景置底重置

      this.$emit('changeLayer', obj) // 层级变动回调
    },
    // 下移一层
    toNextLayer () {
      let obj = this.canvas.getActiveObject()
      if (!obj) {
        return
      }
      obj.sendBackwards(true)
      this.canvas.renderTop()
      this.canvas.renderAll()

      this.setTop() // 遮罩置顶，背景置底重置

      this.$emit('changeLayer', obj) // 层级变动回调
    },
    // 置于底层
    toBottomLayer () {
      let obj = this.canvas.getActiveObject()

      if (!obj) {
        return
      }

      let allobjects = this.getObjectsNew()
      allobjects.forEach((one) => {
        if (one.id === obj.id && one.isType === 'TextRect-text') {
          one.sendToBack()
        }
      })
      obj.sendToBack()
      this.canvas.renderTop()
      this.canvas.renderAll()

      this.setTop() // 遮罩置顶，背景置底重置

      this.$emit('changeLayer', obj) // 层级变动回调
    },
    // 删除当前活跃元素 - 右键菜单调用该方法
    removeEditObj () {
      let obj = this.canvas.getActiveObject()
      if (obj.isType === 'TextRect-text') { // 如果是组合文本上的文本不可删除
        return
      }
      this.$emit('deleteidsdata', [obj.id])
      this.canvas.remove(obj)
    },
    // 复制粘贴
    copypaste () {
      let copydata = this.copyData()
      this.clipboard = copydata // 仅本画布复制保存
      this.paste(copydata)
    },
    // copyData
    copyData () {
      let clipboard = this.canvas.getActiveObject()
      if (clipboard === undefined || clipboard == null) {
        return false
      }
      if (clipboard.get('type') === 'group') { // 组复制
        return '#ZKONG#' + escape(JSON.stringify(clipboard))
      } else if (clipboard.get('type') === 'activeSelection') { // 多元素复制
        let _objects = JSON.parse(JSON.stringify(clipboard._objects))
        let newobjects = []
        _objects.map((_obj) => {
          _obj.top = clipboard.top + _obj.top
          _obj.left = clipboard.left + _obj.left
          newobjects.push(_obj)
        })
        newobjects[0].parentscale = [clipboard.scaleX, clipboard.scaleY] // 第一个元素植入混合组件缩放比例
        return '#ZKONG#' + escape(JSON.stringify(newobjects))
      } else { // 单个元素复制
        return '#ZKONG#' + escape(JSON.stringify(clipboard))
      }
    },
    // paste
    async paste (text) {
      if (this.clipboard == null) { // 剪切板清除不掉，所以画布只可粘贴一次限制
        return false
      }
      this.canvas.discardActiveObject()
      if (text.substring(0, 7) !== '#ZKONG#') {
        return
      }
      let _clipboard = JSON.parse(unescape(text.substring(7, text.length)))
      if (_clipboard instanceof Array) {
        let canvaobjs = []
        this.activecanvaobjs = []
        for (var i in _clipboard) {
          this.$emit('idAdd')
          this.cid = this.cid + 1
          let object = _clipboard[i]
          object.copyId = JSON.parse(JSON.stringify(object.id))
          object.id = this.cid
          object.zIndex = this.cid
          object.visible = true
          object.top = object.top + 10 + this.yTop
          object.left = object.left + 10 + this.xLeft
          if (object.isType === 'Barcode') {
            object.width = object.width * object.scaleX
            object.height = object.height * object.scaleY
            object.scaleX = object.scaleY = 1
          }
          if (object.isType === 'Text') {
            object.width = parseInt(object.width * object.scaleX)
            object.height = parseInt(object.height * object.scaleY)
            object.scaleX = 1
            object.scaleY = 1
            this.$emit('idAdd') // this.cid = this.cid + 1;
            this.cid = this.cid + 1
          }
          if (object.isType === 'TextRect') {
            object.width = parseInt(object.width * object.scaleX)
            object.height = parseInt(object.height * object.scaleY)
            object.scaleX = 1
            object.scaleY = 1
            object.textAlign = object.textRectData.textAlign // 文本对齐
            object.fontWeight = object.textRectData.fontWeight ? object.textRectData.fontWeight : 'normal'
            object.linethrough = object.textRectData.linethrough ? object.textRectData.linethrough : false
            object.underline = object.textRectData.underline ? object.textRectData.underline : false
            object.fontStyle = object.textRectData.fontStyle ? object.textRectData.fontStyle : 'normal'
          }
          if (object.isType === 'Icon') {
            object.width = parseInt(object.width * object.scaleX)
            object.height = parseInt(object.height * object.scaleY)
            object.scaleX = 1
            object.scaleY = 1
          }
          if (object.isType === 'Image') {
            object.width = parseInt(object.width * object.scaleX)
            object.height = parseInt(object.height * object.scaleY)
            object.scaleX = 1
            object.scaleY = 1
          }
          if (object.isType === 'Image2') {
            object.width = parseInt(object.width * object.scaleX)
            object.height = parseInt(object.height * object.scaleY)
            object.scaleX = 1
            object.scaleY = 1
          }
          let canvaobj = await this.createElement(object.isType, object)

          if (canvaobj) {
            this.$emit('copydata', object, [canvaobj.id], _clipboard)
            this.$emit('copyidsdata', [canvaobj.id]) // 一个一个复制
            canvaobjs.push(canvaobj)
          }
        }
        // eslint-disable-next-line no-undef
        var sel = new fabric.ActiveSelection(canvaobjs, { // 多元素混合选中
          canvas: this.canvas
        })
        sel.set({ // 还原第一个元素保存的混合元素的缩放
          scaleX: _clipboard[0].parentscale[0],
          scaleY: _clipboard[0].parentscale[1]
        })
        this.canvas.setActiveObject(sel)
      } else {
        console.log('单元素')
        // console.log('单个元素',_clipboard)
        if (_clipboard.isType === 'TextRect-text') {
          return
        }
        this.$emit('idAdd') // this.cid = this.cid + 1;
        this.cid = this.cid + 1
        let canvaobj
        _clipboard.copyId = JSON.parse(JSON.stringify(_clipboard.id))
        _clipboard.id = this.cid
        _clipboard.zIndex = this.cid
        _clipboard.top = _clipboard.top + 10 + this.yTop
        _clipboard.left = _clipboard.left + 10 + this.xLeft
        _clipboard.visible = true
        if (_clipboard.isType === 'Rect' || _clipboard.isType === 'Circle' || _clipboard.isType === 'Rectangle' || _clipboard.isType === 'Parallelogram' ||
              _clipboard.isType === 'EqualCircle' || _clipboard.isType === 'Dottedline' || _clipboard.isType === 'star' || _clipboard.isType === 'Hexagon' ||
              _clipboard.isType === 'EqualTriangle') {
          _clipboard.fill = _clipboard.color
        }
        if (_clipboard.isType === 'Barcode') {
          _clipboard.width = parseInt(_clipboard.width * _clipboard.scaleX)
          _clipboard.height = parseInt(_clipboard.height * _clipboard.scaleY)
          _clipboard.scaleX = 1
          _clipboard.scaleY = 1
        }
        if (_clipboard.isType === 'Text') {
          _clipboard.width = parseInt(_clipboard.width * _clipboard.scaleX)
          _clipboard.height = parseInt(_clipboard.height * _clipboard.scaleY)
          _clipboard.scaleX = 1
          _clipboard.scaleY = 1
        }
        if (_clipboard.isType === 'Icon') {
          _clipboard.width = parseInt(_clipboard.width * _clipboard.scaleX)
          _clipboard.height = parseInt(_clipboard.height * _clipboard.scaleY)
          _clipboard.scaleX = 1
          _clipboard.scaleY = 1
        }
        if (_clipboard.isType === 'Image') {
          _clipboard.width = parseInt(_clipboard.width * _clipboard.scaleX)
          _clipboard.height = parseInt(_clipboard.height * _clipboard.scaleY)
          _clipboard.scaleX = 1
          _clipboard.scaleY = 1
        }
        if (_clipboard.isType === 'Image2') {
          _clipboard.width = parseInt(_clipboard.width * _clipboard.scaleX)
          _clipboard.height = parseInt(_clipboard.height * _clipboard.scaleY)
          _clipboard.scaleX = 1
          _clipboard.scaleY = 1
        }
        if (_clipboard.isType === 'TextRect') {
          _clipboard.width = parseInt(_clipboard.width * _clipboard.scaleX)
          _clipboard.height = parseInt(_clipboard.height * _clipboard.scaleY)
          _clipboard.scaleX = 1
          _clipboard.scaleY = 1
          canvaobj = await this.createElement(_clipboard.isType, {
            ..._clipboard,
            'fontFamily': _clipboard.textRectData.fontFamily ? _clipboard.textRectData.fontFamily : 'MicrosoftYaHei',
            'textAlign': _clipboard.textRectData.textAlign ? _clipboard.textRectData.textAlign : 'left',
            'fontSize': _clipboard.textRectData.fontSize ? _clipboard.textRectData.fontSize : 14,
            'angle': _clipboard.textRectData.angle ? _clipboard.textRectData.angle : 0,
            'fontColor': _clipboard.textRectData.fontColor ? _clipboard.textRectData.fontColor : '#000000',
            'fontWeight': _clipboard.textRectData.fontWeight ? _clipboard.textRectData.fontWeight : 'normal',
            'linethrough': _clipboard.textRectData.linethrough ? _clipboard.textRectData.linethrough : false,
            'underline': _clipboard.textRectData.underline ? _clipboard.textRectData.underline : false,
            'fontStyle': _clipboard.textRectData.fontStyle ? _clipboard.textRectData.fontStyle : 'normal'
          })
          this.$emit('idAdd') // this.cid = this.cid + 1;
          this.cid = this.cid + 1
        } else {
          console.log('单个元素复制出来', _clipboard)
          canvaobj = await this.createElement(_clipboard.isType, _clipboard)
        }
        if (canvaobj) {
          this.$emit('copydata', _clipboard, [canvaobj.id], _clipboard)
          this.$emit('copyidsdata', [canvaobj.id]) // 单个元素 复制
          this.canvas.setActiveObject(canvaobj)
        }
      }
      this.clipboard = null
      this.canvas.requestRenderAll()
    },
    // 获取所有元素
    getObjects () {
      let obj = this.canvas.getObjects()
      return obj
    },
    // 获取当前
    getEditObj () {
      let obj = this.canvas.getActiveObject()
      return obj
    },
    // 获取自己组装的元素
    getObjectsNew () {
      let objects = this.getObjects()
      let newobj = []
      for (let i in objects) {
        if (objects[i].component === 'component') {
          newobj.push(objects[i])
        }
      }
      return newobj
    },
    // 获取当前活跃元素
    getActiveObject () {
      var obj = this.canvas.getActiveObject()
      return obj
    },
    // 设置当前组件为活跃元素
    setActiveObject (obj) {
      this.canvas.setActiveObject(obj)
      this.canvas.renderAll()
    },
    // 删除当前活跃元素
    removeActiveObject () {
      let obj = this.canvas.getActiveObject()
      let deleteIds = []
      if (obj._objects) { // 多选
        this.canvas.discardActiveObject()
        for (var i in obj._objects) {
          deleteIds.push(obj._objects[i].id)
          this.canvas.remove(obj._objects[i])
        }
        deleteIds.push(obj.id)
        this.canvas.remove(obj) // 删除条码起作用
      } else { // 单选
        if (obj.isType === 'TextRect-text') { // 如果是组合文本上的文本不可删除
          return
        }
        deleteIds.push(obj.id)
        this.canvas.remove(obj)
      }

      this.canvas.renderAll()
      this.$emit('deleteidsdata', deleteIds)
      return deleteIds
    },
    // 取消所有活跃元素
    discardActive () {
      this.canvas.discardActiveObject()
      this.canvas.requestRenderAll()
      this.canvas.renderAll()
    },

    /**
     * 创建元素
     * @param name   : Rect, Rectangle, Parallelogram, Circle, Dottedline, EqualTriangle, Image, Barcode, Qrcode, Text
     * @param options: id, name, left, top, width, height, angle, padding, scaleX,  scaleY, selectable, visible, fill,
     *  fillColor，backgroundColor, stroke, strokeWidth, strokeDashArray,
     *  rx, ry,
     *  skewX,
     *  DottedlineType ,
     *  radius ,
     *  url,
     *  imgData,
     * @return obj
     * */
    async createElement (name, options) {
      if (!name) {
        return
      }
      let canvasObject, newOptions
      // console.log(options);
      return new Promise(async (resolve, reject) => {
        let canvas = this.canvas
        let that = this

        options = {
          ...options,
          id: options.id ? options.id : 1,
          zIndex: options.zIndex ? options.zIndex : 1,

          component: 'component',
          isDiff: 'static',
          padding: 0,
          scaleX: options.scaleX ? options.scaleX : 1,
          scaleY: options.scaleY ? options.scaleY : 1,
          flipX: false,
          flipY: false,
          originX: 'left',
          originY: 'top',
          stopContextMenu: true, //  禁掉鼠标右键默认事件
          minScaleLimit: 0.0001, //  最小限制
          lockSkewingX: true, //  禁掉按住shift时的变形
          lockSkewingY: true,

          left: options.left ? -this.xLeft + options.left : -this.xLeft,
          top: options.top ? -this.yTop + options.top : -this.yTop,
          width: options.width ? options.width : 60,
          height: options.height ? options.height : 30,
          angle: options.angle ? options.angle : 0,

          fill: options.fill ? options.fill : '#000000', // 填充的颜色（矩形）
          fillColor: options.fillColor ? options.fillColor : 'rgba(0,0,0,0)', // 填充的颜色

          backgroundColor: options.backgroundColor ? options.backgroundColor : '', // 边框填充的颜色
          stroke: options.stroke ? options.stroke : '', // 边框颜色
          strokeWidth: options.strokeWidth ? options.strokeWidth : 0, // 边框宽度
          strokeDashArray: options.strokeDashArray ? options.strokeDashArray : [0, 0], // 边框样式 虚线 [5,1]     直线[0,0]  线段也是这个参数

          selectable: options.selectable !== false ? true : options.selectable, // 元素是否可选中
          visible: options.visible, // 元素是否可见 options.visible!==false ? true :

          eyeshow: options.eyeshow ? options.eyeshow : true, // 眼睛

          hasRotatingPoint: options.hasRotatingPoint !== false ? true : options.hasRotatingPoint,

          screenIndex: options.screenIndex ? options.screenIndex : 0
        }
        // console.warn(options.visible);

        //  console.log('rect',options)
        switch (name) {
          case 'Rect': // ----------------------------------------------------------------------------------------矩形
            newOptions = {
              ...options,
              fill: options.color ? options.color : '#000000',
              isType: 'Rect',
              name: options.name ? options.name : 'Rect',
              rx: 0,
              ry: 0
            }
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.Rect({...newOptions}) // 创建
            canvasObject.on('scaled', (e) => {
              // console.log('scaling',e);
              e.target.set('width', parseInt(e.target.width * e.target.scaleX))
              e.target.set('height', parseInt(e.target.height * e.target.scaleY))
              e.target.set('scaleX', 1)
              e.target.set('scaleY', 1)
            })

            break
          case 'Rectangle': // ----------------------------------------------------------------------------------------圆角矩形
            newOptions = {
              ...options,
              isType: 'Rectangle',
              name: options.name ? options.name : 'Rectangle',
              rx: options.rx ? options.rx : 15,
              ry: options.ry ? options.ry : 15
            }
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.Rect({...newOptions}) // 创建
            canvasObject.on('scaled', (e) => {
              // console.log('scaling',e);
              e.target.set('width', parseInt(e.target.width * e.target.scaleX))
              e.target.set('height', parseInt(e.target.height * e.target.scaleY))
              e.target.set('scaleX', 1)
              e.target.set('scaleY', 1)
            })
            break
          case 'Parallelogram': // ----------------------------------------------------------------------------------------平行四边形
            newOptions = {
              ...options,
              isType: 'Parallelogram',
              name: options.name ? options.name : 'Parallelogram',
              rx: 0,
              ry: 0,
              skewX: options.skewX ? options.skewX : -45,
              skewY: 0 // 暂不允许y轴变形吧 options.skewY?options.skewY:0,
            }
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.Rect({...newOptions}) // 创建
            canvasObject.setControlsVisibility({ // 上中、下中、左中、右中 取消
              bl: true,
              br: true,
              mb: false,
              ml: false,
              mr: false,
              mt: false,
              mtr: true,
              tl: true,
              tr: true
            })
            break
          case 'Circle': // ----------------------------------------------------------------------------------------椭圆形
            newOptions = {
              ...options,
              isType: 'Circle',
              name: options.name ? options.name : 'Circle',
              rx: options.width / 2, // options.rx?options.rx:15,
              ry: options.height / 2 // options.ry?options.ry:15,
            }
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.Ellipse({...newOptions}) // 创建
            canvasObject.on('scaled', (e) => {
              // console.log('scaling',e);
              e.target.set('rx', parseInt(e.target.width * e.target.scaleX / 2))
              e.target.set('ry', parseInt(e.target.height * e.target.scaleY / 2))
              e.target.set('scaleX', 1)
              e.target.set('scaleY', 1)
            })
            break
          case 'EqualCircle': // ----------------------------------------------------------------------------------------正圆
            newOptions = {
              ...options,
              isType: 'EqualCircle',
              name: options.name ? options.name : 'EqualCircle',
              radius: options.width / 2
            }
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.Circle({...newOptions}) // 创建
            canvasObject.setControlsVisibility({ // 上中、下中、左中、右中 取消
              bl: true,
              br: true,
              mb: false,
              ml: false,
              mr: false,
              mt: false,
              mtr: true,
              tl: true,
              tr: true
            })
            break
          case 'Dottedline': // ----------------------------------------------------------------------------------------线段
            newOptions = {
              ...options,
              isType: 'Dottedline',
              name: options.name ? options.name : 'Dottedline',
              DottedlineType: options.DottedlineType ? options.DottedlineType : 1,
              strokeDashArray: options.DottedlineType === 3 ? [10, 4, 3, 4] : (options.DottedlineType === 2 ? [8, 2] : [0, 0]),
              stroke: options.stroke ? options.stroke : '#000000',
              strokeWidth: options.strokeWidth
            }
            let x1 = -this.xLeft + options.left
            let x2 = -this.xLeft + options.left + options.width
            let y1 = -this.yTop + options.top
            let y2 = -this.yTop + options.top
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.Line([x1, y1, x2, y2], {...newOptions}) // 创建
            canvasObject.setControlsVisibility({ // 左上、左下、右上、右下 取消
              bl: false,
              br: false,
              mb: true,
              ml: true,
              mr: true,
              mt: true,
              mtr: true,
              tl: false,
              tr: false
            })
            canvasObject.on('scaled', (e) => {
              // console.log('scaling',e);
              e.target.set('width', parseInt(e.target.width * e.target.scaleX))
              e.target.set('height', parseInt(e.target.height * e.target.scaleY))
              e.target.set('scaleX', 1)
              e.target.set('scaleY', 1)
            })
            break
          case 'EqualTriangle': // ----------------------------------------------------------------------------------------等边三角
            newOptions = {
              ...options,
              width: 60,
              height: 52,
              isType: 'EqualTriangle',
              name: options.name ? options.name : 'EqualTriangle'
            }
            console.log(newOptions)
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.Triangle({...newOptions}) // 创建
            canvasObject.setControlsVisibility({ // 上中、下中、左中、右中 取消
              bl: true,
              br: true,
              mb: false,
              ml: false,
              mr: false,
              mt: false,
              mtr: true,
              tl: true,
              tr: true
            })
            break
          case 'star':// -----------------------------------------------------------------五角星

            options = {
              width: 180,
              height: 188,
              left: options.left,
              top: options.top
            }
            let startpoints = [
              {
                x: options.width / 2,
                y: 0
              },
              {
                x: options.width / 2 - options.width * Math.sin(18 * Math.PI / 180),
                y: options.width * Math.cos(18 * Math.PI / 180)
              },
              {
                x: options.width,
                y: options.width * Math.sin(18 * Math.PI / 180) / Math.cos(36 * Math.PI / 180) * Math.cos(18 * Math.PI / 180)
              },
              {
                x: 0,
                y: options.width * Math.sin(18 * Math.PI / 180) / Math.cos(36 * Math.PI / 180) * Math.cos(18 * Math.PI / 180)
              },
              {
                x: options.width / 2 + options.width * Math.sin(18 * Math.PI / 180),
                y: options.width * Math.cos(18 * Math.PI / 180)
              }

            ]
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.Polygon(startpoints, {
              isType: 'star',
              originX: 'left',
              originY: 'top',
              left: options.left,
              top: options.top,
              fill: 'rgba(0,0,0,1)'
              /* stroke:'green',
                      strokeDashArray:[10] */
            })

            canvasObject.setControlsVisibility({ // 上中、下中、左中、右中 取消
              bl: true,
              br: true,
              mb: false,
              ml: false,
              mr: false,
              mt: false,
              mtr: true,
              tl: true,
              tr: true
            })
            break
          case 'Hexagon': // -----------------------------------------------------------正六边形
            newOptions = {
              width: 100,
              height: 100,
              left: options.left,
              top: options.top
            }
            // 计算半径，边长
            const R = Math.sqrt((newOptions.width) * (newOptions.width) + (newOptions.height) * (newOptions.height)) / 2
            // 6条边的坐标点（60是六边形的内角度数）
            const points = Array.from({length: 6}).map((item, index) => {
              return {
                x: Math.cos(60 * index / 180 * Math.PI) * R,
                y: Math.sin(60 * index / 180 * Math.PI) * R
              }
            })
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.Polygon(points, {
              originX: 'left',
              originY: 'top',
              left: options.left,
              top: options.top,
              isType: 'Hexagon',
              fill: '#ff0000',
              /* stroke:'green',
                      strokeWidth: 3,
                        strokeDashArray:[10] */
              width: Math.sqrt(Math.pow(newOptions.height, 2) + Math.pow(newOptions.height / 2.0, 2)),
              height: newOptions.height
            })

            canvasObject.setControlsVisibility({ // 上中、下中、左中、右中 取消
              bl: true,
              br: true,
              mb: false,
              ml: false,
              mr: false,
              mt: false,
              mtr: true,
              tl: true,
              tr: true
            })
            break

          case 'Image': // ----------------------------------------------------------------------------------------图片
            canvasObject = await that.createURLImage(options)
            // console.log(canvasObject);
            //  return canvasObject;
            break
          case 'Image2': // ----------------------------------------------------------------------------------------图片
            canvasObject = await that.createURLImage(options)
            canvasObject.setControlsVisibility({ // 上中、下中、左中、右中 取消
              bl: true,
              br: true,
              mb: false,
              ml: false,
              mr: false,
              mt: false,
              mtr: true,
              tl: true,
              tr: true
            })
            return canvasObject
          case 'Image3': // ----------------------------------------------------------------------------------------图片
            canvasObject = await that.createURLImage(options)
            canvasObject.setControlsVisibility({ // 上中、下中、左中、右中 取消
              bl: true,
              br: true,
              mb: true,
              ml: true,
              mr: true,
              mt: true,
              mtr: true,
              tl: true,
              tr: true
            })
            return canvasObject

          case 'Icon': // ----------------------------------------------------------------------------------------图片
            canvasObject = await that.createIcon(options)

            canvasObject.setControlsVisibility({ // 上中、下中、左中、右中 取消
              bl: true,
              br: true,
              mb: true,
              ml: true,
              mr: true,
              mt: true,
              mtr: true,
              tl: true,
              tr: true
            })
            resolve(canvasObject)
            return canvasObject
          case 'duanImage':
            canvasObject = await that.createDuan(options)
            console.warn(canvasObject)
            return canvasObject
          case 'equalImage':
            // console.warn('equalImage',options);
            canvasObject = that.createEqualImageImage(options)
            return canvasObject
          case 'Barcode': // ----------------------------------------------------------------------------------------条码
            canvasObject = await that.createBarcode(options)
            resolve(canvasObject)
            return canvasObject
          case 'Barcodematrix': // ----------------------------------------------------------------------------------------条码
            canvasObject = await that.createBarcodedatamatrix(options)
            resolve(canvasObject)
            return canvasObject
          case 'Qrcode': // ----------------------------------------------------------------------------------------二维码
            options.imgText = options.imgText ? options.imgText : '123456789'
            if (options.barcodeType === 0) {

            }
            canvasObject = await that.createQrcode(options)
            resolve(canvasObject)
            return canvasObject
          case 'Text': // -----------------------------------------------------------------------------------------可编辑文本
            canvasObject = await this.createText(options.textdemo, options)
            break
          case 'Time': // ----------------------------------------------------------------------------------------- 不可编辑时间
            newOptions = {
              ...options,
              isType: 'Time',
              name: options.name ? options.name : 'Time'
            }
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.Text(options.textdemo, newOptions)
            canvasObject.setControlsVisibility({ // 上中、下中、左中、右中 取消
              bl: true,
              br: true,
              mb: false,
              ml: false,
              mr: false,
              mt: false,
              mtr: true,
              tl: true,
              tr: true
            })
            break
          case 'Itext':
            newOptions = {
              ...options,
              isType: 'Itext',
              name: options.name ? options.name : 'Itext'
            }
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.IText(options.textdemo, {...newOptions})

            break
          case 'Textbox':
            newOptions = {
              ...options,
              isType: 'Textbox',
              name: options.name ? options.name : 'Textbox',
              breakWords: true

            }
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.Textbox(options.textdemo, {...newOptions})

            break

          case 'TextRectBox':

            let newOptions1 = {

              width: options.width,
              height: options.height,
              content: options.content ? options.content : 'Text',
              fontSize: options.fontSize ? options.fontSize : 14,
              fontType: options.fontType ? options.fontType : '微软雅黑',
              fill: options.color ? options.color : '',
              textAlign: !options.horizontalAlign || options.horizontalAlign === 0 ? 'left' : (options.horizontalAlign === 1 ? 'center' : 'right'),
              fontWeight: options.ifBold === 1 ? 'bold' : 'normal',
              linethrough: options.ifStrikeThrough === 1,
              underline: options.ifUnderline === 1,
              fontStyle: options.ifItalic === 1 ? 'italic' : 'normal',
              lineHeight: (options.fontSize + options.verticalSpace) / options.fontSize,

              prefix: options.prefix,
              postfix: options.postfix,

              maxLines: options.maxLines ? options.maxLines : 3,
              omitStyle: options.omitStyle ? options.omitStyle : 0,
              lineBreak: options.lineBreak ? options.lineBreak : '',
              omitStyleText: options.omitStyle === 0 ? '无' : '…',
              newline: options.lineBreak ? options.lineBreak : '',

              originX: 'left',
              originY: 'top',
              backgroundColor: '',
              isType: 'TextRectBox-text',
              name: options.name ? options.name : 'TextRectBox-text',
              splitByGrapheme: true,
              breakWords: true

            }
            // eslint-disable-next-line no-undef
            let text = new fabric.Textbox(options.prefix + options.content + options.postfix, {...newOptions1})

            let newtext = this.newtextStyleFormat(text, options.prefix + options.content + options.postfix)
            text.set({
              text: newtext
            })

            /* let styles = this.newstyles(options,newtext);
                  text.set({
                      'styles':styles,
                  }); */

            let newOptions2 = {
              width: options.width,
              height: options.height,

              fill: options.fillColor ? options.fillColor : 'rgba(0,0,0,0)',
              stroke: options.borderColor ? options.borderColor : '',
              strokeWidth: options.lineWeight ? options.lineWeight : 0,
              strokeDashArray: options.borderType === 1 ? [0, 0] : (options.borderType === 2 ? [5, 1] : options.borderType === 3 ? [5, 2, 1, 2] : [0, 0]),

              originX: 'center',
              originY: 'center',
              isType: 'TextRectBox-rect',
              name: options.name ? options.name : 'TextRectBox-rect',
              rx: 0,
              ry: 0,
              left: 0,
              top: 0

            }
            // eslint-disable-next-line no-undef
            let rect = new fabric.Rect({...newOptions2}) // 创建

            // eslint-disable-next-line no-undef
            canvasObject = new fabric.Group([rect, text], {
              padding: 0,
              /* ...options, */

              originX: 'left',
              originY: 'top',
              name: options.name ? options.name : 'TextRectBox',
              isType: 'TextRectBox',
              component: 'component',
              isDiff: 'static',

              left: options.left,
              top: options.top,
              id: options.id,
              copyId: options.copyId,
              zIndex: options.zIndex,

              angle: options.angle,
              width: options.width,
              height: options.height,

              visible: options.visible,
              selectable: options.selectable !== false ? true : options.selectable, // 元素是否可选中

              type: options.type ? options.type : 'TextRectBox',
              barcodeType: options.barcodeType ? options.barcodeType : 10,

              /* borderColor: options.borderColor?options.borderColor:"",
                      borderType: options.borderType?options.borderType:0, */
              stroke: options.borderColor ? options.borderColor : '', // 记录边框等信息，编辑时回显在矩形上
              strokeWidth: options.lineWeight ? options.lineWeight : 0,
              strokeDashArray: options.borderType === 1 ? [0, 0] : (options.borderType === 2 ? [5, 1] : options.borderType === 3 ? [5, 2, 1, 2] : [0, 0]),

              conRealResult: options.conRealResult ? options.conRealResult : 1,
              content: options.content ? options.content : 'TEXT1',
              dateFormat: '',
              decimalSeparator: options.decimalSeparator ? options.decimalSeparator : '.',
              thousandSeparator: options.thousandSeparator ? options.thousandSeparator : ',',

              fieldCode: '',
              fillColor: '',
              fontSize: options.fontSize ? options.fontSize : 14,
              fontType: options.fontType ? options.fontType : '微软雅黑',

              ifBold: options.ifBold ? options.ifBold : 0,
              ifCondition: options.ifCondition ? options.ifCondition : 0,
              ifItalic: options.ifItalic ? options.ifItalic : 0,
              ifStrikeThrough: options.ifStrikeThrough ? options.ifStrikeThrough : 0,
              ifUnderline: options.ifUnderline ? options.ifUnderline : 0,

              icon: null,
              itemOrder: options.itemOrder ? options.itemOrder : 1,
              itemPictureNameId: options.itemPictureNameId ? options.itemPictureNameId : null,
              layer: options.layer ? options.layer : 0,

              lineBreak: options.lineBreak ? options.lineBreak : '',
              lineWeight: options.lineWeight ? options.lineWeight : 0,
              marginLeft: options.marginLeft ? options.marginLeft : 0,
              marginTop: options.marginTop ? options.marginTop : 0,

              maxLines: options.maxLines ? options.maxLines : 3,
              minFontSize: options.minFontSize ? options.minFontSize : 12,
              omitStyle: options.omitStyle ? options.omitStyle : 0,
              postfix: options.postfix ? options.postfix : '',
              prefix: options.prefix ? options.prefix : '',

              scaleX: options.scaleX ? options.scaleX : 1,
              scaleY: options.scaleY ? options.scaleY : 1,
              templateBaseId: options.templateBaseId ? options.templateBaseId : null,

              textAdvanceProperty: options.textAdvanceProperty ? options.textAdvanceProperty : 0, // 是自适应还是不使用还是弹性

              verticalAlign: options.verticalAlign ? options.verticalAlign : 0,
              horizontalAlign: options.horizontalAlign ? options.horizontalAlign : 0,
              verticalSpace: options.verticalSpace ? options.verticalSpace : 0,

              lockRotation: false,
              flipX: false,
              flipY: false,
              lockSkewingX: true, // 禁掉按住shift时的变形
              lockSkewingY: true,

              hasRotatingPoint: true, // 元素是否旋转

              eyeshow: options.eyeshow,
              screenIndex: options.screenIndex
            })
            canvasObject.item(0).set({
              left: 0,
              top: 0

            })
            canvasObject.item(1).set({
              top: -options.height / 2,
              left: -options.width / 2,
              width: options.width,
              height: options.height

            })

            canvasObject.set({
              clipTo: function (ctx) {
                ctx.rect(-canvasObject.width / 2,
                  -canvasObject.height / 2,
                  canvasObject.width,
                  canvasObject.height)
              }
            })

            // Utils.registeObjectEvent(this, canvasObject);
            canvasObject.on('mousedblclick', (e) => {
              console.log('mousedblclick', e)
              this.canvas.preserveObjectStacking = true
              e.target._objects[1].selectable = true
              e.target._objects[1].evented = true
              this.canvas.setActiveObject(e.target._objects[1])
              e.target._objects[1].enterEditing()

              e.target.selectable = false
              e.target._objects[0].evented = false
              this.canvas.renderAll.bind(this.canvas)

              e.target._objects[1].set({
                top: -e.target.height / 2,
                left: -e.target.width / 2
              })
            })
            canvasObject.on('scaling', function (e) {
              e.target._objects[1].set({
                width: e.target.width * e.target.scaleX,
                height: e.target.height * e.target.scaleY,

                scaleX: 1 / e.target.scaleX,
                scaleY: 1 / e.target.scaleY
              })

              canvasObject.set({
                clipTo: function (ctx) {
                  ctx.rect(-canvasObject.width / 2,
                    -canvasObject.height / 2,
                    canvasObject.width,
                    canvasObject.height)
                }
              })

              this.canvas.requestRenderAll()
              this.canvas.renderAll()
            })
            // let that = this;
            canvasObject.on('scaled', function (e) {
              // console.log('scaling',e.target.width,e.target.scaleX);

              // console.log(e.target.prefix + e.target.content +e.target.postfix);
              let newtext = that.newtextStyleFormat(e.target._objects[1], e.target.prefix + e.target.content + e.target.postfix)

              e.target._objects[1].set({
                text: newtext
              })
              e.target._objects[1].set({
                top: -e.target.height / 2,
                left: -e.target.width / 2
              })
              that.canvas.requestRenderAll()
              that.canvas.renderAll()
            })

            canvasObject.setControlsVisibility({
              bl: true,
              br: true,
              mb: true,
              ml: true,
              mr: true,
              mt: true,
              mtr: true,
              tl: true,
              tr: true
            })
            break
          case 'Html':
            let styleU = {
              underline: true
            }
            let styleI = {
              fontStyle: 'italic'
            }
            let styleB = {
              fontWeight: 'bold'
            }
            let styleS = {
              linethrough: true
            }
            let styleH = {
              fill: '#f00'
            }
            newOptions = {
              ...options,
              isType: 'Html',
              name: options.name ? options.name : 'Html',
              breakWords: true,
              fontFamily: '宋体',
              lineHeight: 1.5,
              editable: false,
              /* textBackgroundColor:'#fff', */
              backgroundColor: '#FFFFFF',
              styles: {
                0: {
                  23: styleB,
                  24: styleB,
                  25: styleB,
                  26: styleB,

                  28: styleI,
                  29: styleI,
                  30: styleI,
                  31: styleI,
                  32: styleI,
                  33: styleI,

                  35: styleU,
                  36: styleU,
                  37: styleU,
                  38: styleU,
                  39: styleU,
                  40: styleU,
                  41: styleU,
                  42: styleU,
                  43: styleU,

                  45: styleS,
                  46: styleS,
                  47: styleS,
                  48: styleS,
                  49: styleS,
                  50: styleS,
                  51: styleS,
                  52: styleS,
                  53: styleS,
                  54: styleS,

                  60: styleH,
                  61: styleH,
                  62: styleH,
                  63: styleH,
                  64: styleH

                },
                1: {
                  0: styleB,
                  1: styleB,
                  2: styleB,
                  3: styleB,

                  5: styleI,
                  6: styleI,
                  7: styleI,
                  8: styleI,
                  9: styleI,
                  10: styleI,

                  12: styleU,
                  13: styleU,
                  14: styleU,
                  15: styleU,
                  16: styleU,
                  17: styleU,
                  18: styleU,
                  19: styleU,
                  20: styleU,
                  21: styleU

                },
                2: {
                  0: styleS,
                  1: styleS,
                  2: styleS,
                  3: styleS,
                  4: styleS,
                  5: styleS,
                  6: styleS,
                  7: styleS,
                  8: styleS,
                  9: styleS,

                  15: styleH,
                  16: styleH,
                  17: styleH,
                  18: styleH,
                  19: styleH

                }
              }
            }
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.Textbox('Test HTML text display ' +
                        'bold italic underline ' +
                        'underscore and color.', {...newOptions})

            canvasObject.set({height: newOptions.height,
              clipTo: function (ctx) {
                ctx.rect(-canvasObject.width / 2,
                  -canvasObject.height / 2,
                  canvasObject.width,
                  canvasObject.height)
              }
            })

            canvasObject.setControlsVisibility({
              bl: false,
              br: false,
              mb: true,
              ml: true,
              mr: true,
              mt: true,
              mtr: true,
              tl: false,
              tr: false
            })

            break
          case 'TextRect':
            // -----------------------------------------------------------------------------------------可编辑文本加： 边距 背景 边框
            // console.warn('文本矩形参数：',options.zIndex);

            const rectOptions = {
              id: options.id,
              zIndex: options.zIndex ? options.zIndex : options.id,

              copyId: options.copyId,
              type: options.type,
              left: options.left,
              top: options.top,
              angle: options.angle,

              xLeft: options.xLeft ? options.xLeft : 0,
              xRight: options.xRight ? options.xRight : 0,
              yTop: options.yTop ? options.yTop : 0,
              yBot: options.yBot ? options.yBot : 0,

              width: options.width,
              height: options.height,
              fill: '', // options.rectColor?(options.rectColor===''?'rgba(0,0,0,0)':options.rectColor):
              rectColor: options.rectColor ? options.rectColor : '#ffffff',

              stroke: options.stroke ? options.stroke : '',
              strokeWidth: options.strokeWidth ? options.strokeWidth : null,
              strokeDashArray: [3, 1],

              fontColor: options.fontColor ? options.fontColor : '#000000',
              fontSize: options.fontSize ? options.fontSize : 14,
              fontFamily: options.fontFamily ? options.fontFamily : '微软雅黑',
              textdemo: options.textdemo ? options.textdemo : 'TextRect',
              isElasticSize: options.isElasticSize ? options.isElasticSize : 0,

              minScaleLimit: 0.2,
              flipX: false,
              flipY: false,
              lockSkewingX: true, // 禁掉按住shift时的变形
              lockSkewingY: true,
              lockScalingFlip: true,

              originX: 'left',
              originY: 'top',
              component: 'component',
              isType: 'TextRect',
              isDiff: 'static',
              name: options.name ? options.name : 'TextRect',
              hasRotatingPoint: options.hasRotatingPoint,

              textAlign: options.textAlign ? options.textAlign : 'left',

              maxLines: options.maxLines ? options.maxLines : 10,
              minFontSize: options.minFontSize ? options.minFontSize : 12,
              omitStyle: options.omitStyle ? options.omitStyle : 0,
              omitStyleText: options.omitStyleText ? options.omitStyleText : '无',
              newline: options.newline ? options.newline : '',

              verticalSpace: options.verticalSpace ? options.verticalSpace : 0,

              visible: options.visible,
              eyeshow: options.eyeshow,

              screenIndex: options.screenIndex
            }
            const textOptions = {
              id: options.id,
              zIndex: options.zIndex + 0.5 ? options.zIndex + 0.5 : options.id + 0.5,
              copyId: options.copyId,
              type: options.type,
              angle: options.angle,

              left: options.left,
              top: options.top,
              xLeft: options.xLeft ? options.xLeft : 0,
              xRight: options.xRight ? options.xRight : 0,
              yTop: options.yTop ? options.yTop : 0,
              yBot: options.yBot ? options.yBot : 0,

              width: options.width,
              height: options.height,

              fill: options.fontColor ? options.fontColor : '#000000',
              fontSize: options.fontSize ? options.fontSize : 14,

              fontColor: options.fontColor ? options.fontColor : '#000000',
              fontFamily: options.fontFamily ? options.fontFamily : '微软雅黑',
              textdemo: options.textdemo ? options.textdemo : 'TextRect',

              textAlign: options.textAlign ? options.textAlign : 'left',

              originX: 'left',
              originY: 'top',
              component: 'component',
              isType: 'TextRect-text',
              isDiff: 'static',
              name: options.name ? options.name : 'TextRect',

              fontWeight: options.fontWeight ? options.fontWeight : 'normal',
              linethrough: options.linethrough ? options.linethrough : false,
              underline: options.underline ? options.underline : false,
              fontStyle: options.fontStyle ? options.fontStyle : 'normal',

              splitByGrapheme: true,
              lockScalingFlip: true,
              minScaleLimit: 0.2,
              hasRotatingPoint: options.hasRotatingPoint,

              isElasticSize: options.isElasticSize ? options.isElasticSize : 0,

              maxLines: options.maxLines ? options.maxLines : 10,
              minFontSize: options.minFontSize ? options.minFontSize : 12,
              omitStyle: options.omitStyle ? options.omitStyle : 0,
              omitStyleText: options.omitStyleText ? options.omitStyleText : '无',
              newline: options.newline ? options.newline : '',

              verticalSpace: options.verticalSpace ? options.verticalSpace : 0,

              visible: options.visible,
              eyeshow: options.eyeshow,
              screenIndex: options.screenIndex

            }

            /*  */
            // console.warn(textOptions.visible,rectOptions.visible);
            rectOptions.textRectData = textOptions
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.RectWithText(rectOptions, textOptions, options.textdemo)

            /* this.$emit('idAdd');   //this.cid = this.cid + 1;
                    this.cid = this.cid + 1; */

            canvasObject.setCoords()

            console.log('999999999999999999999999', canvasObject)
            break
          case 'tableView':
            let tableStyle = {
              left: 500,
              top: 500,
              width: 300,
              height: 130,
              row: 3,
              col: 3,

              background: '#ffff00',

              borderWidth: 0,
              borderColor: '#000000',
              borderDashArray: [0, 0],

              lineRowWidth: 1,
              lineRowColor: '#666666',
              lineRowDashArray: [0, 0],

              lineColWidth: 1,
              lineColColor: '#666666',
              lineColDashArray: [0, 0]
            }
            let tableHead = {
              style: {
                height: 40,
                fontType: '宋体',
                fontSize: 18,
                fontColor: '#000000',
                bgColor: '#ffffff',
                lineHeight: 40
              },
              data: [{
                width: 200,
                name: '表头名称1',
                fileType: 0,
                fileCode: 'itemTitle'
              }, {
                width: 50,
                name: '表头名称2',
                fileType: 0,
                fileCode: 'itemTitle'
              }, {
                width: 50,
                name: '表头名称3',
                fileType: 0,
                fileCode: 'itemTitle'
              }]
            }
            let tableBody = {
              style: {
                fontType: '宋体',
                fontSize: 16,
                fontColor: '#ffffff',
                bgColor: '#000000',
                lineHeight: 20
              },
              data: []
            }
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.tableView(canvas, tableStyle, tableHead, tableBody)
            break
          case 'tableList':
            // console.log('tableList',options.tableinfo.width);
            let table = {
              tableinfo: {
                left: 500,
                top: 300,
                row: 3,
                col: 3,
                width: 184,
                height: 134,
                titleLineHeight: 52,
                bodyLineHeight: 40,
                times: 5,
                animate: 0,
                borderWidth: 1,
                borderColor: '#ffff00',
                borderType: 0,
                bgColors: ['#A4CFFC', '#AACF98']

              },
              tableList: [{
                type: 0,
                col: 1,
                width: 60,
                height: 50,
                fontType: '微软雅黑',
                fontSize: 16,
                fontColor: '#000000',
                value: '中国',
                bgcolor: '#EEEEEE',
                position: 5,
                field: 'itemTitle',
                fieldType: 0
              }, {
                type: 0,
                col: 2,
                width: 60,
                height: 50,
                fontType: '微软雅黑',
                fontSize: 16,
                fontColor: '#000000',
                value: '标题',
                bgcolor: '#EEEEEE',
                position: 5,
                field: 'itemTitle',
                fieldType: 0
              }, {
                type: 0,
                col: 3,
                width: 60,
                height: 50,
                fontType: '微软雅黑',
                fontSize: 16,
                fontColor: '#000000',
                value: '加油啊',
                bgcolor: '#EEEEEE',
                position: 5,
                field: 'itemTitle',
                fieldType: 0
              }, {
                type: 1,
                col: 1,
                width: 60,
                height: 40,
                fontType: '',
                fontSize: 14,
                fontColor: '#000000',
                value: 'A列值',
                bgcolor: '#EEEEEE',
                position: 5,
                field: '',
                fieldType: 0
              }, {
                type: 1,
                col: 2,
                width: 60,
                height: 40,
                fontType: '',
                fontSize: 14,
                fontColor: '#000000',
                value: 'B列值',
                bgcolor: '#EEEEEE',
                position: 5,
                field: '',
                fieldType: 0
              }, {
                type: 1,
                col: 3,
                width: 60,
                height: 40,
                fontType: '',
                fontSize: 12,
                fontColor: '#ff0000',
                value: 'C列值',
                bgcolor: '#EEEEEE',
                position: 9,
                field: '',
                fieldType: 0
              }]
            }
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.tableList(canvas, table)

            setTimeout(() => {
              // console.warn(canvasObject.table);
              that.setActiveObject(canvasObject.table.group)
              canvasObject.table.group.setCoords()
              that.canvas.add(canvasObject)
              // that.setTop() // 遮罩置顶
            }, 100)

            break

          default:

            // ----------------------------------------------------------------------------------------其他
            console.log('default')
        }

        // console.warn('name:'+ name,canvasObject);

        if (name === 'tableList') {
          this.setTop() // 遮罩置顶
          this.canvas.renderAll()
          resolve(canvasObject)
          // return canvasObject;
        } else {
          canvasObject.setCoords()
          this.setActiveObject(canvasObject)
          this.canvas.add(canvasObject)

          this.setTop() // 遮罩置顶
          this.canvas.renderAll()

          resolve(canvasObject)

          // return canvasObject;
        }
      })
    }
  }
}
</script>

<style scoped>
.bigbox{
  position:relative;
  max-height: 100vh;
  overflow: hidden;
  height: 100%;
}
</style>
