<template>
  <div>
    <!-- 遮罩层（仅手机端显示） -->
    <div
      v-if="isMobile && $store.state.sidebarVisible"
      class="sidebar-overlay"
      @click="closeSidebar"
    ></div>

    <!-- 侧边栏 -->
    <el-menu
      :default-openeds="['1', '2']"
      :style="menuStyle"
      class="sidebar-menu"
    >
      <!-- 浏览记录 -->
      <el-submenu index="1">
        <template slot="title"><i class="el-icon-view"></i>浏览记录</template>
        <el-menu-item-group>
          <div v-if="historyList.length > 0">
            <el-menu-item v-for="(item, index) in historyList" :key="index">
              {{ item.fileName }} 
            </el-menu-item>
          </div>
          <el-menu-item v-else>暂无浏览记录</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <!-- 数据统计 -->
      <el-submenu index="2">
        <template slot="title"><i class="el-icon-data-line"></i>数据统计</template>
        <el-menu-item-group>
          <!-- 搜索结果分数统计 -->
          <el-menu-item v-if="$route.name === 'SearchDetail'">
            <div>
              <h3 style="margin-bottom: 3px;">搜索结果分数分布(%)</h3>
              <div id="searchScoreChart" style="width: 100%; height: 230px; margin-top: -40px; "></div>
            </div>
          </el-menu-item>
          
          <!-- 文献段落分数统计 -->
          <el-menu-item v-if="$route.name === 'FileDetail'">
            <div>
              <h3 style="margin-bottom: 3px;">文献段落分数分布(%)</h3>
              <div id="paragraphScoreChart" style="width: 100%; height: 200px; margin-top: -40px;"></div>
            </div>
          </el-menu-item>
          
          <!-- 上传文件数量统计 -->
          <el-menu-item v-if="$route.name !== 'FileDetail' && $route.name !== 'SearchDetail'">
            <div>
              <h3 style="margin-bottom: 3px;">最近上传文件数量</h3>
              <div id="uploadCountChart" style="width: 100%; height: 200px; margin-top: 0;"></div>
            </div>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      uploadCountData: [], // 上传文件数量数据
      isMobile: window.innerWidth <= 768, // 判断是否是手机端
      paragraphScoreData: [
        { score: '高', count: 2 },
        { score: '中', count: 5 },
        { score: '低', count: 1 }
      ],
      searchScoreData: [] // 搜索结果分数数据
    };
  },
  computed: {
    historyList() {
      return this.$store.state.historyList;
    },
    menuStyle() {
      if (this.isMobile) {
        return {
          width: this.$store.state.sidebarVisible ? '240px' : '0',
          transition: 'width 0.3s',
          overflow: 'hidden',
          zIndex: 1001,
          position: 'fixed',
          top: '60px',
          left: '0',
          height: 'calc(100vh - 60px)',
          backgroundColor: '#fff',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
        };
      } else {
        return {
          width: this.$store.state.sidebarVisible ? '240px' : '0',
          transition: 'width 0.3s',
          overflow: 'hidden',
          zIndex: 1000,
        };
      }
    },
    // 从路由中获取搜索内容
    searchContent() {
      if (this.$route.query && this.$route.query.query) {
        try {
          const query = JSON.parse(decodeURIComponent(this.$route.query.query));
          return query.mainQuery.content;
        } catch (e) {
          return '';
        }
      }
      return '';
    },
    // 检查是否有诊断相关的搜索条件
    hasDiagnosisQuery() {
      if (this.$route.query && this.$route.query.query) {
        try {
          const query = JSON.parse(decodeURIComponent(this.$route.query.query));
          return query.additionalQueries && query.additionalQueries.some(q => q.content.includes("诊断"));
        } catch (e) {
          return false;
        }
      }
      return false;
    },
    // 计算段落分数的百分比数据
    paragraphScorePercentage() {
      const total = this.paragraphScoreData.reduce((sum, item) => sum + item.count, 0);
      return this.paragraphScoreData.map(item => ({
        score: item.score,
        percentage: Math.round((item.count / total) * 100),
        count: item.count
      }));
    }
  },
  watch: {
    // 监听路由变化，重新渲染图表
    $route() {
      this.renderCharts();
    }
  },
  created() {
    this.fetchHistory();
    this.fetchUploadCount();
  },
  mounted() {
    this.renderCharts();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    fetchHistory() {
      // 加载浏览历史逻辑
    },
    fetchUploadCount() {
      this.uploadCountData = [
        { uploadDate: "03-14", uploadCount: 0 },
        { uploadDate: "03-15", uploadCount: 857 },
        { uploadDate: "03-16", uploadCount: 215 },
        { uploadDate: "03-17", uploadCount: 0 },
        { uploadDate: "03-18", uploadCount: 0 },
      ];
    },
    // 根据搜索内容获取分数统计数据
    getSearchScoreData() {
      const content = this.searchContent;
      const hasDiagnosis = this.hasDiagnosisQuery;
      
      if (content.includes("骨骼")) {
        return [
          { score: '高', count: 1 },
          { score: '较高', count: 1 },
          { score: '中等', count: 1 },
          { score: '较低', count: 0 },
          { score: '低', count: 0 }
        ];
      } else if (content.includes("肝癌")) {
        if (hasDiagnosis) {
          return [
            { score: '高', count: 3 },
            { score: '较高', count: 5 },
            { score: '中等', count: 2 },
            { score: '较低', count: 4 },
            { score: '低', count: 1 }
          ];
        } else {
          return [
            { score: '高', count: 4 },
            { score: '较高', count: 7 },
            { score: '中等', count: 2 },
            { score: '较低', count: 4 },
            { score: '低', count: 1 }
          ];
        }
      }
      return [];
    },
    // 计算搜索分数的百分比数据
    getSearchScorePercentage() {
      const data = this.getSearchScoreData();
      const total = data.reduce((sum, item) => sum + item.count, 0) || 1; // 避免除以0
      return data.map(item => ({
        score: item.score,
        percentage: Math.round((item.count / total) * 100),
        count: item.count
      }));
    },
    renderCharts() {
      if (this.$route.name === 'SearchDetail') {
        this.searchScoreData = this.getSearchScorePercentage();
        this.renderSearchScoreChart();
      } else if (this.$route.name === 'FileDetail') {
        this.renderParagraphScoreChart();
      } else {
        this.renderUploadCountChart();
      }
    },
    renderSearchScoreChart() {
      const chartDom = document.getElementById('searchScoreChart');
      if (!chartDom) return;

      const oldChart = echarts.getInstanceByDom(chartDom);
      if (oldChart) oldChart.dispose();

      const chart = echarts.init(chartDom);
      chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: '{b}: {c}% '
        },
        grid: {
          left: '0%',
          right: '8%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLabel: { 
            formatter: '{value}%',
            showMaxLabel: true
          },
          max: 100,
          interval: 20
        },
        yAxis: {
          type: 'category',
          data: this.searchScoreData.map(item => item.score).reverse(),
          axisLabel: { interval: 0 }
        },
        series: [{
          name: '百分比',
          type: 'bar',
          data: this.searchScoreData.map(item => item.percentage).reverse(),
          itemStyle: {
            color: (params) => ['#1a6fdf', '#3a8ee6', '#5cadf0', '#7db8f5', '#9fc9f8'][params.dataIndex]
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}%',
            color: '#333'
          },
          // 添加额外数据用于tooltip显示
          encode: {
            x: 'percentage',
            y: 'score',
            tooltip: ['count']
          }
        }]
      });
      window.addEventListener('resize', () => chart.resize());
    },
    renderParagraphScoreChart() {
      const chartDom = document.getElementById('paragraphScoreChart');
      if (!chartDom) return;

      const oldChart = echarts.getInstanceByDom(chartDom);
      if (oldChart) oldChart.dispose();

      const chart = echarts.init(chartDom);
      chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: '{b}: {c}% '
        },
        grid: {
          left: '0%',
          right: '8%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLabel: { 
            formatter: '{value}%',
            showMaxLabel: true
          },
          max: 100,
          interval: 20
        },
        yAxis: {
          type: 'category',
          data: this.paragraphScorePercentage.map(item => item.score).reverse(),
          axisLabel: { interval: 0 }
        },
        series: [{
          name: '百分比',
          type: 'bar',
          data: this.paragraphScorePercentage.map(item => item.percentage).reverse(),
          itemStyle: {
            color: (params) => ['#1a6fdf', '#3a8ee6', '#5cadf0'][params.dataIndex]
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}%',
            color: '#333'
          },
          // 添加额外数据用于tooltip显示
          encode: {
            x: 'percentage',
            y: 'score',
            tooltip: ['count']
          }
        }]
      });
      window.addEventListener('resize', () => chart.resize());
    },
    renderUploadCountChart() {
      const chartDom = document.getElementById('uploadCountChart');
      if (!chartDom) return;

      const oldChart = echarts.getInstanceByDom(chartDom);
      if (oldChart) oldChart.dispose();

      const chart = echarts.init(chartDom);
      chart.setOption({
        grid: {
          left: '20%',
          right: '5%',
          top: '10%',
          bottom: '10%',
        },
        xAxis: {
          type: 'category',
          data: this.uploadCountData.map(item => item.uploadDate),
        },
        yAxis: { type: 'value' },
        series: [{
          data: this.uploadCountData.map(item => item.uploadCount),
          type: 'line',
          smooth: true,
          lineStyle: { color: '#1a6fdf' }
        }]
      });
      window.addEventListener('resize', () => chart.resize());
    },
    closeSidebar() {
      this.$store.commit('toggleSidebar');
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 768;
    }
  }
};
</script>

<style scoped>
/* 遮罩层样式（仅手机端） */
.sidebar-overlay {
  position: fixed;
  top: 60px; /* 顶部栏高度 */
  left: 0;
  width: 100%;
  height: calc(100vh - 60px);
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色 */
  z-index: 1000; /* 确保遮罩层在侧边栏之下 */
}

/* 侧边栏样式 */
.sidebar-menu {
  border-right: none !important;
  overflow-y: auto; /* 允许侧边栏内容滚动 */
  height: calc(100vh - 61px); /* 高度减去顶部栏高度 */
}

#paragraphScoreChart,
#uploadCountChart,
#searchScoreChart {
  width: 100%;
  height: 250px;
  margin-top: 0;
}

.el-menu-item {
  padding: 0 10px !important;
  line-height: 20px;
  font-size: 13px;
  white-space: normal; 
  word-break: break-word; /* 超出宽度时自动换行 */
}

.el-submenu__title {
  font-size: 14px !important;
}
</style>