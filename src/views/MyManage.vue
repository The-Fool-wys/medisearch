<template>
  <div>
    <el-container style="height: 100vh; border: 1px solid #eee">
      <el-header style="background-color: rgb(238, 241, 246); display: flex; justify-content: space-between; align-items: center;">
        <MyTop></MyTop>
      </el-header>
      <el-container>
        <!-- 侧边栏：根据 sidebarVisible 状态控制显示与隐藏 -->
        <el-aside v-if="$store.state.sidebarVisible" width="260px" class="mobile-hidden">
          <div style="padding: 10px;">
            <!-- 上传组件：在桌面端显示 -->
            <el-upload
              v-if="!isMobile"
              class="upload-btn"
              :action="uploadUrl"
              :multiple="false"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-progress="handleProgress">
              <el-button type="primary" icon="el-icon-upload">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传PDF文件，且不超过10MB</div>
            </el-upload>
          </div>
          <ASIDE></ASIDE>
        </el-aside>
        <el-main style="overflow-y: auto;">
          <!-- 上传组件：在手机端显示 -->
          <div v-if="isMobile" style="margin-bottom: 20px;">
            <el-upload
              class="upload-demo"
              drag
              :action="uploadUrl"
              :multiple="false"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-progress="handleProgress">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text"><em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传PDF文件，且不超过10MB</div>
            </el-upload>
          </div>

          <!-- 正在上传列表 -->
          <div class="list-header">
            <el-header style="font-size: 16px; font-weight: bold; margin: 0;">正在上传列表</el-header>
            <el-button size="mini" type="danger" @click="handleBatchDeleteUploading" :disabled="selectedUploadingFiles.length === 0">删除</el-button>
          </div>
          <el-table 
            :data="uploadingFiles.slice((currentPage1 - 1) * pageSize, currentPage1 * pageSize)" 
            style="width: 100%" 
            size="mini"
            @selection-change="handleSelectionChange"
            :row-style="{ height: '70px' }" 
            :cell-style="{ fontSize: '13px' }">
            <el-table-column type="selection" width="55"  reserve-selection></el-table-column>
            <el-table-column prop="filename" label="文件名称"></el-table-column>
            <el-table-column label="进度">
              <template slot-scope="scope">
                <el-progress v-if="scope.row.uploadStatus === 'uploading'" :percentage="scope.row.uploadProgress" status="success" size="mini" text-inside :format="formatProgress" :stroke-width="15"></el-progress>
                <el-tag size="small" v-else-if="scope.row.uploadStatus === 'success'" type="success">上传成功</el-tag>
                <el-tag size="small" v-else-if="scope.row.uploadStatus === 'error'" type="danger">上传失败</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="解析状态">
              <template slot-scope="scope">
                <div v-if="scope.row.uploadStatus === 'success'">
                  <el-tag size="small" v-if="scope.row.parseStatus === 'success'" type="success">
                    <i class="el-icon-success"></i> 解析完成
                  </el-tag>
                  <el-tag size="small" v-else-if="scope.row.parseStatus === 'error'" type="danger">
                    <i class="el-icon-error"></i> 解析失败
                  </el-tag>
                  <el-tag size="small" v-else type="info">
                    <i class="el-icon-loading"></i> 解析中
                  </el-tag>
                </div>
                <el-tag size="small" v-else type="info">上传中</el-tag>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <el-pagination
            small
            layout="prev, pager, next"
            :total="uploadingFiles.length"
            :page-size="pageSize"
            v-model="currentPage1"
            style="margin-top: 10px;"
            @current-change="handleCurrentChange1">
          </el-pagination>

          <!-- 已上传文件列表 -->
          <div class="list-header">
            <el-header style="font-size: 16px; font-weight: bold; margin-top: 0;">已上传文件列表</el-header>
            <div>
              <el-input
                v-model="searchQueryUploaded"
                placeholder="搜索文件名称"
                size="mini"
                style="margin-right: 10px; width: 150px;"
                @input="filterUploadedFiles">
              </el-input>
              <el-button size="mini" type="info" @click="handleBatchDownload" :disabled="selectedUploadedFiles.length === 0">下载</el-button>
              <el-button size="mini" type="success" @click="handleBatchFavorite" :disabled="selectedUploadedFiles.length === 0">收藏</el-button>
              <el-button size="mini" type="danger" @click="handleBatchDeleteUploaded" :disabled="selectedUploadedFiles.length === 0">删除</el-button>
            </div>
          </div>

          <!-- 桌面端表格视图 -->
          <el-table 
            v-if="!isMobile"
            :data="filteredUploadedFiles.slice((currentPage2 - 1) * pageSize, currentPage2 * pageSize)" 
            style="width: 100%" 
            size="mini"
            @selection-change="handleSelectionChangeUploaded"
            :row-style="{ height: '70px' }" 
            :cell-style="{ fontSize: '13px' }">
            <el-table-column type="selection" width="55"  reserve-selection></el-table-column>
            <el-table-column prop="filename" label="文件名称"></el-table-column>
            <el-table-column label="关键字">
              <template slot-scope="scope">
                <div v-if="scope.row.editing">
                  <el-tag
                    v-for="(keyword, index) in scope.row.keywordsArr"
                    :key="index"
                    closable
                    size="small"
                    @close="handleCloseKeyword(scope.row, index)">
                    {{ keyword }}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.keywordInputVisible"
                    v-model="scope.row.keywordInputValue"
                    ref="saveKeywordTagInput"
                    size="mini"
                    @keyup.enter.native="handleKeywordInputConfirm(scope.row)"
                    @blur="handleKeywordInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showKeywordInput(scope.row)">+ 添加</el-button>
                </div>
                <div v-else>
                  <el-tag
                    v-for="(keyword, index) in scope.row.keywordsArr"
                    :key="index"
                    size="small">
                    {{ keyword }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="作者">
              <template slot-scope="scope">
                <div v-if="scope.row.editing">
                  <el-tag
                    v-for="(author, index) in scope.row.authorsArr"
                    :key="index"
                    closable
                    size="small"
                    @close="handleCloseAuthor(scope.row, index)">
                    {{ author }}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.authorInputVisible"
                    v-model="scope.row.authorInputValue"
                    ref="saveAuthorTagInput"
                    size="mini"
                    @keyup.enter.native="handleAuthorInputConfirm(scope.row)"
                    @blur="handleAuthorInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showAuthorInput(scope.row)">+ 添加</el-button>
                </div>
                <div v-else>
                  <el-tag
                    v-for="(author, index) in scope.row.authorsArr"
                    :key="index"
                    size="small">
                    {{ author }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="uploadTime" label="上传时间"></el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  :type="scope.row.editing ? 'success' : 'primary'"
                  @click="handleEdit(scope.row)"
                  :icon="scope.row.editing ? 'el-icon-check' : 'el-icon-edit'"
                  circle>
                </el-button>
                <el-button
                  size="mini"
                  :type="scope.row.isPrivate ? 'warning' : 'success'"
                  @click="togglePrivacy(scope.row)"
                  :icon="scope.row.isPrivate ? 'el-icon-lock' : 'el-icon-unlock'"
                  circle>
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 手机端卡片视图 -->
          <div v-if="isMobile" class="mobile-cards-container">
            <div 
              v-for="(file, index) in filteredUploadedFiles.slice((currentPage2 - 1) * pageSize, currentPage2 * pageSize)" 
              :key="index"
              class="mobile-card"
              :class="{ 'selected-card': isFileSelected(file) }">
              <div class="card-header">
                <el-checkbox 
                  v-model="file.selected" 
                  @change="handleMobileSelectionChange(file)">
                </el-checkbox>
                <div class="card-title">{{ file.filename }}</div>
              </div>
              
              <div class="card-content">
                <div class="card-section">
                  <div class="card-label">关键字:</div>
                  <div class="card-tags">
                    <template v-if="file.editing">
                      <el-tag
                        v-for="(keyword, idx) in file.keywordsArr"
                        :key="'k'+idx"
                        closable
                        size="mini"
                        @close="handleCloseKeyword(file, idx)">
                        {{ keyword }}
                      </el-tag>
                      <el-input
                        v-if="file.keywordInputVisible"
                        v-model="file.keywordInputValue"
                        size="mini"
                        @keyup.enter.native="handleKeywordInputConfirm(file)"
                        @blur="handleKeywordInputConfirm(file)">
                      </el-input>
                      <el-button 
                        v-else 
                        class="button-new-tag" 
                        size="mini" 
                        @click="showKeywordInput(file)">
                        + 添加
                      </el-button>
                    </template>
                    <template v-else>
                      <el-tag
                        v-for="(keyword, idx) in file.keywordsArr"
                        :key="'k'+idx"
                        size="mini">
                        {{ keyword }}
                      </el-tag>
                    </template>
                  </div>
                </div>
                
                <div class="card-section">
                  <div class="card-label">作者:</div>
                  <div class="card-tags">
                    <template v-if="file.editing">
                      <el-tag
                        v-for="(author, idx) in file.authorsArr"
                        :key="'a'+idx"
                        closable
                        size="mini"
                        @close="handleCloseAuthor(file, idx)">
                        {{ author }}
                      </el-tag>
                      <el-input
                        v-if="file.authorInputVisible"
                        v-model="file.authorInputValue"
                        size="mini"
                        @keyup.enter.native="handleAuthorInputConfirm(file)"
                        @blur="handleAuthorInputConfirm(file)">
                      </el-input>
                      <el-button 
                        v-else 
                        class="button-new-tag" 
                        size="mini" 
                        @click="showAuthorInput(file)">
                        + 添加
                      </el-button>
                    </template>
                    <template v-else>
                      <el-tag
                        v-for="(author, idx) in file.authorsArr"
                        :key="'a'+idx"
                        size="mini">
                        {{ author }}
                      </el-tag>
                    </template>
                  </div>
                </div>
                
                <div class="card-section">
                  <div class="card-label">上传时间:</div>
                  <div>{{ file.uploadTime }}</div>
                </div>
                <div class="card-section">
                  <div class="card-label">检索权限:</div>
                  <div>
                    <el-tag size="mini" :type="file.isPrivate ? 'warning' : 'success'">
                      {{ file.isPrivate ? '个人检索' : '所有人可检索' }}
                    </el-tag>
                  </div>
                </div>
              </div>
              
              <div class="card-actions">
                <el-button
                  size="mini"
                  :type="file.editing ? 'success' : 'primary'"
                  @click="handleEdit(file)"
                  :icon="file.editing ? 'el-icon-check' : 'el-icon-edit'"
                  plain>
                  {{ file.editing ? '保存' : '编辑' }}
                </el-button>
                <el-button
                  size="mini"
                  :type="file.isPrivate ? 'warning' : 'success'"
                  @click="togglePrivacy(file)"
                  :icon="file.isPrivate ? 'el-icon-lock' : 'el-icon-unlock'"
                  plain>
                  {{ file.isPrivate ? '设为公开' : '设为私有' }}
                </el-button>
              </div>
            </div>
          </div>

          <!-- 分页组件 -->
          <el-pagination
            small
            layout="prev, pager, next"
            :total="filteredUploadedFiles.length"
            :page-size="pageSize"
            v-model="currentPage2"
            style="margin-top: 10px;"
            @current-change="handleCurrentChange2">
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
      uploadingFiles: [], // 正在上传的文件列表
      uploadedFiles: [
        {
          filename: "动态增强MRI观察肿瘤增强评估微小肝癌肿瘤血供的价值",
          keywords: "动态增强磁共振成像；增强特点；微小肝癌；肿瘤血供",
          author: "孙阳 张婷婷 胡晓雯 王梦莉 潘晓龙 李国荣",
          uploadTime: "2025-3-16",
          editing: false,
          keywordsArr: ["动态增强磁共振成像", "增强特点", "微小肝癌", "肿瘤血供"],
          authorsArr: ["孙阳", "张婷婷", "胡晓雯", "王梦莉", "潘晓龙", "李国荣"],
          keywordInputVisible: false,
          keywordInputValue: '',
          authorInputVisible: false,
          authorInputValue: '',
          selected: false,
          isPrivate: false
        },
        {
          filename: "对比增强能谱X线摄影对致密型乳腺病变的诊断价值",
          keywords: "乳腺病变；对比增强能谱乳腺X线摄影；致密型乳腺",
          author: "荣小翠 康一鹤 杨光 韩捧银 薛晶 李亚男 李智岗",
          uploadTime: "2025-3-16",
          editing: false,
          keywordsArr: ["乳腺病变", "对比增强能谱乳腺X线摄影", "致密型乳腺"],
          authorsArr: ["荣小翠", "康一鹤", "杨光", "韩捧银", "薛晶", "李亚男", "李智岗"],
          keywordInputVisible: false,
          keywordInputValue: '',
          authorInputVisible: false,
          authorInputValue: '',
          selected: false,
          isPrivate: true
        },
        {
          filename: "多模态超声在非肿块乳腺病变诊断中的应用",
          keywords: "非肿块乳腺病变；超声检查；造影剂；弹性成像技术；病理学，外科；诊断，鉴别",
          author: "李诗雨 牛瑞兰 王博 姜莹 王知力",
          uploadTime: "2025-3-16",
          editing: false,
          keywordsArr: ["非肿块乳腺病变", "超声检查", "造影剂", "弹性成像技术", "病理学，外科", "诊断，鉴别"],
          authorsArr: ["李诗雨", "牛瑞兰", "王博", "姜莹", "王知力"],
          keywordInputVisible: false,
          keywordInputValue: '',
          authorInputVisible: false,
          authorInputValue: '',
          selected: false,
          isPrivate: false
        },
        {
          filename: "非妊娠期子宫肌瘤红色变性的MRI表现",
          keywords: "子宫肌瘤红色变性；非妊娠期；磁共振成像",
          author: "陈艳 詹松华 倪志华 江鑫辉 茅依玲 郭宝聪 吴晓燕",
          uploadTime: "2025-3-16",
          editing: false,
          keywordsArr: ["子宫肌瘤红色变性", "非妊娠期", "磁共振成像"],
          authorsArr: ["陈艳", "詹松华", "倪志华", "江鑫辉", "茅依玲", "郭宝聪", "吴晓燕"],
          keywordInputVisible: false,
          keywordInputValue: '',
          authorInputVisible: false,
          authorInputValue: '',
          selected: false,
          isPrivate: true
        },
        {
          filename: "妇科影像报告和数据系统鉴别附件肿块良恶性的应用价值",
          keywords: "超声检查；妇科影像报告和数据系统；附件肿块，良恶性",
          author: "李琴 赵薇 唐柳林 莫莹莹",
          uploadTime: "2025-3-16",
          editing: false,
          keywordsArr: ["超声检查", "妇科影像报告和数据系统", "附件肿块，良恶性"],
          authorsArr: ["李琴", "赵薇", "唐柳林", "莫莹莹"],
          keywordInputVisible: false,
          keywordInputValue: '',
          authorInputVisible: false,
          authorInputValue: '',
          selected: false,
          isPrivate: false
        }
      ], // 已上传的文件列表
      currentPage1: 1, // 当前页码（正在上传列表）
      currentPage2: 1, // 当前页码（已上传列表）
      pageSize: 5, // 每页显示数量
      selectedUploadingFiles: [], // 选中的正在上传文件
      selectedUploadedFiles: [], // 选中的已上传文件
      searchQueryUploaded: '', // 搜索框内容
      filteredUploadedFiles: [], // 过滤后的已上传文件列表
      isMobile: false, // 是否在手机端
      uploadUrl: 'https://example.com/upload' // 上传地址
    };
  },
  created() {
    // 组件创建时直接使用假数据
    this.filteredUploadedFiles = this.uploadedFiles;
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkIfMobile);
  },
  methods: {
    checkIfMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
    formatProgress(percentage) {
      return `${percentage}%`;
    },
    // 模拟上传功能
    beforeUpload(file) {
      const isPDF = file.type === 'application/pdf';
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isPDF) {
        this.$message.error('只能上传PDF文件');
        return false;
      }
      if (!isLt10M) {
        this.$message.error('文件大小不能超过10MB');
        return false;
      }

      // 添加到正在上传列表
      const uploadFile = {
        filename: file.name,
        uploadStatus: 'uploading',
        uploadProgress: 0,
        parseStatus: 'pending'
      };
      this.uploadingFiles.push(uploadFile);

      // 模拟上传进度
      const interval = setInterval(() => {
        const randomIncrement = Math.floor(Math.random() * 20) + 1; // 随机增加 1-20%
        uploadFile.uploadProgress += randomIncrement;

        if (uploadFile.uploadProgress >= 100) {
          clearInterval(interval);
          uploadFile.uploadStatus = 'success'; // 上传成功
          this.$message.success('上传成功');

          // 模拟解析过程，延长解析时间
          setTimeout(() => {
            uploadFile.parseStatus = 'success'; // 解析完成
            this.$message.success('解析完成');

            // 将文件添加到已上传列表
            this.uploadedFiles.unshift({
              filename: "肌内黏液瘤 MRI 特点分析",
              keywords: "肌内黏液瘤; 黏液样肿瘤; 磁共振成像",
              author: "许锦 邱雷雨 王叶军 钟建平",
              uploadTime: "2025-3-18",
              editing: false,
              keywordsArr: ["肌内黏液瘤", "黏液样肿瘤", "磁共振成像"],
              authorsArr: ["许锦", "邱雷雨", "王叶军", "钟建平"],
              keywordInputVisible: false,
              keywordInputValue: '',
              authorInputVisible: false,
              authorInputValue: '',
              selected: false,
              isPrivate: false
            });
            this.filteredUploadedFiles = this.uploadedFiles; // 更新过滤后的列表

            // 从正在上传列表中移除
            this.uploadingFiles = this.uploadingFiles.filter(item => item !== uploadFile);
          }, 5000); // 5秒后解析完成
        }
      }, 800); // 每300ms更新一次进度

      return false; // 阻止默认上传行为
    },
    // 处理上传进度
    handleProgress() {
      // 这里可以处理上传进度事件
    },
    // 处理选择变化
    handleSelectionChange(selection) {
      this.selectedUploadingFiles = selection;
    },
    // 处理已上传文件选择变化
    handleSelectionChangeUploaded(selection) {
      this.selectedUploadedFiles = selection;
    },
    // 处理手机端选择变化
    handleMobileSelectionChange(file) {
      if (file.selected) {
        this.selectedUploadedFiles.push(file);
      } else {
        this.selectedUploadedFiles = this.selectedUploadedFiles.filter(item => item !== file);
      }
    },
    // 检查文件是否被选中
    isFileSelected(file) {
      return this.selectedUploadedFiles.includes(file);
    },
    // 过滤已上传文件
    filterUploadedFiles() {
      if (this.searchQueryUploaded) {
        this.filteredUploadedFiles = this.uploadedFiles.filter(file => 
          file.filename.toLowerCase().includes(this.searchQueryUploaded.toLowerCase())
        );
      } else {
        this.filteredUploadedFiles = this.uploadedFiles;
      }
      this.currentPage2 = 1;
    },
    // 批量删除正在上传的文件
    handleBatchDeleteUploading() {
      if (this.selectedUploadingFiles.length === 0) return;
      const filenames = this.selectedUploadingFiles.map(file => file.filename);
      this.uploadingFiles = this.uploadingFiles.filter(file => !filenames.includes(file.filename));
      this.$message.success('删除成功');
    },
    // 批量下载已上传的文件（模拟下载逻辑）
    handleBatchDownload() {
      if (this.selectedUploadedFiles.length === 0) return;
      this.$message.success('下载成功');
    },
    // 批量收藏已上传的文件（模拟收藏逻辑）
    handleBatchFavorite() {
      if (this.selectedUploadedFiles.length === 0) return;
      this.$message.success('收藏成功');
    },
    // 批量删除已上传的文件
    handleBatchDeleteUploaded() {
      if (this.selectedUploadedFiles.length === 0) return;
      const filenames = this.selectedUploadedFiles.map(file => file.filename);
      this.uploadedFiles = this.uploadedFiles.filter(file => !filenames.includes(file.filename));
      this.filteredUploadedFiles = this.filteredUploadedFiles.filter(file => !filenames.includes(file.filename));
      this.selectedUploadedFiles = [];
      this.$message.success('删除成功');
    },
    // 处理编辑/保存操作
    handleEdit(row) {
      if (row.editing) {
        // 保存编辑
        row.keywords = row.keywordsArr.join('；');
        row.author = row.authorsArr.join(' ');
        row.editing = false;
        this.$message.success('保存成功');
      } else {
        // 进入编辑模式
        row.editing = true;
      }
    },
    // 切换文件检索权限状态
    togglePrivacy(file) {
      file.isPrivate = !file.isPrivate;
      if (file.isPrivate) {
        this.$message.success('已设置为个人检索');
      } else {
        this.$message.success('已设置为所有人均可检索');
      }
    },
    // 关闭关键字标签
    handleCloseKeyword(row, index) {
      row.keywordsArr.splice(index, 1);
    },
    // 显示关键字输入框
    showKeywordInput(row) {
      row.keywordInputVisible = true;
      this.$nextTick(() => {
        if (this.isMobile) {
          // 手机端不需要refs处理
        } else {
          this.$refs.saveKeywordTagInput[0].focus();
        }
      });
    },
    // 确认添加关键字
    handleKeywordInputConfirm(row) {
      let inputValue = row.keywordInputValue;
      if (inputValue) {
        row.keywordsArr.push(inputValue);
      }
      row.keywordInputVisible = false;
      row.keywordInputValue = '';
    },
    // 关闭作者标签
    handleCloseAuthor(row, index) {
      row.authorsArr.splice(index, 1);
    },
    // 显示作者输入框
    showAuthorInput(row) {
      row.authorInputVisible = true;
      this.$nextTick(() => {
        if (this.isMobile) {
          // 手机端不需要refs处理
        } else {
          this.$refs.saveAuthorTagInput[0].focus();
        }
      });
    },
    // 确认添加作者
    handleAuthorInputConfirm(row) {
      let inputValue = row.authorInputValue;
      if (inputValue) {
        row.authorsArr.push(inputValue);
      }
      row.authorInputVisible = false;
      row.authorInputValue = '';
    },
    // 分页变化处理
    handleCurrentChange1(val) {
      this.currentPage1 = val;
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val;
    }
  }
};
</script>

<style scoped> 
.upload-btn { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
} 
.upload-btn .el-button { 
  margin-bottom: 10px; 
} 
.el-upload__tip { 
  font-size: 12px; 
  color: #999; 
} 
.list-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 10px; 
} 
.el-table { 
  margin-bottom: 20px; 
} 
.el-pagination { 
  margin-top: 10px; 
} 
.el-tag { 
  margin-right: 5px;
  margin-bottom: 5px; 
} 
.button-new-tag { 
  margin-right: 5px; 
  height: 24px; 
  line-height: 22px; 
  padding-top: 0; 
  padding-bottom: 0; 
} 
.input-new-tag { 
  width: 90px; 
  margin-right: 5px; 
  vertical-align: bottom; 
} 
/* 移动端样式 */ 
@media (max-width: 768px) { 
  .el-container { 
    flex-direction: column; 
  } 
  .el-main { 
    padding: 10px; 
  } 
  .el-table { 
    font-size: 12px; 
  } 
  .el-table .el-button { 
    padding: 5px; 
  } 
  .el-pagination { 
    font-size: 12px; 
  } 
  .list-header { 
    flex-direction: column; 
    align-items: flex-start; 
  } 
  .list-header > div {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  .list-header .el-button { 
    margin-top: 0;
  } 
  .el-upload-dragger {
    width: 100%;
    padding: 15px;
  }
  .el-upload__text {
    font-size: 14px;
  }
  .el-upload__tip {
    font-size: 12px;
  }
  
  /* 卡片样式 */
  .mobile-cards-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
  }
  
  .mobile-card {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    padding: 12px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  
  .selected-card {
    border: 1px solid #409EFF;
    background-color: #f5f7fa;
  }
  
  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .card-header .el-checkbox {
    margin-right: 10px;
  }
  
  .card-title {
    font-weight: bold;
    font-size: 14px;
    flex: 1;
    word-break: break-word;
  }
  
  .card-content {
    margin-bottom: 10px;
  }
  
  .card-section {
    margin-bottom: 8px;
  }
  
  .card-label {
    font-weight: bold;
    font-size: 12px;
    color: #909399;
    margin-bottom: 4px;
  }
  
  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
  }
  
  .card-actions {
    display: flex;
    justify-content: flex-end;
    gap: 5px;
  }
  
  .card-actions .el-button {
    padding: 5px 10px;
  }
  
  .mobile-card .el-input {
    width: 100px;
  }
} 
/* 自定义进度条样式 */ 
.el-progress { 
  position: relative; 
} 
.el-progress__text { 
  position: absolute; 
  right: 0; 
  top: 50%; 
  transform: translateY(-50%); 
  margin-left: 10px; 
} 
/* 修复复选框样式 */
.el-table__header-wrapper .el-checkbox__inner,
.el-table__body-wrapper .el-checkbox__inner {
  display: inline-block;
}
.el-table__header-wrapper .el-checkbox,
.el-table__body-wrapper .el-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>