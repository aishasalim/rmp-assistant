
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKYpuYJjFC23BycmUAy7EJSIDMxxHfkac",
  authDomain: "rmp-ai-add98.firebaseapp.com",
  projectId: "rmp-ai-add98",
  storageBucket: "rmp-ai-add98.appspot.com",
  messagingSenderId: "474167751353",
  appId: "1:474167751353:web:658c2a73bafc0afe6be168"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };