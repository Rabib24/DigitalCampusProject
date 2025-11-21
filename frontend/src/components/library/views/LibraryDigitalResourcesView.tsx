"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, FileText } from "lucide-react";

export function LibraryDigitalResourcesView() {
  const digitalResources = [
    {
      id: 1,
      title: "IEEE Xplore Digital Library",
      type: "Database",
      category: "Computer Science",
      access: "Institutional",
      status: "active",
    },
    {
      id: 2,
      title: "JSTOR Academic Journal Archive",
      type: "Archive",
      category: "Multidisciplinary",
      access: "Institutional",
      status: "active",
    },
    {
      id: 3,
      title: "MathSciNet",
      type: "Database",
      category: "Mathematics",
      access: "Institutional",
      status: "active",
    },
    {
      id: 4,
      title: "SpringerLink E-books",
      type: "E-book Collection",
      category: "Multidisciplinary",
      access: "Institutional",
      status: "pending",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Digital Resources</h1>
        <p className="text-muted-foreground">
          Manage digital library resources and subscriptions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Digital Resource Collection</CardTitle>
              <CardDescription>
                View and manage all digital resources.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search digital resources..."
                  className="pl-8 md:w-[200px] lg:w-[300px]"
                />
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Resource
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Access</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {digitalResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">{resource.title}</TableCell>
                  <TableCell>{resource.type}</TableCell>
                  <TableCell>{resource.category}</TableCell>
                  <TableCell>{resource.access}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        resource.status === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {resource.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resource Statistics</CardTitle>
            <CardDescription>
              Overview of digital resource usage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "Databases", count: 24, active: 22 },
                { type: "E-book Collections", count: 18, active: 16 },
                { type: "Journal Archives", count: 12, active: 11 },
                { type: "Multimedia Resources", count: 8, active: 7 },
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{stat.type}</p>
                    <p className="text-xs text-muted-foreground">{stat.count} total resources</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{stat.active} active</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Management</CardTitle>
            <CardDescription>
              Track subscription renewals and costs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { resource: "IEEE Xplore", renewal: "2024-03-15", cost: "$12,500" },
                { resource: "JSTOR", renewal: "2024-06-30", cost: "$8,200" },
                { resource: "MathSciNet", renewal: "2024-09-01", cost: "$4,800" },
                { resource: "SpringerLink", renewal: "2024-12-15", cost: "$15,600" },
              ].map((sub, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{sub.resource}</p>
                    <p className="text-xs text-muted-foreground">Renewal: {sub.renewal}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{sub.cost}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}