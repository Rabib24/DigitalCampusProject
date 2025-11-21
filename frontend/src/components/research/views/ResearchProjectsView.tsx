"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FlaskConical, 
  Plus, 
  Search, 
  Filter, 
  Eye,
  Edit,
  FileText
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function ResearchProjectsView() {
  const projectStats = [
    {
      title: "Total Projects",
      value: "24",
      change: "+3 from last month",
      icon: FlaskConical
    },
    {
      title: "Active Projects",
      value: "18",
      change: "+2 from last week",
      icon: FlaskConical
    },
    {
      title: "Completed Projects",
      value: "32",
      change: "+4 from last quarter",
      icon: FileText
    },
    {
      title: "Pending Approval",
      value: "5",
      change: "-1 from yesterday",
      icon: FlaskConical
    }
  ];

  const projectStatusData = [
    { status: "Proposal", count: 5, color: "#f59e0b" },
    { status: "In Progress", count: 12, color: "#3b82f6" },
    { status: "Review", count: 4, color: "#8b5cf6" },
    { status: "Completed", count: 3, color: "#10b981" }
  ];

  const projects = [
    { 
      id: "PROJ-001", 
      title: "Machine Learning Applications in Healthcare", 
      pi: "Dr. Jane Smith", 
      status: "In Progress",
      funding: "$150,000",
      startDate: "2023-01-15",
      endDate: "2024-01-15"
    },
    { 
      id: "PROJ-002", 
      title: "Sustainable Energy Solutions", 
      pi: "Dr. Robert Johnson", 
      status: "Completed",
      funding: "$200,000",
      startDate: "2022-06-01",
      endDate: "2023-06-01"
    },
    { 
      id: "PROJ-003", 
      title: "Quantum Computing Research", 
      pi: "Dr. Emily Davis", 
      status: "Proposal",
      funding: "$300,000",
      startDate: "2023-07-01",
      endDate: "2024-07-01"
    },
    { 
      id: "PROJ-004", 
      title: "Climate Change Impact Study", 
      pi: "Dr. Michael Wilson", 
      status: "In Progress",
      funding: "$120,000",
      startDate: "2023-03-01",
      endDate: "2024-03-01"
    },
    { 
      id: "PROJ-005", 
      title: "Biomedical Engineering Innovations", 
      pi: "Dr. Sarah Brown", 
      status: "Review",
      funding: "$180,000",
      startDate: "2022-09-01",
      endDate: "2023-09-01"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Research Projects</h1>
        <p className="text-muted-foreground">
          Manage research projects, track progress, and monitor funding.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {projectStats.map((stat, index) => (
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
            <CardTitle>Project Status Distribution</CardTitle>
            <CardDescription>
              Distribution of projects by current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectStatusData.map((status, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{status.status}</span>
                    <span>{status.count} projects</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${(status.count / 20) * 100}%`, 
                        backgroundColor: status.color 
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
              Common project management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New Project
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Projects
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Status
              </Button>
              <Button variant="outline">
                <FlaskConical className="mr-2 h-4 w-4" />
                View All Projects
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Research Projects</CardTitle>
          <CardDescription>
            List of all research projects with key details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{project.title}</p>
                  <p className="text-xs text-muted-foreground">{project.id} • PI: {project.pi}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Funding</p>
                    <p className="text-sm font-medium">{project.funding}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Period</p>
                    <p className="text-sm font-medium">{project.startDate} to {project.endDate}</p>
                  </div>
                  <Badge 
                    variant={
                      project.status === "In Progress" 
                        ? "default" 
                        : project.status === "Completed" 
                        ? "secondary" 
                        : project.status === "Proposal" 
                        ? "destructive" 
                        : "outline"
                    }
                  >
                    {project.status}
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