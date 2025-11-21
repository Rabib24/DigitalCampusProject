"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Plus, 
  Search, 
  Filter, 
  DollarSign,
  Calendar,
  Eye,
  Edit
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function ResearchGrantsView() {
  const grantStats = [
    {
      title: "Total Grants",
      value: "$2.4M",
      change: "+15% from last year",
      icon: Award
    },
    {
      title: "Active Grants",
      value: "$1.8M",
      change: "+3 grants this quarter",
      icon: DollarSign
    },
    {
      title: "Pending Applications",
      value: "8",
      change: "-2 from last month",
      icon: Calendar
    },
    {
      title: "Funded Projects",
      value: "15",
      change: "+2 from last quarter",
      icon: Award
    }
  ];

  const fundingSources = [
    { source: "National Science Foundation", amount: "$800,000", color: "#3b82f6" },
    { source: "Industry Partnerships", amount: "$650,000", color: "#10b981" },
    { source: "University Grants", amount: "$450,000", color: "#f59e0b" },
    { source: "International Funding", amount: "$300,000", color: "#ef4444" },
    { source: "Private Foundations", amount: "$200,000", color: "#8b5cf6" }
  ];

  const grants = [
    { 
      id: "GRANT-001", 
      title: "Machine Learning in Healthcare", 
      pi: "Dr. Jane Smith", 
      source: "National Science Foundation",
      amount: "$150,000",
      status: "Active",
      startDate: "2023-01-15",
      endDate: "2024-01-15"
    },
    { 
      id: "GRANT-002", 
      title: "Sustainable Energy Solutions", 
      pi: "Dr. Robert Johnson", 
      source: "Industry Partnerships",
      amount: "$200,000",
      status: "Completed",
      startDate: "2022-06-01",
      endDate: "2023-06-01"
    },
    { 
      id: "GRANT-003", 
      title: "Quantum Computing Research", 
      pi: "Dr. Emily Davis", 
      source: "University Grants",
      amount: "$300,000",
      status: "Pending",
      startDate: "2023-07-01",
      endDate: "2024-07-01"
    },
    { 
      id: "GRANT-004", 
      title: "Climate Change Impact Study", 
      pi: "Dr. Michael Wilson", 
      source: "International Funding",
      amount: "$120,000",
      status: "Active",
      startDate: "2023-03-01",
      endDate: "2024-03-01"
    },
    { 
      id: "GRANT-005", 
      title: "Biomedical Engineering Innovations", 
      pi: "Dr. Sarah Brown", 
      source: "Private Foundations",
      amount: "$180,000",
      status: "Submitted",
      startDate: "2023-05-01",
      endDate: "2024-05-01"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Grants Management</h1>
        <p className="text-muted-foreground">
          Manage grant applications, track funding, and monitor expenditures.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {grantStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Funding Sources</CardTitle>
            <CardDescription>
              Distribution of funding by source
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fundingSources.map((source, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{source.source}</span>
                    <span>{source.amount}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${(parseInt(source.amount.replace(/[^0-9]/g, '')) / 800000) * 100}%`, 
                        backgroundColor: source.color 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common grant management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Submit New Grant
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Grants
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Status
              </Button>
              <Button variant="outline">
                <Award className="mr-2 h-4 w-4" />
                View All Grants
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grants Overview</CardTitle>
          <CardDescription>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {grants.map((grant, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{grant.title}</p>
                  <p className="text-xs text-muted-foreground">{grant.id} • PI: {grant.pi}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {grant.source}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-sm font-medium">{grant.amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Period</p>
                    <p className="text-sm font-medium">{grant.startDate} to {grant.endDate}</p>
                  </div>
                  <Badge 
                    variant={
                      grant.status === "Active" 
                        ? "default" 
                        : grant.status === "Completed" 
                        ? "secondary" 
                        : grant.status === "Pending" 
                        ? "destructive" 
                        : "outline"
                    }
                  >
                    {grant.status}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}