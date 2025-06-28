import {
  MenuItem,
  Select,
  Button,
  InputAdornment,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HospitalCard from "../HospitalCard/HospitalCard"; // ✅ Ensure this path matches your actual folder

export default function SearchHospital() {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({ state: "", city: "" });
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate();
  const [isSearched, setIsSearched] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(
          "https://meddata-backend.onrender.com/states"
        );
        setStates(response.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      setCities([]);
      setFormData((prev) => ({ ...prev, city: "" }));
      try {
        const data = await axios.get(
          `https://meddata-backend.onrender.com/cities/${formData.state}`
        );
        setCities(data.data);
      } catch (error) {
        console.log("Error in fetching city:", error);
      }
    };
    if (formData.state !== "") {
      fetchCities();
    }
  }, [formData.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchHospitals = async () => {
    try {
      const response = await axios.get(
        `https://meddata-backend.onrender.com/data?state=${
          formData.state
        }&city=${formData.city.toUpperCase()}`
      );
      setHospitals(response.data);
      setIsSearched(true);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.state && formData.city) {
      fetchHospitals();
    }
  };

  return (
    <Box>
      {/* 🔍 Search Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          gap: 4,
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Select
          displayEmpty
          id="state"
          name="state"
          value={formData.state}
          onChange={handleChange}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          required
          sx={{ minWidth: 200, width: "100%" }}
        >
          <MenuItem disabled value="">
            State
          </MenuItem>
          {states.map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </Select>

        <Select
          displayEmpty
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          required
          sx={{ minWidth: 200, width: "100%" }}
        >
          <MenuItem disabled value="">
            City
          </MenuItem>
          {cities.map((city) => (
            <MenuItem key={city} value={city}>
              {city}
            </MenuItem>
          ))}
        </Select>

        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={<SearchIcon />}
          sx={{ py: "15px", px: 8, flexShrink: 0 }}
          disableElevation
          id="searchBtn"
        >
          Search
        </Button>
      </Box>

      {/* 🏥 Result Heading */}
      {isSearched && (
        <Typography variant="h5" mt={4}>
          {hospitals.length} medical centers available in{" "}
          {formData.city.toLowerCase()}
        </Typography>
      )}

      {/* 📋 Hospital Cards */}
      <Stack spacing={2} mt={2}>
        {hospitals.map((center, index) => (
          <HospitalCard
            key={index}
            name={center["Hospital Name"]}
            city={center.City}
            state={center.State}
            rating={center["Hospital overall rating"]}
            onClick={() => {
              localStorage.setItem("selectedHospital", JSON.stringify(center));
              navigate("/book-appointment");
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
