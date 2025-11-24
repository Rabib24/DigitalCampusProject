"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BarChart3, Download, RefreshCw } from "lucide-react";
import { getAdminReporting } from "@/lib/admin/api";

// Define proper interfaces for report data
interface SummaryData {
  total_users: number;
  total_courses: number;
  total_payments: number;
  total_books: number;
}

interface UserRoleData {
  role: string;
  count: number;
}

interface DepartmentData {
  department: string;
  count: number;
}

interface PaymentTypeData {
  type: string;
  count: number;
  total: number;
}

interface ReportData {
  report_type: string;
  summary?: SummaryData;
  total_users?: number;
  users_by_role?: UserRoleData[];
  recent_registrations?: number;
  total_courses?: number;
  courses_by_department?: DepartmentData[];
  total_enrollments?: number;
  total_payments?: number;
  total_payment_amount?: number;
  payments_by_type?: PaymentTypeData[];
}

export function AdminReportingView() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<string>("summary");

  const fetchReport = async (reportType: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminReporting(reportType);
      setReportData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load report data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(selectedReport);
  }, [selectedReport]);

  const handleExport = () => {
    // In a real implementation, this would export the report data
    alert(`Exporting ${selectedReport} report as CSV`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <p>Generating report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Generate and export detailed system reports
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Generator</CardTitle>
          <CardDescription>
            Select a report type to generate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">System Summary</SelectItem>
                  <SelectItem value="user_summary">User Statistics</SelectItem>
                  <SelectItem value="course_summary">Course Statistics</SelectItem>
                  <SelectItem value="financial_summary">Financial Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {reportData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {reportData.report_type === "summary" && "System Summary Report"}
              {reportData.report_type === "user_summary" && "User Statistics Report"}
              {reportData.report_type === "course_summary" && "Course Statistics Report"}
              {reportData.report_type === "financial_summary" && "Financial Summary Report"}
            </CardTitle>
            <CardDescription>
              Generated on {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.report_type === "summary" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">{reportData.summary?.total_users || 0}</div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">{reportData.summary?.total_courses || 0}</div>
                      <p className="text-sm text-muted-foreground">Total Courses</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">{reportData.summary?.total_payments || 0}</div>
                      <p className="text-sm text-muted-foreground">Total Payments</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">{reportData.summary?.total_books || 0}</div>
                      <p className="text-sm text-muted-foreground">Library Books</p>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {reportData.report_type === "user_summary" && (
                <div className="space-y-4">
                  <div className="text-2xl font-bold">Total Users: {reportData.total_users || 0}</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Users by Role</h3>
                    <div className="space-y-2">
                      {(reportData.users_by_role || []).map((roleData: UserRoleData, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span>{roleData.role}</span>
                          <span>{roleData.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Recent Registrations</h3>
                    <div className="text-2xl font-bold">{reportData.recent_registrations || 0} in last 30 days</div>
                  </div>
                </div>
              )}
              
              {reportData.report_type === "course_summary" && (
                <div className="space-y-4">
                  <div className="text-2xl font-bold">Total Courses: {reportData.total_courses || 0}</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Courses by Department</h3>
                    <div className="space-y-2">
                      {(reportData.courses_by_department || []).map((deptData: DepartmentData, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span>{deptData.department || "Unknown"}</span>
                          <span>{deptData.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Enrollments</h3>
                    <div className="text-2xl font-bold">{reportData.total_enrollments || 0} total enrollments</div>
                  </div>
                </div>
              )}
              
              {reportData.report_type === "financial_summary" && (
                <div className="space-y-4">
                  <div className="text-2xl font-bold">Total Payments: {reportData.total_payments || 0}</div>
                  <div className="text-2xl font-bold">Total Amount: ${reportData.total_payment_amount || 0}</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Payments by Type</h3>
                    <div className="space-y-2">
                      {(reportData.payments_by_type || []).map((typeData: PaymentTypeData, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span>{typeData.type}</span>
                          <span>{typeData.count} (${typeData.total || 0})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}