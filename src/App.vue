<template>
<div class="copy-ps">
    <div class="ps-head"  id="capture">
        <div class="psh-logo">
            zk
        </div>
        <div class="psh-button">
            <b>文件(F)</b>
        </div>
        <div  class="psh-button">
            <b>编辑(E)</b>
        </div>
        <div class="psh-button">
            <b>图像(I)</b>
        </div>
        <div class="psh-button">
            <b class="hover">图层(L)</b>
        </div>
        <div class="psh-button">
            <b>类型(Y)</b>
        </div>
        <div class="psh-button">
            <b>选择(S)</b>
        </div>
        <div class="psh-button">
            <b>滤镜(T)</b>
        </div>
        <div class="psh-button">
            <b>视图(V)</b>
        </div>
        <div class="psh-button">
            <b>窗口(W)</b>
        </div>
        <div class="psh-button">
            <b>帮助(H)</b>
        </div>
        <div class="psh-button" >
            <b>截屏(C)</b>
        </div>
        <div class="psh-button" @click="$refs.canvas.copypaste()">
            <b>复制(D)</b>
        </div>
    </div>

    <div class="ps-head">
        <!--图层多选-->
        <div class="duoxuan" v-if="currentMenu==='suofang'">
            <div class="psh-cur">
                <i style="margin-top:4px; margin-left:5px;margin-right:5px;"><img src="../static/images/photoshop_06.jpg" alt=""></i>

                <i class="currentMenuIcon" :class="currentMenu"></i>
            </div>
            <div class="ps-block">
                <div class="ps-fangda" @click="suofangdirection=true; $refs.canvas.setZoom(zoom+0.1)" :class="suofangdirection?'hover':''"  >
                </div>
                <div class="ps-suoxiao" @click="suofangdirection=false; $refs.canvas.setZoom(zoom-0.1)" :class="!suofangdirection?'hover':''"   >
                </div>
            </div>

            <div class="ps-fenge"></div>

            <div class="ps-block">
                <div class="ps-button-new" @click="$refs.canvas.changeOneZoom()">
                    按1:1居中
                </div>
                <div class="ps-button-new" @click="$refs.canvas.changeBigZoom()">
                    按最大比例居中
                </div>
            </div>
        </div>

        <div class="duoxuan" v-if="currentMenu==='tuozhuai' && hover9index === 0">
            <div class="psh-cur">
                <i style="margin-top:4px; margin-left:5px;margin-right:5px;"><img src="../static/images/photoshop_06.jpg" alt=""></i>

                <i class="currentMenuIcon zhuashou" ></i>
            </div>
            <div class="ps-block">

            </div>

           <!-- <div class="ps-fenge"></div>-->

            <div class="ps-block">
                <div class="ps-button-new" @click="$refs.canvas.changeOneZoom()">
                    按1:1居中
                </div>
                <div class="ps-button-new" @click="$refs.canvas.changeBigZoom()">
                    按最大比例居中
                </div>

            </div>

        </div>

        <div class="duoxuan"  v-if="currentMenu==='tuozhuai' && hover9index === 1">
            <div class="psh-cur">
                <i style="margin-top:4px; margin-left:5px;margin-right:5px;"><img src="../static/images/photoshop_06.jpg" alt=""></i>

                <i class="currentMenuIcon" ></i>
            </div>
            <div class="ps-block">

            </div>

            <!-- <div class="ps-fenge"></div>-->

            <div class="ps-block">
              <div class="ps-button-new">
                <i class="zknicon zknicon-zuoduiqi1"></i>
              </div>
              <div class="ps-button-new">
                <i class="zknicon zknicon-chuizhijunfen"></i>
              </div>
              <div class="ps-button-new">
                <i class="zknicon zknicon-youduiqi1"></i>
              </div>

              <div class="ps-button-new">
                <i class="zknicon zknicon-shangduiqi"></i>
              </div>
              <div class="ps-button-new">
                <i class="zknicon zknicon-shuipingjuzhongduiqi"></i>
              </div>
              <div class="ps-button-new">
                <i class="zknicon zknicon-xiaduiqi"></i>
              </div>

              <div class="ps-button-new">
                <i class="zknicon zknicon-chuizhijunfen"></i>
              </div>

              <div class="ps-button-new">
                <i class="zknicon zknicon-shuipingjunfen"></i>
              </div>

            </div>

        </div>

    </div>

    <div class="ps-body" >
        <!--组件选择-->
        <div class="ps-left">
            <i><img src="../static/images/photoshop_47.jpg" alt=""></i>

            <!--@contextmenu.prevent="openMenu1($event)"-->
            <i class="ps-icon1 ps-icon " >
                <ul  >
                    <li :class="'hover'" > <i class="icon9i"></i> <b>画布仅单选</b></li>
                    <li > <i class="icon9i2"></i> <b>画布可多选</b></li>
                </ul>
            </i>

           <!-- <i class="ps-icon2 ps-icon"></i>-->

           <!-- <i class="ps-icon3 ps-icon"></i>
            <i class="ps-icon4 ps-icon"></i>-->

            <i class="line-h"></i>

            <i class="ps-icon5 ps-icon"></i>
            <i class="ps-icon6 ps-icon"></i>

            <i class="line-h"></i>

            <i class="ps-icon17 ps-icon"
               title="价格"
               @dblclick="draw('Price')"
            ></i>

            <i class="ps-icon7 ps-icon"
               title="文本"
               @dblclick="draw('TextRect')"
            ></i>

            <!-- <i class="ps-icon7 ps-icon"
              title="测试文本"
               @dblclick="draw('TextRectBox')"
            ></i> -->

            <i class="ps-icon8 ps-icon"
              title="圆角矩形"
               @dblclick="draw('Rectangle')"
            ></i>

            <i class="ps-icon82 ps-icon"
            title="矩形"
               @dblclick="draw('Rect')"
            ></i>

            <i class="ps-icon83 ps-icon"
            title="圆形"
               @dblclick="draw('Circle')"
            ></i>

            <i class="ps-icon84 ps-icon"
            title="线条"
               @dblclick="draw('Dottedline')"
            ></i>

            <i class="line-h"></i>

            <!--二维码-->
            <i class="ps-icon23 ps-icon"
            title="二维码"
               @dblclick="draw('Qrcode')"
            ></i>

            <!--条码-->
            <i class="ps-icon24 ps-icon"
            title="条码"
               @dblclick="draw('Barcode')"
            ></i>

            <i class="ps-icon25 ps-icon"
            title="图片"
               @dblclick="draw('Image')"
            ></i>

             <i class="ps-icon26 ps-icon"
            title="html"
               @dblclick="draw('Html')"
            ></i>

             <i class="ps-icon27 ps-icon"
            title="表格"
               @dblclick="draw('tableList')"
            ></i>

            <i class="line-h"></i>

            <i class="ps-icon9 ps-icon ps-more"  :class="hover9index=='1'? (currentMenu==='tuozhuai'?'ps-icon92 hover':'ps-icon92'):(currentMenu==='tuozhuai'?'hover':'')"
                @click = "changeTuozhuai"
                @dblclick = "changeBigZoom" >
                <ul :class=" currentMenu==='tuozhuai' && open9 ?'hover':'' ">
                    <li :class="hover9index===0?'hover':''" @click.stop="selectLi(0)"> <i class="icon9i"></i> <b>画布可移动</b></li>
                    <li :class="hover9index===1?'hover':''" @click.stop="selectLi(1)"> <i class="icon9i2"></i> <b>画布不可移动</b></li>
                </ul>
            </i>

            <i class="ps-icon10 ps-icon" :class="{'hover': currentMenu==='suofang' }" @click="currentMenu='suofang'" ></i>
           <!-- <i class="ps-icon11 "></i>
            <i class="ps-icon12 "></i>-->

        </div>

        <div class="ps-mid">

            <!--左上角-->
            <div class="zuoshang" v-if="zoom===1">

            </div>

             <vuefabricmodule ref="canvas" :idno="id" :BgColor="'#333'" :width="parseInt(width)" :height="parseInt(height)" :boxWidth="boxWidth" :boxHeight="boxHeight" :zoom="parseFloat(zoom)" showRule="NONE" :backgroundColor="background" @changeZoomTo="changeZoomTo" @deleteidsdata="deleteidsdata" @idAdd="idAdd" @deleteId="deleteId" @selectId="selectId" @canvasToData="canvasToData" @object:rotated="objectrotated" @object:scaled="objectscaled" @object:moved="objectmoved" @object:modified="objectmodified"></vuefabricmodule>

        </div>

        <!--细节菜单-->
        <div class="ps-right">
            <i class="right-top"><img src="../static/images/photoshop_47.jpg" alt=""></i>

            <div class="one-but" :class="showhistory?'hover':''">
                <span  @click="showhistory = !showhistory">
                    <i><img src="../static/newps/images/icon-lishi.png" alt=""></i><b>历史</b>
                </span>

                <div class="ps-layerbox" v-if="showhistory">
                    <p class="ps-layer-title"><span><b>历史</b></span>  </p>

                    <div  class="ps-history-data">
                        <p v-for="history in historylist" :key="history" :class="currentHistory === history.id?'hover':(currentHistory < history.id?'disabled':'')"
                            @click="changeHistory(history)">
                            <i class="ficon-add" :class="history.type!=='add'?history.type:''"></i>
                            <b>{{history.name}}</b>
                        </p>

                    </div>
                    <div  class="ps-layer-botButton">

                    </div>
                </div>

            </div>
            <!-- 图层 -->
            <div class="one-but" :class="showlayer?'hover':''" >
                <span @click="showlayer = !showlayer">
                    <i><img src="../static/newps/images/icon-tuceng.png" alt="" ></i><b>图层</b>
                </span>

                <div class="ps-layerbox" v-if="showlayer">
                    <p class="ps-layer-title"><span><b>图层</b></span>  </p>
                    <div  class="ps-layer-search">
                        <div>
                            <select name="" id="">
                                <i class="ps-icon-fangdajing">
                                    <img src="../static/newps/images/icon-fangdajing.png" alt="">
                                </i>
                                <option value="类型" >类型</option>
                                <option value="名称">名称</option>
                            </select>

                        </div>
                        <div>
                            <input type="text">
                        </div>
                    </div>
                    <div  class="ps-layer-button">
                        锁定：
                        <i class="psicon-suo" :class="currentSuo===1?'hover':''" @click="suoAllLine(currentSuo)" ></i>
                        <i class="psicon-shan" @click="deleteAll"></i>
                    </div>
                    <div  class="ps-layer-data">
                        <p v-for="layer in layerlist" :key="layer.id">
                            <span class="icon-show" @click="changeVisble(layer)">
                                <i v-if="!layer.visible">
                                    <img src="../static/newps/images/icon-pseye.png" alt="" >
                                </i>
                                <i v-if="layer.visible">
                                    <img src="../static/newps/images/icon-pseye-2.png" alt="">
                                </i>
                            </span>
                            <span class="layer-list" :class="currentLayer.indexOf(layer.id)>-1?'hover':''"
                                    @click="chooseOneLine(layer)">
                                <span>
                                     <i></i>
                                    <b>
                                        {{layer.name}}
                                    </b>
                                </span>

                                <div class="right" v-if="layer.isSuo===1" >

                                </div>
                            </span>
                        </p>

                    </div>
                    <div  class="ps-layer-botButton">

                    </div>
                </div>
            </div>
            <!-- 参数 -->
            <div class="one-but" :class="showParam?'hover':''" >
                <span @click="showParam = !showParam">
                    <i><img src="../static/newps/images/icon-shuxing.png" alt="" ></i><b>属性</b>
                </span>

                <div>
                    <div class="ps-layerbox" v-if="showParam">
                        <p class="ps-layer-title"><span><b>属性</b></span>  </p>

                        <div class="ps-params-data"  v-if="JSON.stringify(object)!=='{}'">
                            <p class="ps-type-name">组件：</p>
                        </div>

                        <div class="ps-params-data"  v-else>
                            <p class="ps-type-name">无属性</p>
                        </div>

                        <div v-if="JSON.stringify(object)!=='{}'">

                            <div class="ps-params-data" v-if="object.isType==='Text'">
                                <div class="ps-switch" :class="object.textAdvanceProperty == 2?'hover':''"><span>
                                    <b @click="changeObject('textAdvanceProperty', 0)">不使用</b>
                                    <b @click="changeObject('textAdvanceProperty', 2)">自适应</b>
                                </span><i></i></div>
                            </div>

                            <div class="ps-params-data" v-if="object.isType==='Image'">
                                <div class="ps-switch" :class="object.imgText == 'equal'?'':'hover'"><span>
                                    <b @click="changeObject('imgText', 'equal')">适应</b>
                                    <b @click="changeObject('imgText', '')">拉伸</b>
                                </span><i></i></div>
                            </div>

                            <div  class="ps-params-data">

                                <div class="ps-param-line">
                                    <div class="oneparam">
                                        <div class="param-name">
                                            W:
                                        </div>
                                        <div>
                                            <input type="text" v-model="object.width"
                                            @blur="changeObject('width', object.width)" />
                                        </div>
                                    </div>
                                    <div class="oneparam">
                                        <div class="param-name">
                                            H:
                                        </div>
                                        <div>
                                            <input type="text" v-model="object.height"
                                            @blur="changeObject('height', object.height)"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="ps-param-line">
                                    <div class="oneparam">
                                        <div class="param-name">
                                            X:
                                        </div>
                                        <div>
                                            <input type="text" v-model="object.left"
                                            @blur="changeObject('left', object.left)"/>
                                        </div>
                                    </div>
                                    <div class="oneparam">
                                        <div class="param-name">
                                            Y:
                                        </div>
                                        <div>
                                            <input type="text"  v-model="object.top"
                                            @blur="changeObject('top', object.top)"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="ps-param-line">
                                    <div class="oneparam">
                                        <div class="param-name">
                                            角度:
                                        </div>
                                        <div>
                                            <input type="text" v-model="object.angle"
                                            @blur="changeObject('angle', object.angle)"/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div  class="ps-layer-botButton" v-if="object.isType!=='Price'">
                                <div class="color-btn">
                                    <span class="color-background"  @click="showColor = !showColor" :style="'background:'+ object.fillinColor +';'"></span>

                                    <photoshop-picker class="photoshop-color" v-model="colors" v-if="showColor" @ok="changeColor" @cancel="noChangeColor"
                                    head="填充颜色" acceptLabel ="确定" cancelLabel="取消" newLabel="新的" currentLabel="当前"/>
                                </div>

                                <div class="color-btn">
                                    <span class="color-background"  @click="showBorderColor = !showBorderColor" :style="'background:'+ object.stroke +';'"><i></i></span>

                                    <photoshop-picker class="photoshop-color" v-model="BorderColors" v-if="showBorderColor" @ok="changeBorderColor" @cancel="noChangeBorderColor"
                                    head="边框颜色" acceptLabel ="确定" cancelLabel="取消" newLabel="新的" currentLabel="当前"/>
                                </div>

                                <div class="border-btn">
                                    <div class="name">边框：</div>

                                    <div class="form"><input type="text" v-model="object.strokeWidth" @blur="changeObject('strokeWidth', object.strokeWidth)"/></div>

                                    <div class="ps-button-new bordertype" @click="borderstyleshow=!borderstyleshow">
                                        <span>类型</span>
                                        <span class="rightbtn">
                                            <img src="../static/newps/images/xia.png" alt="">
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="borderstyle" v-if="borderstyleshow">
                                <p>描边选项：</p>
                                <div class="borderstylelist">
                                    <div @click="setObjectDash([0, 0])" :class="object.strokeDashArray[1] === 0?'hover':''"><i></i></div>
                                    <div @click="setObjectDash([3, 1])" :class="{'hover':object.strokeDashArray[1] === 1}"><i class="dashed"></i></div>
                                    <div @click="setObjectDash([1, 3])" :class="{'hover':object.strokeDashArray[1] === 3 }"><i class="dotted"></i></div>
                                </div>
                            </div>

                            <div  class="ps-layer-botButton" v-if="object.isType==='Price'">
                               <div class="ps-params-data">
                                    <div class="ps-switch" :class="object.visible?'':'hover'"><span>
                                        <b @click="changeObject('visible', true)">显示</b>
                                        <b @click="changeObject('visible', false)">隐藏</b>
                                    </span><i></i></div>
                                </div>
                            </div>

                            <div  class="ps-layer-botButton" v-if="object.isType==='Price'">
                                <div class="color-btn">
                                    <span class="color-background"  @click="showTextColor = !showTextColor" :style="'background:'+ object.textColor +';'"></span>

                                    <photoshop-picker class="photoshop-color" v-model="textColors" v-if="showTextColor" @ok="changeTextColor" @cancel="noChangeTextColor"
                                    head="文字颜色" acceptLabel ="确定" cancelLabel="取消" newLabel="新的" currentLabel="当前"/>
                                </div>

                                <div class="color-btn">
                                    <span class="color-background"  @click="showBgColor = !showBgColor" :style="'background:'+ object.bgcolor +';'"><i></i></span>

                                    <photoshop-picker class="photoshop-color" v-model="bgColors" v-if="showBgColor" @ok="changeBgColor" @cancel="noChangeBgColor"
                                    head="背景颜色" acceptLabel ="确定" cancelLabel="取消" newLabel="新的" currentLabel="当前"/>
                                </div>
                            </div>

                            <div class="pricebox"  v-if="object.isType==='Price'">
                                <div  class="ps-params-data">
                                 <div class="ps-param-line">
                                    <div class="oneparam">
                                        <div class="param-name">
                                            文本:
                                        </div>
                                        <div>
                                            <input type="text" v-model="object.content"
                                            @blur="changeObject('content', object.content)" />
                                        </div>
                                    </div>
                                    <div class="oneparam">
                                        <div class="param-name">
                                            位数:
                                        </div>
                                        <div>
                                            <input type="text" v-model="object.decimalDigit"
                                            @blur="changeObject('decimalDigit', object.decimalDigit)" />
                                        </div>
                                    </div>
                                </div>
                                <div class="ps-param-line">
                                    <div class="oneparam">
                                        <div class="param-name">
                                            前缀:
                                        </div>
                                        <div>
                                            <input type="text" v-model="object.prefix"
                                            @blur="changeObject('prefix', object.prefix)" />
                                        </div>
                                    </div>
                                    <div class="oneparam">
                                        <div class="param-name">
                                            后缀:
                                        </div>
                                        <div>
                                            <input type="text" v-model="object.postfix"
                                            @blur="changeObject('postfix', object.postfix)"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="ps-param-line">
                                    <div class="oneparam">
                                        <div class="param-name">
                                            千分:
                                        </div>
                                        <div>
                                            <input type="text" v-model="object.thousandSeparator"
                                            @blur="changeObject('thousandSeparator', object.thousandSeparator)"/>
                                        </div>
                                    </div>
                                    <div class="oneparam">
                                        <div class="param-name">
                                            小数:
                                        </div>
                                        <div>
                                            <input type="text"  v-model="object.decimalSeparator"
                                            @blur="changeObject('decimalSeparator', object.decimalSeparator)"/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h3 class="styleTitle">定位</h3>
                            <div class="styleOption">
                                <div class="zknicon zknicon-zuoduiqi" :class="{'hover': object.horizontalAlign===0}" @click="changeObject('horizontalAlign', 0)"></div>
                                <div class="zknicon zknicon-zhongduiqi" :class="{'hover': object.horizontalAlign===1}" @click="changeObject('horizontalAlign', 1)"></div>
                                <div class="zknicon zknicon-youduiqi" :class="{'hover': object.horizontalAlign===2}" @click="changeObject('horizontalAlign', 2)"></div>

                                <div class="zknicon zknicon-dingbuduiqi" :class="{'hover': object.verticalAlign===0}" @click="changeObject('verticalAlign', 0)"></div>
                                <div class="zknicon zknicon-zhongjianduiqi" :class="{'hover': object.verticalAlign===1}" @click="changeObject('verticalAlign', 1)"></div>
                                <div class="zknicon zknicon-dibuduiqi1" :class="{'hover': object.verticalAlign===2}" @click="changeObject('verticalAlign', 2)"></div>
                            </div>

                            <div class="aline"></div>

                            <h3 class="styleTitle">前缀</h3>
                            <div class="styleOption">
                                <div class="zknicon zknicon-jiacu" :class="{'hover': object.prefixIfBold===1}" @click="changeObject('prefixIfBold', object.prefixIfBold===1 ? 0 : 1)"></div>
                                <div class="zknicon zknicon-qingxie" :class="{'hover': object.prefixIfItalic===2}" @click="changeObject('prefixIfItalic', object.prefixIfItalic===2 ? 0 : 2)"></div>
                                <div class="zknicon zknicon-shanchuxian" :class="{'hover': object.prefixIfStrikeThrough===1}" @click="changeObject('prefixIfStrikeThrough', object.prefixIfStrikeThrough===1 ? 0 : 1)"></div>
                                <div class="zknicon zknicon-underline" :class="{'hover': object.prefixIfUnderline===1}" @click="changeObject('prefixIfUnderline',  object.prefixIfUnderline===1 ? 0 : 1)"></div>
                            </div>
                            <div class="styleOption">
                                <div class="zknicon zknicon-shangduiqi" :class="{'hover': object.prefixPlace===0}" @click="changeObject('prefixPlace', 0)"></div>
                                <div class="zknicon zknicon-shuipingjunfen" :class="{'hover': object.prefixPlace===1}" @click="changeObject('prefixPlace', 1)"></div>
                                <div class="zknicon zknicon-xiaduiqi" :class="{'hover': object.prefixPlace===2}" @click="changeObject('prefixPlace', 2)"></div>
                            </div>
                            <div  class="ps-params-data">
                                <div class="ps-param-line">
                                    <div class="oneparam">
                                        <div class="param-name">
                                            字号
                                        </div>
                                        <div>
                                            <input type="text" v-model="object.prefixFontSize"
                                            @blur="changeObject('prefixFontSize', object.prefixFontSize)"/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="aline"></div>

                            <h3 class="styleTitle">整数</h3>
                            <div class="styleOption">
                                <div class="zknicon zknicon-jiacu" :class="{'hover': object.integerIfBold===1}" @click="changeObject('integerIfBold', object.integerIfBold===1 ? 0 : 1)"></div>
                                <div class="zknicon zknicon-qingxie" :class="{'hover': object.integerIfItalic===2}" @click="changeObject('integerIfItalic', object.integerIfItalic===2 ? 0 : 2)"></div>
                                <div class="zknicon zknicon-shanchuxian" :class="{'hover': object.integerIfStrikeThrough===1}" @click="changeObject('integerIfStrikeThrough', object.integerIfStrikeThrough===1 ? 0 : 1)"></div>
                                <div class="zknicon zknicon-underline" :class="{'hover': object.integerIfUnderline===1}" @click="changeObject('integerIfUnderline', object.integerIfUnderline===1 ? 0 : 1)"></div>
                            </div>
                            <div  class="ps-params-data">
                                <div class="ps-param-line">
                                    <div class="oneparam">
                                        <div class="param-name">
                                            字号
                                        </div>
                                        <div>
                                            <input type="text" v-model="object.integerFontSize"
                                            @blur="changeObject('integerFontSize', object.integerFontSize)"/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="aline"></div>

                            <h3 class="styleTitle">小数点</h3>
                            <div class="styleOption">
                                <div class="zknicon zknicon-jiacu" :class="{'hover': object.dotIfBold===1}" @click="changeObject('dotIfBold', object.dotIfBold===1 ? 0 : 1)"></div>
                                <div class="zknicon zknicon-qingxie" :class="{'hover': object.dotIfItalic===2}" @click="changeObject('dotIfItalic', object.dotIfItalic===2 ? 0 : 2)"></div>
                            </div>
                            <div  class="ps-params-data">
                                <div class="ps-param-line">
                                    <div class="oneparam">
                                        <div class="param-name">
                                            字号
                                        </div>
                                        <div>
                                            <input type="text" v-model="object.dotFontSize"
                                            @blur="changeObject('dotFontSize', object.dotFontSize)"/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="aline"></div>

                            <h3 class="styleTitle">小数</h3>
                            <div class="styleOption">
                                <div class="zknicon zknicon-jiacu" :class="{'hover': object.decimalIfBold===1}" @click="changeObject('decimalIfBold', object.decimalIfBold===1 ? 0 : 1)"></div>
                                <div class="zknicon zknicon-qingxie" :class="{'hover': object.decimalIfItalic===2}" @click="changeObject('decimalIfItalic', object.decimalIfItalic===2 ? 0 : 2)"></div>
                                <div class="zknicon zknicon-shanchuxian" :class="{'hover': object.decimalIfStrikeThrough===1}" @click="changeObject('decimalIfStrikeThrough', object.decimalIfStrikeThrough===1 ? 0 : 1)"></div>
                                <div class="zknicon zknicon-underline" :class="{'hover': object.decimalIfUnderline===1}" @click="changeObject('decimalIfUnderline', object.decimalIfUnderline===1 ? 0 : 1)"></div>

                                <div class="zknicon zknicon-xiaoshushangbiao" :class="{'hover': object.decimalPlace===0}" @click="changeObject('decimalPlace', 0)"></div>
                                <div class="zknicon zknicon-xiaoshuxiabiao" :class="{'hover': object.decimalPlace===2}" @click="changeObject('decimalPlace', 2)"></div>
                            </div>
                            <div  class="ps-params-data">
                                <div class="ps-param-line">
                                    <div class="oneparam">
                                        <div class="param-name">
                                            字号
                                        </div>
                                        <div>
                                            <input type="text" v-model="object.decimalFontSize"
                                            @blur="changeObject('decimalFontSize', object.decimalFontSize)"/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="aline"></div>

                             <h3 class="styleTitle">后缀</h3>
                            <div class="styleOption">
                                <div class="zknicon zknicon-jiacu" :class="{'hover': object.postfixIfBold===1}" @click="changeObject('postfixIfBold', object.postfixIfBold===1 ? 0 : 1)"></div>
                                <div class="zknicon zknicon-qingxie" :class="{'hover': object.postfixIfItalic===2}" @click="changeObject('postfixIfItalic', object.postfixIfItalic===2 ? 0 : 2)"></div>
                                <div class="zknicon zknicon-shanchuxian" :class="{'hover': object.postfixIfStrikeThrough===1}" @click="changeObject('postfixIfStrikeThrough', object.postfixIfStrikeThrough===1 ? 0 : 1)"></div>
                                <div class="zknicon zknicon-underline" :class="{'hover': object.postfixIfUnderline===1}" @click="changeObject('postfixIfUnderline', object.postfixIfUnderline===1 ? 0 : 1)"></div>

                            </div>
                            <div class="styleOption">
                                <div class="zknicon zknicon-shangduiqi" :class="{'hover': object.postfixPlace===0}" @click="changeObject('postfixPlace', 0)"></div>
                                <div class="zknicon zknicon-shuipingjunfen" :class="{'hover': object.postfixPlace===1}" @click="changeObject('postfixPlace', 1)"></div>
                                <div class="zknicon zknicon-xiaduiqi" :class="{'hover': object.postfixPlace===2}" @click="changeObject('postfixPlace', 2)"></div>
                                <div class="zknicon zknicon-jiageshangfang" :class="{'hover': object.postfixPlace===3}" @click="changeObject('postfixPlace', 3)"></div>
                                <div class="zknicon zknicon-jiagexiafang" :class="{'hover': object.postfixPlace===4}" @click="changeObject('postfixPlace', 4)"></div>
                            </div>
                            <div  class="ps-params-data">
                                <div class="ps-param-line">
                                    <div class="oneparam">
                                        <div class="param-name">
                                            字号
                                        </div>
                                        <div>
                                            <input type="text" v-model="object.postfixFontSize"
                                            @blur="changeObject('postfixFontSize', object.postfixFontSize)"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <div id="datamax"></div>
</div>
</template>

<script>
import inputSearchVue from './components/inputSearch.vue'
import vuefabricmodule from './components/vuefabricmodule.vue'
import {debounce} from './utils/debounce'
import {
  Material, Compact, Swatches, Slider, Photoshop, Chrome, Sketch, Twitter, Grayscale} from 'vue-color'

export default {
  name: 'App',
  components: {
    inputSearchVue,
    vuefabricmodule,
    'material-picker': Material,
    'compact-picker': Compact,
    'swatches-picker': Swatches,
    'slider-picker': Slider,
    'photoshop-picker': Photoshop,
    'chrome-picker': Chrome,
    'sketch-picker': Sketch,
    'twitter-picker': Twitter,
    'grayscale-picker': Grayscale
  },
  data () {
    return {
      zoom: 2,
      currentLayer: [0, 1],
      currentSuo: 0,
      showlayer: false,
      showParam: false,
      layerlist: [
        {
          id: 0,
          type: 0,
          name: '我是图层',
          isShow: 1,
          isSuo: 1

        },
        {
          id: 1,
          type: 0,
          name: '我是图层',
          isShow: 0,
          isSuo: 1

        },
        {
          id: 2,
          type: 0,
          name: '我是图层',
          isShow: 1,
          isSuo: 1

        },
        {
          id: 3,
          type: 0,
          name: '我是图层',
          isShow: 1,
          isSuo: 0

        },
        {
          id: 4,
          type: 0,
          name: '我是图层',
          isShow: 1,
          isSuo: 0

        }

      ],
      historylist: [
        {
          id: 0,
          name: '新建',
          type: 'add',
          data: []
        },
        {
          id: 1,
          type: 'add',
          name: '新建矩形',
          data: []
        },
        {
          id: 2,
          type: 'bianse',
          name: '改变属性',
          data: []
        },
        {
          id: 3,
          type: 'shanchu',
          name: '删除元素',
          data: []
        },
        {
          id: 4,
          type: 'yidong',
          name: '移动',
          data: []
        },
        {
          id: 5,
          type: 'fuzhi',
          name: '复制',
          data: []
        } ],
      sumHistory: 3,
      currentHistory: 1,
      showhistory: false,

      currentMenu: 'tuozhuai',
      suofangdirection: true,

      id: 1,
      width: '1000',
      height: '600',
      boxWidth: document.documentElement.clientWidth - 120,
      boxHeight: document.documentElement.clientHeight - 62,
      background: '#ffffff',
      /* 颜色选择器 */
      colors: {
        color: '',
        hex: '#194d33',
        hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
        hsv: { h: 150, s: 0.66, v: 0.3, a: 1 },
        rgba: { r: 25, g: 77, b: 51, a: 1 },
        a: 1
      },
      showColor: false,
      object: {
        width: 100,
        height: 100,
        left: 0,
        top: 0,
        fillinColor: '#333333',
        stroke: '#666666',
        strokeWidth: 1,
        strokeDashArray: [3, 1], // [0, 0] [0, 3]
        textAdvanceProperty: 0
      },
      BorderColors: {
        color: '',
        hex: '#194d33',
        hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
        hsv: { h: 150, s: 0.66, v: 0.3, a: 1 },
        rgba: { r: 25, g: 77, b: 51, a: 1 },
        a: 1
      },
      textColors: {
        color: '',
        hex: '#194d33',
        hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
        hsv: { h: 150, s: 0.66, v: 0.3, a: 1 },
        rgba: { r: 25, g: 77, b: 51, a: 1 },
        a: 1
      },
      bgColors: {
        color: '',
        hex: '#194d33',
        hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
        hsv: { h: 150, s: 0.66, v: 0.3, a: 1 },
        rgba: { r: 25, g: 77, b: 51, a: 1 },
        a: 1
      },
      showTextColor: false,
      showBgColor: false,
      showBorderColor: false,
      borderstyleshow: false,
      hover9index: 1,
      open9: false
    }
  },
  created () {
    // this.draw('TextRect')
  },
  methods: {
    // 选择边框类型
    setObjectDash (data) {
      this.$set(this.object, 'strokeDashArray', data)
      this.changeObject('strokeDashArray', data)
    },
    /* 颜色选择器 */
    changeColor () {
      this.$set(this.object, 'fillinColor', this.colors.hex)
      this.changeObject('fillinColor', this.object.fillinColor)
      this.noChangeColor()
    },
    /* 颜色选择器 */
    noChangeColor () {
      this.showColor = false
    },
    /* 颜色选择器 */
    changeBorderColor () {
      this.$set(this.object, 'stroke', this.BorderColors.hex)
      this.changeObject('stroke', this.object.stroke)
      this.noChangeBorderColor()
    },
    /* 颜色选择器 */
    noChangeBorderColor () {
      this.showBorderColor = false
    },
    /* 价格 颜色选择器 */
    changeTextColor () {
      this.$set(this.object, 'textColor', this.textColors.hex)
      this.changeObject('textColor', this.object.textColor)
      this.noChangeTextColor()
    },
    /* 价格 颜色选择器 */
    noChangeTextColor () {
      this.showTextColor = false
    },
    /* 价格背景 颜色选择器 */
    changeBgColor () {
      this.$set(this.object, 'bgcolor', this.bgColors.hex)
      this.changeObject('bgcolor', this.object.bgcolor)
      this.noChangeBgColor()
    },
    /* 价格背景 颜色选择器 */
    noChangeBgColor () {
      this.showBgColor = false
    },
    // 改变历史
    changeHistory (history) {
      this.currentHistory = history.id
    },
    // 选择图层
    chooseOneLine (layer) {
      // console.log(layer);
      if (this.currentLayer.indexOf(layer.id) > -1) {
        let i = this.currentLayer.indexOf(layer.id)
        this.currentLayer.splice(i, 1)
      } else {
        this.currentLayer.push(layer.id)
      }
      // setTimeout(() => {
      //   this.currentSuo = this.returnFirstSuo()
      // }, 10)
    },
    // 批量锁定
    suoAllLine (Bol) {
      if (this.currentLayer.length > 0) {
        this.layerlist.forEach((one, i) => {
          this.currentLayer.forEach((cur) => {
            if (one.id === cur) {
              this.$set(this.layerlist[i], 'isSuo', Bol === 1 ? 0 : 1)
            }
          })
        })
        this.currentSuo === 1 ? this.currentSuo = 0 : this.currentSuo = 1
      }
    },
    // 批量删除
    deleteAll () {
      this.currentLayer.forEach((one, i) => {
        this.$refs.canvas.deleteObjById(one)
      })
      setTimeout(() => {
        this.changeAllObjects() // 图层
      }, 1000)
    },
    // 隐藏显示
    changeVisble (layer) {
      console.log(layer)
      if (layer.visible) {
        this.$refs.canvas.setHidden(layer.id)
      } else {
        this.$refs.canvas.setShow(layer.id)
      }
      setTimeout(() => {
        this.changeAllObjects() // 图层
      }, 1000)
    },
    // 缩放回调
    changeZoomTo (zoom) {
      console.log('画布缩放：', zoom)
      this.zoom = parseFloat(zoom.toFixed(2))
    },
    deleteidsdata (ids) {
      console.log('删除的id', ids)
      this.changeAllObjects()
    },
    // 新增回调
    idAdd (id) {
      console.log('新增id:', id)
    },
    // 删除回调
    deleteId (ids) {
      console.log('删除id:', ids)
      this.changeAllObjects()
    },
    // 选择回调
    async selectId (ids) {
      await debounce(async () => {
        console.log('选择id:', ids)
        if (ids.length === 1) {
          this.curobj = this.$refs.canvas.getEditObj()
          let obj = this.$refs.canvas.getEditObj()
          console.log('当前元素：', obj)
          this.$set(this.object, 'isType', obj.isType)
          this.$set(this.object, 'width', obj.width)
          this.$set(this.object, 'height', obj.height)
          this.$set(this.object, 'left', parseInt(obj.left))
          this.$set(this.object, 'top', parseInt(obj.top))
          this.$set(this.object, 'fillinColor', obj.fill)
          this.$set(this.object, 'stroke', obj.stroke)
          this.$set(this.object, 'strokeWidth', obj.strokeWidth)
          this.$set(this.object, 'strokeDashArray', obj.strokeDashArray ? obj.strokeDashArray : [0, 0])
          this.$set(this.object, 'textAdvanceProperty', obj.isElasticSize ? obj.isElasticSize : 0)
          this.$set(this.object, 'visible', obj.visible)
          this.$set(this.object, 'angle', obj.angle)

          if (obj.isType === 'Image') {
            this.$set(this.object, 'imgText', 'obj.imgText')
          }

          if (obj.isType === 'Price') {
            this.$set(this.object, 'textColor', obj.textStyle.textColor)
            this.$set(this.object, 'bgcolor', obj.textStyle.bgcolor)
            this.$set(this.object, 'content', obj.textStyle.text)
            this.$set(this.object, 'decimalDigit', obj.textStyle.decimalDigit)
            this.$set(this.object, 'prefix', obj.textStyle.prefix)
            this.$set(this.object, 'postfix', obj.textStyle.postfix)
            this.$set(this.object, 'thousandSeparator', obj.textStyle.thousandSeparator)
            this.$set(this.object, 'decimalSeparator', obj.textStyle.decimalSeparator)
            this.$set(this.object, 'horizontalAlign', obj.textStyle.horizontalAlign)
            this.$set(this.object, 'verticalAlign', obj.textStyle.verticalAlign)

            this.$set(this.object, 'prefixIfBold', obj.textStyle.prefixIfBold)
            this.$set(this.object, 'prefixIfItalic', obj.textStyle.prefixIfItalic)
            this.$set(this.object, 'prefixIfStrikeThrough', obj.textStyle.prefixIfStrikeThrough)
            this.$set(this.object, 'prefixIfUnderline', obj.textStyle.prefixIfUnderline)
            this.$set(this.object, 'prefixPlace', obj.textStyle.prefixPlace)
            this.$set(this.object, 'prefixFontSize', obj.textStyle.prefixFontSize)

            this.$set(this.object, 'integerIfBold', obj.textStyle.integerIfBold)
            this.$set(this.object, 'integerIfItalic', obj.textStyle.integerIfItalic)
            this.$set(this.object, 'integerIfStrikeThrough', obj.textStyle.integerIfStrikeThrough)
            this.$set(this.object, 'integerIfUnderline', obj.textStyle.integerIfUnderline)
            this.$set(this.object, 'integerFontSize', obj.textStyle.integerFontSize)

            this.$set(this.object, 'dotIfBold', obj.textStyle.dotIfBold)
            this.$set(this.object, 'dotIfItalic', obj.textStyle.dotIfItalic)
            this.$set(this.object, 'dotFontSize', obj.textStyle.dotFontSize)

            this.$set(this.object, 'decimalIfBold', obj.textStyle.decimalIfBold)
            this.$set(this.object, 'decimalIfItalic', obj.textStyle.decimalIfItalic)
            this.$set(this.object, 'decimalIfStrikeThrough', obj.textStyle.decimalIfStrikeThrough)
            this.$set(this.object, 'decimalIfUnderline', obj.textStyle.decimalIfUnderline)
            this.$set(this.object, 'decimalPlace', obj.textStyle.decimalPlace)
            this.$set(this.object, 'decimalFontSize', obj.textStyle.decimalFontSize)

            this.$set(this.object, 'postfixIfBold', obj.textStyle.postfixIfBold)
            this.$set(this.object, 'postfixIfItalic', obj.textStyle.postfixIfItalic)
            this.$set(this.object, 'postfixIfStrikeThrough', obj.textStyle.postfixIfStrikeThrough)
            this.$set(this.object, 'postfixIfUnderline', obj.textStyle.postfixIfUnderline)
            this.$set(this.object, 'postfixPlace', obj.textStyle.postfixPlace)
            this.$set(this.object, 'postfixFontSize', obj.textStyle.postfixFontSize)
          }
        } else {
          this.curobj = {}
          this.object = {}
        }
      }, 500)
    },
    // 修改全部图层
    changeAllObjects () {
      this.layerlist = []
      let allobjects = this.$refs.canvas.getObjectsNew()
      console.log('changeAllObjects', allobjects)
      allobjects.forEach(one => {
        if (one.isType !== 'TextRect-text') {
          // this.layerlist.push({
          //   id: one.id,
          //   type: one.isType,
          //   name: one.isType,
          //   isShow: one.visible ? 1 : 0,
          //   isSuo: 0
          // })
          this.layerlist.push(one)
        }
      })
    },
    // 调用文字最大行数换行自适应等变形的方法
    async changeTextType (curobj, text) {
      await debounce(async () => {
        await this.$refs.canvas.changeTextType(curobj, text)
      }, 500)
    },
    // 数据改变画布组件
    changeObject (name, data) {
      console.log(name, data)
      let obj = this.$refs.canvas.getEditObj()
      console.log(obj)
      switch (name) {
        case 'width':
          if (obj.isType === 'Price') { this.$refs.canvas.setPrice(obj, name, data) } else { obj.set({'width': parseInt(data)}) }
          break
        case 'height':
          if (obj.isType === 'Price') { this.$refs.canvas.setPrice(obj, name, data) } else { obj.set({'height': parseInt(data)}) }
          break
        case 'left': obj.set({'left': parseInt(data)})
          break
        case 'angle': obj.set({'angle': parseInt(data)})
          break
        case 'top': obj.set({'top': parseInt(data)})
          break
        case 'strokeWidth': obj.set({'strokeWidth': parseInt(data)}); obj.set({'textPadding': parseInt(data)}); obj.text.set({'textPadding': parseInt(data)}); this.changeTextType(obj, obj.content)
          break
        case 'stroke': obj.set({'stroke': data})
          break
        case 'strokeDashArray': obj.set({'strokeDashArray': [parseInt(data[0] * this.object.strokeWidth), parseInt(data[1] * this.object.strokeWidth)]
        })
          break
        case 'fillinColor':
          obj.set({'fill': data})
          obj.set({'fillinColor': data})
          if (obj.isType === 'Price') { this.$refs.canvas.setPrice(obj, 'bgcolor', data) }
          break
        case 'textAdvanceProperty': this.$set(this.object, 'textAdvanceProperty', data); this.$refs.canvas.exitEditing(); obj.set({'isElasticSize': data}); this.changeTextType(obj, obj.content)
          break
        case 'imgText':
          obj.set({'imgText': data})
          this.$refs.canvas.setSrc(obj, obj.url)
          this.$set(this.object, 'imgText', data)
          break
        case 'visible': obj.set({'visible': data})
          this.$set(this.object, 'visible', data)
          break
        default: this.$set(this.object, name, data)
          if (obj.isType === 'Price') { this.$refs.canvas.setPrice(obj, name, data) }
          break
      }
      obj.setCoords()
      this.$refs.canvas.renderAll()
    },
    // 画布回调
    canvasToData (obj, name) {
      console.log('键盘移动回调：', name, obj)
    },
    // 画布旋转回调
    objectrotated (obj) {
      console.log('objectrotated', obj)
    },
    // 画布缩放回调
    objectscaled (obj) {
      console.log('objectscaled', obj)
    },
    // 画布移动回调
    objectmoved (obj) {
      console.log('objectmoved', obj)
    },
    // 画布操作回调
    objectmodified (e) {
      console.log('0 --- objectmodified', e)
      this.curobj = e.target
      let obj = e.target
      this.$set(this.object, 'width', obj.width)
      this.$set(this.object, 'height', obj.height)
      this.$set(this.object, 'left', parseInt(obj.left))
      this.$set(this.object, 'top', parseInt(obj.top))
      this.$set(this.object, 'fillinColor', obj.fill)
      this.$set(this.object, 'stroke', obj.stroke)
      this.$set(this.object, 'strokeWidth', obj.strokeWidth)
      this.$set(this.object, 'strokeDashArray', obj.strokeDashArray ? obj.strokeDashArray : [0, 0])

      if (obj.isType === 'Image') {
        this.$set(this.object, 'imgText', obj.imgText)
      }
    },
    // 点击画组件
    async draw (name) {
      // this.id = this.id + 1
      let canvaobj, options
      let colors = ['#0ff', '#00f', '#000', '#f00', '#ff0', '#0f0', '#f0f', '#eee', '#ccc', '#efe', '#ef5']
      let messages = ['0我的好时机安居房快捷键萨克副教授看了附近时空大姐夫开始打积分卡仕达及啊看放假撒加分撒酒疯|打开积分看电视剧阿发空间的萨克福建省啦', 'I am Chiniese', '1我的好时机安居房快捷键萨克副教授看了附近时空大姐夫开始打积分卡仕达及啊看放假撒加分撒酒疯|打开积分看电视剧阿发空间的萨克福建省啦', '2我的好时机安居房快捷键萨克副教授看了附近时空大姐夫开始打积分卡仕达及啊看放假撒加分撒酒疯|打开积分看电视剧阿发空间的萨克福建省啦', '3我的好时机安居房快捷键萨克副教授看了附近时空大姐夫开始打积分卡仕达及啊看放假撒加分撒酒疯|打开积分看电视剧阿发空间的萨克福建省啦', '4我的好时机安居房快捷键萨克副教授看了附近时空大姐夫开始打积分卡仕达及啊看放假撒加分撒酒疯|打开积分看电视剧阿发空间的萨克福建省啦', '5我的好时机安居房快捷键萨克副教授看了附近时空大姐夫开始打积分卡仕达及啊看放假撒加分撒酒疯|打开积分看电视剧阿发空间的萨克福建省啦', '6我的好时机安居房快捷键萨克副教授看了附近时空大姐夫开始打积分卡仕达及啊看放假撒加分撒酒疯|打开积分看电视剧阿发空间的萨克福建省啦', '7我的好时机安居房快捷键萨克副教授看了附近时空大姐夫开始打积分卡仕达及啊看放假撒加分撒酒疯|打开积分看电视剧阿发空间的萨克福建省啦', '8我的好时机安居房快捷键萨克副教授看了附近时空大姐夫开始打积分卡仕达及啊看放假撒加分撒酒疯|打开积分看电视剧阿发空间的萨克福建省啦', '9我的好时机安居房快捷键萨克副教授看了附近时空大姐夫开始打积分卡仕达及啊看放假撒加分撒酒疯|打开积分看电视剧阿发空间的萨克福建省啦', '10我的好时机安居房快捷键萨克副教授看了附近时空大姐夫开始打积分卡仕达及啊看放假撒加分撒酒疯|打开积分看电视剧阿发空间的萨克福建省啦', '我是中古的文字4']
      let i = (Math.random() + '').charAt(3)
      switch (name) {
        case 'Rect':
          options = {
            left: 10,
            top: 10,
            width: 200,
            height: 100,
            color: colors[i],
            opacity: 1,
            stroke: '#ff0000',
            strokeWidth: 2,
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
            stroke: '#ff0000',
            strokeWidth: 2,
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
            stroke: '#ff0000',
            strokeWidth: 2,
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
            // stroke: '#ff0000',
            // strokeWidth: 2,
            visible: true
          }
          break

        case 'Image':
          let imgurl = 'http://192.168.100.211/group1/M00/00/5E/rBMAA2OpPcyAEeGqACVYx9jBF8U923.png' // 'http://183.134.78.46:81/group1/M00/01/10/rBMAA2KHQraAE4fbAAAIabvbb5U379.jpg'
          options = {
            left: 10,
            top: 200,
            width: 200,
            height: 100,
            src: imgurl,
            url: imgurl,
            opacity: 0.5,
            stroke: '#ff0000',
            strokeWidth: 0,
            imgText: '',
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
            stroke: '#ff0000',
            strokeWidth: 2,
            visible: true
          }
          // let iimg = await this.loadImage(iconurl)
          // console.log(iimg)
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
            stroke: '#ff0000',
            imgText: 'equal',
            strokeWidth: 2,
            visible: true
          }
          //   let imgnew = await this.loadImage(url)
          //   console.log(imgnew)
          break

        case 'Barcode':
          options = {
            left: 60,
            top: 30,
            width: 150,
            height: 50,
            hasRotatingPoint: false,
            imgText: '69012345679',
            color: '#000',
            bgcolor: '#FFFFFF',
            visible: true,
            stroke: '#ff0000',
            strokeWidth: 0,
            angle: 0

          }
          break

        case 'Qrcode':
          options = {
            left: 200,
            top: 100,
            width: 50,
            height: 50,
            barcodeType: 0, // 0:原二维码 1:datamaxtri
            hasRotatingPoint: false,
            imgText: '69012345679',
            lineColor: '#FF0000',
            bgcolor: '#FFFFFF',
            stroke: '#ff0000',
            strokeWidth: 2,
            visible: true
          }
          break

        case 'Text':
          options = {
            left: 220,
            top: 200,
            fontFamily: '微软雅黑',
            width: 500,
            height: 300,
            fontSize: 50,
            textdemo: '我是Text',
            stroke: '#ff0000',
            strokeWidth: 0,
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
            stroke: '#ff0000',
            strokeWidth: 2,

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
            stroke: '#ff0000',
            strokeWidth: 2,
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
            stroke: '#ff0000',
            strokeWidth: 0,
            padding: 0,
            hasRotatingPoint: true,
            visible: true
          }
          break

        case 'TextRect':
          options = {
            left: 500,
            top: 80,
            hasRotatingPoint: true,
            width: 300,
            height: 200,
            fontColor: '#000000',
            // fill: 'rgba(0,0,0,0)',
            // strokeWidth: 1,

            fontFamily: '宋体',

            visible: true,
            fontSize: 30,
            textdemo: messages[i], // |我的好时机安居房快捷键萨克副教授看了附近时空大姐夫开始打积分卡仕达及啊看放假撒加分撒酒疯|打开积分看电视剧阿发空间的萨克福建省啦
            originXY: ['right', 'bottom'],

            isElasticSize: 1,

            maxLines: 7,
            omitStyleText: '...', // 两个汉字 4个字母
            omitStyle: 1,
            newline: '|',

            minFontSize: 12,
            textAlign: 'left',
            verticalSpace: 0,

            fontWeight: 'bold',
            linethrough: true,
            underline: true,
            fontStyle: 'italic',

            // xLeft: 0,
            // yTop: 0,
            // xRight: 0,
            // yBot: 0,

            fillinColor: '#0f0',
            border: 2,

            angle: 0,
            stroke: '#9864FF',
            strokeWidth: 0
            // strokeDashArray: [3, 1]

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
            height: 200,

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

            width: 300,

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
            stroke: '#ff0000',
            strokeWidth: 0,
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
        case 'Price':
          options = {
            left: 500,
            top: 300,
            width: 400,
            height: 200,
            angle: 0,

            thousandSeparator: ',', // 千分位分隔符
            text: '99.996', // 价格取值

            decimalDigit: 2, // 小数位数
            roundingMode: 4, // 舍入模式   7：无  4：四舍五入 0：向上取整  1：向下取整

            horizontalAlign: 1, // 整体横向对齐 012
            verticalAlign: 1, // 整体竖向对齐 012

            textColor: '#FF55AA', // 文本颜色
            bgcolor: '#FFFF00', // 背景颜色

            bgOpacity: 0, // 背景透明1：透明，0：取背景颜色
            nopadding: 1, // 考虑文字顶和底部去除 1：去除边距，2：保留文字边距
            gizp: 1, // 是否压缩 1：文字小于宽度压缩， 0：不做压缩截取

            stroke: '#000000', // 边框颜色
            strokeWidth: 0, // 边框粗细

            /**
             * 前缀
             */
            prefix: '￥', // 前缀
            'prefixIfBold': 0, // 前缀是否加粗(0:不加粗,1:加粗)
            'prefixIfItalic': 0, // 前缀是否斜体(0:不斜体,2:斜体)
            'prefixIfStrikeThrough': 0, // 前缀是否中划线(0:不中划线,1:中划线)
            'prefixIfUnderline': 0, // 前缀是否下划线(0:不下划线,1:下划线)
            prefixFontType: '微软雅黑', // 字体
            prefixFontSize: 25, // 字号
            prefixPlace: 0, // 前缀的位置  上：0  中：1  下：2
            /**
             * 整数
             */
            'integerIfBold': 0, // 整数部分是否加粗(0:不加粗,1:加粗)
            'integerIfItalic': 0, // 整数部分是否斜体(0:不斜体,2:斜体)
            'integerIfStrikeThrough': 0, // 整数部分是否中划线
            'integerIfUnderline': 0, // 整数部分是否下划线
            integerFontType: '微软雅黑', // 字体
            integerFontSize: 50, // 字号
            /**
             * 小数分隔符
             */
            decimalSeparator: '.', // 小数分隔符
            'dotIfBold': 0, // 小数点是否加粗(0:不加粗,1:加粗)
            'dotIfItalic': 0, // 小数点是否斜体(0:不斜体,2:斜体)
            dotFontType: '宋体', // 字体
            dotFontSize: 50, // 字号
            /**
             * 小数
             */
            'decimalIfBold': 0, // 小数是否加粗(0:不加粗,1:加粗)
            'decimalIfItalic': 0, // 小数是否斜体(0:不斜体,2:斜体)
            'decimalIfStrikeThrough': 0, // 小数是否中划线
            'decimalIfUnderline': 0, // 小数是否下划线
            decimalFontType: '微软雅黑', // 字体
            decimalFontSize: 50, // 字号
            decimalPlace: 0, // 小数在整数的位置  上：0  中：1  下：2
            /**
             * 后缀
             */
            postfix: '/斤', // 后缀suffix
            'postfixIfBold': 0, // 后缀是否加粗(0:不加粗,1:加粗)
            'postfixIfItalic': 0, // 后缀是否斜体(0:不斜体,2:斜体)
            'postfixIfStrikeThrough': 0, // 后缀是否中划线
            'postfixIfUnderline': 0, // 后缀是否下划线
            postfixFontType: '微软雅黑', // 字体
            postfixFontSize: 20, // 字号
            postfixPlace: 0, // 后缀的位置  上：0  中：1  下：2       小数下：3           小数上：4
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

      this.changeAllObjects() // 同步图层
    },
    // 文本改变文字
    textIsUsually () {
      let cur = this.$refs.canvas.getObjectsNew()
      if (!cur && cur[0].isType !== 'TextRect') { return }
      console.log(cur[0].text)

      this.$refs.canvas.textIsUsually(cur[0], 'Update Yourself:| Install all the latest update possible.| Service Pack 2 is a good way to start if you.Update Yourself:| Install all the latest update possible.| Service Pack 2 is a good way to start if you.')
    },
    // 退出编辑
    exitEditing () {
      this.$refs.canvas.exitEditing() // 退出编辑
    },
    // 修改默认按钮
    changeTuozhuai () {
      this.currentMenu = 'tuozhuai'
      this.open9 = !this.open9
    },
    // 缩放比例
    changeBigZoom () {

    },
    // 切换手和选择
    selectLi (no) {
      // console.log(no)
      this.$refs.canvas.changemoveing(no === 0)
      this.hover9index = no
      this.open9 = false
    }
  }
}
</script>

<style scoped lang="scss">
 @import url("../static/iconfont/iconfont.css");
.copy-ps{
        width: 100%;
        height: 100vh;
        font-family: "微软雅黑";
        /*background: url("./../../static/images/photoshop.jpg") no-repeat;*/
    }
    .ps-head{
        width: 100%;
        height: 30px;
        background:url("../static/images/ps_title_bg.jpg") repeat-x;
        display: flex;
        flex-direction: row;

        color:#fff;

        b{
            font-weight: normal;
            font-size: 12px;
            padding: 2px 4px;
            border-radius: 4px;
            cursor: pointer;
            border:1px solid #535353;

            &:hover{
                border:1px solid #2c2c2c;
                background:url("../static/images/ps-button-bg.png") repeat-x;
               /* background: black;*/
            }
            &.hover{
                border:1px solid #2c2c2c;
                background: #393939;
            }
            &:active{
                border:1px solid #000;
                background: #000;
            }
        }
        .psh-logo{
            width: 40px;
            text-align: center;
            line-height: 30px;
        }
        .psh-button{
           margin:0 4px;
            padding: 2px 0;
        }
        .duoxuan{
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
        }
        .psh-cur{
            display: flex;
            flex-direction: row;
            align-items: center;
            padding-right:20px;
            position: relative;
            width: 36px;

            &:after{
                content:"";
                position: absolute;
                top:3px;
                right: 0;
                width: 1px;
                height: 20px;
                background: #000;
            }

            .currentMenuIcon{
                width: 24px;
                height: 24px;
                display: inline-block;
                background: url('../static/newps/images/head-yidong.png') no-repeat;
                background-size: 100% 100%;

                &.suofang{
                    background: url('../static/newps/images/head-suofang.png') no-repeat;
                }

                &.zhuashou{
                    background: url('../static/newps/images/head-zhuashou.png') no-repeat;
                }

                &.text{
                    background: url('../static/newps/images/head-text.png') no-repeat;
                }
            }
        }

        .ps-block{
            padding: 0 5px;
            display: flex;
            flex-direction: row;
            align-items: center;

        }

        .ps-button-new{
            cursor: pointer;
            font-size: 12px;
            color:#fff;
            padding: 1px 10px;
            margin:3px 5px;
            border-radius: 4px;
            background: linear-gradient(0deg, #606060 20%, #6c6c6c 50%, #707070 70%);
            border: 1px solid rgba(44,44,44,1);
            user-select: none;

            &:active,&.hover{
                background: #393939;
                border: 1px solid rgba(44,44,44,1);
            }
        }
        .ps-fangda{
            width: 22px;
            height: 22px;
            margin-right: 5px;
            background-size: 100% 100%;
            background: url('../static/newps/images/head-fangda.png') no-repeat;
            &:active,&.hover{
                background: url('../static/newps/images/head-fangda-2.png') no-repeat;
            }
        }
        .ps-suoxiao{
            width: 22px;
            height: 22px;
            background-size: 100% 100%;
            background: url('../static/newps/images/head-suoxiao.png') no-repeat;
            &:active,&.hover{
                background: url('../static/newps/images/head-suoxiao-2.png') no-repeat;
            }
        }

        .ps-fenge{
            width: 1px;
            height: 20px;
            background: #000;
            margin-top:4px;
        }
    }

    .ps-body{
        display: flex;
        flex-direction: row;

    }
    .ps-left{
        width: 40px;
        height: calc(100vh - 60px);
        background:url("../static/images/photoshop_109.jpg") repeat-y;

        i{
            margin: 1px 3px;
            border:1px solid #535353;
            border-radius: 3px;
        }
        i.ps-icon1{
            position: relative;

            width: 30px;
            height: 25px;
            display: inline-block;
            background: url("../static/newps/images/ps-icon1.png") no-repeat;

            &.hover,&:active{
                background: url("../static/newps/images/ps-icon1-2.png") no-repeat;

                &:hover{
                    background: url("../static/newps/images/ps-icon1-2.png") no-repeat;
                }
            }
            &:hover{
                background: url("../static/newps/images/ps-icon1-3.png") no-repeat;
            }

            ul{
                position: absolute;
                top:0;
                left:32px;
                z-index: 999;
                background: #535353;
                padding: 3px 5px;
                border:1px solid #3a3a3a;
                display: none;

                &.hover{
                    display: block;
                }

                >li{
                    width: 150px;
                    list-style: none;
                    display: flex;
                    flex-direction: row;
                    justify-items: center;
                    align-items: center;
                    line-height: 22px;

                    &:hover{
                        background: rgb(109,125,146);
                    }
                    &:before{
                        content:"";
                        width: 5px;
                        height: 5px;
                        background: #fff;
                        margin-right: 5px;
                        margin-left: 5px;
                        visibility: hidden;
                    }

                    &.hover{
                        &:before{
                            visibility: visible;
                        }
                    }

                    i.icon9i{
                        border:none;
                        width: 24px;
                        height: 22px;
                        display: inline-block;
                        background: url("../static/newps/images/ps-icon1.png") no-repeat;
                    }
                    i.icon9i2{
                        border:none;
                        width: 24px;
                        height: 22px;
                        display: inline-block;
                        background: url("../static/newps/images/ps-icon22.png") no-repeat;
                    }
                    b{
                        color:#fff;
                        font-size: 12px;
                        font-weight: normal;
                        font-style: normal;
                        margin-left: 5px;
                        user-select: none;
                    }
                }
            }
        }
        i.ps-icon2{
            width: 30px;
            height: 25px;
            display: inline-block;
            background: url("../static/newps/images/ps-icon22.png") no-repeat;
            &.hover,&:active{
                background: url("../static/newps/images/ps-icon22-2.png") no-repeat;

                &:hover{
                    background: url("../static/newps/images/ps-icon22-2.png") no-repeat;
                }
            }
            &:hover{
                background: url("../static/newps/images/ps-icon22-3.png") no-repeat;
            }
        }

        i.ps-icon3{
            width: 30px;
            height: 25px;
            display: inline-block;
            background: url("../static/newps/images/ps-icon3.png") no-repeat;
            &.hover,&:active{
                background: url("../static/newps/images/ps-icon3-2.png") no-repeat;

                &:hover{
                    background: url("../static/newps/images/ps-icon3-2.png") no-repeat;
                }
            }
            &:hover{
                background: url("../static/newps/images/ps-icon3-3.png") no-repeat;
            }
        }
        i.ps-icon4{
            width: 30px;
            height: 25px;
            display: inline-block;
            background: url("../static/newps/images/ps-icon4.png") no-repeat;
            &.hover,&:active{
                background: url("../static/newps/images/ps-icon4-2.png") no-repeat;

                &:hover{
                    background: url("../static/newps/images/ps-icon4-2.png") no-repeat;
                }
            }
            &:hover{
                background: url("../static/newps/images/ps-icon4-3.png") no-repeat;
            }
        }
        i.ps-icon5{
            width: 30px;
            height: 25px;
            display: inline-block;
            background: url("../static/newps/images/ps-icon5.png") no-repeat;
            &.hover,&:active{
                background: url("../static/newps/images/ps-icon5-2.png") no-repeat;
                &:hover{
                    background: url("../static/newps/images/ps-icon5-2.png") no-repeat;
                }
            }
            &:hover{
                background: url("../static/newps/images/ps-icon5-3.png") no-repeat;
            }
        }
        i.ps-icon6{
            width: 30px;
            height: 25px;
            display: inline-block;
            background: url("../static/newps/images/ps-icon6.png") no-repeat;
            &.hover,&:active{
                background: url("../static/newps/images/ps-icon6-2.png") no-repeat;
                &:hover{
                    background: url("../static/newps/images/ps-icon6-2.png") no-repeat;
                }
            }
            &:hover{
                background: url("../static/newps/images/ps-icon6-3.png") no-repeat;
            }
        }
        i.ps-icon7{
            width: 30px;
            height: 25px;
            display: inline-block;
            background: url("../static/newps/images/ps-icon7.png") no-repeat;
            &.hover,&:active{
                background: url("../static/newps/images/ps-icon7-2.png") no-repeat;
                &:hover{
                    background: url("../static/newps/images/ps-icon7-2.png") no-repeat;
                }
            }
            &:hover{
                background: url("../static/newps/images/ps-icon7-3.png") no-repeat;
            }
        }
        i.ps-icon17{
            width: 30px;
            height: 25px;
            display: inline-block;
            background: url("../static/newps/images/ps-icon17.png") no-repeat;
            &.hover,&:active{
                background: url("../static/newps/images/ps-icon17-2.png") no-repeat;
                &:hover{
                    background: url("../static/newps/images/ps-icon17-2.png") no-repeat;
                }
            }
            &:hover{
                background: url("../static/newps/images/ps-icon17-3.png") no-repeat;
            }
        }
        i.ps-icon8{
            width: 30px;
            height: 25px;
            display: inline-block;
            background: url("../static/newps/images/ps-icon8.png") no-repeat;
            &.hover,&:active{
                background: url("../static/newps/images/ps-icon8-2.png") no-repeat;
                &:hover{
                    background: url("../static/newps/images/ps-icon8-2.png") no-repeat;
                }
            }
            &:hover{
                background: url("../static/newps/images/ps-icon8-3.png") no-repeat;
            }
        }
        i.ps-icon82{
            width: 30px;
            height: 25px;
            display: inline-block;
            background: url("../static/newps/images/ps-icon82.png") no-repeat;
            &.hover,&:active{
                background: url("../static/newps/images/ps-icon82-2.png") no-repeat;
                &:hover{
                    background: url("../static/newps/images/ps-icon82-2.png") no-repeat;
                }
            }
            &:hover{
                background: url("../static/newps/images/ps-icon82-3.png") no-repeat;
            }
        }
        i.ps-icon83{
            width: 30px;
            height: 25px;
            display: inline-block;
            background: url("../static/newps/images/ps-icon83.png") no-repeat;
            &.hover,&:active{
                background: url("../static/newps/images/ps-icon83-2.png") no-repeat;
                &:hover{
                    background: url("../static/newps/images/ps-icon83-2.png") no-repeat;
                }
            }
            &:hover{
                background: url("../static/newps/images/ps-icon83-3.png") no-repeat;
            }
        }
        i.ps-icon23{
            width: 30px;
            height: 25px;
            display: inline-block;
            background: url("../static/newps/images/ps-icon23.png") no-repeat;
            &.hover,&:active{
                background: url("../static/newps/images/ps-icon23-2.png") no-repeat;
                &:hover{
                    background: url("../static/newps/images/ps-icon23-2.png") no-repeat;
                }
            }
            &:hover{
                background: url("../static/newps/images/ps-icon23-3.png") no-repeat;
            }
        }
        i.ps-icon24{
            width: 30px;
            height: 25px;
            display: inline-block;
            background: url("../static/newps/images/ps-icon24.png") no-repeat;
            &.hover,&:active{
                background: url("../static/newps/images/ps-icon24-2.png") no-repeat;
                &:hover{
                    background: url("../static/newps/images/ps-icon24-2.png") no-repeat;
                }
            }
            &:hover{
                background: url("../static/newps/images/ps-icon24-3.png") no-repeat;
            }
        }
        i.ps-icon25{
            width: 30px;
            height: 25px;
            display: inline-block;
            background: url("../static/newps/images/ps-icon25.png") no-repeat;
            &.hover,&:active{
                background: url("../static/newps/images/ps-icon25-2.png") no-repeat;
                &:hover{
                    background: url("../static/newps/images/ps-icon25-2.png") no-repeat;
                }
            }
            &:hover{
                background: url("../static/newps/images/ps-icon25-3.png") no-repeat;
            }
        }
        i.ps-icon26{
            width: 30px;
            height: 25px;
            display: inline-block;
            background: url("../static/newps/images/ps-icon26.png") no-repeat;
            &.hover,&:active{
                background: url("../static/newps/images/ps-icon26-2.png") no-repeat;
                &:hover{
                    background: url("../static/newps/images/ps-icon26-2.png") no-repeat;
                }
            }
            &:hover{
                background: url("../static/newps/images/ps-icon26-3.png") no-repeat;
            }
        }
        i.ps-icon27{
            width: 30px;
            height: 25px;
            display: inline-block;
            background: url("../static/newps/images/ps-icon27.png") no-repeat;
            &.hover,&:active{
                background: url("../static/newps/images/ps-icon27-2.png") no-repeat;
                &:hover{
                    background: url("../static/newps/images/ps-icon27-2.png") no-repeat;
                }
            }
            &:hover{
                background: url("../static/newps/images/ps-icon27-3.png") no-repeat;
            }
        }
        i.ps-icon84{
            width: 30px;
            height: 25px;
            display: inline-block;
            background: url("../static/newps/images/ps-icon84.png") no-repeat;
            &.hover,&:active{
                background: url("../static/newps/images/ps-icon84-2.png") no-repeat;
                &:hover{
                    background: url("../static/newps/images/ps-icon84-2.png") no-repeat;
                }
            }
            &:hover{
                background: url("../static/newps/images/ps-icon84-3.png") no-repeat;
            }
        }
        i.ps-icon9{
            position: relative;

            width: 30px;
            height: 25px;
            display: inline-block;
            background: url("../static/newps/images/ps-icon9.png") no-repeat;
            &.hover,&:active{
                background: url("../static/newps/images/ps-icon9-2.png") no-repeat;

                &:hover{
                    background: url("../static/newps/images/ps-icon9-2.png") no-repeat;
                }
            }
            &:hover{
                background: url("../static/newps/images/ps-icon9-3.png") no-repeat;
            }

            ul{
                position: absolute;
                top:0;
                left:32px;
                z-index: 999;
                background: #606060;
                padding: 3px 5px;
                border:1px solid #3a3a3a;
                display: none;

                &.hover{
                    display: block;
                }

                >li{
                    width: 150px;
                    list-style: none;
                    display: flex;
                    flex-direction: row;
                    justify-items: center;
                    align-items: center;
                    line-height: 22px;

                    &:hover{
                        background: rgb(109,125,146);
                    }
                    &:before{
                        content:"";
                        width: 5px;
                        height: 5px;
                        background: #fff;
                        margin-right: 5px;
                        margin-left: 5px;
                       visibility: hidden;
                    }

                    &.hover{
                        &:before{
                            visibility: visible;
                        }
                    }

                    i.icon9i{
                        border:none;
                        width: 20px;
                        height: 20px;
                        display: inline-block;
                        background: url("../static/newps/images/icon9_i.png") no-repeat;
                    }
                    i.icon9i2{
                        border:none;
                        width: 20px;
                        height: 20px;
                        display: inline-block;
                        background: url("../static/newps/images/icon9_i2.png") no-repeat;
                    }
                    b{
                        color:#fff;
                        font-size: 12px;
                        font-weight: normal;
                        font-style: normal;
                        margin-left: 5px;
                        user-select: none;
                    }
                }
            }
        }
        i.ps-icon92{
            position: relative;

            width: 30px;
            height: 25px;
            display: inline-block;
            background: url("../static/newps/images/ps-icon92-1.png") no-repeat;
            &.hover,&:active{
                background: url("../static/newps/images/ps-icon92-2.png") no-repeat;

                &:hover{
                    background: url("../static/newps/images/ps-icon92-2.png") no-repeat;
                }
            }
            &:hover{
                background: url("../static/newps/images/ps-icon92-3.png") no-repeat;
            }

            ul{
                position: absolute;
                top:0;
                left:32px;
                z-index: 999;
                background: #606060;
                padding: 3px 5px;
                border:1px solid #3a3a3a;
                display: none;

                &.hover{
                    display: block;
                }

                >li{
                    width: 150px;
                    list-style: none;
                    display: flex;
                    flex-direction: row;
                    justify-items: center;
                    align-items: center;
                    line-height: 22px;

                    &:hover{
                        background: rgb(109,125,146);
                    }
                    &:before{
                        content:"";
                        width: 5px;
                        height: 5px;
                        background: #fff;
                        margin-right: 5px;
                        margin-left: 5px;
                        visibility: hidden;
                    }

                    &.hover{
                        &:before{
                            visibility: visible;
                        }
                    }

                    i.icon9i{
                        border:none;
                        width: 20px;
                        height: 20px;
                        display: inline-block;
                        background: url("../static/newps/images/icon9_i.png") no-repeat;
                    }
                    i.icon9i2{
                        border:none;
                        width: 20px;
                        height: 20px;
                        display: inline-block;
                        background: url("../static/newps/images/icon9_i2.png") no-repeat;
                    }
                    b{
                        color:#fff;
                        font-size: 12px;
                        font-weight: normal;
                        font-style: normal;
                        margin-left: 5px;
                        user-select: none;
                    }
                }
            }
        }
        i.ps-icon10{
            width: 30px;
            height: 25px;
            display: inline-block;
            background: url("../static/newps/images/ps-icon10.png") no-repeat;
            &.hover,&:active{
                background: url("../static/newps/images/ps-icon10-2.png") no-repeat;
                &:hover{
                    background: url("../static/newps/images/ps-icon10-2.png") no-repeat;
                }
            }
            &:hover{
                background: url("../static/newps/images/ps-icon10-3.png") no-repeat;
            }
        }
        i.ps-icon11{
            width: 30px;
            height: 51px;
            display: inline-block;
            background: url("../static/newps/images/ps-icon11.png") no-repeat;
        }
        i.ps-icon12{
            width: 30px;
            height: 25px;
            display: inline-block;
            background: url("../static/newps/images/ps-icon12.png") no-repeat;
            &:hover,&:active{
                background: url("../static/newps/images/ps-icon12-3.png") no-repeat;
            }
        }
        i.line-h{
            width: 30px;
            height: 2px;
            margin-top:0;
            display: block;
            background: url("../static/newps/images/line-h.png") no-repeat;
        }
        i.ps-more{
          position: relative;
        }
        ul{
          position: absolute;
          top: 0;
          left: 30px;
          z-index: 3;
        }
    }
    .ps-mid{
        width: calc(100vw - 121px);
        background: #282828;
        position: relative;
        overflow: hidden;
    }
    .ps-right{
       /* position: fixed;
        right: 0;
        top:60px;*/
        width: 81px;
        height: calc(100vh - 60px);
        background: url("../static/images/photoshop-menu-bg.jpg") repeat-y;

        .right-top{
            text-align: center;
            margin:0 auto;
            display: block;
        }
        .one-but{
            position: relative;

            font-size: 12px;
            color:#fff;
            padding: 0 4px;
            margin:3px 8px;
            border-radius: 4px;
            border: 1px solid rgba(44,44,44,0);
            user-select: none;

            &:hover{

                background: linear-gradient(0deg, #606060 20%, #6c6c6c 50%, #707070 70%);
                border: 1px solid rgba(44,44,44,1);
            }
            &:active,&.hover{
                background: #393939;
                border: 1px solid rgba(44,44,44,1);
            }

            span{
                display: flex;
                flex-direction: row;
                align-items: center;

                i{
                    display: inline-block;
                }
                b{
                    font-weight: normal;
                    line-height: 22px;
                    margin-left: 5px;
                }
                /*&:hover{
                    background: black;
                }*/
            }

            .ps-layerbox{
                position: absolute;
                top:0;
                right:66px;
                width:242px;
                background:rgba(83,83,83,1);
                border:1px solid #282828;
                display: flex;
                flex-direction: column;

                .ps-layer-title{
                    height: 16px;
                    border-bottom: 1px solid #282828;
                    background: #393939;
                    span{
                        display: inline-block;
                        background: #535353;
                        padding: 0 5px 0 0;
                        position: relative;

                        &:after{
                            content:"";
                            position:absolute;
                            bottom:-1px;
                            left:0;
                            width: 34px;
                            display: inline-block;
                            height:2px;
                            background: #535353;
                        }
                        b{
                            font-size: 12px;
                            line-height: 16px;
                        }
                    }

                }

                .ps-layer-search{
                    height:28px;
                    border-top:1px solid #707070;
                    border-bottom:1px solid #282828;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    padding: 0 5px;

                    select{
                        border:1px solid #282828;
                        height: 22px;
                        outline: none;
                        background:url("../static/newps/images/icon-fangdajing.png") no-repeat 5px center;
                        background-size:12px 12px;
                    /*linear-gradient(0deg, #606060 20%, #6c6c6c 50%, #707070 70%)*/
                        border-radius: 3px;
                        color:#fff;
                        font-size: 12px;
                        position: relative;
                        text-indent: 20px;
                        width: 80px;

                        .ps-icon-fangdajing{
                            display: inline-block;
                            position: absolute;
                            left:2px;
                            top:1px;
                        }

                        option{
                            color:#333;
                            font-size: 12px;
                        }

                        &:active{
                            background:#3a3a3a url("../static/newps/images/icon-fangdajing.png") no-repeat 5px center;
                            background-size:12px 12px;
                        }
                    }

                    input{
                        background:#3a3a3a;
                        width: 148px;
                        height: 20px;
                        outline: none;
                        text-indent: 5px;
                        margin-left:5px;

                        &:focus{
                            background:#ffffff;
                        }
                    }

                }

                .ps-layer-button{
                    height: 28px;
                    border-top:1px solid #707070;
                    border-bottom:1px solid #282828;
                    padding: 0 5px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    i.psicon-suo{
                        cursor: pointer;
                        width: 22px;
                        height: 23px;
                        background:url("../static/newps/images/yisuo.png") no-repeat;

                        &:hover{
                            background:url("../static/newps/images/yisuo-3.png") no-repeat;
                        }
                        &:active,&.hover{
                            background:url("../static/newps/images/yisuo-2.png") no-repeat;
                        }
                    }
                    i.psicon-shan{
                        cursor: pointer;
                        width: 22px;
                        height: 23px;
                        background:url("../static/newps/images/yishan.png") no-repeat;

                        &:hover{
                            background:url("../static/newps/images/yishan-3.png") no-repeat;
                        }
                        &:active,&.hover{
                            background:url("../static/newps/images/yishan-2.png") no-repeat;
                        }
                    }

                    img{
                        line-height: 30px;
                    }
                }
                .ps-noparams{
                    border-top:1px solid #707070;
                    border-bottom:1px solid #282828;
                    padding: 10px 5px 10px 5px;
                    min-height: 100px;
                }
                .ps-type-name{
                    padding: 0 5px 8px 5px;
                }
                .ps-params-data{
                    // border-top:1px solid #707070;
                    // border-bottom:1px solid #282828;
                    padding: 10px 5px 0 5px;
                    // display: flex;
                    // flex-direction: row;
                    // align-items: center;

                    .ps-switch{
                        margin-left:8px;
                        position: relative;
                        width: 208px;
                        margin-bottom: 10px;
                        border-radius: 5px;
                        height: 28px;
                        background: #3a3a3a;
                        border: 1px solid #383838;

                        span{
                            position: absolute;
                            left:0;
                            top:0;
                            z-index:2;
                            b{
                                cursor: pointer;
                                width: 103px;
                                height: 28px;
                                line-height: 28px;
                                text-align: center;
                                display: inline-block;
                            }
                        }
                        i{
                            position: absolute;
                            cursor: pointer;
                            width: 103px;
                            border-radius: 5px;
                            left:0;
                            top:0;
                            z-index:1;
                            height: 28px;
                            display: inline-block;
                            background: linear-gradient(0deg, #606060 20%, #6c6c6c 50%, #707070 70%);
                        }
                        &.hover{
                            i{
                            position: absolute;
                            cursor: pointer;
                            width: 103px;
                            border-radius: 5px;
                            left:105px;
                            top:0;
                            z-index:1;
                            height: 28px;
                            display: inline-block;
                            background: linear-gradient(0deg, #606060 20%, #6c6c6c 50%, #707070 70%);
                        }
                        }
                    }

                    input{
                        background:#3a3a3a;
                        width: 70px;
                        height: 20px;
                        outline: none;
                        text-indent: 5px;
                        margin-left:5px;
                        color:#fff;

                        &:focus{
                            background:#ffffff;
                            color:#333;
                        }
                    }
                    .ps-param-line{
                        width: 100%;
                        display: flex;
                        flex-direction: row;
                        margin-bottom: 5px;
                        padding-left:8px;
                    }
                    .oneparam{
                        width: 50%;
                        display: flex;
                        flex-direction: row;
                        .param-name{
                            width: 30px;
                            text-align: right;
                        }
                    }

                }
                .ps-history-data{
                    border-bottom:1px solid #282828;
                    height: 350px;
                    overflow-y: scroll;
                    cursor: pointer;

                    p {
                        height: 22px;
                        line-height: 22px;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        border-bottom: 1px solid #282828;
                        background: #525252;

                        &.hover{
                            background: rgb(109,125,146);
                        }

                        i{
                            position: relative;
                            width: 20px;
                            height: 20px;
                            margin:0 10px;
                            background: url('../static/newps/images/icon-history-add.png') no-repeat;

                            &.yidong{
                                background: url('../static/newps/images/icon-history-yidong.png') no-repeat;
                            }
                            &.fuzhi{
                                background: url('../static/newps/images/icon-history-fuzhi.png') no-repeat;
                            }
                            &.shanchu{
                                background: url('../static/newps/images/icon-history-shanchu.png') no-repeat;
                            }
                            &.bianse{
                                background: url('../static/newps/images/icon-history-bianse.png') no-repeat;
                            }
                        }
                        b{
                            font-weight: normal;
                        }

                        &.disabled{

                            b{
                                font-style: italic;
                                color:#767676;
                            }
                        }
                    }
                }
                .ps-layer-data{
                    border-bottom:1px solid #282828;
                    height: 350px;
                    overflow-y: scroll;

                    p{
                        height: 40px;
                        line-height: 40px;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        border-bottom:1px solid #282828;
                        background: #525252;

                        span.icon-show{
                            width: 30px;
                            display: inline-block;
                            border-right: 1px solid #282828;
                            text-align: center;
                            background: #535353;
                            cursor: pointer;
                        }
                        span.layer-list{
                            width: 100%;
                            height: 40px;
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                            cursor: pointer;

                            i{
                                position: relative;
                                width: 30px;
                                height: 30px;
                                border:1px solid #000;
                                margin-left: 5px;
                                margin-right: 10px;
                                background: #fff;
                                z-index:0;

                                &:before{
                                    content:"";
                                    position: absolute;
                                    top:-3px;
                                    left:-3px;
                                    z-index: 2;
                                    width: 36px;
                                    height: 36px;
                                    background: url("../static/newps/images/icon-xuanze.png") no-repeat ;
                                    background-size: 100% 100%;

                                    display: none;

                                }

                            }
                            .right{
                                margin-right: 16px;
                                text-align: right;
                                width: 14px;
                                height: 14px;
                                background: url('../static/newps/images/icon-pssuo-2.png') no-repeat;
                               /* background-size: contain;*/
                            }

                            &.hover{

                                background: rgb(109,125,146);
                               i:before{
                                    display: inline-block;
                                }
                                .right{
                                    background: url('../static/newps/images/icon-pssuo.png') no-repeat;
                                    /*background-size: contain;*/
                                }
                            }
                        }

                    }

                }

                .ps-layer-botButton{
                    padding: 10px 5px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    height: 20px;
                    border-top:1px solid #707070;

                    .color-btn{
                        margin-right:10px;
                        width: 30px;
                        height: 14px;
                        border:1px solid #fff;
                        position: relative;
                        .color-background{
                            background: #999999;
                            display: inline-block;
                            width: 100%;
                            height: 100%;
                            i{
                                width: 10px;
                                height: 1px;
                                border: 1px solid #ffffff;
                                margin: 6px 9px;
                            }
                        }
                    }
                    .border-btn{
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        input{
                            background:#3a3a3a;
                            width: 40px;
                            height: 20px;
                            outline: none;
                            text-indent: 5px;
                            margin-left:5px;
                            color:#fff;

                            &:focus{
                                background:#ffffff;
                                color:#333;
                            }
                        }
                    }
                    .bordertype{
                      display: flex;
                      span.rightbtn{
                        display: inline-block;
                        img{
                            width: 10px;
                            height: 10px;
                        }
                      }
                    }

                    .ps-button-new{
                        font-size: 12px;
                        color:#fff;
                        padding: 1px 10px;
                        margin:3px 5px;
                        border-radius: 4px;
                        background: linear-gradient(0deg, #606060 20%, #6c6c6c 50%, #707070 70%);
                        border: 1px solid rgba(44,44,44,1);
                        user-select: none;

                        &:active,&.hover{
                            background: #393939;
                            border: 1px solid rgba(44,44,44,1);
                        }
                    }
                    .photoshop-color{
                        position: absolute;
                        right: 0;
                        top:15px;
                        color:#333;
                    }
                }

            }

            .borderstyle{
                width: 100%;
                padding: 0px 20px;
                display: inline-block;
                box-sizing: border-box;
                border-bottom: 1px solid #282828;
                p{
                    width: 100%;
                }
                div.borderstylelist{
                    margin-top:5px;
                    margin-bottom: 10px;
                    width: 90%;
                    box-sizing: border-box;
                    background: #464646;
                    border: 1px solid #383838;
                    display: flex;
                    flex-direction: column;
                    z-index:0;
                    >div{
                        width: 100%;
                        line-height: 30px;
                        height:30px;
                        text-align: center;
                        border-bottom:1px solid #333333;
                        cursor: pointer;
                        &:hover{
                            background: #6d7d92;
                        }
                        &.hover{
                            background: #6d7d92;
                        }
                        i{
                            width: 80%;
                            margin:15px 10%;
                            display: inline-block;
                            border-top: 2px solid #ddd;
                            &.dashed{
                                border-top: 2px dashed #ddd;
                            }
                            &.dotted{
                                border-top: 2px dotted #ddd;
                            }
                        }
                    }
                }
            }

        }
    }

    .x-line{
        width: 100%;
        height: 18px;
        left: 18px;
        opacity: 0.8;
        background: #303030 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAASCAYAAAAZk42HAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1MmNmMGFlNi0wYjk5LWIyNDMtODA2Mi04NWIwNDk2MDljYmQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDM5OTQ4ODMxNUQ5MTFFQ0JEQzM4RDdCRTZCNDY5REUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDM5OTQ4ODIxNUQ5MTFFQ0JEQzM4RDdCRTZCNDY5REUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmU0MTdkNzFiLTk0OTQtZTQ0Mi1hNjRiLTFkYjBhY2Q0YzUyYyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1MmNmMGFlNi0wYjk5LWIyNDMtODA2Mi04NWIwNDk2MDljYmQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4duvYiAAAASUlEQVR42mKYOXPmfyBgGOqYiWGYgFGPjHpk1COjHhn1yKhHRj1CikdmzZr1fzCrG94xMthDH5u60cw+6hEaAUZQx2o4eAQgwACJLrFYUjy2MAAAAABJRU5ErkJggg==);

        /*background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAASCAYAAAAZk42HAAAACXBIWXMAAAsTAAALEwEAmpwYAAA5z2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDIwLTEwLTE0VDE0OjUwOjIwKzA4OjAwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjAtMTAtMTRUMTQ6NTM6MTgrMDg6MDA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDIwLTEwLTE0VDE0OjUzOjE4KzA4OjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOjJlNGFiNGFiLTQ5MDQtNzg0Mi04MjQyLTM0ZjE5MWQ5NzQ3MDwveG1wTU06SW5zdGFuY2VJRD4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+eG1wLmRpZDpmZGQ2MzFhNC0yOWQwLTAwNDktYWRiZi1jZmM1ODI0OGMwYTc8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDpmZGQ2MzFhNC0yOWQwLTAwNDktYWRiZi1jZmM1ODI0OGMwYTc8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jcmVhdGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6ZmRkNjMxYTQtMjlkMC0wMDQ5LWFkYmYtY2ZjNTgyNDhjMGE3PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDIwLTEwLTE0VDE0OjUwOjIwKzA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDoyZTRhYjRhYi00OTA0LTc4NDItODI0Mi0zNGYxOTFkOTc0NzA8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjAtMTAtMTRUMTQ6NTM6MTgrMDg6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+NjU1MzU8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjUwPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjE4PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz44Q+t8AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAA8SURBVHja7M+xDQAACAJB99/gp9U1FJ+EhtBcAZ3QAjohQoQIESJEiJCXkO2/bMjFTchKSEIHAAD//wMAQq9ONkf1DTcAAAAASUVORK5CYII=);*/
        border-right:1px dashed #000;
    }
    .y-line{
        width: 18px;
        height: 100%;
        top: 18px;
        opacity: 0.8;
        background:#303030 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAyCAYAAABRYothAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2MDFjZjMxZi0yOWNlLWVmNGQtYmMzYi1mZjAzYTcxZjUzNmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUNGODdFMkQxNUQ5MTFFQ0JEMTNCRUI2MEM2Q0Q2MTUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUNGODdFMkMxNUQ5MTFFQ0JEMTNCRUI2MEM2Q0Q2MTUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmY1MGViYzJkLTUyYTgtNTM0My1iNWM1LTNlNjhjMDMwNjZkZSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2MDFjZjMxZi0yOWNlLWVmNGQtYmMzYi1mZjAzYTcxZjUzNmUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz47V/1ZAAAATElEQVR42uzSMQoAIAwEwSj+v08+e8FWrDSCxR5YKrJMc3dZxSRdn/mZbkX776FxcikiROzHsbeRiY1sZBMb2chGNrKRjWxir0sBBgCG0DRl49d7GwAAAABJRU5ErkJggg==);

        border-bottom:1px dashed #000;
    }
    .number{
        position: absolute;
        font: 10px/1 Arial, sans-serif;
        color: #999;
        cursor: default;
    }
    .x-line .number{
        top: 1px;
    }
    .y-line .number{
        width: 8px;
        left: 1px;
        word-wrap: break-word;
    }

    .zuoshang{
        position: absolute;
        left:0;
        top:0;
        width: 18px;
        height: 18px;
        background: #999;
        z-index: 9;
        color:red;
    }
    .xZhou{
        position: absolute;
        margin-left:18px;
        z-index: 2;
        /* width: 572px;*/
        overflow-x: scroll;
        height: 18px;
        -moz-user-select:none; /*火狐*/
        -webkit-user-select:none; /*webkit浏览器*/
        -ms-user-select:none; /*IE10*/
        -khtml-user-select:none; /*早期浏览器*/
        user-select:none;
    }
    .boxblock{
        position: absolute;
        z-index:2;
        width: 18px;
        height: 18px;
        background: #F5F5F5;
    }
    .yZhou{
        position: absolute;
        margin-top:18px;
        z-index: 2;
        width: 18px;
        overflow-y: scroll;
        /* height: 572px;*/
        -moz-user-select:none; /*火狐*/
        -webkit-user-select:none; /*webkit浏览器*/
        -ms-user-select:none; /*IE10*/
        -khtml-user-select:none; /*早期浏览器*/
        user-select:none;
    }
    .xZhou::-webkit-scrollbar ,.yZhou::-webkit-scrollbar{
        display:none;
    }

    .content::-webkit-scrollbar{
        display: none;
    }
    .scrollx{
        position: absolute;
        z-index: 2;
        width: 10px;
        margin-left:992px;
        height: 500px;
        /*background:rgba(0,0,0,0.1);*/
        i{
            position: absolute;
            cursor: pointer;
            z-index: 99999;
            top:19px;
            right: 1px;
            width: 8px;
            height: 50px;
            background: rgba(0,0,0,0.2);
            opacity: 0.8;
            border-radius: 100px;
            -moz-user-select:none; /*火狐*/
            -webkit-user-select:none; /*webkit浏览器*/
            -ms-user-select:none; /*IE10*/
            -khtml-user-select:none; /*早期浏览器*/
            user-select:none;
            &:hover{
                opacity: 1;
            }
        }
    }

    .scrolly{
        position: absolute;
        z-index: 2;
        height: 10px;
        margin-top:492px;
        width: 1000px;
        /*  background:rgba(0,0,0,0.1);*/
        i{
            position: absolute;
            cursor: pointer;
            z-index: 99999;
            bottom:1px;
            left: 19px;
            width: 50px;
            height: 8px;
            background: rgba(0,0,0,0.2);
            opacity: 0.8;
            border-radius: 100px;
            -moz-user-select:none; /*火狐*/
            -webkit-user-select:none; /*webkit浏览器*/
            -ms-user-select:none; /*IE10*/
            -khtml-user-select:none; /*早期浏览器*/
            user-select:none;
            &:hover{
                opacity: 1;
            }
        }

    }

.pricebox{
    height: 50vh;
    overflow-y: auto;
}
.aline{
    border-top: 1px solid #707070;
    border-bottom: 1px solid #282828;
}
    .styleTitle{
        width: 100%;
        font-size: 12px;
        display: flex;
        flex-direction: row;
        padding: 3px 20px 5px;
        font-weight: normal;
    }
    .styleOption{
        margin: 5px 20px;
        display: flex;
        flex-direction: row;
        .zknicon{
            cursor: pointer;
            font-size: 12px;
            padding: 5px 6px;
            margin-right: 5px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: linear-gradient(0deg, #606060 20%, #6c6c6c 50%, #707070 70%);
            border: 1px solid rgba(44,44,44,1);
            user-select: none;

            &:active,&.hover{
                background: #393939;
                border: 1px solid rgba(44,44,44,1);
            }
        }
    }
</style>

<style>
*{
  margin: 0;
  padding: 0;
  border: 0;
}
    ::-webkit-scrollbar{
        background:-webkit-gradient(linear,left top,right top,color-stop(0%,rgba(202,202,202,0.07)),color-stop(100%,rgba(229,229,229,0.07)));
        background:-webkit-linear-gradient(left,rgba(202,202,202,0.07) 0%,rgba(229,229,229,0.07) 100%);
        background-color:rgba(229,229,229,.3);
        -webkit-box-shadow:0 0 1px 0 rgba(0,0,0,.15) inset,0 1px 0 0 #000;
        box-shadow:0 0 1px 0 rgba(0,0,0,.15) inset,0 1px 0 0 #000;
        overflow:visible;
        border-radius:4px;
        border:solid 1px #A6A6A6;
    }

    ::-webkit-scrollbar-track-piece{
        background: #434343;
    }
    ::-webkit-scrollbar-thumb {
        background:-webkit-gradient(linear,left top,right top,color-stop(0%,rgba(126,126,126,0.05)),color-stop(100%,rgba(117,117,117,0.05)));
        background:-webkit-linear-gradient(left,rgba(126,126,126,0.05) 0%,rgba(117,117,117,0.05) 100%);

        -webkit-box-shadow:0 2px 1px 0 rgba(0,0,0,.05),inset 1px 1px 0 0 #484848;
        box-shadow:0 2px 1px 0 rgba(0,0,0,.05),inset 1px 1px 0 0 #484848;
        background-color:rgba(124,124,124,.9);
        overflow:visible;
        border-radius:4px;
        border:solid 1px #484848;
    }
</style>
