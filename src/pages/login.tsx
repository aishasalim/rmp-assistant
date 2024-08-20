import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase.js";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Hero from "../app/components/hero";
import AuthForm from "../app/components/loginform";
import Image from 'next/image';

import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(false);

  const handleSubmit = async () => {
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Redirect to /chatbot after successful login/sign-up
      router.push("/");
      setError("");
    } catch (err) {
      console.error("Firebase Error:", err.message); // Log the specific error message
      setError(err.message); // Show the detailed error to help debugging
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (err) {
      console.error("Google Sign-In Error:", err.message);
      setError(err.message);
    }
  };


  const handleAskAI = () => {
    setIsSignIn(true);
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  if (isSmallScreen) {
    // If the screen width is medium or less, only display the AuthForm
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="80vh"
        sx={{
          backgroundColor: "white",
          padding: "20px",
        }}
      >
        <AuthForm
          isSmallScreen={isSmallScreen}
          isSignIn={isSignIn}
          isSignUp={isSignUp}
          email={email}
          password={password}
          error={error}
          setEmail={setEmail}
          setPassword={setPassword}
          setIsSignUp={setIsSignUp}
          handleSubmit={handleSubmit}
          handleGoogleSignIn={handleGoogleSignIn}
        />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      position="relative"
      height="90vh"
      overflow="hidden"
    >
      {/* Hero and Image Component */}
      <Box
        width="100%"
        position="absolute"
        left={isSignIn ? "-100%" : "0"} // Slide Hero out to the left
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          transition: "left 0.5s ease-in-out",
          mt: 15,
        }}
      >
        <Hero handleAskAI={handleAskAI} />
        <Image
          src="/image-logo.png"
          alt="Chatbot photo"
          width={500}
          height={300}
          style={{
            borderRadius: '8px',
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </Box>

      {/* Image and auth Component */}
      <Box
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          position: "absolute",
          left: isSignIn ? "0" : "100%", // Move image to the left when Hero is out
          transition: "left 0.5s ease-in-out",
          mt: 15,
        }}
      >
        <Image
          src="/image-logo.png"
          alt="Chatbot photo"
          width={500}
          height={300}
          style={{
            borderRadius: '8px',
            maxWidth: '100%',
            height: 'auto',
          }}
        />
         <AuthForm
          isSmallScreen={isSmallScreen}
          isSignIn={isSignIn}
          isSignUp={isSignUp}
          email={email}
          password={password}
          error={error}
          setEmail={setEmail}
          setPassword={setPassword}
          setIsSignUp={setIsSignUp}
          handleSubmit={handleSubmit}
          handleGoogleSignIn={handleGoogleSignIn}
        />
      </Box>
    </Box>
  );
};

export default Login;
