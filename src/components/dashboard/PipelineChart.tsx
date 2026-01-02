import { cn } from "@/lib/utils";

interface PipelineStage {
  name: string;
  value: number;
  count: number;
  color: string;
}

const stages: PipelineStage[] = [
  { name: "Leads", value: 45, count: 124, color: "from-primary to-primary/60" },
  { name: "Contacted", value: 32, count: 87, color: "from-warning to-warning/60" },
  { name: "Qualified", value: 28, count: 65, color: "from-accent to-accent/60" },
  { name: "Proposal", value: 18, count: 42, color: "from-success/80 to-success/40" },
  { name: "Won", value: 12, count: 28, color: "from-success to-success/60" },
];

const PipelineChart = () => {
  const maxValue = Math.max(...stages.map(s => s.value));

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Sales Pipeline</h3>
          <p className="text-sm text-muted-foreground">Current quarter performance</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">$1.2M</p>
          <p className="text-sm text-muted-foreground">Total value</p>
        </div>
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => (
          <div key={stage.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{stage.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">{stage.count} deals</span>
                <span className="font-semibold text-foreground">${stage.value}K</span>
              </div>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-1000", stage.color)}
                style={{ 
                  width: `${(stage.value / maxValue) * 100}%`,
                  animationDelay: `${index * 100}ms`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineChart;
