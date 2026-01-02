import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  Phone, 
  Calendar, 
  Settings,
  BarChart3,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Leads" },
  { icon: Target, label: "Pipeline" },
  { icon: Phone, label: "Calls" },
  { icon: Calendar, label: "Calendar" },
  { icon: BarChart3, label: "Reports" },
  { icon: TrendingUp, label: "Analytics" },
];

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">InsideSales</h1>
            <p className="text-xs text-muted-foreground">Sales Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
              item.active
                ? "bg-sidebar-accent text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
            {item.active && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
            )}
          </button>
        ))}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-sidebar-border">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-all duration-200">
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </div>

      {/* User */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center text-sm font-semibold text-primary-foreground">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">Sales Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
