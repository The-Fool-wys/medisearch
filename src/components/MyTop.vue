<template>
  <div style="display: flex; align-items: center; padding: 20px; justify-content: space-between; width: 100%;">
    <!-- 移动端按钮：展开/收起侧边栏 -->
    <el-button 
      v-if="isMobile" 
      @click="toggleSidebar" 
      icon="el-icon-s-fold" 
      size="mini" 
      style="margin-left: -25px; border: none; background-color: transparent;"
    ></el-button>
    <h1 class="nav-title" style="margin-left: 10px;font-size: 21px;">MediSearch</h1>
    <div style="display: flex; align-items: center;">
      <el-button type="text" @click="goToHome" class="home-button" style="margin-right: 70px;">
        <i class="el-icon-home"></i> 首页
      </el-button>
      <el-dropdown trigger="click" @command="handleCommand" style="color: #333;">
        <span class="el-dropdown-link personal-center">
          <i class="el-icon-user" style="margin-left: -40px;"></i> 个人中心 <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-setting" command="fileManager">文件管理</el-dropdown-item>
          <el-dropdown-item icon="el-icon-time" command="history">历史记录</el-dropdown-item>
          <el-dropdown-item icon="el-icon-star-on" command="favorites">收藏</el-dropdown-item>
          <el-dropdown-item divided icon="el-icon-user" command="profile">个人信息</el-dropdown-item>
          <el-dropdown-item icon="el-icon-switch-button" command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { userApi } from '@/api';

export default {
  data() {
    return {
      isMobile: false, // 是否在移动设备上
    };
  },
  mounted() {
    this.checkMobile(); // 初始化设备检测
    window.addEventListener('resize', this.checkMobile); // 监听窗口大小变化
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile); // 移除监听器
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.logout();
          break;
        case 'fileManager':
          this.fileManager();
          break;
        case 'history':
          this.history();
          break;
        case 'favorites':
          this.favorites();
          break;
        case 'profile':
          this.profile();
          break;
      }
    },
    async logout() {
      try {
        const username = this.$store.state.user.username;
        await userApi.logout({ username });
        this.goToPage('/login');
      } catch (error) {
        console.error('退出登录失败', error);
      }
    },
    fileManager() {
      this.goToPage('/manager');
    },
    profile() {
      this.goToPage('/detail');
    },
    history() {
      this.goToPage('/history');
    },
    favorites() {
      this.goToPage('/favorites');
    },
    goToHome() {
      this.goToPage('/search');
    },
    goToPage(path) {
      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    },
    toggleSidebar() {
      this.$store.commit('toggleSidebar'); // 通过 Vuex 切换侧边栏状态
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768; // 假设 768px 是移动设备的宽度
    },
  },
};
</script>

<style>
.main-content {
  position: relative;
  height: 100%;
  text-align: center;
}

.nav-title {
  font-family: 'Arial', sans-serif;
  font-size: 24px;
  color: #333;
  font-weight: bold;
  margin: -30px;
}
@media (max-width: 768px) {
  .home-button {
    margin-left: 50px !important; /* 增加右边距 */
  }
   /* 缩小“个人中心”整体 */
   .personal-center {
    font-size: 14px; /* 缩小字体 */
    white-space: nowrap; /* 强制不换行 */
    padding: 0 8px; /* 调整内边距 */
  }

  /* 调整下拉图标大小 */
  .personal-center .el-icon-arrow-down {
    font-size: 12px; /* 缩小下拉图标 */
  }
}
</style>