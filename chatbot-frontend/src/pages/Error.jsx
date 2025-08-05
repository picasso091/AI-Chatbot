import { Title, Text, Button, Container, Group, Flex, Card, useMantineTheme } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import Cookie from "universal-cookie";
import { useContext } from "react";

import { successNotification } from "../utils/showNotification";
import { AuthContext } from "../context/AuthContext";
import setAuthToken from "../utils/setAuthToken";

const Error = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { userInfo, setAuthenticated, setUserInfo } = useContext(AuthContext);

  const logoutHandler = () => {
    const cookie = new Cookie();
    cookie.remove("azure-speech-token");
    localStorage.removeItem("chatbotJwt");
    setAuthenticated(false);
    setUserInfo({});
    setAuthToken();
    successNotification({ message: "You have been logged out" });
    navigate("/home", { replace: true });
  };

  return (
    <Container p={0}>
      <Card mt={120} bg={theme.colors.primary[6]} py={60}>
        <Container>
          <Flex>
            <Title style={{ margin: "auto" }} c="white">
              Error!
            </Title>
          </Flex>
          <Text c={theme.colors.gray[2]} size="lg" ta="center" style={{ margin: "auto" }}>
            An error has occurred
          </Text>
          <Flex mt={40} direction="column" align="center">
            <Title order={2} c="white">
              Possible Reasons
            </Title>
            <Text c={theme.colors.gray[2]}>1. Issue with the chatbot backend service</Text>
            <Text c={theme.colors.gray[2]}>2. Issue with Azure Service</Text>
          </Flex>
          <Flex mt={40} direction="column" align="center">
            <Title order={2} c="white">
              Possible Solutions
            </Title>
            <Text c={theme.colors.gray[2]}>1. Logout and login again</Text>
            <Text c={theme.colors.gray[2]}>2. Reload the application</Text>
          </Flex>
          <Group justify="center" mt={50} gap="xl">
            <Button size="md" variant="white" onClick={() => navigate("/home", { replace: true })}>
              Home
            </Button>
            <Button size="md" variant="white" onClick={logoutHandler}>
              Logout
            </Button>
          </Group>
        </Container>
      </Card>
    </Container>
  );
};

export default Error;
