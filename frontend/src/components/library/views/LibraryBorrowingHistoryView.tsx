"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface BorrowingRecord {
  id: string;
  bookTitle: string;
  bookAuthor: string;
  checkoutDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  status: "returned" | "overdue" | "active";
  fines: number;
}

export function LibraryBorrowingHistoryView() {
  const [records, setRecords] = useState<BorrowingRecord[]>([
    {
      id: "borrow_001",
      bookTitle: "Introduction to Algorithms",
      bookAuthor: "Thomas H. Cormen",
      checkoutDate: new Date("2025-10-15"),
      dueDate: new Date("2025-11-15"),
      returnDate: new Date("2025-11-10"),
      status: "returned",
      fines: 0
    },
    {
      id: "borrow_002",
      bookTitle: "Data Structures and Algorithms in Java",
      bookAuthor: "Michael T. Goodrich",
      checkoutDate: new Date("2025-10-20"),
      dueDate: new Date("2025-11-20"),
      returnDate: new Date("2025-11-25"),
      status: "returned",
      fines: 2.50
    },
    {
      id: "borrow_003",
      bookTitle: "Clean Code: A Handbook of Agile Software Craftsmanship",
      bookAuthor: "Robert C. Martin",
      checkoutDate: new Date("2025-11-01"),
      dueDate: new Date("2025-12-01"),
      returnDate: null,
      status: "active",
      fines: 0
    },
    {
      id: "borrow_004",
      bookTitle: "Design Patterns: Elements of Reusable Object-Oriented Software",
      bookAuthor: "Erich Gamma",
      checkoutDate: new Date("2025-10-05"),
      dueDate: new Date("2025-11-05"),
      returnDate: null,
      status: "overdue",
      fines: 5.00
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "returned":
        return <Badge className="bg-green-100 text-green-800">Returned</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "returned":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "overdue":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "active":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Borrowing History</h1>
        <p className="text-muted-foreground">
          View your borrowing history and current loans
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Books Borrowed
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Loans
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              1 overdue
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overdue Books
            </CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              $5.00 in fines
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Fines
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$7.50</div>
            <p className="text-xs text-muted-foreground">
              $2.50 paid
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Borrowing History</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search books..."
                  className="pl-8 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            List of all borrowed books with status and due dates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {records.map((record) => (
              <div key={record.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{record.bookTitle}</p>
                  <p className="text-xs text-muted-foreground">by {record.bookAuthor}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Checkout Date</p>
                    <p className="text-sm font-medium">{record.checkoutDate.toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="text-sm font-medium">{record.dueDate.toLocaleDateString()}</p>
                  </div>
                  {record.returnDate && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Return Date</p>
                      <p className="text-sm font-medium">{record.returnDate.toLocaleDateString()}</p>
                    </div>
                  )}
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Fines</p>
                    <p className="text-sm font-medium">${record.fines.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(record.status)}
                    {getStatusBadge(record.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}