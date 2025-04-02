<template>
  <div style="height: 100vh; overflow: auto;">
    <!-- 页面加载状态 -->
    <div v-if="isLoading" style="width: 100%; height: 100%; position: fixed; top: 0; left: 0; background-color: white; z-index: 9999;"></div>

    <el-container style="height: 100%; border: 1px solid #eee" v-if="!isLoading">
      <el-header style="background-color: rgb(238, 241, 246); display: flex; justify-content: space-between; align-items: center;">
        <MyTop></MyTop>
      </el-header>
      <el-container>
        <el-aside v-if="$store.state.sidebarVisible" width="260px">
          <ASIDE></ASIDE>
        </el-aside>
        <el-main style="display: flex; flex-direction: column; align-items: start; justify-content: start; padding: 10px; overflow: hidden; height: 100%;">
          <!-- 顶部文件信息展示区域 -->
          <div v-if="selectedFile" class="custom-card" style="width: 100%; padding: 20px; margin-bottom: 30px;margin-left: -15px;">
            <div class="card-header">
              <h3 style="margin-bottom: 10px;">{{ selectedFile.filename }}</h3>
              <div class="card-body">
                <div class="card-item">
                  <span class="card-label">作者:</span>
                  <span>{{ selectedFile.author }}</span>
                  <span class="card-label" style="margin-left: 10px;">发表时间:</span>
                  <span>{{ selectedFile.publicationDate }}</span>
                </div>
                <div class="card-item">
                  <span class="card-label">关键字:</span>
                  <span>{{ selectedFile.keywords }}</span>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <div class="score-hit-container">
                <span class="score">得分: {{ selectedFile.score }}</span>
                <span class="hit">命中: {{ selectedFile.hit }}</span>
                <span class="click">点击量: {{ click }}</span>
                <span class="stars">收藏量: {{ stars }}</span>
              </div>
              <div class="button-group">
                <el-button type="info" icon="el-icon-download" @click="handleDownload(selectedFile)">下载</el-button>
                <el-button type="primary" icon="el-icon-reading" @click="handleRead">阅读</el-button>
                <el-button
                  :type="isFavorite ? 'danger' : 'warning'"
                  :icon="isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'"
                  @click="handleToggleCollect">
                  {{ isFavorite ? '已收藏' : '收藏' }}
                </el-button>
              </div>
            </div>
          </div>

          <!-- 文献和图片标签页 -->
          <el-tabs v-model="activeTab" style="margin-left: 50px; margin-top: 20px; width: 900px; height: calc(100% - 200px); overflow: hidden;">
            <el-tab-pane label="文献" name="literature">
              <!-- 文本类结果 -->
              <el-table :data="textResults" style="width: 100%; height: 100%;" size="mini" :cell-style="{ fontSize: '13px' }">
                <el-table-column label="内容">
                  <template slot-scope="scope">
                    <div v-html="highlightTags(scope.row.content)"></div>
                  </template>
                </el-table-column>
                <el-table-column prop="page_num" label="页码" width="100" header-align="right" align="right">
                  <template slot-scope="scope">
                    <div style="text-align: right; padding-right: 10px;">{{ scope.row.page_num }}</div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="图片" name="image">
              <!-- 图片类结果 -->
              <el-table :data="imageResults" style="width: 100%; height: 100%;" size="mini">
                <el-table-column label="图片文本">
                  <template slot-scope="scope">
                    <div v-html="highlightTags(scope.row.content.imgtext)"></div>
                  </template>
                </el-table-column>
                <el-table-column prop="page_num" label="页码" width="100"></el-table-column>
                <el-table-column label="图片" width="200">
                  <template slot-scope="scope">
                    <img :src="scope.row.content.imgfile" style="width: 100%; height: 100px; object-fit: cover;">
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>

      <!-- 下载进度条弹窗 -->
      <el-dialog
        :visible.sync="downloadDialogVisible"
        title="下载中"
        width="30%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false">
        <el-progress :percentage="downloadProgress" status="success"></el-progress>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="downloadDialogVisible = false" v-if="downloadProgress === 100">关闭</el-button>
        </span>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedFile: {
        filename: "骨骼肌系统感染的MRI诊断价值",
        author: "李文元;黄恭康",
        publicationDate: "2023-10",
        keywords: "磁共振成像;感染;骨骼肌系统",
        score: 62,
        hit: 8,
        isFavorite: false,
      },
      literatureDetails: [
        {
          type: 'text',
          content: '<tag>骨骼</tag>肌系统感染，于MRIT1WI上多低信号、T2WI上多高信号。',
          page_num: 1,
        },
        {
          type: 'text',
          content: '<tag>骨骼</tag>肌系统感染，MRI优于X线平片检查，但类似上述，MRI表现也可见于<tag>骨骼</tag>肌系统的其他良性或恶性病变。',
          page_num: 1,
        },
        {
          type: 'text',
          content: 'MRI对 <tag>骨骼</tag>肌系统感染的检查已有报道',
          page_num: 1,
        },
        {
          type: 'text',
          content: '<tag>骨骼</tag>肌系统感染，常首选线摄片检查，然而病变早期常阴性，有时显示骨膜增生，却难以了解骨髓病变',
          page_num: 1,
        },
        {
          type: 'text',
          content: 'STIR技术具有脂肪抑制和对<tag>骨骼</tag>肌系统病变显示有高度敏感性',
          page_num: 2,
        },
        {
          type: 'text',
          content: '<tag>骨骼</tag>肌系统感染，MRIT1WI上多低信号，T2WI上多高信号',
          page_num: 2,
        },
        {
          type: 'text',
          content: '<tag>骨骼</tag>肌系统感染，MRI明显优于X线平片检查，但类似MRI表现也可见于<tag>骨骼</tag>肌肉系统的其他良性或恶性病变。',
          page_num: 2,
        },
        {
          type: 'img',
          content: {
            imgtext: '<tag>骨骼</tag>肌系统感染的MRI诊断价值',
            imgfile: require('@/assets/test.jpg'), // 图片路径
          },
          page_num: 4,
        },
      ],
      activeTab: 'literature',
      isFavorite: false,
      click: 3, // 点击量
      stars: 1, // 收藏量
      downloadDialogVisible: false, // 控制下载弹窗的显示
      downloadProgress: 0, // 下载进度
      isLoading: false, // 加载状态
    };
  },
  computed: {
    textResults() {
      return this.literatureDetails.filter(item => item.type === 'text');
    },
    imageResults() {
      return this.literatureDetails.filter(item => item.type === 'img');
    },
  },
  created() {
    // 从路由中获取文件名
    const filename = this.$route.params.filename;
    if (filename) {
      // 将文件名添加到浏览历史
      this.$store.dispatch('addHistory', decodeURIComponent(filename));
    }
  },
  methods: {
    // 下载文件
    handleDownload(file) {
      if (!file || !file.filename) {
        this.$message.warning('文件信息不完整，无法下载');
        return;
      }

      // 显示下载弹窗
      this.downloadDialogVisible = true;
      this.downloadProgress = 0; // 重置进度

      // 模拟下载过程
      const interval = setInterval(() => {
        const randomIncrement = Math.floor(Math.random() * 6) + 1; // 随机增加 1-20%
        this.downloadProgress += randomIncrement;
        if (this.downloadProgress >= 100) {
          clearInterval(interval); // 停止定时器
          this.downloadProgress = 100; // 确保进度为100%
          this.$message.success(`下载成功: ${file.filename}.pdf`); // 下载完成提示
        }
      }, Math.random() * 500 + 100); // 随机间隔 100-600ms
    },
//     handleDownload(file) {
//   if (!file || !file.filename) {
//     this.$message.warning('文件信息不完整，无法获取下载链接');
//     return;
//   }

//   this.$alert(
//     `<div style="line-height: 1.6;">
//       <p>尊敬的用户：</p>
//       <p>由于版权保护政策，本平台不直接提供文献下载服务。</p>
//       <p>您可以访问以下官方链接获取该文献：</p>
//       <p style="text-align: center; margin: 15px 0;">
//         <a href="https://docdown.cnki.net/docdown/fulltext/download?q=NP7oX%2BLD6jdCNfVk3NNhrmQEEJ1X6xJJabtCdTSWpO8Y6qUCnF%2BUAS6Fx4ppwqczpm54hnKWApte7HamZAIzbYOqBKPKFv8B%2FU5UjDknlxkhHz2XOBGYoQYUzhqRLm%2F91Z%2B6sVUkG%2FcMMC4f9dpY3xWS0w8PS8B%2F9w0iSGUQUIzYIw3%2FiDCv3Z2RPBNIWc7rXJSGN29tPMAab%2FHMkYlnMF6ytOOxn7Df13eBniiq9%2FYt3DZjEsKEe5WT1aXB4Ejoc0DC1YTcpT7eXMlJhtOhy6bA8eiuTfF9Qhnbi0tz%2BP2yTxBWeEDQBUHfw8ekIboDtEss9IBgRLZGBx4vSID2K7FaUYROKWQgEohXdULRq3opipE85eaorOwh0TuqgO2xRfRWD3eC2GEk2o9nY0GEMZqpW%2Fu43T0zRTWN6rwFZOhR%2FKvcqO3gMYXglobcA6xgvwPjEm0GMInHg1JGsPyXspHzrhuY8QcpQZTQJ62eez%2FRS8rXog3JU2e778wFjrD9GIlT2%2BI2BK8OWa%2FneAE9oY2o3aC61PRVjIMdbJE8bg0%3D&invoice=myaM%2BnmckBTdyvKiYsAskqM8%2BDu%2BCQpcT0ibktoycZIJDMWqYYfKAK3nAtaH2RzhtFIiMNKDecIEi9cO1MzEIpgofg9YttK2%2BfLlsjmERb%2F19xFK2Xgr7%2BzI009KYNIuix9KfpWvf8f3EchPcQkoy7z1q8cZ6TyCHKzkKD8MK7E%3D" target="_blank" style="color: #409EFF; text-decoration: underline;">
//           https://bar.cnki.net/bar/download
//         </a>
//       </p>
//       <p>感谢您对知识产权的尊重与支持！</p>
//     </div>`,
//     '版权提示',
//     {
//       dangerouslyUseHTMLString: true,
//       confirmButtonText: '前往下载',
//       callback: action => {
//         if (action === 'confirm') {
//           window.open('https://docdown.cnki.net/docdown/fulltext/download?q=NP7oX%2BLD6jdCNfVk3NNhrmQEEJ1X6xJJabtCdTSWpO8Y6qUCnF%2BUAS6Fx4ppwqczpm54hnKWApte7HamZAIzbYOqBKPKFv8B%2FU5UjDknlxkhHz2XOBGYoQYUzhqRLm%2F91Z%2B6sVUkG%2FcMMC4f9dpY3xWS0w8PS8B%2F9w0iSGUQUIzYIw3%2FiDCv3Z2RPBNIWc7rXJSGN29tPMAab%2FHMkYlnMF6ytOOxn7Df13eBniiq9%2FYt3DZjEsKEe5WT1aXB4Ejoc0DC1YTcpT7eXMlJhtOhy6bA8eiuTfF9Qhnbi0tz%2BP2yTxBWeEDQBUHfw8ekIboDtEss9IBgRLZGBx4vSID2K7FaUYROKWQgEohXdULRq3opipE85eaorOwh0TuqgO2xRfRWD3eC2GEk2o9nY0GEMZqpW%2Fu43T0zRTWN6rwFZOhR%2FKvcqO3gMYXglobcA6xgvwPjEm0GMInHg1JGsPyXspHzrhuY8QcpQZTQJ62eez%2FRS8rXog3JU2e778wFjrD9GIlT2%2BI2BK8OWa%2FneAE9oY2o3aC61PRVjIMdbJE8bg0%3D&invoice=myaM%2BnmckBTdyvKiYsAskqM8%2BDu%2BCQpcT0ibktoycZIJDMWqYYfKAK3nAtaH2RzhtFIiMNKDecIEi9cO1MzEIpgofg9YttK2%2BfLlsjmERb%2F19xFK2Xgr7%2BzI009KYNIuix9KfpWvf8f3EchPcQkoy7z1q8cZ6TyCHKzkKD8MK7E%3D', '_blank');
//         }
//       }
//     }
//   );
// },
    // 收藏方法
    handleToggleCollect() {
      this.isFavorite = !this.isFavorite;
      if (this.isFavorite) {
        this.stars += 1;
        this.$message.success('收藏成功');
      } else {
        this.stars -= 1;
        this.$message.success('取消收藏成功');
      }
    },
    // 阅读方法
    handleRead() {
      // 设置加载状态
      this.isLoading = true;

      // 模拟加载过程
      setTimeout(() => {
        // 恢复页面内容
        this.isLoading = false;
      }, 2000); // 2000ms 后恢复页面内容
    },
    // 高亮标签方法
    highlightTags(text) {
      if (!text) return '';
      // 使用正则表达式匹配标签并替换为带有红色样式的 HTML
      return text.replace(/<tag>(.*?)<\/tag>/g, '<span style="color: red;">$1</span>');
    },
  },
};
</script>

<style scoped>
.custom-card {
  background-color: #f0f8ff; /* 淡蓝色背景 */
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.card-header {
  margin-bottom: 10px;
}

.card-body {
  font-size: 15px;
  margin-bottom: 10px;
}

.card-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 5px;
}

.card-label {
  font-weight: bold;
  margin-right: 5px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.score-hit-container {
  display: flex;
  gap: 10px;
}

.score {
  background-color: #409EFF; /* 蓝色背景 */
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.hit {
  background-color: #67C23A; /* 绿色背景 */
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.click {
  background-color: #E6A23C; /* 橙色背景 */
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.stars {
  background-color: #F56C6C; /* 红色背景 */
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.button-group {
  display: flex;
  gap: 10px;
}

.title-link {
  cursor: pointer;
  color: inherit;
  text-decoration: none;
}

.title-link:hover {
  color: #409EFF;
  text-decoration: underline;
}

/* 手机端样式 */
@media (max-width: 768px) {
  .custom-card {
    padding: 10px;
  }
  .el-container {
    flex-direction: column;
  }
  .card-header h3 {
    font-size: 16px;
  }

  .card-body {
    font-size: 10px;
  }

  .card-footer {
    flex-direction: column;
    gap: 10px;
  }

  .score-hit-container {
    justify-content: flex-start;
  }

  .button-group {
    width: 100%;
    justify-content: space-between;
  }

  .el-tabs {
    width: 100% !important;
    margin-left: 0 !important;
  }

  .el-button {
    font-size: 12px !important;
    padding: 5px 10px !important;
  }
}
</style>