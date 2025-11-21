"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, Check } from "lucide-react";

export function FinancePaymentTrackingView() {
  const payments = [
    {
      id: "PAY-001",
      customer: "John Doe",
      invoice: "INV-001",
      amount: "$1,500.00",
      date: "2023-06-15",
      method: "Credit Card",
      status: "completed",
    },
    {
      id: "PAY-002",
      customer: "Jane Smith",
      invoice: "INV-002",
      amount: "$150.00",
      date: "2023-06-14",
      method: "Bank Transfer",
      status: "completed",
    },
    {
      id: "PAY-003",
      customer: "Robert Johnson",
      invoice: "INV-003",
      amount: "$1,500.00",
      date: "2023-06-12",
      method: "Check",
      status: "pending",
    },
    {
      id: "PAY-004",
      customer: "Emily Davis",
      invoice: "INV-004",
      amount: "$300.00",
      date: "2023-06-10",
      method: "Cash",
      status: "completed",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment Tracking</h1>
        <p className="text-muted-foreground">
          Monitor and track all financial payments and transactions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Payment Transactions</CardTitle>
              <CardDescription>
                View and track all payment transactions.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  className="pl-8 md:w-[200px] lg:w-[300px]"
                />
              </div>
              <Button>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.customer}</TableCell>
                  <TableCell>{payment.invoice}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        payment.status === "completed"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Check className="h-4 w-4" />
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
            <CardTitle>Payment Statistics</CardTitle>
            <CardDescription>
              Overview of payment methods and success rates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { method: "Credit Card", transactions: 124, amount: "$86,800.00", success: 98 },
                { method: "Bank Transfer", transactions: 87, amount: "$34,200.00", success: 95 },
                { method: "Cash", transactions: 23, amount: "$8,750.00", success: 100 },
                { method: "Check", transactions: 18, amount: "$6,420.00", success: 90 },
              ].map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{stat.method}</span>
                    <span>{stat.transactions} transactions</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Total: {stat.amount}</span>
                    <span>Success: {stat.success}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full">
                    <div 
                      className="h-2 bg-primary rounded-full" 
                      style={{ width: `${stat.success}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Summary</CardTitle>
            <CardDescription>
              Daily and monthly transaction summaries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { period: "Today", transactions: 12, amount: "$4,250.00", change: "+5% from yesterday" },
                { period: "This Week", transactions: 68, amount: "$28,400.00", change: "+12% from last week" },
                { period: "This Month", transactions: 252, amount: "$106,170.00", change: "+8% from last month" },
                { period: "This Year", transactions: 2847, amount: "$1,247,850.00", change: "+15% from last year" },
              ].map((summary, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{summary.period}</p>
                    <p className="text-xs text-muted-foreground">{summary.change}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{summary.transactions} transactions</p>
                    <p className="text-xs text-muted-foreground">{summary.amount}</p>
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