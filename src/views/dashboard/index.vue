<template>
  <div class="dashboard-container">
    <el-row :gutter="40">
      <el-col v-for=" i in list" :key="list[i]" :xs="12" :sm="12" :lg="6" >
        <div class="card-container">
          <div class="card-icon">
            <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
          </div>
          <div class="card-pane-description">
            <div class="card-pane-text">dddddd</div>
            <count-to :start-val="0" :end-val="userTotal" :duration="2620" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
    </el-row>
      <div class="lineChart-container">
        <line-chart :chart-data="lineChartData"/>
      </div>
    <el-row :gutter="40">
      <el-col :xs="24" :sm="24" :lg="16">
        <div class="barChart-container">
          <bar-line-chart :chart-data="barLineChartData"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="pieChart-container">
          <pie-chart/>
        </div>
      </el-col>

    </el-row>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CountTo from 'vue-count-to'
import LineChart from "./chart/LineChart";
import BarLineChart from "./chart/BarLineChart";
import PieChart from "./chart/PieChart";

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  }
}
const barLineChartData = {
  newVisitis: {
    expectedData: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
    actualData: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
    rightData: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
  }
}

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  components:{
    CountTo,
    LineChart,
    BarLineChart,
    PieChart
  },
  data(){
    return{
      userTotal:100,
      list:[1,2,3,4],
      lineChartData: lineChartData.newVisitis,
      barLineChartData:barLineChartData.newVisitis
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    height: 100%;
    position: relative;
    display: block;
    background-color: #f0f2f5;
    padding-left: 40px;
    padding-right: 40px;
    padding-bottom: 40px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
  .card-container{
    height: 108px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    margin-top: 40px;
  }
  .card-icon{
    font-size: 40px;
    color: #40c9c6;
    margin-left: 30px;
  }
  .card-pane-description{
    margin-right: 30px;
  }
  .card-panel-num{
    font-size: 30px;
  }
  .lineChart-container{
    margin-top: 30px;
    margin-right: 20px;
    height: 300px;
    width: 100%;
    background-color: white;
  }
  .barChart-container{
    margin-top: 30px;
    float: left;
    width: 100%;
    height: 300px;
    background-color: white;
    margin-bottom: 30px;
  }
  .pieChart-container{
    margin-top: 30px;
    height: 300px;
    width: 100%;
    background-color: white;
    float: right;
    margin-bottom: 30px;
  }
</style>
