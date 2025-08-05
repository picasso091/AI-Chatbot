import { TextInput, PasswordInput, Paper, Title, Text, Container, Button } from "@mantine/core";
import { jwtDecode } from "jwt-decode";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../../utils/axiosInstance";
import { errorNotification } from "../../utils/showNotification";
import { AuthContext } from "../../context/AuthContext";
import setAuthToken from "../../utils/setAuthToken";
import { getTokenOrRefresh } from "../../utils/azure/azureToken";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const { setUserInfo, setAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    setLoginLoading(true);
    try {
      e.preventDefault();
      if (username && password) {
        const response = await axiosInstance.post("/user/login", {
          userName: username,
          password,
        });
        const token = response.data.data.accessToken;
        const decoded = jwtDecode(token);
        localStorage.setItem("chatbotJwt", token);
        await getTokenOrRefresh();
        setUserInfo(decoded);
        setAuthenticated(true);
        setAuthToken(token);
        setLoginLoading(false);
        navigate("/home");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Login failed";
      errorNotification({ title: "Error", message: errorMessage });
      setLoginLoading(false);
    }
  };

  return (
    <Container p={0} mt={150}>
      <Title align="center">Javra Chatbot</Title>
      <Text c="dimmed" size="md" align="center" mt={5}>
        Login with your LMS credentials
      </Text>

      <Paper withBorder shadow="md" p={30} mt="lg" style={{ width: "400px", margin: "auto" }}>
        <form onSubmit={loginHandler}>
          <TextInput
            label="Username"
            placeholder="username"
            required
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
          <PasswordInput
            label="Password"
            placeholder="password"
            required
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />

          <Button type="submit" fullWidth mt="xl" loading={loginLoading}>
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
