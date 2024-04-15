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
/*
计算文字宽度
text 需要计算宽度的文字 包括空格
font 字体属性  比如  `12px sans-serif`
*/
export function getTextWidth(text, font = 'normal 10px sans-serif') {
  // getTextWidth.canvas 这里主要为了复用一个canvas   getTextWidth.canvas就是一个全局变量
  // getTextWidth.任意变量 首次定义只能在getTextWidth函数内定义
  // 然后在其他函数内就可以定义 getTextWidth.其他变量  但是不建议这么使用
  let tCanvas = null
  const canvas = tCanvas || (tCanvas = document.createElement('canvas'))
  const context = canvas.getContext('2d')
  context.font = font
  return context.measureText(text).width
} /** 获取当前浏览器UA信息 */
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

/** 获取当前是否钉钉H5环境 */
export function isDD() {
  return /DingTalk/i.test(_getUA())
}

/** 通过 名字 + 下标 + 随机串生成的key，用于v-for */
export function generateKey(name = '', index = '') {
  return `key-${name}-${index}-${new Date().getTime().toString(36)}`
}

/**
 * 生成 UUID
 * @param {Number} len 指定长度
 * @param {Number} radix 指定基数
 */
export function generateUuid(len, radix) {
  var chars =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')

  var uuid = []
  var i = null

  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | (Math.random() * radix)]
    }
  } else {
    // rfc4122, version 4 form

    var r // rfc4122 requires these characters

    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'

    uuid[14] = '4' // Fill in random data.  At i==19 set the high bits of clock sequence as // per rfc4122, sec. 4.1.5

    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
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

/**
 * 轮询程序
 * 当条件成立，才执行回调
 * 失败 N 次后，执行失败回调
 *
 * @param {String} conditions 成立条件表达式
 * @param {Number} interval 间隔多少毫秒, 默认200
 * @param {Number} timeout (运行)超时次数, 默认50
 *
 */
export function pollFunction(conditions, interval = 200, timeout = 50) {
  return new Promise((resolve, reject) => {
    let num = 0
    let t = setInterval(() => {
      num = num + 1
      if (num >= timeout) {
        reject(`超时,表达式不成立: ${conditions}`)
        return
      }

      if (!conditions) return
      clearInterval(t)
      resolve(`表达式成立: ${conditions}`)
    }, interval)
  })
}

/** 获取当前经纬度 */
export function getLocation(cb, http) {
  // async
  navigator.geolocation.getCurrentPosition((res) => {
    // console.log('res', res)
    const { coords } = res
    if (typeof cb === 'function') cb(coords)
  })
}

/**
 * 根据两点间经纬度坐标，计算两点间距离，单位为米
 *
 * @param lng1 起始点经度
 * @param lat1 起始点纬度
 * @param lng2 终点经度
 * @param lat2 终点纬度
 * @return  直线距离，以米为单位
 */
export function calcLinearDistance(lng1, lat1, lng2, lat2) {
  const EARTH_RADIUS = 6378137

  const rad = (d) => {
    return (d * Math.PI) / 180.0
  }

  const radLat1 = rad(lat1)
  const radLat2 = rad(lat2)
  const a = radLat1 - radLat2
  const b = rad(lng1) - rad(lng2)
  let s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
      )
    )
  s = s * EARTH_RADIUS
  s = Math.round(s * 10000) / 10000
  return s
}

/** 节流 */
export function throttle(method, delay = 2000, time = 1000) {
  var timeout,
    startTime = +new Date()
  return function () {
    var context = this,
      args = arguments,
      curTime = +new Date()
    clearTimeout(timeout)
    // 如果达到了规定的触发时间间隔，触发 handler
    if (curTime - startTime >= time) {
      method.apply(context, args)
      startTime = curTime
    } else {
      // 没达到触发间隔，重新设定定时器
      timeout = setTimeout(method, delay)
    }
  }
}

/** 强复制 */
export function superCopy(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/** 提取汉字 */
export function getChinese(strValue) {
  if (strValue !== null && strValue !== '') {
    const reg = /[\u4e00-\u9fa5]/g
    return strValue.match(reg).join('')
  } else {
    return ''
  }
}

/**
 * 按字节计算字符串长度
 * @param bytes 字节数
 * @returns
 */
export function byteLength(str) {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    // UTF8编码一个中文按3个字节算（GBK编码一个中文按2个字节）
    len += str.charCodeAt(i) > 255 ? 3 : 1
    // len += str.replace(/[^\x00-\xff]/g, 'xxx').length
  }
  return len
}

/**
 * 按字节截取字符串
 * @param bytes 字节数
 * @return s
 */
export function subStringByBytes(str, bytes) {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    // UTF8编码一个中文按3个字节算（GBK编码一个中文按2个字节
    len += str.charCodeAt(i) > 255 ? 3 : 1
    if (len > bytes) {
      return str.substring(0, i) + '...'
    }
  }
  return str
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

/**
 * 金额处理
 * 第一位value是必传的
 * 第二位num是保留小数位，默认保留两位小数
 */
export function formatMoney(value, num) {
  num = num > 0 && num <= 20 ? num : 2
  value = parseFloat((value + '').replace(/[^\d\\.-]/g, '')).toFixed(num) + '' // 将金额转成比如 123.45的字符串
  var valueArr = value.split('.')[0].split('').reverse() // 将字符串的数变成数组
  const valueFloat = value.split('.')[1] // 取到 小数点后的值
  let valueString = ''
  for (let i = 0; i < valueArr.length; i++) {
    // 循环 取数值并在每三位加个','
    valueString +=
      valueArr[i] + ((i + 1) % 3 === 0 && i + 1 !== valueArr.length ? ',' : '')
  }
  const money = valueString.split('').reverse().join('') + '.' + valueFloat // 拼接上小数位
  return money
}

/** 跳转去飞书扫码页 */
export function goToLarkLoginPage(appid, state, scope) {
  const { protocol, host } = window.location
  const redirect_uri = encodeURIComponent(`${protocol}//${host}`)
  let url = `https://open.feishu.cn/open-apis/authen/v1/authorize?redirect_uri=${redirect_uri}&app_id=${appid}`
  if (state) url += `&state=${state}`
  if (scope) url += `&scope=${scope}`

  // console.log('去飞书', url)
  window.location.href = url
}

export function copyToClipboard(text) {
  var tempInput = document.createElement('input')
  tempInput.style = 'position: absolute; left: -1000px; top: -1000px'
  tempInput.value = text
  document.body.appendChild(tempInput)
  tempInput.select()
  document.execCommand('copy')
  document.body.removeChild(tempInput)
}

/** 判断是否还有下一页 */
export function isHasMore(current, pages) {
  if (!pages) return true
  let isHasMore = true
  if (current < pages) {
    isHasMore = true
  } else {
    isHasMore = false
  }
  return isHasMore
}

/** 过滤掉对象数组中的重复对象 */
export function filterDuplicates(arr) {
  const uniqueObjects = [];
  const seen = new Set();

  arr.forEach((item) => {
    const objectAsString = JSON.stringify(item);
    if (!seen.has(objectAsString)) {
      uniqueObjects.push(item);
      seen.add(objectAsString);
    }
  });

  return uniqueObjects;
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
  getTextWidth,
  isDD,
  formatDateTime,
  timeStamp2Text,
  pollFunction,
  getLocation,
  calcLinearDistance,
  throttle,
  superCopy,
  generateKey,
  getChinese,
  byteLength,
  subStringByBytes,
  compare,
  goToLarkLoginPage,
  isMb,
  generateUuid,
  formatMoney,
  copyToClipboard,
  isHasMore,
  filterDuplicates,
  hourTimeValue,
  approvalStatusToChinese,
  checkedInfoForm,
  checkedProveForm,
  checkedCostForm,
  checkedCarForm
}
