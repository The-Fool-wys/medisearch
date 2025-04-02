<template>
  <div class="container">
    <el-container style="height: 100vh; border: 1px solid #eee">
      <el-header style="background-color: rgb(238, 241, 246); display: flex; justify-content: space-between; align-items: center;">
        <MyTop></MyTop>
      </el-header>

      <!-- 侧边栏和主内容区域 -->
      <el-container style="flex: 1; display: flex;">
        <!-- 侧边栏 -->
        <el-aside v-if="$store.state.sidebarVisible" style="width: 240px; background-color: #f4f4f4; flex-shrink: 0;">
          <ASIDE></ASIDE>
        </el-aside>

        <!-- 主内容区域 -->
        <el-main style="padding: 10px; display: flex; flex-direction: column; align-items: center; flex: 1; position: relative;">
          <!-- 图片和搜索框 -->
          <div style="width: 100%; max-width: 600px; margin-top: 40px;">
            <img src="@/assets/logo.jpg" alt="Logo" style="width: 100%; height: auto;">
          </div>
          <SearchIn @search="handleSearch"></SearchIn>
          <div class="background"></div>

          <!-- 开关 -->
          <div style="position: absolute; top: 20px; right: 20px;">
            <el-switch
              v-model="switchValue"
              active-color="#13ce66"
              inactive-color="#E6A23C"
              active-text="全文数据库"
              inactive-text="个人数据库"
              @change="handleSwitchChange">
            </el-switch>
          </div>

          <!-- 外部网站链接 -->
          <div class="external-sites" style="margin-top: 40px;">
            <a href="http://www.wanfangdata.com.cn" target="_blank" class="external-site">
              <img src="@/assets/wanfang.jpg" alt="万方数据" class="site-icon">
              万方数据
            </a>
            <a href="https://pubmed.ncbi.nlm.nih.gov" target="_blank" class="external-site">
              <img src="@/assets/pubmed.jpg" alt="PubMed" class="site-icon">
              PubMed
            </a>
            <a href="https://www.cnki.net" target="_blank" class="external-site">
              <img src="@/assets/zhiwang.jpg" alt="知网" class="site-icon">
              知网
            </a>
            <a href="https://www.nstl.gov.cn" target="_blank" class="external-site">
              <img src="@/assets/nstl.jpg" alt="NSTL" class="site-icon">
              NSTL
            </a>
            <a href="https://ovidsp.ovid.com" target="_blank" class="external-site">
              <img src="@/assets/ovid.jpg" alt="Ovid" class="site-icon">
              Ovid
            </a>
            <a href="https://www.embase.com" target="_blank" class="external-site">
              <img src="@/assets/embase.jpg" alt="Embase" class="site-icon">
              Embase
            </a>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import SearchIn from '@/components/SearchIn.vue';

export default {
  components: {
    SearchIn,
  },
  data() {
    return {
      switchValue: true,
    };
  },
  methods: {
    handleSwitchChange() {
      // 切换数据库模式
      this.$store.dispatch('toggleDatabaseMode');
    },
     handleSearch(searchConditions) {
      console.log('Search conditions:', searchConditions); // 打印调试信息
      // 将搜索条件传递到 searchdetail 页面
      const searchQuery = encodeURIComponent(JSON.stringify(searchConditions));
      this.$router.push({
        path: '/searchdetail',
        query: { 
          query: searchQuery,
          searchText: searchConditions.mainQuery.content // 传递搜索框内容
        },
      });
    },
  },
};
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.external-sites-container {
  width: 100%;
  text-align: center; /* 居中显示外部网站链接 */
}

.external-sites {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px; /* 设置链接之间的间距 */
}

.external-site {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  font-size: 16px;
}

.site-icon {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/login-bg.jpg'); 
  background-size: cover;
  background-position: center;
  /* filter: blur(2px); */
  z-index: -1;
  opacity: 0.8; 
  
}
@media (max-width: 768px) {
  .el-container {
    flex-direction: column;
  }
}
</style>