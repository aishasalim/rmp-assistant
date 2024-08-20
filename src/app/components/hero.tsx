import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface HeroProps {
  handleAskAI: () => void;
}

const Hero: React.FC<HeroProps> = ({ handleAskAI }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="flex-start"
      padding="60px"
      bgcolor="white"
    >
      <Typography
        variant="h4"
        gutterBottom
        width={"450px"}
        sx={{ fontWeight: "bold", color: "#1e3557", fontFamily: "'Nunito', sans-serif" }}
      >
        Welcome to Rate My Professor AI
      </Typography>

      <Typography
        variant="body1"
        marginBottom="30px"
        sx={{ color: "#1e3557", fontFamily: "'Nunito', sans-serif" }}
      >
        Your AI Companion for Choosing College Classes
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAskAI}
        sx={{
          marginTop: 3,
          borderRadius: "10px",
          paddingY: 1.5,
          textTransform: "none",
          fontFamily: "'Nunito', sans-serif",
          bgcolor: "#1e3557",
          boxShadow: "none",
          width: "150px",
          "&:hover": {
            bgcolor: "#0F172A",
            boxShadow: "none",
          },
        }}
        endIcon={<ArrowForwardIcon />}
      >
        Ask Our AI
      </Button>
    </Box>
  );
};

export default Hero;
