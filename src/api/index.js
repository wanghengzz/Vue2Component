/*
 * @Author: wangheng 306604343@qq.com
 * @Date: 2025-01-07 10:00:00
 * @LastEditors: wangheng 306604343@qq.com
 * @LastEditTime: 2025-07-31 22:52:51
 * @FilePath: /Vue2Component/src/api/index.js
 * @Description: API服务文件
 */
import request from '@/utils/request'
import { API_URLS } from '@/config/api'

// 用户相关API
export const userApi = {
  // 用户登录
  login(data) {
    return request({
      url: API_URLS.USER_LOGIN,
      method: 'post',
      data
    })
  },

  // 获取用户信息
  getUserInfo() {
    return request({
      url: API_URLS.USER_INFO,
      method: 'get'
    })
  },

  // 用户登出
  logout() {
    return request({
      url: API_URLS.USER_LOGOUT,
      method: 'post'
    })
  }
}

// 数据相关API
export const dataApi = {
  // 获取数据列表
  getDataList(data) {
    return request({
      url: API_URLS.GET_DATA,
      method: 'post',
      data
    })
  },

  // 创建数据
  createData(data) {
    return request({
      url: API_URLS.CREATE_DATA,
      method: 'post',
      data
    })
  },

  // 更新数据
  updateData(id, data) {
    return request({
      url: `${API_URLS.UPDATE_DATA}/${id}`,
      method: 'put',
      data
    })
  },

  // 删除数据
  deleteData(id) {
    return request({
      url: `${API_URLS.DELETE_DATA}/${id}`,
      method: 'delete'
    })
  }
}

// 文件上传API
export const fileApi = {
  // 上传文件
  uploadFile(file, onProgress) {
    const formData = new FormData()
    formData.append('file', file)

    return request({
      url: API_URLS.UPLOAD_FILE,
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: onProgress
    })
  }
}

// 系统配置API
export const configApi = {
  // 获取系统配置
  getConfig() {
    return request({
      url: API_URLS.GET_CONFIG,
      method: 'get'
    })
  },

  // 获取菜单
  getMenu() {
    return request({
      url: API_URLS.GET_MENU,
      method: 'get'
    })
  }
}

export default {
  userApi,
  dataApi,
  fileApi,
  configApi
}
