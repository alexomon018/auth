import React, { useEffect } from "react";
import LoggedDevice from "./LoggedDevice";
import { Link } from "react-router-dom";
import { Row } from "antd";
import { useGlobalContext } from "../../context";
const LoggedDevices = () => {
  const { handleDevices, userData, devices, handleWithdraw, withdrawMessage } =
    useGlobalContext();
  useEffect(() => {
    handleDevices();
  }, [withdrawMessage]);

  console.log(withdrawMessage);

  return (
    <div
      style={{
        padding: "30px",
        background: "#ececec",
      }}
    >
      {!userData ? (
        <div>
          {"You must be logged in to access this page"}
          <Link to="/login">{"Click here to login"}</Link>
        </div>
      ) : (
        <Row gutter={16}>
          {devices.map((device) => (
            <LoggedDevice
              key={device.id}
              device={device}
              handleWithdraw={handleWithdraw}
            />
          ))}
        </Row>
      )}
    </div>
  );
};

export default LoggedDevices;
