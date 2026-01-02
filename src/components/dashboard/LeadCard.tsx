import { Mail, Phone, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadCardProps {
  name: string;
  company: string;
  email: string;
  value: string;
  status: "new" | "contacted" | "qualified" | "proposal" | "won";
  className?: string;
}

const statusConfig = {
  new: { label: "New", class: "bg-primary/20 text-primary" },
  contacted: { label: "Contacted", class: "bg-warning/20 text-warning" },
  qualified: { label: "Qualified", class: "bg-success/20 text-success" },
  proposal: { label: "Proposal", class: "bg-accent/20 text-accent" },
  won: { label: "Won", class: "bg-success/20 text-success" },
};

const LeadCard = ({ name, company, email, value, status, className }: LeadCardProps) => {
  const statusInfo = statusConfig[status];

  return (
    <div className={cn(
      "glass-card rounded-xl p-5 hover-lift cursor-pointer group",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/60 to-primary/30 flex items-center justify-center text-sm font-semibold text-foreground">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{name}</h3>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <Building2 className="w-3.5 h-3.5" />
              {company}
            </div>
          </div>
        </div>
        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", statusInfo.class)}>
          {statusInfo.label}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5" />
          <span className="truncate max-w-32">{email}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">Deal Value</span>
        <span className="text-lg font-bold text-foreground">{value}</span>
      </div>
    </div>
  );
};

export default LeadCard;
