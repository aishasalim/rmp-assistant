import React from 'react';
import { Box, Typography, Collapse } from '@mui/material';

interface IntroMessageProps {
  introVisible: boolean;
}

const IntroMessage: React.FC<IntroMessageProps> = ({ introVisible }) => {
  return (
    <Collapse in={introVisible} timeout={600}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
        maxWidth="520px"
        width="100%"
        textAlign="center"
        sx={{
          marginBottom: 10,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            marginTop: 3,
            marginBottom: 1,
            fontFamily: "'Nunito', sans-serif",
            lineHeight: "40px",
            color: "#1e3557",
          }}
        >
          Hi there!
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: 0.5,
            fontFamily: "'Nunito', sans-serif",
            color: "#1e3557",
          }}
        >
          Can I help you with anything?
        </Typography>
        <Typography
          sx={{
            marginBottom: 1,
            fontFamily: "'Nunito', sans-serif",
            fontSize: "14px",
            color: "#1e3557",
          }}
        >
          Ready to assist you with choosing your professor.
          Let us get started!
        </Typography>
      </Box>
    </Collapse>
  );
};

export default IntroMessage;
