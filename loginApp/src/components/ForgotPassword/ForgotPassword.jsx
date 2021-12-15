import React from "react";
import "antd/dist/antd.css";
import axios from "axios";
import { Form, Input, Button, Layout } from "antd";
import { Content } from "antd/lib/layout/layout";

const ForgotPassword = () => {
  const [resetLink, setResetLink] = React.useState("");
  const [error, setError] = React.useState("");

  const onFinish = (values) => {
    const { username } = values;
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/auth/forgot-password`,
        { username },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setResetLink(res.data);
      })
      .catch((error) => setError(error.message));
  };
  console.log(resetLink);

  if (error) {
    return <div>{error}</div>;
  }

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
          {resetLink.length > 0 ? (
            <p>Password link was sent to your email</p>
          ) : (
            <Form
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <h2>Forgot Password</h2>
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default ForgotPassword;
