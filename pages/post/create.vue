<template>
  <div class="catecr">
    <!-- 头部 -->
    <div class="headers">
      <div class="headers-tile">
        <h3>发布新攻略</h3>
        <p>分享你的个人游记，让更多人看到哦！</p>
      </div>
      <!-- 草稿箱 -->
      <div class="aside">
        <div class="draft-box">
          <div class="draft-list">
            <h4>草稿箱（{{$store.state.youxiang.youxiang.length}}）</h4>
            <div
              class="draft-item"
              v-for="(item,index) in $store.state.youxiang.youxiang"
              :key="index"
            >
              <div class="draft-post-title">
                <span @click="clickSpan(item,index)">
                  {{item.title}}
                  <span class="iconfont el-icon-edit"></span>
                </span>
                <i class="el-icon-delete" @click="clickDelet(index)"></i>
                <p>{{item.tiemDay}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 表单 -->
    <div class="main">
      <el-input v-model="ruleForm.title" placeholder="请输入标题" style="width:70%;margin-bottom:20px"></el-input>
      <!-- 副文本框 -->
      <VueEditor :config="config" ref="vueEditor" style="width:70%;height:500px" />
      <div class="inputcity">
        <span>选择城市</span>

        <el-autocomplete
          :fetch-suggestions="queryDepartSearch"
          @select="handleDepartSelect"
          @blur="handleBlur(`depart`)"
          v-model="ruleForm.city"
          placeholder="请搜索游玩城市"
          style="width:60%;margin-bottom:20px;padding-left:20px"
        ></el-autocomplete>

      </div>
      <div class="primary">
        <el-button type="primary" @click="submitForm">发布</el-button>
        <el-button @click="resetForm">保存至草稿箱</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import "quill/dist/quill.snow.css";
import { async } from "q";
import moment from 'moment'
let VueEditor;
if (process.browser) {
  VueEditor = require("vue-word-editor").default;
}
export default {
  data() {
    return {
      config: {
        // 上传图片的配置
        uploadImage: {
          url: this.$axios.defaults.baseURL + "/upload",
          name: "files",
          // res是结果，insert方法会把内容注入到编辑器中，res.data.url是资源地址
          uploadSuccess: (res, insert) => {
            insert(this.$axios.defaults.baseURL + res.data[0].url);
          }
        }
      },
      ruleForm: {
        city: "", //城市
        title: "", //标题
        content: "", //内容
        tiemDay : '' //当前时间
      },
      list : []
    };
  },
  mounted() {},
  components: {
    VueEditor
  },
  methods: {
    getList(ruleForm, callback) {
      // 获取副文本框的内容
      var quill = this.$refs.vueEditor.editor;
      this.ruleForm.content = quill.root.innerHTML;
      // 发布
      // console.log(this.ruleForm);
      this.$axios({
        url: "/posts",
        method: "Post",
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        },
        data: {
          content: this.ruleForm.content,
          title: this.ruleForm.title,
          city: this.ruleForm.city
        }
      }).then(res => {
        console.log(res.data);
        let { message, data } = res.data;
        if (message === "新增成功") {
          callback();
        }
      });
    },
    //   发布
    submitForm(ruleForm) {
      this.getList(ruleForm, () => {
        this.$message.success(`新增成功,请到文章首页查看`);
        // 清空输入框的内容
        this.ruleForm = {};
        // 清空副文本框的内容
        // // 设置编辑器的内容
        var quill = this.$refs.vueEditor.editor;
        quill.root.innerHTML = "";
      });
    },
    //  添加至草稿箱
    resetForm(ruleForm) {
      // 获取副文本框的内容
      var quill = this.$refs.vueEditor.editor;
      this.ruleForm.content = quill.root.innerHTML;
      this.ruleForm.tiemDay = moment().format("YYYY-MM-DD HH:mm:ss")
      console.log(this.ruleForm.tiemDay)
      const goods = { ...this.ruleForm };
      this.$store.commit("youxiang/setYouXiang", goods);
      this.ruleForm = {};
        // 清空副文本框的内容
        // // 设置编辑器的内容
        var quill = this.$refs.vueEditor.editor;
        quill.root.innerHTML = "";

    },
    // 编辑数据
    clickSpan(item,index){
      console.log(item)
      var quill = this.$refs.vueEditor.editor;
      quill.root.innerHTML =item.content
      this.ruleForm.city = item.city
      this.ruleForm.title = item.title
      this.$store.commit('youxiang/EditData',index)
    },
    // 删除数据
    clickDelet(index){
      console.log(index)
      this.$store.commit('youxiang/deleteYouXiang',index)
    },
    // 搜索框
    async queryDepartSearch(value, cb) {
      //   cb([{ value: 1 }, { value: 2 }, { value: 3 }]);
      // 输入框为空时候不请
      if (!value) {
        //   当输入框没有值的时候，不显示下拉列表
        cb([]);
        return;
      }
      let res = await this.$axios({
        url: `/airs/city?name=${value}`
      });
      let { data } = res.data;
      //   由于返回的数据没有value，我需要给每一项添加value值
      //   使用map会返回一个新的数组，数组里面每一项是对象
      let arr = data.map(v => {
        v.value = v.name.replace("市", "");
        return v;
      });
      cb(arr);
      this.list = arr;
      //   console.log(this.list)
    },
    // 失去焦点事件
    handleBlur() {
      // 如果输入框内没有值 就不显示默认内容
      if (this.list.length === 0) return;
      this.ruleForm.city = this.list[0].value;
    },
    // 出发城市下拉选择时触发
    handleDepartSelect(item) {
      this.ruleForm.city = item.value
    }, 
  }
};
</script>

<style lang="less" scoped>
.catecr {
  width: 1000px;
  margin: 0 auto;
  padding-bottom: 230px;
  .headers {
    padding: 10px 0;
    .headers-tile {
      h3 {
        font-weight: 400;
        font-size: 22px;
        margin-bottom: 10px;
      }
      p {
        font-size: 12px;
        color: #999;
        margin-bottom: 10px;
      }
    }
    .aside {
      width: 200px;
      float: right;
      .draft-box {
        border: 1px solid #ddd;
        padding: 10px;
        h4 {
          margin-bottom: 10px;
          font-weight: 400;
          color: #666;
        }
        .draft-list {
          .draft-item {
            margin-bottom: 10px;
            font-size: 14px;
            .draft-post-title {
              cursor: pointer;
              border-bottom: 1px #cccccc solid;
              span:hover {
                color: orange;
                text-decoration: underline;
              }
              .el-icon-delete:hover{
                color: red;
              }
            }
            p {
              color: #999;
            }
          }
        }
      }
    }
  }
  .main {
    .primary {
      position: absolute;
      left: 170px;
      bottom: -255px;
    }
    .inputcity {
      position: absolute;
      bottom: -210px;
      left: 167px;
    }
  }
}
/deep/.el-form-item__label {
  width: 40px !important;
}
/deep/.el-form-item__content {
  margin-left: 0px !important;
}
/deep/.el-form-item {
  position: absolute;
  left: 170px;
  bottom: -230px;
}
/deep/.ql-toolbar {
  height: 50px;
}
</style>