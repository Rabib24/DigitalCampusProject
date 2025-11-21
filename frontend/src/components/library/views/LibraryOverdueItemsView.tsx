"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Phone, AlertTriangle } from "lucide-react";

export function LibraryOverdueItemsView() {
  const overdueItems = [
    {
      id: "LN-003",
      borrower: "Robert Johnson",
      book: "University Physics",
      isbn: "978-0321905759",
      checkoutDate: "2023-05-20",
      dueDate: "2023-06-17",
      daysOverdue: 13,
      fine: "$6.50",
      contact: {
        email: "robert.j@university.edu",
        phone: "+1 (555) 123-4567",
      },
    },
    {
      id: "LN-005",
      borrower: "Michael Wilson",
      book: "Organic Chemistry",
      isbn: "978-0321905759",
      checkoutDate: "2023-05-25",
      dueDate: "2023-06-22",
      daysOverdue: 8,
      fine: "$4.00",
      contact: {
        email: "michael.w@university.edu",
        phone: "+1 (555) 234-5678",
      },
    },
    {
      id: "LN-007",
      borrower: "Sarah Brown",
      book: "Data Structures and Algorithms",
      isbn: "978-0134685991",
      checkoutDate: "2023-06-01",
      dueDate: "2023-06-29",
      daysOverdue: 1,
      fine: "$0.50",
      contact: {
        email: "sarah.b@university.edu",
        phone: "+1 (555) 345-6789",
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Overdue Items</h1>
        <p className="text-muted-foreground">
          Track and manage overdue library items and associated fines.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Overdue Items</CardTitle>
              <CardDescription>
                View and manage all overdue library items.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search overdue items..."
                  className="pl-8 md:w-[200px] lg:w-[300px]"
                />
              </div>
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Send Bulk Notices
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
                <TableHead>Due Date</TableHead>
                <TableHead>Days Overdue</TableHead>
                <TableHead>Fine</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overdueItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.borrower}</TableCell>
                  <TableCell>{item.book}</TableCell>
                  <TableCell>{item.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">{item.daysOverdue} days</Badge>
                  </TableCell>
                  <TableCell>{item.fine}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <AlertTriangle className="h-4 w-4" />
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
            <CardTitle>Overdue Statistics</CardTitle>
            <CardDescription>
              Overview of overdue items and associated fines.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: "Total Overdue Items", count: 24, change: "+3 from last week" },
                { category: "Total Outstanding Fines", amount: "$124.50", change: "+$15.20" },
                { category: "Average Days Overdue", days: 7.2, change: "-0.5 days" },
                { category: "Resolved This Week", count: 8, change: "+2 from last week" },
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{stat.category}</p>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {stat.count || stat.amount || `${stat.days} days`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fine Collection</CardTitle>
            <CardDescription>
              Track fine collection and resolution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { method: "Cash", amount: "$42.30", percentage: 34 },
                { method: "Online Payment", amount: "$58.70", percentage: 47 },
                { method: "Waived", amount: "$23.50", percentage: 19 },
              ].map((method, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{method.method}</span>
                    <span>{method.amount} ({method.percentage}%)</span>
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