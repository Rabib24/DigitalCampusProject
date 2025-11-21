"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Plus,
  Edit,
  Eye,
  AlertTriangle
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function LibraryInventoryView() {
  const inventoryStats = [
    {
      title: "Total Items",
      value: "12,450",
      change: "+245 from last month",
      icon: BookOpen
    },
    {
      title: "Available Items",
      value: "9,870",
      change: "+180 from last week",
      icon: BookOpen
    },
    {
      title: "Checked Out",
      value: "2,150",
      change: "-45 from yesterday",
      icon: BookOpen
    },
    {
      title: "Overdue Items",
      value: "89",
      change: "+12 from last week",
      icon: AlertTriangle
    }
  ];

  const inventoryStatus = [
    { status: "Available", count: 9870, color: "#10b981" },
    { status: "Checked Out", count: 2150, color: "#3b82f6" },
    { status: "Maintenance", count: 120, color: "#f59e0b" },
    { status: "Lost", count: 45, color: "#ef4444" },
    { status: "Damaged", count: 65, color: "#8b5cf6" }
  ];

  const inventoryItems = [
    { 
      id: "INV-001", 
      title: "Introduction to Algorithms", 
      author: "Thomas H. Cormen", 
      isbn: "978-0262033848",
      category: "Computer Science",
      status: "Available",
      location: "CS-Section A",
      lastUpdated: "2023-06-15"
    },
    { 
      id: "INV-002", 
      title: "Machine Learning Basics", 
      author: "John Doe", 
      isbn: "978-1234567890",
      category: "Artificial Intelligence",
      status: "Checked Out",
      location: "AI-Section B",
      lastUpdated: "2023-06-14"
    },
    { 
      id: "INV-003", 
      title: "Quantum Physics Fundamentals", 
      author: "Jane Smith", 
      isbn: "978-0987654321",
      category: "Physics",
      status: "Maintenance",
      location: "PH-Section C",
      lastUpdated: "2023-06-12"
    },
    { 
      id: "INV-004", 
      title: "Biology Research Methods", 
      author: "Robert Johnson", 
      isbn: "978-1122334455",
      category: "Biology",
      status: "Available",
      location: "BI-Section A",
      lastUpdated: "2023-06-10"
    },
    { 
      id: "INV-005", 
      title: "Chemistry Lab Manual", 
      author: "Emily Davis", 
      isbn: "978-9988776655",
      category: "Chemistry",
      status: "Damaged",
      location: "CH-Section D",
      lastUpdated: "2023-06-08"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-muted-foreground">
          Manage library inventory, track item status, and monitor collection health.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {inventoryStats.map((stat, index) => (
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
            <CardTitle>Inventory Status Distribution</CardTitle>
            <CardDescription>
              Number of items by current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryStatus.map((status, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{status.status}</span>
                    <span>{status.count} items</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${(status.count / 12000) * 100}%`, 
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
              Common inventory management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Item
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Inventory
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Status
              </Button>
              <Button variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                View All Items
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>
            List of library items with status and location information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventoryItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.id} • {item.author}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ISBN: {item.isbn} • Category: {item.category}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium">{item.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Last Updated</p>
                    <p className="text-sm font-medium">{item.lastUpdated}</p>
                  </div>
                  <Badge 
                    variant={
                      item.status === "Available" 
                        ? "default" 
                        : item.status === "Checked Out" 
                        ? "secondary" 
                        : item.status === "Maintenance" 
                        ? "outline" 
                        : item.status === "Damaged" 
                        ? "destructive" 
                        : "destructive"
                    }
                  >
                    {item.status}
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