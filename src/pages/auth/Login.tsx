import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, User, Building2, Shield, AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { userType } = useParams<{ userType: string }>();
  const navigate = useNavigate();
  const { signIn, resendVerificationEmail } = useAuth();
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);

  const isWorker = userType === "worker";
  const isAdmin = userType === "admin";
  const title = isAdmin ? "Admin Login" : isWorker ? "Worker Login" : "Agency Login";
  const Icon = isAdmin ? Shield : isWorker ? User : Building2;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setNeedsVerification(false);

    const { error, needsVerification: requiresVerification } = await signIn(email, password);

    if (requiresVerification) {
      setNeedsVerification(true);
      setIsLoading(false);
      return;
    }

    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      // Navigate to appropriate dashboard based on user type
      const dashboardPath = isAdmin ? "/dashboard/admin" : isWorker ? "/dashboard/worker" : "/dashboard/agency";
      navigate(dashboardPath);
    }

    setIsLoading(false);
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    const { error } = await resendVerificationEmail(email);

    if (error) {
      toast({
        title: "Failed to resend",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Verification email sent",
        description: "Please check your inbox and spam folder.",
      });
    }

    setIsResending(false);
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 bg-gradient-to-br from-background via-background to-accent">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Welcome back! Please enter your credentials.
              </p>
            </div>

            {/* Email Verification Alert */}
            {needsVerification && (
              <Alert className="mb-6 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  <span className="font-medium">Email not verified.</span>
                  <p className="mt-1 text-sm">
                    Please check your inbox and click the verification link before signing in.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={handleResendVerification}
                    disabled={isResending}
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Resend verification email
                      </>
                    )}
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Footer */}
            {!isAdmin && (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    to={`/register/${userType}`}
                    className="text-primary font-medium hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            )}

            {/* Switch Login Type */}
            {!isAdmin && (
              <div className="mt-4 pt-4 border-t border-border text-center">
                <p className="text-sm text-muted-foreground">
                  {isWorker ? "Are you an agency?" : "Are you a worker?"}{" "}
                  <Link
                    to={isWorker ? "/login/agency" : "/login/worker"}
                    className="text-primary font-medium hover:underline"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
