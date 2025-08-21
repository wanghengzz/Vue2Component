/*
 * @Author: wangheng 306604343@qq.com
 * @Date: 2025-01-07 10:00:00
 * @LastEditors: wangheng 306604343@qq.com
 * @LastEditTime: 2025-07-31 22:54:48
 * @FilePath: /Vue2Component/src/config/api.js
 * @Description: API配置文件
 */

// 环境配置
const env = process.env.NODE_ENV || 'development'

// API基础配置
const apiConfig = {
  development: {
    // 开发环境使用相对路径，通过Vue代理转发
    baseURL: '',
    timeout: 5000
  },
  production: {
    baseURL: process.env.VUE_APP_API_BASE_URL || 'https://api.yourdomain.com',
    timeout: 10000
  },
  test: {
    baseURL: 'http://test-api.yourdomain.com',
    timeout: 5000
  }
}

// 获取当前环境的配置
export const getApiConfig = () => {
  return apiConfig[env] || apiConfig.development
}

// API接口地址
export const API_URLS = {
  // 用户相关
  USER_LOGIN: '/api/user/login',
  USER_INFO: '/api/user/info',
  USER_LOGOUT: '/api/user/logout',

  // 数据相关
  GET_DATA: '/api/user/list',
  CREATE_DATA: '/api/data/create',
  UPDATE_DATA: '/api/data/update',
  DELETE_DATA: '/api/data/delete',

  // 文件上传
  UPLOAD_FILE: '/api/file/upload',

  // 其他接口
  GET_CONFIG: '/api/config',
  GET_MENU: '/api/menu'
}

export default {
  getApiConfig,
  API_URLS
}
