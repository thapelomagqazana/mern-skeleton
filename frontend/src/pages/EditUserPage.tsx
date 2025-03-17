import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { getUserById, updateUser } from "../utils/userService";
import UserForm from "../components/edit_profile/UserForm";
import Loader from "../components/Loader";
import SnackbarAlert from "../components/SnackbarAlert";

const EditUserPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "user",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!userId) {
      setSnackbar({
          message: "Invalid user ID.",
          severity: "error",
      });
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await getUserById(userId);
        setUserData({
          name: response.name,
          email: response.email,
          role: response.role || "user",
        });
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        setSnackbar({
          message: error.response?.data?.message || "Failed to load user.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleUpdate = async (updatedData: typeof userData) => {
    setSnackbar(null);
    try {
      await updateUser(userId!, updatedData);
      setSnackbar({ message: "Account updated successfully!", severity: "success" });
      setTimeout(() => navigate(`/profile/${userId}`), 2000);
    } catch (err) {
        const error = err as AxiosError<{ detail: string }>;
        setSnackbar({
          message: error.response?.data?.detail || "Failed to update user. Please try again.",
          severity: "error",
        });
      }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Edit User</h2>
      <UserForm initialData={userData} onSubmit={handleUpdate} />
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

export default EditUserPage;
