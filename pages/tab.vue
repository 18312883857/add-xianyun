<template>
  <div class="box">
      <span v-for="(item,index) in list" :key="index" @click="headClick(index)" :class="{actve:index===cover}">{{item}}</span>
      <div v-for="(item,index) in ponet" :key="item" v-show="index===cover">{{item}}</div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            list : ['新闻','体育','娱乐'],
            cover : 0,
            ponet : [123,456,789]
        }
    },
    methods : {
        headClick(index){
            this.cover = index
        }
    }
}
</script>

<style lang="less" scoped>
.box{
    width: 500px;
    height: 500px;
    line-height: 250px;
    text-align: center;
    margin: 0 auto;
    span{
        cursor: pointer;
        font-size: 25px;
        padding: 10px;
    }
    .actve{
        border-bottom: 1px pink solid;
    }
}
</style>