import axios from 'axios'
import { message } from 'antd'


let baseUrl = 'http://120.78.191.169:8088/' // 线上

// baseUrl = 'http://192.168.110.226:8088/' // 双全-本地环境

// baseUrl = 'http://192.168.110.206:8088/' // 任其-本地环境

// baseUrl = "http://rawchen.mynatapp.cc/"

axios.defaults.baseURL = baseUrl
axios.defaults.timeout = 100000

/**
 * http request 拦截器
 */
axios.interceptors.request.use(
  (config) => {
    // 带上身份信息的请求头
    // 调免登接口不要传token到后端，其余接口需要
    config.baseURL = baseUrl
    if (config.url.indexOf('user/register') === -1 && config.url.indexOf('user/login') === -1) {
      config.headers.set('Authorization', localStorage.getItem('jwtIASToken'))
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * http response 拦截器
 */
axios.interceptors.response.use(
  (response) => {
    const { code } = response.data
    // token过期
    if (code === 401) {
      localStorage.clear()
      // navigate("/", { replace: true });
      window.location.pathname = ""
      return response.data
    }

    if (code !== 200) {
      if (response.config.url.indexOf('project/verifyInvitationCode') === -1) message.error(response.data.msg)
      response.ok = false
      response.data.code = "报错啦"
      return response.data
    }
    return response.data
  },
  (error) => {
    console.log('请求出错：', error)
    message.warning('网络错误，请稍后再试')
  }
)

export function getBaseUrl() {
  const baseURL = baseUrl
  const Authorization = localStorage.getItem('jwtMiToken')
  return {
    baseURL,
    Authorization
  }
}

/**
 * 封装get方法
 * @param url  请求url
 * @param params  请求参数
 * @returns {Promise}
 */
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
      })
      .then((response) => {
        landing(url, params, response)
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

/**
 * 封装delete方法
 * @param url  请求url
 * @param params  请求参数
 * @returns {Promise}
 */
export function del(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        params: params,
      })
      .then((response) => {
        landing(url, params, response)
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(
      (response) => {
        //关闭进度条
        resolve(response)
      },
      (err) => {
        reject(err)
      }
    )
  })
}

// /**
//  * 封装patch请求
//  * @param url
//  * @param data
//  * @returns {Promise}
//  */
export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data).then(
      (response) => {
        resolve(response)
      },
      (err) => {
        msg(err)
        reject(err)
      }
    )
  })
}

// /**
//  * 封装put请求
//  * @param url
//  * @param data
//  * @returns {Promise}
//  */

export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data).then(
      (response) => {
        resolve(response)
      },
      (err) => {
        msg(err)
        reject(err)
      }
    )
  })
}

//失败提示
function msg(err) {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        alert(err.response.data.error.details)
        break
      case 401:
        alert('未授权，请登录')
        break

      case 403:
        alert('拒绝访问')
        break

      case 404:
        alert('请求地址出错')
        break

      case 408:
        alert('请求超时')
        break

      case 500:
        alert('服务器内部错误')
        break

      case 501:
        alert('服务未实现')
        break

      case 502:
        alert('网关错误')
        break

      case 503:
        alert('服务不可用')
        break

      case 504:
        alert('网关超时')
        break

      case 505:
        alert('HTTP版本不受支持')
        break
      default:
    }
  }
}

/**
 * 查看返回的数据
 * @param url
 * @param params
 * @param data
 */
function landing(url, params, data) {
  // console.log('========',url, params, data);
  // if (data.data.code === -1) {
  // }
}
