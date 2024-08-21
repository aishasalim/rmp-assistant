import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from  '../../../utils/firebase.js' 

const Navbar = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login"); 
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "white", boxShadow: "none", paddingTop: "10px" }}>
      <Toolbar sx={{ justifyContent: "space-between", paddingX: "5px"}}>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" component="div" sx={{ color: "#1e3557", fontWeight: 'bold', fontFamily: "'Nunito', sans-serif" }}>
            Rate My Professor AI
          </Typography>
        </Box>
        <Button 
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              borderRadius: '10px',
              paddingY: 1.5,
              width: '150px',
              textTransform: 'none',
              fontFamily: "'Nunito', sans-serif",
              bgcolor: '#1e3557',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#4DA9B6',
                boxShadow: 'none',
              },
            }}
          onClick={handleSignOut} 
        >
          Sign out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;