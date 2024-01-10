
function initPen(canvas){
  var path, str; // path是绘制的对象,str是其路径
    var pointPosition = [] // 点的位置坐标信息
    var pointArray = [] // 点的对象组合
    var drawing = true // 控制是否开始自由绘画
    var mouseMoving = false // 用于判断鼠标是否在移动
    var isMoving = false // 用于判断是否进入移动鼠标事件
    var mousePoint1; // 鼠标拖动的点1
    var mousePoint2; // 鼠标拖动的点2
    var mouseLine1; // 鼠标拖动的线1
    var mouseLine2; // 鼠标拖动的线2
    var besair = '' // 贝塞尔曲线的坐标
    var basairDrawing = false; // 贝塞尔曲线
    // x , y 是线段1的镜象线的坐标值,也就是线段2的末尾值  
    var x;
    var y;
    var borderColor = '#999999';
    var PointColor = '#1a80ff'; // blue
    var PointFill = '#ffffff'; //white
    var PathFill = 'rgba(0,0,0,0)'; // red
		var strokeWidth = 1;
    var strokeColor = '#000000';

    var besairObj; // 贝塞尔曲线的对象
    // 增加点,和路径,开始绘画
    function addPoint(e) {
      var id = new Date().getTime() + Math.random()
      var circle = new fabric.Circle({
        radius: 3,
        fill: PointColor,
        left: e.absolutePointer.x,
        top: e.absolutePointer.y,
        selectable: false,
        hasBorders: false,
        hasControls: false,
        originX: 'center',
        originY: 'center',
        id: id
      })
      canvas.add(circle)
      pointPosition.push({
        x: e.absolutePointer.x,
        y: e.absolutePointer.y
      })
			//第一段线段
      if (pointPosition.length == 1 ) {
        str = 'M' + pointPosition[0].x + ' ' + pointPosition[0].y
        path = new fabric.Path(str)
        path.set({
          fill: 'red',
          name: '0line',
          // opacity: 0.5,
          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false
        })
        canvas.add(path);
        pointArray.push(circle)
      }
      pointArray.push(circle)
      // 增加第二个点时再执行下面的逻辑
      if (pointPosition.length <= 1) return
      var length = pointPosition.length - 1
      canvas.remove(path)
			// console.log(path)
      // str = str + 'L' + pointPosition[length].x + ' ' + pointPosition[length].y + 'z'
      str = str + 'L' + pointPosition[length].x + ' ' + pointPosition[length].y
      path = new fabric.Path(str)
      path.set({
				name: 'lines',
        fill: PathFill,
        // opacity: 0.5,
        strokeWidth: 1.5,
        stroke: PointColor,
        selectable: true,
        hasBorders: false,
        hasControls: false,
        evented: false

      })
      canvas.add(path);

      canvas.renderAll()
     
    }
    // 整个图形成型,包括圆点
    function finishDrawing(e) {
			fabric.Canvas.prototype.defaultCursor = 'default'
			if(!canvas.showPenClose) return
      canvas.remove(path)
      // 最后一个点的坐标就是第一个点的坐标
      pointPosition.push({
        x: pointPosition[0].x,
        y: pointPosition[0].y
      })
      str = str + ' Z'
      path = new fabric.Path(str)
      path.set({
        fill: PathFill,
        // opacity: 0.5,
        strokeWidth: 1.5,
        stroke: PointColor,
        // selectable: true,
        // hasBorders: true,
        // hasControls: true,
        // evented: true

      })
      canvas.add(path);
      canvas.renderAll()
    }

    // 移除点 
    function removePoint() {
      for (let item of pointArray) {
        canvas.remove(item)
      }
      // 结束绘画时,如果贝塞尔曲线的对象存在,则将其移除,并置空
      if (besairObj) {
        canvas.remove(besairObj)
        besairObj = null
        if (path) canvas.remove(path)
        path = new fabric.Path(str)
        path.set({
					name: 'deline',
          fill: PathFill,
          strokeWidth: 1.5,
          stroke: PointColor,
        })
        canvas.add(path);
      }
      str = ''
      pointArray = []
      pointPosition = []
      path.set({
				name: 'Polyline',
				isType: 'Polyline',
				component: 'component',
        fill: null,
				strokeWidth: canvas.strokeWidth,
        stroke: canvas.strokeColor
      })
      canvas.renderAll()
    }

    // 跟随鼠标拖动的点和线
    function dragMousePoint(e) {
			basairDrawing = true
      if(!canvas.showPen) return
      var length = pointPosition.length - 1
      mouseMoveLine1(e, length)
      mouseMoveLine2(e, length)
      mouseMovePoint(e)
      BeSaiEr(e, length)
      // throttle(BeSaiEr(e, length),1000)

      canvas.renderAll()

     
    }
    // 跟随鼠标走动的两个点
    function mouseMovePoint(e) {
      // var x2 = (y  / Math.sqrt(Math.pow(x,2) + Math.pow(y,2)) ) * 1.5
      // var y2 = (x  / Math.sqrt(Math.pow(x,2) + Math.pow(y,2)) ) * 1.5
      if (!mousePoint1) {
        mousePoint1 = new fabric.Circle({
          radius: 4,
          fill: PointFill,
          left: e.absolutePointer.x,
          top: e.absolutePointer.y,
          selectable: false,
          hasBorders: false,
          hasControls: false,
          originX: 'center',
          originY: 'center',
          strokeWidth: 0.8,
          stroke: PointColor,
          // id: id
        })

        mousePoint2 = new fabric.Circle({
          radius: 4,
          fill: PointFill,
          left: x,
          top: y,
          selectable: false,
          hasBorders: false,
          hasControls: false,
          originX: 'center',
          originY: 'center',
          strokeWidth: 0.8,
          stroke: PointColor,

          // id: id
        })
        canvas.add(mousePoint2)
        canvas.add(mousePoint1)
      }
      mousePoint1.set({
        left: e.absolutePointer.x,
        top: e.absolutePointer.y
      })
      mousePoint2.set({
        left: x,
        top: y
      })
    }

    // 跟随鼠标走动的线1
    function mouseMoveLine1(e, length) {
      if (mouseLine1) canvas.remove(mouseLine1)
      canvas.selection = false
      // new fabric.Line(x1,y1,x2,y2)  x1,y1是起始点,x2,y2是结束点
      mouseLine1 = new fabric.Line([pointPosition[length].x, pointPosition[length].y,
        e.absolutePointer.x, e.absolutePointer.y
      ], {
        strokeWidth: 2,
        fill: borderColor,
        stroke: borderColor,
        strokeDashArray: [5, 3],
        class: 'line',
        originX: 'center',
        originY: 'center',
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false
      });
      canvas.add(mouseLine1)
    }
    // 跟随鼠标走动的线2
    function mouseMoveLine2(e, length) {
      // 鼠标移动点,也是线段的结束点
      var moveX = e.absolutePointer.x
      var moveY = e.absolutePointer.y
      // 线段的起始点
      var originX = pointPosition[length].x
      var originY = pointPosition[length].y

      if (mouseLine2) canvas.remove(mouseLine2)

      // x , y 是线段1的镜象线的坐标值,也就是线段2的末尾值  至于为什么x的值为x = 2 * originX - moveX,画个坐标出来就清楚了
      x = 2 * originX - moveX
      y = 2 * originY - moveY
      canvas.selection = false
      mouseLine2 = new fabric.Line([originX, originY,
        x, y
      ], {
        strokeWidth: 2,
        fill: borderColor,
        stroke: borderColor,
        strokeDashArray: [5, 3],
        class: 'line',
        originX: 'center',
        originY: 'center',
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false
      });
      canvas.add(mouseLine2)
    }


    // 跟随鼠标改动的贝塞尔曲线
    function BeSaiEr(e, length) {
      // pointPosition[length].x 鼠标移动事件的起始点
      besair = 'M' + pointPosition[length - 1].x + ' ' + pointPosition[length - 1].y +  ' Q ' + x + ' ' + y + ' ' + pointPosition[length ].x + ' ' + pointPosition[
          length ].y
      // besair = ' Q ' + x + ' ' + y + ' ' + pointPosition[length-1].x + ' ' + pointPosition[length-1].y 
      // besair = ' Q ' + x + ' ' + y + ' ' + pointPosition[length].x + ' ' + pointPosition[length].y
      if (besairObj) {
        canvas.remove(besairObj)
      }
      besairObj = new fabric.Path(besair)
      besairObj.set({
				name: 'besair',
        fill: PathFill,
        // opacity: 0.5,
        strokeWidth: 1.5,
        stroke: PointColor,
        selectable: true,
        hasBorders: false,
        hasControls: false,
        evented: false

      })
      canvas.add(besairObj)
      besair = ' Q ' + x + ' ' + y + ' ' + pointPosition[length].x + ' ' + pointPosition[length].y
    }

    canvas.on('selection:created', function (e) {
      // selectd = e
      // console.log(canvas.getZoom())
      // 第一次触发了,但是不变
    });
    canvas.on('selection:updated', function (e) {
      // console.log(e);
    });

    canvas.on('mouse:down', function (e) {
      if(!canvas.showPen) return
			canvas.selection = false // 禁止画线时选择组件
       // 只有开启绘画,才进行鼠标拖动
      canvas.on('mouse:move', startDrawing);
      // 如果str包含z,也就是说路径里面有z,说明图形已经绘画完毕了,将之前的所有点和点的位置信息全部清空
			if (str && str.indexOf('Z') !== -1) {
				removePoint()
				// addPoint(e)
			} else if (e.target && pointArray[0] && e.target.id == pointArray[0].id) { // 目标点和第一个点id相等时,说明绘画动作已经完成,此时开始最后一步绘画
				finishDrawing(e)
			} else if (canvas.showPen) {
				if (canvas.getActiveObject()) return
				addPoint(e)
			
			}
			

    });
    var startDrawing = function (e) {
      dragMousePoint(e)
    }

    canvas.on('mouse:dblclick', function (e) {
      
      if (canvas.showPen) {
        if (mouseLine1) canvas.remove(mouseLine1)
        if (mouseLine2) canvas.remove(mouseLine2)
        if (mousePoint1) canvas.remove(mousePoint1)
        if (mousePoint2) canvas.remove(mousePoint2)
        finishDrawing(e)
        removePoint()
        mousePoint1 = null;
        canvas.showPen = false;
				
      }
      
    });

    canvas.on('mouse:up', function (e) {
      basairDrawing = false
      canvas.selection = true
      if (mouseLine1) canvas.remove(mouseLine1)
      if (mouseLine2) canvas.remove(mouseLine2)
      if (mousePoint1) canvas.remove(mousePoint1)
      if (mousePoint2) canvas.remove(mousePoint2)
      mousePoint1 = null;

      if (besair) {
        // 在移动事件中,每次都将最后一个L的数据排除掉,避免bug
        if (str.lastIndexOf('L') !== -1) {
          str = str.substring(0, str.lastIndexOf('L'))
        }
        // 如果有z这说明本次绘图已经结束,不去掉z会造成图形失真,有bug
        if (str.indexOf('Z') !== -1) {
          str = str.substring(0, str.indexOf('Z'))
          besair = besair + 'Z'
        }
        // 鼠标弹起时,如果besair有值,则与str合并,并将其置为空字符串
        str = str + besair
        besair = ''
      }
			
      // 鼠标弹起时,取消监听移动事件
      canvas.off('mouse:move', startDrawing)
    });

    canvas.on('object:modified', function (e) {
    });
    canvas.on('object:scaling', function (e) {
    });
    canvas.on('object:moving', function (e) {
      // console.log(e.target.aCoords);
    });
    canvas.on('object:rotating', function (e) {
    });
    canvas.on('mouse:wheel', function (e) {
    })
}

export default initPen;