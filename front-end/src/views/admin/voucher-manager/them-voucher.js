import { Button } from "antd";
import React from "react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { apiURLVoucher } from "../../../service/api";
import TextField from "@mui/material/TextField";
import { InputAdornment } from "@mui/material";
import "../voucher-manager/style.css";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs"; // Import thư viện Day.js
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Box from "@mui/joy/Box";
import Radio, { radioClasses } from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";

const AddVoucher = () => {
  const [listVoucher, setListVoucher] = useState([]);
  const [ma, setMa] = useState("");
  const [ten, setTen] = useState("");
  const [ngayBatDau, setNgayBatDau] = useState(dayjs());
  const [ngayKetThuc, setNgayKetThuc] = useState(dayjs());
  const [dieuKienApDungConvert, setDieuKienApDungConvert] = useState(0);
  const [soLuong, setSoLuong] = useState();
  const [validationMsg, setValidationMsg] = useState({});
  const [giaTriVoucherConvert, setGiaTriVoucherConvert] = useState(0);
  const [value, setValue] = React.useState();
  const [value1, setValue1] = React.useState();
  const [value2, setValue2] = React.useState();
  const [selectDiscount, setSeclectDiscount] = useState("VNĐ");
  const [giaTriToiDa, setGiaTriToiDa] = useState();
  const [valueToiThieu, setValueToiThieu] = React.useState();
  const [valueToiDa, setValueToiDa] = React.useState();
  const [isLoading, setIsLoading] = useState(false);

  const loadDataListVoucher = (page) => {
    axios
      .get(`${apiURLVoucher}/vouchers`)
      .then((response) => {
        setListVoucher(response.data.content);
        console.log(response);
      })
      .catch((error) => {});
  };

  const handleChange = (event) => {
    if (selectDiscount === "VNĐ") {
      const inputValue = event.target.value;
      const numericValue = parseFloat(inputValue.replace(/[^0-9.-]+/g, ""));
      const formattedValue = inputValue
        .replace(/[^0-9]+/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setValue(formattedValue);
      setGiaTriVoucherConvert(numericValue);
    }
    if (selectDiscount === "%") {
      let inputValue = event.target.value;
      // Loại bỏ các ký tự không phải số
      inputValue = inputValue.replace(/\D/g, "");
      // Xử lý giới hạn giá trị từ 1 đến 100
      if (isNaN(inputValue) || inputValue < 1) {
        inputValue = "0";
      } else if (inputValue > 100) {
        inputValue = "100";
      }
      setValue(inputValue);
      setGiaTriVoucherConvert(inputValue);
    }
  };

  const handleChange1 = (event) => {
    const inputValue = event.target.value;
    const numericValue = parseFloat(inputValue.replace(/[^0-9.-]+/g, ""));
    const formattedValue = inputValue
      .replace(/[^0-9]+/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setValue1(formattedValue);
    setDieuKienApDungConvert(numericValue);
  };

  const handleChangeGiaTriToiDa = (event) => {
    const inputValue = event.target.value;
    const numericValue = parseFloat(inputValue.replace(/[^0-9.-]+/g, ""));
    const formattedValue = inputValue
      .replace(/[^0-9]+/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setValueToiDa(formattedValue);
    setGiaTriToiDa(numericValue);
  };

  const redirectToHienThiVoucher = () => {
    window.location.href = "/dashboard/voucher";
  };

  const addVoucher = () => {
    let obj = {
      ma: ma,
      ten: ten,
      dieuKienApDung: dieuKienApDungConvert,
      soLuong: soLuong,
      ngayBatDau: ngayBatDau,
      ngayKetThuc: ngayKetThuc,
      giaTriVoucher: giaTriVoucherConvert,
      giaTriToiDa: giaTriToiDa,
      loaiVoucher: selectDiscount,
    };

    axios
      .post(apiURLVoucher + "/addVoucher", obj)
      .then((response) => {
        toast.success("Thêm thành công!");
        setTimeout(() => {
          redirectToHienThiVoucher();
        }, 2000);
      })
      .catch((error) => {
        toast.error("Đã xảy ra lỗi khi thêm voucher.");
      });
  };

  const validationAll = () => {
    const msg = {};

    if (!ten.trim("")) {
      msg.ten = "Tên không được để trống !!!";
    }

    // if (/^\s+|\s+$/.test(ten)) {
    //   msg.ten = "Tên không chứa ký tự khoảng trống ở đầu và cuối chuỗi";
    // }
    if (soLuong == null || soLuong === "") {
      msg.soLuong = "Số lượng không được để trống !!!";
    }
    // if (/^\s+|\s+$/.test(soLuong)) {
    //   msg.soLuong =
    //     "Số lượng không chứa ký tự khoảng trống ở đầu và cuối chuỗi";
    // }

    if (soLuong <= 0 || soLuong > 10000) {
      msg.soLuong = "Số lượng cho phép từ 1 đến 10000";
    }

    const numericValue1 = parseFloat(value1?.replace(/[^0-9.-]+/g, ""));
    if (value1 == null || value1 === "") {
      msg.value1 = "Điều kiện áp dụng không được để trống !!!";
    }

    if (numericValue1 <= 0 || numericValue1 > 100000000) {
      msg.value1 = "Điều kiện áp dụng từ 1đ đến 100.000.000đ";
    }

    if (ngayBatDau.isAfter(ngayKetThuc)) {
      msg.ngayBatDau = "Ngày bắt đầu phải nhỏ hơn ngày kết thúc !!!";
    }

    const numericValue2 = parseFloat(value?.replace(/[^0-9.-]+/g, ""));
    if (value == null || value === "") {
      msg.value = "Giá trị voucher không được để trống !!!";
    }

    if (
      (selectDiscount === "VNĐ" && numericValue2 <= 0) ||
      (selectDiscount === "VNĐ" && numericValue2 > 100000000)
    ) {
      msg.value = "Giá trị voucher từ 1đ đến 100.000.000đ";
    }

    const numericValue3 = parseFloat(valueToiDa?.replace(/[^0-9.-]+/g, ""));
    if (
      (selectDiscount === "%" && valueToiDa === null) ||
      (selectDiscount === "%" && valueToiDa === "")
    ) {
      msg.valueToiDa = "Giá trị tối đa không được để trống !!!";
    }

    if (
      (selectDiscount === "%" && numericValue3 <= 0) ||
      (selectDiscount === "%" && numericValue3 > 100000000)
    ) {
      msg.valueToiDa = "Giá trị tối đa từ 1đ đến 100.000.000đ";
    }
    if (ngayKetThuc.isBefore(ngayBatDau)) {
      msg.ngayKetThuc = "Ngày kết thúc phải lớn hơn ngày bắt đầu !!!";
    }

    if (ngayBatDau.isBefore(dayjs())) {
      msg.ngayBatDau = "Ngày bắt đầu phải lớn hơn ngày hiện tại !!!";
    }

    if (ngayKetThuc.isBefore(dayjs())) {
      msg.ngayKetThuc = "Ngày kết thúc phải lớn hơn ngày hiện tại !!!";
    }

    console.log(value);

    setValidationMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
  };

  const handleSubmit = () => {
    const isValid = validationAll();
    if (!isValid) return;
    addVoucher();
  };

  const handleChangeToggleButtonDiscount = (event, newAlignment) => {
    var oldAligment = event.target.value;

    if (newAlignment != null) {
      setSeclectDiscount(newAlignment);
      setValue2(null);
    }

    if (newAlignment == null) {
      setSeclectDiscount(oldAligment);
    }
    handleReset();
  };

  const handleReset = () => {
    setValue("");
    setValueToiDa("");
    setValueToiThieu("");
  };

  return (
    <>
      <div className="add-voucher-container mt-4">
        <h4
          style={{
            marginBottom: "20px",
            marginLeft: "40px",
            marginTop: "15px",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          Thêm Voucher
        </h4>

        <div className="text-center">
          <div
            className="d-flex"
            style={{ marginLeft: "40px", marginBottom: "15px" }}
          >
            <div>
              <TextField
                label="Mã Voucher"
                placeholder="Nhập hoặc để mã tự động "
                value={ma}
                id="fullWidth"
                onChange={(e) => {
                  setMa(e.target.value);
                }}
                style={{ width: "300px" }}
                inputProps={{
                  maxLength: 100, // Giới hạn tối đa 10 ký tự
                }}
              />
              <span className="validate" style={{ color: "red" }}>
                {validationMsg.ma}
              </span>
            </div>
            <div className="ms-3">
              <TextField
                label="Tên Voucher"
                value={ten}
                id="fullWidth"
                onChange={(e) => {
                  setTen(e.target.value);
                }}
                style={{ width: "300px" }}
                inputProps={{
                  maxLength: 100, // Giới hạn tối đa 10 ký tự
                }}
              />
              <span className="validate" style={{ color: "red" }}>
                {validationMsg.ten}
              </span>
            </div>
          </div>
          <div
            className="d-flex"
            style={{ marginLeft: "40px", marginBottom: "15px" }}
          >
            <div>
              <TextField
                label="Số Lượng"
                value={soLuong}
                id="fullWidth"
                onChange={(e) => {
                  setSoLuong(e.target.value);
                }}
                style={{ width: "300px" }}
                inputProps={{
                  maxLength: 10, // Giới hạn tối đa 10 ký tự
                }}
              />
              <span className="validate" style={{ color: "red" }}>
                {validationMsg.soLuong}
              </span>
            </div>
            <div className="ms-3">
              {" "}
              <TextField
                label="Điều kiện áp dụng khi đơn hàng đạt"
                value={value1}
                onChange={handleChange1}
                id="outlined-start-adornment"
                InputProps={{
                  inputMode: "numeric",
                  startAdornment: (
                    <InputAdornment position="start">VND</InputAdornment>
                  ),
                }}
                style={{ width: "300px" }}
                inputProps={{
                  maxLength: 20, // Giới hạn tối đa 10 ký tự
                }}
              />
              <span className="validate" style={{ color: "red" }}>
                {validationMsg.value1}
              </span>
            </div>
          </div>

          <div
            className="d-flex"
            style={{ marginLeft: "40px", marginBottom: "5px" }}
          >
            <div>
              <RadioGroup
                orientation="horizontal"
                aria-label="Alignment"
                name="alignment"
                variant="outlined"
                value={selectDiscount}
                onChange={handleChangeToggleButtonDiscount}
                sx={{ borderRadius: "12px" }}
              >
                {["VNĐ", "%"].map((item) => (
                  <Box
                    key={item}
                    sx={(theme) => ({
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: 50,
                      height: 54,
                      "&:not([data-first-child])": {
                        borderLeft: "1px solid",
                        borderdivor: "divider",
                      },
                      [`&[data-first-child] .${radioClasses.action}`]: {
                        borderTopLeftRadius: `calc(${theme.vars.radius.sm} + 5px)`,
                        borderBottomLeftRadius: `calc(${theme.vars.radius.sm} + 5px)`,
                      },
                      [`&[data-last-child] .${radioClasses.action}`]: {
                        borderTopRightRadius: `calc(${theme.vars.radius.sm} + 5px)`,
                        borderBottomRightRadius: `calc(${theme.vars.radius.sm} + 5px)`,
                      },
                    })}
                  >
                    <Radio
                      value={item}
                      disableIcon
                      overlay
                      label={[item]}
                      variant={selectDiscount === item ? "solid" : "plain"}
                      slotProps={{
                        input: { "aria-label": item },
                        action: {
                          sx: { borderRadius: 0, transition: "none" },
                        },
                        label: { sx: { lineHeight: 0 } },
                      }}
                    />
                  </Box>
                ))}
              </RadioGroup>
            </div>
            <div className="ms-3">
              <TextField
                label="Nhập Giá Trị Voucher"
                value={value}
                onChange={handleChange}
                id="outlined-start-adornment"
                InputProps={{
                  inputMode: "numeric",
                  startAdornment: (
                    <InputAdornment position="start">
                      {selectDiscount === "VNĐ" ? "VND" : "%"}
                    </InputAdornment>
                  ),
                }}
                style={{
                  width: "240.5px",
                }}
                inputProps={{
                  maxLength: 20, // Giới hạn tối đa 10 ký tự
                }}
              />
              <span
                className="validate"
                style={{
                  color: "red",
                }}
              >
                {validationMsg.value}
              </span>
            </div>
            <div className="ms-3">
              <TextField
                label="Giá Trị Tối Đa"
                value={valueToiDa}
                id="outlined-start-adornment"
                onChange={handleChangeGiaTriToiDa}
                InputProps={{
                  inputMode: "numeric",
                  startAdornment: (
                    <InputAdornment position="start">VND</InputAdornment>
                  ),
                }}
                disabled={selectDiscount === "VNĐ" ? true : false}
                style={{
                  width: "240.5px",
                }}
                inputProps={{
                  maxLength: 20, // Giới hạn tối đa 10 ký tự
                }}
              />
              <span
                className="validate"
                style={{
                  color: "red",
                }}
              >
                {validationMsg.valueToiDa}
              </span>
            </div>
          </div>
          <div
            className="d-flex"
            style={{ marginLeft: "40px", marginBottom: "10px" }}
          >
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateTimePicker"]}>
                  <DateTimePicker
                    ampm={true}
                    disablePast={true}
                    label="Ngày Bắt Đầu"
                    format="HH:mm DD/MM/YYYY"
                    value={ngayBatDau}
                    onChange={(e) => {
                      setNgayBatDau(e);
                    }}
                    sx={{ width: "295px" }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <span className="validate-date" style={{ color: "red" }}>
                {validationMsg.ngayBatDau}
              </span>
            </div>
            <div className="ms-4" style={{ marginLeft: "15px" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateTimePicker"]}>
                  <DateTimePicker
                    ampm={true}
                    label="Ngày Kết Thúc"
                    value={ngayKetThuc}
                    format="HH:mm DD/MM/YYYY"
                    disablePast={true}
                    onChange={(e) => {
                      setNgayKetThuc(e);
                    }}
                    sx={{ width: "295px" }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <span className="validate-date" style={{ color: "red" }}>
                {validationMsg.ngayKetThuc}
              </span>
            </div>
          </div>
        </div>
        <div className="btn-accept mt-3">
          <Button
            className="rounded-2 button-mui"
            type="primary"
            style={{ height: "35px", width: "120px", fontSize: "15px" }}
            onClick={() => handleSubmit()}
          >
            <ToastContainer />
            <FontAwesomeIcon icon={faCheck} />
            <span
              className="ms-2 ps-1"
              style={{ marginBottom: "3px", fontWeight: "500" }}
            >
              Xác nhận
            </span>
          </Button>
          <Button
            className="rounded-2 button-mui ms-2"
            type="primary"
            style={{ height: "35px", width: "120px", fontSize: "15px" }}
            onClick={() => {
              redirectToHienThiVoucher();
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span
              className="ms-2 ps-1"
              style={{ marginBottom: "3px", fontWeight: "500" }}
            >
              Quay về
            </span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default AddVoucher;
