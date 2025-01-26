import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8YITqhi8RBnw1sxg7ZMG1qMGr17Dcr7Y",
  authDomain: "fxr-playground.firebaseapp.com",
  projectId: "fxr-playground",
  storageBucket: "fxr-playground.firebasestorage.app",
  messagingSenderId: "583007102430",
  appId: "1:583007102430:web:ccc3ed94990c397183e94f",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
