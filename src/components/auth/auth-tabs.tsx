import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./login-form";
import { CompanyRegistrationForm } from "./company-registration-form";
import { CompanyJoinForm } from "./company-join-form";
import { Card } from "@/components/ui/card";

interface AuthTabsProps {
  initialTab?: "login" | "register" | "join";
}

export function AuthTabs({ initialTab }: AuthTabsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = initialTab || searchParams.get("tab") === "register" ? "register" : 
                    searchParams.get("tab") === "join" ? "join" : "login";

  useEffect(() => {
    // Clean up the URL after getting the initial tab
    if (searchParams.has('tab')) {
      setSearchParams({});
    }
  }, [setSearchParams, searchParams]);

  return (
    <Card className="w-full max-w-[400px] p-0">
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="login" className="data-[state=active]:bg-teal-50">
            Login
          </TabsTrigger>
          <TabsTrigger value="register" className="data-[state=active]:bg-teal-50">
            New Company
          </TabsTrigger>
          <TabsTrigger value="join" className="data-[state=active]:bg-teal-50">
            Join Company
          </TabsTrigger>
        </TabsList>
        <div className="p-6">
          <TabsContent value="login" className="mt-0 space-y-4">
            <div className="text-center space-y-2">
              <h3 className="font-medium">Welcome back!</h3>
              <p className="text-sm text-muted-foreground">
                Access your portfolio and stay ahead with real-time market insights
              </p>
            </div>
            <LoginForm />
          </TabsContent>
          <TabsContent value="register" className="mt-0 space-y-4">
            <div className="text-center space-y-2">
              <h3 className="font-medium">Register Your Company</h3>
              <p className="text-sm text-muted-foreground">
                Get started with a 5-day free trial for your organization
              </p>
            </div>
            <CompanyRegistrationForm />
          </TabsContent>
          <TabsContent value="join" className="mt-0 space-y-4">
            <div className="text-center space-y-2">
              <h3 className="font-medium">Join Your Company</h3>
              <p className="text-sm text-muted-foreground">
                Enter your company ID and invite code to get started
              </p>
            </div>
            <CompanyJoinForm />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}