import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User2, Mail, Building2 } from "lucide-react";

export function CompanyJoinForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company_id: '',
    invite_code: '',
    user: {
      full_name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });
  const navigate = useNavigate();
  const { joinCompany } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate passwords match
    if (formData.user.password !== formData.user.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.user.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await joinCompany({
        company_id: formData.company_id.trim(),
        invite_code: formData.invite_code.trim(),
        user: {
          full_name: formData.user.full_name.trim(),
          email: formData.user.email.trim(),
          password: formData.user.password
        }
      });

      if (error) throw new Error(error);

      if (data?.user) {
        toast({
          title: "Success",
          description: "You have successfully joined the company. Please check your email to confirm your account.",
        });
        navigate('/dashboard', { replace: true });
      }
    } catch (error: any) {
      console.error('Join error:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {/* Company Information */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyId">Company ID *</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="companyId"
              value={formData.company_id}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                company_id: e.target.value
              }))}
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="inviteCode">Invite Code *</Label>
          <Input
            id="inviteCode"
            value={formData.invite_code}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              invite_code: e.target.value
            }))}
            required
          />
        </div>
      </div>

      {/* User Information */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <div className="relative">
            <User2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="fullName"
              value={formData.user.full_name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                user: { ...prev.user, full_name: e.target.value }
              }))}
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={formData.user.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                user: { ...prev.user, email: e.target.value }
              }))}
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={formData.user.password}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              user: { ...prev.user, password: e.target.value }
            }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.user.confirmPassword}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              user: { ...prev.user, confirmPassword: e.target.value }
            }))}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Joining...
          </>
        ) : (
          'Join Company'
        )}
      </Button>
    </form>
  );
}