/**
 * 删除按钮插件
 * @params canvas 当前画布
 * @params position left:{30,-30} right:{w-30, -30} {相对旋转点位置：x,y}
 * @params title 快捷键注释
 * @params img 按钮图片
 * @params fn 点击执行方法
 */

import {on, off} from '../examples/event'
function initCintrolButton(canvas, position, title, img, fn){

  const cloneIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA6ElEQVRYR+2XsQ3CQAxFbRaAYwGguLQwAqNASZiHUMIojEDNNWGBJBNgdEiRgOSQ5YgcSE6V4hx/P33F/xAiPxi5P/yPAJNdzgg4lxIjoJwQ19XGnp6/wSbQVYBv6kWUaTITCZBOXteNM0f+vUjty9BsAiqgNwKjvVsi0QEBp5KmIbezPWB2LkeEiaR5XdPmdraA0EGuoFC9ClACSkAJKIHoBHyi8r/zMk0WHxPRt3ZBaJc0EpEKiE7AZK5CgCF3/7edI4JrubWsRNXwwCOS3eAoTUW+OQ1g9X4BYZuwy+SS2t7uBT9L4A4On/shARGWHAAAAABJRU5ErkJggg=="

  const delIcon = img || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADSElEQVRYR81XS1LiUBQ9N9XaPTOwAbXKMG16BS07wBVoD4WBuILGFYAD6KmuQHYgrsA4FavEDUActlo5Xe/l40tISJCBnWHy8u655577E3zyI59sHysDsAf3dUvkkEAdpC0ideUESRcingCuT1567ZpbxrlSAOzeo219ezuhj44I7DIXk/DEQn927JwtO18IwB4+NAV+TyA7gad4EsjItziCTy/yVDEDS2zLlybBpgi29XlwSlinXmtvlAVkKYDqYNKF4HdwEW4o6HrHzrgMA/afyb4QXQF+6vOCbhYbuQCqw/sLQA7Vvz5w6rWcfhnD6TP2cNKxgJ5+T17M2rVf5plMAJHnBJ4paJb1Og9gyMZIgC0QZ7O2043OLgBQMbfAK+25oLGu8ciQAmER1wGjchBpIgFAqV2+vt4qwa1Dey4TYTiUMOet2m4gDeMxqL+Zt5x981tlOBkD3CZxUJTjKiNEcAXIdN5yGul7tDDDUCQAVIYTVUi2sqhXANSPKr8JNvJAaOOQa1UvVOakHYlCoe6Zt51KDMD48DRvOzrnzScMz1gg3/NAJI3zjn839r3TXS99V2Uwmao64ZM/YgDVwUMfwhNQzmftvU5WHJeBKGtc3WvaigFEFBcpfwHEy5ddbL7uvNOe73k6I1SIDAD3rqJX0VIosiBbwnDQBWQniHmxcQUibGi3qoG9h2A4ofo4azmF/UFfYoDQRa6k8YiFamjv4wAMtQdVli5fNhpZosvS0wKAynCFECSM81LNBkF2lAMRhwC8W12EKeOzVu0oKcxiEHHKmyIslYYZxmNlp4S5LByZaWjQEtfpRCFaYnxVEJmFSF2SV4o1xZtvj8E4xktFe27DMZkAxuleYND/PG85dl4zSvwYxPhtKuBomfE0E4B4i00tEHtmMwo9dXWdXmMKKmzHRNxv/q+BJK5S4TCqu56Fg3WnIj2S+bjSGioayd5LpTGUkh2vXTvPo3bZ+8RQmiHgVcbyMQVnZdkIvGYv2pzSnkegCxuPXkzIvrlo6MUEGIF8TiwmIlsWECwmxiJDkc6HFpP0vEhBR4/WJR410gvRN0fwrN8KGVgYzdRyCuuIwjpAW+d02I5V3gvF9eFfFM0U0b3/AMome+tk+rO4AAAAAElFTkSuQmCC"

  var deleteBtn = document.createElement('img');
  deleteBtn.src = delIcon;

  var cloneImg = document.createElement('img');
  cloneImg.src = cloneIcon;

//  document.onkeydown = function (e) {
//     console.log('document.onkeydown ------------', e)
//     let keyCode = window.event.keyCode
//     if (keyCode === 37) { // ←
//       removeDeleteBtn();
//     }
//     if (keyCode === 38) { // ↑
//       removeDeleteBtn();
//     }
//     if (keyCode === 39) { // →
//       removeDeleteBtn();
//     }
//     if (keyCode === 40) { // ↓
//       removeDeleteBtn();
//     }
//   }


  // 防抖
  const debounce = (() => {
    let timer = null
    return (callback, wait) => {
      clearTimeout(timer)
      timer = setTimeout(callback, wait)
    }
  })();

  canvas.on('selection:created', function(e){
    if(e.target.component === "component"){
      addDeleteBtn();
    }
 });
 
 canvas.on('selection:updated', function(e){
  if(e.target.component === "component"){
    addDeleteBtn();
  }else{
    removeDeleteBtn();
  }
 });
 canvas.on('mouse:down', function(e){
    if(!canvas.getActiveObject()){
       deleteBtn.style.display ='none';
       off(deleteBtn, 'click', null)
    }
 });
             
  canvas.on('object:modified', function(e){
    if(e.target.component === "component"){
      addDeleteBtn();
    }
  });
  canvas.on('object:scaling', function(e){
    deleteBtn.style.display ='none';
    off(deleteBtn, 'click', null)
  });
  canvas.on('object:moving', function(e){
    deleteBtn.style.display ='none';
    off(deleteBtn, 'click', null)
  });
  canvas.on('object:rotating', function(e){
    deleteBtn.style.display ='none';
    off(deleteBtn, 'click', null)
  });
  canvas.on('mouse:wheel', function(e){
    deleteBtn.style.display ='none';
    off(deleteBtn, 'click', null)
  })
  canvas.on('before:selection:cleared', function(e){
    removeDeleteBtn();
  });

 
 


 function addDeleteBtn(){
  debounce(()=>{
    if(deleteBtn){
      deleteBtn.remove() 

      deleteBtn = document.createElement('img');
      deleteBtn.src = delIcon;
      var curobj = canvas.getActiveObject()
      if(!curobj) return
      curobj.setCoords()
      // var absCoords = canvas.getAbsoluteCoords(curobj);
  
      deleteBtn.style.position = "absolute";
      deleteBtn.className = 'delButton' 
      deleteBtn.style.width = 30 +'px';
      deleteBtn.style.height = 30 + 'px';
      deleteBtn.style.display ='none';
      moveDeleteBtn(curobj)
      let canvasbox = document.getElementsByClassName('canvas-container');
      canvasbox[0].append(deleteBtn); 
      on(deleteBtn, 'click', fn || deleteObject)
    }
   
  }, 100)
  
  }
  function moveDeleteBtn(curobj){
    if(!curobj) return
    const x=curobj.oCoords.tl.x, y=curobj.oCoords.tl.y, angle=curobj.angle,w=curobj.width*curobj.zoomX;
    if(w<120){
      deleteBtn.style.display ='none';
      off(deleteBtn, 'click', null)
      return;
    }
    deleteBtn.style.display ='none';
    deleteBtn.style.left = x +'px';
    deleteBtn.style.top = y +'px';
    deleteBtn.title = title || "Delete";
    deleteBtn.style.transformOrigin = 'left top';
    deleteBtn.style.transform = `rotate(${angle}deg) translateY(${-30}px) translateX(${position==='left'?20:w- 50}px) `;
    deleteBtn.style.display ='block';
    deleteBtn.style.cursor ='pointer';
  }
  function removeDeleteBtn(){
    deleteBtn.remove()  
  }


  function deleteObject() {
    var target = canvas.getActiveObject()
    canvas.remove(target);
    canvas.requestRenderAll();
	}

  function cloneObject(eventData, transform) {
    var target = transform.target;
    var canvas = target.canvas;
    target.clone(function(cloned) {
      cloned.left += 10;
      cloned.top += 10;
      canvas.add(cloned);
    });
  }


}
export default initCintrolButton;