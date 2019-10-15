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
        <el-select size="mini" v-model="airport" placeholder="起飞机场" @change="handleAirport">
          <el-option
            :label="item"
            :value="item"
            v-for="(item,index) in data.options.airport"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="flightTimes" placeholder="起飞时间" @change="handleFlightTimes">
          <el-option
            :label="`${item.from}:00 - ${item.to}:00`"
            :value="`${item.from},${item.to}`"
            v-for="(item,index) in data.options.flightTimes"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="company" placeholder="航空公司" @change="handleCompany">
          <el-option
            :label="item"
            :value="item"
            v-for="(item,index) in data.options.company"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airSize" placeholder="机型" @change="handleAirSize">
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
      ]
    };
  },
  methods: {
    // 选择机场时候触发
    handleAirport(value) {
      // 过滤数组
      let arr = this.data.flights.filter(v => {
        return v.org_airport_name == value;
      });
      this.$emit("setdatalist", arr);
    },
    // 选择出发时间时候触发
    handleFlightTimes(value) {
        // value是当前选取起飞时间 将字符串截取出来
        let [from,to] = value.split(',')
        let arr = this.data.flights.filter(v=>{
            // // 出发的时间是小时
            let start = +v.dep_time.split(':')[0] 
            // 如果条件不成立，则表明没有该航班 
            return start >= from && start < to
        })
      this.$emit("setdatalist", arr);
    },

    // 选择航空公司时候触发
    handleCompany(value) {
        let arr = this.data.flights.filter(v=>{
            return v.airline_name == value
        })
      this.$emit("setdatalist", arr);
    },

    // 选择机型时候触发
    handleAirSize(value) {
        let arr = this.data.flights.filter(v=>{
            return v.plane_size == value
        })
      this.$emit("setdatalist", arr);
    },

    // 撤销条件时候触发
    handleFiltersCancel() {
        // 清空输入框里面的值
        this.airport = ''
        this.flightTimes = ''
        this.company = ''
        this.airSize = ''
        // 传递原数组
        this.$emit('setdatalist',this.data.flights)
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