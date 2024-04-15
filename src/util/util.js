/*
获取url的参数
*/
export function getUrlState() {
  if (window.location.href.indexOf('?') === -1) return
  let url = window.location.href.split('?')
  let urlInfo = url[1]

  const infoArr = urlInfo.split('&')
  const store = {}
  for (let item of infoArr) {
    const i = item.split('=')
    store[i[0]] = i[1]
  }
  return store
}

/** 获取当前浏览器UA信息 */
function _getUA() {
  return (
    typeof navigator !== 'undefined' &&
    ((navigator && (navigator.userAgent || navigator.swuserAgent)) || '')
  )
}

/** 判断当前是否移动端 */
export function isMb() {
  return /Android|webOS|iPhone|iPod|BlackBerry/i.test(_getUA())
}

/** 格式化日期 */
export function formatDateTime(timeObj, fmt) {
  if (!timeObj) return ''
  var o = {
    'M+': timeObj.getMonth() + 1, //月份
    'd+': timeObj.getDate(), //日
    'h+': timeObj.getHours(), //小时
    'm+': timeObj.getMinutes(), //分
    's+': timeObj.getSeconds(), //秒
    'q+': Math.floor((timeObj.getMonth() + 3) / 3), //季度
    S: timeObj.getMilliseconds(), //毫秒
  }

  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (timeObj.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
  return fmt
}

/** 时间戳转日期 */
export function timeStamp2Text(timeStamp, format = 'yyyy-MM-dd hh:mm') {
  if (!timeStamp || typeof timeStamp !== 'number') return ''
  return formatDateTime(new Date(timeStamp), format)
}

/** 强复制 */
export function superCopy(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 指定数组对象排序的比较函数
 * @param {Object} property 传入对象属性
 * 示例: arr = arr.sort(Util.compare('count'))
 */
export function compare(property) {
  return function (obj1, obj2) {
    const value1 = obj1[property]
    const value2 = obj2[property]
    // return value1 - value2 // 升序
    return value2 - value1 // 降序
  }
}

/** 审批状态转中文 */
export function approvalStatusToChinese(status) {
  let txt = ''
  switch (status) {
    case 'approve':
      txt = '审批通过'
      break;
    case 'reject':
      txt = '审批拒绝'
      break;
    case 'review':
      txt = '审批中'
      break;
    default:
      break;
  }
  return txt
}

/** 获取时间差值 */
export function hourTimeValue(startTime, endTime) {
  let time = ''
  time = new Date(endTime).getTime() - new Date(startTime).getTime()
  time = time / 3600000
  return time
}

/** 校验基本信息表单 */
export function checkedInfoForm(form) {
  if (form === null) return false
  let isOk = true
  for (const i in form) {
    if (form[i] === undefined || form[i] === "") isOk = false
  }
  return isOk
}

/** 校验相关资质表单 */
export function checkedProveForm(form) {
  if (form === null) return false
  let isOk = true
  for (const i in form) {
    if (i === "file1" || i === "otherFile" || i === "id" || i === "approvalDateTime" || i === "approvalOpinion" || i === "approvalStatus") continue
    if (form[i] === undefined || form[i] === null) return false
    if (form[i].length === 0) return false
  }
  return isOk
}

/** 校验现场收费表单 */
export function checkedCostForm(form) {
  if (form === null) return false
  if (!form.collectFeeDTOList.length) return false
  let isOk = true
  for (const item of form.collectFeeDTOList) {
    if (!item.materialName) isOk = false
    if (!item.quantity) isOk = false
  }
  return isOk
}

/** 校验车辆出入表单 */
export function checkedCarForm(form, goodsInfo) {
  if (goodsInfo.isInputVehicle === "n") return true
  if (form === null) return false
  if (!form.length) return false
  let isOk = true
  for (const i in form) {
    if (i === "licensePlateNumber") continue
    if (form[i] === undefined && form[i] === "") isOk = false
  }
  return isOk
}

// 为了让 import { xxx } from 'util' 生效
export default {
  getUrlState,
  formatDateTime,
  timeStamp2Text,
  superCopy,
  compare,
  isMb,
  hourTimeValue,
  approvalStatusToChinese,
  checkedInfoForm,
  checkedProveForm,
  checkedCostForm,
  checkedCarForm
}
