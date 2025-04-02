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
          <div class="user-info-center">
            <el-avatar :src="userInfo.avatar" size="large"></el-avatar>
            <div class="user-details">
              <span class="username">zqz</span> <!-- 这里展示用户名 -->
              <span class="email">用户在使用过程中遇到任何问题，可以通过电子邮件联系技术支持团队：376771031@qq.com
</span>
            </div>
            <!-- 添加名言名句展示区域 -->
            <div class="quote-section">
              <p class="quote-text">{{ currentQuote.text }}</p>
              <p class="quote-author">—— {{ currentQuote.author }}</p>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'; // 引入 mapState

export default {
  data() {
    return {
      quotes: [
        { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
        { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
        { text: "Life is 10% what happens to us and 90% how we react to it.", author: "Charles R. Swindoll" },
        { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
        { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
        { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
        { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
        { text: "你可以期待太阳从东方升起，而风却随心所欲地从四面八方吹来。", author: "萨特" },
        { text: "勤求古训，博采众方。", author: "张仲景" },
      ],
      currentQuote: {}, // 当前展示的名言
    };
  },
  computed: {
    ...mapState({
      username: (state) => state.user.username, // 映射 username
    }),
    userInfo() {
      return {
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', // 用户头像链接
        email: '376771031@qq.com',
      };
    },
  },
  created() {
    this.showRandomQuote(); // 页面加载时随机展示一条名言
  },
  methods: {
    showRandomQuote() {
      const randomIndex = Math.floor(Math.random() * this.quotes.length); // 随机选择一个名言
      this.currentQuote = this.quotes[randomIndex];
    },
  },
};
</script>

<style scoped>
.user-info-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.user-details {
  margin-top: 20px;
  text-align: center;
}

.username {
  display: block;
  font-weight: bold;
  font-size: 24px; /* 增大了字体大小 */
  color: #333; /* 更深一些的字体颜色 */
}

.email {
  display: block;
  color: #999;
  font-size: 16px; /* 增大了字体大小 */
  margin-top: 10px; /* 增加了一些间距 */
}

/* 名言名句样式 */
.quote-section {
  margin-top: 30px;
  text-align: center;
  max-width: 600px;
  padding: 20px;
  border-radius: 8px;
}

.quote-text {
  font-size: 18px;
  font-style: italic;
  color: #555;
  line-height: 1.6;
}

.quote-author {
  margin-top: 10px;
  font-size: 16px;
  color: #777;
  font-weight: bold;
}
/* 手机端样式 */
@media (max-width: 768px) {
  .el-container {
    flex-direction: column;
  }

  .el-aside {
    width: 100% !important;
    height: auto !important;
  }

  .el-main {
    padding: 10px !important;
  }

  .user-info-center {
    padding: 10px !important;
  }

  .username {
    font-size: 20px !important;
  }

  .email {
    font-size: 14px !important;
  }

  .quote-section {
    padding: 10px !important;
  }

  .quote-text {
    font-size: 16px !important;
  }

  .quote-author {
    font-size: 14px !important;
  }
}


</style>