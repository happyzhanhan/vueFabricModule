<template>
  <div id="app">
    <div>
      <inputSearchVue :pname="msg" v-model="init"></inputSearchVue>
      <button @click="commit">去掉</button>
    </div>
  </div>
</template>

<script>
import inputSearchVue from "./components/inputSearch.vue"
export default {
  name: 'app',
  components:{
    inputSearchVue,
  },
  data () {
    return {
      msg: 'Name',
      init: '123456',
      msg2: 'sex',
      init2: '0',
      options:[{
        value: "0",
        label: "男"
      },{
        value: "1",
        label: "女"
      }]
    }
  },
  methods:{
    commit(){
      console.log(this.init,this.init2)
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
  .zzh-button{
    width: 220px;
    margin-top:20px;
    cursor: pointer;
  }
</style>
