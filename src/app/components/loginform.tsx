import React from 'react';
import { Box, Typography, TextField, Link, Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

interface AuthFormProps {
  isSmallScreen: boolean;
  isSignIn: boolean;
  isSignUp: boolean;
  email: string;
  password: string;
  error: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setIsSignUp: (isSignUp: boolean) => void;
  handleSubmit: () => void;
  handleGoogleSignIn: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isSmallScreen,
  isSignIn,
  isSignUp,
  email,
  password,
  error,
  setEmail,
  setPassword,
  setIsSignUp,
  handleSubmit,
  handleGoogleSignIn,
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width={isSmallScreen ? '400px' : '500px'} // Adjust width based on isSmallScreen
      height="350px"
      sx={{
        transition: 'transform 0.5s ease',
        transform: isSignIn ? 'translateX(0)' : 'translateX(0)',
        margin: 5 
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
        width="100%"
        padding={isSmallScreen ? '0' : '20px'} 
        bgcolor="white"
        sx={{ boxSizing: 'border-box' }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'black', fontFamily: "'Nunito', sans-serif" }}
        >
          {isSignUp ? 'Create an Account' : 'Welcome back!'}
        </Typography>

        <Typography variant="body2" marginBottom="30px" sx={{ color: 'black', fontFamily: "'Nunito', sans-serif" }}>
          {isSignUp ? 'Already have an account? ' : 'New to Education Bot? '}
          <Link
            onClick={() => setIsSignUp(!isSignUp)}
            color="#1e3557"
            fontWeight="bold"
            style={{ cursor: 'pointer' }}
            sx={{ fontFamily: "'Nunito', sans-serif" }}
          >
            {isSignUp ? 'Sign in.' : 'Create an account.'}
          </Link>
        </Typography>

        {isSignUp && (
          <>
            <Typography
              sx={{
                lineHeight: '0px',
                fontSize: '14px',
                fontWeight: 'bold',
                color: 'black',
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              Name
            </Typography>
            <TextField
              placeholder="Enter your name"
              variant="outlined"
              fullWidth
              margin="normal"
              InputLabelProps={{
                sx: {
                  fontFamily: "'Nunito', sans-serif",
                },
              }}
              InputProps={{
                sx: {
                  fontSize: '14px',
                  borderRadius: '10px',
                  fontFamily: "'Nunito', sans-serif",
                  marginBottom: '20px',
                  '& .MuiInputBase-input': {
                    paddingY: '8px',
                  },
                },
              }}
            />
          </>
        )}

        <Typography
          sx={{
            lineHeight: '0px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'black',
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          Email
        </Typography>
        <TextField
          placeholder="Enter your email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputLabelProps={{
            sx: {
              fontSize: '14px',
              fontFamily: "'Nunito', sans-serif",
            },
          }}
          InputProps={{
            sx: {
              fontSize: '14px',
              borderRadius: '10px',
              fontFamily: "'Nunito', sans-serif",
              marginBottom: '20px',
              '& .MuiInputBase-input': {
                paddingY: '8px',
              },
            },
          }}
        />

        <Typography
          sx={{
            lineHeight: '0px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'black',
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          Password
        </Typography>
        <TextField
          placeholder="Enter your password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{
            sx: {
              fontFamily: "'Nunito', sans-serif",
            },
          }}
          InputProps={{
            sx: {
              fontSize: '14px',
              borderRadius: '10px',
              fontFamily: "'Nunito', sans-serif",
              '& .MuiInputBase-input': {
                paddingY: '8px',
              },
            },
          }}
        />

        {error && (
          <Typography
            color="error"
            sx={{ marginBottom: 2, fontFamily: "'Nunito', sans-serif", fontWeight: 'light' }}
          >
            {error}
          </Typography>
        )}


        <Button
          onClick={handleGoogleSignIn}
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            marginTop: 3,
            borderRadius: '10px',
            paddingY: 1.5,
            textTransform: 'none',
            fontFamily: "'Nunito', sans-serif",
            bgcolor: '#1e3557',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#4DA9B6',
              boxShadow: 'none',
            },
          }}
          startIcon={<GoogleIcon />}
        >
          Sign in with Google
        </Button>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          sx={{
            marginTop: 3,
            borderRadius: '10px',
            paddingY: 1.5,
            textTransform: 'none',
            fontFamily: "'Nunito', sans-serif",
            bgcolor: '#1e3557',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#4DA9B6',
              boxShadow: 'none',
            },
          }}
        >
          {isSignUp ? 'Sign up' : 'Sign in'}
        </Button>
      </Box>
    </Box>
  );
};

export default AuthForm;
