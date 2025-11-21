"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Search, 
  Filter,
  Eye,
  UserCheck
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function ResearchApprovalWorkflowView() {
  const workflowStats = [
    {
      title: "Total Proposals",
      value: "42",
      change: "+8 from last month",
      icon: CheckCircle
    },
    {
      title: "Pending Review",
      value: "12",
      change: "-3 from yesterday",
      icon: Clock
    },
    {
      title: "Approved",
      value: "28",
      change: "+5 from last week",
      icon: CheckCircle
    },
    {
      title: "Rejected",
      value: "2",
      change: "0 from last week",
      icon: XCircle
    }
  ];

  const approvalTrends = [
    { month: "Jan", submitted: 5, approved: 4, rejected: 1 },
    { month: "Feb", submitted: 7, approved: 6, rejected: 1 },
    { month: "Mar", submitted: 8, approved: 7, rejected: 1 },
    { month: "Apr", submitted: 6, approved: 5, rejected: 1 },
    { month: "May", submitted: 9, approved: 8, rejected: 1 },
    { month: "Jun", submitted: 7, approved: 6, rejected: 1 }
  ];

  const proposals = [
    { 
      id: "PROP-001", 
      title: "Machine Learning Applications in Healthcare", 
      pi: "Dr. Jane Smith",
      department: "Computer Science",
      submissionDate: "2023-06-15",
      status: "Approved",
      reviewers: ["Dr. Johnson", "Dr. Davis"]
    },
    { 
      id: "PROP-002", 
      title: "Sustainable Energy Solutions", 
      pi: "Dr. Robert Johnson",
      department: "Physics",
      submissionDate: "2023-06-14",
      status: "Under Review",
      reviewers: ["Dr. Wilson", "Dr. Brown"]
    },
    { 
      id: "PROP-003", 
      title: "Quantum Computing Research", 
      pi: "Dr. Emily Davis",
      department: "Computer Science",
      submissionDate: "2023-06-12",
      status: "Pending",
      reviewers: []
    },
    { 
      id: "PROP-004", 
      title: "Climate Change Impact Study", 
      pi: "Dr. Michael Wilson",
      department: "Environmental Science",
      submissionDate: "2023-06-10",
      status: "Approved",
      reviewers: ["Dr. Smith", "Dr. Johnson"]
    },
    { 
      id: "PROP-005", 
      title: "Biomedical Engineering Innovations", 
      pi: "Dr. Sarah Brown",
      department: "Engineering",
      submissionDate: "2023-06-08",
      status: "Rejected",
      reviewers: ["Dr. Davis", "Dr. Wilson"]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Project Approval Workflow</h1>
        <p className="text-muted-foreground">
          Manage research project proposals through the approval process.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {workflowStats.map((stat, index) => (
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
            <CardTitle>Approval Trends</CardTitle>
            <CardDescription>
              Proposal submissions and outcomes over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={approvalTrends}>
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
              Common approval workflow tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <CheckCircle className="mr-2 h-4 w-4" />
                Review Proposals
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Proposals
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Status
              </Button>
              <Button variant="outline">
                <UserCheck className="mr-2 h-4 w-4" />
                Assign Reviewers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Research Proposals</CardTitle>
          <CardDescription>
            List of research project proposals in the approval pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proposals.map((proposal, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{proposal.title}</p>
                  <p className="text-xs text-muted-foreground">{proposal.id} • PI: {proposal.pi}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Department: {proposal.department}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Submission Date</p>
                    <p className="text-sm font-medium">{proposal.submissionDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Reviewers</p>
                    <p className="text-sm font-medium">{proposal.reviewers.length}</p>
                  </div>
                  <Badge 
                    variant={
                      proposal.status === "Approved" 
                        ? "default" 
                        : proposal.status === "Under Review" 
                        ? "secondary" 
                        : proposal.status === "Pending" 
                        ? "outline" 
                        : "destructive"
                    }
                  >
                    {proposal.status}
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