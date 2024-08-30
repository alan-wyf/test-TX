import { get, post } from "../config"

/**
 * 
 * 登录界面
 * 
 */

// 注册用户
export function postRegister(data) {
  // data = {
  //   "phoneNumber": "110",
  //   "password": "123456"
  // }
  return post('user/register', data)
}

// 登录用户
export function postLogin(data) {
  // data = {
  //   "phoneNumber": "110",
  //   "password": "123456"
  // }
  return post('user/login', data)
}

// 发送验证码
export function postSendVerifyCode(data) {
  // data = {
  //   "phoneNumber": "110",
  // }
  return post('user/sendVerifyCode', data)
}

// 校验验证码
export function postCheckVerifyCode(data) {
  // data = {
  //   "phoneNumber": "110",
  //   "code": "123456"
  // }
  return post('user/checkVerifyCode', data)
}

// 重置密码
export function postResetPassword(data) {
  // data = {
  //   "phoneNumber": "110",
  //   "password": "123456"
  // }
  return post('user/resetPassword', data)
}

/**
 * 
 * 首页界面
 * 
 */

// 校验邀请码
export function postInviteCode(data) {
  // data = {
  //   "invitationCode": "110"
  // }
  return post('project/verifyInvitationCode', data)
}


// 8. 邀请码查询参展品牌
export function postInviteCodeBrandName(data) {
  // data = {
  //   "invitationCode": "110"
  // }
  return post('project/invitationCodeBrandName', data)
}

// 获取项目列表
export function postProjectList(data) {
  return post('project/projectList', data)
}

// 保存审核
export function postSave(data) {
  return post('data/save', data)
}

// 提交审核
export function postSubmit(data) {
  return post('data/submit', data)
}

/**
 * 
 * 详情界面
 * 
 */

// 获取详情

// 上传附件
export function postUpload(data) {
  return post('file/upload', data)
}

// 获取详情
export function getProjectDetail(data) {
  // data = itemCoding(项目编码)
  return get(`project/query/${data}`)
}

// 获取填报详情
export function getProjectData(data) {
  // data = itemCoding(项目编码)
  return get(`data/show/${data}`)
}

/**
 * 
 * 基本信息模块
 * 
 */

// 保存基本信息
export function postSaveBaseInfo(data) {
  return post('base/addBaseInfo', data)
}

/**
 * 
 * 相关资质模块
 * 
 */

// 保存相关资质
export function postSaveQualification(data) {
  return post('qualification/addQualification', data)
}

/**
 * 
 * 现场收费模块
 * 
 */

// 获取物料名称
export function getMaterialList(data) {
  // data = itemCoding(项目编码)
  return get(`material/query/itemCode/${data}`)
}

// 根据选择的物料获取详细信息
export function getMaterialInfo(data) {
  // data = id(物料id)
  return get(`material/query/id/${data}`)
}

// 变更现场收费
export function postUpdateCollectFee(data) {
  return post('data/updateMaterialDetails', data)
}

/**
 * 
 * 车辆出入模块
 * 
 */


// 获取货车类型
export function getVehiclesList() {
  return get(`vehicles/list/vehiclesType`)
}