<template>
  <div>
    <el-container style="height: 100vh; border: 1px solid #eee">
      <el-header style="background-color: rgb(238, 241, 246); display: flex; justify-content: space-between; align-items: center;">
        <MyTop></MyTop>
      </el-header>
      <el-container>
        <el-aside v-if="$store.state.sidebarVisible" width="260px">
          <ASIDE></ASIDE>
        </el-aside>
        <el-main>
          <!-- 收藏列表 -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; margin-top: 20px;">
            <el-header style="font-size: 16px; font-weight: bold; margin: 0;">收藏列表</el-header>
            <div style="display: flex; align-items: center;">
              <!-- 搜索框 -->
              <el-input
                v-model="searchQuery"
                placeholder="搜索文献标题"
                size="mini"
                style="margin-right: 10px; width: 150px;"
                @input="filterFavorites"
              ></el-input>
              <el-button 
                size="mini" 
                type="info" 
                @click="handleBatchDownload" 
                :disabled="selectedFiles.length === 0"> 
                下载
              </el-button>
              <el-button 
                size="mini" 
                type="danger" 
                @click="handleBatchDelete" 
                :disabled="selectedFiles.length === 0"> <!-- 根据 selectedFiles 的长度决定是否禁用 -->
                取消收藏
              </el-button>
            </div>
          </div>
          <el-table 
            :data="filteredFavorites.slice((currentPage2 - 1) * pageSize, currentPage2 * pageSize)" 
            style="width: 100%" 
            size="mini" 
            @selection-change="handleSelectionChange"
            :show-header="true"
            :row-style="{ height: '70px' }" 
            :cell-style="{ fontSize: '13px' }">
            <el-table-column type="selection" width="55"  reserve-selection></el-table-column>
            <el-table-column prop="filename" label="标题"></el-table-column>
            <el-table-column prop="author" label="作者"></el-table-column>
            <el-table-column prop="publicationDate" label="发表时间"></el-table-column>
            <el-table-column prop="keywords" label="关键词"></el-table-column>
            <el-table-column prop="uploadUser" label="上传用户"></el-table-column>
          </el-table>
          <el-pagination
            small
            layout="prev, pager, next"
            :total="filteredFavorites.length"
            :page-size="pageSize"
            v-model="currentPage2"
            style="margin-top: 10px;"
            @current-change="handleCurrentChange">
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
      favoriteFiles: [
        {
          filename: "多模态超声在非肿块乳腺病变诊断中的应用",
          author: "李诗雨 牛瑞兰 王博 姜莹 王知力",
          publicationDate: "2022-03",
          keywords: "非肿块乳腺病变;超声检查;造影剂;弹性成像技术;病理学;外科;诊断;鉴别",
          uploadUser: "zqz"
        },
         {
          filename: "妇科影像报告和数据系统鉴别附件肿块良恶性的应用价值",
          author: "李琴 赵薇 唐柳林 莫莹莹",
          publicationDate: "2021-05",
          keywords: "超声检查;妇科影像报告和数据系统;附件肿块;良恶性",
          uploadUser: "zqz"
        },
        {
          filename: "肝脏超声造影对早期肝癌患者病灶位置的诊断价值",
          author: "程晓莉  邹谨   欧阳威",
          publicationDate: "2023-02",
          keywords: "肝癌;肝脏超声造影;病灶转移;诊断价值",
          uploadUser: "zqz"
        },
        {
          filename: "1.5T MRI检查对诊断原发性肝癌的敏感度与特异度分析",
          author: "周若兰 唐兴竹",
          publicationDate: "2023-12",
          keywords: "西门子1.5T;MRI原发性肝癌",
          uploadUser: "zqz"
        },
        {
          filename: "3.0T 磁共振成像与64排螺旋CT在肝癌诊断中临床应用价值对比",
          author: "梁志鹏 姚立正 陈飞 王雪扬 陆鹏",
          publicationDate: "2016-02",
          keywords: "肝肿瘤;磁共振成像;体层摄影术",
          uploadUser: "zqz"
        },
        {
          filename: "失神经骨骼肌再生的MRI定量与病理学对照研究",
          author: "陈妙玲 李新春 胡文清",
          publicationDate: "2011-04",
          keywords: "失神经骨骼肌;T2驰豫时间;磁共振成像",
          uploadUser: "zqz"
        }
      ], // 收藏列表数据
      filteredFavorites: [], // 过滤后的收藏列表
      currentPage2: 1, // 当前页码
      pageSize: 5, // 每页显示数量
      selectedFiles: [], // 选中的文件
      searchQuery: '' // 搜索框内容
    };
  },
  created() {
    // 组件创建时直接使用假数据
    this.filteredFavorites = this.favoriteFiles;
  },
  methods: {
    // 过滤收藏列表
    filterFavorites() {
      if (this.searchQuery) {
        this.filteredFavorites = this.favoriteFiles.filter(file =>
          file.filename.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      } else {
        this.filteredFavorites = this.favoriteFiles; // 如果没有搜索内容，显示全部
      }
      this.currentPage2 = 1; // 重置到第一页
    },
    // 处理选中文件
    handleSelectionChange(selection) {
      this.selectedFiles = selection; 
    },
    handleCurrentChange(page) {
      this.currentPage2 = page;
    },
    // 批量下载（模拟下载逻辑）
    handleBatchDownload() {
      if (this.selectedFiles.length === 0) return;
      this.$message.success('下载功能为模拟，未实际下载文件');
    },
    // 批量取消收藏（直接删除数据）
    handleBatchDelete() {
      if (this.selectedFiles.length === 0) return;
      const filenames = this.selectedFiles.map(file => file.filename);
      this.favoriteFiles = this.favoriteFiles.filter(file => !filenames.includes(file.filename));
      this.filteredFavorites = this.filteredFavorites.filter(file => !filenames.includes(file.filename));
      this.$message.success('取消收藏成功');
    }
  }
};
</script>

<style>
.favorites-input .el-input__inner {
  height: 28px; 
  margin-left: 258px;
}

/* 移动端样式 */
@media (max-width: 768px) {
  .el-container {
    flex-direction: column;
  }
  .el-main {
    padding: 10px; /* 调整主内容区域的内边距 */
  }
  .el-table {
    font-size: 12px; /* 调整表格字体大小 */
  }
  .el-table .el-button {
    padding: 5px; /* 调整按钮内边距 */
  }
  .el-pagination {
    font-size: 12px; /* 调整分页组件字体大小 */
  }
  .list-header {
    flex-direction: column; /* 将标题和按钮垂直排列 */
    align-items: flex-start;
  }
  .list-header .el-button {
    margin-top: 10px; /* 调整按钮的上边距 */
  }
}
</style>