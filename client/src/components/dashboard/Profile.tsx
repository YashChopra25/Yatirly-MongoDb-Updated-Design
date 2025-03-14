import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaUser, FaEnvelope } from "react-icons/fa6";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ToastFn from "../Toaster";
import { useAppSelector } from "@/store/auth.store";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";
import { UserProfile } from "@/Types";


const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const [profile, setProfile] = useState<UserProfile>({
    first_name: "",
    last_name: "",
    email: "",
  });
  useEffect(() => {
    if (user) {
      setProfile({
        first_name: user.name.split(" ")[0],
        last_name: user.name
          .split(" ")
          .filter((_, index) => index > 0)
          .join(" "),
        email: user.email,
      });
    }
  }, [user]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Add your API call here to update the profile
      const updateUser = axiosInstance.put("/api/v1/auth/user/update", profile);
      toast.promise(updateUser, {
        loading: "Updating profile",
        success: "Profile updated successfully",
        error: "Failed to update profile",
      });
      setIsEditing(false);
      // ToastFn("success", "Success", "Profile updated successfully");
    } catch (error) {
      ToastFn("error", "Error", "Failed to update profile");
    }
  };
  const ChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold theme-text-gradient">
            Profile Settings
          </h1>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "default" : "outline"}
            className="px-6"
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-theme-primary/60">
              First Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary/40" />
              <Input
                disabled={!isEditing}
                name="first_name"
                value={profile.first_name}
                onChange={ChangeHandler}
                className="pl-10 capitalize"
                placeholder="Enter your First name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-theme-primary/60">
              Last Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary/40" />
              <Input
                disabled={!isEditing}
                name="last_name"
                value={profile.last_name}
                onChange={ChangeHandler}
                className="pl-10 capitalize"
                placeholder="Enter your Last name"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-theme-primary/60">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-primary/40" />
              <Input
                type="email"
                disabled={true}
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="pl-10"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Submit Button - Only show when editing */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end gap-3"
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  // Reset form to original values if needed
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </motion.div>
          )}
        </form>
      </motion.div>

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-blue-500/5 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6"
      >
        <h2 className="text-lg font-semibold text-blue-500 mb-2">Note</h2>
        <p className="text-sm text-blue-500/60">
          Your profile information is used to personalize your experience and
          for account-related communications.
        </p>
      </motion.div>
    </div>
  );
};

export default Profile;
