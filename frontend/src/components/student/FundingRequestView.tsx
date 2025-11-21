"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FundingRequest {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: "draft" | "submitted" | "under-review" | "approved" | "rejected";
  submissionDate: Date;
  reviewDate?: Date;
  requestedBy: string;
  category: "event" | "project" | "operational" | "travel";
  priority: "low" | "medium" | "high";
}

export function FundingRequestView() {
  const [requests, setRequests] = useState<FundingRequest[]>([
    {
      id: "fund_001",
      title: "Tech Conference Registration",
      description: "Funding request for team registration at the annual tech conference",
      amount: 2500,
      status: "approved",
      submissionDate: new Date("2025-10-15"),
      reviewDate: new Date("2025-10-25"),
      requestedBy: "Computer Science Club",
      category: "event",
      priority: "high"
    },
    {
      id: "fund_002",
      title: "Equipment for Robotics Project",
      description: "Purchase of sensors and components for the robotics competition project",
      amount: 1800,
      status: "under-review",
      submissionDate: new Date("2025-11-05"),
      requestedBy: "Robotics Club",
      category: "project",
      priority: "medium"
    },
    {
      id: "fund_003",
      title: "Annual Club Retreat",
      description: "Funding for venue and meals for the annual club retreat",
      amount: 3200,
      status: "submitted",
      submissionDate: new Date("2025-11-10"),
      requestedBy: "Photography Society",
      category: "event",
      priority: "low"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    amount: "",
    category: "event",
    priority: "medium"
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "submitted":
        return <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>;
      case "under-review":
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "event":
        return <Badge className="bg-purple-100 text-purple-800">Event</Badge>;
      case "project":
        return <Badge className="bg-blue-100 text-blue-800">Project</Badge>;
      case "operational":
        return <Badge className="bg-green-100 text-green-800">Operational</Badge>;
      case "travel":
        return <Badge className="bg-orange-100 text-orange-800">Travel</Badge>;
      default:
        return <Badge>{category}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const handleSubmitRequest = () => {
    if (newRequest.title && newRequest.description && newRequest.amount) {
      const request: FundingRequest = {
        id: `fund_${Date.now()}`,
        title: newRequest.title,
        description: newRequest.description,
        amount: parseFloat(newRequest.amount),
        status: "submitted",
        submissionDate: new Date(),
        requestedBy: "Current User", // This would be the actual user in a real app
        category: newRequest.category as any,
        priority: newRequest.priority as any
      };
      
      setRequests([request, ...requests]);
      setNewRequest({
        title: "",
        description: "",
        amount: "",
        category: "event",
        priority: "medium"
      });
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Funding Requests</h1>
          <p className="text-muted-foreground mt-1">Submit and track funding requests for club activities</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Create Funding Request</CardTitle>
            <CardDescription>
              Submit a new funding request for your club activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Request Title</Label>
              <Input
                id="title"
                value={newRequest.title}
                onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                placeholder="Enter a title for your funding request"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newRequest.description}
                onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                placeholder="Describe the purpose and details of your funding request"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount Requested ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    value={newRequest.amount}
                    onChange={(e) => setNewRequest({...newRequest, amount: e.target.value})}
                    placeholder="0.00"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={newRequest.category} 
                  onValueChange={(value) => setNewRequest({...newRequest, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select 
                  value={newRequest.priority} 
                  onValueChange={(value) => setNewRequest({...newRequest, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitRequest}>
                Submit Request
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {request.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {request.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(request.status)}
                  {getCategoryBadge(request.category)}
                  {getPriorityBadge(request.priority)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Amount</div>
                      <div className="text-sm text-muted-foreground">
                        ${request.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Submitted</div>
                      <div className="text-sm text-muted-foreground">
                        {request.submissionDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium">Requested By</div>
                    <div className="text-sm text-muted-foreground">
                      {request.requestedBy}
                    </div>
                  </div>
                  
                  {request.reviewDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Reviewed</div>
                        <div className="text-sm text-muted-foreground">
                          {request.reviewDate.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-end justify-end">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {requests.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No funding requests found</h3>
            <p className="text-muted-foreground mb-4 text-center">
              There are no funding requests matching your search criteria. Submit a new request to get started.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}