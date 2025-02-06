/**
 * @file ViewProfilePage.tsx
 * @description Displays the logged-in user's profile.
 * - Fetches user details from `/api/users/:userId`
 * - Uses React Query for API calls
 * - Displays user information in a Material-UI card
 */

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../services/userService";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Avatar,
  Box,
  Button,
} from "@mui/material";

/**
 * Profile page that dynamically fetches user details.
 */
const ViewProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>(); // Get userId from the URL

  // Fetch user profile details dynamically
  const { data: userDetails, isLoading, isError } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchCurrentUser(userId as string), // Safe type assertion
    enabled: Boolean(userId), // Prevent API call if userId is missing
  });

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom sx={{ marginTop: 4 }}>
        My Profile
      </Typography>

      {/* Show loading spinner while fetching data */}
      {isLoading && (
        <Box display="flex" justifyContent="center" sx={{ marginTop: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Show error message if API request fails */}
      {isError && <Alert severity="error">Failed to load profile. Please try again.</Alert>}

      {/* Render user profile details */}
      {userDetails && (
        <Card sx={{ marginTop: 4, padding: 3 }}>
          <CardContent>
            {/* User Avatar */}
            <Box display="flex" justifyContent="center" mb={2}>
              <Avatar sx={{ width: 80, height: 80 }}>
                {userDetails?.name?.charAt(0)?.toUpperCase() || "?"} {/* Handle missing name */}
              </Avatar>
            </Box>

            {/* User Details */}
            <Typography variant="h6" align="center">
              {userDetails?.name || "N/A"}
            </Typography>
            <Typography variant="body1" color="textSecondary" align="center">
              {userDetails?.email || "No email provided"}
            </Typography>
            <Typography variant="body2" align="center" sx={{ marginTop: 1 }}>
              Role: <strong>{userDetails?.role || "User"}</strong>
            </Typography>

            {/* Edit Profile Button */}
            <Box display="flex" justifyContent="center" mt={3}>         
              <Button variant="contained" color="primary" component={Link} to={`/profile/edit/${userId}`}>
                Edit Profile
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default ViewProfilePage;
