<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <FlightsFilters :data="cacheFlightsData" @setdatalist="setDataList"></FlightsFilters>
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
          :total="total"
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
        <FlightsAside></FlightsAside>
      </div>
    </el-row>
  </section>
</template>

<script>
// import moment from "moment";
import FlightsListHead from "@/components/air/flightsListHead";
import FlightsItem from "@/components/air/flightsItem";
import FlightsFilters from "@/components/air/flightsFilters";
import FlightsAside from "@/components/air/flightsAside";
export default {
  data() {
    // .过滤条件触发时候需要修改数组列表flightsData.flights，
    // 这样原来的列表就会被覆盖了，所以需要缓存一份列表用于根据条件提取数据。
    // 要实现过滤条件，准备一份旧的数据缓存 准备一份过滤后的数据
    // 也就是说，我们需要通过请求得到另一份数据，然后存储起来
    return {
      // 航班总数据 初始化数据  需要把整个对象传到过滤组件中
      flightsData: {
        flights: [],
        info: {},
        options: {}
      },
      pageIndex: 1,
      pageSize: 5,
      laoding: true,
      // 准备的一份对象用来缓存数据
      cacheFlightsData: {
        flights: [],
        info: {},
        options: {}
      },
      total: 0
    };
  },
  components: {
    FlightsListHead,
    FlightsItem,
    FlightsFilters,
    FlightsAside
  },
  mounted() {
    this.getData();
  },
  computed: {
    // 从flights总列表数据中切割出来数组列表
    dataList() {
      let arr = this.flightsData.flights.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      );
      return arr;
    }
  },
  watch: {
    // 监听路由，如果路由发生变化，就重新发送请求，刷新页面
    $route() {
      this.getData();
    }
  },
  methods: {
    getData() {
      this.$axios({
        url: "/airs",
        params: this.$route.query
      }).then(res => {
        // 接收总数据
        //  // 而flightsData会被修改
        this.flightsData = res.data;
        // / 缓存一份新的列表数据数据，这个列表不会被修改
        this.cacheFlightsData = { ...res.data };
        // 第一页的数据
        // this.dataList = this.flightsData.flights.slice(0, this.pageSize);
        this.laoding = false;
        this.total = this.flightsData.total;
      });
    },
    // arr是用来展示的新数据，该方法将会传递给过滤组件使用
    setDataList(arr) {
      console.log(arr);
      if (arr) {
        // 如果有数据，从第一页开始显示
        this.flightsData.flights = arr;
        this.pageIndex = 1;
        this.total = arr.length;
      }
    },
    // 分页条数切换时候触发, val是当前的条数
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 页数切换时候触发, val是当前的页数
    handleCurrentChange(val) {
      // 当前切换的页数
      this.pageIndex = val;
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