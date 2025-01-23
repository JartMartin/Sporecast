import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./login-form";
import { SignUpForm } from "./signup-form";
import { Card } from "@/components/ui/card";

interface AuthTabsProps {
  initialTab?: "login" | "signup";
}

export function AuthTabs({ initialTab }: AuthTabsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = initialTab || searchParams.get("tab") === "signup" ? "signup" : "login";

  useEffect(() => {
    // Clean up the URL after getting the initial tab
    if (searchParams.has('tab')) {
      setSearchParams({});
    }
  }, [setSearchParams, searchParams]);

  return (
    <Card className="w-full max-w-[400px] p-0">
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="login" className="data-[state=active]:bg-teal-50">
            Login
          </TabsTrigger>
          <TabsTrigger value="signup" className="data-[state=active]:bg-teal-50">
            Sign up
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
          <TabsContent value="signup" className="mt-0 space-y-4">
            <div className="text-center space-y-2">
              <h3 className="font-medium">Create your account</h3>
              <p className="text-sm text-muted-foreground">
                Get instant access to our full premium service for 14 days
              </p>
            </div>
            <SignUpForm />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}