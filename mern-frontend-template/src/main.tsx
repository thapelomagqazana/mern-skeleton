/**
 * Main entry file of the React application.
 *
 * - Wraps the app with React Router.
 * - Applies the Material-UI theme.
 * - Mounts the application to the DOM.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import App from "./App";
import "./index.css";

// Render the root component
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize styles for better UI consistency */}
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
