<template>
<ul class="vue-contextmenu-listWrapper" @contextmenu.stop="" :class="'vue-contextmenuName-' + contextMenuData.menuName">
  <li v-for="item in contextMenuData.menulists" class="context-menu-list" :key="item.btnName">
    <div v-if="item.children && item.children.length > 0" class="has-child">
      <div class="parent-name btn-wrapper-simple" :class="{'no-allow': item.disabled ? item.disabled : false}">
        <i :class="item.icoName ? item.icoName : ''" class="nav-icon-fontawe"></i>
        <span class="nav-name-right hoverbtn">{{item.btnName}}</span>
        <i class="icon hoverbicon"></i>
      </div>
      <Tree :itemchildren="item.children" @childhandler="fnHandler" :float="floatDirection" />
    </div>
    <div v-else>
      <div @click.stop="item.disabled === true ? '' : fnHandler(item)" class="no-child-btn btn-wrapper-simple" :class="{'no-allow': item.disabled ? item.disabled : false}">
        <i :class="item.icoName ? item.icoName : ''" class="nav-icon-fontawe"></i>
        <span class="nav-name-right">{{item.btnName}}</span>
      </div>
    </div>
  </li>
</ul>
</template>

<script>
import Tree from './Tree.vue'
export default {
  name: 'vueContextMenu',
  components: {
    Tree
  },
  data () {
    return {
      floatDirection: 'float-statue-1'
    }
  },
  props: {
    contextMenuData: {
      type: Object,
      requred: false,
      default () {
        return {
          menuName: null,
          axis: {
            x: null,
            y: null
          },
          menulists: [{
            fnHandler: '',
            icoName: '',
            btnName: ''
          }]
        }
      }
    },
    transferIndex: {
      type: Number,
      default: 0
    }
  },
  watch: {
    'contextMenuData.axis' (val) {
      var x = val.x
      var y = val.y
      var innerWidth = window.innerWidth
      var innerHeight = window.innerHeight
      var _this = this
      var index = _this.transferIndex
      var menuName = 'vue-contextmenuName-' + _this.contextMenuData.menuName
      var menu = document.getElementsByClassName(menuName)[index]
      menu.style.display = 'block'
      var menuHeight = this.contextMenuData.menulists.length * 30
      var menuWidth = 150
      menu.style.top = (y + menuHeight > innerHeight ? innerHeight - menuHeight : y) + 'px'
      menu.style.left = (x + menuWidth > innerWidth ? innerWidth - menuWidth : x) + 'px'
      document.addEventListener('mouseup', function (e) {
        // 解决mac电脑在鼠标右键后会执行mouseup事件
        // console.warn(e.button);
        if (e.button === 0 || e.button === 2) {
          menu.style.display = 'none'
        }
      }, false)
      if ((x + 2 * menuWidth) > innerWidth && (y + 2 * menuHeight) > innerHeight) {
        this.floatDirection = 'float-status-4'
      }
      if ((x + 2 * menuWidth) < innerWidth && (y + 2 * menuHeight) > innerHeight) {
        this.floatDirection = 'float-status-1'
      }
      if ((x + 2 * menuWidth) > innerWidth && (y + 2 * menuHeight) < innerHeight) {
        this.floatDirection = 'float-status-3'
      }
      if ((x + 2 * menuWidth) < innerWidth && (y + 2 * menuHeight) < innerHeight) {
        this.floatDirection = 'float-status-2'
      }
    }
  },
  methods: {
    fnHandler (item) {
      // console.log(item.fnHandler);
      this.$emit(item.fnHandler)
    }
  }
}
</script>

<style scoped>
.vue-contextmenu-listWrapper {
  display: none;
  position: fixed;
  z-index: 99999;
  background: #ffffff;
  top: 0;
  left: 0;
  padding: 0;
  border-radius: 2px;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  font-family: PingFangSC-Regular, PingFang SC, 'Courier New', Courier, monospace;
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
}

.vue-contextmenu-listWrapper .context-menu-list {
  position: relative;
  background: #ffffff;
  text-decoration: none;
  list-style: none;
  margin: 3px 0;
  -moz-user-select: none;
  /*火狐*/
  -webkit-user-select: none;
  /*webkit浏览器*/
  -ms-user-select: none;
  /*IE10*/
  -khtml-user-select: none;
  /*早期浏览器*/
  user-select: none;
}

.context-menu-list:hover {
  background: #EDF2F6;
}

/*.context-menu-list .no-child-btn:hover {
        background: #0062B2;
        color:#fff;
    }
    .context-menu-list .has-child:hover .hoverbtn{
        color:#fff!important;
    }
    .context-menu-list .has-child:hover .hoverbicon{
        border-left: 8px solid #ffffff;
    }*/
.context-menu-list .has-child {
  position: relative;
  cursor: pointer;
  padding: 5px 10px;
}

.context-menu-list:hover>.has-child>.child-ul-wrapper {
  display: block;
}

.parent-name .icon {
  position: absolute;
  display: block;
  top: 2px;
  right: 0;
  /*border-top: 4px solid transparent;
        border-left: 8px solid #111111;
        border-bottom: 4px solid transparent;
        border-right: 4px solid transparent;*/
  width: 14px;
  height: 14px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAzklEQVQ4T7XUu2pCQRSF4U8ICJGAqbzFKhK18/0fI2VQC0lIEYmFIoKNbBhB5RjHo5l2Zv2stS9TcadTOeHUUcPXtfwi0AjfmGKbCzwFhe4NbawwwSIHVgQKXQuveEjOZpdg50Chi1r18Iw5xticA/4F2mvCWTfV6wM/RbAcUOjC1QBVfCZ3R7xc0F40RANLvB929VpQuGreAnpCuHm8JdpL6l4MZ6liR+x+ilK6/bFz0faIFKtSaiA7CbJOkN9LUx33/7a0d/tGclIUvtkBJI8oE+jxLwIAAAAASUVORK5CYII=");
  background-size: contain;
}

.no-child-btn {
  padding: 5px 10px;
  cursor: pointer;
}

.nav-icon-fontawe {
  position: absolute;
  left: 0;
}

.nav-name-right {
  margin: 0 20px;
  height: 16px;
  line-height: 16px;
  display: block;
}

.no-allow {
  color: #d3cfcf;
  cursor: not-allowed;
}

.btn-wrapper-simple {
  position: relative;
  height: 16px;
  line-height: 16px;
}
</style>
