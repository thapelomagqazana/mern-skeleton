import { useState } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Controller, Control } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface PasswordInputProps {
  name: string;
  control: Control<any>;
  label: string;
}

const PasswordInput = ({ name, control, label }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};

export default PasswordInput;
