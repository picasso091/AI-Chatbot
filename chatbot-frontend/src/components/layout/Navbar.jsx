import { Paper, Title, Text, UnstyledButton, Flex, Avatar, useMantineTheme, Button } from "@mantine/core";
import { AiOutlineMessage } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useContext } from "react";
import Cookie from "universal-cookie";

import DarkMode from "./DarkMode";
import { AuthContext } from "../../context/AuthContext";
import setAuthToken from "../../utils/setAuthToken";
import { successNotification } from "../../utils/showNotification";

const NavBar = () => {
  const { userInfo, setAuthenticated, setUserInfo } = useContext(AuthContext);
  const theme = useMantineTheme();

  const logoutHandler = () => {
    const cookie = new Cookie();
    cookie.remove("azure-speech-token");
    localStorage.removeItem("chatbotJwt");
    setAuthenticated(false);
    setUserInfo({});
    setAuthToken();
    successNotification({ message: "You have been logged out" });
  };

  return (
    <Paper radius={0} style={{ boxShadow: "0px 2px 0px 0px rgba(173,181,189,.5)" }}>
      <Flex justify="space-between" wrap="nowrap" px="sm" py="lg" align="center">
        <Avatar src={userInfo.profile} radius="xl" />

        <Text component="div" variant="gradient" gradient={{ from: "primary", to: "secondary", deg: 90 }}>
          <Flex align="center" gap={12}>
            <UnstyledButton component={Link} to="/home">
              <Title>Javra Chatbot</Title>
            </UnstyledButton>
            <AiOutlineMessage color={theme.colors.secondary[4]} size={28} />
          </Flex>
        </Text>
        <Flex gap={12} align="center">
          <DarkMode />
          <Button size="xs" onClick={logoutHandler}>
            Logout
          </Button>
        </Flex>
      </Flex>
    </Paper>
  );
};

export default NavBar;
