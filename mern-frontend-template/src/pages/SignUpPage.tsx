/**
 * Sign-Up Page Component
 *
 * - Allows users to create a new account
 * - Uses React Hook Form for validation
 * - Integrates with the backend API
 */

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/userService";
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

// Form Validation Schema
const signUpSchema = yup.object({
  name: yup.string().required("Name is required").min(3, "Must be at least 3 characters"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must include an uppercase letter")
    .matches(/[a-z]/, "Must include a lowercase letter")
    .matches(/[0-9]/, "Must include a number")
    .matches(/[@$!%*?&]/, "Must include a special character"),
});

// Type for Form Data
interface SignUpFormInputs {
  name: string;
  email: string;
  password: string;
}

const SignUpPage: React.FC = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    resolver: yupResolver(signUpSchema),
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  /**
   * Handles form submission and sends data to the backend API.
   */
  const onSubmit = async (data: SignUpFormInputs) => {
    setLoading(true);
    try {
      const response = await registerUser(data); // Using the abstracted API function
      setSnackbar({ open: true, message: response.message, severity: "success" });
  
      // Reset form and redirect after success
      reset();
      setTimeout(() => navigate("/signin"), 2000);
    } catch (error: unknown) {  // Use 'unknown' instead of 'any'
      if (error instanceof Error && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };  // Proper type assertion
        setSnackbar({ open: true, message: axiosError.response?.data?.message || "Signup failed", severity: "error" });
      } else {
        setSnackbar({ open: true, message: "An unexpected error occurred", severity: "error" });
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <TextField {...field} label="Full Name" fullWidth margin="normal" error={!!errors.name} helperText={errors.name?.message} />}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => <TextField {...field} label="Email" type="email" fullWidth margin="normal" error={!!errors.email} helperText={errors.email?.message} />}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => <TextField {...field} label="Password" type="password" fullWidth margin="normal" error={!!errors.password} helperText={errors.password?.message} />}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>

          <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
            Already have an account? <Link to="/signin">Sign in</Link>
          </Typography>
        </form>
      </Paper>

      {/* Snackbar for Success/Error Messages */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SignUpPage;
