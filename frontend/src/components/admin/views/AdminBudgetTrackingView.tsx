"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function AdminBudgetTrackingView() {
  // Sample data for charts
  const budgetData = [
    { month: "Jan", allocated: 50000, spent: 42000 },
    { month: "Feb", allocated: 50000, spent: 45000 },
    { month: "Mar", allocated: 50000, spent: 48000 },
    { month: "Apr", allocated: 50000, spent: 39000 },
    { month: "May", allocated: 50000, spent: 47000 },
    { month: "Jun", allocated: 50000, spent: 43000 },
  ];

  const departmentBudgetData = [
    { department: "Computer Science", budget: 120000, spent: 98000 },
    { department: "Mathematics", budget: 80000, spent: 72000 },
    { department: "Physics", budget: 90000, spent: 85000 },
    { department: "Biology", budget: 85000, spent: 78000 },
    { department: "Chemistry", budget: 75000, spent: 69000 },
  ];

  const expenseCategories = [
    { name: "Salaries", value: 45 },
    { name: "Equipment", value: 25 },
    { name: "Facilities", value: 15 },
    { name: "Travel", value: 10 },
    { name: "Other", value: 5 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Budget Tracking</h1>
        <p className="text-muted-foreground">
          Monitor departmental budgets and spending patterns.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Budget vs Spending</CardTitle>
            <CardDescription>Comparison of allocated budget vs actual spending</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="allocated" fill="#8884d8" name="Allocated Budget" />
                <Bar dataKey="spent" fill="#82ca9d" name="Actual Spending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Budget Utilization</CardTitle>
            <CardDescription>Budget utilization by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentBudgetData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="department" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="budget" fill="#8884d8" name="Allocated Budget" />
                <Bar dataKey="spent" fill="#82ca9d" name="Actual Spending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spending Trends</CardTitle>
            <CardDescription>Monthly spending patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="spent" stroke="#8884d8" name="Actual Spending" strokeWidth={2} />
                <Line type="monotone" dataKey="allocated" stroke="#82ca9d" name="Allocated Budget" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>Distribution of expenses by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}