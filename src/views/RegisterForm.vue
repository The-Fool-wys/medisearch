<template>
  <div class="register-page">
    <!-- 背景图片 -->
    <div class="background"></div>

    <!-- 注册容器 -->
    <div class="register-container">
      <h2>注册</h2>
      <el-form ref="registerForm" :model="registerForm" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="registerForm.username" placeholder="请输入用户名">
          <i slot="prefix" class="el-icon-user"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="registerForm.password" placeholder="请输入密码">
           <i slot="prefix" class="el-icon-lock"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input type="password" v-model="registerForm.confirmPassword" placeholder="请再次输入密码">
           <i slot="prefix" class="el-icon-lock"></i>
        </el-input>
      </el-form-item>
        <el-form-item class="button-container">
          <el-button type="primary" @click="onRegister">注册</el-button>
          <el-button class="back-button" @click="onBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { userApi } from '@/api';

export default {
  data() {
    return {
      registerForm: {
        username: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    async onRegister() {
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.$message.error('两次输入的密码不一致');
        return;
      }
      const res = await userApi.register(this.registerForm.username,this.registerForm.password)
      if(res.code === 200){
        this.$message.success('注册成功');
        this.$router.push('/login');
      }else{
        //逻辑待填
        this.$message.error('注册失败: 用户名不符合要求');
      }
    },
    onBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex; 
  flex-direction: column;
  align-items: center;
  justify-content: center; 
  width: 350px; /* Increased width */
  height: auto; 
  margin: 0 auto; 
  padding: 20px; /* Adjusted padding */
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  position: absolute; 
  top: 50%; 
  left: 50%; 
  transform: translate(-50%, -50%); 
}

.register-container h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.el-form-item {
  margin-bottom: 20px;
}


.back-button {
  background-color: transparent; 
  border: 1px solid #409EFF; 
  color: #409EFF; 
  margin-left: 30px; 
}

.back-button:hover {
  background-color: #409EFF; 
  color: #fff; 
}

.button-container {
  display: flex;
  justify-content: 10px; 
  margin-top: 20px; 
}

/* 返回按钮样式 */
.back-button {
  background-color: transparent; 
  border: 1px solid #ccc; 
  color: #333; 
}

.back-button:hover, .back-button:focus {
  background-color: #f0f0f0; 
  color: #333; 
  border-color: #ccc; 
}
.register-page {
  position: relative;
  min-height: 100vh; 
  overflow: hidden;
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
    /* filter: blur(2px); 背景模糊效果 */
  z-index: -1; 
}
</style>