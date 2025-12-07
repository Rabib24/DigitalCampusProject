"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  X, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Eye
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FacultyApprovalService, type FacultyApprovalRequest } from "@/lib/faculty/approval-requests";

export function FacultyApprovalRequestsView() {
  const [requests, setRequests] = useState<FacultyApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "processed">("pending");
  
  // Load approval requests on component mount
  useEffect(() => {
    loadApprovalRequests();
  }, [activeTab]);

  const loadApprovalRequests = async () => {
    try {
      setLoading(true);
      const data = activeTab === "pending" 
        ? await FacultyApprovalService.getPendingApprovalRequests()
        : await FacultyApprovalService.getAllApprovalRequests();
      
      // Filter by status for processed tab
      if (activeTab === "processed") {
        setRequests(data.filter(req => req.status !== "pending"));
      } else {
        setRequests(data);
      }
    } catch (err) {
      setError("Failed to load approval requests");
      console.error("Requests load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessRequest = async (
    requestId: string, 
    action: 'approve' | 'reject' | 'request_revision',
    notes?: string,
    conditions?: string
  ) => {
    try {
      await FacultyApprovalService.processApprovalRequest(requestId, {
        action,
        notes,
        conditions
      });
      loadApprovalRequests();
    } catch (err) {
      setError(`Failed to ${action} approval request`);
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
      case 'needs_revision':
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500"><AlertCircle className="h-3 w-3 mr-1" />Needs Revision</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getApprovalTypeLabel = (approvalType: string) => {
    switch (approvalType) {
      case 'prerequisite_override':
        return 'Prerequisite Override';
      case 'capacity_override':
        return 'Capacity Override';
      case 'time_period_override':
        return 'Time Period Override';
      case 'restricted_course':
        return 'Restricted Course Access';
      case 'academic_plan_exception':
        return 'Academic Plan Exception';
      case 'other':
        return 'Other';
      default:
        return approvalType;
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
          <h1 className="text-3xl font-bold">Approval Requests</h1>
          <p className="text-muted-foreground">
            Review and process student approval requests requiring faculty approval.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex border-b border-muted mb-6">
        <button
          type="button"
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "pending"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Requests
        </button>
        <button
          type="button"
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "processed"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("processed")}
        >
          Processed Requests
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === "pending" ? "Pending Approval Requests" : "Processed Approval Requests"}
          </CardTitle>
          <CardDescription>
            {activeTab === "pending" 
              ? "Approval requests awaiting your review."
              : "Previously reviewed approval requests."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Student</th>
                  <th className="text-left py-3 px-2">Course</th>
                  <th className="text-left py-3 px-2">Request Type</th>
                  <th className="text-left py-3 px-2">Reason</th>
                  <th className="text-left py-3 px-2">Date Submitted</th>
                  <th className="text-left py-3 px-2">Status</th>
                  {activeTab === "processed" && (
                    <th className="text-left py-3 px-2">Reviewed By</th>
                  )}
                  <th className="text-right py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={activeTab === "processed" ? 8 : 7} className="text-center py-8 text-muted-foreground">
                      {activeTab === "pending" 
                        ? "No pending approval requests." 
                        : "No processed approval requests."}
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2">
                        <div className="font-medium">{request.student_name}</div>
                        <div className="text-sm text-muted-foreground">{request.student_id}</div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="font-medium">{request.course_code}</div>
                        <div className="text-sm text-muted-foreground">{request.course_name}</div>
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant="outline">
                          {getApprovalTypeLabel(request.approval_type)}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 max-w-xs">
                        <div className="text-sm truncate" title={request.reason}>
                          {request.reason}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-sm">
                          {new Date(request.submitted_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        {getStatusBadge(request.status)}
                      </td>
                      {activeTab === "processed" && (
                        <td className="py-3 px-2">
                          <div className="text-sm">
                            {request.faculty_name || "N/A"}
                          </div>
                        </td>
                      )}
                      <td className="py-3 px-2 text-right">
                        <div className="flex justify-end space-x-2">
                          {activeTab === "pending" ? (
                            <>
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
                              <Button 
                                size="sm"
                                variant="ghost"
                                onClick={() => handleProcessRequest(request.id, 'request_revision')}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                Request Revision
                              </Button>
                            </>
                          ) : (
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // In a real implementation, you would show request details
                                alert(`View details for request ${request.id}`);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}