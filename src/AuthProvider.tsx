import React, {createContext, useState, useEffect, useContext, ReactElement} from "react";
import {jwtDecode, JwtPayload} from "jwt-decode";

// Create Auth Context
const AuthContext = createContext({
  user: null as JwtPayload | null,
  login: (token: string) => {},
  logout: () => {},
  jwt: "" as string,
});

// ToDO!!!!
// Auth Provider Component
export const AuthProvider = ({ children }: { children: ReactElement }) => {
  const [user, setUser] = useState(null as JwtPayload | null);

  // Check JWT validity
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if ((decoded?.exp || 0) * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          localStorage.removeItem("jwt_token"); // Expired Token
          setUser(null);
        }
      } catch (error) {
        console.error("Invalid token", error);
        setUser(null);
      }
    }
  }, []);

  // Login function
  const login = (token: string) => {
    localStorage.setItem("jwt_token", token);
    setUser(jwtDecode(token));
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("jwt_token");
    setUser(null);
  };

  const jwt = localStorage.getItem("jwt_token") || '';

  return (
    <AuthContext.Provider value={{ user, jwt, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Access Auth
export const useAuth = () => useContext(AuthContext);
