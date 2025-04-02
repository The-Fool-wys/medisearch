import axios from 'axios';

// 配置基础URL（根据实际后端地址修改）
axios.defaults.baseURL = 'http://192.168.56.1:7200';

// 响应拦截器（统一处理错误）
axios.interceptors.response.use(
  response => response.data,
  error => {
    const status = error.response?.status;
    let message = '请求失败';

    switch (status) {
      case 400:
        message = '参数错误';
        break;
      case 401:
        message = '未登录或登录已过期';
        break;
      case 402:
        message = '密码错误';
        break;
      case 404:
        message = '资源未找到';
        break;
      case 409:
        message = '用户名已存在';
        break;
      case 413:
        message = '文件过大';
        break;
      default:
        message = error.response?.data?.message || '请求失败';
    }

    console.error('API Error:', message);
    return Promise.reject({ status, message });
  }
);

// 用户相关接口
export const userApi = {
  // 用户注册
  register: (username, password) => axios.post('/user/register', { username, password }),

  // 用户登录
  login: (username, password) => axios.post('/user/login', { username, password }),

  // 用户退出
  logout: (username) => axios.post('/user/logout', { username }),

  // 获取文件上传数量
  getUploadCount: (username) => axios.get('/user/uploadCount', { params: { username } }),

  // 获取历史记录
  getHistory: (username) => axios.get('/user/history', { params: { username } }),

  getFavorite: (username) => axios.get('/user/favorite', { params: { username } }),
};

// 文件相关接口
export const fileApi = {
  // 上传文件
  upload: (file, username) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', username);
    return axios.post('/file/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // 下载文件
  download: (filename, username) => axios.get('/file/download', { params: { filename, username } }),

  // 删除文件
  delete: (filename, username) => axios.delete('/file/delete', { params: { filename, username } }),

  // // 获取文献内容
  // getContent: (filename) => axios.get('/file/content', { params: { filename } }),

  // 获取已上传文件列表
  getUploadedFiles: (username) => axios.get('/file/uploadedFiles', { params: { username } }),
};

// 搜索相关接口
export const searchApi = {
  // 搜索
  search: (username,query) => axios.post('/Medisearch/search', { username,query }),
  //搜索简览
  searchDetail:(filename, username)=> axios.post('/search/details', { filename, username }),
};

// 收藏相关接口
export const favoriteApi = {
  // 添加收藏
  addFavorite: (filename, username) => axios.post('/favorite/add', { filename, username }),

  // 删除收藏
  removeFavorite: (filename, username) => axios.delete('/favorite/remove', { params: { filename, username } }),
};

// 历史记录相关接口
export const historyApi = {
  // 删除历史记录
  deleteHistory: (filename, username) => axios.delete('/history/delete', { params: { filename, username } }),

  // 添加记录历史
  addHistory: (filename, username) => axios.post('/history/record', { filename, username }),
};