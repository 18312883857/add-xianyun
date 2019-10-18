<template>
  <div class="container">
    <div class="main">
      <div class="pay-title">
        支付总金额
        <span class="pay-price">￥ {{order.price}}</span>
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
import { async } from "q";
export default {
  data() {
    return {
      price: "",
      timer: null,
      order: {}
    };
  },
  mounted() {
    // 这个处理方法有缺陷  userinfo在页面中加载完才赋值
    // 获取路由ID
    setTimeout(async () => {
      let id = this.$route.query.id;
      // 获取存储在vuex里的token值 订单详情请求需要用到
      let res = await this.$axios({
        url: `/airorders/` + id,
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        }
      });
      this.order = res.data;
      // 第一个参数是要设置二维码的位置  第二个参数生成二维码的url地址
      QRCode.toCanvas(
        document.querySelector("#qrcode-stage"),
        this.order.payInfo.code_url,
        { width: 200 }
      );
      // 查询接口3秒查询一次，如果已付款会弹窗提示并停止继续查询，页面销毁也会停止查询。
      this.timer = setInterval(async () => {
        console.log({
          id: this.$route.query.id, //订单id
          // nonce_str: this.order.price, //订单金额
          // out_trade_no: this.order.orderNo //订单编号
          nonce_str: this.order.price,
          out_trade_no: this.order.orderNo
        });

        let obj = await this.$axios({
          url: `/airorders/checkpay`,
          method: "Post",
          headers: {
            Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
          },
          data: {
            id: this.$route.query.id, //订单id
            nonce_str: this.order.price, //订单金额
            out_trade_no: this.order.orderNo //订单编号
          }
        });

        let { statusTxt } = obj.data;
        console.log(obj.data, statusTxt);
        // 能够打印出是否已付款的信息
        // console.log(isResolve);
        // 如果已付款 那么停止查询，页面销毁
        if (statusTxt === "支付完成") {
          this.$message.success(statusTxt);
          clearInterval(this.timer);
        }
        // clearInterval(this.timer);
      }, 3000);
    }, 50);
  },
  // 页面销毁，即主要离开这个组件，那么就会销毁里面的东西，主要用于清除定时器
  destroyed() {
    clearInterval(this.timer);
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