"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, FileText } from "lucide-react";

export function LibraryLoanManagementView() {
  const loans = [
    {
      id: "LN-001",
      borrower: "John Doe",
      book: "Effective Java",
      isbn: "978-0134685991",
      checkoutDate: "2023-06-01",
      dueDate: "2023-06-29",
      status: "active",
    },
    {
      id: "LN-002",
      borrower: "Jane Smith",
      book: "Calculus: Early Transcendentals",
      isbn: "978-0135166307",
      checkoutDate: "2023-06-05",
      dueDate: "2023-07-03",
      status: "active",
    },
    {
      id: "LN-003",
      borrower: "Robert Johnson",
      book: "University Physics",
      isbn: "978-0321905759",
      checkoutDate: "2023-05-20",
      dueDate: "2023-06-17",
      status: "overdue",
    },
    {
      id: "LN-004",
      borrower: "Emily Davis",
      book: "Head First Design Patterns",
      isbn: "978-0596009205",
      checkoutDate: "2023-06-10",
      dueDate: "2023-07-08",
      status: "active",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Loan Management</h1>
        <p className="text-muted-foreground">
          Manage book loans, returns, and overdue items.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Active Loans</CardTitle>
              <CardDescription>
                View and manage all active book loans.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search loans..."
                  className="pl-8 md:w-[200px] lg:w-[300px]"
                />
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Loan
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan ID</TableHead>
                <TableHead>Borrower</TableHead>
                <TableHead>Book Title</TableHead>
                <TableHead>ISBN</TableHead>
                <TableHead>Checkout Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium">{loan.id}</TableCell>
                  <TableCell>{loan.borrower}</TableCell>
                  <TableCell>{loan.book}</TableCell>
                  <TableCell>{loan.isbn}</TableCell>
                  <TableCell>{loan.checkoutDate}</TableCell>
                  <TableCell>{loan.dueDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        loan.status === "active"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {loan.status}
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
            <CardTitle>Loan Statistics</CardTitle>
            <CardDescription>
              Overview of loan activity and status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { status: "Active Loans", count: 42, percentage: 75 },
                { status: "Overdue Loans", count: 8, percentage: 15 },
                { status: "Returned Today", count: 5, percentage: 10 },
              ].map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{stat.status}</span>
                    <span>{stat.count} ({stat.percentage}%)</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        stat.status === "Overdue Loans" 
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
              Common loan management tasks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Process Return
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Renew Loan
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Send Overdue Notice
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}