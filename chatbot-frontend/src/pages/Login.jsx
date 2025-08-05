import {
  Card,
  TextInput,
  PasswordInput,
  Button,
  ActionIcon,
  Flex,
  Container,
  Grid,
  Box,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { MdOutlineGTranslate, MdQrCodeScanner, MdOutlinePool, MdCopyAll, MdDataUsage } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../utils/axiosInstance";
import { errorNotification } from "../utils/showNotification";
import { AuthContext } from "../context/AuthContext";
import setAuthToken from "../utils/setAuthToken";
import { getTokenOrRefresh } from "../utils/azure/azureToken";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const { setUserInfo, setAuthenticated } = useContext(AuthContext);
  const theme = useMantineTheme();
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
    <Box style={{ height: "100vh", width: "100vw", background: theme.colors.primary[0] }}>
      <Container
        size={1350}
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box style={{ width: "100%" }}>
          <Flex justify="center" align="center" flex={1} style={{ width: "100%" }}>
            <Card mt={4} radius="xl" shadow="xl" px={30} py={40} style={{ width: "100%" }}>
              <div className="strip strip-0"></div>
              <div className="strip strip-1"></div>
              <div className="strip strip-2"></div>
              <div className="bubble bubble-0"></div>
              <div className="bubble bubble-1"></div>
              <div className="bubble bubble-2"></div>
              <Box p={40}>
                <Grid columns={12}>
                  <Grid.Col span={{ span: 12, md: 7 }}>
                    <Flex justify="center" style={{ height: "100%" }} direction="column" flex={1} gap={40}>
                      <img src="/javra.png" width="230" alt="Javra Software" />
                      <Flex mt={5} mb={4} gap={10}>
                        <ActionIcon variant="outline" size="xl" radius="md">
                          <MdOutlineGTranslate />
                        </ActionIcon>
                        <ActionIcon variant="outline" size="xl" radius="md">
                          <MdDataUsage />
                        </ActionIcon>
                        <ActionIcon variant="outline" size="xl" radius="md">
                          <MdCopyAll />
                        </ActionIcon>
                        <ActionIcon variant="outline" size="xl" radius="md">
                          <MdOutlinePool />
                        </ActionIcon>
                        <ActionIcon variant="outline" size="xl" radius="md">
                          <MdQrCodeScanner />
                        </ActionIcon>
                      </Flex>
                    </Flex>
                  </Grid.Col>
                  <Grid.Col span={{ span: 12, md: 5 }}>
                    <form onSubmit={loginHandler}>
                      <Flex direction="column" gap={20}>
                        <TextInput
                          withAsterisk
                          label="Username"
                          size="md"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.currentTarget.value)}
                        />
                        <PasswordInput
                          withAsterisk
                          label="Password"
                          size="md"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.currentTarget.value)}
                        />

                        <Button py={4} type="submit" size="md" loading={loginLoading}>
                          Log In
                        </Button>
                      </Flex>
                    </form>
                  </Grid.Col>
                </Grid>
              </Box>
            </Card>
          </Flex>
          <Flex justify="center" mt={40}>
            <Text size="sm">Copyright © Javra Software Pvt.Ltd. All Rights Reserved.</Text>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
