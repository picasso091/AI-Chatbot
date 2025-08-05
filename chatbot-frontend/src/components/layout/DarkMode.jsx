import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { TbMoonStars, TbSun } from "react-icons/tb";

const DarkMode = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  return (
    <ActionIcon
      variant="light"
      color={dark ? "yellow" : "primary"}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {dark ? <TbSun size={18} /> : <TbMoonStars size={18} />}
    </ActionIcon>
  );
};

export default DarkMode;
