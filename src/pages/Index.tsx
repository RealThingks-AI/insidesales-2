import { DollarSign, Users, TrendingUp, Target, Plus, Filter } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import MetricCard from "@/components/dashboard/MetricCard";
import LeadCard from "@/components/dashboard/LeadCard";
import ActivityItem from "@/components/dashboard/ActivityItem";
import PipelineChart from "@/components/dashboard/PipelineChart";
import { Button } from "@/components/ui/button";

const metrics = [
  { title: "Total Revenue", value: "$284,520", change: "+12.5%", changeType: "positive" as const, icon: DollarSign },
  { title: "Active Leads", value: "1,429", change: "+8.2%", changeType: "positive" as const, icon: Users },
  { title: "Conversion Rate", value: "24.8%", change: "+3.1%", changeType: "positive" as const, icon: TrendingUp },
  { title: "Deals Won", value: "89", change: "-2.4%", changeType: "negative" as const, icon: Target },
];

const leads = [
  { name: "Sarah Mitchell", company: "TechCorp Inc", email: "sarah@techcorp.com", value: "$45,000", status: "qualified" as const },
  { name: "Michael Chen", company: "DataFlow Systems", email: "m.chen@dataflow.io", value: "$32,500", status: "proposal" as const },
  { name: "Emma Rodriguez", company: "CloudNine Solutions", email: "emma@cloudnine.co", value: "$28,000", status: "new" as const },
  { name: "James Wilson", company: "Innovate Labs", email: "jwilson@innovate.com", value: "$67,000", status: "contacted" as const },
];

const activities = [
  { type: "deal" as const, title: "Deal closed with TechVentures", description: "Enterprise plan - $125,000 annual contract", time: "2h ago" },
  { type: "call" as const, title: "Call scheduled with DataFlow", description: "Product demo for new features", time: "4h ago" },
  { type: "email" as const, title: "Proposal sent to CloudNine", description: "Custom enterprise solution", time: "6h ago" },
  { type: "meeting" as const, title: "Meeting with Innovate Labs", description: "Contract negotiation final round", time: "Yesterday" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, John. Here's your sales overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Add Lead
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={metric.title} className={`animate-slide-up stagger-${index + 1}`} style={{ opacity: 0 }}>
              <MetricCard {...metric} />
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pipeline Chart */}
          <div className="lg:col-span-2 animate-slide-up stagger-2" style={{ opacity: 0 }}>
            <PipelineChart />
          </div>

          {/* Recent Activity */}
          <div className="glass-card rounded-xl p-6 animate-slide-up stagger-3" style={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
              <button className="text-sm text-primary hover:underline">View all</button>
            </div>
            <div className="space-y-1">
              {activities.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </div>

          {/* Hot Leads */}
          <div className="lg:col-span-3 animate-slide-up stagger-4" style={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Hot Leads</h3>
                <p className="text-sm text-muted-foreground">Your most promising opportunities</p>
              </div>
              <button className="text-sm text-primary hover:underline">View all leads</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {leads.map((lead, index) => (
                <LeadCard key={lead.email} {...lead} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
