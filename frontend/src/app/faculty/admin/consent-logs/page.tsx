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
  CheckCircle,
  XCircle
} from "lucide-react";

interface ConsentLog {
  id: string;
  studentId: string;
  studentName: string;
  consentType: "data_sharing" | "research_participation" | "photo_release" | "activity_waiver" | "other";
  purpose: string;
  status: "granted" | "revoked" | "expired";
  grantedDate: string;
  expiryDate?: string;
  revokedDate?: string;
  facultyMember: string;
  department: string;
}

export default function ConsentLogManagementPage() {
  const [consentLogs, setConsentLogs] = useState<ConsentLog[]>([
    {
      id: "1",
      studentId: "S2023001",
      studentName: "Alice Johnson",
      consentType: "research_participation",
      purpose: "Participation in AI learning behavior study",
      status: "granted",
      grantedDate: "2023-09-15",
      expiryDate: "2024-09-15",
      facultyMember: "Dr. Jane Smith",
      department: "Computer Science"
    },
    {
      id: "2",
      studentId: "S2023002",
      studentName: "Bob Smith",
      consentType: "data_sharing",
      purpose: "Academic performance data sharing for research",
      status: "revoked",
      grantedDate: "2023-08-20",
      revokedDate: "2023-10-10",
      facultyMember: "Prof. John Doe",
      department: "Mathematics"
    },
    {
      id: "3",
      studentId: "S2023003",
      studentName: "Carol Davis",
      consentType: "photo_release",
      purpose: "Use of photos in university promotional materials",
      status: "granted",
      grantedDate: "2023-10-01",
      expiryDate: "2024-10-01",
      facultyMember: "Dr. Emily Wilson",
      department: "Marketing"
    },
    {
      id: "4",
      studentId: "S2023004",
      studentName: "David Wilson",
      consentType: "activity_waiver",
      purpose: "Waiver for annual university sports day",
      status: "expired",
      grantedDate: "2022-10-15",
      expiryDate: "2023-10-15",
      facultyMember: "Prof. Robert Brown",
      department: "Physical Education"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const getConsentTypeLabel = (type: string) => {
    switch (type) {
      case "data_sharing": return "Data Sharing";
      case "research_participation": return "Research Participation";
      case "photo_release": return "Photo Release";
      case "activity_waiver": return "Activity Waiver";
      default: return "Other";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "granted": return "default";
      case "revoked": return "destructive";
      case "expired": return "secondary";
      default: return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "granted": return "Granted";
      case "revoked": return "Revoked";
      case "expired": return "Expired";
      default: return status;
    }
  };

  const filteredConsentLogs = consentLogs.filter(log => {
    const matchesSearch = log.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         log.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.facultyMember.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || log.status === filterStatus;
    const matchesType = filterType === "all" || log.consentType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalConsents = consentLogs.length;
  const activeConsents = consentLogs.filter(c => c.status === "granted").length;
  const revokedConsents = consentLogs.filter(c => c.status === "revoked").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Consent Log Management</h1>
          <p className="text-muted-foreground">Track and manage student consent records</p>
        </div>
        <Button className="gap-2">
          <Download size={18} />
          Export Logs
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} />
              Total Consents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalConsents}</div>
            <div className="text-muted-foreground">All consent records</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle size={20} />
              Active Consents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeConsents}</div>
            <div className="text-muted-foreground">Currently granted</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle size={20} />
              Revoked Consents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{revokedConsents}</div>
            <div className="text-muted-foreground">Revoked by students</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search consent logs..."
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
                <option value="granted">Granted</option>
                <option value="revoked">Revoked</option>
                <option value="expired">Expired</option>
              </select>
              <select
                className="p-2 border rounded"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="data_sharing">Data Sharing</option>
                <option value="research_participation">Research Participation</option>
                <option value="photo_release">Photo Release</option>
                <option value="activity_waiver">Activity Waiver</option>
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
            {filteredConsentLogs.length > 0 ? (
              filteredConsentLogs.map((log) => (
                <Card key={log.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <User size={20} className="text-primary" />
                          <CardTitle className="text-lg">
                            {log.studentName} ({log.studentId})
                          </CardTitle>
                        </div>
                        <CardDescription className="mt-1">
                          {log.purpose}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusVariant(log.status)}>
                        {getStatusText(log.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Consent Type</div>
                        <div className="font-medium">{getConsentTypeLabel(log.consentType)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Faculty Member</div>
                        <div className="font-medium">{log.facultyMember}</div>
                        <div className="text-sm text-muted-foreground">{log.department}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Granted Date</div>
                        <div className="font-medium">{new Date(log.grantedDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        {log.status === "granted" && log.expiryDate && (
                          <>
                            <div className="text-sm text-muted-foreground">Expiry Date</div>
                            <div className="font-medium">{new Date(log.expiryDate).toLocaleDateString()}</div>
                          </>
                        )}
                        {log.status === "revoked" && log.revokedDate && (
                          <>
                            <div className="text-sm text-muted-foreground">Revoked Date</div>
                            <div className="font-medium">{new Date(log.revokedDate).toLocaleDateString()}</div>
                          </>
                        )}
                        {log.status === "expired" && log.expiryDate && (
                          <>
                            <div className="text-sm text-muted-foreground">Expired Date</div>
                            <div className="font-medium">{new Date(log.expiryDate).toLocaleDateString()}</div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Eye size={16} />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Download size={16} />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No consent logs found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filterStatus !== "all" || filterType !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "No consent records available"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}