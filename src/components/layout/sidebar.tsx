import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMobileSidebar } from "@/hooks/use-responsive";
import {
  BarChart3,
  Users,
  TrendingUp,
  Settings,
  FileText,
  Calendar,
  Target,
  Activity,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const navigationItems = [
  {
    title: "Overview",
    icon: BarChart3,
    href: "/",
    active: true,
  },
  {
    title: "Analytics",
    icon: TrendingUp,
    href: "/analytics",
    active: false,
  },
  {
    title: "Campaigns",
    icon: Target,
    href: "/campaigns",
    active: false,
  },
  {
    title: "Audience",
    icon: Users,
    href: "/audience",
    active: false,
  },
  {
    title: "Reports",
    icon: FileText,
    href: "/reports",
    active: false,
  },
  {
    title: "Calendar",
    icon: Calendar,
    href: "/calendar",
    active: false,
  },
  {
    title: "Performance",
    icon: Activity,
    href: "/performance",
    active: false,
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
    active: false,
  },
];

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { isOpen, toggle, isMobile } = useMobileSidebar();

  return (
    <>
      {/* Mobile menu button - positioned below header */}
      {isMobile && (
        <Button
          variant="ghost"
          size="sm"
          className="fixed top-16 left-3 z-50 h-10 w-10 p-0 bg-background/90 backdrop-blur border shadow-md"
          onClick={toggle}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={toggle}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-14 sm:top-16 z-40 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ease-in-out",
          "md:translate-x-0 md:bg-background md:backdrop-blur-none",
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
          className
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3 sm:p-4 overflow-y-auto scrollbar-hide">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.title}
                    variant={item.active ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start space-x-3 h-10 px-3 text-sm",
                      "hover:bg-muted/50 transition-colors",
                      item.active && "bg-secondary text-secondary-foreground shadow-sm"
                    )}
                    onClick={() => isMobile && toggle()} // Close mobile menu on navigation
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </Button>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t p-3 sm:p-4 bg-muted/20">
            <div className="rounded-lg bg-background border p-3 shadow-sm">
              <h4 className="text-sm font-medium">Quick Actions</h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                Create new campaign or generate report
              </p>
              <div className="mt-3 space-y-2">
                <Button size="sm" className="w-full h-8 text-xs">
                  New Campaign
                </Button>
                <Button size="sm" variant="outline" className="w-full h-8 text-xs">
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 