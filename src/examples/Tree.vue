<template>
<ul class="child-ul-wrapper" :class="float">
  <li v-for="i in itemchildren" :key="i.name" class="child-li-wrapper">
    <div v-if="i.children && i.children.length > 0" class="has-child">
      <div class="parent-name btn-wrapper-simple">
        <i :class="i.icoName ? i.icoName : ''" class="nav-icon-fontawe"></i>
        <span class="nav-name-right">{{i.btnName}}</span>
        <i class="icon"></i></div>
      <tree-child-component :itemchildren="i.children" @childhandler="fnHandler" :float="float" />
    </div>
    <div v-else>
      <div @click.stop="fnHandler(i)" class="no-child-btn btn-wrapper-simple">
        <i :class="i.icoName ? i.icoName : ''" class="nav-icon-fontawe"></i>
        <span class="nav-name-right">{{i.btnName}}</span>
      </div>
    </div>
  </li>
</ul>
</template>

<script>
export default {
  name: 'tree-child-component',
  props: ['itemchildren', 'float'],
  methods: {
    fnHandler (item) {
      this.$emit('childhandler', item)
    }
  }
}
</script>

<style scoped>
.float-status-1 {
  left: 100%;
  bottom: -1px;
  z-index: 10001
}

.float-status-2 {
  left: 100%;
  top: -1px;
  z-index: 10001
}

.float-status-3 {
  right: 100%;
  top: -1px;
  z-index: 10001
}

.float-status-4 {
  right: 100%;
  bottom: -1px;
  z-index: 10001
}

.child-ul-wrapper .has-child {
  padding: 5px 10px;
  position: relative;
}

li {
  list-style: none;
}

.parent-name .icon {
  position: absolute;
  display: block;
  top: 4px;
  right: 0;
  /*border-top: 4px solid transparent;
        border-left: 8px solid #111111;
        border-bottom: 4px solid transparent;
        border-right: 4px solid transparent;*/
  width: 12px;
  height: 12px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAzklEQVQ4T7XUu2pCQRSF4U8ICJGAqbzFKhK18/0fI2VQC0lIEYmFIoKNbBhB5RjHo5l2Zv2stS9TcadTOeHUUcPXtfwi0AjfmGKbCzwFhe4NbawwwSIHVgQKXQuveEjOZpdg50Chi1r18Iw5xticA/4F2mvCWTfV6wM/RbAcUOjC1QBVfCZ3R7xc0F40RANLvB929VpQuGreAnpCuHm8JdpL6l4MZ6liR+x+ilK6/bFz0faIFKtSaiA7CbJOkN9LUx33/7a0d/tGclIUvtkBJI8oE+jxLwIAAAAASUVORK5CYII=");
  background-size: contain;
}

.no-child-btn {
  padding: 5px 10px;
}

.child-ul-wrapper {
  background: #ffffff;
  position: absolute;
  display: none;
  border: 1px solid #e8e8e8;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 3px;
}

.child-li-wrapper:hover>.has-child>.child-ul-wrapper {
  display: block;
}

.context-menu-list:hover,
.child-li-wrapper:hover {
  background: #EDF2F6;
  /*// #0062B2;*/
}

.nav-icon-fontawe {
  position: absolute;
}

.nav-name-right {
  white-space: nowrap;
  display: block;
  margin: auto 20px;
}

.btn-wrapper-simple {
  position: relative;
  height: 22px;
  font-family: PingFangSC-Regular, PingFang SC, 'Courier New', Courier, monospace;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
}
</style>
