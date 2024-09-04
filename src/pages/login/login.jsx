"use client";
import { useState } from "react";
import "./login.css";
import { Button, Form, Input } from "antd";
import {
  postLogin,
  postRegister,
  postSendVerifyCode,
  postCheckVerifyCode,
  postResetPassword,
} from "../../api/api";
import { encryptData, decryptData } from "../../util/util";
import { useNavigate } from "react-router-dom";
import loginTitle from "../../image/logo.png";
import { CheckCircleFilled } from "@ant-design/icons";

export default function Login() {
  const navigate = useNavigate();
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [verifyForm] = Form.useForm();
  const [resetForm] = Form.useForm();
  const [isLogin, setIsLogin] = useState(true);
  const [verifyBtnMsg, setVerifyBtnMsg] = useState("获取验证码");
  const [isDisabledVerifyBtn, setIsDisabledVerifyBtn] = useState(true);
  const [isUpdatePW, setIsUpdatePW] = useState(false);
  const [isUpdatePWResult, setIsUpdatePWResult] = useState(false);
  const [isVerifyResult, setIsVerifyResult] = useState(false);
  const [isNextStepDisabled, setIsNextStepDisabled] = useState(true);

  /** 登录 */
  const onLoginFinish = async (values) => {
    const res = await postLogin(values);
    if (res && res.code === 200) {
      localStorage.setItem("IASAccount", encryptData(JSON.stringify(values)));
      localStorage.setItem("jwtIASToken", "Bearer " + res.data);
      navigate("/index", { replace: true });
    }
  };

  if (localStorage.getItem("IASAccount")) {
    onLoginFinish(JSON.parse(decryptData(localStorage.getItem("IASAccount"))));
    return;
  }

  /** 注册 */
  const onRegisterFinish = async (values) => {
    const res = await postRegister(values);
    if (res && res.code === 200) {
      localStorage.setItem("IASAccount", encryptData(JSON.stringify(values)));
      localStorage.setItem("jwtIASToken", "Bearer " + res.data);
      navigate("/index", { replace: true });
    }
  };

  /** 验证码 */
  const onVerifyFinish = async (values) => {
    const res = await postCheckVerifyCode(values);
    if (res && res.code === 200) {
      localStorage.setItem("jwtIASToken", "Bearer " + res.data);
      resetForm.setFieldValue(
        "phoneNumber",
        verifyForm.getFieldValue("phoneNumber")
      );
      setIsVerifyResult(true);
    }
  };

  /** 重置密码 */
  const onResetFinish = async (values) => {
    const res = await postResetPassword(values);
    if (res && res.code === 200) {
      onChangeTypeClick();
      setIsUpdatePWResult(true);
      let timer = setTimeout(async () => {
        clearTimeout(timer);
        const res = await postLogin(values);
        if (res && res.code === 200) {
          localStorage.setItem(
            "IASAccount",
            encryptData(JSON.stringify(values))
          );
          localStorage.setItem("jwtIASToken", "Bearer " + res.data);
          navigate("/index", { replace: true });
        }
      }, 3000);
    }
  };

  /** 切换登录/注册 */
  const onChangeTypeClick = () => {
    setIsUpdatePW(false);
    !isLogin ? registerForm.resetFields() : loginForm.resetFields();
    setIsLogin(!isLogin);
  };

  /** 切换修改密码 */
  const onUpdateClick = () => {
    setIsUpdatePW(true);
    !isLogin ? registerForm.resetFields() : loginForm.resetFields();
    setIsLogin(!isLogin);
  };

  const onRegisterValuesChange = (changedValues, allValues) => {
    if (allValues.phoneNumber) {
      const reg = /^1(3|4|5|6|7|8|9)[0-9]\d{8}$/;
      let isPhone = reg.test(allValues.phoneNumber);
      if (!isPhone) {
        setIsDisabledVerifyBtn(true);
        return;
      }
      setIsDisabledVerifyBtn(false);
    }
  };

  const onVerifyValuesChange = (changedValues, allValues) => {
    if (allValues.code) {
      setIsNextStepDisabled(false);
    }
    if (allValues.phoneNumber) {
      const reg = /^1(3|4|5|6|7|8|9)[0-9]\d{8}$/;
      let isPhone = reg.test(allValues.phoneNumber);
      if (!isPhone) {
        setIsDisabledVerifyBtn(true);
        return;
      }
      verifyForm.setFieldValue("phoneNumber", allValues.phoneNumber);
      resetForm.setFieldValue("phoneNumber", allValues.phoneNumber);
      setIsDisabledVerifyBtn(false);
    }
  };

  /** 获取验证码 */
  const onCheckPhone = async () => {
    let curTime = 60;
    const data = {
      phoneNumber: verifyForm.getFieldValue("phoneNumber"),
    };
    setIsDisabledVerifyBtn(true);
    await postSendVerifyCode(data);
    let timer = setInterval(() => {
      setIsDisabledVerifyBtn(true);
      setVerifyBtnMsg(`重新获取（${curTime}秒）`);
      if (curTime === 0) {
        clearInterval(timer);
        setIsDisabledVerifyBtn(false);
        setVerifyBtnMsg(`重新获取`);
        return;
      }
      curTime--;
    }, 1000);
  };

  return (
    <div className="login-warp">
      <div className="login-warp-left"></div>
      <div className="login-warp-right">
        <div className="login-title">
          <img src={loginTitle} alt="" />
        </div>
        {isUpdatePWResult ? (
          <div className="update-succ-content">
            <CheckCircleFilled className="update-succ-icon" />
            <div className="update-succ-tip">重置密码成功</div>
          </div>
        ) : (
          <div>
            <div className="login-form-title">
              {isLogin ? "登录账号" : isUpdatePW ? "重置密码" : "注册账号"}
            </div>
            {isLogin ? (
              <Form
                form={loginForm}
                name="login"
                className="form-warp"
                initialValues={{
                  remember: true,
                }}
                onFinish={onLoginFinish}
                autoComplete="off"
              >
                <Form.Item
                  label=""
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: "请输入正确的手机号",
                    },
                    {
                      pattern: /^1(3|4|5|6|7|8|9)[0-9]\d{8}$/,
                      message: "请输入正确的手机号",
                      trigger: "blur",
                    },
                  ]}
                >
                  <Input className="form-input" placeholder="请输入手机号" />
                </Form.Item>
                <Form.Item
                  label=""
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "请输入正确的密码",
                    },
                  ]}
                >
                  <Input.Password
                    className="form-input"
                    placeholder="请输入密码"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    className="form-submit-btn"
                    type="primary"
                    htmlType="submit"
                  >
                    登录
                  </Button>
                </Form.Item>
                <Form.Item>
                  <div className="form-footer">
                    <div>
                      <span className="form-tip">没有账号？</span>
                      <Button
                        className="link-btn"
                        type="link"
                        onClick={onChangeTypeClick}
                        htmlType="reset"
                      >
                        立即注册
                      </Button>
                    </div>
                    <div>
                      <Button
                        className="form-tip"
                        type="link"
                        onClick={onUpdateClick}
                        htmlType="reset"
                      >
                        忘记密码？
                      </Button>
                    </div>
                  </div>
                </Form.Item>
              </Form>
            ) : isUpdatePW ? (
              isVerifyResult ? (
                <Form
                  form={resetForm}
                  name="reset"
                  className="form-warp"
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={onResetFinish}
                  autoComplete="off"
                >
                  <Form.Item
                    label=""
                    name="phoneNumber"
                    rules={[
                      {
                        required: true,
                        message: "请输入手机号",
                      },
                      {
                        pattern: /^1(3|4|5|6|7|8|9)[0-9]\d{8}$/,
                        message: "请输入正确的手机号",
                        trigger: "blur",
                      },
                    ]}
                  >
                    <div className="form-flex-item">
                      <Input
                        disabled={true}
                        className="form-input"
                        placeholder="请输入手机号"
                      />
                    </div>
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "请输入密码!",
                      },
                      {
                        min: 8,
                        max: 8,
                        message: "密码长度必须为8位!",
                      },
                    ]}
                    extra="密码长度为8位，字母区分大小写"
                  >
                    <Input.Password
                      className="form-input"
                      placeholder="请输入密码"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      className="form-submit-btn"
                      type="primary"
                      htmlType="submit"
                    >
                      确认
                    </Button>
                  </Form.Item>

                  <Form.Item>
                    <span className="form-tip">已有账号？</span>
                    <Button
                      className="link-btn"
                      type="link"
                      onClick={onChangeTypeClick}
                      htmlType="reset"
                    >
                      立即登录
                    </Button>
                  </Form.Item>
                </Form>
              ) : (
                <Form
                  form={verifyForm}
                  name="register"
                  className="form-warp"
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={onVerifyFinish}
                  autoComplete="off"
                  onValuesChange={onVerifyValuesChange}
                >
                  <Form.Item
                    label=""
                    name="phoneNumber"
                    rules={[
                      {
                        required: true,
                        message: "请输入手机号",
                      },
                      {
                        pattern: /^1(3|4|5|6|7|8|9)[0-9]\d{8}$/,
                        message: "请输入正确的手机号",
                        trigger: "blur",
                      },
                    ]}
                  >
                    <div className="form-flex-item">
                      <Input
                        disabled={isVerifyResult}
                        className="form-input"
                        placeholder="请输入手机号"
                      />
                    </div>
                  </Form.Item>
                  <Form.Item
                    label=""
                    name="code"
                    rules={[
                      {
                        required: true,
                        message: "请输入验证码",
                      },
                    ]}
                  >
                    <div className="form-flex-item">
                      <Input
                        className="form-input"
                        placeholder="请输入验证码"
                      />
                      <Button
                        disabled={isDisabledVerifyBtn}
                        className="form-btn"
                        onClick={onCheckPhone}
                      >
                        {verifyBtnMsg}
                      </Button>
                    </div>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      disabled={isNextStepDisabled}
                      className="form-submit-btn"
                      type="primary"
                      htmlType="submit"
                    >
                      下一步
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <span className="form-tip">已有账号？</span>
                    <Button
                      className="link-btn"
                      type="link"
                      onClick={onChangeTypeClick}
                      htmlType="reset"
                    >
                      立即登录
                    </Button>
                  </Form.Item>
                </Form>
              )
            ) : (
              <Form
                form={registerForm}
                name="register"
                className="form-warp"
                initialValues={{
                  remember: true,
                }}
                onFinish={onRegisterFinish}
                autoComplete="off"
                onValuesChange={onRegisterValuesChange}
              >
                <Form.Item
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: "请输入手机号",
                    },
                    {
                      pattern: /^1(3|4|5|6|7|8|9)[0-9]\d{8}$/,
                      message: "请输入正确的手机号",
                      trigger: "blur",
                    },
                  ]}
                >
                  <div className="form-flex-item">
                    <Input
                      disabled={isVerifyResult}
                      className="form-input"
                      placeholder="请输入手机号"
                    />
                  </div>
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "请输入密码!",
                    },
                    {
                      min: 8,
                      max: 8,
                      message: "密码长度必须为8位!",
                    },
                  ]}
                  extra="密码长度为8位，字母区分大小写"
                >
                  <Input.Password
                    className="form-input"
                    placeholder="请输入密码"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    className="form-submit-btn"
                    type="primary"
                    htmlType="submit"
                  >
                    {isUpdatePW ? "立即修改" : "注册"}
                  </Button>
                </Form.Item>
                <Form.Item>
                  <span className="form-tip">已有账号？</span>
                  <Button
                    className="link-btn"
                    type="link"
                    onClick={onChangeTypeClick}
                    htmlType="reset"
                  >
                    立即登录
                  </Button>
                </Form.Item>
              </Form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
