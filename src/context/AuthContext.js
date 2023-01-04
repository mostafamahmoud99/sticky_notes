import React, { createContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthContextProvider({ children }) {
  const [loginUser, setLoginUser] = useState(null);
  const navigate = useNavigate();

  function getUserToken() {
    let token = localStorage.getItem("userToken");
    let decode = jwtDecode(token);
    setLoginUser(decode);
  }

  function logOut() {
    setLoginUser(null);
    localStorage.removeItem("userToken");
    navigate("/signin");
  }

  useEffect(()=>{
    if(localStorage.getItem("userToken")){
      getUserToken()
    }
  },[])

  return (
    <AuthContext.Provider value={{ loginUser, getUserToken, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
