import { initializeApp } from "firebase/app";
import {getAuth,createUserWithEmailAndPassword,sendEmailVerification,sendPasswordResetEmail,signInWithEmailAndPassword} from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {getFirestore,doc,getDocs,getDoc,where,query,collection,serverTimestamp,updateDoc} from "firebase/firestore";
import axios from "axios";
import toast from "react-hot-toast";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

// ** Firebase başlat **
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider_google = new GoogleAuthProvider();
const db = getFirestore(app);

export const register = async (name,surname,email,password,birthdate,navigate) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    //await sendEmailVerification(user);
    //toast.success("Verification email sent! Please check your inbox.");

    const checkEmailVerification = setInterval(async () => {
      await user.reload();
      if (true) {
        //user.emailVerified
        clearInterval(checkEmailVerification);
        toast.success("Email Confirmed");

        const newUser = {
          uid: user.uid,
          name,
          surname,
          birthdate,
          email: user.email,
        };

        await axios.post("http://localhost:5050/api/create-user", newUser);

        navigate("/login");
      }
    }, 3000);

    return user;
  } catch (error) {
    toast.error(error.message);
    console.error("Error:", error.message);
    return null;
  }
};

export const signInWithGoogle = async (navigate) => {
  try {
    const result = await signInWithPopup(auth, provider_google);
    const user = result.user;

    const userName = user.displayName?.split(" ")[0] || "";
    const userSurname = user.displayName?.split(" ")[1] || "";

    // !!! Kullanıcı daha önce giriş yapmış mı diye kontrol edilecek !!!

    const newUser = {
      uid: user.uid,
      name: userName,
      surname: userSurname,
      email: user.email,
    };

    await axios.post("http://localhost:5050/api/create-user", newUser);

    navigate("/statistics");
    return user;
  } catch (error) {
    console.error("Google Auth Error:", error);
    toast.error("An error occurred while signing in with Google.");
    throw error;
  }
};

// ** Login **
export const loginWithMail = async (email, password, navigate) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    toast.success("Login successful!");
    return true;
  } catch (error) {
    console.error("Login error:", error.message);
    toast.error("Invalid email or password");
    return false;
  }
};

// ** Şifre sıfırlama **
export const handleResetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
  } catch (error) {
    console.log("Hata: " + error.message);
  }
};

// ** Nickname Güncelleme **
export const UpdateNickname = async (uid, newValue) => {
  try {
    const userDocRef = doc(db, "Users", uid);
    await updateDoc(userDocRef, {
      nickName: newValue,
    });

    console.log("User name updated in Firestore");
  } catch (error) {
    console.error("Database update failed:", error);
  }
};

export default app;
