import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ProfileForm } from "./components/profile-form";
import { useProfile } from "@/hooks/use-profile";
import { Loading3D } from "@/components/ui/loading-3d";

export function ProfilePage() {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-8">
        <Loading3D />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and company settings</p>
      </div>

      {/* Main Profile Form */}
      <ProfileForm />
    </div>
  );
}

export default ProfilePage;