"use client";
import { useState } from "react";
import "./login.css";
import { Button, Form, Input } from "antd";
import { postLogin, postRegister } from "../../api/api";
import { useNavigate } from "react-router-dom";
import loginTitle from "../../image/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [isLogin, setIsLogin] = useState(true);
  const [verifyBtnMsg, setVerifyBtnMsg] = useState("获取验证码");
  const [isDisabledVerifyBtn, setIsDisabledVerifyBtn] = useState(true);
  const [isUpdatePW, setIsUpdatePW] = useState(false);

  /** 登录 */
  const onLoginFinish = async (values) => {
    const res = await postLogin(values);
    if (res && res.code === 200) {
      localStorage.setItem("IASAccount", JSON.stringify(values));
      localStorage.setItem("jwtIASToken", "Bearer " + res.data);
      navigate("/index", { replace: true });
    }
  };

  if (localStorage.getItem("IASAccount")) {
    onLoginFinish(JSON.parse(localStorage.getItem("IASAccount")));
    return;
  }

  /** 登录失败 */
  const onLoginFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
  };

  /** 注册 */
  const onRegisterFinish = async (values) => {
    if (isUpdatePW) {
      // const res = await postRegister(values);
      // if (res && res.code === 200) {
      //   message.success("修改成功，请重新登录");
      //   onChangeTypeClick();
      // }
    } else {
      const res = await postRegister(values);
      if (res && res.code === 200) {
        localStorage.setItem("IASAccount", JSON.stringify(values));
        localStorage.setItem("jwtIASToken", "Bearer " + res.data);
        navigate("/index", { replace: true });
      }
    }
  };

  /** 注册失败 */
  const onRegisterFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
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

  /** 获取验证码 */
  const onCheckPhone = () => {
    let curTime = 60;
    setIsDisabledVerifyBtn(true);
    let timer = setInterval(() => {
      setVerifyBtnMsg(`请${curTime}秒后操作`);
      if (curTime === 0) {
        clearInterval(timer);
        setIsDisabledVerifyBtn(false);
        setVerifyBtnMsg(`获取验证码`);
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
        <div className="login-form-title">
          {isLogin ? "登录账号" : isUpdatePW ? "修改密码" : "注册账号"}
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
            onFinishFailed={onLoginFinishFailed}
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
              <Input.Password className="form-input" placeholder="请输入密码" />
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
              {/* <Button
                className="link-btn"
                type="link"
                onClick={onUpdateClick}
                htmlType="reset"
              >
                修改密码
              </Button> */}
              <span className="form-tip">没有账号？</span>
              <Button
                className="link-btn"
                type="link"
                onClick={onChangeTypeClick}
                htmlType="reset"
              >
                立即注册
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form
            form={registerForm}
            name="register"
            className="form-warp"
            initialValues={{
              remember: true,
            }}
            onFinish={onRegisterFinish}
            onFinishFailed={onRegisterFinishFailed}
            autoComplete="off"
            onValuesChange={onRegisterValuesChange}
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
                <Input className="form-input" placeholder="请输入手机号" />
                {/* <Button
                  disabled={isDisabledVerifyBtn}
                  className="form-btn"
                  onClick={onCheckPhone}
                >
                  {verifyBtnMsg}
                </Button> */}
              </div>
            </Form.Item>

            {/* <Form.Item
              label=""
              name="verifyCode"
              rules={[
                {
                  required: true,
                  message: "请输入验证码",
                },
              ]}
            >
              <Input className="form-input" placeholder="请输入验证码" />
            </Form.Item> */}

            <Form.Item
              label=""
              name="password"
              rules={[
                {
                  required: true,
                  message: "请输入密码",
                },
              ]}
            >
              <Input.Password className="form-input" placeholder="请输入密码" />
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
    </div>
  );
}
