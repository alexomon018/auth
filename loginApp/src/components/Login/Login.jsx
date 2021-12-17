import React from "react";
import axios from "axios";
import { useGlobalContext } from "../../context";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, Layout } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import "antd/dist/antd.css";

const { Content } = Layout;

const Login = () => {
  const { setLoginData } = useGlobalContext();
  const navigate = useNavigate();

  const onFinish = (values) => {
    const { password, username } = values;
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_LOGIN_URL}`,
        { username, password },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        const { accessToken, refreshToken } = res.data;
        Cookies.set("accessToken", accessToken);
        Cookies.set("refreshToken", refreshToken);
        setLoginData(jwt_decode(accessToken).payload);
        navigate("/movies");
      })
      .catch((error) => setLoginData(error.message));
  };

  return (
    <Layout>
      <Content
        style={{ display: "flex", justifyContent: "center", height: "100vh" }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            display: "grid",
            alignItems: "center",
          }}
        >
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <a className="login-form-forgot" href="/forgot-password">
                Forgot password
              </a>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
              Or <a href="">register now!</a>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default Login;
