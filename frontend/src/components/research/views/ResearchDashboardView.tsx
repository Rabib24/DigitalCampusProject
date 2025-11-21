"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical, FileText, Users, BarChart3, Award, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ResearchDashboardView() {
  const stats = [
    {
      title: "Active Projects",
      value: "24",
      description: "+3 from last month",
      icon: FlaskConical,
    },
    {
      title: "Publications",
      value: "156",
      description: "+12 this year",
      icon: FileText,
    },
    {
      title: "Researchers",
      value: "89",
      description: "+5 new researchers",
      icon: Users,
    },
    {
      title: "Grants Awarded",
      value: "$2.4M",
      description: "+15% from last year",
      icon: Award,
    },
  ];

  const recentProjects = [
    { id: "PROJ-001", title: "Machine Learning Applications in Healthcare", pi: "Dr. Jane Smith", status: "In Progress", funding: "$150,000" },
    { id: "PROJ-002", title: "Sustainable Energy Solutions", pi: "Dr. Robert Johnson", status: "Completed", funding: "$200,000" },
    { id: "PROJ-003", title: "Quantum Computing Research", pi: "Dr. Emily Davis", status: "Proposal", funding: "$300,000" },
    { id: "PROJ-004", title: "Climate Change Impact Study", pi: "Dr. Michael Wilson", status: "In Progress", funding: "$120,000" },
  ];

  const upcomingDeadlines = [
    { project: "Machine Learning Applications in Healthcare", deadline: "2023-06-30", task: "Quarterly Report" },
    { project: "Sustainable Energy Solutions", deadline: "2023-07-15", task: "Final Publication" },
    { project: "Quantum Computing Research", deadline: "2023-07-30", task: "Grant Application" },
    { project: "Climate Change Impact Study", deadline: "2023-08-15", task: "Data Collection" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Research Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage research projects, publications, and researcher activities.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
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
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Latest research projects and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{project.title}</p>
                    <p className="text-xs text-muted-foreground">PI: {project.pi} • {project.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{project.funding}</p>
                    <p className={`text-xs ${
                      project.status === "In Progress" 
                        ? "text-blue-500" 
                        : project.status === "Completed" 
                        ? "text-green-500" 
                        : "text-yellow-500"
                    }`}>
                      {project.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>
              Important dates for research projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{deadline.task}</p>
                    <p className="text-xs text-muted-foreground">{deadline.project}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{deadline.deadline}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(deadline.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common research administration tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button>
              <FlaskConical className="mr-2 h-4 w-4" />
              Create New Project
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Submit Publication
            </Button>
            <Button variant="outline">
              <Award className="mr-2 h-4 w-4" />
              Grant Applications
            </Button>
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Research Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}