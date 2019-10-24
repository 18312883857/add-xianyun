<template>
  <div>
    <!-- 主题内容的标题 -->
    <div class="el-main-box">
      <h4 class="gonglue">推荐攻略</h4>
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item>
          <el-button type="primary" @click="clickPush">写游记</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 主题内容，通过数据渲染出来 多图渲染-->
    <div
      class="main-categrn"
      v-for="(item,index) in data"
      :key="index"
      v-if="item.images.length > 1"
    >
      <h4 class="main-left">
        <a href="#">{{item.title}}</a>
      </h4>
      <!-- 文本介绍 -->
      <p>
        <a href="#">{{item.summary}}</a>
      </p>
      <!-- 图片 -->
      <div class="main-img">
        <a href="#">
          <img :src="`${item}`" alt v-for="(item,index) in item.images" :key="index" />
        </a>
      </div>
      <!-- 评论页 -->
      <div class="main-sm" style="text-align:left;font-size:12px">
        <span class="el-icon-location-outline">{{item.cityName}}</span>
        <span>
          by
          <img :src="$axios.defaults.baseURL + item.account.defaultAvatar" alt />
          <a href="#" style="color:#ffa500">地球发动机</a>
        </span>
        <span class="el-icon-view"> {{item.watch}}</span>
        <div class="dianzan">
          <span>
            {{Number(item.like)}}
            <span
              class="iconoff el-icon-star-off"
              @click="clickIcoStar(item.id)"
            ></span>
          </span>
        </div>
      </div>
    </div>
    <!-- 单图渲染 -->
    <div class="main-dan" v-for="(item,index) in data" :key="index" v-if="item.images.length === 1">
      <!-- 左边图片 -->
      <div class="main-left">
        <a href="#">
          <img :src="`${item}`" alt v-for="(item,index) in item.images" :key="index" />
        </a>
      </div>
      <!-- 右边文字介绍 -->
      <div class="main-right">
        <!-- 标题 -->
        <h4>
          <a href="#">{{item.title}}</a>
        </h4>
        <div class="main-bottom">
          <!-- 标题内容 -->
          <a href="#">{{item.summary}}</a>
        </div>
        <div class="main-like" style="text-align:left;font-size:12px">
          <span class="el-icon-location-outline">{{item.cityName}}</span>
          <span>
            by
            <img :src="$axios.defaults.baseURL + item.account.defaultAvatar" alt />
            <a href="#" style="color:#ffa500">地球发动机</a>
          </span>
          <span class="el-icon-view"> {{item.watch}}</span>
          <div class="dianzan">
            <span>
              {{Number(item.like)}}
              <span class="iconoff el-icon-star-off" @click="clickIcoStar(item.id)"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Create from "@/pages/post/create";
export default {
  components: {
    Create
  },
  data() {
    return {};
  },
  props: ["data"],
  methods: {
    clickPush() {
      this.$router.push("post/create");
    },
    // 点赞功能
    clickIcoStar(id) {
      this.$axios({
        url: "/posts/like",
        params: { id: id },
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        }
      }).then(res => {
        console.log(res)
        console.log(id)
        let { status, message } = res.data;
        if (status === 0) {
          this.$message.success(message);
          this.data.forEach(v=>{
            if (v.id === id) {
              let like = Number(v.like)+1
              v.like = like
            }
          })
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
ul {
  list-style-type: none;
}
a:hover {
  color: #ffa500;
}
a {
  text-decoration: none;
  color: black;
}
.el-main {
  background-color: #ffffff;
  color: #333;
  text-align: center;
  padding: 0px 20px;
  .el-main-box {
    border-bottom: 1px #cccccc solid;
  }
  .gonglue {
    float: left;
    color: #ffa500;
    font-weight: 400;
    font-size: 18px;
    line-height: 40px;
  }
  .main-categrn {
    width: 100%;
    padding: 20px 0;
    border-bottom: 1px solid #eee;
    .main-left {
      text-align: left;
      margin-bottom: 15px;
      font-weight: 400;
      font-size: 18px;
    }
    p {
      text-align: left;
      a {
        font-size: 14px;
        line-height: 1.5;
        color: #666666;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 60px;
        display: -webkit-box;
      }
    }
    .main-img {
      margin: 15px 0;
      overflow: hidden;
      img {
        width: 33%;
        height: 150px;
        display: block;
        -o-object-fit: cover;
        object-fit: cover;
        float: left;
        margin: 1px;
      }
    }
    .main-sm {
      span {
        padding: 5px;
        img {
          width: 16px;
          height: 16px;
          vertical-align: middle;
        }
      }
    }

    .dianzan {
      float: right;
      span {
        line-height: 22px;
        color: orange;
        font-size: 18px;
        .iconoff {
          line-height: 13px;
        }
      }
    }
  }
  .main-dan {
    width: 100%;
    padding: 20px 0;
    border-bottom: 1px solid #eee;
    overflow: hidden;
    .main-left {
      width: 220px;
      height: 150px;
      flex-shrink: 0;
      margin-right: 10px;
      float: left;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .main-right {
      float: right;
      width: 67%;
      h4 {
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 15px;
        font-weight: 400;
        font-size: 18px;
      }
      .main-bottom {
        margin-bottom: 15px;
        line-height: 1.5;
        font-size: 14px;
        height: 63px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        a {
          color: #666;
        }
      }
      .main-like {
        span {
          padding: 5px;
          img {
            width: 16px;
            height: 16px;
            vertical-align: middle;
          }
        }
      }
      .dianzan {
        float: right;
        span {
          line-height: 22px;
          color: orange;
          font-size: 18px;
          .iconoff {
            line-height: 13px;
          }
        }
      }
    }
  }
}
</style>