"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Check, X, Clock } from "lucide-react";

export function AdminStaffRequestsView() {
  const staffRequests = [
    {
      id: 1,
      requester: "John Doe",
      department: "Computer Science",
      requestType: "Equipment",
      description: "Request for new laptops for lab use",
      status: "pending",
      priority: "high",
      submitted: "2023-06-15",
    },
    {
      id: 2,
      requester: "Jane Smith",
      department: "Mathematics",
      requestType: "Software",
      description: "License for MATLAB for 20 students",
      status: "approved",
      priority: "medium",
      submitted: "2023-06-14",
    },
    {
      id: 3,
      requester: "Robert Johnson",
      department: "Physics",
      requestType: "Facilities",
      description: "Request for lab equipment maintenance",
      status: "rejected",
      priority: "low",
      submitted: "2023-06-12",
    },
    {
      id: 4,
      requester: "Emily Davis",
      department: "Biology",
      requestType: "Personnel",
      description: "Request for additional lab assistant",
      status: "in-progress",
      priority: "high",
      submitted: "2023-06-10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Staff Requests</h1>
        <p className="text-muted-foreground">
          Manage and track staff requests across departments.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Request Management</CardTitle>
              <CardDescription>
                View and process staff requests.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  className="pl-8 md:w-[200px] lg:w-[300px]"
                />
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requester</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.requester}</TableCell>
                  <TableCell>{request.department}</TableCell>
                  <TableCell>{request.requestType}</TableCell>
                  <TableCell className="max-w-xs truncate">{request.description}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.status === "approved"
                          ? "default"
                          : request.status === "pending"
                          ? "secondary"
                          : request.status === "rejected"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.priority === "high"
                          ? "destructive"
                          : request.priority === "medium"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {request.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{request.submitted}</TableCell>
                  <TableCell className="text-right">
                    {request.status === "pending" && (
                      <>
                        <Button variant="ghost" size="icon">
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </>
                    )}
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
            <CardTitle>Request Statistics</CardTitle>
            <CardDescription>
              Overview of request processing metrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { status: "Pending", count: 12, percentage: 35 },
                { status: "Approved", count: 18, percentage: 53 },
                { status: "Rejected", count: 4, percentage: 12 },
              ].map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      {stat.status === "Pending" && <Clock className="mr-2 h-4 w-4 text-yellow-500" />}
                      {stat.status === "Approved" && <Check className="mr-2 h-4 w-4 text-green-500" />}
                      {stat.status === "Rejected" && <X className="mr-2 h-4 w-4 text-red-500" />}
                      {stat.status}
                    </span>
                    <span>{stat.count} requests ({stat.percentage}%)</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        stat.status === "Pending" 
                          ? "bg-yellow-500" 
                          : stat.status === "Approved" 
                          ? "bg-green-500" 
                          : "bg-red-500"
                      }`} 
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Request Distribution</CardTitle>
            <CardDescription>
              Requests by department.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { department: "Computer Science", requests: 15, resolved: 12 },
                { department: "Mathematics", requests: 8, resolved: 7 },
                { department: "Physics", requests: 6, resolved: 5 },
                { department: "Biology", requests: 12, resolved: 9 },
                { department: "Chemistry", requests: 7, resolved: 6 },
              ].map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{dept.department}</p>
                    <p className="text-xs text-muted-foreground">{dept.resolved}/{dept.requests} resolved</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {Math.round((dept.resolved / dept.requests) * 100)}% resolution rate
                    </p>
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