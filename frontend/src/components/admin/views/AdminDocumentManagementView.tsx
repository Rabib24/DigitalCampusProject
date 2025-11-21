"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Search, 
  Filter, 
  Upload,
  Download,
  Eye,
  Trash2
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function AdminDocumentManagementView() {
  const documentStats = [
    {
      title: "Total Documents",
      value: "1,247",
      change: "+89 from last month",
      icon: FileText
    },
    {
      title: "Active Documents",
      value: "1,156",
      change: "+42 from last week",
      icon: FileText
    },
    {
      title: "Archived Documents",
      value: "91",
      change: "+7 from cleanup",
      icon: FileText
    },
    {
      title: "Shared Documents",
      value: "624",
      change: "+35 from last week",
      icon: FileText
    }
  ];

  const documentTypes = [
    { type: "Academic Records", count: 420, color: "#3b82f6" },
    { type: "Financial Documents", count: 280, color: "#10b981" },
    { type: "HR Documents", count: 195, color: "#f59e0b" },
    { type: "Research Papers", count: 156, color: "#ef4444" },
    { type: "Administrative", count: 196, color: "#8b5cf6" }
  ];

  const documents = [
    { 
      id: "DOC-001", 
      title: "Student Academic Records - Spring 2023", 
      type: "Academic Records", 
      owner: "John Doe",
      size: "2.4 MB",
      lastModified: "2023-06-15",
      status: "Active",
      sharedWith: 5
    },
    { 
      id: "DOC-002", 
      title: "Tuition Payment Records - May 2023", 
      type: "Financial Documents", 
      owner: "Jane Smith",
      size: "1.8 MB",
      lastModified: "2023-06-14",
      status: "Active",
      sharedWith: 3
    },
    { 
      id: "DOC-003", 
      title: "Faculty Employment Contracts", 
      type: "HR Documents", 
      owner: "Robert Johnson",
      size: "5.2 MB",
      lastModified: "2023-06-12",
      status: "Archived",
      sharedWith: 2
    },
    { 
      id: "DOC-004", 
      title: "Machine Learning Research Paper", 
      type: "Research Papers", 
      owner: "Emily Davis",
      size: "3.7 MB",
      lastModified: "2023-06-10",
      status: "Active",
      sharedWith: 8
    },
    { 
      id: "DOC-005", 
      title: "Campus Event Planning Documents", 
      type: "Administrative", 
      owner: "Michael Wilson",
      size: "1.2 MB",
      lastModified: "2023-06-08",
      status: "Active",
      sharedWith: 4
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Document Management</h1>
        <p className="text-muted-foreground">
          Manage, organize, and track institutional documents and files.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {documentStats.map((stat, index) => (
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
            <CardTitle>Document Distribution</CardTitle>
            <CardDescription>
              Number of documents by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documentTypes.map((docType, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{docType.type}</span>
                    <span>{docType.count} documents</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${(docType.count / 500) * 100}%`, 
                        backgroundColor: docType.color 
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
              Common document management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Documents
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Type
              </Button>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                View All Documents
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
          <CardDescription>
            List of institutional documents with details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((document, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{document.title}</p>
                  <p className="text-xs text-muted-foreground">{document.id} • {document.type}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Owner: {document.owner} • Size: {document.size}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Last Modified</p>
                    <p className="text-sm font-medium">{document.lastModified}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Shared With</p>
                    <p className="text-sm font-medium">{document.sharedWith} users</p>
                  </div>
                  <Badge 
                    variant={
                      document.status === "Active" 
                        ? "default" 
                        : document.status === "Archived" 
                        ? "secondary" 
                        : "outline"
                    }
                  >
                    {document.status}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
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