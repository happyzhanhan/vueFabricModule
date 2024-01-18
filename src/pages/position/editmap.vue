<template>
<div class="editMap">
  <div class="editMapTop">
    <div class="editMapTopTitle">
      <h1>山姆超市-萧山店 <b>2F</b></h1>
      <p><i class="zkmIcon zkmp-dizhi"></i><b>浙江省杭州市萧山区盈丰街道飞虹路1408号奥体印象城F3</b></p>
    </div>
    <div class="editMapTopButton">
      <div class="editMapButton">
        <i class="zkmIcon zkmp-baocun"></i>
        <b>保存</b>
      </div>
      <s></s>
      <div class="editMapButton">
        <i class="zkmIcon zkmp-fanhui"></i>
        <b>返回</b>
      </div>
      <s></s>
      <div class="editMapButton">
        <i class="zkmIcon zkmp-yulan"></i>
        <b>预览</b>
      </div>
    </div>
  </div>

  <div class="editMapBottom">
    <div class="editMapLeft">

      <div class="baseComponents">
        <p @click="showbase=!showbase">基础组件 <i class="el-icon-arrow-up" :class="{'rotage':!showbase }"></i></p>
        <el-collapse-transition>
          <div class="baseComponentContent" ref="baseComponent" v-show="showbase">
            <span class="oneComponent">
              <i class="zkmIcon zkmp-wenbenbiaoqian"></i>
              <b>文本</b>
            </span>
            <span class="oneComponent">
              <i class="zkmIcon zkmp-tupian"></i>
              <b>图片</b>
            </span>
          </div>
        </el-collapse-transition>
      </div>

      <div class="baseComponents">
        <p @click="showshelf=!showshelf">商品货架 <i class="el-icon-arrow-up" :class="{'rotage':!showshelf }"></i></p>
        <el-collapse-transition>
          <div class="baseComponentContent" ref="baseComponent" v-show="showshelf">
            <span class="oneComponent">
              <i class="zkmIcon zkmp-duitou"></i>
              <b>堆头</b>
            </span>
            <span class="oneComponent">
              <i class="zkmIcon zkmp-dancehuojia"></i>
              <b>单侧货架</b>
            </span>
            <span class="oneComponent">
              <i class="zkmIcon zkmp-shuangcehuojia"></i>
              <b>双侧货架</b>
            </span>
            <span class="oneComponent">
              <i class="zkmIcon zkmp-shouyinhuojia"></i>
              <b>收银货架</b>
            </span>
            <span class="oneComponent">
              <i class="zkmIcon zkmp-bianqianghuojia"></i>
              <b>边墙货架</b>
            </span>
            <span class="oneComponent">
              <i class="zkmIcon zkmp-guishihuojia"></i>
              <b>柜式货架</b>
            </span>
            <span class="oneComponent">
              <i class="zkmIcon zkmp-lengcangshihuojia"></i>
              <b class="moreletter">冷藏箱式货架</b>
            </span>
            <span class="oneComponent">
              <i class="zkmIcon zkmp-zhantaizhuo"></i>
              <b>展台桌</b>
            </span>
          </div>
        </el-collapse-transition>
      </div>

      <div class="baseComponents">
        <p @click="showequipment=!showequipment">设备组件 <i class="el-icon-arrow-up" :class="{'rotage':!showequipment }"></i></p>
        <el-collapse-transition>
          <div class="baseComponentContent" ref="baseComponent" v-show="showequipment">
            <span class="oneComponent">
              <i class="zkmIcon zkmp-dingweijizhan"></i>
              <b>定位基站</b>
            </span>
            <span class="oneComponent">
              <i class="zkmIcon zkmp-putongjizhanxiaoguo"></i>
              <b>普通基站</b>
            </span>
          </div>
        </el-collapse-transition>
      </div>

      <div class="baseComponents">
        <p @click="showarea=!showarea">区域组件 <i class="el-icon-arrow-up" :class="{'rotage':!showarea }"></i></p>
        <el-collapse-transition>
          <div class="baseComponentContent" ref="baseComponent" v-show="showarea">
            <span class="oneComponent">
              <i class="zkmIcon zkmp-juxing"></i>
              <b>矩形</b>
            </span>
            <span class="oneComponent">
              <i class="zkmIcon zkmp-gangbi"></i>
              <b>钢笔工具</b>
            </span>
          </div>
        </el-collapse-transition>
      </div>

      <div class="baseComponents">
        <p @click="showlayer=!showlayer">组件列表 <i class="el-icon-arrow-up" :class="{'rotage':!showlayer }"></i></p>
        <el-collapse-transition>
          <div class="baseComponentContent" ref="layerComponent" v-show="showlayer">

          </div>
        </el-collapse-transition>
      </div>

    </div>

    <div class="editMapMiddle">
      <div class="editMapInfo">

        <div class="editMapTotal">
          <div class="oneTotal">
            <p>
              <span>基站总数:</span>
              <b>45</b>
            </p>
            <p>
              <span>堆头总数:</span>
              <b>45</b>
            </p>
          </div>
          <div class="oneTotal">
            <p>
              <span>收银货架总数:</span>
              <b>45</b>
            </p>
            <p>
              <span>双侧货架总数:</span>
              <b>45</b>
            </p>
          </div>
          <div class="oneTotal">
            <p>
              <span>单侧货架总数:</span>
              <b>45</b>
            </p>
            <p>
              <span>边墙货架总数:</span>
              <b>45</b>
            </p>
          </div>
        </div>
        <div class="mapEditbutton">
          <div class="buttonGroup">
            <el-tooltip class="item" effect="dark" content="鼠标手(拖动移动画布；滚轮居中缩放画布)" placement="top">
              <i class="zknicon zknicon-zhuashou" :class="{'hover': isMoving}" @click="changemoving(true)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="箭头" placement="top">
              <i class="zknicon zknicon-xuanze" :class="{'hover': !isMoving}" @click="changemoving(false)"></i>
            </el-tooltip>
          </div>
          <s></s>
          <div class="buttonGroup">
            <el-tooltip class="item" effect="dark" content="撤销" placement="top">
              <i class="zkmIcon zkmp-chexiao"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="重做" placement="top">
              <i class="zkmIcon zkmp-houtui"></i>
            </el-tooltip>
          </div>
          <s></s>
          <div class="buttonGroup">
            <el-tooltip class="item" effect="dark" content="左对齐" placement="top">
              <i class="zkmIcon zkmp-zuoduiqi"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="居中对齐" placement="top">
              <i class="zkmIcon zkmp-zuoyoujuzhong"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="右对齐" placement="top">
              <i class="zkmIcon zkmp-youduiqi"></i>
            </el-tooltip>
          </div>
          <s></s>
          <div class="buttonGroup">
            <el-tooltip class="item" effect="dark" content="上对齐" placement="top">
              <i class="zkmIcon zkmp-dingbuduiqi"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="中对齐" placement="top">
              <i class="zkmIcon zkmp-shangxiajuzhong"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="下对齐" placement="top">
              <i class="zkmIcon zkmp-dibuduiqi"></i>
            </el-tooltip>
          </div>

          <div class="buttonZoom">
            <b>缩放</b>
            <el-slider class="elslider" v-model="zoom" :min="0.1" :max="5" @change="$refs.canvas.setZoom(zoom)" :format-tooltip="formatTooltip" :step="0.1"></el-slider>
            <div class="buttonZoomshow">{{zoom}}倍</div>
          </div>
        </div>
      </div>

      <div class="editMapContent">
        <vuefabricmodule ref="canvas" :idno="id" :width="parseInt(width)" :height="parseInt(height)" :backgroundColor="backgroundColor" :boxWidth="boxWidth" :boxHeight="boxHeight" :zoom="parseFloat(zoom)" :showMouseRight="true" :showGuideline="true" :showRule="false" @changeZoomTo="changeZoomTo" @idAdd="idAdd" @deleteidsdata="deleteId" @selectId="selectId" @copydata="copydata" @changeLayer="ButChangeLayer" @object:modified="objectmodified" @selection:cleared="selectionCleared" @canvasToData="canvasToData" @mouse:down="mouseDown"></vuefabricmodule>
      </div>

    </div>

    <div class="editMapRight">
      <div class="editMapRightHead">
        <div :class="{'hover':showstyle}" @click="showstyle=true">样式</div>
        <s></s>
        <div :class="{'hover':!showstyle}" @click="showstyle=false">属性</div>
      </div>
      <div class="editMapRightContent">
        <div class="editMapRightOne" v-if="showstyle">
          <p>尺寸和位置</p>
          <div class="mapInput">
            <el-input size="mini" class="mapInputText" v-model="onedata.x">
              <i slot="suffix" class="mapInputI">X</i>
            </el-input>
            <el-input size="mini" class="mapInputText" v-model="onedata.x">
              <i slot="suffix" class="mapInputI">Y</i>
            </el-input>
            <el-input size="mini" class="mapInputText" v-model="onedata.x">
              <i slot="suffix" class="mapInputI">W</i>
            </el-input>
            <el-input size="mini" class="mapInputText" v-model="onedata.x">
              <i slot="suffix" class="mapInputI">H</i>
            </el-input>
            <el-input size="mini" class="mapInputText" v-model="onedata.x">
              <i slot="suffix" class="mapInputI">°</i>
            </el-input>
          </div>
        </div>
        <div class="editMapRightOne" v-if="!showstyle">
          <p>货架类型</p>
          <div class="mapDataText">
            双侧货架
          </div>

          <p>应用货架</p>
          <!-- <el-select v-model="onedata.shelf" size="mini" placeholder="显示对应的货架列表">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select> -->

          <p>是否绑定价签</p>
          <div class="mapDataText">
            是
          </div>

          <p>属于区域</p>
          <div class="mapDataText">
            无
          </div>

          <p>货架尺寸</p>
          <div class="mapDataText">
            1200×520×1100
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import vuefabricmodule from '../../components/vuefabricmodule.vue'
export default {
  name: 'editMap',
  components: {
    vuefabricmodule
  },
  data () {
    return {
      isMoving: false,
      zoom: 1,
      id: 0,
      width: 300,
      height: 500,
      backgroundColor: '#fff',
      boxWidth: document.documentElement.clientWidth - 410,
      boxHeight: window.innerHeight - 140,

      onedata: {
        x: 0,
        y: 0,
        w: 100,
        h: 200,
        a: 0,
        shelf: 'A000001'
      },
      datalist: [

      ],
      options: [{
        value: 'A000001',
        label: '货架1'
      }, {
        value: 'A000002',
        label: '货架2'
      }, {
        value: 'A000003',
        label: '货架3'
      }, {
        value: 'A000004',
        label: '货架4'
      }, {
        value: 'A000005',
        label: '货架5'
      }],
      showbase: true,
      showshelf: true,
      showequipment: true,
      showarea: true,
      showlayer: true,
      showstyle: true
    }
  },
  mounted () {
    window.onresize = () => {
      this.boxWidth = document.documentElement.clientWidth - 410 // 外框宽
      this.boxHeight = document.documentElement.clientHeight - 140 // 外框高
      this.$refs.canvas.discardActive() // 取消所有活跃元素
    }
  },
  computed: {},
  methods: {
    // 缩放格式化显示数据
    formatTooltip (val) {
      return `${val}倍`
    },

    // 顶部按钮区 改变画布的操作状态是 {手：选择箭头}
    changemoving (bol) {
      this.isMoving = bol
      this.$refs.canvas.changemoveing(bol)
    },

    /**
     * vuefabricmodule
     * 初始化画布新增函数
     */
    // 画布区 缩放回调
    changeZoomTo (zoom) {
      this.zoom = parseFloat(zoom.toFixed(1))
    },
    // 画布区 新增回调
    idAdd (id) {
      this.id = id + 1
    },
    // 画布区 删除回调
    deleteId (ids) {
      console.log(ids)
    },
    // 画布区 选择回调
    selectId (ids) {
      console.log(ids)
    },
    // 画布区 复制回调
    copydata (data) {
      console.log(data)
    },
    // 画布区 按钮或鼠标右键图层移动回调
    ButChangeLayer () {

    },
    // 画布区 移动缩放旋转画布中改变数据
    objectmodified (e) {

    },
    // 画布区 元素不被选择后
    selectionCleared (e) {

    },
    // 画布区 键盘上下左右改变数据
    canvasToData (obj, name) {

    },
    // 画布区 点击
    mouseDown (e) {

    }

  }
}
</script>

<style lang="scss" scoped>
@import url("../../../static/zkmapiconfont/iconfont.css");

$backColor: rgba(255, 255, 255, 1);
$hoverColor: #4180F8;

.editMap {
  width: 100%;
  height: 100vh;
  background: #E1E6F6;
  /*background: url("./editmap.png") no-repeat;*/
  background-size: 100%;
  overflow: hidden;
}

.editMapTop {
  width: 100%;
  height: 72px;
  background: $backColor;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .editMapTopTitle {
    min-width: 200px;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    text-align: left;
    padding: 10px 12px;

    h1 {
      font-family: PingFangSC-SNaNpxibold;
      font-weight: 600;
      font-size: 18px;
      color: #454646;
      letter-spacing: 0.38px;

      b {
        color: #4180F8;
      }
    }

    p {
      font-family: PingFangSC-Regular;
      font-weight: 400;
      font-size: 14px;
      color: #6D7278;
      line-height: 32px;
      display: flex;
      flex-direction: row;
      align-items: center;

      i {
        font-size: 18px;
        margin-right: 8px;
      }

      b {
        font-weight: normal;
      }
    }
  }

  .editMapTopButton {
    min-width: 200px;

    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 18px 8px;

    s {
      width: 1px;
      height: 27px;
      background: #D9E0E7;
    }

    .editMapButton {
      display: flex;
      flex-direction: column;
      margin: 0 10px;
      cursor: pointer;

      i {
        width: 25px;
        height: 25px;
        border: 1px solid #D9E0E7;
        border-radius: 3px;
        text-align: center;
        line-height: 25px;
        color: #6D7278;
        font-size: 14px;

      }

      b {
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        color: #6D7278;
        letter-spacing: 0.26px;
      }

      &:hover {
        i {
          border-color: $hoverColor;
          color: $hoverColor;
        }

        b {
          color: $hoverColor;
        }
      }
    }
  }

}

.editMapBottom {
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-top: 3px;
  height: calc(100vh - 77px);

  .editMapLeft {
    width: 200px;
    min-width: 200px;
    margin-right: 3px;
    background: $backColor;
    padding: 10px 5px;
    box-sizing: border-box;

    .baseComponents {
      width: 100%;

      p {
        position: relative;
        margin-bottom: 1px;
        color: #6D7278;
        background: #e4e9ec66;
        border-radius: 5px;
        font-size: 14px;
        line-height: 40px;
        text-align: left;
        text-indent: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;

        i {
          position: absolute;
          right: 10px;
          top: 10px;
          text-align: center;
          transition: all 0.5s;

          &.rotage {
            transform-origin: 70% center;
            transform: rotate(180deg);
          }
        }

        &:hover {
          color: $hoverColor;

          i {
            color: $hoverColor;
          }
        }
      }

      .baseComponentContent {
        padding: 5px 0;
        display: flex;
        flex-wrap: wrap;

        span {
          width: 56px;
          height: 68px;
          text-align: center;
          margin-right: 8px;
          margin-bottom: 9px;
          background: #FFFFFF;
          border: 1px solid #b2c1d080;
          border-radius: 2px;
          display: flex;
          flex-direction: column;

          i {
            font-size: 28px;
            margin-top: 10px;
            color: #6D7278;
          }

          b {
            font-family: PingFangSC-Regular;
            font-weight: 400;
            font-size: 12px;
            line-height: 12px;
            margin-top: 8px;
            color: #6D7278;
            letter-spacing: 0.26px;

            &.moreletter {
              width: 80%;
              margin: 2px auto;
              font-size: 10px;
              text-align: center;
            }
          }

          &:nth-child(3n) {
            margin-right: 0;
          }

          &:nth-last-child(3),
          &:nth-last-child(2),
          &:nth-last-child(1) {
            margin-bottom: 0;
          }

          &:nth-child(n):nth-child(-n+2) {
            margin-bottom: 0;
          }
        }
      }
    }

  }

  .editMapMiddle {
    width: calc(100vw - 410px);

    display: flex;
    flex-direction: column;

    .editMapInfo {
      overflow-x: auto;
      overflow-y: hidden;

      width: 100%;
      height: 60px;
      background: $backColor;

      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .editMapTotal {

        display: flex;
        flex-direction: row;
        padding: 5px 12px;

        .oneTotal {
          position: relative;
          width: 185px;
          display: flex;
          flex-direction: column;
          line-height: 25px;
          text-align: left;

          &:after {
            content: '';
            position: absolute;
            top: 5px;
            right: 20px;
            background: #E1E6F6;
            width: 1px;
            height: 41px;

          }

          span {
            font-family: PingFangSC-Regular;
            font-weight: 400;
            font-size: 14px;
            color: #6D7278;
            letter-spacing: 0.3px;
          }

          b {
            width: 50px;
            display: inline-block;
            text-align: right;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            font-size: 14px;
            color: #6D7278;
            letter-spacing: 0.3px;
          }
        }
      }

      .mapEditbutton {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 20px;

        s {
          width: 1px;
          height: 25px;
          background: #D9E0E7;
        }

        .buttonGroup {
          border: 1px solid #D9E0E7;
          border-radius: 3px;
          display: flex;
          flex-direction: row;
          margin: 0 13px;

          i {
            width: 25px;
            height: 25px;
            display: inline-block;
            text-align: center;
            line-height: 25px;
            font-size: 14px;
            color: #6D7278;
            border-right: 1px solid #D9E0E7;
            cursor: pointer;

            &:last-child {
              border-right: none;
            }

            &:hover {
              background: #E4E9EC;
            }

            &.hover {
              background: $hoverColor;
              color: #fff;
            }

            &.disabled {
              cursor: not-allowed;
              color: rgba(0, 0, 0, 0.25);

              &:hover {
                background: #fff;
              }
            }
          }

        }

        .buttonZoom {
          display: flex;
          flex-direction: row;
          align-items: center;

          b {
            font-family: PingFangSC-Regular;
            font-weight: 400;
            font-size: 14px;
            line-height: 14px;
            color: #6D7278;
            letter-spacing: 0.3px;
            min-width: 66px;
          }

          .elslider {
            width: 124px;
          }

          .buttonZoomshow {
            width: 50px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            font-size: 14px;
            color: #6D7278;
            letter-spacing: 0.3px;
            text-align: right;
          }
        }
      }
    }

    .editMapContent {
      width: 100%;
      margin-top: 3px;
      height: calc(100vh - 138px);
      background: $backColor;
    }
  }

  .editMapRight {
    width: 200px;
    min-width: 200px;
    margin-left: 3px;
    background: $backColor;

    .editMapRightHead {
      height: 39px;
      border-bottom: 1px solid #E1E6F6;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;

      s {
        width: 1px;
        height: 30px;
        background: #E1E6F6;
      }

      >div {
        font-family: PingFangSC-Medium;
        font-weight: 500;
        font-size: 14px;
        color: #666666;
        letter-spacing: 0.3px;
        padding: 3px 21px;
        margin: 0 14px;
        white-space: nowrap;
        border-radius: 5px;
        cursor: pointer;

        &.hover {
          color: #4180F8;
          letter-spacing: 0.3px;
          background: #e4e9ecd4;
        }

        &:hover {
          letter-spacing: 0.3px;
          background: #e4e9ecd4;
        }
      }
    }

    .editMapRightContent {
      width: 100%;

      .editMapRightOne {
        margin: 0 14px;
        box-sizing: border-box;

        .mapInput {
          width: 100%;
          display: flex;
          flex-wrap: wrap;

          .mapInputText {
            width: 83px;
            margin-right: 5px;
            margin-bottom: 5px;

            &:nth-child(2n) {
              margin-right: 0;
            }
          }

          .mapInputI {
            text-decoration: none;
            font-style: normal;
            line-height: 30px;
          }
        }

        .mapDataText {
          border-bottom: 1px solid #b2c1d080;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          font-size: 12px;
          line-height: 30px;
          color: #6D7278;
          letter-spacing: 0.26px;
          text-align: left;
          text-indent: 15px;
        }
      }

      p {
        font-family: PingFangSC-Regular;
        font-weight: bold;
        font-size: 12px;
        color: #6D7278;
        letter-spacing: 0.26px;
        text-align: left;
        line-height: 30px;
      }
    }
  }
}

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  cursor: pointer;
  width: 10px;
  /*width: 5px;*/
  height: 6px;
  background-color: #F5F5F5;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #F5F5F5;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  background-color: #999;
  cursor: pointer;
}
</style>
