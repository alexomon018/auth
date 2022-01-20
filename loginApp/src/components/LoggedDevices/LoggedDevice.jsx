import React from "react";
import "antd/dist/antd.css";
import { Card, Col } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import moment from "moment";

const LoggedDevice = ({ device, handleWithdraw }) => {
  const date = new Date(device.lastLogin.replace(" ", "T"));
  const timeAgo = moment(date).fromNow();

  return (
    <>
      <Col>
        <Card
          title={device.device}
          bordered={false}
          actions={[
            <DeleteOutlined onClick={() => handleWithdraw(device.id)} />,
          ]}
          style={{ width: 300, marginTop: 16 }}
        >
          <p>{timeAgo}</p>
        </Card>
      </Col>
    </>
  );
};

export default LoggedDevice;
