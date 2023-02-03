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
        <div class="psh-button" >
            <b>生成条码(s)</b>
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
                <div class="ps-fangda" :class="suofangdirection?'hover':''"  >
                </div>
                <div class="ps-suoxiao" :class="!suofangdirection?'hover':''"   >
                </div>
            </div>

            <div class="ps-fenge"></div>

            <div class="ps-block">
                <div class="ps-button-new" >
                    100%
                </div>
                <div class="ps-button-new" >
                    适应屏幕
                </div>
                <div class="ps-button-new" >
                    按当前缩放比例居中
                </div>
                <div class="ps-button-new" >
                    切换横纵
                </div>
            </div>
        </div>

        <div class="duoxuan" v-if="currentMenu==='tuozhuai'">
            <div class="psh-cur">
                <i style="margin-top:4px; margin-left:5px;margin-right:5px;"><img src="../static/images/photoshop_06.jpg" alt=""></i>

                <i class="currentMenuIcon zhuashou" ></i>
            </div>
            <div class="ps-block">

            </div>

           <!-- <div class="ps-fenge"></div>-->

            <div class="ps-block">
                <div class="ps-button-new" >
                    按当前缩放比例居中
                </div>
                <div class="ps-button-new" >
                    ↖
                </div>

                <div class="ps-button-new" >
                    ↑
                </div>
                <div class="ps-button-new"  >
                    ↗
                </div>
                <div class="ps-button-new"  >
                    ←
                </div>
                <div class="ps-button-new"  >
                    →
                </div>
                <div class="ps-button-new"  >
                    ↙
                </div>
                <div class="ps-button-new"  >
                    ↓
                </div>
                <div class="ps-button-new" >
                    ↘
                </div>

            </div>

        </div>

        <div class="duoxuan" >
            <div class="psh-cur">
                <i style="margin-top:4px; margin-left:5px;margin-right:5px;"><img src="../static/images/photoshop_06.jpg" alt=""></i>

                <i class="currentMenuIcon" ></i>
            </div>
            <div class="ps-block">

            </div>

            <!-- <div class="ps-fenge"></div>-->

            <div class="ps-block">
                <div class="ps-button-new" >
                    <img src="../static/images/ps-button-01.jpg" alt="">
                </div>
                <div class="ps-button-new"  >
                    <img src="../static/images/ps-button-02.jpg" alt="">
                </div>
                <div class="ps-button-new"  >
                    <img src="../static/images/ps-button-03.jpg" alt="">
                </div>
                <div class="ps-button-new" >
                    <img src="../static/images/ps-button-04.jpg" alt="">
                </div>
                <div class="ps-button-new" >
                    <img src="../static/images/ps-button-05.jpg" alt="">
                </div>
                <div class="ps-button-new"  >
                    <img src="../static/images/ps-button-06.jpg" alt="">
                </div>

                <div class="ps-button-new"  >
                    水平居中分布
                </div>

                <div class="ps-button-new"  >
                    垂直居中分布
                </div>

                <div  class="ps-button-new"  >
                    复制粘贴
                </div>

                <div class="ps-button-new"  >
                    显示
                </div>
                <div class="ps-button-new"  >
                    隐藏
                </div>

                <div class="ps-button-new"  @click="textIsUsually">
                    改变自适应
                </div>
                <div class="ps-button-new"  @click="exitEditing">
                退出编辑exitEditing
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
            <i class="ps-icon83 ps-icon"
            title="二维码"
               @dblclick="draw('Qrcode')"
            ></i>

            <!--条码-->
            <i class="ps-icon83 ps-icon"
            title="条码"
               @dblclick="draw('Barcode')"
            ></i>

            <i class="ps-icon82 ps-icon"
            title="图片"
               @dblclick="draw('Image')"
            ></i>

             <i class="ps-icon82 ps-icon"
            title="html"
               @dblclick="draw('Html')"
            ></i>

             <i class="ps-icon82 ps-icon"
            title="表格"
               @dblclick="draw('tableList')"
            ></i>

            <i class="line-h"></i>

            <!-- <i class="ps-icon9 ps-icon"  :class="hover9index=='1'? (currentMenu==='tuozhuai'?'ps-icon92 hover':'ps-icon92'):(currentMenu==='tuozhuai'?'hover':'')"

               @click="changeTuozhuai"
                @dblclick = changeBigZoom>
                <ul :class=" currentMenu==='tuozhuai' &&open9 ?'hover':''">
                    <li :class="hover9index===0?'hover':''" @click="selectLi(0)"> <i class="icon9i"></i> <b>画布可移动</b></li>
                    <li :class="hover9index===1?'hover':''" @click="selectLi(1)"> <i class="icon9i2"></i> <b>画布不可移动</b></li>
                </ul>
            </i> -->

            <i class="ps-icon10 ps-icon" ></i>
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
                        <i class="psicon-shan"></i>
                    </div>
                    <div  class="ps-layer-data">
                        <p v-for="layer in layerlist" :key="layer">
                            <span class="icon-show" @click="layer.isShow===1?layer.isShow=0:layer.isShow=1">
                                <i v-if="layer.isShow===0">
                                    <img src="../static/newps/images/icon-pseye.png" alt="" >
                                </i>
                                <i v-if="layer.isShow===1">
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
        </div>
    </div>

    <div id="datamax"></div>
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
      zoom: 1,
      currentLayer: [0, 1],
      currentSuo: 0,
      showlayer: false,
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

      currentMenu: 'suofang',
      suofangdirection: true,

      id: 1,
      width: '2000',
      height: '600',
      boxWidth: document.documentElement.clientWidth - 120,
      boxHeight: document.documentElement.clientHeight - 62,
      background: '#ffffff'
    }
  },
  methods: {
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
      setTimeout(() => {
        this.currentSuo = this.returnFirstSuo()
      }, 10)
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
    // 缩放回调
    changeZoomTo (zoom) {
      this.zoom = parseFloat(zoom.toFixed(2))
    },
    deleteidsdata (ids) {
      console.log('删除的id', ids)
    },
    // 新增回调
    idAdd (id) {
      console.log('新增id:', id)
    },
    // 删除回调
    deleteId (ids) {
      console.log('删除id:', ids)
    },
    // 选择回调
    selectId (ids) {
      console.log('选择id:', ids)
      if (ids.length === 1) {
        this.curobj = this.$refs.canvas.getEditObj()
      } else {
        this.curobj = {}
      }
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
    objectmodified (obj) {
      console.log('0 --- objectmodified', obj)
    },
    // 点击画组件
    async draw (name) {
      // this.id = this.id + 1
      let canvaobj, options
      let colors = ['#0ff', '#00f', '#000', '#f00', '#ff0', '#0f0', '#f0f', '#eee', '#ccc', '#efe', '#ef5']
      let i = (Math.random() + '').charAt(3)
      switch (name) {
        case 'Rect':
          options = {
            left: 10,
            top: 10,
            width: 200,
            height: 100,
            color: colors[i],
            opacity: 0.5,
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
          let imgurl = 'http://img.daimg.com/uploads/allimg/201010/3-2010101J545.jpg' // 'http://183.134.78.46:81/group1/M00/01/10/rBMAA2KHQraAE4fbAAAIabvbb5U379.jpg'
          options = {
            left: 10,
            top: 200,
            width: 200,
            height: 100,
            src: imgurl,
            url: imgurl,
            opacity: 0.5,
            stroke: '#ff0000',
            strokeWidth: 2,
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
          let iimg = await this.loadImage(iconurl)
          console.log(iimg)
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
            strokeWidth: 2,
            visible: true
          }
          let imgnew = await this.loadImage(url)
          console.log(imgnew)
          break

        case 'Barcode':
          options = {
            left: 60,
            top: 0,
            width: 500,
            height: 100,
            hasRotatingPoint: false,
            imgText: '69012345679',
            color: '#000',
            bgcolor: '#999',
            visible: true,
            stroke: '#ff0000',
            strokeWidth: 2,
            angle: 0

          }
          break

        case 'Qrcode':
          options = {
            left: 200,
            top: 0,
            width: 500,
            height: 500,
            barcodeType: 0, // 0:原二维码 1:datamaxtri
            hasRotatingPoint: false,
            imgText: '69012345679',
            lineColor: '#ff0',
            bgcolor: '#f00',
            stroke: '#ff0000',
            strokeWidth: 2,
            visible: true
          }
          break

        case 'Text':
          options = {
            left: 22,
            top: 500,
            fontFamily: '微软雅黑',
            width: 500,
            height: 300,
            fontSize: 20,
            textdemo: '我是Text',
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
            strokeWidth: 2,

            hasRotatingPoint: true,
            visible: true
          }
          break

        case 'TextRect':
          options = {
            left: 600,
            top: 200,
            hasRotatingPoint: true,
            width: 600,
            height: 200,
            fontColor: '#000000',
            // fill: 'rgba(0,0,0,0)',
            // strokeWidth: 1,

            fontFamily: '宋体',

            visible: true,
            fontSize: 30,
            textdemo: 'Update Yourself:| Install all the latest update possible.| Service Pack 2 is a good way to start if you',
            originXY: ['right', 'bottom'],

            isElasticSize: 0,

            maxLines: 7,
            omitStyleText: '...', // 两个汉字 4个字母
            omitStyle: 1,
            newline: '|',

            minFontSize: 12,
            textAlign: 'left',
            verticalSpace: 0,

            // fontWeight: 'bold',
            // linethrough: true,
            // underline: true,
            // fontStyle: 'italic'

            // xLeft: 0,
            // yTop: 0,
            // xRight: 0,
            // yBot: 0,

            fillinColor: '',
            border: 2,

            stroke: '#9864FF',
            strokeWidth: 4,
            strokeDashArray: [3, 1]

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
            height: 100,

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

            width: 500,

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
            strokeWidth: 2,
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
    },
    // 文本改变文字
    textIsUsually () {
      let cur = this.$refs.canvas.getObjectsNew()
      if (!cur && cur[0].isType !== 'TextRect') { return }
      console.log(cur[0].text)

      this.$refs.canvas.textIsUsually(cur[0], 'Update Yourself:| Install all the latest update possible.| Service Pack 2 is a good way to start if you.Update Yourself:| Install all the latest update possible.| Service Pack 2 is a good way to start if you.')
    },
    exitEditing () {
      this.$refs.canvas.exitEditing() // 退出编辑
    }
  }
}
</script>

<style scoped lang="scss">

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
                    padding: 0 5px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    height: 20px;
                    border-top:1px solid #707070;
                    padding: 0 5px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;;
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
