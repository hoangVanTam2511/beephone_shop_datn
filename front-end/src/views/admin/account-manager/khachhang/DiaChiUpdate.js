import React, { useState, useEffect } from "react";
import axios from "axios";
import { FormControl, InputLabel, MenuItem, Select, Grid } from "@mui/material";

const host = "https://provinces.open-api.vn/api/";

const AddressFormUpdate = ({
  required,
  submitted,
  onProvinceChange,
  onDistrictChange,
  onWardChange,
  selectedTinhThanhPho,
  selectedQuanHuyen,
  selectedXaPhuong,
  editing,
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

  useEffect(() => {
    if (selectedTinhThanhPho && !editing) {
      const selectedProvinceCode = provinces.find(
        (province) => province.name === selectedTinhThanhPho
      )?.code;
      setSelectedProvince(selectedProvinceCode);
      fetchDistricts(selectedProvinceCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTinhThanhPho, provinces]);

  useEffect(() => {
    if (selectedQuanHuyen) {
      const selectedDistrictCode = districts.find(
        (district) => district.name === selectedQuanHuyen
      )?.code;

      if (selectedDistrictCode) {
        setSelectedDistrict(selectedDistrictCode);
        // Fetch wards based on selected district
        fetchWards(selectedDistrictCode);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQuanHuyen, districts]);

  useEffect(() => {
    if (selectedXaPhuong) {
      const selectedWardCode = wards.find(
        (ward) => ward.name === selectedXaPhuong
      )?.code;
      setSelectedWard(selectedWardCode);
    }
  }, [selectedXaPhuong, wards]);

  const callAPI = async (api) => {
    // if (!selectedProvince) {
    //   setProvinceError(true);
    // }
    if (!selectedDistrict) {
      setDistrictError(true);
    }
    if (!selectedWard) {
      setWardError(true);
    }
    const response = await axios.get(api);
    return response.data;
  };

  const fetchProvinces = () => {
    callAPI(host + "?depth=1")
      .then((data) => {
        setProvinces(data);
        // console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  };

  const fetchDistricts = (provinceCode) => {
    callAPI(host + "p/" + provinceCode + "?depth=2")
      .then((data) => {
        if (data && data.districts) {
          setDistricts(data.districts);
          setSelectedDistrict("");
        }
        // else {
        //   console.error("Error fetching districts: Invalid response format");
        // }
      })
      .catch((error) => {
        console.error("Error fetching districts:", error);
      });
  };

  const fetchWards = (districtCode) => {
    callAPI(host + "d/" + districtCode + "?depth=2")
      .then((data) => {
        setWards(data.wards);
        setSelectedWard("");
      })
      .catch((error) => {
        console.error("Error fetching wards:", error);
      });
  };

  const handleProvinceChange = (event) => {
    setProvinceError(false);
    if (submitted) {
      // Nếu đã ấn nút "Lưu" thì kiểm tra trạng thái select
      if (!event.target.value) {
        setProvinceError(true);
        setSelectedProvince("");
      }
    }
    const selectedValue = event.target.value;
    setSelectedProvince(selectedValue);
    setSelectedDistrict("");
    setSelectedWard("");
    setDistricts([]);
    setWards([]);
    if (selectedValue === "") {
      onProvinceChange("");
    } else {
      fetchDistricts(selectedValue);
      onProvinceChange(selectedValue);
    }
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value.target.value);
    setSelectedWard(""); // Reset selectedWard khi chọn lại quận/huyện mới
    fetchWards(value.target.value);
    setWards([]);
    onDistrictChange(value.target.value);
    setDistrictError(false);
    if (submitted) {
      // Nếu đã ấn nút "Lưu" thì kiểm tra trạng thái select
      if (!value.target.value) {
        setDistrictError(true);
      }
    }
  };

  const handleWardChange = (value) => {
    setSelectedWard(value.target.value);
    onWardChange(value.target.value);
    setWardError(false);
    if (submitted) {
      // Nếu đã ấn nút "Lưu" thì kiểm tra trạng thái select
      if (!value.target.value) {
        setWardError(true);
      }
    }
  };
  useEffect(() => {
    if (selectedProvince) {
      const selectedProvinceName = provinces.find(
        (province) => province.code === selectedProvince
      )?.name;
      onProvinceChange(selectedProvinceName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvince, onProvinceChange]);

  useEffect(() => {
    if (selectedDistrict) {
      const selectedDistrictName = districts.find(
        (district) => district.code === selectedDistrict
      )?.name;
      onDistrictChange(selectedDistrictName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDistrict, onDistrictChange]);

  useEffect(() => {
    if (selectedWard) {
      const selectedWardName = wards.find(
        (ward) => ward.code === selectedWard
      )?.name;
      onWardChange(selectedWardName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWard, onWardChange]);
  return (
    <div>
      <Grid container spacing={3.3}>
        <Grid item xs={4}>
          <FormControl style={{ width: "100%" }}>
            <InputLabel id="demo-simple-select-label">
              Chọn Tỉnh/Thành phố
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Chọn Tỉnh/Thành phố"
              onChange={handleProvinceChange}
              value={selectedProvince}
              size="large"
              className={
                formSubmitted && !selectedProvince ? "error-select" : ""
              }
            >
              {provinces.map((province) => (
                <MenuItem key={province.code} value={province.code}>
                  {province.name}
                </MenuItem>
              ))}
            </Select>
            {/* {required && submitted && provinceError && (
              <p
                style={{
                  color: " #d32f2f",
                  paddingLeft: "15px",
                  fontSize: "12px",
                }}
              >
                Vui lòng chọn
              </p>
            )} */}
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl style={{ width: "100%" }}>
            <InputLabel id="demo-simple-select-label">
              Chọn Quận/Huyện
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Chọn Quận/Huyện"
              onChange={handleDistrictChange}
              value={selectedDistrict}
              size="large"
              error={formSubmitted && !selectedDistrict}
            >
              {districts.map((district) => (
                <MenuItem key={district.code} value={district.code}>
                  {district.name}
                </MenuItem>
              ))}
            </Select>
            {required && submitted && districtError && (
              <p
                style={{
                  color: " #d32f2f",
                  paddingLeft: "15px",
                  fontSize: "12px",
                }}
              >
                Vui lòng chọn
              </p>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl style={{ textAlign: "center", width: "100%" }}>
            <InputLabel id="demo-simple-select-label">
              Chọn Phường/Xã
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Chọn Phường/Xã"
              onChange={handleWardChange}
              value={selectedWard}
              size="large"
              error={formSubmitted && !selectedWard}
            >
              {wards.map((ward) => (
                <MenuItem key={ward.code} value={ward.code}>
                  {ward.name}
                </MenuItem>
              ))}
            </Select>
            {required && submitted && wardError && (
              <p
                style={{
                  color: " #d32f2f",
                  fontSize: "12px",
                  textAlign: "left",
                  paddingLeft: "15px",
                }}
              >
                Vui lòng chọn
              </p>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

export default AddressFormUpdate;
