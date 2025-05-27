import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Firebase kullanıcısı
  const [userData, setUserData] = useState(null);       // MongoDB'deki kullanıcı bilgisi
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);

      if (user) {
        setCurrentUser(user);

        try {
          // MongoDB'den kullanıcı bilgilerini çek
          const res = await axios.post("http://localhost:5050/api/find-user", {
            uid: user.uid,
          });

          setUserData(res.data); // API'den dönen kullanıcı verisi
        } catch (error) {
          console.error("MongoDB'den kullanıcı verisi alınamadı:", error);
          setUserData(null);
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ currentUser, userData, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
