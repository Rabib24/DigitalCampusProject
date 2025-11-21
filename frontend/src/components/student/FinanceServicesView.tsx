"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CreditCard, 
  Wallet, 
  Calendar, 
  FileText, 
  Download, 
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Bill = {
  id: string;
  term: string;
  dueDate: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  invoiceUrl: string;
};

type PaymentMethod = {
  id: string;
  type: "credit" | "debit" | "bank";
  lastFour: string;
  expiry?: string;
  isDefault: boolean;
};

type Scholarship = {
  id: string;
  name: string;
  amount: number;
  status: "awarded" | "applied" | "pending";
  deadline?: string;
};

type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "payment" | "refund" | "scholarship";
};

export function FinanceServicesView() {
  const [bills] = useState<Bill[]>([
    {
      id: "1",
      term: "Fall 2025",
      dueDate: "2025-12-15",
      amount: 5250.00,
      status: "pending",
      invoiceUrl: "#"
    },
    {
      id: "2",
      term: "Summer 2025",
      dueDate: "2025-08-15",
      amount: 2100.00,
      status: "paid",
      invoiceUrl: "#"
    },
    {
      id: "3",
      term: "Spring 2025",
      dueDate: "2025-05-15",
      amount: 5250.00,
      status: "paid",
      invoiceUrl: "#"
    }
  ]);

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "credit",
      lastFour: "4532",
      expiry: "12/2027",
      isDefault: true
    },
    {
      id: "2",
      type: "bank",
      lastFour: "9876",
      isDefault: false
    }
  ]);

  const [scholarships] = useState<Scholarship[]>([
    {
      id: "1",
      name: "Academic Excellence Scholarship",
      amount: 2500.00,
      status: "awarded"
    },
    {
      id: "2",
      name: "Need-Based Financial Aid",
      amount: 1500.00,
      status: "applied"
    },
    {
      id: "3",
      name: "Computer Science Merit Award",
      amount: 1000.00,
      status: "pending",
      deadline: "2025-12-01"
    }
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      date: "2025-11-15",
      description: "Fall 2025 Tuition Payment",
      amount: 5250.00,
      type: "payment"
    },
    {
      id: "2",
      date: "2025-10-01",
      description: "Academic Excellence Scholarship",
      amount: 2500.00,
      type: "scholarship"
    },
    {
      id: "3",
      date: "2025-09-15",
      description: "Summer 2025 Refund",
      amount: 150.00,
      type: "refund"
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      case "awarded":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Awarded</Badge>;
      case "applied":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Applied</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const totalBalance = bills.reduce((sum, bill) => {
    if (bill.status !== "paid") {
      return sum + bill.amount;
    }
    return sum;
  }, 0);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Finance Services</h2>
        <p className="text-muted-foreground mt-1">Manage your tuition, payments, and financial aid</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Current Balance</div>
                    <div className="text-xl font-bold">${totalBalance.toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Paid This Year</div>
                    <div className="text-xl font-bold">$12,850.00</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Scholarships</div>
                    <div className="text-xl font-bold">$4,000.00</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Billing & Payments
              </CardTitle>
              <CardDescription>
                View and manage your tuition bills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bills.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(bill.status)}
                      <div>
                        <div className="font-medium">{bill.term}</div>
                        <div className="text-sm text-muted-foreground">Due: {bill.dueDate}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-medium">${bill.amount.toFixed(2)}</div>
                        {getStatusBadge(bill.status)}
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      {bill.status !== "paid" && (
                        <Button size="sm">
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Manage your payment options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-muted">
                        {method.type === "credit" || method.type === "debit" ? (
                          <CreditCard className="h-4 w-4" />
                        ) : (
                          <Wallet className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium capitalize">
                          {method.type} ending in {method.lastFour}
                        </div>
                        {method.expiry && (
                          <div className="text-sm text-muted-foreground">Expires {method.expiry}</div>
                        )}
                      </div>
                    </div>
                    {method.isDefault ? (
                      <Badge>Default</Badge>
                    ) : (
                      <Button variant="outline" size="sm">
                        Set Default
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Scholarships & Financial Aid
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scholarships.map((scholarship) => (
                <div key={scholarship.id} className="p-3 rounded-lg border">
                  <div className="font-medium">{scholarship.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    ${scholarship.amount.toFixed(2)}
                  </div>
                  <div className="mt-2">
                    {getStatusBadge(scholarship.status)}
                  </div>
                  {scholarship.deadline && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Deadline: {scholarship.deadline}
                    </div>
                  )}
                </div>
              ))}
              <Button className="w-full">
                Apply for More Aid
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center p-2">
                  <div>
                    <div className="text-sm font-medium">{transaction.description}</div>
                    <div className="text-xs text-muted-foreground">{transaction.date}</div>
                  </div>
                  <div className={`font-medium ${transaction.type === "payment" ? "text-red-600" : "text-green-600"}`}>
                    {transaction.type === "payment" ? "-" : "+"}${transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Transactions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}