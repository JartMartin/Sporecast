import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "./components/profile-form";
import { Bell, CreditCard, Lock, Shield, Store, TrendingUp, LineChart } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { useCommodities } from "@/hooks/use-commodities";
import { Loading3D } from "@/components/ui/loading-3d";
import { StatCard } from "@/features/dashboard/shared/components/stat-card";

export function ProfilePage() {
  const { profile, loading: profileLoading } = useProfile();
  const { userCommodities, loading: commoditiesLoading } = useCommodities();

  if (profileLoading || commoditiesLoading) {
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
        <p className="text-muted-foreground">Manage your account preferences and subscription</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Active Commodities"
          value={userCommodities.length}
          icon={<Store className="h-6 w-6 text-teal-600" />}
        />
        <StatCard 
          title="Portfolio Value"
          value="€99/mo"
          description={`per commodity`}
          icon={<TrendingUp className="h-6 w-6 text-teal-600" />}
        />
        <StatCard 
          title="Next Billing"
          value={new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          icon={<LineChart className="h-6 w-6 text-teal-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 pb-2">
                <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Personal Information</h3>
                  <p className="text-sm text-muted-foreground">Update your personal details</p>
                </div>
              </div>

              <ProfileForm />
            </div>
          </Card>

          {/* Billing Information */}
          <Card>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 pb-2">
                <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Billing Information</h3>
                  <p className="text-sm text-muted-foreground">Manage your subscription and billing</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-neutral-50">
                    <div className="text-sm text-neutral-600">Active Commodities</div>
                    <div className="text-2xl font-semibold mt-1">{userCommodities.length}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-neutral-50">
                    <div className="text-sm text-neutral-600">Monthly Total</div>
                    <div className="text-2xl font-semibold mt-1">€{userCommodities.length * 99}</div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium">Next Billing Date</div>
                  <div className="text-sm text-neutral-600 mt-1">
                    {new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>

                <div className="text-sm text-neutral-600">
                  Your subscription is billed monthly at €99 per commodity. Changes to your portfolio will be reflected in your next billing cycle.
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Side Settings */}
        <div className="space-y-6">
          {/* Notification Preferences */}
          <Card>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Manage your alerts</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Configure Notifications
              </Button>
            </div>
          </Card>

          {/* Security Settings */}
          <Card>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Security</h3>
                  <p className="text-sm text-muted-foreground">Manage your security</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full gap-2">
                  <Lock className="h-4 w-4" />
                  Change Password
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;