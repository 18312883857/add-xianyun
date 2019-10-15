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
        <FlightsItem v-for="(item,index) in dataList" :key="index" :data="item"></FlightsItem>
        <!-- 分页器 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="flightsData.total"
          v-if="flightsData.flights.length"
        ></el-pagination>
        <div
          v-if="flightsData.flights.length === 0 && !laoding"
          style="padding: 50px; text-align:center"
        >该航班暂时没有数据</div>
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
      flightsData: {
        flights: []
      }, // 航班总数据
      // 从flights总列表数据中切割出来数组列表
      dataList: [],
      pageIndex: 1,
      pageSize: 5,
      laoding: true
    };
  },
  components: {
    FlightsListHead,
    FlightsItem
  },
  mounted() {
    this.$axios({
      url: "/airs",
      params: this.$route.query
    }).then(res => {
      // 接收总数据
      this.flightsData = res.data;
      console.log(this.flightsData);
      // 第一页的数据
      this.dataList = this.flightsData.flights.slice(0, this.pageSize);
      this.laoding = false;
    });
  },
  methods: {
    // 封装切换数据的函数
    setDataList() {
      // 利用pageIndex和pageSize来切换页数
      // 第一页 0，5 第二页 5，10 第三页 10，15
      this.dataList = this.flightsData.flights.slice((this.pageIndex - 1) * this.pageSize,this.pageIndex * this.pageSize);
    },
    // 分页条数切换时候触发, val是当前的条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1
      this.setDataList()
    },
    // 页数切换时候触发, val是当前的页数
    handleCurrentChange(val) {
      // 当前切换的页数
      this.pageIndex = val;
      this.setDataList()
    }
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
/deep/.el-pagination {
  text-align: center;
}
</style>