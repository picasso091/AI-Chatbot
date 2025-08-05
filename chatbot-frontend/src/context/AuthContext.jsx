import { createContext, useState } from "react";

const initialValue = {
  authenticated: false,
  setAuthenticated: () => {},
  userInfo: {},
  setUserInfo: () => {},
  authLoading: true,
  setAuthLoading: () => {},
};

const AuthContext = createContext(initialValue);

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(initialValue.authenticated);
  const [userInfo, setUserInfo] = useState(initialValue.userInfo);
  const [authLoading, setAuthLoading] = useState(initialValue.authLoading);
  return (
    <AuthContext.Provider
      value={{ authenticated, setAuthenticated, userInfo, setUserInfo, authLoading, setAuthLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
