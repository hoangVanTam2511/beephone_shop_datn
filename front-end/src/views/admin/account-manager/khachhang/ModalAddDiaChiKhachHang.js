import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const host = "https://online-gateway.ghn.vn/shiip/public-api/master-data/";

const ModalAddDiaChiKhachHang = ({
  required,
  submitted,
  onProvinceChange,
  onDistrictChange,
  onWardChange,
  formSubmitted,
}) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [provinceError, setProvinceError] = useState(false);
  const [districtError, setDistrictError] = useState(false);
  const [wardError, setWardError] = useState(false);

  useEffect(() => {
    fetchProvinces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const callAPI = (api) => {
    if (!selectedProvince) {
      setProvinceError(true);
    }
    if (!selectedDistrict) {
      setDistrictError(true);
    }
    if (!selectedWard) {
      setWardError(true);
    }
    return axios
      .get(api, {
        headers: {
          token: "c2f01f86-3164-11ee-af43-6ead57e9219a",
        },
      })
      .then((response) => {
        return response.data;
      });
  };

  const fetchProvinces = () => {
    callAPI(host + "province")
      .then((data) => {
        setProvinces(data.data);
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  };

  const fetchDistricts = (provinceCode) => {
    callAPI(host + "district?province_id=" + provinceCode)
      .then((data) => {
        setDistricts(data.data);
        setSelectedDistrict(""); // Reset selected district when fetching new districts
      })
      .catch((error) => {
        console.error("Error fetching districts:", error);
      });
  };

  const fetchWards = (districtCode) => {
    callAPI(host + "ward?district_id=" + districtCode)
      .then((data) => {
        setWards(data.data);
        setSelectedWard(""); // Reset selected ward when fetching new wards
      })
      .catch((error) => {
        console.error("Error fetching wards:", error);
      });
  };

  const handleProvinceChange = (value) => {
    if (submitted) {
      // Nếu đã ấn nút "Lưu" thì kiểm tra trạng thái select
      if (!value.target.value) {
        setSelectedProvince("");
      }
    }

    setSelectedProvince(value.target.value);
    setSelectedDistrict("");
    setSelectedWard("");
    fetchDistricts(value.target.value);
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value.target.value);
    setSelectedWard("");
    fetchWards(value.target.value);
    onDistrictChange(value.target.value);
    if (submitted) {
      // Nếu đã ấn nút "Lưu" thì kiểm tra trạng thái select
      if (!value.target.value) {
        setSelectedDistrict("");
      }
    }
  };

  const handleWardChange = (value) => {
    setSelectedWard(value.target.value);
    onWardChange(value.target.value);
    if (submitted) {
      // Nếu đã ấn nút "Lưu" thì kiểm tra trạng thái select
      if (!value) {
        setSelectedWard("");
      }
    }
  };

  useEffect(() => {
    if (selectedDistrict && selectedProvince && selectedWard) {
      const selectedProvinceName = provinces.find(
        (province) => province.ProvinceID === selectedProvince
      ).ProvinceName;
      const selectedDistrictName = districts.find(
        (district) => district.DistrictID === selectedDistrict
      ).DistrictName;
      const selectedWardName = wards.find(
        (ward) => ward.WardCode === selectedWard
      ).WardName;
      onProvinceChange(selectedProvinceName);
      onDistrictChange(selectedDistrictName);
      onWardChange(selectedWardName);
    }
  }, [selectedProvince, selectedDistrict, selectedWard]);

  return (
    <>
      <Grid container spacing={3.3}>
        <Grid item xs={4}>
          <TextField
            select
            label="Chọn Tỉnh/Thành phố"
            value={selectedProvince}
            onChange={handleProvinceChange}
            error={formSubmitted && !selectedProvince}
            helperText={
              formSubmitted && !selectedProvince ? "Vui lòng chọn" : ""
            }
            style={{ width: "100%" }}
          >
            {provinces.map((province) => (
              <MenuItem key={province.ProvinceID} value={province.ProvinceID}>
                {province.ProvinceName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <TextField
            select
            label="Chọn Quận/Huyện"
            value={selectedDistrict}
            onChange={handleDistrictChange}
            error={formSubmitted && !selectedDistrict}
            helperText={
              formSubmitted && !selectedDistrict ? "Vui lòng chọn" : ""
            }
            style={{ width: "100%" }}
          >
            {districts.map((district) => (
              <MenuItem key={district.DistrictID} value={district.DistrictID}>
                {district.DistrictName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <TextField
            select
            label="Chọn Phường/Xã"
            value={selectedWard}
            onChange={handleWardChange}
            error={formSubmitted && !selectedWard}
            helperText={formSubmitted && !selectedWard ? "Vui lòng chọn" : ""}
            style={{ width: "100%" }}
          >
            {wards.map((ward) => (
              <MenuItem key={ward.WardCode} value={ward.WardCode}>
                {ward.WardName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </>
  );
};

export default ModalAddDiaChiKhachHang;
