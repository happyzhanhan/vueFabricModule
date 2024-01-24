function initFabricRect(canvas, callback) {
  var pointX, 
  pointY, 
  width, 
  height, 
  left,
  top,
  id,
  rect, // 矩形对象
  fill='rgba(226, 246, 205, 0.5)',
  strokeWidth=1,
  stroke='#000000';
  canvas.on('mouse:down', function (e) {
    // console.log('canvas.showRect--------', canvas.showRect)
    if(!canvas.showRect) return
    canvas.selection = false // 禁止画线时选择组件
    // 鼠标按下拖拽,移动拖拽矩形
    pointX = e.absolutePointer.x
    pointY = e.absolutePointer.y
    canvas.on('mouse:move', startDrawing);
  });
  canvas.on('mouse:up', function (e) {
    finishDrawing(e)
    // 鼠标弹起时,取消监听移动事件
    canvas.off('mouse:move', startDrawing)
  });

  function startDrawing (e) {
    if(!canvas.showRect) return
    canvas.remove(rect)
    width = Math.abs(e.absolutePointer.x - pointX)
    height = Math.abs(e.absolutePointer.y - pointY)
    left = e.absolutePointer.x > pointX ? pointX : e.absolutePointer.x
    top = e.absolutePointer.y > pointY ? pointY : e.absolutePointer.y
    // id = canvas.cid;
    let option = {
      left: left,
      top: top,
      width: width,
      height: height,
      // id: id,
      fill: canvas.fillColor,
      stroke: canvas.strokeColor,
      strokeWidth: canvas.strokeWidth,
      strokeDashArray: [5,1],
      isType: 'Rect',
      name: 'Rect',
      component: 'component',
      isDiff: 'static',
      flipX: false,
      flipY: false,
      originX: 'left',
      originY: 'top',
      stopContextMenu: true, //  禁掉鼠标右键默认事件
      minScaleLimit: 0.0001, //  最小限制
      lockSkewingX: true, //  禁掉按住shift时的变形
      lockSkewingY: true,
      
      visible: true,
    };
    rect = new fabric.Rect({...option}) 
    canvas.add(rect);
    canvas.renderAll()
  }

  function finishDrawing (e) {
    if(!canvas.showRect) return

    left = e.absolutePointer.x > pointX ? pointX : e.absolutePointer.x
    top = e.absolutePointer.y > pointY ? pointY : e.absolutePointer.y
    width = Math.abs(e.absolutePointer.x - pointX)
    height = Math.abs(e.absolutePointer.y - pointY)
    id = canvas.cid;
    let option = {
      left: left,
      top: top,
      width: width,
      height: height,
      id: id,
      fill: canvas.fillColor,
      strokeWidth: canvas.strokeWidth,
      stroke: canvas.strokeColor,
      color: canvas.fillColor,
      type: 'Rect',
      isType: 'Rect',
      name: 'Rect',
      component: 'component',
      isDiff: 'static',
      flipX: false,
      flipY: false,
      originX: 'left',
      originY: 'top',
      stopContextMenu: true, //  禁掉鼠标右键默认事件
      minScaleLimit: 0.0001, //  最小限制
      lockSkewingX: true, //  禁掉按住shift时的变形
      lockSkewingY: true,
      visible: true,
    };
    let newrect = new fabric.Rect({...option}) 
    canvas.add(newrect)
    canvas.setActiveObject(newrect)
    canvas.renderAll()
    callback(false, newrect, id)
    canvas.remove(rect)
    canvas.showRect = false;
  }
}

export default initFabricRect;