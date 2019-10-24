<template>
  <div class="filters">
    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
      <el-col :span="8">
        单程：
        {{data.info.departCity}} - {{data.info.destCity}}
        /
        {{data.info.departDate}}
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="listOpions.airport" placeholder="起飞机场">
          <el-option
            :label="item"
            :value="item"
            v-for="(item,index) in data.options.airport"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="listOpions.flightTimes" placeholder="起飞时间">
          <el-option
            :label="`${item.from}:00 - ${item.to}:00`"
            :value="`${item.from},${item.to}`"
            v-for="(item,index) in data.options.flightTimes"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="listOpions.company" placeholder="航空公司">
          <el-option
            :label="item"
            :value="item"
            v-for="(item,index) in data.options.company"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="listOpions.airSize" placeholder="机型">
          <el-option
            :label="item.name"
            :value="item.size"
            v-for="(item,index) in airSizeOptions"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选：
      <el-button type="primary" round plain size="mini" @click="handleFiltersCancel">撤销</el-button>
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
      airport: "", // 机场
      flightTimes: "", // 出发时间
      company: "", // 航空公司
      // 机型大小
      airSize: "",
      airSizeOptions: [
        { name: "大", size: "L" },
        { name: "中", size: "M" },
        { name: "小", size: "S" }
      ],
      // 声明一个对象，用于存放筛选的数据
      listOpions: {
        airport: "",
        flightTimes: "",
        company: "",
        airSize: ""
      }
    };
  },
  // 深度监听监听对象
  watch: {
    listOpions: {
      deep: true,
      handler() {
        // 实现四个条件的过滤
        let arr = this.data.flights.filter(v => {
          // 假设四个条件都是有效的
          let flg = true;
          // 判断起飞机场
          if (
            this.listOpions.airport &&
            this.listOpions.airport !== v.org_airport_name
          ) {
            flg = false;
          }
          // 判断起飞时间
          if (this.listOpions.flightTimes) {
            let arr1 = v.dep_time.split(":")[0];
            let arr2 = this.listOpions.flightTimes.split(",");
            if (arr1 < arr2[0] || arr1 > arr2[1]) {
              flg = false;
            }
          }
          // 判断航空公司
          if (
            this.listOpions.company &&
            this.listOpions.company !== v.airline_name
          ) {
            flg = false;
          }
          // 判断飞机型号
          if (
            this.listOpions.airSize &&
            this.listOpions.airSize !== v.plane_size
          ) {
            flg = false;
          }
          return flg;
        });
        this.$emit("setdatalist", arr);
      }
    }
  },
  methods: {
    // 多条件筛选
    // handleFliters() {
    //   // 创建一个空数组用于接收数据
    //   let arr = [];
    //   // 遍历原数组的每一项
    //   this.data.flights.forEach(item => {
    //     // 假设所有的选项都有效
    //     let flg = true;
    //     // 遍历自定义对象
    //     Object.keys(this.listOpions).forEach(v => {
    //       // 此时数组里的每一项是没有值的
    //       if (!this.listOpions[v].value) return;
    //       else if (v === "flightTimes") {
    //         // this.listOpions[v].value.split(",")  是一个数组 里面是一个键值对 key是原来的值 value是一个空字符串
    //         let num = this.listOpions[v].value.split(","); //
    //         let start = item.dep_time.split(":")[0];
    //         if (start < +num[0] || start > +num[1]) {
    //           flg = false;
    //         }
    //       }
    //       else if (
    //         // 用来判断航空公司
    //         item[this.listOpions[v].key] !== this.listOpions[v].value
    //       ) {
    //         flg = false;
    //       }
    //     });
    //     if(flg){
    //       arr.push(item)
    //     }
    //   });
    //   this.$emit('setdatalist',arr)
    // },
    // 选择机场时候触发
    handleAirport(value) {
      // // // 过滤数组
      // let arr = this.data.flights.filter(v => {
      //   return v.org_airport_name == value;
      // });
      // this.$emit("setdatalist", arr);
    },
    // 选择出发时间时候触发
    handleFlightTimes(value) {
      // // value是当前选取起飞时间 将字符串截取出来
      // let [from, to] = value.split(",");
      // let arr = this.data.flights.filter(v => {
      //   // // 出发的时间是小时
      //   let start = +v.dep_time.split(":")[0];
      //   // 如果条件不成立，则表明没有该航班
      //   return start >= from && start < to;
      // });
      // this.$emit("setdatalist", arr);
    },

    // 选择航空公司时候触发
    handleCompany(value) {
      // let arr = this.data.flights.filter(v => {
      //   return v.airline_name == value;
      // });
      // this.$emit("setdatalist", arr);
    },

    // 选择机型时候触发
    handleAirSize(value) {
      // let arr = this.data.flights.filter(v => {
      //   return v.plane_size == value;
      // });
      // this.$emit("setdatalist", arr);
    },

    // 撤销条件时候触发
    handleFiltersCancel() {
      // // 清空输入框里面的值
      this.airport = "";
      this.flightTimes = "";
      this.company = "";
      this.airSize = "";
      // 传递原数组
      this.$emit("setdatalist", this.data.flights);
    }
  }
};
</script>

<style scoped lang="less">
.filters {
  margin-bottom: 20px;
}

.filters-top {
  > div {
    /deep/ .el-select {
      margin-left: 10px;
    }
  }
}

.filter-cancel {
  margin-top: 10px;
}
</style>