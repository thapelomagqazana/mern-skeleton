/**
 * @file DashboardPage.tsx
 * @description Basic user dashboard/home page.
 * - Greets the logged-in user.
 * - Displays navigation links for profile, users list, and logout.
 * - Uses Material-UI for styling.
 */

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Avatar,
} from "@mui/material";

/**
 * Renders the user dashboard with navigation options.
 */
const DashboardPage: React.FC = () => {
  const { logout } = useAuth(); // Get user info and logout function

  const userId = localStorage.getItem("userId") || "";

  // Fetch user profile details dynamically
  const { data: user } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchCurrentUser(userId as string), // Safe type assertion
    enabled: Boolean(userId), // Prevent API call if userId is missing
  });

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 6, textAlign: "center" }}>
        {/* Greeting */}
        <Avatar sx={{ width: 80, height: 80, margin: "auto", bgcolor: "primary.main" }}>
          {user?.name?.charAt(0).toUpperCase() || "?"}
        </Avatar>

        <Typography variant="h4" sx={{ marginTop: 2 }}>
          Welcome, {user?.name || "Guest"}!
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ marginTop: 1 }}>
          {user?.email || "No email available"}
        </Typography>

        {/* Navigation Links */}
        <Box display="flex" justifyContent="center" gap={2} mt={3}>
          <Button variant="contained" color="primary" component={Link} to={`/profile/${user?._id}`}>
            View Profile
          </Button>
          <Button variant="contained" color="secondary" component={Link} to="/users">
            Users List
          </Button>
          <Button variant="contained" color="error" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default DashboardPage;
