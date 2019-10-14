<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <!-- prop是需要校验的表单字段 -->
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户名/手机" v-model="form.username"></el-input>
    </el-form-item>
    <!-- 验证码 -->
    <el-form-item class="form-item" prop="captcha">
      <el-input placeholder="验证码" v-model="form.captcha">
        <template slot="append">
          <el-button @click="handleSendCaptcha">发送验证码</el-button>
        </template>
      </el-input>
    </el-form-item>
    <!-- prop是需要校验的表单字段 -->
    <el-form-item class="form-item" prop="nickname">
      <el-input placeholder="你的名字" type="text" v-model="form.nickname"></el-input>
    </el-form-item>
    <el-form-item class="form-item" prop="password">
      <el-input placeholder="密码" type="password" v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item class="form-item" prop="checkPassword">
      <el-input placeholder="确认密码" type="password" v-model="form.checkPassword"></el-input>
    </el-form-item>
    <p class="form-text">
      <nuxt-link to="#">忘记密码</nuxt-link>
    </p>

    <el-button class="submit" type="primary" @click="handleLoginSubmit">注册</el-button>
  </el-form>
</template>

<script>
import { async } from "q";
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      form: {
        username: "",
        nickname: "",
        password: "",
        checkPassword: "",
        captcha: ""
      },
      rules: {
        username: {
          required: true,
          message: "请输入用户名/手机",
          trigger: "blur"
        },
        nickname: {
          required: true,
          message: "请输入你的名字",
          trigger: "blur"
        },
        password: { required: true, message: "请输入密码", trigger: "blur" },
        captcha: { required: true, message: "请输入验证码", trigger: "blur" },
        checkPassword: { validator: validatePass2, trigger: "blur" }
      }
    };
  },
  methods: {
    //   发送验证码
    async handleSendCaptcha() {
      // 用户名不能为空
      if (!this.form.username) {
        this.$message.error("用户名不能为空");
        return;
      }
      this.$store.dispatch("user/register", this.form.username).then(res => {
        let { code } = res.data;
        this.$message.success(`验证码为： ${code}`);
      });
    },
    // 注册
    handleLoginSubmit() {
      this.$refs.form.validate(async valid => {
        let { checkPassword, ...porops } = this.form;
        if (valid) {
          this.$store.dispatch("user/enroll", porops).then(res => {
            let { status, data } = res;
            if (status === 200) {
              this.$message.success("注册成功");
              setTimeout(() => {
                this.$router.push("/");
                //  把用户注册的信息存储到独立仓库里，并且显示出来
                this.$store.commit("user/setUserInfo", data);
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
