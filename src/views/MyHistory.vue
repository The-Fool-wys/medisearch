<template>
  <div>
    <el-container style="height: 100vh; border: 1px solid #eee">
      <el-header style="background-color: rgb(238, 241, 246); display: flex; justify-content: space-between; align-items: center;">
        <MyTop></MyTop>
      </el-header>
      <el-container style="padding: 20px;">
        <!-- 侧边栏：根据 sidebarVisible 状态控制显示与隐藏 -->
        <el-aside v-if="$store.state.sidebarVisible" width="260px">
          <div style="padding: 20px;">
            <!-- 日期选择器：在桌面端显示 -->
            <div class="block" style="margin-bottom: 20px;" v-if="!isMobile">
              <span class="demonstration" style="color: #606266;">选择日期</span>
              <el-date-picker
                v-model="value1"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
                :picker-options="pickerOptions"
                @change="filterArticles">
              </el-date-picker>
            </div>
            <ASIDE></ASIDE>
          </div>
        </el-aside>
        <!-- 主内容区域 -->
        <el-main :style="{ marginLeft: $store.state.sidebarVisible ? '20px' : '0' }">
          <!-- 日期选择器：在手机端显示 -->
          <div class="block" style="margin-bottom: 20px;" v-if="isMobile">
            <span class="demonstration" style="color: #606266;">选择日期</span>
            <el-date-picker
              v-model="value1"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
              :picker-options="pickerOptions"
              @change="filterArticles">
            </el-date-picker>
          </div>

          <!-- 表格标题和批量删除按钮 -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <el-header style="font-size: 16px; font-weight: bold; margin: 0;">{{ selectedDate }}</el-header>
            <!-- 搜索框和批量删除按钮 -->
            <div style="display: flex; align-items: center;">
              <el-input
                v-model="searchQuery"
                placeholder="搜索文献名称"
                size="mini"
                style="margin-right: 10px; width: 150px;"
                @input="filterArticles"
              ></el-input>
              <el-button 
                size="mini" 
                type="warning" 
                @click="handleBatchDelete" 
                :disabled="multipleSelection.length === 0"> <!-- 禁用逻辑 -->
                批量删除
              </el-button>
            </div>
          </div>

          <!-- 表格 -->
          <el-table
            :data="pagedTableData"
            style="width: 100%;"
            size="mini"
            :show-header="true"
            @selection-change="handleSelectionChange"
            :row-style="{ height: '70px' }" 
            :cell-style="{ fontSize: '13px'}"> <!-- 设置字体大小 -->
            <el-table-column type="selection" width="55"  reserve-selection></el-table-column>
            <el-table-column prop="filename" label="文章名称">
              <template slot-scope="scope">
                <span style="cursor: pointer; ">{{ scope.row.filename }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="浏览时间"></el-table-column>
            <el-table-column prop="uploadUser" label="上传用户"></el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination
            small
            layout="prev, pager, next"
            :total="filteredTableData.length"
            :page-size="pageSize"
            v-model="currentPage4"
            @current-change="handleCurrentChange"
            style="margin-top: 10px;">
          </el-pagination>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      value1: '',
      selectedDate: '浏览历史',
      allTableData: [
        {
          filename: "骨骼肌系统感染的MRI诊断价值",
          date: "2025-03-18",
          uploadUser: "zqz"
        },
        {
          filename: "成人髓母细胞瘤MRI表现及误诊分析",
          date: "2025-03-17",
          uploadUser: "zqz"
        },
        {
          filename: "超声对致密型乳腺疾病的诊断价值",
          date: "2025-03-17",
          uploadUser: "zqz"
        },
        {
          filename: "MRI-DWI诊断儿童后颅窝肿瘤的临床价值",
          date: "2025-03-16",
          uploadUser: "zqz"
        },
        {
          filename: "基因编辑技术在医学中的应用",
          date: "2025-03-16",
          uploadUser: "zqz"
        },
        {
          filename: "黄韧带肥厚的MRI诊断",
          date: "2025-03-17",
          uploadUser: "zqz"
        },
        {
          filename: "获得性免疫缺陷综合征合并神经梅毒的MRI影像表现",
          date: "2025-03-16",
          uploadUser: "zqz"
        }
      ],
      filteredTableData: [], // 过滤后的数据
      currentPage4: 1, // 当前页码
      pageSize: 10, // 每页显示的数量
      multipleSelection: [], // 批量选择的记录
      searchQuery: '', // 搜索框内容
      isMobile: false // 是否在手机端
    };
  },
  created() {
    // 初始化时直接使用假数据
    this.filteredTableData = this.allTableData.sort((a, b) => new Date(b.date) - new Date(a.date));
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkIfMobile);
  },
  computed: {
    pagedTableData() {
      const start = (this.currentPage4 - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredTableData.slice(start, end);
    }
  },
  methods: {
    filterArticles() {
      let filteredData = this.allTableData;

      // 根据日期过滤
      if (this.value1) {
        filteredData = filteredData.filter(item => {
          const itemDate = new Date(item.date); // 将字符串转换为 Date 对象
          return itemDate.toDateString() === this.value1.toDateString();
        });
        this.selectedDate = this.value1.toLocaleDateString();
      } else {
        this.selectedDate = '浏览历史';
      }

      // 根据搜索内容过滤
      if (this.searchQuery) {
        filteredData = filteredData.filter(item => item.filename.toLowerCase().includes(this.searchQuery.toLowerCase()));
      }

      this.filteredTableData = filteredData.sort((a, b) => new Date(b.date) - new Date(a.date)); // 按时间从最新到最旧排序
      this.currentPage4 = 1; // 重置到第一页
    },
    handleSelectionChange(selection) {
      this.multipleSelection = selection; // 更新批量选择的记录
    },
    handleCurrentChange(page) {
      this.currentPage4 = page;
    },
    handleBatchDelete() {
      if (this.multipleSelection.length === 0) return;
      // 更新表格数据，移除已删除的记录
      this.filteredTableData = this.filteredTableData.filter(
        item => !this.multipleSelection.includes(item)
      );
      this.$message.success('批量删除成功');
    },
    checkIfMobile() {
      this.isMobile = window.innerWidth <= 768;
    }
  }
};
</script>

<style scoped>
.block {
  margin-bottom: 20px;
}

.demonstration {
  display: block;
  margin-bottom: 10px;
  color: #606266;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .el-container {
    flex-direction: column;
  }
  .el-aside {
    width: 100% !important; /* 侧边栏宽度占满屏幕 */
    height: auto !important; /* 高度自适应 */
    box-shadow: none; /* 移除阴影 */
  }
  .el-main {
    margin-left: 0 !important; /* 主内容区域不缩进 */
    padding: 10px !important; /* 减少内边距 */
  }
  .el-table {
    font-size: 12px; /* 缩小表格字体 */
  }
  .el-button {
    font-size: 12px; /* 缩小按钮字体 */
  }
  .el-pagination {
    margin-top: 5px; /* 调整分页间距 */
  }
}

.sidebar-container {
  background-color: #fff; /* 背景色 */
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15); /* 阴影效果 */
  overflow: hidden; /* 防止内容溢出 */
}
</style>