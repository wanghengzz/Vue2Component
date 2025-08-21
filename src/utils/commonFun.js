/*
 * @Author:
 * @Date: 2025-01-02 14:39:43
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-05-14 14:34:18
 * @Description:
 * @FilePath: \vue2-project\src\utils\commonFun.js
 */

import {message} from 'element-ui'
import xlsx from 'xlsx-js-style'
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

//导出函数
export function downLoadExcel(data, tableParams, fileName, title) {
  const workbook = xlsx.utils.book_new()
  // 创建数据
  const newData = data.length > 0
    ? data.map(item => {
        const newItem = {}
        tableParams.forEach(param => {
          newItem[param.label] = item[param.prop]
        })
        return newItem
      })
    : [{}]
  // 创建工作表
  const ws = xlsx.utils.json_to_sheet(newData, { skipHeader: true })

  // 如果有title则添加标题行
  if (title) {
    xlsx.utils.sheet_add_aoa(ws, [[title]], { origin: 'A1' })
    ws['A1'].s = {
      font: { sz: 20, bold: true },
      alignment: { horizontal: 'center', vertical: 'center' }
    }
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: tableParams.length - 1 } }]
    ws['!rows'] = [{ hpt: 20 }]
  }

  // 添加表头
  const headerOrigin = title ? 'A2' : 'A1'
  xlsx.utils.sheet_add_aoa(ws, [tableParams.map(param => param.label)], { origin: headerOrigin })

  // 设置所有表头单元格居中
  tableParams.forEach((_, index) => {
    const cellRef = xlsx.utils.encode_cell({ r: title ? 1 : 0, c: index })
    ws[cellRef].s = {
      alignment: { horizontal: 'center', vertical: 'center' }
    }
  })
  // 设置列宽
  // ws['!cols'] = tableParams.map(() => ({ wch: 15 }))
  xlsx.utils.book_append_sheet(workbook, ws, 'Sheet1')
  xlsx.writeFile(workbook, fileName)
}
