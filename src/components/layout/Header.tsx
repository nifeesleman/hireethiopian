import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Globe, User, Building2, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, loading, signOut } = useAuth();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Find Jobs", href: "/jobs" },
    { name: "Find Workers", href: "/workers" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const getDashboardPath = () => {
    switch (role) {
      case "admin":
        return "/dashboard/admin";
      case "agency":
        return "/dashboard/agency";
      case "worker":
      default:
        return "/dashboard/worker";
    }
  };

  const getDashboardIcon = () => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "agency":
        return <Building2 className="h-4 w-4" />;
      case "worker":
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getDashboardLabel = () => {
    switch (role) {
      case "admin":
        return "Admin Dashboard";
      case "agency":
        return "Agency Dashboard";
      case "worker":
      default:
        return "Worker Dashboard";
    }
  };

  // Show loading state
  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">
              Hire<span className="text-primary">Ethiopian</span>
            </span>
          </Link>
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
        </nav>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Globe className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">
            Hire<span className="text-primary">Ethiopian</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(item.href)
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          {user ? (
            // Logged in state
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  {getDashboardIcon()}
                  <span className="max-w-[120px] truncate">
                    {user.email?.split("@")[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to={getDashboardPath()} className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    {getDashboardLabel()}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-destructive">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Logged out state
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/login/worker" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Worker Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/login/agency" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Agency Login
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm">Get Started</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/register/worker" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      I'm a Worker
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/register/agency" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      I'm an Agency
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden rounded-md p-2 text-muted-foreground hover:bg-accent"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card">
          <div className="space-y-1 px-4 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-border pt-4 mt-4 space-y-2">
              {user ? (
                // Logged in - mobile
                <>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium bg-primary text-primary-foreground"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {getDashboardLabel()}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-destructive hover:bg-accent"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                // Logged out - mobile
                <>
                  <Link
                    to="/login/worker"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent"
                  >
                    <User className="h-4 w-4" />
                    Worker Login
                  </Link>
                  <Link
                    to="/login/agency"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent"
                  >
                    <Building2 className="h-4 w-4" />
                    Agency Login
                  </Link>
                  <Link
                    to="/register/worker"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium bg-primary text-primary-foreground"
                  >
                    <User className="h-4 w-4" />
                    Register as Worker
                  </Link>
                  <Link
                    to="/register/agency"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium bg-secondary text-secondary-foreground"
                  >
                    <Building2 className="h-4 w-4" />
                    Register as Agency
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
