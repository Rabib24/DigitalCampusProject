"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Search, 
  Filter,
  Eye,
  Download
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function ResearchPublicationManagementView() {
  const publicationStats = [
    {
      title: "Total Publications",
      value: "156",
      change: "+12 this year",
      icon: FileText
    },
    {
      title: "Pending Review",
      value: "18",
      change: "-3 from last week",
      icon: Clock
    },
    {
      title: "Published",
      value: "132",
      change: "+9 from last month",
      icon: CheckCircle
    },
    {
      title: "Rejected",
      value: "6",
      change: "0 from last month",
      icon: XCircle
    }
  ];

  const publicationTrends = [
    { month: "Jan", submitted: 12, published: 8, rejected: 1 },
    { month: "Feb", submitted: 15, published: 10, rejected: 2 },
    { month: "Mar", submitted: 18, published: 12, rejected: 1 },
    { month: "Apr", submitted: 14, published: 9, rejected: 2 },
    { month: "May", submitted: 22, published: 15, rejected: 1 },
    { month: "Jun", submitted: 18, published: 12, rejected: 0 }
  ];

  const publications = [
    { 
      id: "PUB-001", 
      title: "Advances in Machine Learning Algorithms", 
      authors: "Dr. Jane Smith, Dr. Robert Johnson",
      journal: "Journal of AI Research",
      submissionDate: "2023-06-15",
      status: "Published",
      impactFactor: 4.2
    },
    { 
      id: "PUB-002", 
      title: "Sustainable Energy Solutions Conference Paper", 
      authors: "Dr. Emily Davis, Dr. Michael Wilson",
      journal: "International Energy Conference",
      submissionDate: "2023-06-14",
      status: "Under Review",
      impactFactor: 0
    },
    { 
      id: "PUB-003", 
      title: "Quantum Computing Fundamentals", 
      authors: "Dr. Sarah Brown, Dr. John Doe",
      journal: "Advanced Computing Techniques",
      submissionDate: "2023-06-12",
      status: "Pending",
      impactFactor: 0
    },
    { 
      id: "PUB-004", 
      title: "Climate Change Impact Analysis", 
      authors: "Dr. Michael Wilson, Dr. Emily Davis",
      journal: "Environmental Science Review",
      submissionDate: "2023-06-10",
      status: "Published",
      impactFactor: 3.8
    },
    { 
      id: "PUB-005", 
      title: "Biomedical Engineering Innovations", 
      authors: "Dr. Sarah Brown, Dr. Robert Johnson",
      journal: "Medical Engineering Symposium",
      submissionDate: "2023-06-08",
      status: "Rejected",
      impactFactor: 0
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Publication Management</h1>
        <p className="text-muted-foreground">
          Manage research publications, track submissions, and monitor impact metrics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {publicationStats.map((stat, index) => (
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
            <CardTitle>Publication Trends</CardTitle>
            <CardDescription>
              Publication submissions and outcomes over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={publicationTrends}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="submitted" fill="#3b82f6" name="Submitted" />
                <Bar dataKey="published" fill="#10b981" name="Published" />
                <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common publication management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Submit Publication
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Publications
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Status
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Bibliography
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Research Publications</CardTitle>
          <CardDescription>
            List of research publications in various stages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {publications.map((publication, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{publication.title}</p>
                  <p className="text-xs text-muted-foreground">{publication.id} • {publication.authors}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Journal: {publication.journal}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Submission Date</p>
                    <p className="text-sm font-medium">{publication.submissionDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Impact Factor</p>
                    <p className="text-sm font-medium">{publication.impactFactor || "N/A"}</p>
                  </div>
                  <Badge 
                    variant={
                      publication.status === "Published" 
                        ? "default" 
                        : publication.status === "Under Review" 
                        ? "secondary" 
                        : publication.status === "Pending" 
                        ? "outline" 
                        : "destructive"
                    }
                  >
                    {publication.status}
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