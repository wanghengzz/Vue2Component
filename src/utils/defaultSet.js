/*
 * @Author:
 * @Date: 2025-01-09 10:24:59
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-01-09 10:25:27
 * @Description:
 * @FilePath: \vue2-project\src\utils\defaultSet.js
 */
export const regList = {
  name: /[^\u4e00-\u9fa5]/g,
  phone: /^1[3-9]\d{9}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
}

