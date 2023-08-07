<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable no-undef -->
<template>
 <div class="bigbox" id="bigbox"  @contextmenu="showMenu">
    <div style="position: fixed; top: -9999999999999999999px; left:800px; z-index:999999;">
      <img id="barcode" />
      <div id="barbox"></div>
      <div  style="position: fixed; top: -9999999999999999999px; left:800px; z-index:999999;" id="datamatix"></div>
      <img id="qrcode" :src="qrcodeImg" alt="" class="qrcodeImg">
  </div>
  <input type="text" id="code" style="position:fixed; top:-1000000px; z-index:9999;">
  <canvas id="canvas" ></canvas>
  <vue-context-menu :contextMenuData="contextMenuData"
                    @toTopLayer="toTopLayer" @toLastLayer="toLastLayer" @toNextLayer="toNextLayer" @toBottomLayer="toBottomLayer"
                    @removeEditObj="removeEditObj" @copypaste="copypaste">
  </vue-context-menu>
 </div>
</template>

<script>
import html2canvas from 'html2canvas'
// import { letterSpacing } from 'html2canvas/dist/types/css/property-descriptors/letter-spacing'
import vueContextMenu from '../examples/contextmenu.vue'

// import { on, off } from '../examples/event' // 事件监听
import Utils from '../utils/utils'
// eslint-disable-next-line no-unused-vars
import initFabricRuler from '../utils/fabricRuler'
// eslint-disable-next-line no-unused-vars
import initAligningGuidelines from '../utils/fabricGuidelines'
// require('../../static/js/fabric5.js')
import {
  // eslint-disable-next-line no-unused-vars
  debounce
} from '../utils/debounce'
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
      type: [Boolean, String],
      default: false
    },
    showGuideline: {
      type: [Boolean, String],
      default: false
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
      default: 0,
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
          // {
          //   fnHandler: '',
          //   icoName: 'fa fa-home fa-fw',
          //   btnName: '图层',
          //   children: [
          //     {
          //       fnHandler: 'toLastLayer',
          //       icoName: 'fa fa-home fa-fw',
          //       btnName: this.$t('m.MoveUpALayer')
          //     },
          //     {
          //       fnHandler: 'toNextLayer',
          //       icoName: 'fa fa-home fa-fw',
          //       btnName: this.$t('m.DownALayer')
          //     },
          //     {
          //       fnHandler: 'toTopLayer',
          //       icoName: 'fa fa-home fa-fw',
          //       btnName: this.$t('m.OnTheTopFloor')
          //     },
          //     {
          //       fnHandler: 'toBottomLayer',
          //       icoName: 'fa fa-home fa-fw',
          //       btnName: this.$t('m.AtTheBottom')
          //     }
          //   ]
          // },
          {
            fnHandler: 'copypaste',
            icoName: 'fa fa-home fa-fw',
            btnName: this.$t('canvas.copy')
          },
          {
            fnHandler: 'removeEditObj',
            icoName: 'fa fa-home fa-fw',
            btnName: this.$t('canvas.delete')
          }
        ]
      },
      isMoveing: false, // 抓手可移动画布 ，箭头不可移动画布
      panning: false,
      cid: 0, // 底层获取id
      qrcodeImg: '',
      xLeft: 0,
      yTop: 0,
      lastPosX: 0,
      lastPosY: 0
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
    },
    boxWidth (val, oldval) {
      // console.log('', val, oldval)
      if (val !== oldval) {
        this.canvas.setWidth(val)
        this.canvas.setHeight(this.boxHeight)
        this.changeBigZoom()
        this.changeWH({backgroundColor: this.backgroundColor, width: this.width, height: this.height})
      }
    },
    boxHeight (val, oldval) {
      // console.log('', val, oldval)
      if (val !== oldval) {
        this.canvas.setWidth(this.boxWidth)
        this.canvas.setHeight(val)
        this.changeBigZoom()
        this.changeWH({backgroundColor: this.backgroundColor, width: this.width, height: this.height})
      }
    }
  },
  mounted () {
    // eslint-disable-next-line no-undef
    this.canvas = new fabric.Canvas('canvas', { preserveObjectStacking: true })
    let canvas = this.canvas

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
    // 修改9个控制角的图片样式 uniScaleTransform：控制不允许四角拖拽缩放随机
    // eslint-disable-next-line no-undef
    // fabric.Object.prototype.customiseCornerIcons({
    //   settings: {
    //     borderColor: 'rgba(0,98,178,1)',
    //     cornerSize: 30,
    //     cornerShape: 'rect', // 'rect', 'circle'
    //     cornerBackgroundColor: 'rgba(0,98,178,1)'
    //   },
    //   tl: {
    //     icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCNEYyQ0U2MjA2OTIxMUVFQjQ3OURDMTQ0OEIzNEMxQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCNEYyQ0U2MzA2OTIxMUVFQjQ3OURDMTQ0OEIzNEMxQSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkI0RjJDRTYwMDY5MjExRUVCNDc5REMxNDQ4QjM0QzFBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkI0RjJDRTYxMDY5MjExRUVCNDc5REMxNDQ4QjM0QzFBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+T3DYrwAAAXxJREFUeNpi/P//P8NwAEwMwwSMemTUI6MeGfXIqEdGPTLqkVGPjHpk1COjHhn1yEABloF2AGPyZor0/5/rO5q0Rk7SAiYXYyCVCcT+QCxCZeP/AvFpIJ4OTFaLEGns/3+qYoakTSZcGVv/zzn08P/rzz//Uxv8+fvv//G77/5rVO/7D7QrEW4vDTwyd+7hh/9pDU7dew/yyCmYvbTII2FhplI0zxMmCgJgipaZnYeHnfal+p9//8DUkC+11p59DqYGpEL88O03w5kHHyiMif8MJ+6+Z+jZeRfEnT4gHrny9DODa++JI0DmD0r8AsQnoMXvqwFtogAd4Dpas496ZNQjox4Z9cioR0Y9MuqRUY+MemTUI6MeoYGZX778/INV4vMPsPjnoeKRVatOP8MqsfIUWHwlbXprNBqgm3f40f/PP36Dx6BefPzxv2z1NdA41DRq2wfDjLRYr8WYvNmUATJkGgrEPED8EjpQ0Afs5tIkaTEO9MIzak0rAAQYAErHNqT5DsIyAAAAAElFTkSuQmCC'
    //   },
    //   tr: {
    //     icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEMzZDM0U3QjA2OTUxMUVFODRDQUFENkJGRTI3ODRDQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEMzZDM0U3QzA2OTUxMUVFODRDQUFENkJGRTI3ODRDQSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQzNkMzRTc5MDY5NTExRUU4NENBQUQ2QkZFMjc4NENBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQzNkMzRTdBMDY5NTExRUU4NENBQUQ2QkZFMjc4NENBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+84zpFQAAAYRJREFUeNpi/P//P8NwAIyjHhn1yKhHRj0y6pFRj4x6ZNQjox4Z9cioR0Y9MlAeYUjaNKAO+D/XlyrmMDEMEzB8PAKKWmj0GgPxHCB+DYpxKuPXULONaZrZGZM3m3CxMZ+eFKXD4G8owSDCw0ZVS958+cWw8fwLhrxlVxi+/fprAhQ6S6s8kjk5Woch2VaO6p4AAZCZILNBAQWyi5Z5JCzMVIrm6TjcDGxHOC09wsPDzkJzj0Dt4KGlRx48ePNtWBS/M2cefDikPQJLT9M7tt2Re/Dme2aoqSQDHwflycxAjp8mBQdRbS1gMRwBpEKBmI9Sg7fkm7l464ljWpi8GdI0onLxy4LW7lkBpFaQFBIQh2H4Y7SJMuqRUY+MemTUI6MeGfXIqEdGPTLqkVGPDAuPQLs+/4eSRy5devIJQ/Dsww9gaih5ZHr71jsMy04+BQ3IgQVO3//AEDvnPFiO5l1dsgzA3kMEARsGyGBcABBzgfwC9cR8tF4pdTwyOq0wyABAgAEAvv+rzrwZmDsAAAAASUVORK5CYII='
    //   },
    //   bl: {
    //     icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4RDk1MjI2RTA2OTUxMUVFQjA2NDlFNTAzQTZBQzc4RiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4RDk1MjI2RjA2OTUxMUVFQjA2NDlFNTAzQTZBQzc4RiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjhEOTUyMjZDMDY5NTExRUVCMDY0OUU1MDNBNkFDNzhGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjhEOTUyMjZEMDY5NTExRUVCMDY0OUU1MDNBNkFDNzhGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+9gRlhAAAAYxJREFUeNpi/P//P8NAAsbkzRTp/z/XF0wzMQwTwEirGAGGdByQygRiUyD+AcQbgXg6MASP0MRCkEeojRmSNiVqVO/7f/zuu/9//v77/+XHn/9LTzz5z5O57T9QTpYWdtIqaWUuSjZksFASZGBmYmTgZmdmiDKXZqjyUWGAxhLVAa08YmKiIIAhqCfDB6aGkkcYGRnpm9mHTak16pFRj4x6ZNQjox4Z9cioR0Y9MuqRUY8QBCwDYCc7sBu8m0IzfgHxKmC3eeGAeMQc2GPcXWzhQqk5v/78Z1h1+pkXMEDMgdwqoIc+0NUjIjxsDC5aolQxy0tPjEFKgCOzfdvtF0Bu05DOI3kuivAxgCHtEQl+djBFS498+fLzD809ArXjCy09sgqYGWnuEagdq2jpkem5S68wzD/ymIEWMQMyE2Q2yA6QXSCClkOmptCMGArEPNT2CxCvZoAMwZ6mqUdI8DBF+ofdaPzotMJojIx6ZNQjox4Z9cioR0Y9MuqRUY+MemTUI6MeGfUIBAAEGABf6PJSlypjNAAAAABJRU5ErkJggg=='
    //   },
    //   br: {
    //     icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCMDhERkY0NjA2OTUxMUVFQTY0RTgzNjkyNTNGMzVENyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCMDhERkY0NzA2OTUxMUVFQTY0RTgzNjkyNTNGMzVENyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkIwOERGRjQ0MDY5NTExRUVBNjRFODM2OTI1M0YzNUQ3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkIwOERGRjQ1MDY5NTExRUVBNjRFODM2OTI1M0YzNUQ3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+cPT0awAAAWhJREFUeNpiZEjaxDCQ4P9cX6qYw0RDN3IDcR0QPwe5F4hfA/EcIDamhWUsNPRId4m7cmaxuzKDBD87w5svv0Q2nn+RnLfsSvK3X39NgPJnqWkZrWIkIsJMOrM7TAvsCRAQ4WFjSLaVY5gUpQPiZlLbQlp5JDbWUgarRLiZFJgaKh7h4+PEnmp52MHiPEPFI3QHox4Z9cioR0Y9MuqRUY+MemTUI6MeGfXIyPEIeqdBDNp7Mwdi1qHqERsuNubDpR7KDOZKggyszIwUGawjzTtgHsmcnaDPEGUuPeTzSECAocSwyOycnKzMNLfwy88/YIqWHjl79uEHmntk1elnYIqWHpkeO+c8w+n7H2gWE/OPPGbIXXoFbBe1zWdEG/tNhBa/prTwCxCvhnriNEyQWmO/6PXIfCgerdlHPUJpHvn///+oR0Y9MuqRUY+MemTUI6MeGfXIqEdGPTLqkVGPjHpk1CMMDAABBgCmmXle/HjmoAAAAABJRU5ErkJggg=='

    //   },
    //   ml: {
    //     icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxQTU2QUMzNzA2OTYxMUVFQjdGRkY3OTE2RjcyMkNEMiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxQTU2QUMzODA2OTYxMUVFQjdGRkY3OTE2RjcyMkNEMiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjFBNTZBQzM1MDY5NjExRUVCN0ZGRjc5MTZGNzIyQ0QyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjFBNTZBQzM2MDY5NjExRUVCN0ZGRjc5MTZGNzIyQ0QyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+8CFeFAAAAQpJREFUeNrs2jsKwkAQBuBNlBxAezu9hfEEFqawFlPZe5dUwRsoaGeEYDyAWCiiN/DVm5isu6sgmMLGCST8A8NsZmEnH0m5GuecFSE0QH4dbM86ogxEtt6tpUiHu+0JyUAJ+Xey/tSqDT0+3574PYpVyrXsib0uyUwiiOeJF/8Of3+REJ9ipk70y5pmo5pqNusVVSgGUkEMo5w+uqRrquQJknkAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggGQBCcNHkmrGibplEecJEgSHa6q5Ot5UyRPEsUcbttidmfwyUZyodc9dqz2KgZSXaiz2ulRjykf2uVQzzhUk6ygM5CnAAOICadIRyILyAAAAAElFTkSuQmCC'
    //   },
    //   mr: {
    //     icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxQTU2QUMzNzA2OTYxMUVFQjdGRkY3OTE2RjcyMkNEMiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxQTU2QUMzODA2OTYxMUVFQjdGRkY3OTE2RjcyMkNEMiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjFBNTZBQzM1MDY5NjExRUVCN0ZGRjc5MTZGNzIyQ0QyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjFBNTZBQzM2MDY5NjExRUVCN0ZGRjc5MTZGNzIyQ0QyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+8CFeFAAAAQpJREFUeNrs2jsKwkAQBuBNlBxAezu9hfEEFqawFlPZe5dUwRsoaGeEYDyAWCiiN/DVm5isu6sgmMLGCST8A8NsZmEnH0m5GuecFSE0QH4dbM86ogxEtt6tpUiHu+0JyUAJ+Xey/tSqDT0+3574PYpVyrXsib0uyUwiiOeJF/8Of3+REJ9ipk70y5pmo5pqNusVVSgGUkEMo5w+uqRrquQJknkAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggGQBCcNHkmrGibplEecJEgSHa6q5Ot5UyRPEsUcbttidmfwyUZyodc9dqz2KgZSXaiz2ulRjykf2uVQzzhUk6ygM5CnAAOICadIRyILyAAAAAElFTkSuQmCC'
    //   },
    //   mb: {
    //     icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozMTc0MTJGOTA2OTYxMUVFOERGMENCODMwQUFBNkVGNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozMTc0MTJGQTA2OTYxMUVFOERGMENCODMwQUFBNkVGNCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjMxNzQxMkY3MDY5NjExRUU4REYwQ0I4MzBBQUE2RUY0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjMxNzQxMkY4MDY5NjExRUU4REYwQ0I4MzBBQUE2RUY0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+2KBNMwAAAQxJREFUeNrs2S0LwlAUBuA7EcGqWG0aLOIPcCajYStWP1b8RRaHWAUNRrFs/gCxGLRZxVWZH5vnXmYZM4r3jveFy+p5OOdsF6aFYcjSkAxLSQABBBBAAAEEEEAAAQQQQP4VjQ1WSgNCu4PRUgJi0FnT8XnXJD1+VKPxGav4jpjlQn4x6ddZq1pkuayczbo/A+Ycr8ya7tnZu3UJM493ZGQTol0rSYvg4bXxGmdWQ9ScNFq6Tp1QJc1KQTxSveyuS7OnSrYnTzySIOMhLdDmcBELJWser0DU2LN3ouZvX3YzWiCd75WsFjoOR9Aba4krCq4ov7794v8IIIAAAggggAACCCCAAAIIICJvAQYA92RsHrLgA+MAAAAASUVORK5CYII='
    //   },
    //   mt: {
    //     icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozMTc0MTJGOTA2OTYxMUVFOERGMENCODMwQUFBNkVGNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozMTc0MTJGQTA2OTYxMUVFOERGMENCODMwQUFBNkVGNCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjMxNzQxMkY3MDY5NjExRUU4REYwQ0I4MzBBQUE2RUY0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjMxNzQxMkY4MDY5NjExRUU4REYwQ0I4MzBBQUE2RUY0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+2KBNMwAAAQxJREFUeNrs2S0LwlAUBuA7EcGqWG0aLOIPcCajYStWP1b8RRaHWAUNRrFs/gCxGLRZxVWZH5vnXmYZM4r3jveFy+p5OOdsF6aFYcjSkAxLSQABBBBAAAEEEEAAAQQQQP4VjQ1WSgNCu4PRUgJi0FnT8XnXJD1+VKPxGav4jpjlQn4x6ddZq1pkuayczbo/A+Ycr8ya7tnZu3UJM493ZGQTol0rSYvg4bXxGmdWQ9ScNFq6Tp1QJc1KQTxSveyuS7OnSrYnTzySIOMhLdDmcBELJWser0DU2LN3ouZvX3YzWiCd75WsFjoOR9Aba4krCq4ov7794v8IIIAAAggggAACCCCAAAIIICJvAQYA92RsHrLgA+MAAAAASUVORK5CYII='
    //   },
    //   // only is hasRotatingPoint is not set to false
    //   mtr: {
    //     icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1MTVGRTAxNDA2OTYxMUVFOEMzOUVDQ0MzRUIzMDU1RiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1MTVGRTAxNTA2OTYxMUVFOEMzOUVDQ0MzRUIzMDU1RiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjUxNUZFMDEyMDY5NjExRUU4QzM5RUNDQzNFQjMwNTVGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjUxNUZFMDEzMDY5NjExRUU4QzM5RUNDQzNFQjMwNTVGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+UHgi5QAAAVtJREFUeNpi/P//P8NwAIyjHhn1yKhHRj0y6pFRj4x6ZNQjox4Z9cioR0acRxiTN1Ok//9cX6p4hIlhmIBRjxAALkC8Fog/glIPFH+EirnQwkIWGpjZpirOXdkRosngoinKwMcJseLT9z98e66/DqpYcz3o9suv7UChqsGc2V3UJXh2n6i2YRDgYsWq/sO33wwWrUcYbr744grk7hmsmT2zLVgDpydAACQHUgNSO5jziAsoORECbtpgNW6D2SN8sDyBD/Cwg9XwjBa/dPDIJ2DpRFDRl59gNV8Gs0f2AItYgop2XQWr2TWYPTK9et0NcBGLC4DkQGpAagd1jNx4/qUdVE+sO/ec4fMPRDIDsUFiIDmQGpDaodD6dYHWE6BKjxfmFyDeDY2JPdRu/bLQqBDZQ+0QHy1+R7u6ox4Z9cioR0Y9MuqRUY+MemTUI6MeGfXIqEdGPUIcAAgwAE/yyk9QZxQnAAAAAElFTkSuQmCC'
    //   }
    // })
    // canvas.renderAll()
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
    this.canvas.skipTargetFind = false
    this.canvas.FX_DURATION = 500 // 设置动画时长，默认500毫秒

    this.canvas.setWidth(this.boxWidth)
    this.canvas.setHeight(this.boxHeight)

    // this.changeBigZoom()
    // setTimeout(() => {
    //   if (this.zoom !== 1) {
    //     this.setZoom(this.zoom) // 如果不是默认的1,则强制按父组件传入的比例显示
    //   }
    // }, 100)

    // 画布初始化
    this.initbg({backgroundColor: this.backgroundColor, width: this.width, height: this.height})
    this.getBlack({width: this.width, height: this.height}, this.BgColor) // 遮罩  this.BgColor

    if (this.showRule === 'true') {
      //  初始化标尺(辅助-标尺)
      initFabricRuler.drawfabricRuler(canvas)
    }

    this.setCursor(99)

    if (this.showGuideline === 'true') {
      // 初始化辅助线(辅助-对齐线)
      initAligningGuidelines(canvas)
    }

    document.onkeydown = function (e) {
      let keyCode = window.event.keyCode
      if (keyCode === 46) { // Delete
        if (document.activeElement.tagName === 'INPUT') { return }
        if (document.activeElement.tagName === 'TEXTAREA') { return }
        that.removeActiveObject()
      }
      if (event.shiftKey && keyCode === 68) { // Shift + D
        that.copypaste()
      }
      if (keyCode === 37) { // ←
        // console.warn(document.activeElement.tagName)
        if (document.activeElement.tagName === 'INPUT') { return }
        if (document.activeElement.tagName === 'TEXTAREA') { return }
        e.preventDefault()
        e.stopPropagation()
        that.getEditObj().left = parseInt(that.getEditObj().left - 1)
        let objects = that.getObjectsNew()
        objects.forEach((obj, i) => {
          if (obj.id === that.getEditObj().id && obj.isType === 'TextRect-text') {
            obj.left = parseInt(obj.left - 1)
          }
        })
        that.$emit('canvasToData', that.getEditObj(), '←-1')

        that.getEditObj().setCoords()
        that.canvas.requestRenderAll()
        that.canvas.renderAll()
      }
      if (keyCode === 38) { // ↑
        if (document.activeElement.tagName === 'INPUT') { return }
        if (document.activeElement.tagName === 'TEXTAREA') { return }
        e.preventDefault()
        e.stopPropagation()
        that.getEditObj().top = parseInt(that.getEditObj().top - 1)
        let objects = that.getObjectsNew()
        objects.forEach((obj, i) => {
          if (obj.id === that.getEditObj().id && obj.isType === 'TextRect-text') {
            obj.top = parseInt(obj.top - 1)
          }
        })
        that.$emit('canvasToData', that.getEditObj(), '↑-1')

        that.getEditObj().setCoords()
        that.canvas.requestRenderAll()
        that.canvas.renderAll()
      }
      if (keyCode === 39) { // →
        if (document.activeElement.tagName === 'INPUT') { return }
        if (document.activeElement.tagName === 'TEXTAREA') { return }
        e.preventDefault()
        e.stopPropagation()
        that.getEditObj().left = parseInt(that.getEditObj().left + 1)
        let objects = that.getObjectsNew()
        objects.forEach((obj, i) => {
          if (obj.id === that.getEditObj().id && obj.isType === 'TextRect-text') {
            obj.left = parseInt(obj.left + 1)
          }
        })
        that.$emit('canvasToData', that.getEditObj(), '→+1')

        that.getEditObj().setCoords()
        that.canvas.requestRenderAll()
        that.canvas.renderAll()
      }
      if (keyCode === 40) { // ↓
        if (document.activeElement.tagName === 'INPUT') { return }
        if (document.activeElement.tagName === 'TEXTAREA') { return }
        e.preventDefault()
        e.stopPropagation()
        that.getEditObj().top = parseInt(that.getEditObj().top + 1)
        let objects = that.getObjectsNew()
        objects.forEach((obj, i) => {
          if (obj.id === that.getEditObj().id && obj.isType === 'TextRect-text') {
            obj.top = parseInt(obj.top + 1)
          }
        })
        that.$emit('canvasToData', that.getEditObj(), '↓+1')

        that.getEditObj().setCoords()
        that.canvas.requestRenderAll()
        that.canvas.renderAll()
      }
    }

    let that = this
    this.canvas.on('after:render', function (e) {
      // 标尺显示活跃元素坐标和范围(辅助-活跃元素)
      // initFabricRuler.calcObjectRect()
    })
    this.canvas.on('mouse:wheel', function (e) {
      if (that.isMoveing) {
        var zoom = (event.deltaY > 0 ? -0.1 : 0.1) + that.canvas.getZoom()
        zoom = Math.max(0.1, zoom) // 最小为原来的1/10
        zoom = Math.min(10, zoom) // 最大是原来的10倍
        that.setZoom(zoom) // 改变画布的缩放
        e.e.preventDefault()
        e.e.stopPropagation()

        // 标尺位置想要固定在顶部(辅助-标尺)
        initFabricRuler.rulerNomove()
      }
    })
    this.canvas.on('mouse:down', function (options) {
      if (that.isMoveing) { // 是否拖拽移动
        that.panning = true
        canvas.selection = false

        that.lastPosX = options.e.clientX
        that.lastPosY = options.e.clientY
      }
      that.canvas.clearContext(that.canvas.contextTop)// 清除边框线
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
      // console.log(e.absolutePointer, e.pointer  && e && e.e)

      // console.log(e.absolutePointer)

      if (that.isMoveing && that.panning) {
        // console.log(that.canvas.viewportTransform)
        // eslint-disable-next-line no-undef
        // var delta = new fabric.Point(e.e.movementX, e.e.movementY)
        // canvas.relativePan(delta)
        that.canvas.discardActiveObject()
        canvas.viewportTransform[4] += e.e.clientX - that.lastPosX
        canvas.viewportTransform[5] += e.e.clientY - that.lastPosY
        that.lastPosX = e.e.clientX
        that.lastPosY = e.e.clientY
        canvas.setViewportTransform(canvas.viewportTransform)
        // 标尺位置想要固定在顶部(辅助-标尺)
        initFabricRuler.rulerNomove()
      }
      // 鼠标的坐标显示虚点(辅助-鼠标点)
      // initFabricRuler.drawPoint(e.absolutePointer.x, e.absolutePointer.y)

      that.canvas.requestRenderAll()
      that.$emit('mouse:move', e)
    })
    this.canvas.on('mouse:over', function (options) {
      if (options.target && options.target.id) {
        let ctx = that.canvas.contextTop
        // console.log(canvas, canvas.getSelectionContext(), canvas.contextContainer, canvas.contextTop)
        ctx.strokeStyle = 'rgba(0,98,178,1)'
        ctx.lineWidth = 2
        ctx.setLineDash([6, 4, 2])
        canvas.forEachObject(function (obj) {
          if (obj && obj.id !== undefined) {
            if (obj.component === 'component' && obj.isType !== 'TextRect-text' && options.target.id === obj.id) {
              var bound = obj.getBoundingRect(false, true)
              ctx.strokeRect(
                bound.left - 1,
                bound.top - 1,
                bound.width + 2,
                bound.height + 2
              )
            }
          }
        })
      }

      that.$emit('mouse:over', options)
    })
    this.canvas.on('mouse:out', function (options) {
      // let bound = options.target
      // if (bound) {
      //   bound.set('opacity', 1)
      // }
      that.canvas.clearContext(that.canvas.contextTop)// 清除边框线
      if (!options.target) {
        // that.canvas.remove(...initFabricRuler.returnsRuler('sPoint')) // 删除已有的标记(辅助-鼠标点)
        that.canvas.requestRenderAll()
        that.canvas.renderAll()
      }
      that.$emit('mouse:out', options)
    })
    this.canvas.on('selection:created', function (options) {
      if (options.selected.length > 1) {
        options.target.hasRotatingPoint = false
        options.target.hasControls = false
      }
      // console.log('选择元素selection:created', options.selected)
      let selectid = []
      options.selected.forEach(one => {
        selectid.push(one.id)
      })
      that.$emit('selectId', selectid)
      that.$emit('selection:created', options)
    })
    this.canvas.on('selection:updated', function (options) {
      // console.log('选择元素selection:updated', options)
      let selectid = []
      if (options.target._objects) {
        options.target._objects.forEach(one => {
          selectid.push(one.id)
        })
      } else {
        options.selected.forEach(one => {
          selectid.push(one.id)
        })
      }
      that.$emit('selectId', selectid)
      that.$emit('selection:updated', options)
    })
    this.canvas.on('selection:cleared', function (options) {
      // console.log('选择元素selection:cleared', options)
      // if (options.deselected) {
      //   options.deselected.forEach(one => {
      //     one.set('opacity', 1) // 解决sheift选择元素透明度0.8恢复不了的问题
      //   })
      // }
      that.$emit('selectId', [])
      that.$emit('selection:cleared', options)
    })
    this.canvas.on('before:selection:cleared', function (options) {
      that.$emit('before:selection:cleared', options)
    })
    this.canvas.on('object:added', function (options) {
      that.$emit('object:added', options)
    })
    this.canvas.on('object:removed', function (options) {
      that.$emit('object:removed', options)
    })
    this.canvas.on('object:selected', function (options) {
      // console.log('选择元素object:selected', options)
      that.$emit('object:selected', options)
    })
    this.canvas.on('object:modified', function (options) {
      that.$emit('object:modified', options)
    })
    this.canvas.on('object:rotating', function (options) {
      that.$emit('object:rotating', options)
    })
    this.canvas.on('object:scaling', function (options) {
      that.$emit('object:scaling', options)
    })
    this.canvas.on('object:moving', function (options) {
      if (options.target._objects) {
        options.target._objects.forEach(obj => {
          if (obj.isType === 'TextRect') {
            obj.text.set({
              left: obj.left + options.target.translateX,
              top: obj.top + options.target.translateY
            })
          }
        })
      }
      that.$emit('object:moving', options)
    })
    this.canvas.on('object:scaled', function (options) {
      that.$emit('object:scaled', options)
      if (options.target.isType === 'Barcode') { // 条形码的位置显示
        options.target.set('height', parseInt(options.target.height * options.target.scaleY))
        options.target.set('scaleY', 1)
        options.target.item(0).set('height', parseInt(options.target.height * options.target.scaleY))
        options.target.item(1).set('height', parseInt(options.target.height * options.target.scaleY))
        that.changeBarcodeImage(options.target)
      }
      if (options.target.isType === 'Qrcode') { // 二维码放大缩小时重新获取图片，二维码图片不失真
        options.target.set('width', parseInt(options.target.width * options.target.scaleX))
        options.target.set('height', parseInt(options.target.height * options.target.scaleY))
        options.target.set('scaleX', 1)
        options.target.set('scaleY', 1)
        that.changeQrcodeImage(options.target)
        // that.setActiveObject(options.target)
      }
      if (options.target.isType === 'tableList') {
        setTimeout(() => {
          that.objectSetZindex() // 元素顺序
        }, 100)
      }
    })
    this.canvas.on('object:rotated', function (options) {
      that.$emit('object:rotated', options)
    })
    this.canvas.on('object:moved', function (options) {
      that.$emit('object:moved', options)
    })
    this.canvas.on('text:changed', function (options) {
      that.$emit('text:changed', options)
    })
    this.canvas.on('text:editing:entered', function (options) {
      that.$emit('text:editing:exited', options)
    })
    this.canvas.on('text:editing:exited', function (options) {
      that.$emit('text:editing:exited', options)
    })
  },
  methods: {
    /**
     * 设置画布中心到指定对象中心点上
     * @param {Object} obj 指定的对象
     */
    setCenterFromObject (obj) {
      const { canvas } = this
      const objCenter = obj.getCenterPoint()
      console.log('getCenterPoint', objCenter)
      const viewportTransform = canvas.viewportTransform
      // if (canvas.width === undefined || canvas.height === undefined || !viewportTransform) return
      viewportTransform[4] = canvas.width / 2 - objCenter.x * viewportTransform[0]
      viewportTransform[5] = canvas.height / 2 - objCenter.y * viewportTransform[3]
      // console.log('viewportTransform:', viewportTransform, viewportTransform[4], viewportTransform[5])
      canvas.setViewportTransform(viewportTransform)
      canvas.renderAll()
    },
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
      options = {
        width: options.width ? options.width : this.width,
        height: options.height ? options.height : this.height,
        backgroundColor: options.hasOwnProperty('backgroundColor') && Object.prototype.toString.call(options.backgroundColor) === '[object String]' && options.backgroundColor !== '' ? options.backgroundColor : ''
      }
      // 白色画布相对canvas偏移量
      this.xLeft = 0 // -left
      this.yTop = 0 // -top
      // eslint-disable-next-line no-undef
      let rect = new fabric.Rect({
        left: 0,
        top: 0,
        width: options.width,
        height: options.height,
        fill: JSON.parse(JSON.stringify(options.backgroundColor)),

        component: 'canvasbg',
        type: 'Rect',
        originX: 'left',
        originY: 'top',
        name: 'background',
        selectable: false,
        hasControls: false,
        evented: false,
        visible: true,
        isType: 'sBg',
        isDiff: 'none',
        flipX: false,
        flipY: false,
        padding: 0,
        angle: 0,
        scaleX: 1,
        scaleY: 1,
        stopContextMenu: true, // 禁掉鼠标右键默认事件
        hoverCursor: 'default',
        strokeWidth: 1,
        stroke: '#999',
        excludeFromExport: true,
        perPixelTargetFind: false
      })
      if (options.backgroundColor === '') {
        rect.set({
          stroke: '#333',
          strokeWidth: 1
        })
      }
      // 超出不显示
      // rect.clone((cloned) => {
      //   this.canvas.inverted = false
      //   this.canvas.absolutePositioned = false
      //   this.canvas.clipPath = cloned
      //   this.canvas.requestRenderAll()
      // })
      this.canvas.add(rect)
      this.setCenterFromObject(rect) // 设置画布中心到指定对象中心点上

      rect.sendToBack()
      this.canvas.requestRenderAll()
      this.canvas.renderAll()
    },
    // 遮罩置顶
    setTop () {
      let objects = this.canvas.getObjects()
      objects.forEach((obj) => {
        if (obj.isType === 'sMask') {
          // console.log('遮罩置顶')
          obj.zIndex = -1
          obj.bringToFront()
          this.canvas.renderTop()
          this.canvas.renderAll()
        }
        if (obj.isType === 'sRulerBg') {
          // console.log('遮罩置顶')
          obj.zIndex = -1
          obj.bringToFront()
          this.canvas.renderTop()
          this.canvas.renderAll()
        }
        if (obj.isType === 'sRuler') {
          // console.log('遮罩置顶')
          obj.zIndex = -1
          obj.bringToFront()
          this.canvas.renderTop()
          this.canvas.renderAll()
        }
        if (obj.isType === 'sBg') {
          // console.log('背景置底')
          obj.zIndex = -5
          obj.sendToBack()
          this.canvas.renderTop()
          this.canvas.renderAll()
        }
      })
    },
    // 循环里单个移动层级
    moveOneObject (obj, layer) {
      return new Promise(async (resolve) => {
        await this.moveToshow(obj, layer)
        this.renderAll()
        resolve({'obj': obj.isType, 'layer': layer})
      })
    },
    // 所有组件顺序保持
    objectSetZindex () {
      return new Promise(resolve => {
        let objects = this.getObjectsNew()
        objects.sort((a, b) => {
          return a.layer - b.layer
        })
        setTimeout(async () => {
          let res
          for (let i = 0; i < objects.length; i++) {
            let obj = objects[i]
            // console.log(obj.id, obj.isType, obj.layer, obj.zIndex, obj.text)
            if (typeof (obj.text) === 'string' && obj.isType === 'TextRect-text') {
              obj.layer = obj.zIndex + 1
              res = await this.moveOneObject(obj, obj.layer)
            } else {
              res = await this.moveOneObject(obj, obj.layer)
            }
            // console.log(res)
            // eslint-disable-next-line no-constant-condition
            // if (typeof obj.text === 'object') {
            //   console.log(typeof obj.text, obj.text.layer)
            //   await this.moveToshow(obj.text, obj.layer + 0.5)
            // }
          }
          resolve(res)
        }, 100)
      })
      // let objectsmore = this.getObjects()
      // objectsmore.forEach(oneobj => {
      //   console.warn(oneobj.id, oneobj.isType, oneobj.component, oneobj.layer)
      //   if (oneobj.component) {
      //     this.moveToshow(oneobj, oneobj.layer)
      //     if (typeof oneobj.text === 'object') {
      //       console.log(typeof oneobj.text, oneobj.text.layer)
      //       this.moveToshow(oneobj.text, oneobj.text.layer)
      //     }
      //   }
      //   this.renderAll()
      // })
    },
    /**
     [0]: 水平缩放（x轴方向）
     [1]: 水平倾斜（x轴方向）
     [2]: 垂直倾斜（y轴方向）
     [3]: 垂直缩放（y轴方向）
     [4]: 水平移动（x轴方向）
     [5]: 垂直移动（y轴方向）
     * */
    // 画遮罩区域
    getBlack (options, color) {
      let that = this
      let bg = that.returnbg()
      if (that.returnsMask().length && that.returnsMask().length > 0) {
        that.canvas.remove(...that.returnsMask())
      }
      const pathOption = {
        type: 'Rect',
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
        isType: 'sMask'
      }

      // eslint-disable-next-line no-undef
      const rect1 = new fabric.Rect({
        ...pathOption,
        left: bg.left - 1000,
        top: bg.top - 1000,
        width: 2000 + options.width,
        height: 1000
      })
      // eslint-disable-next-line no-undef
      const rect2 = new fabric.Rect({
        ...pathOption,
        left: bg.left + 2 + options.width,
        top: bg.top - 1000,
        width: 1000,
        height: 1000 + options.height + 1000
      })
      // eslint-disable-next-line no-undef
      const rect3 = new fabric.Rect({
        ...pathOption,
        left: bg.left - 1000,
        top: options.height + 2 + bg.top,
        width: 1000 + options.width + 1000,
        height: 1000
      })

      // eslint-disable-next-line no-undef
      const rect4 = new fabric.Rect({
        ...pathOption,
        left: -1000,
        top: -1000,
        width: 1000,
        height: 1000 + options.height + 1000
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
    },

    // 改变宽高背景颜色
    changeWH (options) {
      if (!options) { return }
      options = {
        width: options.width ? options.width : this.width,
        height: options.height ? options.height : this.height,
        backgroundColor: options.backgroundColor !== '' ? options.backgroundColor : this.backgroundColor
      }

      this.canvas.setWidth(this.boxWidth)
      this.canvas.setHeight(this.boxHeight)
      let bg = this.returnbg()
      this.canvas.remove(bg)
      let that = this
      setTimeout(() => {
        that.changeBigZoom()
        that.initbg(options) // 画布初始化
        that.getBlack({width: options.width, height: options.height}, that.BgColor) // 遮罩
      }, 100)
      // this.setCursor(99)

      this.$emit('canvasToData', bg, 'canvaswhcolor')
      this.canvas.requestRenderAll()
      this.canvas.renderAll()
    },
    // 改变画布背景颜色
    changeBackgroundColor (color) {
      // console.log(color)
      let bg = this.returnbg()
      if (color !== null && color !== undefined && color !== '') {
        bg.set({
          fill: color
        })
      } else {
        bg.set({
          fill: '#E1E6F6',
          stroke: '#333',
          strokeWidth: 1,
          shadow: 'rgba(0, 0, 0, 0.8) 5px 5px 2px'
        })
      }
      this.$emit('canvasToData', bg, 'canvasColor')
      this.canvas.requestRenderAll()
      this.canvas.renderAll()
    },
    // 设置缩放比
    setZoomOld (n) {
      this.canvasZoom = n
      // let canvaCenterLeft = this.boxWidth / 2
      // let canvaCenterTop = this.boxHeight / 2
      // console.log(canvaCenterLeft, canvaCenterTop)
      let bg = this.returnbg()
      const objCenter = bg.getCenterPoint()
      // console.log(objCenter)
      // eslint-disable-next-line no-undef
      let zoomPoint = new fabric.Point(objCenter.x, objCenter.y) // 居中缩放中心
      this.canvas.zoomToPoint(zoomPoint, n)
      this.changeOrigin() // 按当前比例居中
      setTimeout(() => {
        this.canvas.renderAll()
        this.$emit('changeZoomTo', n)
      }, 100)
    },
    // 设置缩放
    setZoom (n) {
      this.canvasZoom = n
      this.canvas.setZoom(n)
      this.changeOrigin() // 按当前比例居中
      setTimeout(() => {
        this.canvas.renderAll()
        this.$emit('changeZoomTo', n)
      }, 100)
    },
    // 获取当前的比例
    getZoom () {
      return this.canvas.getZoom()
    },
    // 按照1:1缩放
    changeOneZoom () {
      let canvas = this.canvas
      canvas.setZoom(1)
      // this.canvas.absolutePan({x: 0, y: 0})
      this.changeOrigin() // 按当前比例居中
      this.canvasZoom = 1
      this.$emit('changeZoomTo', 1)
    },
    // 按照当前缩放比居中
    changeOrigin () {
      let canvas = this.canvas
      let bg = this.returnbg()
      const objCenter = bg.getCenterPoint()
      const viewportTransform = canvas.viewportTransform
      viewportTransform[4] = canvas.width / 2 - objCenter.x * viewportTransform[0]
      viewportTransform[5] = canvas.height / 2 - objCenter.y * viewportTransform[3]
      canvas.setViewportTransform(viewportTransform)
      // 标尺位置想要固定在顶部(辅助-标尺)
      initFabricRuler.rulerNomove()
      canvas.renderAll()
    },
    // 画布左上对齐
    changeLeftTop () {
      // let bg = this.returnbg()
      let zoom = this.canvas.getZoom()
      this.canvasZoom = zoom
      let canvaCenterLeft = this.boxWidth / 2 - this.width / 2
      let canvaCenterTop = this.boxHeight / 2 - this.height / 2
      // console.log(bg.left, bg.top, zoom, Math.abs(canvaCenterLeft * zoom), Math.abs(canvaCenterTop * zoom))
      // eslint-disable-next-line no-undef
      let zoomPoint = new fabric.Point(canvaCenterLeft * zoom, canvaCenterTop * zoom) // 居中缩放中心
      this.canvas.absolutePan(zoomPoint)
      this.$emit('changeZoomTo', zoom)
      this.canvas.renderAll()
    },
    // 铺满
    changeBigZoom () {
      // eslint-disable-next-line no-unused-vars
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
      // console.log('初始化缩放按最大的宽高适配：', Zoom)
      this.setZoom(parseFloat(Zoom))
      this.changeOrigin() // 按当前比例居中
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
        case 1:fabric.Canvas.prototype.defaultCursor = "url('data:image/ico;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////EPPz80y5ubmxx8fHif///x7///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/gTz8/NgdXV16Wpqav9zc3P5srKyqff39x4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8E9fX1RIiIiN1zc3P/YWFh/7S0tP9tbW3/w8PDnf///wwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////BObm5kyPj4/PkZGR//Hx8f/Jycn/ampq/5GRkf+Hh4fh////NgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wT///9AiYmJ2YuLi//8/Pz///////////+7u7v/Hh4e/8HBwbX///8OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8E5OTkTIuLi9OVlZX/9PT0///////+/v7/5OTk/3h4ePusrKzJ+Pj4SgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////BP///0CLi4vTiIiI//n5+f///////////+zs7P9zc3P/p6entf///yr+/v4CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wTm5uZMiYmJ2ZWVlf/5+fn//v7+//7+/v/h4eH/dXV1+6+vr6v4+Pgk////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/v4E9fX1RI+Pj8+Li4v/9PT0///////+/v7/8PDw/3Jycv2kpKS3////Kv///wIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////BO7u7kaIiIjdkZGR//z8/P///////////+Hh4f9ycnL9s7Ozqf///yYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/gLq6upKkJCQzY+Pj//y8vL///////7+/v/s7Oz/dXV1+6SkpLf///8m////AgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8E/v7+QIiIiN2NjY3//Pz8////////////5OTk/3Nzc/+vr6+r////KgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////BOTk5EyNjY3Pk5OT//Pz8////////v7+/+bm5v94eHj7p6entfj4+CT///8CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///84ioqK1YiIiP/8/Pz////////////p6en/dHR0/6mpqbH///8q////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/hbIyMiLtbW10eDg4FYAAAAA/f39IqSkpNVUVFT/tra2//7+/v/+/v7/4uLi/3d3d/usrKyv9fX1Jv7+/gIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3d3dXnZ2dvOAgID/q6urzf///xT8/Pw8cHBw/7CwsP92dnb/sLCw/+3t7f9xcXH/pqamt////yr+/v4CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADW1tZ4b29v/7Gxsf+hoaHn////JMPDw614eHj/9vb2//X19f9tbW3/MjIy/bm5ubf///8kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANbW1nhvb2//sbGx/6Ghoef+/v5UkJCQ57Ozs//IyMj/aGho/19fX/2mpqbX////Tv///wIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1tbWeG9vb/+xsbH/oaGh5/7+/l6IiIjrgoKC/3t7e/PY2Nit+vr6ev///xgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADW1tZ4b29v/7Gxsf+hoaHn////JtPT02LKysqV6OjoPv///w7///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/gL///8a////Gv///xr///8a////GtbW1nhvb2//sbGx/6Ghoef///8s////Gv///xr///8a////Gv7+/hAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8YyMjIiaSkpOekpKTnpKSk56SkpOekpKTno6Oj72lpaf+0tLT/ioqK/aSkpOekpKTnpKSk56SkpOekpKTnra2tzeDg4FYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///0xpaWnzra2t/62trf+tra3/ra2t/62trf+tra3/vLy8/+bm5v+ysrL/ra2t/62trf+tra3/ra2t/62trf9+fn7/tbW10QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v7+LJeXl8VsbGz/bGxs/2xsbP9sbGz/bGxs/2tra/9nZ2f/vr6+/2ZmZv9sbGz/bGxs/2xsbP9sbGz/bGxs/3R0dPPIyMiLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8G9/f3LNra2nLa2tpy2tractra2nLa2tpy0NDQpW9vb/+xsbH/oqKi79vb23ba2tpy2tractra2nLa2tpy4eHhWv7+/hYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADW1tZ4b29v/7Gxsf+hoaHn////IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANbW1nhvb2//sbGx/6Ghoef///8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1tbWeG9vb/+xsbH/oaGh5////yAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADW1tZ4b29v/7Gxsf+hoaHn////IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANbW1nhvb2//sbGx/6Ghoef///8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9vb2LJeXl8VpaWnzx8fHif///wIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8G/v7+LP///0z///8YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////5////8P///+B////Af///gH///wD///4B///8A///+Af///AP///gH///wD///4B///8A///OAf//xgP//8QH///ED///xD///8b////H///gAB//4AAP/+AAD///h////8f////H////x////8f////H////x////////8=') ,auto" // 绘图
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
    returnsMask () {
      let objects = this.canvas.getObjects()
      let returndata = []
      objects.forEach((one) => {
        if (one.isType === 'sMask') {
          returndata.push(one)
        }
      })
      return returndata
    },
    // 返回背景
    returnbg () {
      let objects = this.canvas.getObjects()
      let returndata
      objects.forEach((one) => {
        if (one.isType === 'sBg') {
          returndata = one
        }
      })
      return returndata
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
            // console.log('鼠标右键事件')
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

      // obj.bringToFront()
      let allobjects = this.getObjectsNew()
      // allobjects.forEach((one) => {
      //   if (one.id === obj.id && one.isType === 'TextRect-text') {
      //     one.bringToFront()
      //   }
      // })

      let index = obj.layer
      let array = []
      allobjects.sort((a, b) => {
        return a.layer - b.layer
      })
      allobjects.forEach((obj, index) => {
        if (obj.isType !== 'TextRect-text') {
          array.push({
            id: obj.id,
            layer: obj.layer,
            isType: obj.isType
          })
        }
      })
      if (obj.layer === array.length) {
        return
      }
      // console.log(array)
      var moveNum = array.length - index
      let newarry
      // 循环出需要一个一个上移的次数
      for (var i = 0; i < moveNum; i++) {
        newarry = this.swapArray(array, index, index - 1)
        index++
      }
      console.log(newarry)
      array.forEach((one, ilayer) => {
        allobjects.forEach((obj, index) => {
          if (obj.id === one.id) {
            obj.set({layer: ilayer + 1, zIndex: ilayer + 1})
          }
        })
      })
      setTimeout(async () => {
        allobjects.sort((a, b) => {
          return a.layer - b.layer
        })
        await this.objectSetZindex() // 元素顺序

        this.setTop() // 遮罩置顶，背景置底重置

        this.$emit('changeLayer', obj) // 层级变动回调
      }, 100)
    },
    // 移动array
    swapArray (arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
      return arr
    },
    // 上移一层
    toLastLayer () {
      let obj = this.canvas.getActiveObject()
      if (!obj) {
        return
      }
      // obj.bringForward(true)

      let index = obj.layer
      let allobjects = this.getObjectsNew()
      let array = []
      allobjects.sort((a, b) => {
        return a.layer - b.layer
      })
      allobjects.forEach((obj, index) => {
        if (obj.isType !== 'TextRect-text') {
          array.push({
            id: obj.id,
            layer: obj.layer,
            isType: obj.isType
          })
        }
      })
      if (obj.layer === array.length) {
        return
      }
      // console.log(array)
      let newarry = this.swapArray(array, index, index - 1) // 对图层交换移动位置
      console.log(newarry)
      array.forEach((one, ilayer) => {
        allobjects.forEach((obj, index) => {
          if (obj.id === one.id) {
            obj.set({layer: ilayer + 1, zIndex: ilayer + 1})
          }
        })
      })
      setTimeout(async () => {
        allobjects.sort((a, b) => {
          return a.layer - b.layer
        })
        await this.objectSetZindex() // 元素顺序

        this.setTop() // 遮罩置顶，背景置底重置

        this.$emit('changeLayer', obj) // 层级变动回调
      }, 100)
    },
    // 下移一层
    toNextLayer () {
      let obj = this.canvas.getActiveObject()
      if (!obj) {
        return
      }
      // obj.sendBackwards(true)

      let index = obj.layer
      let allobjects = this.getObjectsNew()
      let array = []
      allobjects.sort((a, b) => {
        return a.layer - b.layer
      })
      allobjects.forEach((obj, index) => {
        if (obj.isType !== 'TextRect-text') {
          array.push({
            id: obj.id,
            layer: obj.layer,
            isType: obj.isType
          })
        }
      })
      if (obj.layer === 1) {
        return
      }
      // console.log(obj.layer)
      this.swapArray(array, index - 1, index - 2) // 对图层交换移动位置
      // console.log(obj.layer, array)
      array.forEach((one, ilayer) => {
        allobjects.forEach((obj, index) => {
          if (obj.id === one.id) {
            obj.set({layer: ilayer + 1, zIndex: ilayer + 1})
          }
        })
      })
      setTimeout(async () => {
        allobjects.sort((a, b) => {
          return a.layer - b.layer
        })
        await this.objectSetZindex() // 元素顺序

        this.setTop() // 遮罩置顶，背景置底重置

        this.$emit('changeLayer', obj) // 层级变动回调
      }, 100)
    },
    // 置于底层
    toBottomLayer () {
      let obj = this.canvas.getActiveObject()

      if (!obj) {
        return
      }

      let allobjects = this.getObjectsNew()
      // allobjects.forEach((one) => {
      //   if (one.id === obj.id && one.isType === 'TextRect-text') {
      //     one.sendToBack()
      //   }
      // })
      // obj.sendToBack()

      let index = obj.layer
      let array = []
      allobjects.sort((a, b) => {
        return a.layer - b.layer
      })
      allobjects.forEach((obj, index) => {
        if (obj.isType !== 'TextRect-text') {
          array.push({
            id: obj.id,
            layer: obj.layer,
            isType: obj.isType
          })
        }
      })
      if (obj.layer === 1) {
        return
      }
      // console.log(obj.layer)
      var moveNum = index - 1
      // eslint-disable-next-line no-unused-vars
      var newarry = []
      // 循环出需要一个一个上移的次数
      for (var i = 0; i < moveNum; i++) {
        newarry = this.swapArray(array, index - 1, index - 2)
        // console.log(this.allData);
        index--
      }
      // console.log(obj.layer, array)
      array.forEach((one, ilayer) => {
        allobjects.forEach((obj, index) => {
          if (obj.id === one.id) {
            obj.set({layer: ilayer + 1, zIndex: ilayer + 1})
          }
        })
      })
      setTimeout(async () => {
        allobjects.sort((a, b) => {
          return a.layer - b.layer
        })
        await this.objectSetZindex() // 元素顺序

        this.setTop() // 遮罩置顶，背景置底重置

        this.$emit('changeLayer', obj) // 层级变动回调
      }, 100)
    },
    // 层级移动
    moveToshow (obj, index) {
      // let obj = this.canvas.getActiveObject();
      // console.log('moveToshow', Math.ceil(index))
      // this.canvas.moveTo(obj, index)
      obj.moveTo(Math.ceil(index))
      this.canvas.requestRenderAll()
      this.canvas.renderAll()
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
    // 删除指定元素
    removeObj (obj) {
      this.canvas.remove(obj)
      this.canvas.renderAll()
    },
    // 删除指定ID
    deleteObjById (id) {
      this.discardActive()
      let allobjects = this.getObjectsNew()
      allobjects.forEach((one) => {
        if (one.id === id) {
          // this.removeObj(one)
          this.canvas.fxRemove(one, {
            onComplete () {
              // console.log('删除成功后调用')
            }
          })
          this.canvas.renderAll()
        }
      })
    },
    // 删除指定IDs
    deleteObjByIds (ids) {
      this.discardActive()
      let allobjects = this.getObjectsNew()
      ids.forEach(id => {
        allobjects.forEach((one) => {
          if (one.id === id) {
            // this.removeObj(one)
            this.canvas.fxRemove(one, {
              onComplete () {
                console.log('删除成功后调用')
              }
            })
            this.canvas.renderAll()
          }
        })
      })
    },
    // 指定ID活跃
    setActiveById (id) {
      this.discardActive()
      let allobjects = this.getObjectsNew()
      allobjects.forEach((one) => {
        if (one.id === id && one.isType !== 'TextRect-text') {
          this.setActiveObject(one)
        }
      })
    },
    // 指定IDs活跃
    setActiveByIds (ids) {
      this.discardActive()
      let allobjects = this.getObjectsNew()
      ids.forEach(id => {
        allobjects.forEach((one) => {
          if (one.id === id) {
            this.setActiveObject(one)
          }
        })
      })
    },
    // 新增指定元素
    addObj (obj) {
      this.canvas.add(obj)
      this.canvas.renderAll()
    },
    // 复制粘贴
    copypaste () {
      let clipboard = this.canvas.getActiveObject()
      if (clipboard === undefined || clipboard == null) {
        return false
      }
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
      let that = this
      let _clipboard = JSON.parse(unescape(text.substring(7, text.length)))
      if (_clipboard instanceof Array) {
        // console.log('粘贴', 1)
        let canvaobjs = []
        this.activecanvaobjs = []
        for (var i in _clipboard) {
          this.cid = this.cid + 1
          this.$emit('idAdd', this.cid)
          // console.log('多元素复制')

          let object = _clipboard[i]
          object.copyId = JSON.parse(JSON.stringify(object.id))
          object.id = this.cid
          object.zIndex = this.cid
          object.layer = this.cid
          object.visible = true
          object.top = object.top + 10 + this.yTop
          object.left = object.left + 10 + this.xLeft
          if (object.isType === 'Barcode') {
            object.width = object.width * object.scaleX
            object.height = object.height * object.scaleY
            object.scaleX = object.scaleY = 1
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
        setTimeout(() => {
          let selectid = []
          canvaobjs.forEach(one => {
            selectid.push(one.id)
          })
          this.$emit('selectId', selectid)
        }, 10)
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
        // console.log('粘贴', 2)
        this.cid = this.cid + 1
        this.$emit('idAdd', this.cid)
        // console.log('单元素', _clipboard.isType)
        // console.log('单个元素',_clipboard)
        if (_clipboard.isType === 'TextRect-text') {
          return
        }
        let canvaobj
        _clipboard.copyId = JSON.parse(JSON.stringify(_clipboard.id))
        _clipboard.id = that.cid
        _clipboard.zIndex = that.cid
        _clipboard.layer = that.cid
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
        // if (_clipboard.isType === 'tablelist') {

        // }
        // if (_clipboard.isType === 'Text') {
        //   _clipboard.width = parseInt(_clipboard.width * _clipboard.scaleX)
        //   _clipboard.height = parseInt(_clipboard.height * _clipboard.scaleY)
        //   _clipboard.scaleX = 1
        //   _clipboard.scaleY = 1
        // }
        if (_clipboard.isType === 'Price') {
          // console.log('价格组件粘贴', _clipboard)
          // console.log(_clipboard)
          _clipboard = {
            ..._clipboard.textStyle,
            ..._clipboard,
            stroke: _clipboard.textStyle.stroke,
            strokeWidth: _clipboard.textStyle.strokeWidth
          }
        }
        if (_clipboard.isType === 'NewText') {
          _clipboard = {
            ..._clipboard.options,
            ..._clipboard,
            textdemo: _clipboard.options.textdemo,
            stroke: _clipboard.options.stroke,
            strokeWidth: _clipboard.options.strokeWidth,
            width: parseInt(_clipboard.width * _clipboard.scaleX),
            height: parseInt(_clipboard.height * _clipboard.scaleY)
          }
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
        } else {
          // console.log('单个元素复制出来', _clipboard.id, _clipboard.isType, _clipboard.width, _clipboard.height)
          canvaobj = await this.createElement(_clipboard.isType, JSON.parse(JSON.stringify(_clipboard)))
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
    // 获取组装元素id
    getObjectsByid (id) {
      let objects = this.getObjects()
      return objects.filter(one => one.component === 'component' && one.id === id)
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
    // 渲染
    renderAll () {
      this.canvas.requestRenderAll()
      this.canvas.renderAll()
    },
    // 刷新渲染页面
    renderCanvas () {
      this.canvas.requestRenderAll()
      this.canvas.renderAll()
      this.canvas.renderAll.bind(this.canvas)
      this.setTop()
    },
    // 删除当前活跃元素 (键盘Delete)
    removeActiveObject () {
      let obj = this.canvas.getActiveObject()
      if (!obj) { return false }
      let deleteIds = []
      if (obj._objects) { // 多选
        this.canvas.discardActiveObject()
        for (var i in obj._objects) {
          if (obj._objects[i].id !== undefined) {
            deleteIds.push(obj._objects[i].id)
          }
          this.canvas.remove(obj._objects[i])
        }
        if (obj.id !== undefined) {
          deleteIds.push(obj.id)
        }
        this.canvas.remove(obj) // 删除条码起作用
      } else { // 单选
        if (obj.isType === 'TextRect-text') { // 如果是组合文本上的文本不可删除
          return
        }
        if (obj.id !== undefined) {
          deleteIds.push(obj.id)
        }
        this.canvas.remove(obj)
      }

      this.canvas.renderAll()
      let newset = new Set(deleteIds)
      this.$emit('deleteidsdata', Array.from(newset))
      return deleteIds
    },
    // 取消所有活跃元素
    discardActive () {
      this.canvas.discardActiveObject()
      this.canvas.requestRenderAll()
      this.canvas.renderAll()
    },
    // 水平居中分布
    toHorizontalCenterDistribution () {
      var zoom = this.canvas.getZoom()
      var obj = this.getEditObj()
      // console.log(obj);
      if (!obj) {
        return
      }
      if (obj._objects) {
        let Textincludes = [] // 用于筛选被滑动多选选中的text
        obj._objects.sort(function (a, b) {
          return a.left - b.left
        })
        for (var o in obj._objects) {
          obj._objects[o].left = o * ((obj.getBoundingRect().width / (zoom * obj.scaleX)) / (obj._objects.length - 1)) - (obj.getBoundingRect().width / (zoom * obj.scaleX)) / 2 - o * ((obj._objects[o].width * obj._objects[o].scaleX) / (obj._objects.length - 1))
          if (obj._objects[o].isType === 'TextRect-text') {
            Textincludes.push(obj._objects[o].id)
          }
        }

        obj._objects.forEach((one, o) => {
          if (one.isType === 'TextRect' && Textincludes.indexOf(one.id) === -1) { // 部分文本编辑后不会被滑动多选选中
            if (one.isElasticSize === 2) {
              one.text.set('left', obj.left + o * ((obj.getBoundingRect().width / (zoom * obj.scaleX)) / (obj._objects.length - 1)) - (obj.getBoundingRect().width / (zoom * obj.scaleX)) / 2 - o * ((obj._objects[o].width * obj._objects[o].scaleX) / (obj._objects.length - 1)) - one.text.offsetLeft)
            } else {
              one.text.set('left', obj.left + o * ((obj.getBoundingRect().width / (zoom * obj.scaleX)) / (obj._objects.length - 1)) - (obj.getBoundingRect().width / (zoom * obj.scaleX)) / 2 - o * ((obj._objects[o].width * obj._objects[o].scaleX) / (obj._objects.length - 1)))
            }
          }
        })
        this.$emit('canvasToData', obj, 'align')
        this.canvas.renderTop()
        this.canvas.renderAll()
      }
    },
    // 垂直居中分布
    toVerticalCenterDistribution () {
      var zoom = this.canvas.getZoom()
      var obj = this.getEditObj()
      if (!obj) {
        return
      }
      if (obj._objects) {
        let Textincludes = [] // 用于筛选被滑动多选选中的text
        obj._objects.sort(function (a, b) {
          return a.top - b.top
        })
        for (var o in obj._objects) {
          obj._objects[o].top = o * ((obj.getBoundingRect().height / (zoom * obj.scaleY)) / (obj._objects.length - 1)) - (obj.getBoundingRect().height / (zoom * obj.scaleY)) / 2 - o * ((obj._objects[o].height * obj._objects[o].scaleY) / (obj._objects.length - 1))

          if (obj._objects[o].isType === 'TextRect-text') {
            Textincludes.push(obj._objects[o].id)
          }
        }

        obj._objects.forEach((one, o) => {
          if (one.isType === 'TextRect' && Textincludes.indexOf(one.id) === -1) { // 部分文本编辑后不会被滑动多选选中
            if (one.isElasticSize === 2) {
              one.text.set('top', obj.top + o * ((obj.getBoundingRect().height / (zoom * obj.scaleY)) / (obj._objects.length - 1)) - (obj.getBoundingRect().height / (zoom * obj.scaleY)) / 2 - o * ((obj._objects[o].height * obj._objects[o].scaleY) / (obj._objects.length - 1)) - one.text.offsetTop)
            } else {
              one.text.set('top', obj.top + o * ((obj.getBoundingRect().height / (zoom * obj.scaleY)) / (obj._objects.length - 1)) - (obj.getBoundingRect().height / (zoom * obj.scaleY)) / 2 - o * ((obj._objects[o].height * obj._objects[o].scaleY) / (obj._objects.length - 1)))
            }
          }
        })
        this.$emit('canvasToData', obj, 'align')
        this.canvas.renderTop()
        this.canvas.renderAll()
      }
    },
    // 左对齐
    toLeftAlign () {
      var zoom = this.canvas.getZoom()
      var obj = this.getEditObj()
      if (!obj) {
        return
      }
      if (obj._objects) {
        let Textincludes = [] // 用于筛选被滑动多选选中的text

        for (var o in obj._objects) {
          obj._objects[o].left = -(obj.getBoundingRect().width / (zoom * obj.scaleX)) / 2
          // this.getactiveobj(obj._objects[o].id).marginLeft = obj.getBoundingRect().left;

          if (obj._objects[o].isType === 'TextRect-text') {
            Textincludes.push(obj._objects[o].id)
          }
        }

        obj._objects.forEach((one) => {
          if (one.isType === 'TextRect' && Textincludes.indexOf(one.id) === -1) { // 部分文本编辑后不会被滑动多选选中
            if (one.isElasticSize === 2) {
              one.text.set('left', obj.left - (obj.getBoundingRect().width / (zoom * obj.scaleX)) / 2 - one.text.offsetLeft)
            } else {
              one.text.set('left', obj.left - (obj.getBoundingRect().width / (zoom * obj.scaleX)) / 2)
            }
          }
        })
        this.$emit('canvasToData', obj, 'align')
        this.canvas.requestRenderAll()

        this.canvas.renderTop()
        this.canvas.renderAll()
      }
    },
    // 水平居中对齐
    toHorizontalCenterAlign () {
      var obj = this.getEditObj()
      if (!obj) {
        return
      }
      if (obj._objects) {
        let Textincludes = [] // 用于筛选被滑动多选选中的text
        for (var o in obj._objects) {
          obj._objects[o].left = -(obj._objects[o].width * obj._objects[o].scaleX) / 2

          if (obj._objects[o].isType === 'TextRect-text') {
            Textincludes.push(obj._objects[o].id)
          }
        }
        obj._objects.forEach((one) => {
          if (one.isType === 'TextRect' && Textincludes.indexOf(one.id) === -1) { // 部分文本编辑后不会被滑动多选选中
            if (one.isElasticSize === 2) {
              one.text.set('left', obj.left - (obj._objects[o].width * obj._objects[o].scaleX) / 2 - one.text.offsetLeft)
            } else {
              one.text.set('left', obj.left - (obj._objects[o].width * obj._objects[o].scaleX) / 2)
            }
          }
        })
        this.$emit('canvasToData', obj, 'align')
        this.canvas.renderTop()
        this.canvas.renderAll()
      }
    },
    // 右对齐
    toRightAlign () {
      var zoom = this.canvas.getZoom()
      var obj = this.getEditObj()
      if (!obj) {
        return
      }
      let Textincludes = [] // 用于筛选被滑动多选选中的text
      if (obj._objects) {
        for (var o in obj._objects) {
          obj._objects[o].left = (obj.getBoundingRect().width / (zoom * obj.scaleX)) / 2 - (obj._objects[o].width * obj._objects[o].scaleX)

          if (obj._objects[o].isType === 'TextRect-text') {
            Textincludes.push(obj._objects[o].id)
          }
        }
        obj._objects.forEach((one) => {
          if (one.isType === 'TextRect' && Textincludes.indexOf(one.id) === -1) { // 部分文本编辑后不会被滑动多选选中
            if (one.isElasticSize === 2) {
              one.text.set('left', obj.left + (obj.getBoundingRect().width / (zoom * obj.scaleX)) / 2 - (obj._objects[o].width * obj._objects[o].scaleX) - one.text.offsetLeft)
            } else {
              one.text.set('left', obj.left + (obj.getBoundingRect().width / (zoom * obj.scaleX)) / 2 - (obj._objects[o].width * obj._objects[o].scaleX))
            }
          }
        })
        this.$emit('canvasToData', obj, 'align')
        this.canvas.renderTop()
        this.canvas.renderAll()
      }
    },
    // 顶对齐
    toTopAlign () {
      var zoom = this.canvas.getZoom()
      var obj = this.getEditObj()
      if (!obj) {
        return
      }
      if (obj._objects) {
        let Textincludes = [] // 用于筛选被滑动多选选中的text
        for (var o in obj._objects) {
          obj._objects[o].top = -(obj.getBoundingRect().height / (zoom * obj.scaleY)) / 2
          // this.getactiveobj(obj._objects[o].id).marginTop = obj.getBoundingRect().top;
          if (obj._objects[o].isType === 'TextRect-text') {
            Textincludes.push(obj._objects[o].id)
          }
        }
        obj._objects.forEach((one) => {
          if (one.isType === 'TextRect' && Textincludes.indexOf(one.id) === -1) { // 部分文本编辑后不会被滑动多选选中
            if (one.isElasticSize === 2) {
              one.text.set('top', obj.top - (obj.getBoundingRect().height / (zoom * obj.scaleY)) / 2 - one.text.offsetTop)
            } else {
              one.text.set('top', obj.top - (obj.getBoundingRect().height / (zoom * obj.scaleY)) / 2)
            }
          }
        })
        this.$emit('canvasToData', obj, 'align')
        this.canvas.renderTop()
        this.canvas.renderAll()
      }
    },
    // 垂直居中对齐
    toVerticalCenterAlign () {
      var obj = this.getEditObj()
      if (!obj) {
        return
      }
      if (obj._objects) {
        let Textincludes = [] // 用于筛选被滑动多选选中的text
        for (var o in obj._objects) {
          obj._objects[o].top = -(obj._objects[o].height * obj._objects[o].scaleY) / 2
          if (obj._objects[o].isType === 'TextRect-text') {
            Textincludes.push(obj._objects[o].id)
          }
        }
        obj._objects.forEach((one) => {
          if (one.isType === 'TextRect' && Textincludes.indexOf(one.id) === -1) { // 部分文本编辑后不会被滑动多选选中
            if (one.isElasticSize === 2) {
              one.text.set('top', obj.top - (obj._objects[o].height * obj._objects[o].scaleY) / 2 - one.text.offsetTop)
            } else {
              one.text.set('top', obj.top - (obj._objects[o].height * obj._objects[o].scaleY) / 2)
            }
          }
        })
        this.$emit('canvasToData', obj, 'align')
        this.canvas.renderTop()
        this.canvas.renderAll()
      }
    },
    // 底对齐
    toBottomAlign () {
      var zoom = this.canvas.getZoom()
      var obj = this.getEditObj()
      if (!obj) {
        return
      }
      if (obj._objects) {
        let Textincludes = [] // 用于筛选被滑动多选选中的text
        for (var o in obj._objects) {
          obj._objects[o].top = (obj.getBoundingRect().height / (zoom * obj.scaleY)) / 2 - (obj._objects[o].height * obj._objects[o].scaleY)
          if (obj._objects[o].isType === 'TextRect-text') {
            Textincludes.push(obj._objects[o].id)
          }
        }
        obj._objects.forEach((one) => {
          if (one.isType === 'TextRect' && Textincludes.indexOf(one.id) === -1) { // 部分文本编辑后不会被滑动多选选中
            if (one.isElasticSize === 2) {
              one.text.set('top', obj.top + (obj.getBoundingRect().height / (zoom * obj.scaleY)) / 2 - (obj._objects[o].height * obj._objects[o].scaleY) - one.text.offsetTop)
            } else {
              one.text.set('top', obj.top + (obj.getBoundingRect().height / (zoom * obj.scaleY)) / 2 - (obj._objects[o].height * obj._objects[o].scaleY))
            }
          }
        })
        this.$emit('canvasToData', obj, 'align')
        this.canvas.renderTop()
        this.canvas.renderAll()
      }
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
      let that = this
      if (options.id === undefined) {
        that.cid = that.cid + 1
        this.$emit('idAdd', that.cid)
      }
      // console.log('新增时ID', options.id)

      // console.log(options);
      return new Promise(async (resolve, reject) => {
        let canvas = this.canvas

        let initable = {
          tableinfo: {
            id: options.id,
            left: options.left ? -this.xLeft + options.left : -this.xLeft,
            top: options.top ? -this.yTop + options.top : -this.yTop,
            layer: options.layer ? options.layer : that.cid,
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
            fontType: '',
            fontSize: 14,
            fontColor: '#000000',
            value: 'A列',
            bgcolor: '#EEEEEE',
            position: 5,
            field: 'itemTitle',
            fieldType: 0
          }, {
            type: 0,
            col: 2,
            width: 60,
            height: 50,
            fontType: '',
            fontSize: 16,
            fontColor: '#000000',
            value: 'B列',
            bgcolor: '#EEEEEE',
            position: 5,
            field: 'itemTitle',
            fieldType: 0
          }, {
            type: 0,
            col: 3,
            width: 60,
            height: 50,
            fontType: '',
            fontSize: 16,
            fontColor: '#000000',
            value: 'C列',
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
        if (options.tabledata) {
          options.tabledata.tableinfo.left = options.tabledata.tableinfo.left ? -this.xLeft + options.tabledata.tableinfo.left : -this.xLeft
          options.tabledata.tableinfo.top = options.tabledata.tableinfo.top ? -this.yTop + options.tabledata.tableinfo.top : -this.yTop
          options.tabledata.tableinfo.id = options.tabledata.tableinfo.id ? options.tabledata.tableinfo.id : that.cid
          options.tabledata.tableinfo.layer = options.tabledata.tableinfo.layer ? options.tabledata.tableinfo.layer : that.cid
        }
        // console.log('id---------------', options.tabledata.tableinfo.id)

        options = {
          ...options,
          id: options.id ? options.id : that.cid,
          zIndex: options.zIndex ? options.zIndex : options.id * 2,
          layer: options.layer ? options.layer : options.id * 2,

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

          fillinColor: options.fillinColor ? options.fillinColor : 'rgba(0,0,0,0)',
          // strokeWidth: options.border ? options.border : 0,
          // stroke: options.borderColor ? options.borderColor : '',

          selectable: options.selectable !== false ? true : options.selectable, // 元素是否可选中
          visible: options.visible, // 元素是否可见 options.visible!==false ? true :

          eyeshow: options.eyeshow ? options.eyeshow : true, // 眼睛

          hasRotatingPoint: options.hasRotatingPoint !== false ? true : options.hasRotatingPoint,

          screenIndex: options.screenIndex ? options.screenIndex : 0,
          textdemo: options.textdemo ? options.textdemo : 'TEXT',
          textPadding: options.textPadding ? options.textPadding : 0, // 文本复合组件的内边距

          tabledata: options.tabledata ? options.tabledata : initable, // 表格新增字段
          bgcolor: options.bgcolor ? options.bgcolor : '' // 新增二维码和条码背景色

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
              fill: options.color ? options.color : '#000000',
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
          case 'Circle': // ----------------------------------------------------------------------------------------椭圆形
            newOptions = {
              ...options,
              isType: 'Circle',
              fill: options.color ? options.color : '#000000',
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
          case 'Dottedline': // ----------------------------------------------------------------------------------------线段
            newOptions = {
              ...options,
              isType: 'Dottedline',
              name: options.name ? options.name : 'Dottedline',
              DottedlineType: options.DottedlineType ? options.DottedlineType : 1,
              strokeDashArray: options.DottedlineType === 3 ? [10, 4, 3, 4] : (options.DottedlineType === 2 ? [8, 2] : [0, 0]),
              stroke: options.color ? options.color : '#000000',
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
            break
          case 'EqualCircle': // ----------------------------------------------------------------------------------------正圆
            newOptions = {
              ...options,
              isType: 'EqualCircle',
              name: options.name ? options.name : 'EqualCircle',
              radius: options.width / 2
            }
            // console.log(newOptions)
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.Circle({...newOptions}) // 创建
            break
          case 'EqualTriangle': // ----------------------------------------------------------------------------------------等边三角
            newOptions = {
              ...options,
              width: 60,
              height: 52,
              isType: 'EqualTriangle',
              name: options.name ? options.name : 'EqualTriangle'
            }
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.Triangle({...newOptions}) // 创建
            break
          case 'star':// -----------------------------------------------------------------五角星

            options = {
              ...options,
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
              ...options,
              component: 'component',
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
              ...options,
              originX: 'left',
              originY: 'top',
              left: options.left,
              top: options.top,
              component: 'component',
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
            // canvasObject = await that.createURLImage(options)
            canvasObject = await that.createImage(options)
            break
          case 'Icon': // ----------------------------------------------------------------------------------------图片
            canvasObject = await that.createIcon(options)
            break
          case 'duanImage':
            canvasObject = await that.createDuan(options)
            break
          case 'equalImage':
            // console.warn('equalImage',options);
            canvasObject = await that.createEqualImageImage(options)
            // return canvasObject
            break
          case 'Barcode': // ----------------------------------------------------------------------------------------条码
            // console.log('Barcode', options)
            canvasObject = await that.createBarcode(options)
            break
            // resolve(canvasObject)
            // return canvasObject
          case 'Qrcode': // ----------------------------------------------------------------------------------------二维码
            options.imgText = options.imgText ? options.imgText : '123456789'
            if (options.barcodeType === 0) {

            }
            canvasObject = await that.createQrcode(options)
            break
            // resolve(canvasObject)
            // return canvasObject
          case 'Text': // -----------------------------------------------------------------------------------------不可编辑文本
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
          case 'Itext': // -----------------------------------------------------------------------------------------可单行编辑文本
            newOptions = {
              ...options,
              isType: 'Itext',
              name: options.name ? options.name : 'Itext'
            }
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.IText(options.textdemo, {...newOptions})

            break
          case 'Textbox':// -----------------------------------------------------------------------------------------可多行编辑文本
            newOptions = {
              ...options,
              isType: 'Textbox',
              name: options.name ? options.name : 'Textbox',
              breakWords: true,
              splitByGrapheme: true

            }
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.Textbox(options.textdemo, {...newOptions})

            break

          case 'textboxnew':
            newOptions = {
              ...options,
              isType: 'Textbox',
              name: options.name ? options.name : 'Textbox',
              breakWords: true,
              splitByGrapheme: true

            }
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.TextboxNew(options.textdemo, {...newOptions})

            break

          case 'TextRectBox': // ---------------------------文本组合研究

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
              // console.log('mousedblclick', e)
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
          case 'TextRectOld': // -------------------------------------------------可编辑文本加： 边距 背景 边框
            // console.warn('文本矩形参数：',options.zIndex);

            const rectOptions = {
              id: options.id,
              zIndex: options.zIndex ? options.zIndex : options.id,
              layer: options.layer ? options.layer : options.id,

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

              fontColor: options.fontColor ? options.fontColor : '#f00',
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
              lineHeight: (options.fontSize + options.verticalSpace) / options.fontSize,

              visible: options.visible,
              eyeshow: options.eyeshow,

              screenIndex: options.screenIndex
            }
            const textOptions = {
              id: options.id,
              zIndex: options.zIndex + 0.5 ? options.zIndex + 0.5 : options.id + 0.5,
              layer: options.layer ? options.layer : options.id,
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

              fill: options.fontColor ? options.fontColor : '#000',
              fontSize: options.fontSize ? options.fontSize : 14,

              fontColor: options.fontColor ? options.fontColor : '#000',
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
              lineHeight: (options.fontSize + options.verticalSpace) / options.fontSize,

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

            // console.log('999999999999999999999999', canvasObject)
            break

          case 'TextRect': // -------------------------------------------------可编辑文本优化 文本的特殊属性： 边距 背景 边框

            options.fill = 'rgba(0, 0, 0, 0)' // 矩形背景透明

            options = {
              ...options,
              isType: 'TextRect',
              component: 'component',
              fontWeight: options.fontWeight ? options.fontWeight : 'normal',
              linethrough: options.linethrough ? options.linethrough : false,
              underline: options.underline ? options.underline : false,
              fontStyle: options.fontStyle ? options.fontStyle : 'normal',
              textAlign: options.textAlign ? options.textAlign : 'left',

              maxLines: options.maxLines ? options.maxLines : 10,
              minFontSize: options.minFontSize ? options.minFontSize : 12,
              omitStyle: options.omitStyle ? options.omitStyle : 0,
              omitStyleText: options.omitStyleText ? options.omitStyleText : '无',
              newline: options.newline ? options.newline : '',

              verticalSpace: options.verticalSpace ? options.verticalSpace : 0,
              lineHeight: (options.fontSize + options.verticalSpace) / options.fontSize,

              fillinColor: options.fillinColor ? options.fillinColor : '',
              stroke: options.stroke ? options.stroke : '', // 边框颜色
              strokeWidth: options.strokeWidth ? options.strokeWidth : 0, // 边框宽度
              borderType: options.borderType ? options.borderType : 1,
              strokeDashArray: options.strokeDashArray ? options.strokeDashArray : [0, 0] // 边框样式 虚线 [5,1]     直线[0,0]  线段也是这个参数

            }

            // eslint-disable-next-line no-undef
            canvasObject = new fabric.textRectNew(options)
            // canvasObject.setCoords()

            break
          case 'NewText': // -------------------------------------------------可编辑文本优化 文本的特殊属性： 边距 背景 边框
            canvasObject = await this.createNewText(options)
            break
          case 'table':
            options = {
              tableinfo: {
                id: options.id,
                left: options.left,
                top: options.top,
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
                fontType: '',
                fontSize: 14,
                fontColor: '#000000',
                value: 'A列',
                bgcolor: '#EEEEEE',
                position: 5,
                field: 'itemTitle',
                fieldType: 0
              }, {
                type: 0,
                col: 2,
                width: 60,
                height: 50,
                fontType: '',
                fontSize: 16,
                fontColor: '#000000',
                value: 'B列',
                bgcolor: '#EEEEEE',
                position: 5,
                field: 'itemTitle',
                fieldType: 0
              }, {
                type: 0,
                col: 3,
                width: 60,
                height: 50,
                fontType: '',
                fontSize: 16,
                fontColor: '#000000',
                value: 'C列',
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
            canvasObject = await that.createTable(options)
            setTimeout(() => {
              that.setActiveObject(canvasObject.table.group)
              canvasObject.table.group.setCoords()
              this.setTop() // 遮罩置顶
              this.canvas.renderAll()
            }, 100)
            resolve(canvasObject)
            return
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
            let table = options.tabledata
            // console.log('tableList', table)
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.tableList(canvas, table)
            // console.log(canvasObject)

            setTimeout(() => {
              that.setActiveObject(canvasObject.table.group)
              canvasObject.table.group.setCoords()
              this.setTop() // 遮罩置顶
              this.canvas.renderAll()
            }, 100)
            resolve(canvasObject)
            return

          case 'Price':
            options = {
              ...options
            }
            canvasObject = await this.createPrice(options)
            break
          case 'NewPrice':
            options = {
              ...options
            }
            canvasObject = await this.createNewPrice(options)
            break
          default:

            // ----------------------------------------------------------------------------------------其他
            console.log('default')
        }

        console.warn('name:' + name, canvasObject)

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
    },
    // 创建非跨域图片最大缩放图片
    createEqualImageImage (options) {
      // console.log('00000000000000000000');

      // let that = this
      let canvas = this.canvas

      return new Promise(function (resolve, reject) {
        options.url = options.url ? options.url : './static/images/img.svg'
        var img = document.createElement('img')

        img.crossOrigin = 'Anonymous'
        img.src = options.url

        img.onload = function () {
          let imgwidth = 0
          let imgheight = 0

          if (img.width / img.height > options.width / options.height) {
            imgwidth = options.width
            imgheight = options.width / (img.width / img.height)
          } else {
            imgheight = options.height
            imgwidth = options.height * (img.width / img.height)
          }

          // eslint-disable-next-line no-undef
          var canvasImage = new fabric.Image(img, {
            id: options.id ? options.id : 'image',
            isType: 'equalImage-img',
            padding: 0,
            flipX: false,
            flipY: false,
            stopContextMenu: true, //  禁掉鼠标右键默认事件
            minScaleLimit: 0.0001, //  最小限制
            lockSkewingX: true, //  禁掉按住shift时的变形
            lockSkewingY: true,

            originX: 'center',
            originY: 'center',

            scaleX: imgwidth / img.width,
            scaleY: imgheight / img.height,

            angle: options.angle ? options.angle : 0,
            name: options.name ? options.name : 'Image',

            stroke: options.stroke ? options.stroke : '', // 边框颜色
            strokeWidth: options.strokeWidth ? options.strokeWidth : 0, // 边框宽度
            strokeDashArray: options.strokeDashArray ? options.strokeDashArray : [0, 0], // 边框样式 虚线 [5,1]     直线[0,0]  线段也是这个参数

            selectable: options.selectable !== false ? true : options.selectable, // 元素是否可选中  如段码屏中可见不可移动false
            visible: options.visible !== false ? true : options.visible, // 元素是否可见

            eyeshow: options.eyeshow,
            screenIndex: options.screenIndex
          })
          // eslint-disable-next-line no-undef
          var rect = new fabric.Rect({
            isType: 'equalImage-bg',
            id: options.id ? options.id : 'image-bg',
            padding: 0,
            originX: 'center',
            originY: 'center',
            width: options.width ? options.width : 100,
            height: options.height ? options.height : 100,
            fill: options.background ? options.background : '#eeeeee'

          })

          // eslint-disable-next-line no-undef
          var group = new fabric.Group([rect, canvasImage], {
            isType: 'equalImage',
            component: 'component',
            left: options.left,
            top: options.top,
            width: options.width,
            height: options.height,
            originX: 'left',
            originY: 'top',
            padding: 0,
            id: options.id,
            url: options.url,
            src: options.url,

            hasRotatingPoint: true,
            lockScalingFlip: true,
            minScaleLimit: 0.2,

            eyeshow: options.eyeshow,
            screenIndex: options.screenIndex
          })

          group.on('scaling', function (e) {
            let newimgwidth = 0
            let newimgheight = 0

            if (img.width / img.height > (group.width * group.scaleX) / (group.height * group.scaleY)) {
              newimgwidth = (group.width * group.scaleX)
              newimgheight = (group.width * group.scaleX) / (img.width / img.height)
              group.item(1).set('scaleX', newimgwidth / img.width / group.scaleX)
              group.item(1).set('scaleY', newimgheight / img.height / group.scaleY)
            } else {
              newimgheight = (group.height * group.scaleY)
              newimgwidth = (group.height * group.scaleY) * (img.width / img.height)
              group.item(1).set('scaleX', newimgwidth / img.width / group.scaleX)
              group.item(1).set('scaleY', newimgheight / img.height / group.scaleY)
            }
            canvas.requestRenderAll()
            canvas.renderAll()
          })

          group.setControlsVisibility({
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
          // canvas.add(group) // 把图片添加到画布上

          // if (options && options.registeObjectEvent) {
          //   Utils.registeObjectEvent(that, img)
          // }
          // group.setCoords()
          // that.setActiveObject(group)
          // canvas.renderAll.bind(canvas)

          resolve(group)
        }
      })
    },
    // 传入元素(类型Image, equalImage)改变图片
    async setSrc (cur, src) {
      if (cur.isType !== 'Image' && cur.isType !== 'equalImage') { return }
      let oldwidth = JSON.parse(JSON.stringify(cur.width * cur.scaleX))
      let oldheight = JSON.parse(JSON.stringify(cur.height * cur.scaleY))
      let imgwidth, imgheight
      let ImgDom = cur
      if (cur.isType === 'equalImage' || cur.isType === 'Image') { ImgDom = cur.item(1) }
      let img = await this.loadImage(src)
      cur.set('url', src)
      // console.log(img, img.width, img.height)
      let newcur = ImgDom.setElement(img)
      if (cur.isType === 'Image' && cur.imgText === 'equal') {
        // console.log('适应')
        if (img.width / img.height > (cur.width * cur.scaleX) / (cur.height * cur.scaleY)) {
          imgwidth = (cur.width * cur.scaleX)
          imgheight = (cur.width * cur.scaleX) / (img.width / img.height)
          newcur.set({
            scaleX: imgwidth / img.width / cur.scaleX,
            scaleY: imgheight / img.height / cur.scaleY
          })
        } else {
          imgheight = (cur.height * cur.scaleY)
          imgwidth = (cur.height * cur.scaleY) * (img.width / img.height)
          newcur.set({
            scaleX: imgwidth / img.width / cur.scaleX,
            scaleY: imgheight / img.height / cur.scaleY
          })
        }
      } else if (cur.isType === 'Image' && cur.imgText === '') {
        // console.log('拉伸', oldwidth, img.width)
        newcur.set({
          scaleX: oldwidth / img.width / cur.scaleX,
          scaleY: oldheight / img.height / cur.scaleY
        })
      } else {
        newcur.set({
          scaleX: oldwidth / img.width,
          scaleY: oldheight / img.height
        })
      }

      newcur.setCoords()
      this.canvas.renderAll()
      this.canvas.requestRenderAll()
    },
    // 生成图片，配置自适应和拉伸
    async createImage (options) {
      let canvas = this.canvas
      let _this = this

      options.src = options.url ? options.url : './static/images/img.svg'
      // var img = new Image()
      // img.crossOrigin = 'anonymous'
      // img.src = options.src
      // img.setAttribute('crossOrigin', 'Anonymous')

      return new Promise(async function (resolve, reject) {
        // var img = document.createElement('img')
        // eslint-disable-next-line no-unused-vars
        var imgdom
        try {
          imgdom = await _this.loadImage(options.src)
          // console.log('img1', imgdom)
        } catch (e) {
          options.url = '../../static/images/badimg.svg'
          options.src = '../../static/images/badimg.svg'
          imgdom = await _this.loadImage(options.src)
          // console.log('img2', imgdom)
        }
        // console.log(options.imgText, options.src)
        var img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = options.src
        img.setAttribute('crossOrigin', 'Anonymous')

        // console.log('img3', imgdom.complete, imgdom)
        img.onload = function () {
          // console.log('img3-1', img.complete, img)
          let imgwidth = 0
          let imgheight = 0

          if (options.imgText === 'equal') {
            if (img.width / img.height > options.width / options.height) {
              imgwidth = options.width
              imgheight = options.width / (img.width / img.height)
            } else {
              imgheight = options.height
              imgwidth = options.height * (img.width / img.height)
            }
          } else {
            imgwidth = options.width
            imgheight = options.height
          }

          // eslint-disable-next-line no-undef
          var canvasImage = new fabric.Image(img, {
            id: options.id ? options.id : 'image',
            isType: 'Image-img',
            padding: 0,
            flipX: false,
            flipY: false,
            stopContextMenu: true, //  禁掉鼠标右键默认事件
            minScaleLimit: 0.0001, //  最小限制
            lockSkewingX: true, //  禁掉按住shift时的变形
            lockSkewingY: true,

            originX: 'center',
            originY: 'center',

            scaleX: imgwidth / img.width,
            scaleY: imgheight / img.height,

            name: options.name ? options.name : 'Image',

            selectable: options.selectable !== false ? true : options.selectable, // 元素是否可选中  如段码屏中可见不可移动false
            visible: options.visible !== false ? true : options.visible, // 元素是否可见

            eyeshow: options.eyeshow,
            screenIndex: options.screenIndex
          })
          // eslint-disable-next-line no-undef
          var rect = new fabric.Rect({
            isType: 'Image-bg',
            id: options.id ? options.id : 'image-bg',
            padding: 0,
            originX: 'center',
            originY: 'center',
            width: options.width ? options.width : 100,
            height: options.height ? options.height : 100,
            fill: options.background ? options.background : ''

          })

          // eslint-disable-next-line no-undef
          var group = new fabric.Group([rect, canvasImage], {
            isType: 'Image',
            component: 'component',
            left: options.left,
            top: options.top,
            width: options.width,
            height: options.height,
            originX: 'left',
            originY: 'top',
            padding: 0,
            id: options.id,
            layer: options.layer,
            url: options.url,
            src: options.url,
            imgText: options.imgText, // equal：代表自适应的图片
            angle: options.angle || 0,

            stroke: options.stroke ? options.stroke : '', // 边框颜色
            strokeWidth: options.strokeWidth ? options.strokeWidth : 0, // 边框宽度
            strokeDashArray: options.strokeDashArray ? options.strokeDashArray : [0, 0], // 边框样式 虚线 [5,1]     直线[0,0]  线段也是这个参数

            hasRotatingPoint: true,
            lockScalingFlip: true,
            minScaleLimit: 0.01,

            eyeshow: options.eyeshow,
            screenIndex: options.screenIndex
          })

          group.on('scaling', async function (e) {
            let src = group.url
            let img = await _this.loadImage(src)
            let newimgwidth = 0
            let newimgheight = 0

            if (group.imgText === 'equal') {
              if (img.width / img.height > (group.width * group.scaleX) / (group.height * group.scaleY)) {
                newimgwidth = (group.width * group.scaleX)
                newimgheight = (group.width * group.scaleX) / (img.width / img.height)
                group.item(1).set('scaleX', newimgwidth / img.width / group.scaleX)
                group.item(1).set('scaleY', newimgheight / img.height / group.scaleY)
              } else {
                newimgheight = (group.height * group.scaleY)
                newimgwidth = (group.height * group.scaleY) * (img.width / img.height)
                group.item(1).set('scaleX', newimgwidth / img.width / group.scaleX)
                group.item(1).set('scaleY', newimgheight / img.height / group.scaleY)
              }
            }

            canvas.requestRenderAll()
            canvas.renderAll()
          })

          group.setControlsVisibility({
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
          // canvas.add(group) // 把图片添加到画布上

          // if (options && options.registeObjectEvent) {
          //   Utils.registeObjectEvent(that, img)
          // }
          // group.setCoords()
          // that.setActiveObject(group)
          // canvas.renderAll.bind(canvas)

          resolve(group)
        }
        img.onerror = function (e) {
          // console.log('img3-2', img.complete, img)
          img.src = './static/images/img.svg'
          img.setAttribute('crossOrigin', 'Anonymous')

          let imgwidth = 0
          let imgheight = 0

          if (options.imgText === 'equal') {
            if (img.width / img.height > options.width / options.height) {
              imgwidth = options.width
              imgheight = options.width / (img.width / img.height)
            } else {
              imgheight = options.height
              imgwidth = options.height * (img.width / img.height)
            }
          } else {
            imgwidth = options.width
            imgheight = options.height
          }

          // eslint-disable-next-line no-undef
          var canvasImage = new fabric.Image(img, {
            id: options.id ? options.id : 'image',
            isType: 'Image-img',
            padding: 0,
            flipX: false,
            flipY: false,
            stopContextMenu: true, //  禁掉鼠标右键默认事件
            minScaleLimit: 0.0001, //  最小限制
            lockSkewingX: true, //  禁掉按住shift时的变形
            lockSkewingY: true,

            originX: 'center',
            originY: 'center',

            scaleX: imgwidth / img.width,
            scaleY: imgheight / img.height,

            name: options.name ? options.name : 'Image',

            selectable: options.selectable !== false ? true : options.selectable, // 元素是否可选中  如段码屏中可见不可移动false
            visible: options.visible !== false ? true : options.visible, // 元素是否可见

            eyeshow: options.eyeshow,
            screenIndex: options.screenIndex
          })
          // eslint-disable-next-line no-undef
          var rect = new fabric.Rect({
            isType: 'Image-bg',
            id: options.id ? options.id : 'image-bg',
            padding: 0,
            originX: 'center',
            originY: 'center',
            width: options.width ? options.width : 100,
            height: options.height ? options.height : 100,
            fill: options.background ? options.background : ''

          })

          // eslint-disable-next-line no-undef
          var group = new fabric.Group([rect, canvasImage], {
            isType: 'Image',
            component: 'component',
            left: options.left,
            top: options.top,
            width: options.width,
            height: options.height,
            originX: 'left',
            originY: 'top',
            padding: 0,
            id: options.id,
            layer: options.layer,
            url: options.url,
            src: options.url,
            imgText: options.imgText, // equal：代表自适应的图片
            angle: options.angle || 0,

            stroke: options.stroke ? options.stroke : '', // 边框颜色
            strokeWidth: options.strokeWidth ? options.strokeWidth : 0, // 边框宽度
            strokeDashArray: options.strokeDashArray ? options.strokeDashArray : [0, 0], // 边框样式 虚线 [5,1]     直线[0,0]  线段也是这个参数

            hasRotatingPoint: true,
            lockScalingFlip: true,
            minScaleLimit: 0.01,

            eyeshow: options.eyeshow,
            screenIndex: options.screenIndex
          })

          group.on('scaling', async function (e) {
            let src = group.url
            let img = await _this.loadImage(src)
            let newimgwidth = 0
            let newimgheight = 0

            if (group.imgText === 'equal') {
              if (img.width / img.height > (group.width * group.scaleX) / (group.height * group.scaleY)) {
                newimgwidth = (group.width * group.scaleX)
                newimgheight = (group.width * group.scaleX) / (img.width / img.height)
                group.item(1).set('scaleX', newimgwidth / img.width / group.scaleX)
                group.item(1).set('scaleY', newimgheight / img.height / group.scaleY)
              } else {
                newimgheight = (group.height * group.scaleY)
                newimgwidth = (group.height * group.scaleY) * (img.width / img.height)
                group.item(1).set('scaleX', newimgwidth / img.width / group.scaleX)
                group.item(1).set('scaleY', newimgheight / img.height / group.scaleY)
              }
            }

            canvas.requestRenderAll()
            canvas.renderAll()
          })

          group.setControlsVisibility({
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
          // canvas.add(group) // 把图片添加到画布上

          // if (options && options.registeObjectEvent) {
          //   Utils.registeObjectEvent(that, img)
          // }
          // group.setCoords()
          // that.setActiveObject(group)
          // canvas.renderAll.bind(canvas)

          resolve(group)
        }
      })
    },
    // 创建图片可跨域生成预览
    createURLImage (options) {
      return new Promise(function (resolve, reject) {
        options.src = options.src ? options.src : './static/images/img.svg'

        var img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = options.src
        img.setAttribute('crossOrigin', 'Anonymous')

        img.onload = function () {
          console.log('onload')
          // eslint-disable-next-line no-undef
          var canvasImage = new fabric.Image(img, {
            id: options.id ? options.id : 'image',
            layer: options.layer ? options.layer : options.id,
            copyId: options.copyId,
            type: options.type ? options.type : 0,
            isType: 'Image',
            component: 'component',
            isDiff: 'static',
            padding: 0,
            flipX: false,
            flipY: false,
            originX: 'left',
            originY: 'top',
            stopContextMenu: true, //  禁掉鼠标右键默认事件
            minScaleLimit: 0.0001, //  最小限制
            lockSkewingX: true, //  禁掉按住shift时的变形
            lockSkewingY: true,

            left: options.left,
            top: options.top,
            angle: options.angle ? options.angle : 0,
            name: options.name ? options.name : 'Image',

            scaleX: options.width / img.width,
            scaleY: options.height / img.height,
            width: img.width,
            height: img.height,
            stroke: options.stroke ? options.stroke : '', // 边框颜色
            strokeWidth: options.strokeWidth ? options.strokeWidth : 0, // 边框宽度
            strokeDashArray: options.strokeDashArray ? options.strokeDashArray : [0, 0], // 边框样式 虚线 [5,1]     直线[0,0]  线段也是这个参数

            selectable: options.selectable !== false ? true : options.selectable, // 元素是否可选中  如段码屏中可见不可移动false
            visible: options.visible, // 元素是否可见
            hasRotatingPoint: options.hasRotatingPoint !== false ? true : options.hasRotatingPoint, // 元素是否旋转

            eyeshow: options.eyeshow,
            screenIndex: options.screenIndex,
            opacity: options.opacity
          })
          resolve(canvasImage)
        }
        img.onerror = function (err) {
          console.log('onerror')
          console.warn(err)
          options.src = './static/images/badimg.svg'
          // eslint-disable-next-line no-undef
          fabric.Image.fromURL(options.src, function (img) {
            img.crossOrigin = 'Anonymous'
            options.crossOrigin = 'Anonymous'
            img.set({ // 图片不设置宽度高度，来定义图片放大缩小
              id: options.id ? options.id : 'image',
              layer: options.layer ? options.layer : options.id,
              type: options.type ? options.type : 0,
              isType: 'Image',
              component: 'component',
              isDiff: 'static',
              padding: 0,
              flipX: false,
              flipY: false,
              originX: 'left',
              originY: 'top',
              stopContextMenu: true, //  禁掉鼠标右键默认事件
              minScaleLimit: 0.0001, //  最小限制
              lockSkewingX: true, //  禁掉按住shift时的变形
              lockSkewingY: true,

              left: options.left,
              top: options.top,
              angle: options.angle ? options.angle : 0,
              name: options.name ? options.name : 'Image',
              scaleX: options.scaleX,
              scaleY: options.scaleY,
              width: options.width,
              height: options.height,
              stroke: options.stroke ? options.stroke : '', // 边框颜色
              strokeWidth: options.strokeWidth ? options.strokeWidth : 0, // 边框宽度
              strokeDashArray: options.strokeDashArray ? options.strokeDashArray : [0, 0], // 边框样式 虚线 [5,1]     直线[0,0]  线段也是这个参数

              selectable: options.selectable !== false ? true : options.selectable, // 元素是否可选中  如段码屏中可见不可移动false
              visible: options.visible, // 元素是否可见

              hasRotatingPoint: options.hasRotatingPoint !== false ? true : options.hasRotatingPoint, // 元素是否旋转

              eyeshow: options.eyeshow,
              screenIndex: options.screenIndex,
              opacity: options.opacity
            })
            resolve(img)
          })
        }
      })
    },
    // 创建图片只可本地图片生成预览，远程图片跨域报错
    createIcon (options) {
      return new Promise(function (resolve, reject) {
        options.src = options.src ? options.src : './static/images/img.svg'

        var img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = options.src

        img.onload = function () {
          // fabric.Image.fromURL(options.src, function (img) {
          // eslint-disable-next-line no-undef
          var canvasImage = new fabric.Image(img, { // 图片不设置宽度高度，来定义图片放大缩小
            id: options.id ? options.id : 'image',
            copyId: options.copyId,
            layer: options.layer ? options.layer : options.id,
            zIndex: options.zIndex ? options.zIndex : options.id,
            type: options.type ? options.type : 0,
            isType: 'Icon',
            component: 'component',
            isDiff: 'static',
            padding: 0,
            flipX: false,
            flipY: false,
            originX: 'left',
            originY: 'top',
            stopContextMenu: true, //  禁掉鼠标右键默认事件
            minScaleLimit: 0.0001, //  最小限制
            lockSkewingX: true, //  禁掉按住shift时的变形
            lockSkewingY: true,

            left: options.left,
            top: options.top,
            angle: options.angle ? options.angle : 0,
            name: options.name ? options.name : 'Image',

            scaleX: options.width / img.width,
            scaleY: options.height / img.height,
            width: img.width,
            height: img.height,
            stroke: options.stroke ? options.stroke : '', // 边框颜色
            strokeWidth: options.strokeWidth ? options.strokeWidth : 0, // 边框宽度
            strokeDashArray: options.strokeDashArray ? options.strokeDashArray : [0, 0], // 边框样式 虚线 [5,1]     直线[0,0]  线段也是这个参数

            selectable: options.selectable !== false ? true : options.selectable, // 元素是否可选中  如段码屏中可见不可移动false
            visible: options.visible !== false ? true : options.visible, // 元素是否可见
            hasRotatingPoint: options.hasRotatingPoint !== false ? true : options.hasRotatingPoint, // 元素是否旋转

            eyeshow: options.eyeshow,
            screenIndex: options.screenIndex
          })

          resolve(canvasImage)
        }
        img.onerror = function () {
          options.src = './static/images/img.svg'
          // eslint-disable-next-line no-undef
          fabric.Image.fromURL(options.src, function (img) {
            img.crossOrigin = 'Anonymous'
            options.crossOrigin = 'Anonymous'
            img.set({ // 图片不设置宽度高度，来定义图片放大缩小
              id: options.id ? options.id : 'image',
              copyId: options.copyId,
              layer: options.layer ? options.layer : options.id,
              zIndex: options.zIndex ? options.zIndex : options.id,
              type: options.type ? options.type : 0,
              isType: 'Icon',
              component: 'component',
              isDiff: 'static',
              padding: 0,
              flipX: false,
              flipY: false,
              originX: 'left',
              originY: 'top',
              stopContextMenu: true, //  禁掉鼠标右键默认事件
              minScaleLimit: 0.0001, //  最小限制
              lockSkewingX: true, //  禁掉按住shift时的变形
              lockSkewingY: true,

              left: options.left,
              top: options.top,
              angle: options.angle ? options.angle : 0,
              name: options.name ? options.name : 'Image',
              scaleX: options.scaleX,
              scaleY: options.scaleY,
              width: options.width,
              height: options.height,
              stroke: options.stroke ? options.stroke : '', // 边框颜色
              strokeWidth: options.strokeWidth ? options.strokeWidth : 0, // 边框宽度
              strokeDashArray: options.strokeDashArray ? options.strokeDashArray : [0, 0], // 边框样式 虚线 [5,1]     直线[0,0]  线段也是这个参数

              selectable: options.selectable !== false ? true : options.selectable, // 元素是否可选中  如段码屏中可见不可移动false
              visible: options.visible !== false ? true : options.visible, // 元素是否可见

              hasRotatingPoint: options.hasRotatingPoint !== false ? true : options.hasRotatingPoint, // 元素是否旋转

              eyeshow: options.eyeshow,
              screenIndex: options.screenIndex
            })
            resolve(img)
          })
        }
      })
    },
    // 创建段码屏图片
    createDuan (options) {
      let that = this
      let canvas = this.canvas
      return new Promise(function (resolve, reject) {
        options.src = options.src ? options.src : './static/images/img.svg'
        var downImg = new Image()
        downImg.crossOrigin = 'anonymous'
        downImg.src = options.src

        downImg.onload = function () {
          // eslint-disable-next-line no-undef
          fabric.Image.fromURL(options.src, function (img) {
            img.crossOrigin = 'Anonymous'
            options.crossOrigin = 'Anonymous'

            img.set({ // 图片不设置宽度高度，来定义图片放大缩小
              id: options.id ? options.id : 'image',
              copyId: options.copyId,
              zIndex: options.zIndex ? options.zIndex : options.id,
              isType: 'duan',
              component: 'component',
              isDiff: 'static',
              padding: 0,
              flipX: false,
              flipY: false,
              originX: 'left',
              originY: 'top',
              stopContextMenu: true, //  禁掉鼠标右键默认事件
              minScaleLimit: 0.0001, //  最小限制
              lockSkewingX: true, //  禁掉按住shift时的变形
              lockSkewingY: true,
              lockMovementX: true,
              lockMovementY: true,

              left: options.left,
              top: options.top,
              angle: options.angle ? options.angle : 0,
              name: options.name ? options.name : 'duanImage',

              scaleX: options.width / img.width,
              scaleY: options.height / img.height,
              width: img.width,
              height: img.height,

              selectable: false, // 元素是否可选中  如段码屏中可见不可移动false
              visible: options.visible, // 元素是否可见
              hasRotatingPoint: false, // 元素是否旋转
              hasControls: false

            })

            canvas.add(img) // 把图片添加到画布上
            img.setCoords()
            that.setActiveObject(img)
            canvas.renderAll.bind(canvas)
            that.setTop() // 遮罩置顶

            resolve(img)
          })
        }
        downImg.onerror = function () {
          options.src = './static/images/img.svg'
          // eslint-disable-next-line no-undef
          fabric.Image.fromURL(options.src, function (img) {
            img.set({ // 图片不设置宽度高度，来定义图片放大缩小
              id: options.id ? options.id : 'image',
              copyId: options.copyId,
              zIndex: options.zIndex ? options.zIndex : options.id,
              type: options.type ? options.type : 0,
              isType: 'duan',
              component: 'component',
              isDiff: 'static',
              padding: 0,
              flipX: false,
              flipY: false,
              originX: 'left',
              originY: 'top',
              stopContextMenu: true, //  禁掉鼠标右键默认事件
              minScaleLimit: 0.0001, //  最小限制
              lockSkewingX: true, //  禁掉按住shift时的变形
              lockSkewingY: true,
              lockMovementX: true,
              lockMovementY: true,

              left: options.left,
              top: options.top,
              angle: options.angle ? options.angle : 0,
              name: options.name ? options.name : 'duanImage',

              scaleX: options.scaleX,
              scaleY: options.scaleY,
              width: options.width,
              height: options.height,
              stroke: options.stroke ? options.stroke : '', // 边框颜色
              strokeWidth: options.strokeWidth ? options.strokeWidth : 0, // 边框宽度
              strokeDashArray: options.strokeDashArray ? options.strokeDashArray : [0, 0], // 边框样式 虚线 [5,1]     直线[0,0]  线段也是这个参数

              selectable: false, // 元素是否可选中  如段码屏中可见不可移动false
              visible: options.visible !== false ? true : options.visible, // 元素是否可见
              hasControls: false,
              hasRotatingPoint: options.hasRotatingPoint !== false ? true : options.hasRotatingPoint // 元素是否旋转
            })
            canvas.add(img) // 把图片添加到画布上
            that.activecanvaobjs.push(img) // 设置活跃元素
            that.activeobj = img
            if (options && options.registeObjectEvent) {
              Utils.registeObjectEvent(that, img)
            }
            img.setCoords()
            that.setActiveObject(img)
            canvas.renderAll.bind(canvas)
            that.setTop() // 遮罩置顶

            resolve(img)
          })
        }
      })
    },
    // 改变段码屏图片
    changeURL (id, iconUrl) {
      let objects = this.getObjectsNew()
      let that = this
      objects.forEach((one) => {
        if (one.id === id && one.isType === 'duan') {
          let img = new Image()
          img.src = iconUrl
          img.onload = () => {
            one._element.src = iconUrl
            that.setTop()
          }
        }
      })
    },
    // 获取创建条码的结果
    async createBarcode (options) {
      let that = this
      let canvas = this.canvas
      return new Promise(function (resolve, reject) {
        let canvasObject
        options.imgText = options.imgText ? options.imgText : 'barcode123456789'
        options.barlineWidth = options.barlineWidth || 1

        let barbox = document.getElementById('barbox')
        let bardom = document.createElement('img')
        let barid = 'barcode' + options.id
        bardom.id = 'barcode' + options.id

        let allnode = barbox.childNodes
        allnode.forEach((node) => {
          if (node.getAttribute('id') === barid) {
            document.getElementById('barcode' + options.id).remove()
          }
        })
        barbox.appendChild(bardom) // 为了解决多个条码，他们用图需要不一样
        /*
                条码支持的有:

                CODE128
                CODE128 (自动模式切换)
                CODE128 A/B/C (强制模式)
                EAN
                EAN13
                EAN8
                EAN-5
                EAN-2
                UPC (A)
                CODE39
                ITF-14
                MSI
                MSI10
                MSI11
                MSI1010
                MSI1110
                Pharmacode
                Codabar

                https://www.cnblogs.com/huangenai/p/6347607.html

                */
        try {
          // eslint-disable-next-line no-undef
          let newbarcode = JsBarcode('#barcode' + options.id, options.imgText, {
            id: options.id,
            format: options.barcodeType ? options.barcodeType : 'CODE128', // 条形码的格式
            lineColor: options.color ? options.color : '#000000', // 线条颜色
            margin: options.margin ? options.margin : 0, // 条码四边空白（默认为10px）
            width: options.barlineWidth, // 线宽
            height: options.height ? options.height : 20, // 条码高度
            background: options.bgcolor ? options.bgcolor : 'rgba(255,255,255,0.3)', // 背景颜色 #f1edea
            displayValue: false // 是否显示文字信息
          })
          console.warn(newbarcode)
        } catch (e) {
          console.warn(e)
          // eslint-disable-next-line no-undef
          JsBarcode('#barcode' + options.id, 'nodata', {
            format: 'CODE128', // 条形码的格式
            lineColor: options.lineColor || '#000000', // 线条颜色
            margin: options.margin || 0, // 条码四边空白（默认为10px）
            width: options.lineWidth || 2, // 线宽
            height: options.height || 20, // 条码高度
            background: options.bgcolor || 'rgba(255,255,255,0.3)', // 背景颜色 #f1edea
            displayValue: false // 是否显示文字信息
          })
        }

        options.originXY = options.originXY ? options.originXY : ['left', 'top']
        document.getElementById(barid).onload = () => {
          // eslint-disable-next-line no-undef
          const barcodeIMG = new fabric.Image(document.getElementById(barid), {

            id: options.id,
            copyId: options.copyId,
            layer: options.layer ? options.layer : options.id,
            zIndex: options.zIndex,
            width: document.getElementById(barid).width, // document.getElementById('barcode').width, >options.width?document.getElementById('barcode').width:options.width
            color: options.color ? options.color : '#000000',
            height: options.height,
            name: options.name ? options.name : 'barcodeimg',
            component: 'component',
            isType: 'barcodeimg',
            isDiff: 'static',
            flipX: false,
            flipY: false,
            lockSkewingX: true, // 禁掉按住shift时的变形
            lockSkewingY: true,
            scaleX: 1,
            scaleY: 1,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            imgText: options.imgText,
            lineColor: options.lineColor,
            selectable: false,
            hasRotatingPoint: options.hasRotatingPoint !== false ? true : options.hasRotatingPoint, // 元素是否旋转

            visible: options.visible,
            eyeshow: options.eyeshow,
            screenIndex: options.screenIndex

          })

          // eslint-disable-next-line no-undef
          const rect = new fabric.Rect({
            width: options.width, // document.getElementById('barcode').width>options.width?document.getElementById('barcode').width:
            height: options.height,
            fill: 'rgba(255,255,255,0.3)', // #f1edea
            originX: 'left',
            originY: 'top',
            left: 0,
            top: 0,

            id: options.id,
            layer: options.layer ? options.layer : options.id,
            zIndex: options.zIndex,
            copyId: options.copyId,

            name: options.name ? options.name : 'barcodebg',
            component: 'component',
            isType: 'barcodebg',
            isDiff: 'static',
            selectable: false,
            hasRotatingPoint: options.hasRotatingPoint !== false ? true : options.hasRotatingPoint, // 元素是否旋转

            visible: options.visible,
            eyeshow: options.eyeshow,
            screenIndex: options.screenIndex
          })

          // eslint-disable-next-line no-undef
          canvasObject = new fabric.Group([rect, barcodeIMG], {
            originX: 'left',
            originY: 'top',
            left: options.left,
            top: options.top,
            originXY: [options.originXY[0], 'top'],
            id: options.id,
            copyId: options.copyId,
            layer: options.layer ? options.layer : options.id,
            zIndex: options.zIndex,

            type: options.type ? options.type : 'group',

            name: options.name ? options.name : 'Barcode',

            component: 'component',
            isType: 'Barcode',
            isDiff: 'static',
            width: options.width,
            height: options.height,
            barlineWidth: options.barlineWidth,

            imgText: options.imgText,
            lineColor: options.lineColor,

            fill: options.lineColor,
            color: options.color ? options.color : '#000000',
            bgcolor: options.bgcolor ? options.bgcolor : 'rgba(255,255,255,0.3)',
            barcodeType: options.barcodeType ? options.barcodeType : 'CODE128', // 条形码的格式

            lockRotation: true,
            flipX: false,
            flipY: false,
            lockSkewingX: true, // 禁掉按住shift时的变形
            lockSkewingY: true,

            hasRotatingPoint: false, // 元素是否旋转

            visible: options.visible,
            eyeshow: options.eyeshow,
            screenIndex: options.screenIndex

            /* clipTo:(e)=>{
                            if(e){
                                e.canvas.getContext('2d').rect(-options.width/2,-options.height/2,options.width,options.height);
                            }
                        } */
          })

          canvasObject.on('scaling', (e) => {
            e.target.item(1).set({
              left: -8000, // e.target.width* e.transform.newScaleX
              top: 0
            })
            // that.changeBarcodeImage(canvasObject); //改变一下试试
            canvas.requestRenderAll()
            canvas.renderAll()
          })

          // canvas.add(canvasObject)
          // console.log(options.originXY[0],options.width,document.getElementById('barcode').width);
          let left = 0
          let w = options.width
          let barw = document.getElementById(barid).width
          if (options.originXY[0] === 'left') {
            left = w < barw ? Math.abs(barw - w) / 2 : -Math.abs(barw - w) / 2
          } else if (options.originXY[0] === 'center') {
            left = 0
          } else if (options.originXY[0] === 'right') {
            left = w < barw ? -Math.abs(barw - w) / 2 : Math.abs(barw - w) / 2
          }
          canvasObject.item(0).set({
            left: '-50%'
          })
          canvasObject.item(1).set({
            top: 0,
            left: left
          })
          // that.setActiveObject(canvasObject)

          // that.setTop() // 遮罩置顶
          // canvas.renderAll()
          /* that.activecanvaobjs.push(canvasObject);   //设置活跃元素
                    that.activeobj = canvasObject; */

          that.changeBarcodeImage(canvasObject) // 改变一下试试
          canvasObject.set({
            angle: options.angle
          })
          resolve(canvasObject)
        }
        document.getElementById(barid).onerror = function () {
          reject(new Error('barcode error load!'))
        }
      })
    },
    // 改变条码的图片和大小
    async changeBarcodeImage (options) {
      // console.log(options.item(1).width,options.item(1).scaleX,options.width,options.scaleX);
      let lineWidth = options.barlineWidth
      lineWidth = Math.floor(options.barlineWidth * ((options.width * options.scaleX) / (options.item(1).width * options.item(1).scaleX)))

      if (lineWidth === 0) {
        lineWidth = 1
      }
      // console.log('条码线宽：', lineWidth, options.barlineWidth)

      options.set({
        width: options.width * options.scaleX,
        scaleX: 1,
        barlineWidth: lineWidth
      })
      options.item(0).set({
        width: options.width * options.scaleX,
        scaleX: 1
      })

      let newoptions = {
        id: options.id ? options.id : 0,
        layer: options.layer ? options.layer : options.id,
        barcodeType: options.barcodeType ? options.barcodeType : 'CODE128', // 条形码的格式
        lineColor: options.color ? options.color : '#000000', // 线条颜色
        bgcolor: options.bgcolor ? options.bgcolor : 'rgba(255,255,255,0.3)', // 背景颜色 #f1edea
        margin: 0, // 条码四边空白（默认为10px）
        lineWidth: lineWidth, // 线宽
        height: options.item(1).height ? options.item(1).height : 20, // 条码高度

        visible: options.visible,
        eyeshow: options.eyeshow,
        screenIndex: options.screenIndex
      }
      let img = await this.drawbarcode(options.imgText, newoptions)

      let left = 0
      let w = options.width
      let barw = document.getElementById('barcode' + newoptions.id).width
      if (options.originXY[0] === 'left') {
        left = w < barw ? Math.abs(barw - w) / 2 : -Math.abs(barw - w) / 2
      } else if (options.originXY[0] === 'center') {
        left = 0
      } else if (options.originXY[0] === 'right') {
        left = w < barw ? -Math.abs(barw - w) / 2 : Math.abs(barw - w) / 2
      }

      options.item(1)._element.src = img
      options.item(1).set({
        left: left,
        width: options.item(1)._element.width,
        scaleX: 1
      })

      if (options.barlineWidth * ((options.width * options.scaleX) / (options.item(1).width * options.item(1).scaleX)) < 1) {
        // console.log('小于条码1倍')
        options.item(0).set({
          width: options.item(1)._element.width,
          scaleX: 1
        })
        options.set({
          width: options.item(1)._element.width,
          scaleX: 1,
          dirty: null
        })
        options.item(1).set({
          left: 0
        })
      }

      options.setCoords()
      /* this.setZoom(this.canvasZoom+0.01);
            this.setZoom(this.canvasZoom-0.01); */
      this.canvas.requestRenderAll()
      this.canvas.renderAll()
    },
    // 画条码
    drawbarcode (number, option) {
      // console.log('drawbarcode', option)
      return new Promise(function (resolve, reject) {
        let barbox = document.getElementById('barbox')
        let bardom = document.createElement('img')
        let barid = 'barcode' + option.id
        bardom.id = 'barcode' + option.id
        let allnode = barbox.childNodes
        let ids = [] // 所有子节点的id集合
        allnode.forEach((node) => {
          ids.push(node.getAttribute('id'))
        })
        if (ids.indexOf(barid) === -1) {
          barbox.appendChild(bardom)// 为了解决多个条码，他们用图需要不一样
        }

        // console.log(barbox,bardom);

        try {
          // eslint-disable-next-line no-undef
          let newbarcode = JsBarcode('#barcode' + option.id, number, {
            format: option.barcodeType ? option.barcodeType : 'CODE128', // 条形码的格式
            lineColor: option.lineColor ? option.lineColor : '#000000', // 线条颜色
            margin: option.margin ? option.margin : 0, // 条码四边空白（默认为10px）
            width: option.lineWidth ? option.lineWidth : 2, // 线宽
            height: option.height ? option.height : 20, // 条码高度
            background: option.bgcolor ? option.bgcolor : 'rgba(255,255,255,0.3)', // 背景颜色 #f1edea
            displayValue: false // 是否显示文字信息
          })
          console.warn(newbarcode)
        } catch (e) {
          console.warn(e)
          // eslint-disable-next-line no-undef
          JsBarcode('#barcode' + option.id, 'nodata', {
            format: 'CODE128', // 条形码的格式
            lineColor: option.lineColor || '#000000', // 线条颜色
            margin: option.margin || 0, // 条码四边空白（默认为10px）
            width: option.lineWidth || 2, // 线宽
            height: option.height || 20, // 条码高度
            background: option.bgcolor || 'rgba(255,255,255,0.3)', // 背景颜色 #f1edea
            displayValue: false // 是否显示文字信息
          })
        }

        document.getElementById('barcode' + option.id).onload = () => {
          // console.log(document.getElementById("barcode").src);
          let img = document.getElementById('barcode' + option.id).src
          resolve(img)
        }
        document.getElementById('barcode' + option.id).onerror = function () {
          reject(new Error('barcode is error!'))
        }
      })
    },
    // 创建datamatrix二维码
    async createBarcodedatamatrix (options) {
      // console.log('创建datamatrix条形码：', options)
      let that = this
      let curcanvas = this.canvas
      return new Promise(function (resolve, reject) {
        let canvasObject
        options.imgText = options.imgText ? options.imgText : '12345670'

        // eslint-disable-next-line no-undef
        var svgNode = DATAMatrix({
          msg: options.imgText,
          dim: options.barlineWidth,
          rct: 0,
          pad: 1,
          pal: [options.color ? options.color : '#000000', options.bgcolor ? options.bgcolor : '#f1edea'],
          vrb: 0
        })
        // img.src=svgNode
        // document.getElementById('datamatix').append(svgNode)

        console.warn(svgNode)
        // img.src = 'data:image/svg+xml,' + btoa(unescape(encodeURIComponent(svgNode.innerHTML)));
        // console.warn(img)

        document.getElementById('datamatix').append(svgNode)

        html2canvas(document.getElementById('datamatix')).then(function (canvas) {
          let url = canvas.toDataURL()
          // console.log(url)

          let img = new Image()
          img.crossOrigin = 'Anonymous'
          img.src = url

          img.onload = () => {
            // console.log(img)

            document.getElementById('datamatix').append(img)

            // eslint-disable-next-line no-undef
            canvasObject = new fabric.Image(img, {
              left: options.left,
              top: options.top,
              id: options.id,

              // width: options.width,
              // height: options.height,
              // scaleX:1,
              // scaleY:1,

              scaleX: options.width / img.width,
              scaleY: options.height / img.height,

              copyId: options.copyId,
              layer: options.layer ? options.layer : options.id,
              zIndex: options.zIndex ? options.zIndex : options.id,
              type: options.type ? options.type : '0',
              color: options.lineColor,

              name: options.name ? options.name : 'Barcodedatamatrix',
              angle: options.angle,
              component: 'component',
              isType: 'Barcodedatamatrix',
              isDiff: 'static',
              fill: options.fill ? options.fill : '#000000',
              flipX: false,
              flipY: false,
              lockSkewingX: true, // 禁掉按住shift时的变形
              lockSkewingY: true,
              originX: 'left',
              originY: 'top',
              lockUniScaling: true,
              imgText: options.imgText,
              content: options.imgText,

              lineColor: options.lineColor,
              hasRotatingPoint: false, // 元素是否旋转

              visible: options.visible !== false ? true : options.visible, // 元素是否可见
              eyeshow: options.eyeshow,
              screenIndex: options.screenIndex

            })

            // console.log(canvasObject)
            curcanvas.add(canvasObject)
            that.setActiveObject(canvasObject)
            // that.setTop();                                         //遮罩置顶
            curcanvas.renderAll()

            resolve(canvasObject)
          }
          img.onerror = function () {
            reject(new Error('barcode error load!'))
          }
        })
      })
    },
    // 获取创建二维码的结果
    createQrcode (options) {
      return new Promise(function (resolve, reject) {
        if (options.barcodeType === 1) {
          let canvasObject
          options.imgText = options.imgText ? options.imgText : '12345670'

          // eslint-disable-next-line no-undef
          var svgNode = DATAMatrix({
            msg: options.imgText,
            dim: options.width,
            rct: 0,
            pad: 0,
            pal: [options.lineColor ? options.lineColor : '#000000', options.bgcolor ? options.bgcolor : '#f1edea'],
            vrb: 0
          })
          // img.src=svgNode
          // document.getElementById('datamatix').append(svgNode)

          console.warn(svgNode)
          // img.src = 'data:image/svg+xml,' + btoa(unescape(encodeURIComponent(svgNode.innerHTML)));
          // console.warn(img)

          // 循环删除历史图片
          var el = document.getElementById('datamatix')
          var childs = el.childNodes
          for (var i = childs.length - 1; i >= 0; i--) {
            el.removeChild(childs[i])
          }
          document.getElementById('datamatix').append(svgNode)

          html2canvas(document.getElementById('datamatix')).then(function (canvas) {
            let url = canvas.toDataURL()

            let img = new Image()
            img.crossOrigin = 'Anonymous'
            img.src = url

            img.onload = () => {
              // console.log(img.width,img.height)

              document.getElementById('datamatix').append(img)

              // eslint-disable-next-line no-undef
              canvasObject = new fabric.Image(img, {
                left: options.left,
                top: options.top,
                id: options.id,

                // width: options.width,
                // height: options.height,
                // scaleX:1,
                // scaleY:1,

                // scaleX: options.width / img.width,
                // scaleY: options.height / img.width,

                copyId: options.copyId,
                layer: options.layer ? options.layer : options.id,
                zIndex: options.zIndex ? options.zIndex : options.id,
                type: options.type ? options.type : 'Qrcode',
                color: options.lineColor,

                name: options.name ? options.name : 'Qrcode',
                angle: options.angle,
                component: 'component',
                isType: 'Qrcode',
                isDiff: 'static',
                fill: options.fill ? options.fill : '#000000',
                flipX: false,
                flipY: false,
                lockSkewingX: true, // 禁掉按住shift时的变形
                lockSkewingY: true,
                originX: 'left',
                originY: 'top',
                lockUniScaling: true,
                imgText: options.imgText,
                content: options.imgText,

                lineColor: options.lineColor,
                bgcolor: options.bgcolor,
                hasRotatingPoint: false, // 元素是否旋转

                barcodeType: 1,
                visible: options.visible !== false ? true : options.visible, // 元素是否可见
                eyeshow: options.eyeshow,
                screenIndex: options.screenIndex

              })
              canvasObject.height = canvasObject.width
              // console.log(canvasObject.width,canvasObject.height)
              // curcanvas.add(canvasObject)
              // that.setActiveObject(canvasObject)
              // that.setTop();                                         //遮罩置顶
              // curcanvas.renderAll()

              resolve(canvasObject)
            }
            img.onerror = function () {
              reject(new Error('barcode error load!'))
            }
          })
        } else {
          let canvasObject
          // eslint-disable-next-line no-undef
          let qrcodeImg = jrQrcode.getQrBase64(options.imgText, {
            padding: options.margin ? options.margin : 2, // 二维码四边空白（默认为10px）
            width: options.width ? options.width : 80, // 二维码图片宽度（默认为256px）
            height: options.height ? options.height : 80, // 二维码图片高度（默认为256px）
            // eslint-disable-next-line no-undef
            correctLevel: QRErrorCorrectLevel.H, // 二维码容错level（默认为高）
            reverse: false, // 反色二维码，二维码颜色为上层容器的背景颜色
            background: options.bgcolor ? options.bgcolor : '#ffffff', // 二维码背景颜色（默认白色）二维码
            foreground: options.lineColor ? options.lineColor : '#000000' // 二维码颜色（默认黑色）
          })
          let newimg = document.createElement('img')
          newimg.src = qrcodeImg
          newimg.id = (new Date()).getTime()

          newimg.onload = () => {
            // eslint-disable-next-line no-undef
            canvasObject = new fabric.Image(newimg, {
              left: options.left,
              top: options.top,
              id: options.id,
              copyId: options.copyId,
              layer: options.layer ? options.layer : options.id,
              zIndex: options.zIndex ? options.zIndex : options.id,
              type: options.type ? options.type : 'Qrcode',
              color: options.lineColor,

              name: options.name ? options.name : 'Qrcode',
              angle: options.angle,
              component: 'component',
              isType: 'Qrcode',
              isDiff: 'static',
              fill: options.fill ? options.fill : '#000000',
              bgcolor: options.bgcolor,
              flipX: false,
              flipY: false,
              lockSkewingX: true, // 禁掉按住shift时的变形
              lockSkewingY: true,
              originX: 'left',
              originY: 'top',
              lockUniScaling: true,
              imgText: options.imgText,
              content: options.imgText,

              lineColor: options.lineColor,
              hasRotatingPoint: false, // 元素是否旋转

              barcodeType: 0,
              visible: options.visible,
              eyeshow: options.eyeshow,
              screenIndex: options.screenIndex

            })
            // canvas.add(canvasObject)
            // that.setActiveObject(canvasObject)
            // that.setTop() // 遮罩置顶
            // canvas.renderAll()
            /* that.activecanvaobjs.push(canvasObject);   //设置活跃元素
                         that.activeobj = canvasObject; */
            resolve(canvasObject)
          }
          newimg.onerror = function () {
            reject(new Error('qrcode error load!'))
          }
        }
      })
    },
    // 改变二维码的图片大小和值
    async changeQrcodeImage (options) {
      if (options.isType !== 'Qrcode') {
        return
      }
      let optionsdata = JSON.parse(JSON.stringify(options))
      this.removeObj(options)

      let left = optionsdata.left + this.xLeft
      let top = optionsdata.top + this.yTop
      // console.log('change image:',options.height);
      await this.createElement(options.isType, {
        ...options,
        imgText: options.imgText,
        lineColor: options.lineColor,
        left: left,
        top: top,
        width: parseInt(options.width * options.scaleX),
        height: parseInt(options.height * options.scaleY),
        scaleX: 1,
        scaleY: 1,

        visible: options.visible,
        eyeshow: options.eyeshow,
        screenIndex: options.screenIndex

      })
      await this.objectSetZindex() // 元素顺序
    },
    // 创建文本
    async createText (text, options) {
      options = Object.assign({
        width: 50,
        height: 30,
        left: -this.xLeft,
        top: -this.yTop,
        padding: 0,
        angle: 0,
        scaleX: 1,
        scaleY: 1
      }, options)
      // eslint-disable-next-line no-undef
      var canvasObj = new fabric.Text(text, {
        ...options,
        splitByGrapheme: true,
        width: options.width,
        height: options.height,
        left: options.left,
        top: options.top,
        id: options.id,
        name: options.name ? options.name : 'Text',
        component: 'component',
        isType: 'Text',
        isDiff: 'static',

        selectable: options.selectable !== false ? true : options.selectable, // 元素是否可选中
        visible: options.visible !== false ? true : options.visible, // 元素是否可见

        fill: options.fill ? options.fill : '#000', // 填充的颜色（矩形）
        fillColor: options.fillColor ? options.fillColor : '#000', // 填充的颜色

        backgroundColor: options.backgroundColor ? options.backgroundColor : 'rgba(0,0,0,0)', // 边框填充的颜色
        stroke: options.stroke ? options.stroke : 'rgba(0,0,0,0)', // 边框颜色
        strokeWidth: options.strokeWidth ? options.strokeWidth : 0, // 边框宽度
        strokeDashArray: options.strokeDashArray ? options.strokeDashArray : [0, 0], // 边框样式 虚线 [5,1]     直线[0,0]

        minScaleLimit: 0.1, //  最小限制

        flipX: false,
        flipY: false,
        originX: 'left',
        originY: 'top',
        lockSkewingX: true, // 禁掉按住shift时的变形
        lockSkewingY: true,
        stopContextMenu: true // 禁掉鼠标右键默认事件
      })
      return canvasObj
    },
    // 文本不使用 的文本
    newtextStyleFormat: function (target, text) {
      // console.log('触发文本裁剪', target.width)
      //  console.log(target.maxLines,target.omitStyleText,target.newline);
      if (!target.maxLines) {
        return target.text
      }
      if (!target.omitStyleText) {
        return target.text
      }

      let linewords = text
      let wordJoiners = /[\n\t\r]/
      // console.log(target.text,text)
      //  console.warn('linewords*******************0',linewords);
      let lines = linewords.split(wordJoiners) // 先按照回车符等分隔多行
      let newtext = linewords

      if (target.newline !== '') {
        if (target.newline && target.newline !== '') { // 换行符 newline
          let newwordJoiners = target.newline
          lines.forEach((line, i) => {
            if (line.indexOf(newwordJoiners) !== -1) { // 如果遇到填写的分隔符
              let moreline = line.split(newwordJoiners)
              lines.splice(i, 1)
              lines.splice(i, 0, ...moreline)
            }
          })
          newtext = ''
          for (var i = 0; i < lines.length; i++) {
            if (i === lines.length - 1) {
              newtext = newtext + lines[i]
            } else {
              newtext = newtext + lines[i] + '\n'
            }
          }
        }
      }

      // console.log(newtext);
      let widthlines = target._splitTextIntoLines(newtext).lines // 根据宽度切割行
      for (var j = 0; j < widthlines.length; j++) {
        if (widthlines[j] === '') {
          widthlines.splice(j, 1)
        }
      }
      // console.log(widthlines);

      if (target.maxLines && widthlines.length > target.maxLines) { // 最大行数 maxLines
        // console.log('符合最大行数限制',target.maxLines);
        newtext = ''
        for (var s = 0; s < target.maxLines; s++) {
          if (s === target.maxLines - 1) {
            newtext = newtext + widthlines[s] // 重新组装显示行
          } else {
            newtext = newtext + widthlines[s] + '\n' // 重新组装显示行
          }
        }
        if (target.omitStyleText !== '无') { // 超出替换 omitStyle
          newtext = newtext.substring(0, newtext.length - 1) + target.omitStyleText // .substring(0, newtext.length - 3)
          target.selectionEnd = target.selectionStart = newtext.length
        } else {
          target.selectionEnd = target.selectionStart = newtext.length
        }
      }

      // console.log(newtext);
      return newtext
    },
    textStyleFormatNew: function (target, text) {
      // console.log(target.maxLines,target.omitStyleText,target.newline);

      if (!target.maxLines) {
        return target.text
      }
      if (!target.omitStyleText) {
        return target.text
      }

      let linewords = text || target.textdemo
      let wordJoiners = /[\n\t\r]/
      let lines = linewords.split(wordJoiners) // 先按照回车符等分隔多行
      let newtext = linewords

      if (target.newline !== '') {
        if (target.newline && target.newline !== '') { // 换行符 newline
          let newwordJoiners = target.newline
          for (var i = 0; i < lines.length; i++) {
            if (lines[i].indexOf(newwordJoiners) !== -1) { // 如果遇到填写的分隔符
              let moreline = lines[i].split(newwordJoiners)
              lines.splice(i, 1)
              lines.splice(i, 0, ...moreline)
            }
          }
          newtext = ''
          for (let i = 0; i < lines.length; i++) {
            if (i === lines.length - 1) {
              newtext = newtext + lines[i]
            } else {
              newtext = newtext + lines[i] + '\n'
            }
          }
        }
      }

      let widthlines = target._splitTextIntoLines(newtext).lines // 根据宽度切割行
      for (var j = 0; j < widthlines.length; j++) {
        if (widthlines[j] === '') {
          widthlines.splice(j, 1)
        }
      }

      if (target.maxLines && widthlines.length > target.maxLines) { // 最大行数 maxLines
        newtext = ''
        for (let i = 0; i < target.maxLines; i++) {
          if (i === target.maxLines - 1) {
            newtext = newtext + widthlines[i] // 重新组装显示行
          } else {
            newtext = newtext + widthlines[i] + '\n' // 重新组装显示行
          }
        }
        if (target.omitStyleText !== '无') { // 超出替换 omitStyle
          // // 验证是否是中文
          // var pattern = new RegExp('[\u4E00-\u9FA5]+')
          // var str = '中文字符'
          // if (pattern.test(str)) {
          //   alert('该字符串是中文')
          // }
          // // 验证是否是英文
          // var pattern2 = new RegExp('[A-Za-z]+')
          // var str2 = 'abcdefsgaaweg'
          // if (pattern2.test(str2)) {
          //   alert('该字符串是英文')
          // }
          // // 验证是否是数字
          // var pattern3 = new RegExp('[0-9]+')
          // var str3 = '234234'
          // if (pattern3.test(str3)) {
          //   alert('该字符串是数字')
          // }
          var pattern = new RegExp('[\u4E00-\u9FA5]+')

          // console.log('含有中文：', pattern.test(newtext.substring(newtext.length - 2, newtext.length)))
          if (pattern.test(newtext.substring(newtext.length - 2, newtext.length))) {
            newtext = newtext.substring(0, newtext.length - 2) + target.omitStyleText // .substring(0, newtext.length - 3)
            target.selectionEnd = target.selectionStart = newtext.length
          } else {
            newtext = newtext.substring(0, newtext.length - 4) + target.omitStyleText // .substring(0, newtext.length - 3)
            target.selectionEnd = target.selectionStart = newtext.length
          }
        } else {
          target.selectionEnd = target.selectionStart = newtext.length
        }
      }

      return newtext
    },
    // 创建表格
    async createTable (table) {
      let canvas = this.canvas
      // eslint-disable-next-line no-undef
      let canvasObject = new fabric.tableList(canvas, table)
      let that = this
      setTimeout(() => {
        that.setActiveObject(canvasObject.table.group)
        canvasObject.table.group.setCoords()
      }, 1)

      return canvasObject
    },
    // 判断是表格的表头还是表体 group.dirty = true
    judeisTableHeadorBody (options) {
      let objects = options.target._objects
      let col = 0
      let row = 0

      objects.forEach((object) => {
        if (object.isType === 'table-tbodybg' || object.isType === 'table-theadbg') {
          if (object.left + options.target.width / 2 < options.pointer.x - options.target.left &&
                  options.pointer.x - options.target.left < object.left + options.target.width / 2 + object.width) {
            col = object.ncol
          }
          if (object.top + options.target.height / 2 < options.pointer.y - options.target.top &&
                  options.pointer.y - options.target.top < object.top + options.target.height / 2 + object.height) {
            row = object.nrow
          }
        }
      })
      return {row: row, col: col}
    },

    // 按原来的id表格
    async setNewTable (groups, table) {
      if (groups.isType !== 'tableList') { return }
      if (!table) {
        table = groups.item(0).tableStyle
      }
      table.tableinfo.id = groups.id
      table.tableinfo.layer = groups.layer
      let options = {
        id: groups.id,
        layer: groups.layer,
        tabledata: table
      }
      let canvas = this.canvas
      canvas.remove(groups)
      // console.log(options)
      // eslint-disable-next-line no-undef
      // let canvasObject = new fabric.tableList(this.canvas, table)
      let canvasObject = await this.createElement('tableList', options)
      let that = this
      setTimeout(async () => {
        // console.warn(canvasObject.table);
        that.setActiveObject(canvasObject.table.group)
        // canvasObject.table.group.setCoords()
        // canvas.add(canvasObject)

        await that.objectSetZindex() // 元素顺序
        that.setTop() // 遮罩置顶
        canvas.requestRenderAll()
        canvas.renderAll()
      }, 1)
    },

    // 元素对象转成json
    toJson () {
      let json = this.canvas.toJSON()
      return json
    },
    // 为元素设置句柄显示
    setControlsVisibility (obj, options) {
      obj.setControlsVisibility({ // 上中、下中、左中、右中 取消
        bl: true,
        br: true,
        mb: true,
        ml: true,
        mr: true,
        mt: true,
        mtr: true,
        tl: true,
        tr: true,
        ...options
      })
    },
    // 返回point 坐标
    getLocalPointer () {
      let cur = this.getEditObj()
      cur.getLocalPointer()
    },
    // 提前加载图片
    loadImage (url) {
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.setAttribute('crossOrigin', 'Anonymous')
        img.src = url
        setTimeout(() => {
          if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
            resolve(img)
            return // 直接返回，不用再处理onload事件
          }
          img.onload = async () => {
            // console.log(img.readyState, img.complete)
            resolve(img)
          }
          img.onerror = async (err) => {
            // console.log('err', err)
            reject(err.type)
          }
        }, 200)
      })
    },
    // 图片转base64
    imgToBase64 (imgSrc, imgType, callback) {
      let type = imgType || 'image/png'
      let dataURL
      let img = new Image()
      // 允许资源跨域使用
      img.setAttribute('crossOrigin', 'anonymous')
      img.src = imgSrc
      img.onload = function () {
        let imgWidth = img.width
        let imgHeight = img.height

        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        canvas.width = imgWidth
        canvas.height = imgHeight
        ctx.drawImage(img, 0, 0, imgWidth, imgHeight)
        dataURL = canvas.toDataURL(type)
        // console.log(dataURL)
        callback && callback(dataURL)
        return dataURL
      }
    },
    // 生成全画布预览图
    toDataUrl () {
      let canvas = this.canvas
      let dataURL = canvas.toDataURL({
        format: 'jpeg',
        quality: 1
      })
      return dataURL
    },

    // 切割画布
    cutImg (img, x1, y1, x2, y2) {
      // let canvas = this.canvas
      let xStart = x1 * this.canvasZoom
      let yStart = y1 * this.canvasZoom
      let xEnd = x2 * this.canvasZoom
      let yEnd = y2 * this.canvasZoom
      return new Promise(function (resolve, reject) {
        var dirtyWidth = yStart - xStart
        var dirtyHeight = yEnd - xEnd
        let canvas = document.createElement('canvas')
        var nowText = canvas.getContext('2d')// 获取2d环境
        var img1 = new Image()
        // img1.crossOrigin="anonymous";
        img1.src = img
        var newCanvas = document.createElement('canvas')
        var newText = newCanvas.getContext('2d')

        img1.onload = function () {
          nowText.drawImage(img1, 0, 0, canvas.width, canvas.height)// 绘制图像
          var imgData = nowText.getImageData(x1, y1, dirtyWidth, dirtyHeight)// 获取截图画布像素数据
          newCanvas.width = dirtyWidth
          newCanvas.height = dirtyHeight
          // console.log(newCanvas.width, newCanvas.height)
          newText.putImageData(imgData, 0, 0, 0, 0, newCanvas.width, newCanvas.height)// 将截取的图像放回画布上
          var imgUrl = newCanvas.toDataURL('image/png')// 将图片转为dataURL(base64);
          resolve(imgUrl)
        }
        img1.onerror = function () {
          reject(new Error('Could not load image at '))
        }
      })
    },
    // 组件切割
    async toCutObject (obj) {
      if (!obj) { return true }
      this.discardActive()
      var dataImg = this.canvas.toDataURL({
        format: 'jpeg',
        multiplier: 2,
        left: obj.oCoords.tl.x,
        top: obj.oCoords.tl.y,
        width: obj.width * obj.scaleX * this.canvasZoom,
        height: obj.height * obj.scaleY * this.canvasZoom
      })
      return dataImg
    },
    // 预览
    async toDataUrlImg () {
      this.discardActive()
      let bg = this.returnbg()
      var dataImg = this.canvas.toDataURL({
        format: 'jpeg',
        multiplier: 2,
        left: bg.oCoords.tl.x,
        top: bg.oCoords.tl.y,
        width: bg.width * this.canvasZoom,
        height: bg.height * this.canvasZoom
      })
      return dataImg
    },
    // 生成预览图片
    async dataUrl () {
      this.discardActive()
      let bg = this.returnbg()
      var dataImg = await this.canvas.toDataURL({
        format: 'png',
        multiplier: 2,
        left: bg.oCoords.tl.x,
        top: bg.oCoords.tl.y,
        width: bg.width * this.canvasZoom,
        height: bg.height * this.canvasZoom
      })
      // console.log(dataImg)
      let imgFile = this.dataURLtoFile(dataImg)
      // console.log(imgFile)
      // 如果想要预览转出来的图片可以：
      const fileReader = new FileReader() // 创建一个 fileReader
      fileReader.readAsDataURL(imgFile) // 将生成的图片文件读到 fileReader中
      const img = new Image()
      img.src = fileReader.result // 将 fileReader.result 设置为 图片的 src
      document.body.appendChild(img)
      console.log(imgFile, img)
      return imgFile
    },
    // base64转文件
    dataURLtoFile (dataurl, filename = 'file') {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let suffix = mime.split('/')[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      })
    },
    // 文本不使用 的文本
    textStyleFormat: function (target, text) {
      //  console.log(target.maxLines,target.omitStyleText,target.newline);
      if (!target.maxLines) {
        return target.text
      }
      if (!target.omitStyleText) {
        return target.text
      }

      let linewords = target.text
      let wordJoiners = /[\n\t\r]/
      // console.log(target.text,text)
      //  console.warn('linewords*******************0',linewords);
      let lines = linewords.split(wordJoiners) // 先按照回车符等分隔多行
      let newtext = linewords

      if (target.newline !== '') {
        if (target.newline && target.newline !== '') { // 换行符 newline
          let newwordJoiners = target.newline
          lines.forEach((line, i) => {
            if (line.indexOf(newwordJoiners) !== -1) { // 如果遇到填写的分隔符
              let moreline = line.split(newwordJoiners)
              lines.splice(i, 1)
              lines.splice(i, 0, ...moreline)
            }
          })
          newtext = ''
          for (var i = 0; i < lines.length; i++) {
            if (i === lines.length - 1) {
              newtext = newtext + lines[i]
            } else {
              newtext = newtext + lines[i] + '\n'
            }
          }
        }
      }

      // console.log(newtext);
      let widthlines = target._splitTextIntoLines(newtext).lines // 根据宽度切割行
      for (var j = 0; j < widthlines.length; j++) {
        if (widthlines[j] === '') {
          widthlines.splice(j, 1)
        }
      }
      // console.log(widthlines);

      if (target.maxLines && widthlines.length > target.maxLines) { // 最大行数 maxLines
        // console.log('符合最大行数限制',target.maxLines);
        newtext = ''
        for (var s = 0; s < target.maxLines; s++) {
          if (s === target.maxLines - 1) {
            newtext = newtext + widthlines[s] // 重新组装显示行
          } else {
            newtext = newtext + widthlines[s] + '\n' // 重新组装显示行
          }
        }
        if (target.omitStyleText !== '无') { // 超出替换 omitStyle
          newtext = newtext.substring(0, newtext.length - 1) + target.omitStyleText // .substring(0, newtext.length - 3)
          target.selectionEnd = target.selectionStart = newtext.length
        } else {
          target.selectionEnd = target.selectionStart = newtext.length
        }
      }

      // console.log(newtext);
      return newtext
    },
    /**  文本不使用时:
         * isElasticSize === 0
         * 文本内容切换时 content
         * 最大行数切换时 maxLines
         * 换行符切换时 omitStyleText omitStyle
         * 结尾符切换时 newline
         *
         * target =====> TextRect
         */
    async textIsUsually (target, text) {
      // console.log('isElasticSize-----', target)

      if (target.isElasticSize === 0) {
        let allobjects = this.getObjectsNew()
        // console.log(target.text.maxLines, target.text.newline, target.text.omitStyleText)
        let realtext = this.textStyleFormatNew(target.text, text)
        allobjects.forEach((obj) => {
          if (obj.id === target.id && obj.isType === 'TextRect') {
            obj.textdemo = text
            obj.content = text
            obj.text.text = realtext
            obj.text.textdemo = text
          }

          if (obj.id === target.id && obj.isType === 'TextRect-text') {
            obj.set('text', realtext)
            obj.set('textdemo', text)
            obj.set('height', target.height)

            this.renderCanvas() // 渲染一下
          }
        })
      }
    },
    // 返回背景坐标
    returnXY () {
      let bg = this.returnbg()
      return {x: bg.oCoords.tl.x, y: bg.oCoords.tl.y, left: bg.left, top: bg.top}
    },
    // 文本切换类型需要重绘
    async changeTextType (target, text) {
      let newtext = target.textdemo.replace(/[\r\n]/g, '')
      //  console.warn('textRectdata',target.id,target.isElasticSize,target.textdemo,newtext);
      let newtextdata = {
        id: JSON.parse(JSON.stringify(target.id)),
        zIndex: JSON.parse(JSON.stringify(target.zIndex)),
        layer: JSON.parse(JSON.stringify(target.layer)),

        angle: JSON.parse(JSON.stringify(target.angle)),
        left: JSON.parse(JSON.stringify(target.left)) - this.returnXY().left,
        top: JSON.parse(JSON.stringify(target.top)) - this.returnXY().top,
        width: JSON.parse(JSON.stringify(target.width)) * target.scaleX,
        height: JSON.parse(JSON.stringify(target.height)) * target.scaleY,

        fillinColor: JSON.parse(JSON.stringify(target.fillinColor)),
        stroke: JSON.parse(JSON.stringify(target.stroke)),
        strokeWidth: JSON.parse(JSON.stringify(target.strokeWidth)),

        fontColor: JSON.parse(JSON.stringify(target.text.fill)),
        color: JSON.parse(JSON.stringify(target.fontColor)),
        fontFamily: JSON.parse(JSON.stringify(target.fontFamily)),
        textAlign: JSON.parse(JSON.stringify(target.textAlign ? target.textAlign : 'left')),
        fontStyle: JSON.parse(JSON.stringify(target.fontStyle ? target.fontStyle : 'normal')),
        linethrough: JSON.parse(JSON.stringify(target.linethrough ? target.linethrough : false)),
        underline: JSON.parse(JSON.stringify(target.underline ? target.underline : false)),
        fontWeight: JSON.parse(JSON.stringify(target.fontWeight ? target.fontWeight : 'normal')),

        maxLines: JSON.parse(JSON.stringify(target.maxLines ? target.maxLines : 3)),
        omitStyleText: JSON.parse(JSON.stringify(target.omitStyleText ? target.omitStyleText : '无')),
        omitStyle: JSON.parse(JSON.stringify(target.omitStyle ? target.omitStyle : 0)),
        newline: JSON.parse(JSON.stringify(target.newline ? target.newline : '')),

        minFontSize: JSON.parse(JSON.stringify(target.minFontSize ? target.minFontSize : 12)),

        isElasticSize: JSON.parse(JSON.stringify(target.isElasticSize ? target.isElasticSize : 0)),
        fontSize: JSON.parse(JSON.stringify(target.fontSize ? target.fontSize : 14)),
        textdemo: JSON.parse(JSON.stringify(newtext || 'TEXT')), //
        verticalSpace: target.verticalSpace ? target.verticalSpace : 0,

        textPadding: JSON.parse(JSON.stringify(target.textPadding)),
        scaleX: 1,
        scaleY: 1,

        visible: JSON.parse(JSON.stringify(target.visible))

      }

      let canvas = this.canvas
      canvas.remove(target)
      let allobjects = this.getObjectsNew()
      allobjects.forEach((obj) => {
        if (obj.id === target.id && obj.isType === 'TextRect-text') {
          canvas.remove(obj)
        }
      })

      let that = this
      await that.createElement('TextRect', {...newtextdata})
      await that.objectSetZindex() // 元素顺序
      // console.log('元素顺序OK')
      that.setTop() // 遮罩置顶
      canvas.requestRenderAll()
      canvas.renderAll()
    },
    // 文本退出编辑
    exitEditing () {
      let obj = this.getEditObj()
      const id = obj.id
      if (obj.isType !== 'TextRect-text' && obj.isType !== 'Itext' && obj.isType !== 'Textbox') { return }
      obj.exitEditing()
      this.setActiveById(id) // 文本选择
      this.renderCanvas() // 渲染一下
    },
    // 设置锁定
    setSuo (id) {
      //   console.log('setShow',id);
      let objects = this.canvas.getObjects()
      for (let i in objects) {
        if (objects[i].id === id) {
          this.canvas.lockOption(objects[i])

          if (objects[i]._objects) { // 条码显示隐藏
            // console.log('条码----------------',objects[i]);
            objects[i]._objects.forEach((obj) => {
              this.canvas.lockOption(obj)
            })
          }
          this.canvas.requestRenderAll()
          this.canvas.renderAll()
        }
      }
    },
    // 模板设置显示
    setShow (id) {
      //   console.log('setShow',id);
      let objects = this.canvas.getObjects()
      for (let i in objects) {
        if (objects[i].id === id) {
          objects[i].set('selectable', true)
          objects[i].set('visible', true)
          objects[i].set('opacity', 1)
          objects[i].set('eyeshow', true)

          if (objects[i]._objects) { // 条码显示隐藏
            // console.log('条码----------------',objects[i]);
            objects[i]._objects.forEach((obj) => {
              obj.set('visible', true)
              obj.set('opacity', 1)
              obj.set('eyeshow', true)
            })
          }
          this.canvas.requestRenderAll()
          this.canvas.renderAll()
        }
      }
    },
    // 模板设置隐藏
    setHidden (id) {
      let objects = this.canvas.getObjects()
      for (let i in objects) {
        if (objects[i].id === id) {
          objects[i].set('selectable', false)
          objects[i].set('visible', false)
          objects[i].set('opacity', 0)
          objects[i].set('eyeshow', false)
          this.canvas.requestRenderAll()
          this.canvas.renderAll()
        }
      }
    },

    // 测量文字真实宽度
    getTextOffset (text, options) {
      // console.log(options)
      let result = new Promise(function (resolve, reject) {
        // eslint-disable-next-line no-undef
        let ncanvas = new fabric.Canvas('fontcanvas', { preserveObjectStacking: true })
        ncanvas.setWidth(options.width)
        ncanvas.setHeight(options.height)
        ncanvas.backgroundColor = '#000'

        // eslint-disable-next-line no-undef
        let textdemo = new fabric.IText(text, {
          fill: '#ff0',
          splitByGrapheme: false,
          lockScalingFlip: true,
          fontFamily: options.fontFamily,
          fontSize: options.fontSize,

          fontWeight: options.fontWeight || 'normal',
          linethrough: options.linethrough || false,
          underline: options.underline || false,
          fontStyle: options.fontStyle || 'normal',

          originX: 'left',
          originY: 'top'
        })

        textdemo.set({
          left: 0,
          top: 0
        })
        // console.log(textdaemo.measureLine(0),textdaemo.getHeightOfChar(0));
        ncanvas.setWidth(textdemo.width)
        ncanvas.setHeight(textdemo.height)
        textdemo.setCoords()

        ncanvas.add(textdemo)
        ncanvas.requestRenderAll()
        ncanvas.renderAll()
        let ctxcontent = ncanvas.getContext('2d')
        let canvadata = ctxcontent.getImageData(0, 0, textdemo.width, textdemo.height)
        var data = canvadata.data
        let morew = canvadata.width
        let moreh = canvadata.height

        let coor = []
        let fontw = []
        let fonth = []
        for (let j = 0; j < 2; j++) {
          coor[j] = []
        }
        let realdata = []
        for (let i = 0, len = data.length; i < len; i += 4) {
          let red = data[i]
          let green = data[i + 1]
          let blue = data[i + 2]
          // let alpha = data[i + 3]
          if (`${red} ${green} ${blue}` === '0 0 0') {
            realdata.push(0)
          } else {
            realdata.push(1)
          }
        }

        // 计算二维图像
        let lines = []
        for (var l = 0; l < realdata.length; l += morew) {
          lines[l / morew] = []
          for (var m = 0; m < morew; m++) {
            lines[l / morew][m] = realdata[l + m]
            if (realdata[l + m] === 1) {
              fonth.push(parseInt(l / morew))
              fontw.push(m)
            }
          }
        }
        // 生成base64图像
        let dataUrl = ncanvas.toDataURL({
          format: 'jpeg',
          multiplier: 1
        })
        let w = new Set(fontw)
        let neww = Array.from(w) // 去重
        let neww2 = neww.sort(function (a, b) { return a - b }) // 从小到大排列
        let truefontwidth = neww2[neww2.length - 1] - neww2[0] + 1

        let h = new Set(fonth)
        let newh = Array.from(h)// 去重
        let newh2 = newh.sort(function (a, b) { return a - b }) // 从小到大排列
        let truefontheight = newh2[newh2.length - 1] - newh2[0] + 1

        let returndata = {

          text: text,
          options: options,
          // eslint-disable-next-line standard/array-bracket-even-spacing
          offset: [newh2[0] - 0, morew - neww2[neww2.length - 1] - 1, moreh - newh2[newh2.length - 1] - 1, neww2[0] - 0 ], // [上右下左]
          fontTruewidth: truefontwidth,
          fontTrueheight: truefontheight,
          width: morew,
          height: moreh,
          url: dataUrl,
          lines: lines
        }
        let img = new Image()
        img.src = dataUrl
        img.onload = () => { resolve(returndata) }
      })
      return result
    },

    // 文本重新计算
    async retrunText (price) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(price.width)
        }, 200)
      })
    },
    // 保留小数 修正
    toFixed (num, digits = 0) {
      let zeroStrNum = num.toString()

      // 处理科学计算情况
      if (zeroStrNum.includes('e')) {
        const m = zeroStrNum.match(/\d(?:\.(\d*))?e([+-]\d+)/)
        zeroStrNum = num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
      }

      let isNegativeNum = false
      // 判断是否为负数
      if (zeroStrNum.startsWith('-')) {
        isNegativeNum = true
        zeroStrNum = zeroStrNum.slice(1)
      }
      // 获取小数点位置
      const dotIndex = zeroStrNum.indexOf('.')
      // 如果是整数/保留小数位数等于超过当前小数长度，则直接用toFixed返回
      if (dotIndex === -1 || (zeroStrNum.length - (dotIndex + 1) <= digits)) {
        return num.toFixed(digits)
      }

      // 找到需要进行四舍五入的部分
      let numArr = zeroStrNum.match(/\d/g) || []
      numArr = numArr.slice(0, dotIndex + digits + 1)

      // 核心处理逻辑
      if (parseInt(numArr[numArr.length - 1], 10) > 4) {
        // 如果最后一位大于4，则往前遍历+1
        for (let i = numArr.length - 2; i >= 0; i--) {
          numArr[i] = String(parseInt(numArr[i], 10) + 1)
          // 判断这位数字 +1 后会不会是 10
          if (numArr[i] === '10') {
            // 10的话处理一下变成 0，再次for循环，相当于给前面一个 +1
            numArr[i] = '0'
          } else {
            // 小于10的话，就打断循环，进位成功
            break
          }
        }
      }
      // 将小数点加入数据
      numArr.splice(dotIndex, 0, '.')

      // 处理多余位数
      numArr.pop()

      // 如果事负数，添加负号
      if (isNegativeNum) {
        numArr.unshift('-')
      }

      return Number(numArr.join('')).toFixed(digits)
    },
    // 加法计算的修正
    add (num1, num2) {
      // 将数字转换成字符串
      num1 = num1.toString()
      num2 = num2.toString()

      // 获取小数点的位置
      var index1 = num1.indexOf('.')
      var index2 = num2.indexOf('.')

      // 如果小数点存在，那么就再获取各自的小数位数
      var ws1 = 0
      var ws2 = 0
      if (index1 !== -1) {
        ws1 = num1.split('.')[1].length
      }
      if (index2 !== -1) {
        ws2 = num2.split('.')[1].length
      }

      // 看谁的小数位数大，谁的小数位数小

      var bigger = ws1 > ws2 ? ws1 : ws2
      var smaller = ws1 < ws2 ? ws1 : ws2

      // 计算得到需要补齐的的0的个数
      var zerosCount = bigger - smaller

      // 全部去除小数点
      num1 = num1.replace('.', '')
      num2 = num2.replace('.', '')

      // 比较num1 和num2的值谁比较大，比较方法是看谁是smaller,是smaller的一方就补0
      if (ws1 === smaller) {
        for (var i = 0; i < zerosCount; i++) {
          num1 += '0'
        }
      } else {
        for (let i = 0; i < zerosCount; i++) {
          num2 += '0'
        }
      }
      // 开始计算
      var sum = parseInt(num1) + parseInt(num2)

      // 根据较大的小数位数计算倍数
      var beishu = 1
      for (let i = 0; i < bigger; i++) {
        beishu = beishu * 10
      }
      sum = sum / beishu
      return sum
    },
    /**
     * text, 文本
     * roundingMode， 舍入模式   7：无  4：四舍五入 0：向上取整  1：向下取整
     * decimalDigit, 小数位数   0 - 5
     * decimalSeparator, 小数分隔符
     * thousandSeparator， 千分位分隔符
     */
    async priceformat (text, roundingMode, decimalDigit, decimalSeparator, thousandSeparator) {
      // if (!/^[0-9]+.?[0-9]*$/.test(text)) { // 判断是否是浮点数
      //   return null
      // }
      // console.log(text, roundingMode, decimalDigit, decimalSeparator, '千分位', thousandSeparator)
      let priceText = text
      let dotIndex = text.indexOf('.')
      // 如果是整数/保留小数位数等于超过当前小数长度，则直接用toFixed返回补0
      if (dotIndex === -1 || (text.length - (dotIndex + 1) <= decimalDigit)) {
        priceText = Number(text).toFixed(decimalDigit)
      }
      // 实际位数 > 小数位数需要位数时处理
      if (dotIndex > -1 && text.length - (dotIndex + 1) > decimalDigit) {
        priceText = ({
          7: () => { return text.substr(0, dotIndex + 1 + decimalDigit) }, // 直接截取
          4: () => { return Number(text).toFixed(decimalDigit) }, // 四舍五入 this.toFixed(priceText, decimalDigit)
          0: () => {
            if (Number(text.substr(dotIndex + 1, 1)) > 0) {
              let zero = 0
              let newadd = `${zero.toFixed(decimalDigit > 1 ? decimalDigit - 1 : 0)}1`
              return this.add(Number(text.substr(0, dotIndex + 1 + decimalDigit)), Number(newadd)).toFixed(decimalDigit)
            } else {
              return text.substr(0, dotIndex + 1 + decimalDigit)
            }
          }, // 向上取整
          1: () => { return text.substr(0, dotIndex + 1 + decimalDigit) } // 向下取整
        })[ roundingMode ]()
      }

      priceText = String(priceText)
      let textArry = priceText.indexOf('.') > -1 ? priceText.split('.') : [priceText]
      // 小数位确定
      let decimal = textArry[1] || null
      // 千分位分隔符添加
      let integer = textArry[0].replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
        return $1 + thousandSeparator
      })
      integer = String(integer)
      // 小数位分隔符添加
      priceText = decimalDigit > 0 ? String(`${integer}${decimalSeparator}${decimal}`) : String(`${integer}`)
      // console.warn(priceText, integer, decimal)
      return {
        priceText, integer, decimal
      }
    },
    // 价格组件文字改变样式 (decimalPlace === 2 ? 0 : (decimalPlace === 1 ? (decimalFontSize - res.fontTrueheight) / 2 : decimalFontSize - res.fontTrueheight)) < 0 ? (decimalPlace === 2 ? 0 : (decimalPlace === 1 ? (decimalFontSize - res.fontTrueheight) / 2 : decimalFontSize - res.fontTrueheight)) : 0
    async setTextStyle (group, index = 0, lastindex, options, fontTrueheight) {
      const {Place, FontSize, FontType, IfBold, IfItalic, IfUnderline, IfStrikeThrough, integerFontSize} = options
      let deltay = (Place === 2 || Place === 4 ? 0 : (Place === 1 ? (FontSize - fontTrueheight) / 2 : FontSize - fontTrueheight)) < 0 ? (Place === 2 || Place === 4 ? 0 : (Place === 1 ? (FontSize - fontTrueheight) / 2 : FontSize * (fontTrueheight / integerFontSize) - fontTrueheight)) : 0
      let styleOptions = {
        deltaY: deltay,
        fontSize: FontSize,
        fontFamily: FontType,
        fontWeight: IfBold === 1 ? 'bold' : 'normal' || 'normal',
        fontStyle: IfItalic === 2 ? 'italic' : 'normal' || 'normal',
        underline: IfUnderline === 1 ? true : false || false,
        linethrough: IfStrikeThrough === 1 ? true : false || false
      }
      await group.setSelectionStyles(styleOptions, index, lastindex)
      group.set({
        visible: false
      })
      this.canvas.requestRenderAll()
      this.canvas.renderAll()
      group.set({
        visible: true
      })
    },
    /**
     * 创建一个替代的数字组件 createPrice
     */
    async createPrice (options) {
      const {
        id,
        screenIndex,
        layer,
        left,
        top,
        width,
        height,
        angle,
        thousandSeparator,
        text,
        textColor,
        bgcolor,
        bgOpacity,
        decimalDigit,
        roundingMode,
        nopadding,
        gizp,
        stroke,
        strokeWidth,
        prefix,
        prefixIfBold,
        prefixIfItalic,
        prefixIfStrikeThrough,
        prefixIfUnderline,
        prefixFontType,
        prefixFontSize,
        prefixPlace,
        integerIfBold,
        integerIfItalic,
        integerIfStrikeThrough,
        integerIfUnderline,
        integerFontType,
        integerFontSize,
        decimalSeparator,
        dotIfBold,
        dotIfItalic,
        dotIfStrikeThrough,
        dotIfUnderline,
        dotFontType,
        dotFontSize,
        decimalIfBold,
        decimalIfItalic,
        decimalIfStrikeThrough,
        decimalIfUnderline,
        decimalFontType,
        decimalFontSize,
        decimalPlace,
        postfix,
        postfixIfBold,
        postfixIfItalic,
        postfixIfStrikeThrough,
        postfixIfUnderline,
        postfixFontType,
        postfixFontSize,
        postfixPlace,
        visible
      } = options
      console.log(nopadding, gizp, bgOpacity, bgcolor, stroke, strokeWidth, visible)
      // 分割价格
      const {priceText, integer, decimal} = await this.priceformat(text, roundingMode, decimalDigit, decimalSeparator, thousandSeparator)
      options = {
        ...options,
        priceText,
        integer,
        decimal
      }
      // 计算整数部分的文字高度
      let res = await this.getTextOffset('123456789', {
        width: width,
        height: height,
        fontFamily: integerFontType || '微软雅黑',
        fontSize: integerFontSize || 50,
        fontWeight: integerIfBold === 1 ? 'bold' : 'normal' || 'normal',
        fontStyle: integerIfItalic === 2 ? 'italic' : 'normal' || 'normal',
        underline: integerIfUnderline === 1 ? true : false || false,
        linethrough: integerIfStrikeThrough === 1 ? true : false || false
      })
      // 计算数字组件前半部分的样式
      let priceStyle = {0: {}}
      // 前缀样式
      for (let i = 0; i < prefix.length; i++) {
        priceStyle[0][i] = {
          deltaY: prefixPlace === 2 ? 0 : (prefixPlace === 1 ? (prefixFontSize - res.fontTrueheight) / 2 : prefixFontSize * (res.fontTrueheight / integerFontSize) - res.fontTrueheight),
          fontSize: prefixFontSize,
          fontFamily: prefixFontType,
          fontWeight: prefixIfBold === 1 ? 'bold' : 'normal' || 'normal',
          fontStyle: prefixIfItalic === 2 ? 'italic' : 'normal' || 'normal',
          underline: prefixIfUnderline === 1 ? true : false || false,
          linethrough: prefixIfStrikeThrough === 1 ? true : false || false
        }
      }
      if (decimalDigit > 0) {
        // 小数点样式
        for (let i = prefix.length + integer.length; i < prefix.length + integer.length + decimalSeparator.length; i++) {
          priceStyle[0][i] = {
            deltaY: 0,
            fontSize: dotFontSize,
            fontFamily: dotFontType,
            fontWeight: dotIfBold === 1 ? 'bold' : 'normal' || 'normal',
            fontStyle: dotIfItalic === 2 ? 'italic' : 'normal' || 'normal',
            underline: dotIfUnderline === 1 ? true : false || false,
            linethrough: dotIfStrikeThrough === 1 ? true : false || false
          }
        }
        // 小数样式(decimalPlace === 2 ? 0 : (decimalPlace === 1 ? (decimalFontSize - res.fontTrueheight) / 2 : decimalFontSize - res.fontTrueheight)) < 0 ? (decimalPlace === 2 ? 0 : (decimalPlace === 1 ? (decimalFontSize - res.fontTrueheight) / 2 : decimalFontSize * (res.fontTrueheight / integerFontSize) - res.fontTrueheight)) : 0
        for (let i = prefix.length + integer.length + decimalSeparator.length; i < prefix.length + integer.length + decimalSeparator.length + decimal.length; i++) {
          priceStyle[0][i] = {
            deltaY: decimalPlace === 2 ? 0 : decimalFontSize * (res.fontTrueheight / integerFontSize) - res.fontTrueheight,
            fontSize: decimalFontSize,
            fontFamily: decimalFontType,
            fontWeight: decimalIfBold === 1 ? 'bold' : 'normal' || 'normal',
            fontStyle: decimalIfItalic === 2 ? 'italic' : 'normal' || 'normal',
            underline: decimalIfUnderline === 1 ? true : false || false,
            linethrough: decimalIfStrikeThrough === 1 ? true : false || false
          }
        }
      }
      // eslint-disable-next-line no-undef
      let price = new fabric.IText(prefix + priceText, {
        fill: textColor,
        fontSize: integerFontSize,
        fontFamily: integerFontType,
        prefix: prefix,
        postfix: postfix,
        decimalSeparator: decimalSeparator,
        thousandSeparator: thousandSeparator,
        fontWeight: integerIfBold === 1 ? 'bold' : 'normal' || 'normal',
        fontStyle: integerIfItalic === 2 ? 'italic' : 'normal' || 'normal',
        underline: integerIfUnderline === 1 ? true : false || false,
        linethrough: integerIfStrikeThrough === 1 ? true : false || false,
        styles: priceStyle,
        charSpacing: 0,
        isType: 'NewPriceInteger',
        originX: 'left',
        originY: 'top',
        scaleX: 1,
        scaleY: 1,
        splitByGrapheme: false,
        flipX: false,
        flipY: false,
        selectable: false,
        visible: true,
        evented: true
      })
      // 后缀
      let postfixStyle = {0: {}}
      // 后缀的位置  上：0  中：1  下：2 小数上：3 小数下：4
      let deltaY = ({
        0: () => { return postfixFontSize * (res.fontTrueheight / integerFontSize) - res.fontTrueheight },
        1: () => { return (postfixFontSize * (res.fontTrueheight / integerFontSize) - res.fontTrueheight) / 2 },
        2: () => { return 0 },
        3: () => { return postfixFontSize * (res.fontTrueheight / integerFontSize) - res.fontTrueheight },
        4: () => { return 0 }
      })[ postfixPlace || 0 ]()
      // 后缀相对价格组件的位置
      let postfixLeft = ({
        0: () => { return price.width },
        1: () => { return price.width },
        2: () => { return price.width },
        3: () => { return price.__charBounds[0][prefix.length + integer.length + decimalSeparator.length].left },
        4: () => { return price.__charBounds[0][prefix.length + integer.length + decimalSeparator.length].left }
      })[ postfixPlace || 0 ]()
      for (let i = 0; i < postfix.length; i++) {
        postfixStyle[0][i] = {
          deltaY: deltaY,
          fontSize: postfixFontSize,
          fontFamily: postfixFontType,
          fontWeight: postfixIfBold === 1 ? 'bold' : 'normal' || 'normal',
          fontStyle: postfixIfItalic === 2 ? 'italic' : 'normal' || 'normal',
          underline: postfixIfUnderline === 1 ? true : false || false,
          linethrough: postfixIfStrikeThrough === 1 ? true : false || false
        }
      }
      // 后缀的组件
      // eslint-disable-next-line no-undef
      let postfixdom = new fabric.IText(postfix + ' ', {
        fill: textColor,
        fontSize: integerFontSize,
        fontFamily: postfixFontType,
        originX: 'left',
        originY: 'top',
        left: postfixLeft,
        top: 0,
        scaleX: 1,
        scaleY: 1,
        isType: 'NewPricePostfix',
        styles: postfixStyle,
        prefix: prefix,
        postfix: postfix,
        decimalSeparator: '.',
        charSpacing: 0,
        splitByGrapheme: false,
        flipX: false,
        flipY: false,
        selectable: false,
        visible: true,
        evented: false
      })
      // 后缀空格
      postfixdom.setSelectionStyles({
        deltaY: 0,
        fontSize: integerFontSize,
        fontFamily: postfixFontType,
        fontWeight: 'normal',
        fontStyle: 'normal',
        underline: false,
        linethrough: false
      }, postfix.length, postfix.length + 1)
      // 背景颜色矩形
      // eslint-disable-next-line no-undef
      let Rect = new fabric.Rect({
        width: width - strokeWidth,
        height: height - strokeWidth,
        fill: bgcolor,
        scaleX: 1,
        scaleY: 1,
        isType: 'NewPriceRect',
        originX: 'center',
        originY: 'center',
        visible: true,
        splitByGrapheme: false,
        flipX: false,
        flipY: false,
        selectable: false,
        evented: false
      })
      // eslint-disable-next-line no-undef
      let priceGroup = new fabric.Group([price, postfixdom], {
        isType: 'NewPriceGroup',
        component: 'component',
        originX: 'left',
        originY: 'top',
        fill: '#f0f',
        id: id,
        textImg: res,
        options: options,
        textStyle: options,
        visible: true

      })
      // eslint-disable-next-line no-undef
      let group = new fabric.Group([Rect], {
        isType: 'Price',
        component: 'component',
        originX: 'left',
        originY: 'top',
        fill: '#f0f',
        id: id,
        layer: layer,
        zIndex: layer,
        left: left,
        top: top,
        textImg: res,
        options: options,
        textStyle: options,
        angle: angle,
        screenIndex: screenIndex,
        visible: true

      })
      const {newleft, newtop} = this.countPriceposition(Rect, priceGroup, options)
      priceGroup.set({
        left: newleft,
        top: newtop
      })
      group.add(priceGroup)
      group.clipPath = Rect

      let _this = this
      group.on('scaling', async function (e) {
        group.item(1).set({
          visible: false
        })
      })
      group.on('scaled', async function (e) {
        group.item(1).set({
          visible: true
        })
        let groupwidth = (e.target.width * e.target.scaleX)
        let groupheight = (e.target.height * e.target.scaleY)
        group.set('width', groupwidth)
        group.set('height', groupheight)
        group.set('scaleX', 1)
        group.set('scaleY', 1)
        group.options.width = groupwidth
        group.options.height = groupheight

        let Rect = group.item(0)
        let priceGroup = group.item(1)
        let options = group.options

        Rect.set({
          width: groupwidth,
          height: groupheight
        })

        const {newleft, newtop} = _this.countPriceposition(Rect, priceGroup, options)
        priceGroup.set({
          left: newleft,
          top: newtop
        })
      })

      return group
    },
    // (新)计算文本位置
    countPriceposition (Rect, priceGroup, options) {
      const { horizontalAlign, verticalAlign } = options
      // console.log('位置定位：', horizontalAlign, verticalAlign)
      // 文本域的宽度
      let textWidth = priceGroup.width * priceGroup.scaleX
      let textHeight = priceGroup.height * priceGroup.scaleY
      let rectWidth = Rect.width * Rect.scaleX
      let rectHeight = Rect.height * Rect.scaleY
      // 字典格式
      var newleft = ({
        0: () => { return -rectWidth / 2 },
        1: () => { return -textWidth / 2 },
        2: () => { return rectWidth / 2 - textWidth }
      })[ horizontalAlign || 0 ]()

      let newtop = ({
        0: () => { return -rectHeight / 2 },
        1: () => { return -textHeight / 2 },
        2: () => { return rectHeight / 2 - textHeight }
      })[ verticalAlign || 0 ]()
      return {
        newleft, newtop
      }
    },
    // 修改数字组件内容 (改变形状的部分)
    async changePriceValue (group, options) {
      let canvas = this.canvas
      let priceGroup = group.item(1)
      // console.log(group, options)
      // 分割价格
      const {priceText, integer, decimal} = await this.priceformat(options.text, options.roundingMode, options.decimalDigit, options.decimalSeparator, options.thousandSeparator)
      options = {
        ...options,
        priceText,
        integer,
        decimal
      }
      // 计算整数部分的文字高度
      const {integerFontType, integerFontSize, integerIfBold, integerIfItalic, integerIfUnderline, integerIfStrikeThrough} = options
      let res = await this.getTextOffset('123456789', {
        width: integerFontSize * 2,
        height: integerFontSize * 2,
        fontFamily: integerFontType || '微软雅黑',
        fontSize: integerFontSize || 50,
        fontWeight: integerIfBold === 1 ? 'bold' : 'normal' || 'normal',
        fontStyle: integerIfItalic === 2 ? 'italic' : 'normal' || 'normal',
        underline: integerIfUnderline === 1 ? true : false || false,
        linethrough: integerIfStrikeThrough === 1 ? true : false || false
      })
      group.set({
        textImg: res,
        options: options,
        textStyle: options
      })
      // 计算数字组件前半部分的样式
      const {prefix, prefixPlace, prefixFontType, prefixFontSize, prefixIfBold, prefixIfItalic, prefixIfUnderline, prefixIfStrikeThrough} = options
      let priceStyle = {0: {}}
      // 前缀样式
      for (let i = 0; i < prefix.length; i++) {
        priceStyle[0][i] = {
          deltaY: prefixPlace === 2 ? 0 : (prefixPlace === 1 ? (prefixFontSize - res.fontTrueheight) / 2 : prefixFontSize * (res.fontTrueheight / integerFontSize) - res.fontTrueheight),
          fontSize: prefixFontSize,
          fontFamily: prefixFontType,
          fontWeight: prefixIfBold === 1 ? 'bold' : 'normal' || 'normal',
          fontStyle: prefixIfItalic === 2 ? 'italic' : 'normal' || 'normal',
          underline: prefixIfUnderline === 1 ? true : false || false,
          linethrough: prefixIfStrikeThrough === 1 ? true : false || false
        }
      }
      const {decimalDigit, decimalSeparator, dotFontType, dotFontSize, dotIfBold, dotIfItalic, dotIfUnderline, dotIfStrikeThrough} = options
      if (decimalDigit > 0) {
        // 小数点样式
        console.log('小数点样式', prefix.length, integer.length)
        for (let i = prefix.length + integer.length; i < prefix.length + integer.length + decimalSeparator.length; i++) {
          priceStyle[0][i] = {
            deltaY: 0,
            fontSize: dotFontSize,
            fontFamily: dotFontType,
            fontWeight: dotIfBold === 1 ? 'bold' : 'normal' || 'normal',
            fontStyle: dotIfItalic === 2 ? 'italic' : 'normal' || 'normal',
            underline: dotIfUnderline === 1 ? true : false || false,
            linethrough: dotIfStrikeThrough === 1 ? true : false || false
          }
        }
        const {decimalPlace, decimalFontType, decimalFontSize, decimalIfBold, decimalIfItalic, decimalIfUnderline, decimalIfStrikeThrough} = options
        // 小数样式
        for (let i = prefix.length + integer.length + decimalSeparator.length; i < prefix.length + integer.length + decimalSeparator.length + decimal.length; i++) {
          priceStyle[0][i] = {
            deltaY: decimalPlace === 2 ? 0 : decimalFontSize * (res.fontTrueheight / integerFontSize) - res.fontTrueheight,
            fontSize: decimalFontSize,
            fontFamily: decimalFontType,
            fontWeight: decimalIfBold === 1 ? 'bold' : 'normal' || 'normal',
            fontStyle: decimalIfItalic === 2 ? 'italic' : 'normal' || 'normal',
            underline: decimalIfUnderline === 1 ? true : false || false,
            linethrough: decimalIfStrikeThrough === 1 ? true : false || false
          }
        }
      }
      // 文本修改样式
      const {textColor, postfix, thousandSeparator} = options
      let newPrice = priceGroup.item(0)
      newPrice.set({
        fill: textColor,
        text: prefix + integer + decimalSeparator + decimal,
        fontSize: integerFontSize,
        fontFamily: integerFontType,
        prefix: prefix,
        postfix: postfix,
        decimalSeparator: decimalSeparator,
        thousandSeparator: thousandSeparator,
        fontWeight: integerIfBold === 1 ? 'bold' : 'normal' || 'normal',
        fontStyle: integerIfItalic === 2 ? 'italic' : 'normal' || 'normal',
        underline: integerIfUnderline === 1 ? true : false || false,
        linethrough: integerIfStrikeThrough === 1 ? true : false || false
      })
      newPrice.set({
        styles: priceStyle
      })
      // 后缀
      const {postfixPlace, postfixFontType, postfixFontSize, postfixIfBold, postfixIfItalic, postfixIfUnderline, postfixIfStrikeThrough} = options
      let postfixStyle = {0: {}}
      // 后缀的位置  上：0  中：1  下：2 小数上：3 小数下：4
      let deltaY = ({
        0: () => { return postfixFontSize * (res.fontTrueheight / integerFontSize) - res.fontTrueheight },
        1: () => { return (postfixFontSize * (res.fontTrueheight / integerFontSize) - res.fontTrueheight) / 2 },
        2: () => { return 0 },
        3: () => { return postfixFontSize * (res.fontTrueheight / integerFontSize) - res.fontTrueheight },
        4: () => { return 0 }
      })[ postfixPlace || 0 ]()
      // 后缀相对价格组件的位置
      let postfixLeft = ({
        0: () => { return newPrice.width },
        1: () => { return newPrice.width },
        2: () => { return newPrice.width },
        3: () => { return newPrice.__charBounds[0][prefix.length + integer.length + decimalSeparator.length].left },
        4: () => { return newPrice.__charBounds[0][prefix.length + integer.length + decimalSeparator.length].left }
      })[ postfixPlace || 0 ]()
      for (let i = 0; i < postfix.length; i++) {
        postfixStyle[0][i] = {
          deltaY: deltaY,
          fontSize: postfixFontSize,
          fontFamily: postfixFontType,
          fontWeight: postfixIfBold === 1 ? 'bold' : 'normal' || 'normal',
          fontStyle: postfixIfItalic === 2 ? 'italic' : 'normal' || 'normal',
          underline: postfixIfUnderline === 1 ? true : false || false,
          linethrough: postfixIfStrikeThrough === 1 ? true : false || false
        }
      }
      let newPost = priceGroup.item(1)
      newPost.set({
        fill: textColor,
        text: postfix + ' ',
        fontSize: 10,
        fontFamily: postfixFontType,
        originX: 'left',
        originY: 'top',
        left: newPrice.left + postfixLeft,
        top: newPrice.top,
        scaleX: 1,
        prefix: prefix,
        postfix: postfix
      })
      newPost.set({
        styles: postfixStyle
      })
      // 后缀空格
      newPost.setSelectionStyles({
        deltaY: 0,
        fontSize: integerFontSize,
        fontFamily: postfixFontType,
        fontWeight: 'normal',
        fontStyle: 'normal',
        underline: false,
        linethrough: false
      }, postfix.length, postfix.length + 1)
      // 价格文本重组
      const {id} = options
      // eslint-disable-next-line no-undef
      let newPriceGroup = new fabric.Group([newPrice, newPost], {
        isType: 'NewPriceGroup',
        component: 'component',
        originX: 'left',
        originY: 'top',
        fill: '#f0f',
        id: id,
        textImg: res,
        options: options,
        textStyle: options,
        visible: true
      })
      console.log(newPriceGroup)
      // 定位位置
      const {newleft, newtop} = this.countPriceposition(group.item(0), newPriceGroup, group.options)
      newPriceGroup.set({
        left: newleft,
        top: newtop
      })
      // 删除价格
      group.remove(priceGroup)
      // 添加新价格
      group.add(newPriceGroup)
      canvas.renderAll()
    },
    // 修改价格组件
    async setPrice (group, name, value) {
      let canvas = this.canvas
      // console.error(group, name, value)
      const {prefix, prefixIfBold, prefixIfItalic, prefixIfStrikeThrough, prefixIfUnderline, prefixFontType, prefixFontSize, prefixPlace, integerFontSize,
        integerFontType, integerIfBold, integer, integerIfItalic, integerIfStrikeThrough,
        postfix, postfixIfBold, postfixIfItalic, postfixIfStrikeThrough, postfixIfUnderline, postfixFontType, postfixFontSize, postfixPlace} = group.textStyle

      switch (name) {
        case 'content':
          group.options.content = value
          group.options.text = value
          this.changePriceValue(group, group.options)
          break
        case 'textColor':
          group.textStyle.textColor = value
          group.options.textColor = value
          group.item(1).item(0).set({
            fill: value
          })
          group.item(1).item(1).set({
            fill: value
          })
          break
        case 'bgcolor':
          group.textStyle.bgcolor = value
          group.options.bgcolor = value
          group.item(0).set({
            fill: value
          })
          break

        case 'horizontalAlign':
          group.textStyle.horizontalAlign = Number(value)
          group.options.horizontalAlign = Number(value)
          // 定位位置
          let {newleft, newtop} = this.countPriceposition(group.item(0), group.item(1), group.options)
          group.item(1).set({
            left: newleft,
            top: newtop
          })
          break
        case 'verticalAlign':
          group.textStyle.verticalAlign = Number(value)
          group.options.verticalAlign = Number(value)
          // 定位位置
          let {newleft: nleft, newtop: ntop} = this.countPriceposition(group.item(0), group.item(1), group.options)
          group.item(1).set({
            left: nleft,
            top: ntop
          })
          break
        case 'width':
          console.log(group)
          group.options[name] = Number(value)
          group.textStyle[name] = Number(value)
          // 缩放的形式改group
          group.set({
            scaleX: value / group.item(0).width
          })
          setTimeout(() => {
            group.set({
              width: group.width * group.scaleX,
              scaleX: 1
            })
            group.item(0).set({
              width: group.width * group.scaleX,
              scaleX: 1
            })
            // 定位位置
            let {newleft: nwleft, newtop: nwtop} = this.countPriceposition(group.item(0), group.item(1), group.options)
            group.item(1).set({
              scaleX: 1,
              left: nwleft,
              top: nwtop
            })
            canvas.renderAll()
          }, 1)
          break
        case 'height':
          group.options[name] = Number(value)
          group.textStyle[name] = Number(value)
          // 缩放的形式改group
          group.set({
            scaleY: value / group.item(0).height
          })
          setTimeout(() => {
            group.set({
              height: group.height * group.scaleY,
              scaleY: 1
            })
            group.item(0).set({
              height: group.height * group.scaleY,
              scaleY: 1
            })
            // 定位位置
            let {newleft: nwleft, newtop: nwtop} = this.countPriceposition(group.item(0), group.item(1), group.options)
            group.item(1).set({
              scaleY: 1,
              left: nwleft,
              top: nwtop
            })
            canvas.renderAll()
          }, 1)
          break
        case 'angle':
          group.options.angle = Number(value)
          group.textStyle[name] = Number(value)
          group.set({
            angle: value
          })
          break
        case 'prefix':
          group.options[name] = value
          group.textStyle[name] = value
          this.changePriceValue(group, group.options)
          break
        case 'postfix':
          group.options[name] = value
          group.textStyle[name] = value
          this.changePriceValue(group, group.options)
          break
        case 'thousandSeparator':
          group.options[name] = value
          group.textStyle[name] = value
          this.changePriceValue(group, group.options)
          break
        case 'decimalSeparator':
          group.options[name] = value
          group.textStyle[name] = value
          this.changePriceValue(group, group.options)
          break

        case 'prefixIfBold':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          this.changePriceValue(group, group.options)
          break
        case 'prefixIfItalic':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          await this.setTextStyle(group.item(1).item(0), 0, prefix.length, {
            Place: prefixPlace,
            FontSize: prefixFontSize,
            FontType: prefixFontType,
            IfBold: prefixIfBold,
            IfItalic: Number(value),
            IfUnderline: prefixIfUnderline,
            IfStrikeThrough: prefixIfStrikeThrough,
            integerFontSize: integerFontSize
          }, group.textImg.fontTrueheight)
          break
        case 'prefixIfStrikeThrough':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          await this.setTextStyle(group.item(1).item(0), 0, prefix.length, {
            Place: prefixPlace,
            FontSize: prefixFontSize,
            FontType: prefixFontType,
            IfBold: prefixIfBold,
            IfItalic: prefixIfItalic,
            IfUnderline: prefixIfUnderline,
            IfStrikeThrough: Number(value),
            integerFontSize: integerFontSize
          }, group.textImg.fontTrueheight)
          break
        case 'prefixIfUnderline':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          await this.setTextStyle(group.item(1).item(0), 0, prefix.length, {
            Place: prefixPlace,
            FontSize: prefixFontSize,
            FontType: prefixFontType,
            IfBold: prefixIfBold,
            IfItalic: prefixIfItalic,
            IfUnderline: Number(value),
            IfStrikeThrough: prefixIfStrikeThrough,
            integerFontSize: integerFontSize
          }, group.textImg.fontTrueheight)
          break
        case 'prefixFontType':
          group.textStyle[name] = value
          group.options[name] = value
          await this.setTextStyle(group.item(1).item(0), 0, prefix.length, {
            Place: prefixPlace,
            FontSize: prefixFontSize,
            FontType: value,
            IfBold: prefixIfBold,
            IfItalic: prefixIfItalic,
            IfUnderline: prefixIfUnderline,
            IfStrikeThrough: prefixIfStrikeThrough,
            integerFontSize: integerFontSize
          }, group.textImg.fontTrueheight)
          break
        case 'prefixFontSize':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          this.changePriceValue(group, group.options)
          break
        case 'prefixPlace':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          await this.setTextStyle(group.item(1).item(0), 0, prefix.length, {
            Place: Number(value),
            FontSize: prefixFontSize,
            FontType: prefixFontType,
            IfBold: prefixIfBold,
            IfItalic: prefixIfItalic,
            IfUnderline: prefixIfUnderline,
            IfStrikeThrough: prefixIfStrikeThrough,
            integerFontSize: integerFontSize
          }, group.textImg.fontTrueheight)
          break

        case 'integerIfBold':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          this.changePriceValue(group, group.options)
          break
        case 'integerIfItalic':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          this.changePriceValue(group, group.options)
          break
        case 'integerIfStrikeThrough':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          this.changePriceValue(group, group.options)
          break
        case 'integerIfUnderline':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          // this.changePriceValue(group, group.options)
          await this.setTextStyle(group.item(1).item(0), prefix.length, prefix.length + integer.length, {
            Place: 0,
            FontSize: integerFontSize,
            FontType: integerFontType,
            IfBold: integerIfBold,
            IfItalic: integerIfItalic,
            IfUnderline: Number(value),
            IfStrikeThrough: integerIfStrikeThrough
          }, group.textImg.fontTrueheight)
          break
        case 'integerFontType':
          group.textStyle[name] = value
          group.options[name] = value
          this.changePriceValue(group, group.options)
          break
        case 'integerFontSize':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          let options = {
            'integerFontSize': Number(value)
          }
          if (group.options.prefixFontSize > Number(value)) {
            group.textStyle.prefixFontSize = Number(value)
            group.options.prefixFontSize = Number(value)
            options['prefixFontSize'] = Number(value)
          }
          if (group.options.dotFontSize > Number(value)) {
            group.textStyle.dotFontSize = Number(value)
            group.options.dotFontSize = Number(value)
            options['dotFontSize'] = Number(value)
          }
          if (group.options.decimalFontSize > Number(value)) {
            group.textStyle.decimalFontSize = Number(value)
            group.options.decimalFontSize = Number(value)
            options['decimalFontSize'] = Number(value)
          }
          if (group.options.postfixFontSize > Number(value)) {
            group.textStyle.postfixFontSize = Number(value)
            group.options.postfixFontSize = Number(value)
            options['postfixFontSize'] = Number(value)
          }
          this.changePriceValue(group, group.options)
          break

        case 'dotIfBold':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          this.changePriceValue(group, group.options)
          break
        case 'dotIfItalic':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          this.changePriceValue(group, group.options)
          break
        case 'dotFontType':
          group.textStyle[name] = value
          group.options[name] = value
          this.changePriceValue(group, group.options)
          break
        case 'dotFontSize':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          this.changePriceValue(group, group.options)
          break

        case 'decimalPlace':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          this.changePriceValue(group, group.options)
          break
        case 'decimalIfBold':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          this.changePriceValue(group, group.options)
          break
        case 'decimalIfItalic':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          this.changePriceValue(group, group.options)
          break
        case 'decimalIfUnderline':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          this.changePriceValue(group, group.options)
          break
        case 'decimalIfStrikeThrough':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          this.changePriceValue(group, group.options)
          break
        case 'decimalFontType':
          group.textStyle[name] = value
          group.options[name] = value
          this.changePriceValue(group, group.options)
          break
        case 'decimalFontSize':
          group.textStyle[name] = value
          group.options[name] = value
          this.changePriceValue(group, group.options)
          break

        case 'postfixIfBold':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          this.changePriceValue(group, group.options)
          break
        case 'postfixIfItalic':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          await this.setTextStyle(group.item(1).item(1), 0, postfix.length, {
            Place: postfixPlace,
            FontSize: postfixFontSize,
            FontType: postfixFontType,
            IfBold: postfixIfBold,
            IfItalic: Number(value),
            IfUnderline: postfixIfUnderline,
            IfStrikeThrough: postfixIfStrikeThrough,
            integerFontSize: integerFontSize
          }, group.textImg.fontTrueheight)
          break
        case 'postfixIfStrikeThrough':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          await this.setTextStyle(group.item(1).item(1), 0, postfix.length, {
            Place: postfixPlace,
            FontSize: postfixFontSize,
            FontType: postfixFontType,
            IfBold: postfixIfBold,
            IfItalic: postfixIfItalic,
            IfUnderline: postfixIfUnderline,
            IfStrikeThrough: Number(value),
            integerFontSize: integerFontSize
          }, group.textImg.fontTrueheight)
          break
        case 'postfixIfUnderline':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          await this.setTextStyle(group.item(1).item(1), 0, postfix.length, {
            Place: postfixPlace,
            FontSize: postfixFontSize,
            FontType: postfixFontType,
            IfBold: postfixIfBold,
            IfItalic: postfixIfItalic,
            IfUnderline: Number(value),
            IfStrikeThrough: postfixIfStrikeThrough,
            integerFontSize: integerFontSize
          }, group.textImg.fontTrueheight)
          break
        case 'postfixFontType':
          group.textStyle[name] = value
          group.options[name] = value
          this.changePriceValue(group, group.options)
          break
        case 'postfixFontSize':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          this.changePriceValue(group, group.options)
          break
        case 'postfixPlace':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          this.changePriceValue(group, group.options)
          break

        case 'decimalDigit':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          this.changePriceValue(group, group.options)
          break
        case 'roundingMode':
          group.textStyle[name] = Number(value)
          group.options[name] = Number(value)
          this.changePriceValue(group, group.options)
          break
        default:
          console.log(name, value)
      }
      this.canvas.requestRenderAll()
      this.canvas.renderAll()
    },

    // 辅助线
    showCloseGuideline (bol) {
      let canvas = this.canvas
      this.canvas.showGuideline = bol
      // 初始化辅助线(辅助-对齐线)
      initAligningGuidelines(canvas)
    },

    // 标尺
    showCloseRuler (bol) {
      let canvas = this.canvas
      this.canvas.showRule = bol
      //  初始化标尺(辅助-标尺)
      initFabricRuler.drawfabricRuler(canvas)
    },

    /**
     * 创建文本矩形组件 createNewText ----------------------------------------------------------------------------------------------------
     * options {}
     */
    async createNewText (options) {
      // let canvas = this.canvas
      // eslint-disable-next-line no-undef
      const rect = new fabric.Rect({
        isType: 'NewText-rect',
        id: options.id,
        options: options,
        component: 'component',
        width: parseInt(options.width * options.scaleX),
        height: parseInt(options.height * options.scaleY),

        stroke: options.stroke || 'rgba(0,0,0,0)', // 边框颜色
        strokeWidth: options.strokeWidth || 0, // 边框宽度
        strokeDashArray: [0, 0],
        fill: options.backColor || ''
      })

      // console.log('options', options)
      let textoptions = {
        ...options,
        id: options.id,
        options: options,
        textdemo: options.textdemo,
        component: 'component',
        strokeWidth: 0,
        angle: 0,
        stroke: options.stroke ? options.stroke : '#000000',
        left: options.left,
        top: options.top,
        // width: options.width,
        height: options.height,
        // padding: options.strokeWidth || 0,
        width: parseInt(options.width * options.scaleX - options.strokeWidth),

        fontFamily: options.fontFamily || '微软雅黑',
        fill: options.fontColor || '#ffffff',
        fillColor: options.color || '#ffffff',
        fontSize: options.fontSize || 12,
        fontStyle: options.fontStyle || 'normal',
        fontWeight: options.fontWeight || 'normal',
        linethrough: options.linethrough || false,
        underline: options.underline || false,

        scaleX: 1,
        scaleY: 1,

        isElasticSize: options.isElasticSize ? options.isElasticSize : 0, // textAdvanceProperty
        lineHeight: parseInt((options.fontSize + options.verticalSpace) / options.fontSize),
        originX: 'left',
        originY: 'top',
        isType: 'NewText-text',
        splitByGrapheme: true,
        selectable: true,
        evented: false
      }
      // 2:自适应  0，1：正常 弹性
      let text = ({
        0: () => {
          // eslint-disable-next-line no-undef
          let textbox = new fabric.TextboxNew(options.textdemo, {...textoptions})
          let text = this.newtextStyleFormat(textbox, options.textdemo)
          textbox.text = text
          return textbox
        },
        1: () => {
          // eslint-disable-next-line no-undef
          let textbox = new fabric.TextboxNew(options.textdemo, {...textoptions})
          let text = this.newtextStyleFormat(textbox, options.textdemo)
          textbox.text = text
          return textbox
        },
        2: () => {
          // eslint-disable-next-line no-undef
          let textbox = new fabric.Textbox(options.textdemo, {...textoptions,
            width: parseInt(options.width * options.scaleX - options.strokeWidth),
            lineHeight: 1,
            splitByGrapheme: false
          })
          return textbox
        }
      })[ options.isElasticSize || 0 ]()

      // eslint-disable-next-line no-undef
      let group = new fabric.Group([rect], {
        isType: 'NewText',
        component: 'component',
        originX: 'left',
        originY: 'top',
        angle: options.angle,
        id: options.id,

        stroke: options.stroke || 'rgba(0,0,0,0)', // 边框颜色
        strokeWidth: 0, // 边框宽度
        strokeDashArray: [0, 0],

        layer: options.layer,
        zIndex: options.layer,
        width: options.width + options.strokeWidth,
        height: options.height + options.strokeWidth,
        left: options.left,
        top: options.top,
        options: options,
        screenIndex: options.screenIndex,
        visible: true

      })
      if (options.isElasticSize === 2) {
        text.set({
          scaleX: parseInt(options.width * options.scaleX - options.strokeWidth) / text.getLineWidth(0), // 文本的实际宽度
          scaleY: parseInt(options.height * options.scaleY - options.strokeWidth) / text.height,
          left: -(options.width * options.scaleX + options.strokeWidth) / 2 + options.strokeWidth,
          top: -(options.height * options.scaleY + options.strokeWidth) / 2 + options.strokeWidth
        })
      } else {
        text.set({
          width: parseInt(options.width * options.scaleX - options.strokeWidth),
          height: parseInt(options.height * options.scaleY - options.strokeWidth),
          left: -(options.width * options.scaleX + options.strokeWidth) / 2 + options.strokeWidth,
          top: -(options.height * options.scaleY + options.strokeWidth) / 2 + options.strokeWidth
        })
      }
      group.add(text)
      group.item(1).set({
        height: parseInt(options.height * options.scaleY - options.strokeWidth)
      })
      group.setControlsVisibility({
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
      group.on('scaling', async (e) => {
        this.textRectScaling(group)
      })
      group.on('scaled', async (e) => {
        this.textRectScaled(group)
      })
      group.on('rotated', async (e) => {
        this.textRectrotated(e)
      })
      group.on('mousedblclick', () => {
        this.textRectMousedbclick(group)
      })
      group.item(1).on('editing:entered', (e) => {
        this.textRectentered(group)
      })
      group.item(1).on('editing:exited', (e) => {
        this.textRectexited(group)
      })

      return group
    },
    // 文本缩放ing
    textRectScaling (group) {
      let groupwidth = (group.width * group.scaleX)
      let groupheight = (group.height * group.scaleY)
      if (group.options.isElasticSize !== 2) {
        group.item(1).set({
          width: groupwidth - 2 * group.options.strokeWidth * group.scaleX,
          height: groupheight - 2 * group.options.strokeWidth * group.scaleY,
          scaleX: 1 / group.scaleX,
          scaleY: 1 / group.scaleY
        })
        group.item(1).set({
          // visible: false
          height: parseInt(group.height * group.scaleY - 2 * group.options.strokeWidth * group.scaleY)
        })
      }
    },
    // 文本缩放ed
    textRectScaled (group) {
      let groupwidth = (group.width * group.scaleX)
      let groupheight = (group.height * group.scaleY)
      group.set({
        scaleX: 1,
        scaleY: 1
      })
      group.set({
        width: groupwidth,
        height: groupheight
      })

      group.item(0).set({
        width: groupwidth - group.options.strokeWidth,
        height: groupheight - group.options.strokeWidth
      })

      if (group.options.isElasticSize !== 2) {
        group.item(1).set({
          visible: true,
          scaleX: 1,
          scaleY: 1,
          left: -groupwidth / 2 + group.options.strokeWidth,
          top: -groupheight / 2 + group.options.strokeWidth,
          width: groupwidth - 2 * group.options.strokeWidth,
          height: parseInt(group.height * group.scaleY - 2 * group.options.strokeWidth)
        })
        let newtext = this.newtextStyleFormat(group.item(1), group.item(1).textdemo) // 文字 格式化
        group.item(1).set('text', newtext)
        group.item(1).set({
          height: parseInt(group.height * group.scaleY - 2 * group.options.strokeWidth)
        })
      } else {
        group.item(1).set({
          scaleX: parseInt(groupwidth - 2 * group.options.strokeWidth) / group.item(1).getLineWidth(0),
          left: -(groupwidth) / 2 + group.options.strokeWidth
        })
        group.item(1).set({
          scaleY: parseInt(group.height * group.scaleY - 2 * group.options.strokeWidth) / (group.item(1).aCoords.bl.y - group.item(1).aCoords.tl.y),
          top: -(groupheight) / 2 + group.options.strokeWidth
        })
      }
    },
    // 文本旋转
    textRectrotated (e) {
      let group = e.target
      group.set({
        options: {...group.options, angle: e.transform.target.angle}
      })
    },
    // 文本双击
    textRectMousedbclick (group) {
      group.set({
        angle: 0
      })
      // console.log('双击进入')
      let canvas = this.canvas
      var destroyedGroup = group.destroy()
      var items = destroyedGroup.getObjects()

      items.forEach(function (item) {
        canvas.add(item)
      })
      this.canvas.remove(group)
      this.canvas.setActiveObject(items[1])

      items[0].set({
        options: destroyedGroup.options
      })
      if (destroyedGroup.options.isElasticSize !== 2) {
        items[1].set({
          text: items[1].textdemo,
          evented: true
        })
      } else {
        items[1].set({
          text: items[1].textdemo,
          scaleX: 1,
          scaleY: 1
        })
        items[1].set({
          Width: items[0].width - destroyedGroup.options.strokeWidth,
          splitByGrapheme: true,
          evented: true,
          selected: true
        })
      }
      canvas.requestRenderAll()
      items[1].enterEditing()
    },
    // 文本进入编辑
    textRectentered (group) {
      // console.log('进入编辑', group.item(1).splitByGrapheme, group.item(1).width, group.item(0).width - group.options.strokeWidth)
      group.item(1).set({
        width: group.item(0).width - group.options.strokeWidth
      })
      group.item(1)._splitText()

      group.item(1).setSelectionStart(0)
      group.item(1).setSelectionEnd(group.item(1).textdemo.length)
      group.item(1).hiddenTextarea.focus()
      group.item(0).set({
        selected: false,
        evented: false,
        hasBorders: false
      })
      group.item(0).set({
        fill: '#F1F1F1',
        stroke: '#DDDDDD'
      })
      group.item(1).set({
        textBackgroundColor: '#FFFFFF',
        Width: group.item(0).width - group.options.strokeWidth,
        fontSize: 14,
        fill: '#000',
        fontStyle: 'normal',
        fontWeight: 'normal',
        linethrough: false,
        underline: false,
        hasBorders: false
      })
    },
    // 文本退出编辑
    textRectexited (group) {
      // console.log('退出编辑', group.item(1).textdemo)
      let canvas = this.canvas
      var objs = this.getObjectsByid(group.id)
      if (!objs.length || objs[0].isType === 'NewText') { return }
      console.log('objs', objs)
      let rect = objs[0]
      let text = objs[1]

      group.options.textdemo = text.text
      // eslint-disable-next-line no-undef
      var group2 = new fabric.Group([rect], {
        isType: 'NewText',
        component: 'component',
        originX: 'left',
        originY: 'top',
        id: group.id,
        width: rect.width + group.options.strokeWidth,
        height: rect.height + group.options.strokeWidth,
        options: rect.options,
        visible: true
      })
      group.item(0).set({
        fill: group.options.backColor,
        stroke: group.options.stroke
      })
      text.set({
        textBackgroundColor: '',
        textdemo: group.options.textdemo,
        fill: group.options.fontColor,
        fontSize: group.options.fontSize,
        fontStyle: group.options.fontStyle,
        fontWeight: group.options.fontWeight,
        linethrough: group.options.linethrough,
        underline: group.options.underline
      })
      if (group.options.isElasticSize !== 2) {
        text.set({
          width: rect.width - group.options.strokeWidth,
          height: rect.height - group.options.strokeWidth,
          left: -(rect.width + group.options.strokeWidth) / 2 + group.options.strokeWidth,
          top: -(rect.height + group.options.strokeWidth) / 2 + group.options.strokeWidth
        })
        let newtext = this.newtextStyleFormat(text, group.options.textdemo) // 文字 格式化
        group.item(1).set('text', newtext)
      } else {
        text.text = text.text.trim().replace(/\s*/g, '') // 过滤前后空格和换行符 replace(/[\r\n]/g, '')
        // group.options.textdemo = text.text
        text.set({
          width: group2.item(0).width - group2.options.strokeWidth,
          scaleX: 1,
          splitByGrapheme: false
        })
        group.item(1)._splitText()
        text.set({
          left: -(rect.width + group.options.strokeWidth) / 2 + group.options.strokeWidth,
          top: -(rect.height + group.options.strokeWidth) / 2 + group.options.strokeWidth,
          scaleX: parseInt(rect.width - group.options.strokeWidth) / text.getLineWidth(0), // 文本的实际宽度
          scaleY: parseInt(rect.height - group.options.strokeWidth) / text.height
        })
      }

      group2.add(text)
      // group2.set({
      //   clipPath: rect,
      //   dirty: true
      // })
      if (group.options.isElasticSize !== 2) {
        group2.item(1).set({
          height: parseInt(group2.height * group2.scaleY - 2 * group2.options.strokeWidth)
        })
      }
      objs.forEach(obj => {
        canvas.remove(obj)
      })
      // 组装后旋转
      group2.set({
        angle: group2.options.angle
      })
      canvas.add(group2)
      group2.setCoords()
      group2.on('scaling', async (e) => {
        this.textRectScaling(group2)
      })
      group2.on('scaled', async (e) => {
        this.textRectScaled(group2)
      })
      group2.on('rotated', async (e) => {
        this.textRectrotated(e)
      })
      group2.on('mousedblclick', () => {
        this.textRectMousedbclick(group2)
      })
      group2.item(1).on('editing:entered', (e) => {
        this.textRectentered(group2)
      })
      group2.item(1).on('editing:exited', () => {
        this.textRectexited(group2)
      })
      // 文本宽高大小
      canvas.requestRenderAll()
      canvas.renderAll()
    }
  }
}
</script>

<style scoped>
.bigbox{
  position:relative;
  box-shadow: inset 0 0 9px 2px #0000001f;
  overflow: hidden;
}
</style>
