import { TextField } from "@mui/material";
import { Controller, Control } from "react-hook-form";

interface FormInputProps {
  name: string;
  control: Control<any>;
  label: string;
  type?: string;
  defaultValue?: string;
}

const FormInput = ({
  name,
  control,
  label,
  type = "text",
  defaultValue = "",
}: FormInputProps) => (
  <Controller
    name={name}
    control={control}
    defaultValue={defaultValue}
    render={({ field, fieldState }) => (
      <TextField
        {...field}
        label={label}
        type={type}
        fullWidth
        margin="normal"
        error={!!fieldState.error}
        helperText={fieldState.error?.message}
      />
    )}
  />
);

export default FormInput;
