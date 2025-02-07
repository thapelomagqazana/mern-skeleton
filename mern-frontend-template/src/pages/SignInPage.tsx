import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/userService";
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
const signInSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

// Type for Form Data
interface SignInFormInputs {
  email: string;
  password: string;
}

const SignInPage: React.FC = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SignInFormInputs>({
    resolver: yupResolver(signInSchema),
  });

  const navigate = useNavigate();
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  /**
   * Handles form submission and sends data to the backend API.
   */
  const onSubmit = async (data: SignInFormInputs) => {
    setLoading(true);
    try {
      const response = await loginUser(data);
      authUser(response);
       // Store token and user data in Auth Context
      setSnackbar({ open: true, message: "Login successful", severity: "success" });

      // Reset form and redirect after success
      reset();
      setTimeout(() => navigate("/dashboard"), 2000);
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
          Sign In
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
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

          {/* Password Input */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />

          {/* Submit Button */}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Sign In"}
          </Button>

          {/* Sign Up Link */}
          <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
            Don't have an account? <Link to="/signup">Sign up</Link>
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

export default SignInPage;
