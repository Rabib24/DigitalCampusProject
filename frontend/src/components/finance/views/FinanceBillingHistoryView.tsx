"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Eye } from "lucide-react";

export function FinanceBillingHistoryView() {
  const billingHistory = [
    {
      id: "INV-001",
      customer: "John Doe",
      type: "Tuition Fee",
      amount: "$1,500.00",
      date: "2023-06-15",
      dueDate: "2023-07-15",
      status: "paid",
    },
    {
      id: "INV-002",
      customer: "Jane Smith",
      type: "Library Fee",
      amount: "$150.00",
      date: "2023-06-14",
      dueDate: "2023-07-14",
      status: "paid",
    },
    {
      id: "INV-003",
      customer: "Robert Johnson",
      type: "Tuition Fee",
      amount: "$1,500.00",
      date: "2023-06-10",
      dueDate: "2023-07-10",
      status: "overdue",
    },
    {
      id: "INV-004",
      customer: "Emily Davis",
      type: "Lab Fee",
      amount: "$300.00",
      date: "2023-06-08",
      dueDate: "2023-07-08",
      status: "paid",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing History</h1>
        <p className="text-muted-foreground">
          View and manage all billing records and payment history.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Billing Records</CardTitle>
              <CardDescription>
                View all billing and payment records.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search billing records..."
                  className="pl-8 md:w-[200px] lg:w-[300px]"
                />
              </div>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.id}</TableCell>
                  <TableCell>{record.customer}</TableCell>
                  <TableCell>{record.type}</TableCell>
                  <TableCell>{record.amount}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.dueDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        record.status === "paid"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
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
            <CardTitle>Financial Summary</CardTitle>
            <CardDescription>
              Overview of billing and payment statistics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: "Total Billed", amount: "$124,580.00", change: "+12% from last month" },
                { category: "Total Collected", amount: "$112,340.00", change: "+15% from last month" },
                { category: "Outstanding", amount: "$12,240.00", change: "-3% from last month" },
                { category: "Overdue", amount: "$3,850.00", change: "+8% from last month" },
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{stat.category}</p>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{stat.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collection Statistics</CardTitle>
            <CardDescription>
              Payment collection efficiency metrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { method: "Online Payment", percentage: 65, amount: "$73,021.00" },
                { method: "Bank Transfer", percentage: 25, amount: "$28,085.00" },
                { method: "Cash", percentage: 7, amount: "$7,864.00" },
                { method: "Check", percentage: 3, amount: "$3,370.00" },
              ].map((method, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{method.method}</span>
                    <span>{method.percentage}% ({method.amount})</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full">
                    <div 
                      className="h-2 bg-primary rounded-full" 
                      style={{ width: `${method.percentage}%` }}
                    ></div>
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