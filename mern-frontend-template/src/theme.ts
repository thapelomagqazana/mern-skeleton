/**
 * Custom Material-UI Theme
 *
 * - Defines primary, secondary colors
 * - Customizes typography and spacing
 */

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Custom blue
    },
    secondary: {
      main: "#ff4081", // Custom pink
    },
    background: {
      default: "#f4f6f8",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: `"Roboto", "Arial", sans-serif`,
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      color: "#333",
    },
  },
  shape: {
    borderRadius: 8, // Rounded corners
  },
});

export default theme;
