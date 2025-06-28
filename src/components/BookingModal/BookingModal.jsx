import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";

const BookingModal = ({ hospital, onClose }) => {
  const handleBook = () => {
    // Booking logic here
    alert("Appointment booked!");
    onClose();
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "white",
        padding: 4,
        borderRadius: 2,
        boxShadow: 3,
        zIndex: 1000,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Book Appointment at {hospital["Hospital Name"]}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleBook}
      >
        Book FREE Center Visit
      </Button>

      <Stack direction="row" spacing={2} mt={3}>
        <Typography variant="body1">Today</Typography>
        <Typography variant="body1">Morning</Typography>
        <Typography variant="body1">Afternoon</Typography>
        <Typography variant="body1">Evening</Typography>
      </Stack>

      <Button onClick={onClose} sx={{ mt: 2 }}>
        Close
      </Button>
    </Box>
  );
};

export default BookingModal;
