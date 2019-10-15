<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <div></div>

        <!-- 航班头部布局 -->

        <FlightsListHead></FlightsListHead>

        <!-- 航班信息 -->
        <FlightsItem v-for="(item,index) in flightsData" :key="index" :data="item"></FlightsItem>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
      </div>
    </el-row>
  </section>
</template>

<script>
// import moment from "moment";
import FlightsListHead from "@/components/air/flightsListHead";
import FlightsItem from "@/components/air/flightsItem";

export default {
  data() {
    return {
      flightsData: {}, // 航班总数据
    };
  },
  components: {
    FlightsListHead,
    FlightsItem
  },
  mounted(){
    
    this.$axios({
      url : '/airs',
      params : this.$route.query
    }).then(res=>{
      // 接收总数据
      this.flightsData = res.data
      console.log(this.flightsData)
    })
  }
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>