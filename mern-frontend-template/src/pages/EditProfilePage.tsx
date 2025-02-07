/**
 * @file EditProfilePage.tsx
 * @description Allows users to update their profile.
 * - Fetches user details from `/api/users/:userId`
 * - Uses React Hook Form for validation
 * - Sends a PUT request to update the profile
 */

import React, { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchCurrentUser, updateUser } from "../services/userService";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";

/**
 * Form Validation Schema
 */
const profileSchema = yup.object({
  name: yup.string().required("Name is required").min(3, "Must be at least 3 characters"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

/**
 * Profile Update Form Data Type
 */
interface ProfileFormInputs {
  name: string;
  email: string;
}

const EditProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>(); // Get userId from the URL
  const navigate = useNavigate();

  // Fetch current user data
  const { data: userDetails, isLoading, isError } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchCurrentUser(userId as string),
    enabled: Boolean(userId), // Ensure API is only called if userId exists
  });

  // Mutation for updating user profile
  const mutation = useMutation({
    mutationFn: (updatedData: ProfileFormInputs) => updateUser(userId as string, updatedData),
    onSuccess: () => {
    //   authUser({ user: data }); // Update AuthContext
      setSnackbar({ open: true, message: "Profile updated successfully", severity: "success" });
      setTimeout(() => navigate(`/profile/${userId}`), 2000); // Redirect after success
    },
    onError: () => {
      setSnackbar({ open: true, message: "Failed to update profile", severity: "error" });
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProfileFormInputs>({
    resolver: yupResolver(profileSchema),
    defaultValues: { name: "", email: "" }, // Set initial values
  });

  // Populate form fields when data loads
  useEffect(() => {
    if (userDetails) {
      reset({ name: userDetails.name, email: userDetails.email });
    }
  }, [userDetails, reset]);

  // Snackbar state for success/error messages
  const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom sx={{ marginTop: 4 }}>
        Edit Profile
      </Typography>

      {/* Show loading spinner while fetching data */}
      {isLoading && (
        <Box display="flex" justifyContent="center" sx={{ marginTop: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Show error message if API request fails */}
      {isError && <Alert severity="error">Failed to load profile. Please try again.</Alert>}

      {/* Render form if user data is available */}
      {userDetails && (
        <Card sx={{ marginTop: 4, padding: 3 }}>
          <CardContent>
            <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
              {/* Name Field */}
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Full Name"
                    fullWidth
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />

              {/* Email Field */}
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />

              {/* Submit Button */}
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} disabled={mutation.isPending}>
                {mutation.isPending ? <CircularProgress size={24} /> : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Snackbar for Success/Error Messages */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditProfilePage;
