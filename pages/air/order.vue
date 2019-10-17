<template>
  <div class="container">
    <el-row type="flex" justify="space-between">
      <!-- 订单表单 -->
      <orderForm></orderForm>
      <!-- 侧边栏 -->
      <div class="aside">
        <OrderAside :data="infoData"></OrderAside>
      </div>
    </el-row>
  </div>
</template>

<script>
import OrderForm from "@/components/air/orderForm";
import OrderAside from "@/components/air/orderAside";
export default {
  components: {
    OrderForm,
    OrderAside
  },
  data() {
    return {
      // 定义一个机票信息
      infoData: {
        insurances: [], //保险数据
        seat_infos: {} //订单信息
      }
    };
  },
  // 根据ID和参数请求该航班的订单信息
  mounted() {
    let { id, seat_xid } = this.$route.query;
    //   console.log(query)
    this.$axios({
      url: `airs/` + id,
      params: { seat_xid }
    }).then(res => {
      this.infoData = res.data
      console.log(this.infoData)
    });
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 1000px;
  margin: 20px auto;
}

/*aside*/
.aside {
  width: 350px;
  height: fit-content;
  border: 1px #ddd solid;
}
</style>