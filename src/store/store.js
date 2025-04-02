import Vue from 'vue';
import Vuex from 'vuex';

// 使用 Vuex
Vue.use(Vuex);

// 创建 Vuex Store
export default new Vuex.Store({
  // 状态（数据）
  state: {
    searchCount:0,
    historyList: [ { fileName: "成人髓母细胞瘤MRI表现及误诊分析" },
    { fileName: "超声对致密型乳腺疾病的诊断价值" },
    { fileName: "MRI-DWI诊断儿童后颅窝肿瘤的临床价值" },
    { fileName: "基因编辑技术在医学中的应用" },], // 浏览历史
    user: {
      username: localStorage.getItem('username') || '', // 从 localStorage 中读取用户名
    },
    databaseMode: localStorage.getItem('databaseMode') || 'full', // 数据库模式：full（全文数据库）或 personal（个人数据库）
    sidebarVisible: true, // 侧边栏是否可见
  },

  // 获取状态的方法
  getters: {
    // 获取当前用户信息
    currentUser: (state) => state.user,

    // 判断用户是否登录
    isLoggedIn: (state) => !!state.user.token,

    // 获取当前数据库模式
    currentDatabaseMode: (state) => state.databaseMode,

    // 获取侧边栏可见性
    isSidebarVisible: (state) => state.sidebarVisible,
  },

  // 修改状态的方法（必须是同步的）
  mutations: {
    incrementSearchCount(state) {
      state.searchCount++
    },
    addHistory(state, fileName) {
      // 如果历史记录中已经存在该文件，则不重复添加
      if (!state.historyList.some(item => item.fileName === fileName)) {
        state.historyList.unshift({ fileName });
      }
    },
    // 设置用户信息
    setUser(state, { username }) {
      state.user.username = username;
      // 将用户信息保存到 localStorage
      localStorage.setItem('username', username);
    },

    // 清除用户信息（退出登录）
    logout(state) {
      state.user.username = '';
      state.user.token = '';
      // 从 localStorage 中移除用户信息
      localStorage.removeItem('username');
    },

    // 设置数据库模式
    setDatabaseMode(state, mode) {
      state.databaseMode = mode;
      // 将数据库模式保存到 localStorage
      localStorage.setItem('databaseMode', mode);
    },

    // 切换侧边栏可见性
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible;
    },
  },

  // 异步操作（可以调用 mutations）
  actions: {
    addHistory({ commit }, fileName) {
      commit('addHistory', fileName);
    },
    // 登录操作
    login({ commit }, { username, token }) {
      commit('setUser', { username, token });
    },

    // 退出登录操作
    logout({ commit }) {
      commit('logout');
    },

    // 切换数据库模式
    toggleDatabaseMode({ commit, state }) {
      const newMode = state.databaseMode === 'full' ? 'personal' : 'full';
      commit('setDatabaseMode', newMode);
    },
  },
});