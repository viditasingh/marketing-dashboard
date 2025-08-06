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
      {/* Mobile menu button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="sm"
          className="fixed top-4 left-4 z-50"
          onClick={toggle}
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
          className
        )}
      >
      <div className="flex h-full flex-col">
        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.title}
                variant={item.active ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start space-x-3",
                  item.active && "bg-secondary text-secondary-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <h4 className="text-sm font-medium">Quick Actions</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Create new campaign or generate report
            </p>
            <div className="mt-3 space-y-2">
              <Button size="sm" className="w-full">
                New Campaign
              </Button>
              <Button size="sm" variant="outline" className="w-full">
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