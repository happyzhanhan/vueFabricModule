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
// import Utils from '../../utils/utils'
import initAligningGuidelines from '../utils/guidelines'
import vueContextMenu from '../examples/contextmenu.vue'
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
      default: '#fff',
      required: false
    },
    // 遮罩颜色
    BgColor: {
      type: String,
      default: '#f1f1f1',
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
      panning: false
    }
  },
  watch: {
    isMoveing (val, oldval) {
      if (val) {
        this.setCursor(2)
      } else {
        this.setCursor(99)
      }
    }
  },
  mounted () {
    // eslint-disable-next-line no-undef
    this.canvas = new fabric.Canvas('canvas', { preserveObjectStacking: true })
    let canvas = this.canvas
    initAligningGuidelines(canvas)
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
    fabric.Object.prototype.hasControls = false

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
    this.setCursor(6)

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
      // if (e.e.shiftKey) {
      // }
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
      // eslint-disable-next-line no-undef
      let rect = new fabric.Rect({
        left: left,
        top: top,
        width: options.width,
        height: options.height,
        fill: options.backgroundColor,

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
        stopContextMenu: false, // 禁掉鼠标右键默认事件
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
        backgroundColor: options.backgroundColor ? options.backgroundColor : this.backgroundColor
      }
      let bg = this.returnbg()
      this.canvas.remove(bg)
      this.changeBigZoom()
      this.initbg(options)
      this.getBlack({width: options.width, height: options.height}, this.BgColor)
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
    // 复制粘贴 操作（不用剪切板）
    copypaste () {
      //  console.log('当前页复制不用')
      let copydata = this.copyData()
      this.clipboard = copydata // 仅本画布复制保存
      this.paste(copydata)
    }
  }
}
</script>

<style scoped>
.bigbox{
  position:relative;
  /* max-height: 100vh; */
  overflow: hidden;
  height: 100%;
}
</style>
