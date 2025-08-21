/*
 * @Author: wangheng 306604343@qq.com
 * @Date: 2025-07-31 22:27:17
 * @LastEditors: wangheng 306604343@qq.com
 * @LastEditTime: 2025-07-31 22:46:20
 * @FilePath: /Vue2Component/src/utils/request.js
 * @Description:
 */
import axios from 'axios'
import { getApiConfig } from '@/config/api'

const apiConfig = getApiConfig()

const request = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
})

request.interceptors.request.use(config => {
  // 可以在这里添加请求拦截器，比如添加token
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

request.interceptors.response.use(response => {
  const { data } = response
  if (data.code === 200) {
    return data.data
  } else {
    return Promise.reject(data.message)
  }
}, error => {
  // 统一错误处理
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // 未授权，跳转到登录页
        console.error('未授权，请重新登录')
        break
      case 403:
        console.error('拒绝访问')
        break
      case 404:
        console.error('请求的资源不存在')
        break
      case 500:
        console.error('服务器内部错误')
        break
      default:
        console.error('网络错误')
    }
  }
  return Promise.reject(error)
})

export default request