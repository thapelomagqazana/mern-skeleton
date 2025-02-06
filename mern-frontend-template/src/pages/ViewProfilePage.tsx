/**
 * @file ViewProfilePage.tsx
 * @description Displays the logged-in user's profile.
 * - Fetches user details from `/api/users/:userId`
 * - Uses React Query for API calls
 * - Displays user information in a Material-UI card
 * - Provides an option to delete the account
 */

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchCurrentUser, deleteUser } from "../services/userService";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

/**
 * Profile page that dynamically fetches user details.
 */
const ViewProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>(); // Get userId from the URL
  const { logout } = useAuth(); // ✅ Logout function
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false); // Confirm delete dialog state

  // Fetch user profile details dynamically
  const { data: userDetails, isLoading, isError } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchCurrentUser(userId as string), // Safe type assertion
    enabled: Boolean(userId), // Prevent API call if userId is missing
  });

  // Mutation for deleting user account
  const mutation = useMutation({
    mutationFn: () => deleteUser(userId as string),
    onSuccess: () => {
      logout(); // Log out the user after deletion
      navigate("/signin"); //  Redirect to Sign-in page
    },
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

            {/* Buttons: Edit Profile & Delete Account */}
            <Box display="flex" justifyContent="center" mt={3} gap={2}>         
              <Button variant="contained" color="primary" component={Link} to={`/profile/edit/${userId}`}>
                Edit Profile
              </Button>
              <Button variant="contained" color="error" onClick={() => setOpenDialog(true)}>
                Delete Account
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Confirm Delete Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action is permanent and cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => mutation.mutate()} color="error" disabled={mutation.isPending}>
            {mutation.isPending ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewProfilePage;
