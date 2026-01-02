import { Phone, Mail, Calendar, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItemProps {
  type: "call" | "email" | "meeting" | "deal";
  title: string;
  description: string;
  time: string;
  className?: string;
}

const typeConfig = {
  call: { icon: Phone, class: "bg-primary/20 text-primary" },
  email: { icon: Mail, class: "bg-warning/20 text-warning" },
  meeting: { icon: Calendar, class: "bg-accent/20 text-accent" },
  deal: { icon: CheckCircle2, class: "bg-success/20 text-success" },
};

const ActivityItem = ({ type, title, description, time, className }: ActivityItemProps) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors", className)}>
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", config.class)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      </div>
      <span className="text-xs text-muted-foreground flex-shrink-0">{time}</span>
    </div>
  );
};

export default ActivityItem;
