<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <!-- prop是需要校验的表单字段 -->
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户名/手机" v-model="form.username"></el-input>
    </el-form-item>
    <!-- prop是需要校验的表单字段 -->
    <el-form-item class="form-item" prop="password">
      <el-input placeholder="密码" type="password" v-model="form.password"></el-input>
    </el-form-item>

    <p class="form-text">
      <nuxt-link to="#">忘记密码</nuxt-link>
    </p>

    <el-button class="submit" type="primary" @click="handleLoginSubmit">登录</el-button>
  </el-form>
</template>

<script>
import { async } from "q";
export default {
  data() {
    return {
      // 表单数据
      form: {
        username: "",
        password: ""
      },
      // 表单规则
      rules: {
        username: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 提交登录
    handleLoginSubmit() {
      //  validate是element组件里表单里自带的一个属性 这个属性里是一个回调函数，有一个valid参数
      this.$refs.form.validate(async valid => {
        //   会返回一个布尔值 要么是true 要么是false
        // console.log(valid);
        //   valid是表单验证的结果
        if (valid) {
          // 提交登录的接口
          // 调用actions方法修改state的值
          this.$store.dispatch("user/login", this.form).then(res => {
            let { status } = res;
            if (status === 200) {
              this.$message.success("登录成功");
              setTimeout(() => {
                this.$router.back("/");
              }, 2000);
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
}

.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}

.submit {
  width: 100%;
  margin-top: 10px;
}
</style>
