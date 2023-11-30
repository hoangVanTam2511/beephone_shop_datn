import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams, useParams } from "react-router-dom";
import { Button, Empty, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Box, Dialog, DialogContent, FormControl, IconButton, MenuItem, Pagination, Select, Slide, TextField, Tooltip, } from "@mui/material";
import Card from "../../../components/Card";
import { format } from "date-fns";
import axios from "axios";
import { parseInt } from "lodash";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import Zoom from '@mui/material/Zoom';
import * as dayjs from "dayjs";
import { OrderStatusString, OrderTypeString } from "./enum";
import LoadingIndicator from '../../../utilities/loading';
import { FaPencilAlt } from "react-icons/fa";
import { ImportExcelImei } from "./import-imei-by";
import { FaDownload, FaUpload } from "react-icons/fa6";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const ManagementProductItems = ({/*  open, close, productItems, productName */ }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState();
  const [refreshPage, setRefreshPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword'));
  const [currentPage, setCurrentPage] = useState(searchParams.get('currentPage') || 1);

  const { id } = useParams();

  // useEffect(() => {
  //   setProducts(productItems);
  // }, [productItems]);

  const handleRedirectCreateProduct = () => {
    navigate(`/dashboard/create-product`);
  }

  const OrderTable = () => {
    return (
      <>
        <Table className="table-container mt-4 pt-2"
          columns={columns}
          rowKey="ma"
          dataSource={products}
          pagination={false}
          locale={{ emptyText: <Empty description="Không có dữ liệu" /> }}
        />
      </>
    );
  };

  const getProductsItemById = async () => {
    setIsLoading(true);
    await axios
      .get(`http://localhost:8080/api/products/product-items/${id}`)
      .then((response) => {
        setProducts(response.data.data);

        console.log(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getProductsItemById();
  }, []);

  const countPrice = (price, afterDiscount) => {
    return price - afterDiscount;

  }

  const columns = [
    {
      title: "STT",
      align: "center",
      dataIndex: "stt",
      width: "5%",
      render: (text, record, index) => (
        <span style={{ fontWeight: "400" }}>{products.indexOf(record) + 1}</span>
      ),
    },
    {
      title: "Ảnh",
      align: "center",
      key: "ma",
      width: "15%",
      render: (text, item) => (
        <>
          <div style={{ position: "relative" }}>
            <img
              src={
                item && item.image.path
              }
              class=""
              alt=""
              style={{ width: "145px", height: "150px" }}
            />
            {item &&
              item.donGiaSauKhuyenMai &&
              <div
                className="category"
                style={{
                  userSelect: "none",
                  backgroundColor: "#ffcc00",
                  position: "absolute",
                  top: "0px",
                  borderTopLeftRadius: `8px`,
                  fontSize: "12.5px",
                  borderTopRightRadius: `20px`,
                  borderBottomRightRadius: `20px`,
                  fontWeight: "600",
                  padding: "4px 8px", // Add padding for better visibility
                  // width: "auto",
                  // height: "30px"
                  marginLeft: "10px",
                  // marginTop: "25px",
                }}
              >
                Giảm{' '}
                {countPrice(item.donGia, item.donGiaSauKhuyenMai).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })
                }
              </div>
            }
          </div>
        </>
      ),
    },
    {
      title: "Mã Sản Phẩm",
      align: "center",
      key: "ma",
      width: "15%",
      dataIndex: "ma",
      render: (text, record) => (
        <span style={{ fontWeight: "400" }}>{"SP00000" + products.indexOf(record) + 1}</span>
      ),
    },
    {
      title: "Tên Sản Phẩm",
      align: "center",
      key: "tenSanPham",
      width: "15%",
      dataIndex: "tenSanPham",
      render: (text, record) => (
        <span style={{ fontWeight: "400" }}>{record.sanPham.tenSanPham + " " + record.ram.dungLuong + "/" +
          record.rom.dungLuong + "GB"}</span>
      ),
    },
    {
      title: "Màu Sắc",
      align: "center",
      width: "11%",
      render: (text, record) => (
        <span style={{ fontWeight: "400" }}>{record.mauSac.tenMauSac}</span>
      ),
    },
    {
      title: "Đơn Giá",
      align: "center",
      width: "11%",
      render: (text, record) => (
        <span className="txt-price" style={{ fontWeight: "400" }}>{
          record.donGia && record.donGia.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </span>
      ),
    },
    {
      title: "Số Lượng Tồn",
      align: "center",
      width: "11%",
      render: (text, record) => (
        <Tooltip title="Danh sách IMEI" TransitionComponent={Zoom}>
          <div style={{ cursor: "pointer" }}>
            <span style={{ fontWeight: "400" }} className="underline-blue">
              {record.soLuongTonKho}
            </span>
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Thao Tác",
      align: "center",
      width: "15%",
      dataIndex: "ma",
      render: (text, record) => (
        <>
          <div className="button-container">
            <Tooltip title="Cập nhật" TransitionComponent={Zoom}>
              <IconButton size="">
                <FaPencilAlt color="#2f80ed" />
              </IconButton>
            </Tooltip>
          </div>
        </>
      ),
    },
  ];
  return (
    <>
      <div className="mt-4" style={{ backgroundColor: "#ffffff", boxShadow: "0 0.1rem 0.3rem #00000010" }}>
        <Card className="">
          <Card.Header className="d-flex justify-content-between">
            <div className="header-title mt-2">
              <TextField
                label="Tìm Sản Phẩm Chi Tiết"
                // onChange={handleGetValueFromInputTextField}
                // value={keyword}
                InputLabelProps={{
                  sx: {
                    marginTop: "",
                    textTransform: "capitalize",
                  },
                }}
                inputProps={{
                  style: {
                    height: "23px",
                    width: "350px",
                  },
                }}
                size="small"
                className=""
              />
              <Button
                // onClick={handleRefreshData}
                className="rounded-2 ms-2"
                type="warning"
                style={{ width: "100px", fontSize: "15px" }}
              >
                <span
                  className="text-dark"
                  style={{ fontWeight: "500", marginBottom: "2px" }}
                >
                  Làm Mới
                </span>
              </Button>
            </div>
            <div className="mt-2">
              <Button
                // onClick={handleUploadClick}
                className="rounded-2 button-mui me-2"
                type="primary"
                style={{ height: "40px", width: "auto", fontSize: "15px" }}
              >
                <FaUpload
                  className="ms-1"
                  style={{
                    position: "absolute",
                    bottom: "13.5px",
                    left: "10px",
                  }}
                />
                <span
                  className=""
                  style={{ marginBottom: "2px", fontWeight: "500", marginLeft: "21px" }}
                >
                  Import IMEI
                </span>
              </Button>
              <Button
                // onClick={handleUploadClick}
                className="rounded-2 button-mui me-2"
                type="primary"
                style={{ height: "40px", width: "auto", fontSize: "15px" }}
              >
                <FaDownload
                  className="ms-1"
                  style={{
                    position: "absolute",
                    bottom: "13.5px",
                    left: "10px",
                  }}
                />
                <span
                  className=""
                  style={{ marginBottom: "2px", fontWeight: "500", marginLeft: "21px" }}
                >
                  Export Excel
                </span>
              </Button>
              <Button
                // onClick={handleUploadClick}
                className="rounded-2 button-mui me-2"
                type="primary"
                style={{ height: "40px", width: "auto", fontSize: "15px" }}
              >
                <FaDownload
                  className="ms-1"
                  style={{
                    position: "absolute",
                    bottom: "13.5px",
                    left: "10px",
                  }}
                />
                <span
                  className=""
                  style={{ marginBottom: "2px", fontWeight: "500", marginLeft: "21px" }}
                >
                  Tải Mẫu
                </span>
              </Button>
            </div>
          </Card.Header>
          <div className="d-flex mt-4 pt-1 mx-auto">
            <div
              className="d-flex"
              style={{
                height: "40px",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <div
                // onClick={handleOpenSelect1}
                className=""
                style={{ marginTop: "8px" }}
              >
                <span
                  className="ms-2 ps-1"
                  style={{ fontSize: "15px", fontWeight: "450" }}
                >
                  Danh Mục:{" "}
                </span>
              </div>
              <FormControl
                sx={{
                  minWidth: 50,
                }}
                size="small"
              >
                <Select
                  MenuProps={{
                    PaperProps: {
                      style: {
                        borderRadius: "7px",
                      },
                    },
                  }}
                  IconComponent={KeyboardArrowDownOutlinedIcon}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none !important",
                    },
                    "& .MuiSelect-select": {
                      color: "#2f80ed",
                      fontWeight: "500",
                    },
                  }}
                  // open={openSelect1}
                  // onClose={handleCloseSelect1}
                  // onOpen={handleOpenSelect1}
                  defaultValue={14}
                >
                  <MenuItem className="" value={14}>
                    Tất cả
                  </MenuItem>
                  <MenuItem value={15}>Khách hàng mới</MenuItem>
                  <MenuItem value={20}>Khách hàng cũ</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div
              className="d-flex ms-3"
              style={{
                height: "40px",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <div
                // onClick={handleOpenSelect1}
                className=""
                style={{ marginTop: "8px" }}
              >
                <span
                  className="ms-2 ps-1"
                  style={{ fontSize: "15px", fontWeight: "450" }}
                >
                  Hãng:{" "}
                </span>
              </div>
              <FormControl
                sx={{
                  minWidth: 50,
                }}
                size="small"
              >
                <Select
                  MenuProps={{
                    PaperProps: {
                      style: {
                        borderRadius: "7px",
                      },
                    },
                  }}
                  IconComponent={KeyboardArrowDownOutlinedIcon}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none !important",
                    },
                    "& .MuiSelect-select": {
                      color: "#2f80ed",
                      fontWeight: "500",
                    },
                  }}
                  // open={openSelect1}
                  // onClose={handleCloseSelect1}
                  // onOpen={handleOpenSelect1}
                  defaultValue={14}
                >
                  <MenuItem className="" value={14}>
                    Tất cả
                  </MenuItem>
                  <MenuItem value={15}>Khách hàng mới</MenuItem>
                  <MenuItem value={20}>Khách hàng cũ</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div
              className="d-flex ms-3"
              style={{
                height: "40px",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <div
                // onClick={handleOpenSelect1}
                className=""
                style={{ marginTop: "8px" }}
              >
                <span
                  className="ms-2 ps-1"
                  style={{ fontSize: "15px", fontWeight: "450" }}
                >
                  Hệ Điều Hành:{" "}
                </span>
              </div>
              <FormControl
                sx={{
                  minWidth: 50,
                }}
                size="small"
              >
                <Select
                  MenuProps={{
                    PaperProps: {
                      style: {
                        borderRadius: "7px",
                      },
                    },
                  }}
                  IconComponent={KeyboardArrowDownOutlinedIcon}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none !important",
                    },
                    "& .MuiSelect-select": {
                      color: "#2f80ed",
                      fontWeight: "500",
                    },
                  }}
                  // open={openSelect1}
                  // onClose={handleCloseSelect1}
                  // onOpen={handleOpenSelect1}
                  defaultValue={14}
                >
                  <MenuItem className="" value={14}>
                    Tất cả
                  </MenuItem>
                  <MenuItem value={15}>Khách hàng mới</MenuItem>
                  <MenuItem value={20}>Khách hàng cũ</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div
              className="d-flex ms-3"
              style={{
                height: "40px",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <div
                // onClick={handleOpenSelect1}
                className=""
                style={{ marginTop: "8px" }}
              >
                <span
                  className="ms-2 ps-1"
                  style={{ fontSize: "15px", fontWeight: "450" }}
                >
                  CPU:{""}
                </span>
              </div>
              <FormControl
                sx={{
                  minWidth: 50,
                }}
                size="small"
              >
                <Select
                  MenuProps={{
                    PaperProps: {
                      style: {
                        borderRadius: "7px",
                      },
                    },
                  }}
                  IconComponent={KeyboardArrowDownOutlinedIcon}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none !important",
                    },
                    "& .MuiSelect-select": {
                      color: "#2f80ed",
                      fontWeight: "500",
                    },
                  }}
                  // open={openSelect1}
                  // onClose={handleCloseSelect1}
                  // onOpen={handleOpenSelect1}
                  defaultValue={14}
                >
                  <MenuItem className="" value={14}>
                    Tất cả
                  </MenuItem>
                  <MenuItem value={15}>Khách hàng mới</MenuItem>
                  <MenuItem value={20}>Khách hàng cũ</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div
              className="d-flex ms-3"
              style={{
                height: "40px",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <div
                // onClick={handleOpenSelect1}
                className=""
                style={{ marginTop: "8px" }}
              >
                <span
                  className="ms-2 ps-1"
                  style={{ fontSize: "15px", fontWeight: "450" }}
                >
                  Màn Hình:{""}
                </span>
              </div>
              <FormControl
                sx={{
                  minWidth: 50,
                }}
                size="small"
              >
                <Select
                  MenuProps={{
                    PaperProps: {
                      style: {
                        borderRadius: "7px",
                      },
                    },
                  }}
                  IconComponent={KeyboardArrowDownOutlinedIcon}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none !important",
                    },
                    "& .MuiSelect-select": {
                      color: "#2f80ed",
                      fontWeight: "500",
                    },
                  }}
                  // open={openSelect1}
                  // onClose={handleCloseSelect1}
                  // onOpen={handleOpenSelect1}
                  defaultValue={14}
                >
                  <MenuItem className="" value={14}>
                    Tất cả
                  </MenuItem>
                  <MenuItem value={15}>Khách hàng mới</MenuItem>
                  <MenuItem value={20}>Khách hàng cũ</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="d-flex mt-3 mx-auto">
            <div
              className="d-flex ms-3"
              style={{
                height: "40px",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <div
                // onClick={handleOpenSelect1}
                className=""
                style={{ marginTop: "8px" }}
              >
                <span
                  className="ms-2 ps-1"
                  style={{ fontSize: "15px", fontWeight: "450" }}
                >
                  Trạng Thái:{""}
                </span>
              </div>
              <FormControl
                sx={{
                  minWidth: 50,
                }}
                size="small"
              >
                <Select
                  MenuProps={{
                    PaperProps: {
                      style: {
                        borderRadius: "7px",
                      },
                    },
                  }}
                  IconComponent={KeyboardArrowDownOutlinedIcon}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none !important",
                    },
                    "& .MuiSelect-select": {
                      color: "#2f80ed",
                      fontWeight: "500",
                    },
                  }}
                  // open={openSelect1}
                  // onClose={handleCloseSelect1}
                  // onOpen={handleOpenSelect1}
                  defaultValue={14}
                >
                  <MenuItem className="" value={14}>
                    Tất cả
                  </MenuItem>
                  <MenuItem value={15}>Khách hàng mới</MenuItem>
                  <MenuItem value={20}>Khách hàng cũ</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div
              className="d-flex ms-3"
              style={{
                height: "40px",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <div
                // onClick={handleOpenSelect1}
                className=""
                style={{ marginTop: "8px" }}
              >
                <span
                  className="ms-2 ps-1"
                  style={{ fontSize: "15px", fontWeight: "450" }}
                >
                  Sắp Xếp:{""}
                </span>
              </div>
              <FormControl
                sx={{
                  minWidth: 50,
                }}
                size="small"
              >
                <Select
                  MenuProps={{
                    PaperProps: {
                      style: {
                        borderRadius: "7px",
                      },
                    },
                  }}
                  IconComponent={KeyboardArrowDownOutlinedIcon}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none !important",
                    },
                    "& .MuiSelect-select": {
                      color: "#2f80ed",
                      fontWeight: "500",
                    },
                  }}
                  // open={openSelect1}
                  // onClose={handleCloseSelect1}
                  // onOpen={handleOpenSelect1}
                  defaultValue={14}
                >
                  <MenuItem className="" value={14}>
                    Tất cả
                  </MenuItem>
                  <MenuItem value={15}>Khách hàng mới</MenuItem>
                  <MenuItem value={20}>Khách hàng cũ</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div
              className="d-flex ms-3"
              style={{
                height: "40px",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <div
                // onClick={handleOpenSelect1}
                className=""
                style={{ marginTop: "8px" }}
              >
                <span
                  className="ms-2 ps-1"
                  style={{ fontSize: "15px", fontWeight: "450" }}
                >
                  Hiển Thị:{""}
                </span>
              </div>
              <FormControl
                sx={{
                  minWidth: 50,
                }}
                size="small"
              >
                <Select
                  MenuProps={{
                    PaperProps: {
                      style: {
                        borderRadius: "7px",
                      },
                    },
                  }}
                  IconComponent={KeyboardArrowDownOutlinedIcon}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none !important",
                    },
                    "& .MuiSelect-select": {
                      color: "#2f80ed",
                      fontWeight: "500",
                    },
                  }}
                  // open={openSelect1}
                  // onClose={handleCloseSelect1}
                  // onOpen={handleOpenSelect1}
                  defaultValue={14}
                >
                  <MenuItem className="" value={14}>
                    Tất cả
                  </MenuItem>
                  <MenuItem value={15}>Khách hàng mới</MenuItem>
                  <MenuItem value={20}>Khách hàng cũ</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <Card.Body>
            <OrderTable />
          </Card.Body>
          <div className='mx-auto'>
            <Pagination color="primary" /* page={parseInt(currentPage)} key={refreshPage} count={totalPages} */
            // onChange={handlePageChange} 
            />
          </div>
          <div className="mt-4"></div>
        </Card>
      </div>
      {isLoading && <LoadingIndicator />}
    </>
  )

}
export default ManagementProductItems;
