<template>
  <div class="container">
    <div class="main">
      <div class="pay-title">
        支付总金额
        <span class="pay-price">￥ {{price}}</span>
      </div>
      <div class="pay-main">
        <h4>微信支付</h4>
        <el-row type="flex" justify="space-between" align="middle" class="pay-qrcode">
          <div class="qrcode">
            <!-- 二维码 -->
            <canvas id="qrcode-stage"></canvas>
            <p>请使用微信扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
          <div class="pay-example">
            <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt />
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
// 生成二维码的包
import QRCode from "qrcode";
export default {
  data(){
    return{
      price : ''
    }
  },
  mounted() {
    // 这个处理方法有缺陷  userinfo在页面中加载完才赋值
    // 获取路由ID
    setTimeout(() => {
      let { id } = this.$route.query;
      // 获取存储在vuex里的token值 订单详情请求需要用到
      let {
        user: { userInfo }
      } = this.$store.state;
      this.$axios({
        url: `airorders/${id}`,
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      }).then(res => {
        console.log(res);
        // 展示价格
        this.price = res.data.price
        // 生成二维码
        let {payInfo} = res.data
        // 生成二维码到canvas
        // 获取盒子id
        const stage = document.querySelector("#qrcode-stage");
        // 第一个参数是要设置二维码的位置  第二个参数生成二维码的url地址
        QRCode.toCanvas(stage,payInfo.code_url,{width:200})
      });
    }, 500);
  }
};
</script>

<style scoped lang="less">
.container {
  background: #f5f5f5;
  padding: 30px 0;

  .main {
    width: 1000px;
    margin: 0 auto;

    .pay-title {
      text-align: right;
      span {
        font-size: 28px;
        color: orangered;
      }
    }

    .pay-main {
      background: #fff;
      margin-top: 10px;
      border-top: 5px orange solid;
      padding: 30px;

      h4 {
        font-size: 28px;
        font-weight: normal;
        margin-bottom: 10px;
      }

      .pay-qrcode {
        padding: 0 80px;
      }

      .qrcode {
        border: 1px #ddd solid;
        padding: 15px;
        height: fit-content;

        #qrcode-stage {
          width: 200px;
          height: 200px;
          margin-bottom: 10px;
        }

        p {
          line-height: 2;
          text-align: center;
        }
      }
    }
  }
}
</style>