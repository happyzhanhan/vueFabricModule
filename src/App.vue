<template>
  <div id="app">
    <div>
      <inputSearchVue pname="width" v-model="width"></inputSearchVue>
      <inputSearchVue pname="height" v-model="height"></inputSearchVue>
      <inputSearchVue pname="background" v-model="background"></inputSearchVue>
      <button @click="commit">改变宽高</button>
    </div>
    <p>缩放：{{zoom}}</p>
    <div>
      <button @click="$refs.canvas.changemoveing(true)">可以移动</button>
      <button @click="$refs.canvas.changemoveing(false)">不可移动</button>
      |
      <button @click="$refs.canvas.changeLeftTop()">↖</button>
      <button @click="$refs.canvas.changeOrigin()">·</button>
      <button @click="$refs.canvas.changeBigZoom()">适配</button>
      <button @click="$refs.canvas.changeOneZoom()">1:1</button>
    </div>
    <!-- <router-view/> -->
    <div class="canvasbox">
    <vuefabricmodule ref="canvas" :width="parseInt(width)" :height="parseInt(height)" :boxWidth="1200" :boxHeight="800" :zoom="parseFloat(zoom)" showRule="ALL" :backgroundColor="background" @changeZoomTo="changeZoomTo"></vuefabricmodule>
    </div>
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
      width: '2000',
      height: '600',
      background: '#f0f',
      zoom: 1
    }
  },
  methods: {
    commit () {
      console.log('width:', this.width, 'height:', this.height)
      this.$refs.canvas.changeWH({width: parseInt(this.width), height: parseInt(this.height), backgroundColor: this.background})
    },
    changeZoomTo (zoom) {
      this.zoom = parseFloat(zoom.toFixed(2))
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.canvasbox{
  width: 1200px;
  height: 800px;
  overflow: auto;
  margin: 0 auto;
  border:1px solid #ddd;
}
/*新样式 统一滚动条*/
::-webkit-scrollbar {
    width: 8px;
    height: 10px;
    background-color: #ebeef5;
}
::-webkit-scrollbar-thumb {
    border-radius:20px;
    /*box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);*/
    background-color: rgba(160, 160, 160, .61);
    cursor: pointer;
}
::-webkit-scrollbar-track{
    /*box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);*/
    border-radius: 10px;
    background:rgba(216, 216, 216, 0.5);
}
</style>
