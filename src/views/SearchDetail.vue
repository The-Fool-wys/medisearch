<template>
  <div style="height: 100vh; overflow: auto;">
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-header style="background-color: rgb(238, 241, 246); display: flex; justify-content: space-between; align-items: center;">
        <MyTop></MyTop>
        
      </el-header>
      <el-container>
        <el-aside v-if="$store.state.sidebarVisible" width="260px">
          <ASIDE></ASIDE>
        </el-aside>
        
        <el-main style="padding: 5px; overflow: hidden; height: 100%;">
          <!-- 电脑端数据库切换开关 -->
        <el-switch
          v-if="!isMobile"
          v-model="switchValue"
          active-color="#13ce66"
          inactive-color="#E6A23C"
          active-text="全文数据库"
          inactive-text="个人数据库"
          @change="handleSwitchChange"
          style="margin-left: 750px;">
        </el-switch>
          <!-- 手机端数据库切换开关 -->
          <div v-if="isMobile" style=" top: 5px; left: 200px; position:relative">
            <el-switch
              v-model="switchValue"
              active-color="#13ce66"
              inactive-color="#E6A23C"
              active-text="全文数据库"
              inactive-text="个人数据库"
              @change="handleSwitchChange">
            </el-switch>
          </div>

          <!-- 搜索框 -->
          <SearchIn 
            :initialSearchText="initialSearchText"  
            @search="handleSearch"  
            @open="handleSearchOpen" 
            :style="isMobile ? 'margin-left: 15px; margin-top: 20px;' : 'margin-left: 25px; margin-top: 20px;'">
          </SearchIn>
          
          <div style="margin-left: 0px; margin-top: 20px; width: 100%;">
            <!-- 手机端使用卡片布局 -->
            <div v-if="isMobile" class="card-container">
              <!-- 手机端排序选项 -->
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 0 15px;">
                <span style="font-size: 14px; font-weight: bold;">搜索结果</span>
                <div>
                  <span style="margin-right: 10px; font-size: 12px;">排序：</span>
                  <el-radio-group v-model="sortType" size="mini" @change="handleSortChange">
                    <el-radio-button label="default">默认</el-radio-button>
                    <el-radio-button label="hit">点击量</el-radio-button>
                    <el-radio-button label="download">下载量</el-radio-button>
                    <el-radio-button label="favorite">收藏量</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
              
              <el-card v-for="row in paginatedData" :key="row.id" class="custom-card">
                <div class="card-header">
                  <span class="card-title title-link" @click="handleRowClick(row)" style="white-space: normal; word-break: break-word;">
                    {{ row.filename }}
                  </span>
                  <span class="card-keywords">{{ row.keywords }}</span>
                </div>
                <div class="card-body">
                  <div class="card-item">
                    <span class="card-label">作者:</span>
                    <span>{{ row.author }}</span>
                    <span class="card-label" style="margin-left: 10px;">发表时间:</span>
                    <span>{{ row.publicationDate }}</span>
                  </div>
                </div>
                <div class="card-footer">
                  <div class="score-hit-container">
                    <span class="score">得分: {{ row.score }}</span>
                    <span class="hit">命中: {{ row.hit }}</span>
                  </div>
                  <div class="button-group">
                    <el-button
                      size="mini"
                      type="info"
                      icon="el-icon-download"
                      @click="handleDownload(row)"
                      style="width: 75px; padding: 6px 5px; font-size: 13px;">
                      下载
                    </el-button>
                    <el-button
                      size="mini"
                      :type="row.isFavorite ? 'danger' : 'warning'"
                      :icon="row.isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'"
                      @click="handleToggleCollect(row)"
                      style="width: 75px; padding: 6px 5px; font-size: 13px;">
                      {{ row.isFavorite ? '已收藏' : '收藏' }}
                    </el-button>
                  </div>
                </div>
              </el-card>
            </div>


            <!-- 桌面端使用表格布局 -->
            <div v-else>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <span style="font-size: 16px; font-weight: bold;">搜索结果</span>
                <div>
                  <span style="margin-right: 10px; font-size: 13px;">排序方式：</span>
                  <el-radio-group v-model="sortType" size="mini" @change="handleSortChange">
                    <el-radio-button label="default">默认</el-radio-button>
                    <el-radio-button label="hit">点击量</el-radio-button>
                    <el-radio-button label="download">下载量</el-radio-button>
                    <el-radio-button label="favorite">收藏量</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
              
              <el-table
                :data="paginatedData"
                style="width: 100%;"
                size="mini"
                :show-header="true"
                row-key="id"
                :default-expand-all="true"
                fit
                :row-style="{ height: '70px' }" 
                :cell-style="{ fontSize: '13px' }">
                <el-table-column
                  prop="filename"
                  label="标题"
                  min-width="200"
                  width="auto"
                  align="left"
                  header-align="left">
                  <template slot-scope="scope">
                    <span class="title-link" @click="handleRowClick(scope.row)" style="white-space: normal; word-break: break-word;">
                      {{ scope.row.filename }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="author"
                  label="作者"
                  min-width="150"
                  width="auto"
                  align="left"
                  header-align="left">
                  <template slot-scope="scope">
                    <span>
                      <el-tag
                        v-for="(author, index) in scope.row.author.split(';')"
                        :key="index"
                        size="small"
                        style="margin-right: 5px; margin-bottom: 5px;">
                        {{ author.trim() }}
                      </el-tag>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="publicationDate"
                  label="发表时间"
                  min-width="120"
                  width="auto"
                  align="left"
                  header-align="left">
                  <template slot-scope="scope">
                    <el-tag size="small">{{ scope.row.publicationDate }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="keywords"
                  label="关键词"
                  min-width="200" 
                  width="auto"
                  align="left"
                  header-align="left">
                  <template slot-scope="scope">
                    <span>
                      <el-tag
                        v-for="(keyword, index) in scope.row.keywords.split(';')"
                        :key="index"
                        size="small"
                        style="margin-right: 5px; margin-bottom: 5px;">
                        {{ keyword.trim() }}
                      </el-tag>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="score"
                  label="得分"
                  width="70"
                  align="center"
                  header-align="center">
                  <template slot-scope="scope">
                    <span class="score">{{ scope.row.score }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="hit"
                  label="命中"
                  width="70"
                  align="center"
                  header-align="center">
                  <template slot-scope="scope">
                    <span class="hit">{{ scope.row.hit }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="180"
                  align="center"
                  header-align="center">
                  <template slot-scope="scope">
                    <div class="button-group">
                      <el-button
                        size="mini"
                        type="info"
                        icon="el-icon-download"
                        @click="handleDownload(scope.row)"
                        style="width: 60px; padding: 6px 5px; font-size: 13px;">
                         <span style="margin-left: -5px;">下载</span>
                      </el-button>
                      <el-button
                        size="mini"
                        :type="scope.row.isFavorite ? 'danger' : 'warning'"
                        :icon="scope.row.isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'"
                        @click="handleToggleCollect(scope.row)"
                        style="width: 60px; padding: 6px 5px; font-size: 13px;">
                        <span style="margin-left: -5px;">{{ scope.row.isFavorite ? '已收藏' : '收藏' }}</span>
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-pagination
              small
              layout="prev, pager, next"
              :total="sortedData.length"
              :page-size="pageSize"
              v-model="currentPage"
              @current-change="handleCurrentChange"
              style="margin-top: 10px;">
            </el-pagination>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import SearchIn from '@/components/SearchIn.vue';
import { Message } from 'element-ui';
export default {
  components: {
    SearchIn,
  },
  data() {
    return {
      searchData: null,
      literatureData: [],
      sortedData: [],
      currentPage: 1,
      pageSize: 10,
      isMobile: false,
      searchText: '',
      searchCount: 0,
      sortType: 'default',
      downloadCounts: {},
      favoriteCounts: {},
      isPersonalDatabase: false, // 添加数据库切换状态
      switchValue: true,
    };
  },
  computed: {
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      return this.sortedData.slice(start, end);
    },
    initialSearchText() {
      if (this.searchData && this.searchData.mainQuery && this.searchData.mainQuery.content) {
        const searchContent = this.searchData.mainQuery.content;
        if (searchContent.includes("骨骼")) {
          return "骨骼";
        } else if (searchContent.includes("肝癌")) {
          return "肝癌";
        }
      }
      return "";
    },
  },
  created() {
    const searchQuery = this.$route.query.query;
    if (searchQuery) {
      console.log('Received searchQuery:', searchQuery);
      this.searchData = JSON.parse(decodeURIComponent(searchQuery));
      console.log('searchData:', this.searchData); 
      this.searchText = this.$route.query.searchText || '';
    }
  },
  methods: {
    handleDatabaseChange(val) {
      // 处理数据库切换逻辑
      console.log('当前数据库:', val ? '个人数据库' : '全文数据库');
      // 这里可以添加切换数据库后的数据加载逻辑
    },
    handleSearchOpen() {
      this.searchCount += 1;
      console.log('searchCount:', this.searchCount);
    },
    loadSearchData() {
      const query = this.$route.query.query;
      if (query) {
        const searchData = JSON.parse(decodeURIComponent(query));
        this.searchData = searchData;
        this.searchText = this.$route.query.searchText || '';
        this.generateFakeData(searchData.mainQuery.content, searchData.additionalQueries);
      }
    },
    generateFakeData(searchContent, additionalQueries) {
      let data = [];

      if (searchContent.includes("骨骼")) {
        data = [
          {
            id: 2,
            filename: "失神经骨骼肌再生的MRI定量与病理学对照研究",
            author: "陈妙玲;李新春;胡文清;蒙秋华;陈镜聪",
            publicationDate: "2011-04",
            keywords: "失神经骨骼肌;T2驰豫时间;磁共振成像;病理学",
            score: 84,
            hit: 13,
            isFavorite: true,
            downloadCount: 5,
            favoriteCount: 8
          },
          {
            id: 3,
            filename: "基于MRI定量评估骨骼肌脂肪含量的方法对比研究",
            author: "郭益彤;黄益龙;严俊;陈佳鑫",
            publicationDate: "2025-02",
            keywords: "磁共振成像;骨骼肌;脂肪定量;对比研究",
            score: 75,
            hit: 11,
            isFavorite: false,
            downloadCount: 8,
            favoriteCount: 5
          },
          {
            id: 1,
            filename: "骨骼肌系统感染的MRI诊断价值",
            author: "李文元;黄恭康",
            publicationDate: "2023-10",
            keywords: "磁共振成像;感染;骨骼肌系统",
            score: 62,
            hit: 8,
            isFavorite: false,
            downloadCount: 3,
            favoriteCount: 2
          },
        ];
      } else if (searchContent.includes("肝癌")) {
        data = [
          {
            id: 1,
            filename: "15例含脂肝细胞肝癌的MRI影像特点",
            author: "章李;刘智俊",
            publicationDate: "2015-03",
            keywords: "肝细胞肝癌;脂肪;磁共振成像;病理学",
            score: 96,
            hit: 44,
            isFavorite: false,
            downloadCount: 20,
            favoriteCount: 15
          },
          {
            id: 2,
            filename: "MRI与CT在介入治疗肝癌后癌肿残留及复发的早期诊断应用",
            author: "葛永亮",
            publicationDate: "2024-09",
            keywords: "MRI;CT;介入治疗;肝癌后癌肿",
            score: 90,
            hit: 26,
            isFavorite: false,
            downloadCount: 15,
            favoriteCount: 10
          },
          {
            id: 3,
            filename: "MRI在原发性肝癌早期诊断及TACE介入治疗术后疗效评价中的应用",
            author: "常祖宽;王晓伟;马文芳;路会林",
            publicationDate: "2020-03",
            keywords: "原发性肝癌;磁共振成像;肝动脉化疗栓塞",
            score: 86,
            hit: 23,
            isFavorite: false,
            downloadCount: 12,
            favoriteCount: 8
          },
          {
            id: 4,
            filename: "1.5T MRI检查对诊断原发性肝癌的敏感度与特异度分析",
            author: "周若兰;唐兴竹",
            publicationDate: "2023-12",
            keywords: "西门子;1.5T MRI; 原发性肝癌",
            score: 76,
            hit: 16,
            isFavorite: true,
            downloadCount: 10,
            favoriteCount: 12
          },
          {
            id: 5,
            filename: "超声造影联合MRI融合导航技术在评估肝细胞肝癌消融疗效中的临床价值",
            author: "张琪;王坤;曹佳颖;经翔;严昆",
            publicationDate: "2024-02",
            keywords: "超声检查;造影剂;MRI;融合成像",
            score: 70,
            hit: 14,
            isFavorite: false,
            downloadCount: 8,
            favoriteCount: 6
          },
          {
            id: 6,
            filename: "3.0T 磁共振成像与64排螺旋CT在肝癌诊断中临床应用价值对比",
            author: "梁志鹏;姚立正;陈飞;王雪扬;陆鹏",
            publicationDate: "2016-02",
            keywords: "肝肿瘤;磁共振成像;体层摄影术",
            score: 69,
            hit: 14,
            isFavorite: true,
            downloadCount: 7,
            favoriteCount: 9
          },
        ];

        if (!additionalQueries || !additionalQueries.some(query => query.content.includes("诊断"))) {
          const additionalData = [
            {
              id: 7,
              filename: "1.5T MR多序列检查在小肝癌诊断中的应用",
              author: "季学闻;马利兵",
              publicationDate: "2022-02",
              keywords: "1.5T MR多序列检查;小肝癌;诊断",
              score: 88,
              hit: 25,
              isFavorite: false,
              downloadCount: 18,
              favoriteCount: 14
            },
            {
              id: 8,
              filename: "肝脏增强CT扫描在肝癌诊断中的临床分析",
              author: "何正桃",
              publicationDate: "2017-04",
              keywords: "肝癌;增强CT扫描;诊断",
              score: 86,
              hit: 18,
              isFavorite: false,
              downloadCount: 14,
              favoriteCount: 10
            },
            {
              id: 9,
              filename: "多b值扩散加权成像联合DCE-MRI在小肝癌鉴别诊断中的应用",
              author: "鲜明;童欣;张莉;董萌萌",
              publicationDate: "2021-05",
              keywords: "小肝癌;扩散加权成像;动态增强扫描;诊断",
              score: 85,
              hit: 17,
              isFavorite: false,
              downloadCount: 13,
              favoriteCount: 9
            },
          ];

          data.splice(2, 0, additionalData[0]);
          data.splice(4, 0, additionalData[1]);
          data.splice(5, 0, additionalData[2]);
        }
      } else {
        data = [];
      }

      this.literatureData = data;
      this.sortedData = [...data];
      this.applySort();
    },
    handleSearch(searchConditions) {
      this.$store.dispatch('updateSearchConditions', searchConditions);
      
      this.$router.replace({
        query: {
          ...this.$route.query,
          query: encodeURIComponent(JSON.stringify(searchConditions)),
          q: searchConditions.mainQuery.content
        }
      });

      this.generateFakeData(searchConditions.mainQuery.content, searchConditions.additionalQueries);
    },
    handleDownload(row) {
      console.log('下载文件:', row.filename);

      if (!this.downloadCounts[row.id]) {
        this.downloadCounts[row.id] = 0;
      }
      this.downloadCounts[row.id]++;
      row.downloadCount = (row.downloadCount || 0) + 1;
      
      Message.success(`下载成功: ${row.filename}.pdf`);
      this.applySort();
    },
    handleToggleCollect(row) {
      row.isFavorite = !row.isFavorite;
      
      if (!this.favoriteCounts[row.id]) {
        this.favoriteCounts[row.id] = 0;
      }
      if (row.isFavorite) {
        this.favoriteCounts[row.id]++;
        row.favoriteCount = (row.favoriteCount || 0) + 1;
      } else {
        this.favoriteCounts[row.id] = Math.max(0, this.favoriteCounts[row.id] - 1);
        row.favoriteCount = Math.max(0, (row.favoriteCount || 0) - 1);
      }
      
      console.log('收藏状态:', row.isFavorite);
      this.applySort();
    },
    handleRowClick(row) {
      console.log('查看文件详情:', row.filename);
      this.$router.push({
        name: 'FileDetail',
        params: {
          filename: encodeURIComponent(row.filename),
        },
        query: {
          author: row.author,
          publicationDate: row.publicationDate,
          keywords: row.keywords,
          score: row.score,
          hit: row.hit,
          isFavorite: row.isFavorite,
          downloadCount: row.downloadCount,
          favoriteCount: row.favoriteCount,
        },
      });
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },
    checkIfMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
    handleSortChange() {
      this.applySort();
    },
    applySort() {
      switch (this.sortType) {
        case 'hit':
          this.sortedData = [...this.literatureData].sort((a, b) => b.hit - a.hit);
          break;
        case 'download':
          this.sortedData = [...this.literatureData].sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
          break;
        case 'favorite':
          this.sortedData = [...this.literatureData].sort((a, b) => (b.favoriteCount || 0) - (a.favoriteCount || 0));
          break;
        default:
          this.sortedData = [...this.literatureData];
          break;
      }
      this.currentPage = 1;
    },
  },
  mounted() {
    this.loadSearchData();
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkIfMobile);
  },
};
</script>

<style scoped>
.el-col {
  margin-bottom: 20px;
}

.el-card {
  transition: transform 0.3s ease;
}

.el-card:hover {
  transform: scale(1.05);
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

.score {
  background-color: #409EFF;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.hit {
  background-color: #67C23A;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.button-group {
  display: flex;
  gap: 5px;
}

/* 手机端样式 */
@media (max-width: 768px) {
  .card-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .el-container {
    flex-direction: column;
  }
  .custom-card {
    background-color: #f0f8ff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 10px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .card-title {
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
  }

  .card-title:hover {
    color: #409EFF;
    text-decoration: underline;
  }

  .card-keywords {
    font-size: 12px;
    color: #666;
  }

  .card-body {
    font-size: 12px;
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
}
</style>