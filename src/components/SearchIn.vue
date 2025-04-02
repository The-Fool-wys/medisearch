<template>
  <div class="search-input" style="width: 100%; max-width: 800px;">
    <!-- 手机端布局 -->
    <template v-if="isMobile">
      <el-row :gutter="5" class="search-bar original-search-bar">
        <div class="search-item">
          <el-button type="primary" icon="el-icon-plus" @click="addSearchBar" class="add-button"></el-button>
        </div>
        <div class="search-item">
          <el-select v-model="selectedOption" placeholder="标题" size="small" class="search-select" style="width: 68px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-input
            type="text"
            size="small"
            placeholder="请输入搜索内容"
            @focus="handleFocus(0)"
            @blur="handleBlur(0)"
            v-model="input"
            class="search-input-field"
            style="width: 115px;"
            clearable>
          </el-input>
          <!-- 历史搜索记录下拉框 - 主搜索框 -->
          <div class="history-dropdown" v-show="activeInputIndex === 0 && showDropdown && getHistory(0).length > 0">
            <div 
              v-for="(item, index) in getHistory(0)" 
              :key="index"
              class="dropdown-item"
              @mousedown="selectItem(item, 0)">
              {{ item }}
            </div>
          </div>
        </div>
        <div class="search-item switch-container">
          <el-switch
            v-model="value1"
            active-color="#13ce66"
            inactive-color="#E6A23C"
            active-text="精确"
            inactive-text="模糊"
            class="search-switch">
          </el-switch>
        </div>
        <div class="search-item">
          <el-button type="primary" icon="el-icon-search" @click="mysearch" class="search-button"></el-button>
        </div>
      </el-row>

      <!-- 新添加的搜索栏 -->
      <el-row :gutter="5" class="search-bar" v-for="(search, index) in additionalSearches" :key="index" style="margin-top: 5px;">
        <el-button icon="el-icon-minus" @click="removeSearchBar(index)" class="cancel-button" style="margin-left: 5px;"></el-button>
        <div class="search-item">
          <el-select v-model="search.selectedLogicalOperator" placeholder="AND" size="small" class="search-select" style="width: 68px;">
            <el-option
              v-for="item in logicalOperators"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-select v-model="search.selectedOption" placeholder="标题" size="small" class="search-select" style="margin-left: -5px;width: 68px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-input
            type="text"
            size="small"
            placeholder="请输入搜索内容"
            @focus="handleFocus(index + 1)"
            @blur="handleBlur(index + 1)"
            v-model="search.input"
            @input="handleAdditionalInput(index + 1)"
            class="search-input-field"
            style="width: 80px;margin-left: -5px;"
            clearable>
          </el-input>
          <!-- 医学建议术语下拉框 - 附加搜索框 -->
          <div class="suggestion-dropdown" v-show="activeInputIndex === index + 1 && showDropdown && getSuggestions(index + 1).length > 0">
            <div 
              v-for="(item, idx) in getSuggestions(index + 1)" 
              :key="idx"
              class="dropdown-item"
              @mousedown="selectItem(item, index + 1)">
              {{ item }}
            </div>
          </div>
        </div>
        <div class="search-item switch-container">
          <el-switch
            v-model="search.value1"
            active-color="#13ce66"
            inactive-color="#E6A23C"
            active-text="精确"
            inactive-text="模糊"
            class="search-switch"
            style="margin-left: -5px;">
          </el-switch>
        </div>
      </el-row>
    </template>

    <!-- 电脑端布局 -->
    <template v-else>
      <el-row :gutter="10" class="search-bar1" style="width: 100px;">
        <div class="search-item">
          <div class="search-select" style="width: 52px; height: 40px;"></div>
        </div>
        <el-button type="primary" icon="el-icon-plus" @click="addSearchBar" class="add-button" style="margin-right: 6px;padding: 11px 31px;"></el-button>
        <div class="search-item">
          <el-select v-model="selectedOption" placeholder="标题" class="search-select" style="width: 90px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-item" style="position: relative;">
          <el-input
            type="text"
            size="medium"
            placeholder="请输入搜索内容"
            @focus="handleFocus(0)"
            @blur="handleBlur(0)"
            v-model="input"
            class="search-input-field"
            clearable
            style="width: 400px;">
          </el-input>
          <!-- 历史搜索记录下拉框 - 主搜索框 -->
          <div class="history-dropdown" v-show="activeInputIndex === 0 && showDropdown && getHistory(0).length > 0">
            <div 
              v-for="(item, index) in getHistory(0)" 
              :key="index"
              class="dropdown-item"
              @mousedown="selectItem(item, 0)">
              {{ item }}
            </div>
          </div>
        </div>
        <div class="search-item switch-container">
          <el-switch
            v-model="value1"
            active-color="#13ce66"
            inactive-color="#E6A23C"
            active-text="精确"
            inactive-text="模糊"
            class="search-switch">
          </el-switch>
        </div>
        <div class="search-item">
          <el-button type="primary" icon="el-icon-search" @click="mysearch" class="search-button"></el-button>
        </div>
      </el-row>

      <!-- 新添加的搜索栏 -->
      <el-row :gutter="10" class="search-bar" v-for="(search, index) in additionalSearches" :key="index" style="margin-top: 10px;">
        <el-button icon="el-icon-minus" @click="removeSearchBar(index)" class="cancel-button" style="margin-right: 10px;"></el-button>
        <div class="search-item">
          <el-select v-model="search.selectedLogicalOperator" placeholder="AND" class="search-select" style="width: 80px;">
            <el-option
              v-for="item in logicalOperators"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-item">
          <el-select v-model="search.selectedOption" placeholder="标题" class="search-select" style="width: 90px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-item" style="position: relative;">
          <el-input
            type="text"
            size="medium"
            placeholder="请输入搜索内容"
            @focus="handleFocus(index + 1)"
            @blur="handleBlur(index + 1)"
            v-model="search.input"
            @input="handleAdditionalInput(index + 1)"
            class="search-input-field"
            clearable
            style="width: 400px;">
          </el-input>
          <!-- 医学建议术语下拉框 - 附加搜索框 -->
          <div class="suggestion-dropdown" v-show="activeInputIndex === index + 1 && showDropdown && getSuggestions(index + 1).length > 0">
            <div 
              v-for="(item, idx) in getSuggestions(index + 1)" 
              :key="idx"
              class="dropdown-item"
              @mousedown="selectItem(item, index + 1)">
              {{ item }}
            </div>
          </div>
        </div>
        <div class="search-item switch-container">
          <el-switch
            v-model="search.value1"
            active-color="#13ce66"
            inactive-color="#E6A23C"
            active-text="精确"
            inactive-text="模糊"
            class="search-switch">
          </el-switch>
        </div>
      </el-row>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    initialSearchText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isMobile: window.innerWidth <= 768,
      input: this.initialSearchText,
      value1: true,
      selectedOption: 'all',
      selectedLogicalOperator: 'AND',
      options: [
        { value: 'all', label: '全部' },
        { value: 'title', label: '标题' },
        { value: 'text', label: '文本' },
        { value: 'author', label: '作者' },
        { value: 'keywords', label: '关键词' },
      ],
      logicalOperators: [
        { value: 'AND', label: 'AND' },
        { value: 'OR', label: 'OR' },
        { value: 'NOT', label: 'NOT' },
      ],
      additionalSearches: [],
      maxSearchBars: 3,
      showDropdown: false,
      activeInputIndex: 0, // 当前激活的输入框索引
      searchHistoryData: {
        '骨':[
          '骨扫描和MRI诊断乳腺癌骨转移的临床价值探讨',
          '骨骼',
          '股骨头缺血性坏死的MRI表现',
          '儿童肘关节骨骺损伤的MRI征象',
          '骨骼肌系统感染的MRI诊断价值',
          '骨髓增生异常综合征的骨髓MRI研究'
        ],
        '主动脉夹层': [
          '主动脉夹层',
          'CT与MRI'
        ],
        '骨骼': [
          '失神经骨骼肌再生的MRI定量与病理学对照研究',
          '骨骼肌系统感染的MRI诊断价值',
          '基于MRI定量评估骨骼肌脂肪含量的方法对比研究',
          '多模态MRI定量评估骨骼肌的研究进展'
        ],
        '肝癌': [
          '15例含脂肝细胞肝癌的MRI影像特点',
          'MRI与CT在介入治疗肝癌后癌肿残留及复发的早期诊断应用',
          '1.5T MR多序列检查在小肝癌诊断中的应用',
          '含脂肝细胞肝癌的MRI影像特点',
          'CT动态增强扫描诊断原发性肝癌效能分析'
        ],
        '肝':[
          'MRI肝腺瘤的诊断价值及影像特点分析',
          '15例含脂肝细胞肝癌的MRI影像特点',
          '肝脏瘤样髓外造血1例',
          '肝细胞癌MRI、CT特征及诊断价值比较',
          'CT动态增强扫描诊断原发性肝癌效能分析'
        ]
      },
      // 为每个搜索框单独维护历史记录
      searchHistories: {
        0: [], // 主搜索框的历史记录
      },
      // 医学建议术语数据
      medicalTermSuggestions: {
        '肝癌': ['诊断价值', '诊断方法', '影像特点', '治疗进展', '预后分析'],
        '骨骼肌': ['再生能力', '病理学特征', 'MRI表现', '损伤修复', '定量评估'],
        'CT': ['扫描技术', '影像诊断', '对比增强', '三维重建', '临床应用'],
        'MRI': ['成像技术', '诊断应用', '动态增强', '功能成像', '定量分析'],
        '诊断': ['诊断价值', '诊断方法'],
        '治疗': ['方案', '效果', '副作用', '进展', '新技术'],
        '诊':['诊断']
      },
    };
  },
  watch: {
    initialSearchText(newVal) {
      this.input = newVal;
    }
  },
  computed: {
    searchHistory() {
      // 这个方法现在只用于计算主搜索框的历史记录
      return this.getHistory(0);
    }
  },
  methods: {
    getHistory(index) {
      // 获取指定搜索框的历史记录
      if (index === 0) {
        if (!this.input) {
          const allFlat = Object.values(this.searchHistoryData).flat();
          const validItems = allFlat.filter(item => item !== undefined);
          
          if (this.$store.state.searchCount === 0) {
            // 初始状态：1,3,5,7,9（奇数位）
            return [
              validItems[0],  // 第1项
              validItems[2],  // 第3项
              validItems[4],  // 第5项
              validItems[6],  // 第7项
              validItems[8]   // 第9项
            ].filter(item => item !== undefined);
          } else {
            // 搜索后：2,1,3,5,7（把第2项提到最前面）
            return [
              validItems[1],  // 第2项（提到前面）
              validItems[0],  // 第1项
              validItems[2],  // 第3项
              validItems[4],  // 第5项
              validItems[6]   // 第7项
            ].filter(item => item !== null);
          }
        } else {
          // 先尝试精确匹配
          let matchedKeywords = Object.keys(this.searchHistoryData)
            .filter(keyword => 
              this.input === keyword // 精确匹配
            );
          
          // 如果精确匹配不到，再尝试包含匹配
          if (matchedKeywords.length === 0) {
            matchedKeywords = Object.keys(this.searchHistoryData)
              .filter(keyword => 
                keyword.includes(this.input) || this.input.includes(keyword)
              );
          }
          
          // 返回匹配关键词的文献标题
          if (matchedKeywords.length > 0) {
            return this.searchHistoryData[matchedKeywords[0]]; // 只返回第一个匹配关键词的标题
          }
          return [];
        }
      } else {
        // 附加搜索框不使用历史记录
        return [];
      }
    },
    
    getSuggestions(index) {
  // 获取当前搜索框的输入内容
  const searchText = index === 0 ? this.input : this.additionalSearches[index - 1]?.input || '';
  
  if (!searchText) return [];
  
  // 收集所有匹配的建议术语
  const allSuggestions = [];
  
  // 1. 首先查找完全匹配的关键词
  if (this.medicalTermSuggestions[searchText]) {
    allSuggestions.push(...this.medicalTermSuggestions[searchText]);
  }
  
  // 2. 查找包含搜索文本的关键词
  Object.keys(this.medicalTermSuggestions).forEach(term => {
    if (term.includes(searchText) || searchText.includes(term)) {
      allSuggestions.push(...this.medicalTermSuggestions[term]);
    }
  });
  
  // 3. 去重并返回
  return [...new Set(allSuggestions)];
},
    
    handleFocus(index) {
      this.activeInputIndex = index;
      this.showDropdown = true;
      this.$emit('open');
    },
    
    handleBlur(index) {
      setTimeout(() => {
        if (this.activeInputIndex === index) {
          this.showDropdown = false;
        }
      }, 200);
    },
    
    handleAdditionalInput(index) {
      if (index !== 0) {
        this.showDropdown = true;
      }
    },
    
    selectItem(item, index) {
      if (index === 0) {
        this.input = item;
      } else {
        const searchIndex = index - 1;
        if (this.additionalSearches[searchIndex]) {
          this.additionalSearches[searchIndex].input = item;
        }
      }
      this.showDropdown = false;
      
      // 如果是主搜索框，添加到历史记录
      if (index === 0) {
        this.addToHistory(item, 0);
      }
    },
    
    mysearch() {
      this.$store.commit('incrementSearchCount')
      this.$nextTick(() => { // 确保DOM更新
      const databaseType = this.$parent.switchValue ? 'full' : 'personal';

      const query1 = {
        mainQuery: {
          logic: this.selectedLogicalOperator || 'AND',
          content: this.input,
          searchBy: this.selectedOption,
          searchMode: this.value1 ? 'exact' : 'fuzzy',
          searchDatabase: databaseType,
        },
        additionalQueries: this.additionalSearches.map(search => ({
          logic: search.selectedLogicalOperator,
          content: search.input,
          searchBy: search.selectedOption,
          searchMode: search.value1 ? 'exact' : 'fuzzy',
          searchDatabase: databaseType,
        })),
      };

      // 添加到搜索历史
      this.addToHistory(this.input, 0); // 主搜索框
      
      // 触发父组件的搜索事件
      this.$emit('search', query1);
    });
    },
    
    addSearchBar() {
  if (this.additionalSearches.length < this.maxSearchBars) {
    // 移除了未使用的 newIndex 变量
    this.additionalSearches.push({
      input: '',
      value1: true,
      selectedOption: 'all',
      selectedLogicalOperator: 'AND',
    });
  } else {
    alert('最多只能添加三个搜索框');
  }
},
    
    removeSearchBar(index) {
      this.additionalSearches.splice(index, 1);
    },
    
    handleResize() {
      this.isMobile = window.innerWidth <= 768;
    },
    
    addToHistory(searchText, index) {
      if (!searchText || index !== 0) return; // 只保存主搜索框的历史记录
      
      let history = this.searchHistories[index] || [];
      let newHistory = history.filter(item => item !== searchText);
      newHistory.unshift(searchText);
      
      if (newHistory.length > 5) {
        newHistory = newHistory.slice(0, 5);
      }
      
      this.$set(this.searchHistories, index, newHistory);
      localStorage.setItem(`searchHistory_${index}`, JSON.stringify(newHistory));
    },
    
    loadHistory() {
      // 加载主搜索框的历史记录
      const mainHistory = localStorage.getItem('searchHistory_0');
      if (mainHistory) {
        this.searchHistories[0] = JSON.parse(mainHistory);
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.loadHistory();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  }
};
</script>

<style scoped>
/* 保持原有样式不变 */
.search-input {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
}

.search-switch {
  width: 120px;
}

.add-button,
.search-button,
.cancel-button {
  padding: 10px 15px;
  border-radius: 4px;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-item {
  flex: 1;
  margin: 0 5px;
  position: relative;
}

.switch-container {
  display: flex;
  align-items: center;
}

/* 下拉框样式 */
.history-dropdown,
.suggestion-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 210px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 999;
  font-size: 14px;
}

.dropdown-item {
  padding: 10px 15px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f5f7fa;
}

/* 手机端样式 */
@media (max-width: 768px) {
  .search-input {
    width: 100%;
  }

  .original-search-bar {
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 5px;
  }

  .original-search-bar .search-item {
    flex: none;
    width: auto;
    margin: 0;
  }

  .original-search-bar .search-select {
    width: 80px;
    font-size: 11px;
  }

  .el-input {
    font-size: 11px;
  }

  .el-switch {
    font-size: 11px;
  }

  .el-button {
    font-size: 11px;
    padding: 8px 10px;
  }
  
  .el-select ::v-deep .el-input__inner {
    font-size: 11px !important;
  }
  
  .el-switch ::v-deep .el-switch__label--left {
    margin-right: 5px;
    font-size: 12px !important;
  }

  .el-switch ::v-deep .el-switch__label--right {
    margin-left: 5px;
    font-size: 12px;
  }
  
  .search-button {
    margin-left: -15px;
  }
  
  /* 手机端下拉框 */
  .history-dropdown,
  .suggestion-dropdown {
    width: 115px; /* 与输入框同宽 */
    left: auto;
    right: 0;
    font-size: 11px;
  }
}
</style>