<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">统计分析</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>本周客流量趋势</span>
          </div>
        </template>
        <div ref="lineChartRef" style="height: 300px;"></div>
      </el-card>

      <el-card>
        <template #header>
          <div class="card-header">
            <span>车辆状态分布</span>
          </div>
        </template>
        <div ref="pieChartRef" style="height: 300px;"></div>
      </el-card>
    </div>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>线路运营效率排名</span>
        </div>
      </template>
      <div ref="barChartRef" style="height: 300px;"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';

const lineChartRef = ref<HTMLElement | null>(null);
const pieChartRef = ref<HTMLElement | null>(null);
const barChartRef = ref<HTMLElement | null>(null);

let lineChart: echarts.ECharts | null = null;
let pieChart: echarts.ECharts | null = null;
let barChart: echarts.ECharts | null = null;

const initCharts = () => {
  if (lineChartRef.value) {
    lineChart = echarts.init(lineChartRef.value);
    lineChart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
      yAxis: { type: 'value' },
      series: [{
        data: [1200, 1320, 1010, 1340, 1500, 2300, 2100],
        type: 'line',
        smooth: true,
        itemStyle: { color: '#409EFF' }
      }]
    });
  }

  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value);
    pieChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: '5%', left: 'center' },
      series: [{
        name: '车辆状态',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false, position: 'center' },
        emphasis: {
          label: { show: true, fontSize: 20, fontWeight: 'bold' }
        },
        labelLine: { show: false },
        data: [
          { value: 48, name: '运营中', itemStyle: { color: '#67C23A' } },
          { value: 2, name: '维修中', itemStyle: { color: '#F56C6C' } },
          { value: 5, name: '保养中', itemStyle: { color: '#E6A23C' } },
          { value: 1, name: '已报废', itemStyle: { color: '#909399' } }
        ]
      }]
    });
  }

  if (barChartRef.value) {
    barChart = echarts.init(barChartRef.value);
    barChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'value' },
      yAxis: { type: 'category', data: ['101路', '102路', '105路', '201路', '303路'] },
      series: [{
        name: '准点率%',
        type: 'bar',
        data: [98, 95, 92, 88, 96],
        itemStyle: { color: '#79bbff' }
      }]
    });
  }
};

const handleResize = () => {
  lineChart?.resize();
  pieChart?.resize();
  barChart?.resize();
};

onMounted(() => {
  initCharts();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  lineChart?.dispose();
  pieChart?.dispose();
  barChart?.dispose();
});
</script>
