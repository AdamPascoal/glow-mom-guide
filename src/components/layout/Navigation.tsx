import { Home, Activity, BookOpen, User, Search, Bell } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/trackers", icon: Activity, label: "Trackers" },
  { to: "/profile", icon: User, label: "Profile" },
];

export function MobileHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-50 md:hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-pink-400">
          BumpDaily
        </h1>
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors touch-manipulation">
            <Search className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors touch-manipulation">
            <Bell className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}

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
    <header className="hidden md:flex bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-pink-400">
            BumpDaily
          </h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Search className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex items-center space-x-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  isActive
                    ? "text-white bg-pink-400"
                    : "text-gray-600 hover:text-pink-400 hover:bg-pink-50"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}