import React from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Select, MenuItem, Button, CircularProgress, FormHelperText, InputLabel, FormControl } from "@mui/material";

// Define validation schema with Yup
const schema = yup.object().shape({
  name: yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  role: yup.string().oneOf(["user", "admin"], "Invalid role").required("Role is required"),
});

// Define form values
interface UserFormValues {
  name: string;
  email: string;
  role: string;
}

// Define props for the component
interface UserFormProps {
  initialData: UserFormValues;
  onSubmit: (data: UserFormValues) => void;
  isLoading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<UserFormValues>({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name Input */}
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Name"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />

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
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />

      {/* Role Dropdown */}
      <FormControl fullWidth error={!!errors.role}>
        <InputLabel>Role</InputLabel>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select {...field} fullWidth>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          )}
        />
        <FormHelperText>{errors.role?.message}</FormHelperText>
      </FormControl>

      {/* Submit Button */}
      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        fullWidth
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : "Save Changes"}
      </Button>
    </form>
  );
};

export default UserForm;
