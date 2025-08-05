import { showNotification } from "@mantine/notifications";

export const successNotification = ({ title, message }) => {
  showNotification({
    message: message,
    autoClose: 3000,
    color: "green",
    sx: { border: "1px solid #D3F9D8" },
  });
};

export const errorNotification = ({ title, message }) => {
  showNotification({
    message: message,
    autoClose: 3000,
    color: "red",
    sx: { border: "1px solid #FFDEEB" },
  });
};

export const infoNotification = ({ title, message }) => {
  showNotification({
    message: message,
    autoClose: 3000,
    color: "blue",
    sx: { border: "1px solid #D0EBFF" },
  });
};
