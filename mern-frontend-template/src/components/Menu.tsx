/**
 * Navigation menu component.
 *
 * - Provides links to different pages.
 * - Uses Material-UI for styling.
 */

import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";

const Menu: React.FC = () => {
    return (
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              MERN Skeleton
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              Sign Up
            </Button>
            <Button color="inherit" component={Link} to="/signin">
              Sign In
            </Button>
          </Toolbar>
        </AppBar>
    );
};

export default Menu;
