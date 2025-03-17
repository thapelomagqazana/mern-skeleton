import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, CircularProgress } from "@mui/material";
import FormInput from "../components/signup_signin/FormInput";
import PasswordInput from "../components/signup_signin/PasswordInput";
import SnackbarAlert from "../components/SnackbarAlert";
import { useAuth } from "../context/AuthContext";

interface FormData {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const SignInPage = () => {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await signIn(data.email, data.password);
      setSnackbar({ message: "Signed in successfully!", severity: "success" });
      reset();
    } catch (err) {
      const error = err as AxiosError<{ detail: string }>;
      setSnackbar({
        message: error.response?.data?.detail || "Sign-in failed.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Redirect after sign-in when user data is loaded
  useEffect(() => {
    if (user) {
      setTimeout(() => navigate(`/profile/${user.id}`), 1500);
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white shadow-md rounded-lg p-8"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

        <FormInput name="email" control={control} label="Email" type="email" />
        <PasswordInput name="password" control={control} label="Password" />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="mt-4"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      {snackbar && (
        <SnackbarAlert
          open={!!snackbar}
          onClose={() => setSnackbar(null)}
          message={snackbar.message}
          severity={snackbar.severity}
        />
      )}
    </div>
  );
};

export default SignInPage;
