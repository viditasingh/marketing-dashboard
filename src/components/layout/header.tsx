import React from "react";
import { Button } from "@/components/ui/button";
import { useThemeStore, applyTheme } from "@/store/theme-store";
import { Moon, Sun, Monitor, Bell, Search, User } from "lucide-react";

const Header: React.FC = () => {
  const { theme, setTheme } = useThemeStore();

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-6 max-w-full">
        {/* Logo */}
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs sm:text-sm">A</span>
            </div>
            <span className="font-bold text-base sm:text-lg lg:text-xl truncate">ADmyBRAND</span>
          </div>
        </div>

        {/* Search - Hidden on mobile, responsive on tablet+ */}
        <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-4 lg:mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search analytics..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          {/* Mobile Search Button */}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 md:hidden flex-shrink-0">
            <Search className="h-4 w-4" />
          </Button>

          {/* Theme Toggle - Full controls on tablet+, simple on mobile */}
          <div className="hidden sm:flex items-center space-x-1 rounded-md border p-1">
            <Button
              variant={theme === "light" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleThemeChange("light")}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
              title="Light theme"
            >
              <Sun className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleThemeChange("dark")}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
              title="Dark theme"
            >
              <Moon className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant={theme === "system" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleThemeChange("system")}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
              title="System theme"
            >
              <Monitor className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>

          {/* Mobile Theme Toggle - Simplified */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 sm:hidden flex-shrink-0"
            onClick={() => handleThemeChange(theme === "dark" ? "light" : "dark")}
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0" title="Notifications">
            <Bell className="h-4 w-4" />
          </Button>

          {/* User Menu */}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0" title="User menu">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header; 