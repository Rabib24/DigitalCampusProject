"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function ResearchPublicationsView() {
  const publicationStats = [
    {
      title: "Total Publications",
      value: "156",
      change: "+12 this year",
      icon: FileText
    },
    {
      title: "Journal Articles",
      value: "98",
      change: "+8 this year",
      icon: FileText
    },
    {
      title: "Conference Papers",
      value: "42",
      change: "+3 this year",
      icon: FileText
    },
    {
      title: "Book Chapters",
      value: "16",
      change: "+1 this year",
      icon: FileText
    }
  ];

  const publicationTypes = [
    { type: "Journal Articles", count: 98, color: "#3b82f6" },
    { type: "Conference Papers", count: 42, color: "#10b981" },
    { type: "Book Chapters", count: 16, color: "#f59e0b" }
  ];

  const publications = [
    { 
      id: "PUB-001", 
      title: "Advances in Machine Learning Algorithms", 
      authors: "Dr. Jane Smith, Dr. Robert Johnson", 
      type: "Journal Article",
      journal: "Journal of AI Research",
      date: "2023-05-15",
      status: "Published"
    },
    { 
      id: "PUB-002", 
      title: "Sustainable Energy Solutions Conference Paper", 
      authors: "Dr. Emily Davis, Dr. Michael Wilson", 
      type: "Conference Paper",
      journal: "International Energy Conference",
      date: "2023-04-22",
      status: "Published"
    },
    { 
      id: "PUB-003", 
      title: "Quantum Computing Fundamentals", 
      authors: "Dr. Sarah Brown, Dr. John Doe", 
      type: "Book Chapter",
      journal: "Advanced Computing Techniques",
      date: "2023-03-10",
      status: "Published"
    },
    { 
      id: "PUB-004", 
      title: "Climate Change Impact Analysis", 
      authors: "Dr. Michael Wilson, Dr. Emily Davis", 
      type: "Journal Article",
      journal: "Environmental Science Review",
      date: "2023-06-01",
      status: "In Press"
    },
    { 
      id: "PUB-005", 
      title: "Biomedical Engineering Innovations", 
      authors: "Dr. Sarah Brown, Dr. Robert Johnson", 
      type: "Conference Paper",
      journal: "Medical Engineering Symposium",
      date: "2023-07-15",
      status: "Submitted"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Publications</h1>
        <p className="text-muted-foreground">
          Manage research publications, track submissions, and monitor impact.
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
            <CardTitle>Publication Types</CardTitle>
            <CardDescription>
              Distribution of publications by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {publicationTypes.map((type, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{type.type}</span>
                    <span>{type.count} publications</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${(type.count / 120) * 100}%`, 
                        backgroundColor: type.color 
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
              Common publication management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Submit New Publication
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Publications
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Type
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
          <CardTitle>Recent Publications</CardTitle>
          <CardDescription>
            List of recent and upcoming publications
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
                    {publication.journal} • {publication.date}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge 
                    variant={
                      publication.status === "Published" 
                        ? "default" 
                        : publication.status === "In Press" 
                        ? "secondary" 
                        : "destructive"
                    }
                  >
                    {publication.status}
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