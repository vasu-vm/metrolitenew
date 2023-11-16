import axios from "axios";
import { createContext, useEffect, useState } from "react";
import api from '../api/metstock'

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
   const login = async (inputs) => {
    const res = await axios.post("http://localhost:3002/api/auth/login", inputs, {
      withCredentials: true,
    });

    setCurrentUser(res.data)
  };

  /* const login = async (inputs) => {
    const res = await api.post('/auth/login', inputs)
    console.log(res.data)
    console.log(res.data)
    setCurrentUser(res.data)
  }; */

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};
