/*
 * @Description: 组件对齐线
 * @FilePath: \vueFabricModule\src\utils\fabricGuidelines.js
 * @Author: zhouzhenhan 
 * @Date: 2023-08-02 17:54:58
 * @Version: v0.1.31
 * @LastEditors: zhouzhenhan
 * @LastEditTime: 2023-08-03 10:04:32
 */

function initAligningGuidelines(canvas) {
  
  var ctx = canvas.contextContainer,
    status = canvas.showGuideline || true,
    aligningLineOffset = 5,
    aligningLineMargin = 5,
    aligningLineWidth = 1,
    aligningLineColor = 'rgb(0,98,178,0.6)',//'rgb(0,98,178,0.6)',
    aligningLineDashArray = [5, 1], // 虚线样式
    vpt,
    zoom = 1;
  
  function drawVerticalLine(coords) {
    drawLine(
      coords.x + 0.5,
      coords.y1 > coords.y2 ? coords.y2 : coords.y1,
      coords.x + 0.5,
      coords.y2 > coords.y1 ? coords.y2 : coords.y1);
  }
  
  function drawHorizontalLine(coords) {
    drawLine(
      coords.x1 > coords.x2 ? coords.x2 : coords.x1,
      coords.y + 0.5,
      coords.x2 > coords.x1 ? coords.x2 : coords.x1,
      coords.y + 0.5);
  }
  
  function drawLine(x1, y1, x2, y2) {
    vpt = canvas.viewportTransform;
    ctx.save();
    ctx.lineWidth = aligningLineWidth;
    ctx.strokeStyle = aligningLineColor;
    ctx.setLineDash(aligningLineDashArray);
    ctx.beginPath();
    ctx.moveTo(((x1+vpt[4]/vpt[0])*zoom), ((y1+vpt[5]/vpt[3])*zoom));
    ctx.lineTo(((x2+vpt[4]/vpt[0])*zoom), ((y2+vpt[5]/vpt[3])*zoom));
    ctx.stroke();
    ctx.restore();
  }
  
  
  function isInRange(value1, value2) {
    value1 = Math.round(value1);
    value2 = Math.round(value2);
    for (var i = value1 - aligningLineMargin, len = value1 + aligningLineMargin; i <= len; i++) {
      if (i === value2) {
        return true;
      }
    }
    return false;
  }
  
  var verticalLines = [],
    horizontalLines = [];
  
  canvas.on('mouse:down', function () {
    if (status) {
      vpt = canvas.viewportTransform;
      zoom = canvas.getZoom();
    }
  });
  
  canvas.on('object:moving', function(e) {
    if (!status) return
    var activeObject = e.target,
      canvasObjects = canvas.getObjects(),
      activeObjectCenter = activeObject.getCenterPoint(),
      activeObjectLeft = activeObjectCenter.x,
      activeObjectTop = activeObjectCenter.y,
      activeObjectBoundingRect = activeObject.getBoundingRect(),
      activeObjectHeight = activeObjectBoundingRect.height / vpt[3],
      activeObjectWidth = activeObjectBoundingRect.width / vpt[0],
      horizontalInTheRange = false,
      verticalInTheRange = false,
      transform = canvas._currentTransform;
    
    if (!transform) return;
    
    // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
    // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move
    
    for (var i = canvasObjects.length; i--; ) {
      
      if (canvasObjects[i] === activeObject) continue;
      
      if(canvasObjects[i].opacity === 0 || canvasObjects[i].visible === false || canvasObjects[i].selectable === false) continue; //if object not can see /happy change
      
      var objectCenter = canvasObjects[i].getCenterPoint(),
        objectLeft = objectCenter.x,
        objectTop = objectCenter.y,
        objectBoundingRect = canvasObjects[i].getBoundingRect(),
        objectHeight = objectBoundingRect.height / vpt[3],
        objectWidth = objectBoundingRect.width / vpt[0];
        
      // 左对齐线
      if (isInRange(objectLeft - objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
        verticalInTheRange = true;
        verticalLines.push({
          x: objectLeft - objectWidth / 2,
          y1: (objectTop < activeObjectTop)
            ? (objectTop - objectHeight / 2 - aligningLineOffset)
            : (objectTop + objectHeight / 2 + aligningLineOffset),
          y2: (activeObjectTop > objectTop)
            ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
            : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
        });
        activeObject.setPositionByOrigin(new fabric.Point(objectLeft - objectWidth / 2 + activeObjectWidth / 2, activeObjectTop), 'center', 'center');
      }
  
      // 中间竖线
      if (isInRange(objectLeft, activeObjectLeft)) {
        verticalInTheRange = true;
        verticalLines.push({
          x: objectLeft,
          y1: (objectTop < activeObjectTop)
            ? (objectTop - objectHeight / 2 - aligningLineOffset)
            : (objectTop + objectHeight / 2 + aligningLineOffset),
          y2: (activeObjectTop > objectTop)
            ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
            : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
        });
        activeObject.setPositionByOrigin(new fabric.Point(objectLeft, activeObjectTop), 'center', 'center');
      }
      
      // 右对齐线
      if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
        verticalInTheRange = true;
        verticalLines.push({
          x: objectLeft + objectWidth / 2,
          y1: (objectTop < activeObjectTop)
            ? (objectTop - objectHeight / 2 - aligningLineOffset)
            : (objectTop + objectHeight / 2 + aligningLineOffset),
          y2: (activeObjectTop > objectTop)
            ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
            : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
        });
        activeObject.setPositionByOrigin(new fabric.Point(objectLeft + objectWidth / 2 - activeObjectWidth / 2, activeObjectTop), 'center', 'center');
      }
      
      
      // 上对齐线
      if (isInRange(objectTop - objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
        horizontalInTheRange = true;
        horizontalLines.push({
          y: objectTop - objectHeight / 2,
          x1: (objectLeft < activeObjectLeft)
            ? (objectLeft - objectWidth / 2 - aligningLineOffset)
            : (objectLeft + objectWidth / 2 + aligningLineOffset),
          x2: (activeObjectLeft > objectLeft)
            ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
            : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
        });
        activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop - objectHeight / 2 + activeObjectHeight / 2), 'center', 'center');
      }
  
      // 中间横线
      if (isInRange(objectTop, activeObjectTop)) {
        horizontalInTheRange = true;
        horizontalLines.push({
          y: objectTop,
          x1: (objectLeft < activeObjectLeft)
            ? (objectLeft - objectWidth / 2 - aligningLineOffset)
            : (objectLeft + objectWidth / 2 + aligningLineOffset),
          x2: (activeObjectLeft > objectLeft)
            ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
            : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
        });
        activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop), 'center', 'center');
      }
      
      // 下对齐线
      if (isInRange(objectTop + objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
        horizontalInTheRange = true;
        horizontalLines.push({
          y: objectTop + objectHeight / 2,
          x1: (objectLeft < activeObjectLeft)
            ? (objectLeft - objectWidth / 2 - aligningLineOffset)
            : (objectLeft + objectWidth / 2 + aligningLineOffset),
          x2: (activeObjectLeft > objectLeft)
            ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
            : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
        });
        activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop + objectHeight / 2 - activeObjectHeight / 2), 'center', 'center');
      }
     
    }
    
    if (!horizontalInTheRange) {
      horizontalLines.length = 0;
    }
    
    if (!verticalInTheRange) {
      verticalLines.length = 0;
    }
  });
  
  canvas.on('before:render', function() {
    status = canvas.showGuideline
    if (!status) return
    if(canvas._target !== undefined || canvas._target!==null){   //当选择在组件上则不清空
      canvas.clearContext(canvas.contextContainer); // 清除对齐线
    }
  });
  
  canvas.on('after:render', function() {
    if (!status) return
    for (var i = verticalLines.length; i--; ) {
      drawVerticalLine(verticalLines[i]);
    }
    for (var i = horizontalLines.length; i--; ) {
      drawHorizontalLine(horizontalLines[i]);
    }
    verticalLines.length = horizontalLines.length = 0;
  });
  canvas.on('mouse:down', function() {
    if (!status) return
    verticalLines.length = horizontalLines.length = 0;
    
    canvas.renderAll();
  });
  canvas.on('mouse:up', function() {
    if (!status) return
    verticalLines.length = horizontalLines.length = 0;
    canvas.renderAll();
  });
}

export default initAligningGuidelines;
