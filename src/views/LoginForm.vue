<template>
  <div class="login-page">
    <!-- 背景图片 -->
    <div class="background"></div>

    <!-- Logo图片 -->
    <img src="../assets/logo.jpg" alt="Logo" class="logo-image">

    <!-- 登录表单 -->
    <div class="login-container">
      <el-container class="form-wrapper">
        <!-- 轮播图 -->
        <el-aside class="carousel-container">
          <el-carousel height="300px">
            <el-carousel-item v-for="(item, index) in carouselList" :key="index">
              <img :src="require('@/assets/' + item.src)" alt="Carousel Image">
            </el-carousel-item>
          </el-carousel>
        </el-aside>
        <!-- 登录表单 -->
        <el-main class="form-container">
          <el-form ref="form" :model="form" label-width="80px">
            <h2>登录</h2>
            <el-form-item label="用户名">
              <el-input v-model="form.username" placeholder="请输入用户名">
                <i slot="prefix" class="el-icon-user"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input type="password" v-model="form.password" placeholder="请输入密码">
                <i slot="prefix" class="el-icon-lock"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <div class="button-group">
                <el-button type="success" @click="onSubmit">登录</el-button>
                <el-button type="primary" @click="register">注册</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { userApi } from '@/api';
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      carouselList: [
        { src: "login1.jpg" },
        { src: "login2.jpg" },
        { src: "login3.jpg" }
      ]
    };
  },
  methods: {
    async onSubmit() {
      const res = await userApi.login(this.form.username,this.form.password)
      console.log(res.msg)
      const code = res.code
      if(code === 200){
        this.$store.state.username = this.form.username
        this.$message.success('登录成功');
        this.$router.push('/search');
      }
      if(code === 401 || code === 402){
        this.$message.error('登录失败: 用户名或密码错误');
      }
      
      // if (this.form.password === '123456') {
      //   this.$message.success('登录成功');
      //   this.$router.push('/search'); // 跳转到搜索页面
      // } else if (this.form.password === '123321') {
      //   this.$message.error('登录失败: 密码错误');
      // } else {
      //   this.$message.error('登录失败: 用户名或密码错误');
      // }
    },
    register() {
      this.$router.push('/register');
    }
  }
};
</script>

<style scoped>
/* 全屏背景 */
.login-page {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-direction: column; /* 使 logo 和表单垂直排列 */
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
  /* opacity: 0.5; 设置透明度为 50% */
}

/* Logo 图片 */
.logo-image {
  width: 420px; 
  height: auto;
  margin-bottom: 20px; 
  z-index: 1; 
  
}

/* 登录容器 */
.login-container {
  width: 800px;
  background-color: rgba(255, 255, 255, 0.9); /* 半透明背景 */
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  margin-bottom: 100px;
}

/* 表单布局 */
.form-wrapper {
  display: flex;
}

.carousel-container {
  width: 50%;
  height: 300px;
  background-color: #f5f5f5;
}

.carousel-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-container {
  width: 50%;
  padding: 20px;
}

.el-form h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.el-form-item {
  margin-bottom: 15px;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.el-button {
  flex: 1;
  margin-right: 10px;
  width: 120px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    width: 90%; 
    padding: 20px; 
  }

  .form-wrapper {
    flex-direction: column; 
  }

  .carousel-container {
    display: none; 
  }

  .form-container {
    width: 100%; 
  }

  .logo-image {
    width: 400px; 
    margin-bottom: 10px; 
  }

  .button-group {
    display: flex; /* 保持按钮在一排 */
    justify-content: center; /* 水平居中对齐 */
    gap: 20px; /* 按钮之间的间隙 */
  }

  .el-button {
    width: 120px; /* 固定按钮宽度 */
    margin-bottom: 0; /* 移除底部间距 */
  }
}
</style>