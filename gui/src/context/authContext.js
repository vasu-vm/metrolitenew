import axios from "axios";
import { createContext, useEffect, useState } from "react";


export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [selectedCompany, setSelectedCompany] = useState(
    JSON.parse(localStorage.getItem("company")) || null
  );
   const login = async (inputs) => {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}auth/login`, inputs, {
      withCredentials: true, 
      
      
      });
    const updatedInput = { ...inputs };

    // Use the JavaScript `delete` keyword to remove the item
    delete updatedInput.password;

    // Update the state with the modified object
    
    setCurrentUser(res.data)
    setSelectedCompany(updatedInput)
  };

  /* const login = async (inputs) => {
    const res = await api.post('/auth/login', inputs)
    console.log(res.data)
    console.log(res.data)
    setCurrentUser(res.data)
  }; */

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
    localStorage.setItem("company", JSON.stringify(selectedCompany));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser,selectedCompany, login }}>
      {children}
    </AuthContext.Provider>
  );
};
