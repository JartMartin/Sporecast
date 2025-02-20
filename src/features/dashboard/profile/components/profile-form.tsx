import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/hooks/use-profile";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User2, Building2, Mail, Briefcase, Hash } from "lucide-react";
import { Card } from "@/components/ui/card";

// Function to format role text
function formatRole(role: string): string {
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function ProfileForm() {
  const { profile, updateProfile } = useProfile();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await updateProfile({
        full_name: formData.full_name.trim(),
      });

      if (error) throw new Error(error);

      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="p-6">
        <div className="flex items-center gap-4 pb-6 border-b">
          <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center">
            <User2 className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <h3 className="font-semibold">Personal Information</h3>
            <p className="text-sm text-muted-foreground">Your account details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={profile?.email || ''}
                  readOnly
                  className="bg-gray-50 pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="fullName"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  disabled={saving}
                  className="pl-9"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role in Company</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="role"
                  value={formatRole(profile?.role || '')}
                  readOnly
                  className="bg-gray-50 pl-9"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="min-w-[120px]"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Company Information */}
      {profile?.company_id && (
        <Card className="p-6">
          <div className="flex items-center gap-4 pb-6 border-b">
            <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold">Company Information</h3>
              <p className="text-sm text-muted-foreground">Company details and access codes</p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {/* Company Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm text-muted-foreground">Company Name</Label>
                <p className="text-lg font-medium mt-1">{profile.company}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Industry</Label>
                <p className="text-lg font-medium mt-1 capitalize">
                  {profile.industry?.replace(/_/g, ' ')}
                </p>
              </div>
            </div>

            {/* Company ID and Invite Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Company ID</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Required for new users to join
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      navigator.clipboard.writeText(profile.company_id);
                      toast({
                        title: "Copied",
                        description: "Company ID copied to clipboard",
                      });
                    }}
                  >
                    <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                      {profile.company_id}
                    </code>
                  </Button>
                </div>
              </div>

              {profile.company_role === 'admin' && (
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Invitation Code</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Share with new team members
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => {
                        const inviteCode = Math.floor(100000 + Math.random() * 900000).toString();
                        navigator.clipboard.writeText(inviteCode);
                        toast({
                          title: "Generated & Copied",
                          description: "New invitation code copied to clipboard",
                        });
                      }}
                    >
                      <Hash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}