<template>
<div>
    <b>{{name}}:</b>
    <input type="text" class="zzh-input" v-model="data" @change="changeData">
</div>
</template>

<script>
    export default {
        name: "inputSearch",
        props: {
            pname:{
                type:String,
                default:'名称',
            },
            value:{
                type:String,
                default: ''
            }
        },
        data(){
            return{
                name:this.pname,
                data:this.value,
            }
        },
        watch:{
            value(newval, oldval){
                this.data = newval;
            }
        },
        methods: {
            changeData(){
                this.$emit('input', this.data) // 原子化组件传值props
            }
        }
    }
</script>

<style scoped>
.zzh-input{
    outline: none;
}
</style>
