<template>
  <div class="container">
    <el-row type="flex" justify="space-between">
      <!-- 订单表单 -->
      <orderForm :data="infoData" @setallprice="setallprice" @getDetail="getDetail"></orderForm>
      <!-- 侧边栏 -->
      <div class="aside">
        <OrderAside :data="infoData" :allPrice="allPrice"></OrderAside>
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
      },
      // 总金额
      allPrice: 0
    };
  },
  methods : {
    setallprice(price){
      this.allPrice = price
    },
    getDetail(dataList){
      this.infoData = dataList
    }
  }
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