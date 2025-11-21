"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, FileText, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinanceDashboardView() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      description: "+20.1% from last month",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Subscriptions",
      value: "1,247",
      description: "+12% from last month",
      icon: Users,
      trend: "up",
    },
    {
      title: "Pending Invoices",
      value: "$12,459.00",
      description: "+5% from last month",
      icon: FileText,
      trend: "up",
    },
    {
      title: "Overdue Payments",
      value: "$1,247.00",
      description: "-15% from last month",
      icon: TrendingDown,
      trend: "down",
    },
  ];

  const recentTransactions = [
    { id: "INV-001", customer: "John Doe", amount: "$150.00", status: "Paid", date: "2023-06-15" },
    { id: "INV-002", customer: "Jane Smith", amount: "$200.00", status: "Pending", date: "2023-06-14" },
    { id: "INV-003", customer: "Robert Johnson", amount: "$89.99", status: "Overdue", date: "2023-06-10" },
    { id: "INV-004", customer: "Emily Davis", amount: "$350.00", status: "Paid", date: "2023-06-08" },
    { id: "INV-005", customer: "Michael Wilson", amount: "$120.50", status: "Pending", date: "2023-06-05" },
  ];

  const monthlyRevenue = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 4500 },
    { month: "May", revenue: 6000 },
    { month: "Jun", revenue: 7000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Finance Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here{`'`}s what{`'`}s happening with your finances today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="flex items-center">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 ml-1" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Latest financial transactions and payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{transaction.customer}</p>
                    <p className="text-xs text-muted-foreground">{transaction.id} • {transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{transaction.amount}</p>
                    <p className={`text-xs ${
                      transaction.status === "Paid" 
                        ? "text-green-500" 
                        : transaction.status === "Pending" 
                        ? "text-yellow-500" 
                        : "text-red-500"
                    }`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>
              Revenue trend over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <div className="flex items-end h-48 gap-2 mt-4">
                {monthlyRevenue.map((data, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-primary rounded-t"
                      style={{ height: `${(data.revenue / 7000) * 100}%` }}
                    ></div>
                    <span className="text-xs mt-2 text-muted-foreground">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">Total Revenue: $25,500</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common financial management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Generate Invoice
            </Button>
            <Button variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Process Payment
            </Button>
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Financial Reports
            </Button>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Subscriptions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}