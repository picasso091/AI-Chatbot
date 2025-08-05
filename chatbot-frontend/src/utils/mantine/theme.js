import { Container, createTheme, rem } from "@mantine/core";

const CONTAINER_SIZES = {
  xxs: rem(300),
  xs: rem(400),
  sm: rem(500),
  md: rem(600),
  lg: rem(700),
  xl: rem(800),
  xl2: rem(900),
  xl3: rem(1000),
  xl4: rem(1100),
};

export const theme = createTheme({
  colors: {
    primary: [
      "#EBF5EF",
      "#C3E1D0",
      "#AED8C1",
      "#85C4A2",
      "#58b085",
      "#109c68",
      "#0C8759",
      "#09734B",
      "#065F3E",
      "#044C30",
    ],

    secondary: [
      "#EDF2FF",
      "#DBE4FF",
      "#BAC8FF",
      "#91A7FF",
      "#748FFC",
      "#5C7CFA",
      "#4C6EF5",
      "#4263EB",
      "#3B5BDB",
      "#364FC7",
    ],
  },
  primaryColor: "primary",
  fontFamily: '"Inter", sans-serif',

  components: {
    Container: Container.extend({
      vars: (_, { size, fluid }) => ({
        root: {
          "--container-size": fluid
            ? "100%"
            : size !== undefined && size in CONTAINER_SIZES
            ? CONTAINER_SIZES[size]
            : rem(size),
        },
      }),
    }),
  },
});
