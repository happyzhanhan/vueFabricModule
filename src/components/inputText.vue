<template>
 <div class='divBox' v-if='showInputText' @click.stop="noclick" @contextmenu.prevent="">
  <div class="inputText">
    <p>编辑文本内容</p>
    <textarea v-model="data" autofocus>
    我是一个文本框。
    </textarea>
    <div class="inputButton">
      <span class="falsebutton" @click="$emit('closeInputText')">取消</span>
      <span @click="$emit('conformInputText', data)">确定</span>
    </div>
  </div>
 </div>
</template>

<script>
export default {
  name: 'inputText',
  props: {
    showInputText: {
      type: Boolean,
      default: true
    },
    value: {
      type: String,
      default: 'Text'
    }
  },
  watch: {
    value (newval, oldval) {
      this.data = newval
    }
  },
  data () {
    return {
      data: this.value
    }
  },
  methods: {
    noclick (e) {
      e.stopPropagation()
    }
  }
}
</script>

<style scoped lang='scss'>
.divBox{
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  .inputText{
    width:500px;
    height: 200px;
    background: #fff;
    box-shadow: 1px 1px 2px 1px #ddd;
    border-radius: 5px;
    margin: 0 auto;
    transform: translateY(50vh);
    margin-top: -100px;
    padding: 20px;
    box-sizing: border-box;
  }
  p{
    margin-bottom: 5px;
  }
  textarea{
    background-color: #eee;
    width: 460px;
    max-width: 460px;
    min-width: 460px;
    height: 100px;
    max-height:100px;
    min-height: 100px;
    outline: none;
    border: 1px solid #ddd;
  }
  .inputButton{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    span{
      font-size: 12px;
      padding: 10px 20px;
      margin-left: 10px;
      border-radius: 3px;
      background: #1676ff;
      color: #fff;
      &:hover{
        cursor: pointer;
        opacity: 0.5;
      }
      &.disabled{
        cursor: not-allowed;
        background: #eee;
      }
      &.falsebutton{
       background: #ddd;
      }
    }
  }
}
</style>
