import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FileText, Home, LogOut, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { path: "/dashboard", icon: Home, label: "Dashboard" },
  { path: "/topics", icon: Search, label: "Topics" },
  { path: "/generated", icon: FileText, label: "Posts" },
  { path: "/profile", icon: User, label: "Profile" },
];

export const TopNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout(true);
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="h-14 px-4 max-w-5xl mx-auto flex items-center justify-between">
        <button className="font-semibold" onClick={() => navigate("/dashboard")}>
          KOL Challenge
        </button>
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={active ? "secondary" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            );
          })}
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
