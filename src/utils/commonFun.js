/*
 * @Author:
 * @Date: 2025-01-02 14:39:43
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-01-09 13:49:42
 * @Description:
 * @FilePath: \vue2-project\src\utils\commonFun.js
 */

import {message} from 'element-ui'

export function showMessage(type, msg) {
  switch(type) {
    case 'success':
      message.success(msg)
      break
    case 'warning':
      message.warning(msg)
      break
    case 'error':
      message.error(msg)
      break
    default:
      message.info(msg)
  }
}
