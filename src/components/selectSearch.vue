<template>
<div style="margin-top:20px;">
    <b>{{name}}:</b>
    <select name="selectSearch" v-model="data" @change="changeData" class="zzh-select">
        <option v-for="one in options" :value="one.value">{{one.label}}</option>
    </select>
</div>
</template>

<script>
    export default {
        name: "selectSearch",
        props: {
            pname: {
                type:String,
                default:'名称',
            },
            value: {
                type:String,
                default: ''
            },
            options: {
                type: Array,
                default:()=>{}
            }
        },
        data (){
            return{
                name: this.pname,
                data: this.value,
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
.zzh-select{
    width: 175px;
    outline: none;
}
</style>
