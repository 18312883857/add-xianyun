<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearchTab(item, index)"
        :class="{active: index === currentTab}"
      >
        <i :class="item.icon"></i>
        {{item.name}}
      </span>
    </el-row>

    <el-form class="search-form-content" ref="form" label-width="80px">
      <el-form-item label="出发城市">
        <!-- fetch-suggestions 类似于input事件，能够实时返回输入框的值 返回输入建议的方法 -->
        <!-- select 点击选中建议项时触发 -->
        <el-autocomplete
          :fetch-suggestions="queryDepartSearch"
          placeholder="请搜索出发城市"
          @select="handleDepartSelect"
          class="el-autocomplete"
          v-model="form.departCity"
          @blur="handleBlur(`dest`)"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="到达城市">
        <el-autocomplete
          :fetch-suggestions="queryDestSearch"
          placeholder="请搜索到达城市"
          @select="handleDestSelect"
          class="el-autocomplete"
          v-model="form.destCity"
          @blur="handleBlur(`depart`)"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="出发时间">
        <!-- change 用户确认选择日期时触发 -->
        <el-date-picker
          type="date"
          placeholder="请选择日期"
          style="width: 100%;"
          @change="handleDate"
          v-model="form.departDate"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label>
        <el-button style="width:100%;" type="primary" icon="el-icon-search" @click="handleSubmit">搜索</el-button>
      </el-form-item>
      <div class="reverse">
        <span @click="handleReverse">换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { async } from "q";
export default {
  data() {
    return {
      tabs: [
        { icon: "iconfont icondancheng", name: "单程" },
        { icon: "iconfont iconshuangxiang", name: "往返" }
      ],
      //   默认栏目
      currentTab: 0,
      form: {
        departCity: "", //出发城市
        departCode: "", //出发城市代码
        destCity: "", //到达城市
        destCode: "", //到达城市代码
        departDate: "" //日期字符串
      },
      list: []
    };
  },
  methods: {
    // tab切换时触发
    handleSearchTab(item, index) {
      console.log(123);
    },
    // 出发城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表，是用来展示的 函数里面是一个数组，数组里面是个对象 对象中必须要有value属性
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
    // 失去焦点事件，默认下拉列表选中第一个
    handleBlur(type) {
      if (this.list.length > 0) {
        // 如果不在下拉列表中选择，则默认选中第一项
        if(type === 'dest'){
            this.form.departCity = this.list[0].value
            this.form.departCode = this.list[0].sort
        }
        if(type === 'depart'){
            this.form.destCity = this.list[0].value
            this.form.destCode = this.list[0].sort
        }
      }
    },
    // 出发城市下拉选择时触发
    handleDepartSelect(item) {
    //   console.log(item);
    this.form.departCity = item.value
    this.form.departCode = item.sort
    },
    // 目标城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    queryDestSearch(value, cb) {
    //   由于handleSearchTab事件实际上是一个函数，并且出发城市与目标城市做法是一样的，我们可以调用出发城市来完成目标城市的业务逻辑
       this.queryDepartSearch(value,cb)
    },
    // 目标城市下拉选择时触发
    handleDestSelect(item) {},

    // 确认选择日期时触发
    handleDate(value) {},

    // 触发和目标城市切换时触发
    handleReverse() {},

    // 提交表单是触发
    handleSubmit() {}
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
}

.reverse {
  position: absolute;
  top: 35px;
  right: 15px;

  &:after,
  &:before {
    display: block;
    content: "";
    position: absolute;
    left: -35px;
    width: 25px;
    height: 1px;
    background: #ccc;
  }

  &:after {
    top: 0;
  }

  &:before {
    top: 60px;
  }

  span {
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    background: #999;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      left: 10px;
      width: 1px;
      height: 20px;
      background: #ccc;
    }

    &:after {
      top: -20px;
    }

    &:before {
      top: 20px;
    }
  }
}
</style>
