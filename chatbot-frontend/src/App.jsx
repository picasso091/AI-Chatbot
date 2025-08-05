import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import "./App.css";
import Home from "./pages/Home";
import { AuthProvider } from "./context/AuthContext";
import { theme } from "./utils/mantine/theme";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <MantineProvider theme={theme}>
        <Notifications position="top-center" limit={1} />
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </MantineProvider>
    </AuthProvider>
  );
}

export default App;
