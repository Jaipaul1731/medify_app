import React, { useState } from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import StateDropdown from "../components/StateDropdown";
import CityDropdown from "../components/CityDropdown";
import HospitalCard from "../components/HospitalCard";
import BookingModal from "../components/BookingModal";
import axios from "axios";

const Home = () => {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const handleSearch = async () => {
    if (!state || !city) return;
    try {
      const res = await axios.get(
        `https://meddata-backend.onrender.com/data?state=${state}&city=${city}`
      );
      setHospitals(res.data);
      setIsSearched(true);
    } catch (err) {
      console.error("Error fetching hospitals:", err);
    }
  };

  return (
    <Box p={4}>
      {/* Dropdowns */}
      <Box id="state" mb={2}>
        <StateDropdown value={state} onChange={setState} />
      </Box>
      <Box id="city" mb={2}>
        <CityDropdown value={city} onChange={setCity} selectedState={state} />
      </Box>
      <Button id="searchBtn" variant="contained" onClick={handleSearch}>
        Search
      </Button>

      {/* Heading */}
      <Box mt={4}>
        {isSearched && state && city ? (
          <Typography variant="h5">
            {hospitals.length} medical centers available in {city.toLowerCase()}
          </Typography>
        ) : (
          <Typography variant="h6" color="textSecondary">
            Please select state and city
          </Typography>
        )}
      </Box>

      {/* Hospital Cards */}
      <Stack spacing={2} mt={2}>
        {hospitals.map((center, index) => (
          <HospitalCard
            key={index}
            name={center["Hospital Name"]}
            city={center.City}
            state={center.State}
            rating={center["Hospital overall rating"]}
            onClick={() => setSelectedHospital(center)}
          />
        ))}
      </Stack>

      {/* Booking Modal */}
      {selectedHospital && (
        <BookingModal
          hospital={selectedHospital}
          onClose={() => setSelectedHospital(null)}
        />
      )}
    </Box>
  );
};

export default Home;
