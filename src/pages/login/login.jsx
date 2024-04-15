"use client";
import { useState } from "react";
import "./login.css";
import { Button, Form, Input } from "antd";
import { postLogin, postRegister } from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [isLogin, setIsLogin] = useState(true);

  /** 登录 */
  const onLoginFinish = async (values) => {
    const res = await postLogin(values);
    if (res.code === 200) {
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
    const res = await postRegister(values);
    if (res.code === 200) {
      localStorage.setItem("IASAccount", JSON.stringify(values));
      localStorage.setItem("jwtIASToken", "Bearer " + res.data);
      navigate("/index", { replace: true });
    }
  };

  /** 注册失败 */
  const onRegisterFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
  };

  /** 切换登录/注册 */
  const onChangeTypeClick = () => {
    !isLogin ? registerForm.resetFields() : loginForm.resetFields();
    setIsLogin(!isLogin);
  };

  return (
    <div className="login-warp">
      <div className="login-warp-left"></div>
      <div className="login-warp-right">
        <div className="login-title">
          <img src="../../image/logo.png" alt="" />
        </div>
        <div className="login-form-title">
          {isLogin ? "登录账号" : "注册账号"}
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
                // {
                //   pattern: /^1(3|4|5|6|7|8|9)[0-9]\d{8}$/,
                //   message: '请输入正确的手机号',
                //   trigger: 'blur'
                // }
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
              <Input className="form-input" placeholder="请输入手机号" />
            </Form.Item>

            {/* <Form.Item
              label=""
              name="username"
              rules={[
                {
                  required: true,
                  message: "请输入邮箱",
                },
              ]}
            >
              <Input className="form-input" placeholder="请输入邮箱" />
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
                注册
              </Button>
            </Form.Item>
            {isLogin ? (
              <Form.Item>
                <span className="form-tip">没有账号？</span>
                <Button
                  className="link-btn"
                  type="link"
                  onClick={onChangeTypeClick}
                >
                  立即注册
                </Button>
              </Form.Item>
            ) : (
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
            )}
          </Form>
        )}
      </div>
    </div>
  );
}
