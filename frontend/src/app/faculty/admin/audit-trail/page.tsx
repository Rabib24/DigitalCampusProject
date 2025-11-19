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
  Download, 
  Eye, 
  Calendar,
  User,
  Clock,
  Database
} from "lucide-react";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userId: string;
  action: "create" | "update" | "delete" | "view" | "login" | "logout" | "export";
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failed";
  details?: string;
}

export default function AuditTrailPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: "1",
      timestamp: "2023-10-20T09:30:00Z",
      user: "Dr. Jane Smith",
      userId: "F2023001",
      action: "update",
      resource: "Course Gradebook",
      resourceId: "CS-101",
      ipAddress: "192.168.1.105",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/95.0",
      status: "success",
      details: "Updated grades for 25 students in CS-101"
    },
    {
      id: "2",
      timestamp: "2023-10-20T08:45:00Z",
      user: "Prof. John Doe",
      userId: "F2023002",
      action: "create",
      resource: "Assignment",
      resourceId: "CS-205-A1",
      ipAddress: "192.168.1.112",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1",
      status: "success",
      details: "Created new assignment 'Web APIs Project' for CS-205"
    },
    {
      id: "3",
      timestamp: "2023-10-19T16:20:00Z",
      user: "Dr. Emily Wilson",
      userId: "F2023003",
      action: "delete",
      resource: "Course Material",
      resourceId: "CS-301-Notes",
      ipAddress: "192.168.1.98",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/95.0",
      status: "success",
      details: "Deleted outdated lecture notes for CS-301"
    },
    {
      id: "4",
      timestamp: "2023-10-19T14:15:00Z",
      user: "Prof. Robert Brown",
      userId: "F2023004",
      action: "login",
      resource: "Faculty Portal",
      ipAddress: "192.168.1.87",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) Firefox/94.0",
      status: "success"
    },
    {
      id: "5",
      timestamp: "2023-10-19T11:30:00Z",
      user: "Dr. Jane Smith",
      userId: "F2023001",
      action: "export",
      resource: "Student Grades",
      resourceId: "CS-101",
      ipAddress: "192.168.1.105",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/95.0",
      status: "failed",
      details: "Export failed due to permission error"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterUser, setFilterUser] = useState("all");

  const getActionLabel = (action: string) => {
    switch (action) {
      case "create": return "Create";
      case "update": return "Update";
      case "delete": return "Delete";
      case "view": return "View";
      case "login": return "Login";
      case "logout": return "Logout";
      case "export": return "Export";
      default: return action;
    }
  };

  const getActionVariant = (action: string) => {
    switch (action) {
      case "create": return "default";
      case "update": return "secondary";
      case "delete": return "destructive";
      case "view": return "outline";
      case "login": return "default";
      case "logout": return "secondary";
      case "export": return "outline";
      default: return "default";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "success": return "default";
      case "failed": return "destructive";
      default: return "default";
    }
  };

  // Get unique users for filter
  const uniqueUsers = Array.from(new Set(auditLogs.map(log => log.user)));

  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAction = filterAction === "all" || log.action === filterAction;
    const matchesStatus = filterStatus === "all" || log.status === filterStatus;
    const matchesUser = filterUser === "all" || log.user === filterUser;
    
    return matchesSearch && matchesAction && matchesStatus && matchesUser;
  });

  const totalLogs = auditLogs.length;
  const successLogs = auditLogs.filter(l => l.status === "success").length;
  const failedLogs = auditLogs.filter(l => l.status === "failed").length;

  return (
    <FacultyProtectedRoute>
      <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Audit Trail</h1>
          <p className="text-muted-foreground">Track all system activities and user actions</p>
        </div>
        <Button className="gap-2">
          <Download size={18} />
          Export Audit Logs
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database size={20} />
              Total Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalLogs}</div>
            <div className="text-muted-foreground">Audit records</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={20} />
              Successful Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{successLogs}</div>
            <div className="text-muted-foreground">Completed without errors</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} />
              Failed Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{failedLogs}</div>
            <div className="text-muted-foreground">Actions with errors</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search audit logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                className="p-2 border rounded"
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
              >
                <option value="all">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="view">View</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="export">Export</option>
              </select>
              <select
                className="p-2 border rounded"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </select>
              <select
                className="p-2 border rounded"
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
              >
                <option value="all">All Users</option>
                {uniqueUsers.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
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
            {filteredAuditLogs.length > 0 ? (
              filteredAuditLogs.map((log) => (
                <Card key={log.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <User size={20} className="text-primary" />
                          <CardTitle className="text-lg">
                            {log.user} ({log.userId})
                          </CardTitle>
                        </div>
                        <CardDescription className="mt-1 flex items-center gap-2">
                          <span>{getActionLabel(log.action)}</span>
                          <span>•</span>
                          <span>{log.resource}</span>
                          {log.resourceId && (
                            <>
                              <span>•</span>
                              <span>ID: {log.resourceId}</span>
                            </>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={getStatusVariant(log.status)}>
                          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        </Badge>
                        <Badge variant={getActionVariant(log.action)}>
                          {getActionLabel(log.action)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Timestamp</div>
                        <div className="font-medium">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">IP Address</div>
                        <div className="font-medium">{log.ipAddress}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">User Agent</div>
                        <div className="font-medium text-sm truncate">{log.userAgent}</div>
                      </div>
                      {log.details && (
                        <div>
                          <div className="text-sm text-muted-foreground">Details</div>
                          <div className="font-medium text-sm">{log.details}</div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Eye size={16} />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <Database className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No audit logs found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filterAction !== "all" || filterStatus !== "all" || filterUser !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "No audit records available"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    </FacultyProtectedRoute>
  );
}