import { Loader } from "@mantine/core";
import { useContext, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import ChatRoom from "../components/Chat/ChatRoom";
import Login from "./Login";
import PrivateRoute from "../components/common/PrivateRoute";
import Error from "./Error";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";
import setAuthToken from "../utils/setAuthToken";
import { getTokenOrRefresh } from "../utils/azure/azureToken";

const Home = () => {
  const { setUserInfo, setAuthenticated, setAuthLoading, authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (localStorage.chatbotJwt) {
          const token = localStorage.chatbotJwt;
          await getTokenOrRefresh(false);
          const decoded = jwtDecode(token);
          setUserInfo(decoded);
          setAuthenticated(true);
          setAuthLoading(false);
          setAuthToken(token);
        } else {
          setAuthLoading(false);
        }
      } catch (err) {
        setAuthLoading(false);
        navigate("/error");
      }
    };
    checkAuth();
  }, []);

  if (authLoading) {
    return <Loader />;
  } else {
    return (
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/error" element={<Error />}></Route>
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<ChatRoom />}></Route>
        </Route>
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    );
  }
};

export default Home;
