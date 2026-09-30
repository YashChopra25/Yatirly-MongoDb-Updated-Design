import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Check, Mail, Pencil, User as UserIcon } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
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
    } catch {
      ToastFn("error", "Error", "Failed to update profile");
    }
  };
  const ChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };
  const initials = `${profile.first_name[0] ?? ""}${profile.last_name[0] ?? ""}`.toUpperCase() || "Y";
  const fields = [
    { name: "first_name", label: "First name", icon: UserIcon, value: profile.first_name, placeholder: "Enter your first name" },
    { name: "last_name", label: "Last name", icon: UserIcon, value: profile.last_name, placeholder: "Enter your last name" },
  ] as const;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Your details personalise the dashboard and are used for account emails."
        actions={
          !isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn-ghost">
              <Pencil className="h-4 w-4" /> Edit profile
            </button>
          )
        }
      />

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        {/* Identity card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel relative overflow-hidden p-6"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-24"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgb(var(--tp) / 0.25), transparent 70%)" }}
          />
          <div className="relative flex flex-col items-center text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-theme-primary font-mono text-2xl font-semibold text-theme-primary-foreground shadow-[0_0_40px_-6px_rgb(var(--tp))]">
              {initials}
            </span>
            <p className="mt-4 text-xl font-semibold capitalize">
              {profile.first_name} {profile.last_name}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{profile.email}</p>
            <span className="chip mt-5">
              <span className="dot" /> Active
            </span>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onSubmit={handleSubmit}
          className="panel space-y-5 p-6"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium">
                  {field.label}
                </label>
                <div className="relative">
                  <field.icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id={field.name}
                    name={field.name}
                    disabled={!isEditing}
                    value={field.value}
                    onChange={ChangeHandler}
                    placeholder={field.placeholder}
                    className="field pl-11 capitalize"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input id="email" type="email" disabled value={profile.email} readOnly className="field pl-11 font-mono text-[13px]" />
            </div>
            <p className="text-xs text-muted-foreground">Email can't be changed.</p>
          </div>

          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end gap-2 border-t border-border pt-5"
            >
              <button type="button" className="btn-ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Check className="h-4 w-4" /> Save changes
              </button>
            </motion.div>
          )}
        </motion.form>
      </div>
    </div>
  );
};

export default Profile;
