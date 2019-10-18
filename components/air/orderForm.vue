<template>
  <div class="main">
    <div class="air-column">
      <h2>乘机人</h2>
      <!-- 全局控制input值的变化 -->
      <span v-show="false">{{allPrice}}</span>
      <el-form class="member-info">
        <div class="member-info-item" v-for="(item,index) in users" :key="index">
          <el-form-item label="乘机人类型">
            <el-input placeholder="姓名" class="input-with-select" v-model="item.username">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="证件类型">
            <el-input placeholder="证件号码" class="input-with-select" v-model="item.id">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <div class="insurance-item" v-for="(item,index) in dataList.insurances" :key="index">
          <!-- 表单特别拥有的一个change事件 -->
          <el-checkbox
            :label="`${item.type}：￥${item.price}/份×1  最高赔付${item.compensation}`"
            border
            @change="changeLable(item.id)"
          ></el-checkbox>
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input placeholder="请输入内容" v-model="contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: { type: Object, default: {} }
  },
  data() {
    return {
      // 默认存了一份数据
      users: [
        {
          username: "123",
          id: "123"
        }
      ],
      // 存储机票的信息
      dataList: {},
      // 保险的信息
      insurances: [],
      contactName: "123", // 联系人名字
      contactPhone: "13512341234", // 联系人电话
      invoice: false, //不需要发票
      captcha: "000000", //发送验证码
      // allPrice: 0 //总价格
    };
  },
  computed: {
    // 计算总价格
    allPrice() {
      if(!this.data.seat_infos) return
      // 总价格初始值
      let price = 0
      // 单价
      price += this.data.seat_infos.org_settle_price
      // 燃油费
      price += this.data.airport_tax_audlet
      // 保险
      price += this.insurances.length * 30
      // 人数
      price *= this.users.length
      // // 通过事件将总金额传到父组件中
      this.$emit("setallprice", price);
      return price
    }
  },
  mounted() {
    let { id, seat_xid } = this.$route.query;
    //   console.log(query)
    this.$axios({
      url: `airs/` + id,
      params: { seat_xid }
    }).then(res => {
      this.dataList = res.data;
      this.$emit('getDetail',this.dataList)
    });
  },
  methods: {
    // 添加乘机人
    handleAddUsers() {
      // 给user添加多一项数据
      this.users.push({ uesrname: "", id: "" });
    },
    // 移除乘机人
    handleDeleteUser(index) {
      this.users.splice(index, 1);
    },
    // 发送手机验证码
    handleSendCaptcha() {
      if (!this.contactPhone) {
        return this.$message.error(`手机号码不能为空`);
      }
      if (this.contactPhone.length !== 11) {
        return this.$message.error(`手机号码格式不对`);
      }
      this.$store.dispatch("user/register", this.contactPhone).then(res => {
        let { code } = res.data;
        this.$message.success(`验证码为：${code}`);
      });
    },

    // 提交订单
    handleSubmit() {
      let data = {
        users: this.users,
        insurances: this.insurances,
        contactName: this.contactName,
        contactPhone: this.contactPhone,
        invoice: this.invoice,
        captcha: this.captcha,
        seat_xid: this.$route.query.seat_xid,
        air: +this.$route.query.id
      };
      this.$axios({
        url: "/airorders",
        data: data,
        method: "Post",
        //   需要请求头
        headers: {
          // 这是jwt标准的token
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        }
      }).then(res => {
        let { message, status } = res.data;
        const {data: {id}} = res.data
        // console.log({data: {id}})  data: {id: 74} 从里面解构data  再从data里面解构id
        // let {id} = res.data
        if (status === 0) {
          this.$message.success(`${message},请稍后~`);
          setTimeout(() => {
            // 跳转到付款页
            this.$router.push({
              path: `/air/pay?id=${id}`,
            });
          }, 1500);
        }
      });
    },
    // 点击保险
    changeLable(id) {

      // 判断保险数组中是否有数据，如果有就删除，如果没有就添加 使用indexOf进行判断
      // 如果有数据，返回一个大于-1的数 如果没有就返回一个-1
      let inset = this.insurances.indexOf(id);
      if (inset > -1) {
        this.insurances.splice(inset, 1);
      } else {
        this.insurances.push(id);
      }
    }
  }
};
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>