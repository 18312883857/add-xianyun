<template>
  <!-- 版心居中 -->
  <div class="neteva">
    <!-- 左右布局 左边是侧边导航栏 右边是版心 -->
    <el-container>
      <div width="250px">
        <!-- 导航栏 -->
        <div class="tab">
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            mode="horizontal "
            v-for="(item,index) in cityList"
            :key="index"
          >
            <el-submenu index="1">
              <template slot="title">{{item.type}}</template>
              <el-menu-item
                index="1-1"
                v-for="(items,index) in item.children"
                :key="index"
                @click="clickCity(items.city)"
              >
                <i style="font-size:20px;color:#ffa500">{{index+1}}</i>
                <a href="javascript:;">{{items.city}} {{items.desc}}</a>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
        <div class="listout">
          <h4 class="left">推荐城市</h4>
          <!-- 图片链接 -->
          <a href="javascript:;">
            <img src="@/static/image/3319942085.jpg" alt />
          </a>
        </div>
      </div>
      <el-container>
        <el-header style="height:90px">
          <div class="demo-input-suffix">
            <el-input
              class="el-input"
              :placeholder="placeholder"
              suffix-icon="el-icon-search"
              v-model="value"
              @keydown.enter.native="clickenter(value)"
            ></el-input>
          </div>
          <div class="demo-box">
            <span>推荐城市</span> ：
            <a href="javascript:;" v-for="(item,index) in RecommendCity" :key="index" @click="clickCity(item)">{{item}}</a>
          </div>
        </el-header>
        <el-main class="el-main">
          <!-- 文章列表组件 -->
          <postCity :data="textLists"></postCity>
        </el-main>
        <!-- <el-footer>这里放分页器</el-footer> -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="start"
          :page-sizes="[10, 20, 30, 40,50,60,70]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-container>
    </el-container>
    <!-- 回到顶部 -->
    <a href="javascript:;" id="btn" title="回到顶部" class="el-icon-caret-top"></a>
  </div>
</template>

<script>
import postCity from "@/components/post/postCity";
import {Scrollevent} from '@/utlis/Scroll.js';
export default {
  components: {
    postCity
  },
  data(){
    return {
      // input: "",
      isShow: false,
      activeIndex: "1",
      cityList: [],
      textLists: [],
      placeholder: "请输入你最想去的城市，比如：广州",
      placeXtes: {},
      value: "",
      limit: 10,
      start: 0,
      total: 0,
      RecommendCity : ['北京','上海','广州']
    };
  },
  mounted() {
    // 城市列表
    this.$axios({
      url: `/posts/cities`
    }).then(res => {
      let { data } = res.data;
      this.cityList = data;
      this.clickCity();
    });
    // 回到顶部事件
    return Scrollevent()
  },
  methods: {
    //  文章列表
    async clickCity(value) {
      let resluts = {
        city: value,
        _start: this.start,
        _limit: this.limit
      };
      let res = await this.$axios({
        url: `/posts`,
        params: resluts
      });
      let { data } = res.data;
      this.total = res.data.total;
      this.textLists = data;
    },
    // 搜索框
    clickenter(value) {
      if (!value) {
        this.clickCity();
      }
      if (value) {
        this.clickCity(value);
      }
    },
    handleSizeChange(val) {
      // 获取当前的页数
      console.log(val);
      this.limit = val;
      let params = {
        _start: this.start,
        _limit: this.limit
      };
      this.name(params);
    },
    // 封装函数
    name(params) {
      this.$axios({
        url: "/posts",
        params
      }).then(res => {
        let { data } = res.data;
        this.total = res.data.total;
        this.textLists = data;
        scrollTo(0,0)
      });
    },
    // 切换页数
    handleCurrentChange(val) {
      // 当前页面数-1*限制的条数
      this.start = (val - 1) * this.limit;
      let params = {
        _start: this.start,
        _limit: this.limit
      };
      this.name(params);
    },
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
.neteva {
  width: 1000px;
  margin: 0 auto;
  padding-top: 20px;
  padding-bottom: 20px;
  .listout {
    line-height: 50px;
    .left {
      text-align: left;
      border-bottom: 1px #cccccc solid;
      margin-bottom: 10px;
    }
    img {
      width: 100%;
      height: 173px;
    }
  }
  .el-header,
  .el-footer {
    background-color: #ffffff;
    color: #333;
    text-align: center;
    .demo-box {
      text-align: left;
      padding: 10px 0;
      span,
      a {
        font-size: 12px;
        padding-left: 10px;
      }
    }
  }
  .el-aside {
    background-color: #ffffff;
    color: #333;
    text-align: center;
    // line-height: 200px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  #btn {
    width: 50px;
    height: 50px;
    position: fixed;
    right: 25px;
    bottom: 104px;
    display: none;
    font-size: 20px;
    color: #1989fa;
    line-height: 50px;
    text-align: center;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
    background-color: #f2f5f6;
    border-radius: 20%;
  }
  #btn:hover {
    background: #666;
  }
}
/deep/.el-submenu {
  width: 100%;
}
/deep/.el-submenu__icon-arrow {
  position: static;
  vertical-align: middle;
  margin-left: 102px;
  margin-top: -3px;
  font-size: 20px;
}
/deep/.el-form-item {
  margin-bottom: 10px;
}
/deep/.el-submenu {
  border: 1px #dddddd solid;
}
/deep/.el-submenu__title {
  height: 40px;
  line-height: 40px;
  width: 100%;
}
/deep/.el-input__inner {
  border: 3px solid #ffa500;
}
/deep/.el-input__icon {
  color: #ffa500;
  font-size: 24px;
  margin-right: 10px;
}
/deep/.el-form-item__content {
  float: right;
}
/deep/.el-menu-item {
  text-align: left;
  font-size: 12px;
  padding-left: 10px;
}
</style>