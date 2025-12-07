"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Check, 
  X, 
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AdminSpecialEnrollmentService, type SpecialEnrollmentRequest } from "@/lib/admin/special-enrollment";

export function AdminSpecialEnrollmentView() {
  const [requests, setRequests] = useState<SpecialEnrollmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    student_id: "",
    course_id: "",
    request_type: "",
    reason: ""
  });

  // Load special enrollment requests on component mount
  useEffect(() => {
    loadSpecialEnrollmentRequests();
  }, []);

  const loadSpecialEnrollmentRequests = async () => {
    try {
      setLoading(true);
      const data = await AdminSpecialEnrollmentService.getSpecialEnrollmentRequests();
      setRequests(data);
    } catch (err) {
      setError("Failed to load special enrollment requests");
      console.error("Requests load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    try {
      await AdminSpecialEnrollmentService.createSpecialEnrollmentRequest(formData);
      setShowCreateForm(false);
      setFormData({
        student_id: "",
        course_id: "",
        request_type: "",
        reason: ""
      });
      loadSpecialEnrollmentRequests();
    } catch (err) {
      setError("Failed to create special enrollment request");
      console.error("Create request error:", err);
    }
  };

  const handleProcessRequest = async (requestId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      await AdminSpecialEnrollmentService.processSpecialEnrollmentRequest(requestId, action, reason);
      loadSpecialEnrollmentRequests();
    } catch (err) {
      setError(`Failed to ${action} special enrollment request`);
      console.error(`Process request error:`, err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-500/10 text-green-500"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-500/10 text-red-500"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRequestTypeLabel = (requestType: string) => {
    switch (requestType) {
      case 'prerequisite_override':
        return 'Prerequisite Override';
      case 'capacity_override':
        return 'Capacity Override';
      case 'time_period_override':
        return 'Time Period Override';
      case 'restricted_course':
        return 'Restricted Course Access';
      case 'other':
        return 'Other';
      default:
        return requestType;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Special Enrollment Overrides</h1>
          <p className="text-muted-foreground">
            Manage special enrollment requests that require administrator approval.
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Override Request
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Special Enrollment Request</CardTitle>
            <CardDescription>
              Submit a new special enrollment request for administrator review.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student_id">Student ID</Label>
                <Input
                  id="student_id"
                  value={formData.student_id}
                  onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                  placeholder="Enter student ID"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="course_id">Course ID</Label>
                <Input
                  id="course_id"
                  value={formData.course_id}
                  onChange={(e) => setFormData({...formData, course_id: e.target.value})}
                  placeholder="Enter course ID"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="request_type">Request Type</Label>
                <Select value={formData.request_type} onValueChange={(value) => setFormData({...formData, request_type: value})}>
                  <SelectTrigger id="request_type">
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prerequisite_override">Prerequisite Override</SelectItem>
                    <SelectItem value="capacity_override">Capacity Override</SelectItem>
                    <SelectItem value="time_period_override">Time Period Override</SelectItem>
                    <SelectItem value="restricted_course">Restricted Course Access</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="reason">Reason for Request</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  placeholder="Explain why this special enrollment is needed..."
                  rows={4}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleCreateRequest}>
                <Plus className="mr-2 h-4 w-4" />
                Submit Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>
            Special enrollment requests awaiting administrator review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Request Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.filter(req => req.status === 'pending').map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="font-medium">{request.student_name}</div>
                      <div className="text-sm text-muted-foreground">{request.student_id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{request.course_code}</div>
                      <div className="text-sm text-muted-foreground">{request.course_name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getRequestTypeLabel(request.request_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-sm truncate" title={request.reason}>
                        {request.reason}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(request.requested_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          size="sm"
                          onClick={() => handleProcessRequest(request.id, 'approve')}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleProcessRequest(request.id, 'reject')}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {requests.filter(req => req.status === 'pending').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No pending special enrollment requests.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Processed Requests</CardTitle>
          <CardDescription>
            Previously reviewed special enrollment requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Request Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date Submitted</TableHead>
                  <TableHead>Processed By</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.filter(req => req.status !== 'pending').map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="font-medium">{request.student_name}</div>
                      <div className="text-sm text-muted-foreground">{request.student_id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{request.course_code}</div>
                      <div className="text-sm text-muted-foreground">{request.course_name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getRequestTypeLabel(request.request_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-sm truncate" title={request.reason}>
                        {request.reason}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(request.requested_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {request.processed_by || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request.status)}
                    </TableCell>
                  </TableRow>
                ))}
                {requests.filter(req => req.status !== 'pending').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No processed special enrollment requests.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}