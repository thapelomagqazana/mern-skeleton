import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { getUserById, UserProfile } from "../utils/userService";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileInfo from "../components/profile/ProfileInfo";
import ProfileActions from "../components/profile/ProfileActions";
import SnackbarAlert from "../components/SnackbarAlert";

const ViewProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userId) throw new Error("User ID is missing.");
        const user = await getUserById(userId);
        setProfile(user);
      } catch (err) {
        const error = err as AxiosError<{ detail: string }>;
        setSnackbar({
          message: error.response?.data?.detail || "Failed to load user.",
          severity: "error",
        });
      }
    };
    fetchProfile();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-8">
        <ProfileHeader name={profile?.name || "Loading..."} role={profile?.role || ""} />
        <ProfileInfo email={profile?.email || ""} />
        <ProfileActions userId={userId!} />
      </div>

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

export default ViewProfilePage;
