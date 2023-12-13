/*
 * @Description: fabric.js vue2匹配版仿PS标尺功能
 * @FilePath: \vueFabricModule\src\utils\fabricRuler.js
 * @Author: zhouzhenhan 
 * @Date: 2023-08-01 14:18:54
 * @Version: v0.1.31
 * @LastEditors: zhouzhenhan
 * @LastEditTime: 2023-12-11 20:24:21
 */
 // eslint-disable no-unused-vars
 // eslint-disable no-undef
let initFabricRuler = function () {
  var canvas,
      status = true,
      showobjectRect = true,
      rulerborder = '#696969',
      rulerbgborderWidth = 1,
      rulerbg = '#303030',
      rulerSize = 20,
      fontSize = 10,
      textColor = '#a5a5a5',
      lineColor = '#696969',
      dashColor = '#b0b0b0',
      objectBg = '#007fff',
      vpt,
      zoom;
  // 标尺运动计算
  const debounce = (() => {
      let timer = null
      return (callback, wait) => {
        clearTimeout(timer)
        timer = setTimeout(callback, wait)
      }
    })();
  // 鼠标坐标点运动计算
  const debounce2 = (() => {
    let timer = null
    return (callback, wait) => {
      clearTimeout(timer)
      timer = setTimeout(callback, wait)
    }
  })();
  // 选中组件矩形运动计算
  const debounce3 = (() => {
    let timer = null
    return (callback, wait) => {
      clearTimeout(timer)
      timer = setTimeout(callback, wait)
    }
  })();
  return {
    // 初始化标尺组件
    drawfabricRuler: async function (c) {
      canvas = c
      status = canvas.showRule || false
      if(status){
        let Ruler = this
        vpt = canvas.viewportTransform
        zoom = canvas.getZoom();
        Ruler.drawfabricRulerBg(canvas) // 重绘标尺背景
        Ruler.drawfabricRulerText(canvas) // 重绘标尺刻度
        Ruler.drawfabricRulerMark(canvas) // 重绘标尺遮罩
      }else{
        await canvas.remove(...this.returnsRuler('sRuler')) // 删除已有的标尺
        await canvas.remove(...this.returnsRuler('sRulerBg')) // 删除已有的标尺背景
        await canvas.remove(...this.returnsRuler('sRulerMark')) // 删除已有的标尺遮罩
      }
      
    
    },
  
    drawfabricRulerBg: function (c) {
      canvas = c
      let Ruler = this
      vpt = canvas.viewportTransform
      zoom = canvas.getZoom();
      // 标尺背景横 上
      Ruler.drawBg({
        isType: 'sRulerBg',
        left: -(vpt[4] / vpt[0]),
        top: -(vpt[5] / vpt[3]),
        width: (Ruler.canvasSize().width - 2) * (1 / zoom),
        height: rulerSize * (1 / zoom),
        fill: rulerbg,
        stroke: rulerborder,
        strokeWidth: rulerbgborderWidth * (1 / zoom)
      })
      // 标尺背景竖 左
      Ruler.drawBg({
        isType: 'sRulerBg',
        left: -(vpt[4] / vpt[0]),
        top: -(vpt[5] / vpt[3]),
        width: rulerSize * (1 / zoom),
        height: (Ruler.canvasSize().height - 2) * (1 / zoom),
        fill: rulerbg,
        stroke: rulerborder,
        strokeWidth: rulerbgborderWidth * (1 / zoom)
      })
    },
    drawfabricRulerText: function (c) {
      canvas = c
      let Ruler = this
      vpt = canvas.viewportTransform
      zoom = canvas.getZoom();
      const gap = Ruler.getGap(zoom);
    
      // 标尺刻度横 上
      Ruler.drawRuler({
        isHorizontal: true,
        axisWidth: rulerbgborderWidth * (1 / zoom),
        lineColor: lineColor,
        gridWidth: (rulerSize - 1) * (1 / zoom),
        gridHeight: (rulerSize - 1) * (1 / zoom),
        left: -(vpt[4] / vpt[0]),
        top: -(vpt[5] / vpt[3]),
        gap: gap,
        fontSize: fontSize * (1 / zoom),
        textColor: textColor,
        width: (Ruler.canvasSize().width - 2) * (1 / zoom),
        height: (Ruler.canvasSize().height - 2) * zoom
      })
    
      // 标尺刻度竖 左
      Ruler.drawRuler({
        isHorizontal: false,
        axisWidth: rulerbgborderWidth * (1 / zoom),
        lineColor: lineColor,
        gridWidth: (rulerSize - 1) * (1 / zoom),
        gridHeight: (rulerSize - 1) * (1 / zoom),
        left: -(vpt[4] / vpt[0]),
        top: -(vpt[5] / vpt[3]),
        gap: gap,
        fontSize: fontSize * (1 / zoom),
        textColor: textColor,
        width: (Ruler.canvasSize().width - 2) * (1 / zoom),
        height: (Ruler.canvasSize().height - 2) * (1 / zoom)
      })
    
    },
    drawfabricRulerMark: function (c) {
      canvas = c
      let Ruler = this
      vpt = canvas.viewportTransform
      zoom = canvas.getZoom();
    
      // 左上角遮罩
      Ruler.drawBg({
        isType: 'sRulerMark',
        left: -(vpt[4] / vpt[0]) + rulerbgborderWidth * (1 / zoom),
        top: -(vpt[5] / vpt[3]) + rulerbgborderWidth * (1 / zoom),
        width: rulerSize * (1 / zoom),
        height: rulerSize * (1 / zoom),
        fill: '#535353',
        strokeWidth: 0
      })
    },
    // canvas 大小
    canvasSize: function () {
      return {
        width: canvas.width || 0,
        height: canvas.height || 0,
      };
    },
    // 画布大小
    bgSize: function () {
      let bg = this.returnsRuler('sBg')
      return {
        width: bg[0].width || 0,
        height: bg[0].height || 0,
      };
    },
    // 设定几组缩放比例
    getGap: function (zoom) {
      const zooms = [0.02, 0.03, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 18];
      const gaps = [5000, 2500, 1000, 500, 250, 100, 50, 25, 10, 5, 2];
    
      let i = 0;
      while (i < zooms.length && zooms[i] < zoom) {
        i++;
      }
      return gaps[i - 1] || 5000;
    },
    // 画标尺背景或方块
    drawBg: function (options) {
      let rulerPath = new fabric.Rect({
        type: 'Rect',
        name: 'sRulerBg',
        isType: options.isType,
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
        hoverCursor: 'ns-resize',
        left: options.left,
        top: options.top,
        width: options.width,
        height: options.height,
        fill: options.fill,
        stroke: options.stroke,
        strokeWidth: options.strokeWidth,
        evented: false
      })
      canvas.add(rulerPath)
      rulerPath.bringToFront()
      canvas.requestRenderAll()
      canvas.renderAll()
    },
    // 画标尺刻度
    drawRuler: function (params) {
      vpt = canvas.viewportTransform
      const isHorizontal = params.isHorizontal;
      const gap = params.gap;
      const unitLength = isHorizontal ? params.width : params.height; // / zoom
      const startValue = isHorizontal ? Math[params.left > 0 ? 'floor' : 'ceil'](params.left / gap) * gap : Math[params.top > 0 ? 'floor' : 'ceil'](params.top / gap) * gap;
      const startOffset = isHorizontal ? startValue - params.left : startValue - params.top;
      // 标尺刻度线显示
      let objectRuler = []
      for (let j = 0; j + startOffset <= Math.ceil(unitLength); j += gap) {
        const position = ((startOffset + j));
        const left = isHorizontal ? position : params.gridHeight;
        const top = isHorizontal ? params.gridHeight : position;
        const width = isHorizontal ? 0 : params.gridHeight;
        const height = isHorizontal ? params.gridHeight : 0;
        let line = new fabric.Line(isHorizontal ? [left, 0, left, height] : [0, top, width, top], {
          isType: 'sRuler',
          stroke: params.lineColor,
          strokeWidth: params.axisWidth,
          strokeDashArray: [0, 0]
        })
        objectRuler.push(line)
      }
      // 标尺刻度线-短线
      for (let j = 0; j + startOffset <= Math.ceil(unitLength); j += gap / 10) {
        const position = ((startOffset + j));
        const left = isHorizontal ? position : params.gridHeight;
        const top = isHorizontal ? params.gridHeight : position;
        const width = isHorizontal ? 0 : params.gridHeight;
        const height = isHorizontal ? params.gridHeight : 0;
        let line = new fabric.Line(isHorizontal ? [left, height * 0.9, left, height] : [width * 0.8, top, width, top], {
          isType: 'sRuler',
          stroke: params.lineColor,
          strokeWidth: params.axisWidth,
          strokeDashArray: [0, 0]
        })
        objectRuler.push(line)
      }
      // 标尺刻度线-长线
      for (let j = 0; j + startOffset <= Math.ceil(unitLength); j += gap / 5) {
        const position = ((startOffset + j));
        const left = isHorizontal ? position : params.gridHeight;
        const top = isHorizontal ? params.gridHeight : position;
        const width = isHorizontal ? 0 : params.gridHeight;
        const height = isHorizontal ? params.gridHeight : 0;
        let line = new fabric.Line(isHorizontal ? [left, height * 0.8, left, height] : [width * 0.7, top, width, top], {
          isType: 'sRuler',
          stroke: params.lineColor,
          strokeWidth: params.axisWidth,
          strokeDashArray: [0, 0]
        })
        objectRuler.push(line)
      }
      // 标尺文字显示
      for (let i = 0; i + startOffset <= Math.ceil(unitLength); i += gap) {
        const position = (startOffset + i);
        let textValue = startValue + i + '';
        const textLength = (10 * textValue.length) / 4;
        const textX = isHorizontal
          ? position - textLength - 1
          : params.gridHeight / 2 - params.fontSize / 2 - 4;
        const textY = isHorizontal
          ? params.gridHeight / 2 - params.fontSize / 2 - 4
          : position ;
        if (!isHorizontal) {
          textValue = parseInt(textValue) > 0 ? textValue.split("").join("\n") : `${parseInt(textValue)}`.split("").join("\n")
        }
        let text = new fabric.Text(textValue, {
          isType: 'sRuler',
          originX: 'left',
          originY: 'top',
          left: isHorizontal ? textX + (gap > 25 ? 20 : 10) : params.gridHeight * 0.1,
          top: isHorizontal ? params.gridHeight * 0.1 : textY,
          textAlign: 'left',
          fill: params.textColor,
          fontWeight: 'normal',
          fontSize: params.fontSize
        })
        objectRuler.push(text)
      }
    
      // 长线(原 画布顶部不跟随画布移动的标尺)
      let objectline = []
      if (isHorizontal) {
        for (let i = 0; i < (params.width + 1) / params.gap; i++) {
          // eslint-disable-next-line no-undef
          let line = new fabric.Line([params.gap * i, 0, params.gap * i, params.gridHeight], {
            isType: 'sRuler',
            stroke: params.lineColor,
            strokeWidth: params.axisWidth,
            strokeDashArray: [0, 0],
            visible: false
          })
          objectline.push(line)
        }
      } else {
        for (let i = 0; i < (params.height + 1) / params.gap; i++) {
          // eslint-disable-next-line no-undef
          let line = new fabric.Line([0, params.gap * i, params.gridWidth, params.gap * i], {
            isType: 'sRuler',
            originX: 'left',
            originY: 'top',
            stroke: '#f00', //params.lineColor,
            strokeWidth: params.axisWidth,
            strokeDashArray: [0, 0],
            visible: false
          })
          objectline.push(line)
        }
      }
    
    
    
      // const vpt = canvas.viewportTransform
      // eslint-disable-next-line no-undef
      let rulerPath = new fabric.Group([...objectRuler, ...objectline,], {
        type: 'line',
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
        name: 'sRuler'+isHorizontal,
        left: !isHorizontal ? params.left : (startOffset < 0 ? params.left + startOffset : params.left),
        top: isHorizontal ? params.top : (startOffset < 0 ? params.top + startOffset : params.top),
        isType: 'sRuler',
        evented: false
      })
      canvas.add(rulerPath)
      rulerPath.bringToFront()
      canvas.requestRenderAll()
      canvas.renderAll()
    },
    // 标尺获取对象
    returnsRuler: function (isType) {
      if(!canvas) return
      let objects = canvas.getObjects()
      let returndata = objects.filter(one => one.isType === isType)
      return returndata
    },
    // 画鼠标位置
    drawPoint: async function (x, y) {
      await canvas.remove(...this.returnsRuler('sPoint')) // 删除已有的标记
      debounce2(async () => {
        vpt = canvas.viewportTransform
        zoom = canvas.getZoom();
        let left = -(vpt[4] / vpt[0]) + rulerbgborderWidth * (1 / zoom)
        let top = -(vpt[5] / vpt[3]) + rulerbgborderWidth * (1 / zoom)
        let pointX = new fabric.Line([x, top, x, top + rulerSize * (1 / zoom)], {
          isType: 'sPoint',
          stroke: dashColor,
          strokeWidth: 2 * (1 / zoom),
          strokeDashArray: [1, 2],
          selectable: false,
          excludeFromExport: true,
          lockMovementX: true,
          lockMovementY: true,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
          lockUniScaling: true,
          hoverCursor: 's-resize',
          evented: false,
        })
        let pointY = new fabric.Line([left, y, left + rulerSize * (1 / zoom), y], {
          isType: 'sPoint',
          stroke: dashColor,
          strokeWidth: 2 * (1 / zoom),
          strokeDashArray: [1, 2],
          selectable: false,
          excludeFromExport: true,
          lockMovementX: true,
          lockMovementY: true,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
          lockUniScaling: true,
          hoverCursor: 'auto',
          evented: false,
        })
      
        canvas.add(pointX)
        pointX.bringToFront()
        canvas.add(pointY)
        pointY.bringToFront()
        canvas.requestRenderAll()
        canvas.renderAll()
      }, 10)
    },
    // 标尺移动
    rulerNomove: async function (c) {
      canvas = c
      status = canvas.showRule || false
      if (!status) return
      vpt = canvas.viewportTransform;
      zoom = canvas.getZoom();
    
      let that = this
      await canvas.remove(...this.returnsRuler('sRuler')) // 删除已有的标尺
      await canvas.remove(...this.returnsRuler('sRulerBg')) // 删除已有的标尺背景
      await canvas.remove(...this.returnsRuler('sRulerMark')) // 删除已有的标尺遮罩
    
      that.drawfabricRulerBg(canvas) // 重绘标尺背景
      debounce(async () => {
        console.log('zoom', zoom)
        that.drawfabricRulerText(canvas) // 重绘标尺刻度
        that.drawfabricRulerMark(canvas) // 重绘标尺上遮罩
      }, 200)
      canvas.requestRenderAll()
      canvas.renderAll()
    },

    // 删除活跃元素坐标蓝色区域
    async removeObjectRect () {
      await canvas.remove(...this.returnsRuler('sObjectBg')) // 删除已有的背景
      await canvas.remove(...this.returnsRuler('sObjectLine')) // 删除活跃元素坐标
      await canvas.remove(...this.returnsRuler('sObjectTextT')) // 删除活跃元素坐标
      await canvas.remove(...this.returnsRuler('sObjectTextbg')) // 删除活跃元素坐标
      await canvas.remove(...this.returnsRuler('sObjectText')) // 删除活跃元素坐标
    },
    // 绘制刻度
    async drawtext(isHorizontal, text){
      vpt = canvas.viewportTransform
      zoom = canvas.getZoom();
      let left = -(vpt[4] / vpt[0]) + rulerbgborderWidth * (1 / zoom)
      let top = -(vpt[5] / vpt[3]) + rulerbgborderWidth * (1 / zoom)
      let topleftline, topleftText, topleftTextbg, topleftTexGroup
      topleftline = new fabric.Line( isHorizontal ? [text, top + 7, text, top + 7 + 10 * (1 / zoom)]: [left + 7, text, left + 7 + 10 * (1 / zoom), text], {
        isType: 'sObjectLine',
        stroke: objectBg,
        strokeWidth: 2 * (1 / zoom),
        strokeDashArray: [0, 0],
        selectable: false,
        excludeFromExport: true,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        lockUniScaling: true,
        hoverCursor: 'auto',
        evented: false,
      })
      canvas.add(topleftline)
      topleftText = new fabric.Text( parseInt(text) + '' , {
        isType: 'sObjectTextT',
        fill: objectBg,
        fontSize: fontSize * (1 / zoom),
        textAlign: 'left',
      })
      var shadow = new fabric.Shadow({ 
        color: rulerbg, 
        blur: 3 
     }); 
      topleftTextbg = new fabric.Rect({
        isType: 'sObjectTextbg',
        fill: rulerbg,
        shadow: shadow,
        opacity: 0.6,
        padding: 20,
        width: topleftText.width + 20,
        height: topleftText.height,
      })
      topleftTexGroup = new fabric.Group([topleftTextbg, topleftText], {
        isType: 'sObjectText',
        left: isHorizontal ? text : left + 6 * (1 / zoom),
        top: isHorizontal ? top + 6 * (1 / zoom) : text,
        angle: isHorizontal ? 0 : -90,

        selectable: false,
        excludeFromExport: true,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        lockUniScaling: true,
        hoverCursor: 'auto',
        evented: false,
      })
      canvas.add(topleftTexGroup)
    },
    // 画出矩形位置
    async drawObjectRect (x1, w, y1, h) {
      // console.log(x1, w, y1, h)
      vpt = canvas.viewportTransform
      zoom = canvas.getZoom();
      let sObjectBg = this.returnsRuler('sObjectBg')
      // console.log(sObjectBg)
      let left = -(vpt[4] / vpt[0]) + rulerbgborderWidth * (1 / zoom)
      let top = -(vpt[5] / vpt[3]) + rulerbgborderWidth * (1 / zoom)
      let topMask, leftMask, topleftTexGroup
      if(sObjectBg.length>0){
        topMask = sObjectBg[0]
        topMask.animate('left', x1, {
          duration: 100,
          onChange: canvas.renderAll.bind(canvas),
          onComplete: function() {},
          easing: fabric.util.ease['easeInOutQuad']
        });
        topMask.animate('width', w, {
          duration: 100,
          onChange: canvas.renderAll.bind(canvas),
          onComplete: function() {},
          easing: fabric.util.ease['easeInOutQuad']
        });
        leftMask = sObjectBg[1]
        leftMask.animate('top', y1, {
          duration: 100,
          onChange: canvas.renderAll.bind(canvas),
          onComplete: function() {},
          easing: fabric.util.ease['easeOutQuart']
        });
        leftMask.animate('height', h, {
          duration: 100,
          onChange: canvas.renderAll.bind(canvas),
          onComplete: function() {},
          easing: fabric.util.ease['easeOutQuart']
        });
        // 坐标刻度线段
        let sObjectLine = this.returnsRuler('sObjectLine')
        sObjectLine[0].animate('left', x1, {
          duration: 100,
          onChange: canvas.renderAll.bind(canvas),
          onComplete: function() {},
          easing: fabric.util.ease['easeOutQuart']
        });
        sObjectLine[1].animate('left', x1+w, {
          duration: 100,
          onChange: canvas.renderAll.bind(canvas),
          onComplete: function() {},
          easing: fabric.util.ease['easeOutQuart']
        });
        sObjectLine[2].animate('top', y1, {
          duration: 100,
          onChange: canvas.renderAll.bind(canvas),
          onComplete: function() {},
          easing: fabric.util.ease['easeOutQuart']
        });
        sObjectLine[3].animate('top', y1+h, {
          duration: 100,
          onChange: canvas.renderAll.bind(canvas),
          onComplete: function() {},
          easing: fabric.util.ease['easeOutQuart']
        });
        // 坐标文字
        let sObjectText = this.returnsRuler('sObjectText')
        sObjectText[0].item(1).set({
          text: parseInt(x1)+''
        })
        sObjectText[0].animate('left', x1, {
          duration: 100,
          onChange: canvas.renderAll.bind(canvas),
          onComplete: function() {},
          easing: fabric.util.ease['easeOutQuart']
        });
        sObjectText[1].item(1).set({
          text: parseInt(x1+w)+''
        })
        sObjectText[1].animate('left', x1+w, {
          duration: 100,
          onChange: canvas.renderAll.bind(canvas),
          onComplete: function() {},
          easing: fabric.util.ease['easeOutQuart']
        });
        sObjectText[2].item(1).set({
          text: parseInt(y1)+''
        })
        sObjectText[2].animate('top', y1, {
          duration: 100,
          onChange: canvas.renderAll.bind(canvas),
          onComplete: function() {},
          easing: fabric.util.ease['easeOutQuart']
        });
        sObjectText[3].item(1).set({
          text: parseInt(y1+h)+''
        })
        sObjectText[3].animate('top', y1+h, {
          duration: 100,
          onChange: canvas.renderAll.bind(canvas),
          onComplete: function() {},
          easing: fabric.util.ease['easeOutQuart']
        });
      }else{
        topMask = new fabric.Rect({
          type: 'Rect',
          name: 'sObjectBg',
          isType: 'sObjectBg',
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
          hoverCursor: 'ns-resize',
          left: x1,
          top: top + 15 * (1 / zoom),
          width: w,
          height: 4 * (1/zoom),
          fill: objectBg,
          opacity: 0.5,
          stroke: '#eee',
          strokeWidth: 0,
          evented: false
        })
        canvas.add(topMask)
        await this.drawtext(true, x1)
        await this.drawtext(true, x1+w)

        
        leftMask = new fabric.Rect({
          type: 'Rect',
          name: 'sObjectBg',
          isType: 'sObjectBg',
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
          hoverCursor: 'ns-resize',
          left: left + 15 * (1 / zoom),
          top: y1,
          width: 4 * (1/zoom),
          height: h,
          fill: objectBg,
          opacity: 0.5,
          stroke: '#eee',
          strokeWidth: 0,
          evented: false
        })
        canvas.add(leftMask)
        await this.drawtext(false, y1)
        await this.drawtext(false, y1+h)
      }
      topMask.bringToFront()
      leftMask.bringToFront()
      canvas.requestRenderAll()
      canvas.renderAll()
    },
  
    // 计算选中矩形坐标
    calcObjectRect: function (canvas) {
      let that = this
      showobjectRect = canvas.showobjectRect || false

      if (!showobjectRect) {
        this.removeObjectRect() // 关闭删除
        return
      }
      debounce3(async () => {
        const activeObjects = canvas.getActiveObject();
        // if (activeObjects.length === 0) return;
        if(activeObjects){
          // console.log(activeObjects)
          // console.log(activeObjects.getBoundingRect(true, true))
          const {left: x1, width: w,  top: y1, height: h} = activeObjects.getBoundingRect(true, true)
          that.drawObjectRect(x1, w, y1, h)
        }
      },15)
    },
  
    // 清除选中矩形坐标
    clearStatus: function () {
      objectRect = undefined;
    }
  }
  
}()
export default initFabricRuler
