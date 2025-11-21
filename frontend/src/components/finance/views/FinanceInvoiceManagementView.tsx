"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, FileText } from "lucide-react";

export function FinanceInvoiceManagementView() {
  const invoices = [
    {
      id: "INV-001",
      customer: "John Doe",
      type: "Tuition Fee",
      amount: "$1,500.00",
      date: "2023-06-15",
      dueDate: "2023-07-15",
      status: "sent",
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
      status: "draft",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Invoice Management</h1>
        <p className="text-muted-foreground">
          Create, manage, and track all financial invoices.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>
                View and manage all financial invoices.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  className="pl-8 md:w-[200px] lg:w-[300px]"
                />
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
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
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell>{invoice.type}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        invoice.status === "paid"
                          ? "default"
                          : invoice.status === "sent"
                          ? "secondary"
                          : invoice.status === "overdue"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {invoice.status}
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
            <CardTitle>Invoice Statistics</CardTitle>
            <CardDescription>
              Overview of invoice status and distribution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { status: "Draft", count: 12, percentage: 15 },
                { status: "Sent", count: 45, percentage: 56 },
                { status: "Paid", count: 38, percentage: 47 },
                { status: "Overdue", count: 8, percentage: 10 },
              ].map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{stat.status}</span>
                    <span>{stat.count} invoices ({stat.percentage}%)</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        stat.status === "Overdue" 
                          ? "bg-red-500" 
                          : "bg-primary"
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
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common invoice management tasks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Generate Recurring Invoices
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Send Payment Reminders
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Export Invoices to CSV
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}