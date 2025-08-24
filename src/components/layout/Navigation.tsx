import { Home, Activity, BookOpen, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/trackers", icon: Activity, label: "Trackers" },
  { to: "/profile", icon: User, label: "Profile" },
];

export function MobileNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:hidden safe-area-inset-bottom">
      <div className="flex">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex-1 flex flex-col items-center justify-center py-4 px-2 text-xs font-medium transition-colors touch-manipulation min-h-[60px]",
                isActive
                  ? "text-primary bg-secondary/50"
                  : "text-muted-foreground hover:text-primary active:bg-secondary/30"
              )
            }
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export function DesktopNavigation() {
  return (
    <header className="hidden md:flex bg-card border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-semibold bg-gradient-wellness bg-clip-text text-transparent">
            Pregnancy Wellness
          </h1>
          <nav className="flex space-x-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary bg-secondary"
                      : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="text-sm text-muted-foreground">
          Good morning! ✨
        </div>
      </div>
    </header>
  );
}