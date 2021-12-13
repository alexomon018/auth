import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, Layout } from "antd";
import { Content } from "antd/lib/layout/layout";

const ResetPassword = () => {
  const { id, token } = useParams();
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onFinish = (values) => {
    const { password, password2 } = values;
    axios
      .post(
        `http://localhost:8080/users/reset-password/${id}/${token}`,
        { password, password2 },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setMessage(res.data);
        navigate("/login");
      })
      .catch((error) => setMessage(error.message));
  };

  const onFinishFailed = (errorInfo) => {};

  useEffect(() => {
    axios
      .get(`http://localhost:8080/users/reset-password/${id}/${token}`)
      .then((res) => {
        setUser(res.data.payload.payload);
      })
      .catch((err) => {
        setUser(err);
      });
  }, []);

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
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <h2>Password reset for {user?.username}</h2>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter new password",
                },
              ]}
            >
              <Input type="password" placeholder="Password" />
            </Form.Item>
            <Form.Item
              label="Confirm password"
              name="password2"
              rules={[
                {
                  required: true,
                  message: "Please confirm new password",
                },
              ]}
            >
              <Input type="password" placeholder="Password" />
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
        </div>
      </Content>
    </Layout>
  );
};

export default ResetPassword;
