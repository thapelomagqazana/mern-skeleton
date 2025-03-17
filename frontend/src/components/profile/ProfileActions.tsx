import { useState } from "react";
import { AxiosError } from "axios";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../utils/userService";
import { useAuth } from "../../context/AuthContext";
import SnackbarAlert from "../SnackbarAlert";

interface ProfileActionsProps {
  userId: string;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ userId }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: "success" | "error" } | null>(null);
  const { unAuthUser } = useAuth();

  // Open confirmation modal
  const handleOpen = () => setOpen(true);
  
  // Close modal
  const handleClose = () => setOpen(false);

  // Handle account deletion
  const handleDelete = async () => {
    try {
      await deleteUser(userId);
      unAuthUser();
      setSnackbar({ message: "Account deleted successfully.", severity: "success" });
      navigate("/"); // Redirect to home or sign-up page after deletion
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setSnackbar({
        message: error.response?.data?.message || "Failed to delete account.",
        severity: "error",
      });
    } 
    setOpen(false);
  };

  return (
    <div className="mt-6 flex justify-end gap-4">
      {/* Edit Profile Button */}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => navigate(`/profile/edit/${userId}`)}
      >
        Edit Profile
      </Button>

      {/* Back to Dashboard Button */}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </Button>

      {/* Delete Account Button */}
      <Button
        variant="contained"
        color="error"
        onClick={handleOpen}
      >
        Delete Account
      </Button>

      {/* Confirmation Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete your account? This action is irreversible.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
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

export default ProfileActions;
