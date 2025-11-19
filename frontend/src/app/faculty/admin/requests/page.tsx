"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Calendar,
  BookOpen
} from "lucide-react";

interface StudentRequest {
  id: string;
  studentId: string;
  studentName: string;
  requestType: "course_add" | "course_drop" | "grade_review" | "extension" | "other";
  courseCode?: string;
  courseName?: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  submissionDate: string;
  requestedActionDate?: string;
  priority: "low" | "medium" | "high";
}

export default function StudentRequestApprovalPage() {
  const [requests, setRequests] = useState<StudentRequest[]>([
    {
      id: "1",
      studentId: "S2023001",
      studentName: "Alice Johnson",
      requestType: "course_add",
      courseCode: "CS-305",
      courseName: "Advanced Algorithms",
      description: "Request to add course due to advisor recommendation",
      status: "pending",
      submissionDate: "2023-10-15",
      priority: "medium"
    },
    {
      id: "2",
      studentId: "S2023002",
      studentName: "Bob Smith",
      requestType: "grade_review",
      courseCode: "CS-201",
      courseName: "Data Structures",
      description: "Requesting grade review for midterm exam",
      status: "pending",
      submissionDate: "2023-10-18",
      priority: "high"
    },
    {
      id: "3",
      studentId: "S2023003",
      studentName: "Carol Davis",
      requestType: "extension",
      courseCode: "CS-401",
      courseName: "Capstone Project",
      description: "Requesting 2-week extension for final project submission",
      status: "approved",
      submissionDate: "2023-10-10",
      requestedActionDate: "2023-10-20",
      priority: "medium"
    },
    {
      id: "4",
      studentId: "S2023004",
      studentName: "David Wilson",
      requestType: "course_drop",
      courseCode: "CS-302",
      courseName: "Database Systems",
      description: "Request to drop course due to workload concerns",
      status: "rejected",
      submissionDate: "2023-10-12",
      requestedActionDate: "2023-10-19",
      priority: "low"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const handleApproveRequest = (id: string) => {
    setRequests(requests.map(request => 
      request.id === id 
        ? { ...request, status: "approved", requestedActionDate: new Date().toISOString().split('T')[0] } 
        : request
    ));
  };

  const handleRejectRequest = (id: string) => {
    setRequests(requests.map(request => 
      request.id === id 
        ? { ...request, status: "rejected", requestedActionDate: new Date().toISOString().split('T')[0] } 
        : request
    ));
  };

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case "course_add": return "Course Add";
      case "course_drop": return "Course Drop";
      case "grade_review": return "Grade Review";
      case "extension": return "Extension";
      default: return "Other";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved": return "default";
      case "rejected": return "destructive";
      case "pending": return "outline";
      default: return "default";
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         request.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (request.courseCode && request.courseCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    const matchesType = filterType === "all" || request.requestType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const pendingCount = requests.filter(r => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Student Request Approval</h1>
          <p className="text-muted-foreground">Review and process student requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {pendingCount} pending requests
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                className="p-2 border rounded"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                className="p-2 border rounded"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="course_add">Course Add</option>
                <option value="course_drop">Course Drop</option>
                <option value="grade_review">Grade Review</option>
                <option value="extension">Extension</option>
                <option value="other">Other</option>
              </select>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter size={16} />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <User size={20} className="text-primary" />
                          <CardTitle className="text-lg">
                            {request.studentName} ({request.studentId})
                          </CardTitle>
                        </div>
                        <CardDescription className="mt-1 flex items-center gap-2">
                          <BookOpen size={16} />
                          {request.courseCode ? `${request.courseCode}: ${request.courseName}` : "General Request"}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={getStatusVariant(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                        <Badge variant={getPriorityVariant(request.priority)}>
                          {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <FileText size={16} />
                        <span>{getRequestTypeLabel(request.requestType)}</span>
                        <span>•</span>
                        <Calendar size={16} />
                        <span>Submitted: {new Date(request.submissionDate).toLocaleDateString()}</span>
                        {request.requestedActionDate && (
                          <>
                            <span>•</span>
                            <span>
                              {request.status === "approved" ? "Approved" : "Rejected"}: {new Date(request.requestedActionDate).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-sm">{request.description}</p>
                    </div>
                    
                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="gap-2"
                          onClick={() => handleApproveRequest(request.id)}
                        >
                          <CheckCircle size={16} />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className="gap-2"
                          onClick={() => handleRejectRequest(request.id)}
                        >
                          <XCircle size={16} />
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No requests found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filterStatus !== "all" || filterType !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "No student requests at this time"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}