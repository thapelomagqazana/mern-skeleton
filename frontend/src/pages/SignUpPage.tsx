import { useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { signUp } from "../utils/userService";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, CircularProgress } from "@mui/material";
import FormInput from "../components/signup_signin/FormInput";
import PasswordInput from "../components/signup_signin/PasswordInput";
import SnackbarAlert from "../components/SnackbarAlert";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const SignUpPage = () => {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await signUp(data.name, data.email, data.password);
      setSnackbar({ message: "Account created successfully!", severity: "success" });
      reset();
      setTimeout(() => navigate("/signin"), 1500);
    } catch (err) {
      const error = err as AxiosError<{ detail: string }>;
      setSnackbar({
        message: error.response?.data?.detail || "Registration failed.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white shadow-md rounded-lg p-8"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <FormInput name="name" control={control} label="Name" />
        <FormInput name="email" control={control} label="Email" type="email" />
        <PasswordInput name="password" control={control} label="Password" />
        <PasswordInput name="confirmPassword" control={control} label="Confirm Password" />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="mt-4"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? "Processing..." : "Sign Up"}
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

export default SignUpPage;
