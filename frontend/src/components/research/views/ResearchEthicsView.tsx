"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Search, 
  Filter,
  Eye,
  FileText
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function ResearchEthicsView() {
  const ethicsStats = [
    {
      title: "Total Applications",
      value: "38",
      change: "+6 from last month",
      icon: Shield
    },
    {
      title: "Pending Review",
      value: "9",
      change: "-2 from yesterday",
      icon: Clock
    },
    {
      title: "Approved",
      value: "27",
      change: "+4 from last week",
      icon: CheckCircle
    },
    {
      title: "Rejected",
      value: "2",
      change: "0 from last week",
      icon: XCircle
    }
  ];

  const ethicsTrends = [
    { month: "Jan", submitted: 4, approved: 3, rejected: 1 },
    { month: "Feb", submitted: 5, approved: 4, rejected: 1 },
    { month: "Mar", submitted: 6, approved: 5, rejected: 1 },
    { month: "Apr", submitted: 5, approved: 4, rejected: 1 },
    { month: "May", submitted: 7, approved: 6, rejected: 1 },
    { month: "Jun", submitted: 6, approved: 5, rejected: 1 }
  ];

  const applications = [
    { 
      id: "ETH-001", 
      title: "Human Subject Research in Healthcare", 
      pi: "Dr. Jane Smith",
      department: "Medicine",
      submissionDate: "2023-06-15",
      status: "Approved",
      reviewDate: "2023-06-18"
    },
    { 
      id: "ETH-002", 
      title: "Animal Testing for Drug Development", 
      pi: "Dr. Robert Johnson",
      department: "Biology",
      submissionDate: "2023-06-14",
      status: "Under Review",
      reviewDate: ""
    },
    { 
      id: "ETH-003", 
      title: "Data Privacy in AI Research", 
      pi: "Dr. Emily Davis",
      department: "Computer Science",
      submissionDate: "2023-06-12",
      status: "Pending",
      reviewDate: ""
    },
    { 
      id: "ETH-004", 
      title: "Environmental Impact Assessment", 
      pi: "Dr. Michael Wilson",
      department: "Environmental Science",
      submissionDate: "2023-06-10",
      status: "Approved",
      reviewDate: "2023-06-13"
    },
    { 
      id: "ETH-005", 
      title: "Genetic Research Ethics", 
      pi: "Dr. Sarah Brown",
      department: "Genetics",
      submissionDate: "2023-06-08",
      status: "Rejected",
      reviewDate: "2023-06-11"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ethics Management</h1>
        <p className="text-muted-foreground">
          Manage ethics applications and ensure compliance with research standards.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {ethicsStats.map((stat, index) => (
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
            <CardTitle>Ethics Application Trends</CardTitle>
            <CardDescription>
              Application submissions and outcomes over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ethicsTrends}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="submitted" fill="#3b82f6" name="Submitted" />
                <Bar dataKey="approved" fill="#10b981" name="Approved" />
                <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common ethics management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <Shield className="mr-2 h-4 w-4" />
                Review Applications
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Applications
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Status
              </Button>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                View Guidelines
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ethics Applications</CardTitle>
          <CardDescription>
            List of research ethics applications in the review pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.map((application, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{application.title}</p>
                  <p className="text-xs text-muted-foreground">{application.id} • PI: {application.pi}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Department: {application.department}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Submission Date</p>
                    <p className="text-sm font-medium">{application.submissionDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Review Date</p>
                    <p className="text-sm font-medium">{application.reviewDate || "Pending"}</p>
                  </div>
                  <Badge 
                    variant={
                      application.status === "Approved" 
                        ? "default" 
                        : application.status === "Under Review" 
                        ? "secondary" 
                        : application.status === "Pending" 
                        ? "outline" 
                        : "destructive"
                    }
                  >
                    {application.status}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
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