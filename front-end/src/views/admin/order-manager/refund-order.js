import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "antd";
import {
  TextField,
} from "@mui/material";
import axios from "axios";
import {
  Notistack,
} from "./enum";
import useCustomSnackbar from "../../../utilities/notistack";

const RefundOrder = () => {
  const navigate = useNavigate();
  const [orderCode, setOrderCode] = useState("");
  const { handleOpenAlertVariant } = useCustomSnackbar();

  const getOrderItemsById = async () => {
    await axios
      .get(`http://localhost:8080/api/orders/${orderCode}`)
      .then((response) => {
        handleRedirectRefundOrderDetail();
      })
      .catch((error) => {
        handleOpenAlertVariant("Không tìm thấy đơn hàng!", Notistack.ERROR);
      });
  };

  const handleRedirectRefundOrderDetail = () => {
    navigate(`/dashboard/refund-order/${orderCode}`)
  }

  // useEffect(() => {
  // }, []);



  return (
    <>
      <div
        className=""
        style={{
          backgroundColor: "#ffffff",
          boxShadow: "0 0.1rem 0.3rem #00000010",
          height: "675px"
        }}
      >
        <div className="text-center">
          <div className="mt-4 pt-3">
            <img className="" style={{ width: "500px", height: "300px" }} src="https://img.freepik.com/free-vector/flat-design-illustrated-transport-truck_23-2149151340.jpg?w=1060&t=st=1700877824~exp=1700878424~hmac=1f975ae98b8555e1f4dcb9c75f7afcbec36ba6b13f9114b21804578f8506d45a" alt="" />
            <div className="header-title mt-2">
              <TextField
                label="Tìm Kiếm Đơn Hàng"
                onChange={(e) => setOrderCode(e.target.value)}
                value={orderCode}
                InputLabelProps={{
                  sx: {
                    marginTop: "",
                    textTransform: "capitalize",
                  },
                }}
                inputProps={{
                  style: {
                    height: "23px",
                    width: "500px",
                  },
                }}
                size="small"
                className=""
              />
              <Button
                onClick={() => getOrderItemsById()}
                className="rounded-2 ms-2"
                type="warning"
                style={{ width: "100px", fontSize: "15px" }}
              >
                <span
                  className="text-dark"
                  style={{ fontWeight: "500", marginBottom: "2px" }}
                >
                  Tìm Kiếm
                </span>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-4"></div>
      </div>
    </>
  );
}
export default RefundOrder;
