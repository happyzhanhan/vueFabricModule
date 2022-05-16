<template>
  <div id="app">
    <img src="./assets/logo.png">
    <inputSearchVue :pname="msg" v-model="init"></inputSearchVue>
    <button @click="commit">去掉</button>
    <router-view/>
  </div>
</template>

<script>
import inputSearchVue from './components/inputSearch.vue'
export default {
  name: 'App',
  components: {
    inputSearchVue
  },
  data () {
    return {
      msg: 'Name',
      init: '123456'
    }
  },
  methods: {
    commit () {
      console.log(this.msg, this.init)
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
</style>
