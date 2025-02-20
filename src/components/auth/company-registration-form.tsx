import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Building2, User2, Mail } from "lucide-react";

const industries = [
  { value: "agriculture", label: "Agriculture" },
  { value: "food_manufacturing", label: "Food Manufacturing" },
  { value: "food_retail", label: "Food Retail" },
  { value: "food_service", label: "Food Service" },
  { value: "trading", label: "Trading" },
] as const;

const companyRoles = [
  { value: "ceo", label: "CEO / Owner" },
  { value: "head_of_procurement", label: "Head of Procurement" },
  { value: "procurement_manager", label: "Procurement Manager" },
  { value: "procurement_analyst", label: "Procurement Analyst" },
  { value: "other", label: "Other" },
] as const;

type Industry = typeof industries[number]['value'];
type CompanyRole = typeof companyRoles[number]['value'];

export function CompanyRegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company: {
      name: '',
      industry: '',
    },
    admin: {
      full_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      company_role: '' as CompanyRole
    }
  });
  const navigate = useNavigate();
  const { registerCompany } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate passwords match
    if (formData.admin.password !== formData.admin.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.admin.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!formData.admin.company_role) {
      setError("Please select your role in the company.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await registerCompany({
        name: formData.company.name.trim(),
        industry: formData.company.industry,
        admin: {
          full_name: formData.admin.full_name.trim(),
          email: formData.admin.email.trim(),
          password: formData.admin.password,
          company_role: formData.admin.company_role
        }
      });

      if (error) throw new Error(error);

      if (data?.user) {
        toast({
          title: "Success",
          description: "Your company has been registered. Please check your email to confirm your account.",
        });
        navigate('/dashboard', { replace: true });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
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
          <Label htmlFor="companyName">Company Name *</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="companyName"
              value={formData.company.name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                company: { ...prev.company, name: e.target.value }
              }))}
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry *</Label>
          <Select
            value={formData.company.industry}
            onValueChange={(value) => setFormData(prev => ({
              ...prev,
              company: { ...prev.company, industry: value }
            }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry.value} value={industry.value}>
                  {industry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Admin Information */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="adminName">Full Name *</Label>
          <div className="relative">
            <User2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="adminName"
              value={formData.admin.full_name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                admin: { ...prev.admin, full_name: e.target.value }
              }))}
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="adminEmail">Email *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="adminEmail"
              type="email"
              value={formData.admin.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                admin: { ...prev.admin, email: e.target.value }
              }))}
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyRole">Your Role in the Company *</Label>
          <Select
            value={formData.admin.company_role}
            onValueChange={(value: CompanyRole) => setFormData(prev => ({
              ...prev,
              admin: { ...prev.admin, company_role: value }
            }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              {companyRoles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.admin.password}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                admin: { ...prev.admin, password: e.target.value }
              }))}
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.admin.confirmPassword}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                admin: { ...prev.admin, confirmPassword: e.target.value }
              }))}
              required
              minLength={6}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registering...
          </>
        ) : (
          'Register Company'
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By registering, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  );
}