"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function LibraryAnalyticsView() {
  // Sample data for charts
  const checkoutData = [
    { month: "Jan", checkouts: 1200, returns: 1150 },
    { month: "Feb", checkouts: 1400, returns: 1380 },
    { month: "Mar", checkouts: 1600, returns: 1550 },
    { month: "Apr", checkouts: 1300, returns: 1280 },
    { month: "May", checkouts: 1700, returns: 1650 },
    { month: "Jun", checkouts: 1800, returns: 1750 },
  ];

  const popularCategories = [
    { category: "Computer Science", books: 320 },
    { category: "Mathematics", books: 280 },
    { category: "Physics", books: 210 },
    { category: "Biology", books: 190 },
    { category: "Literature", books: 150 },
  ];

  const userActivity = [
    { day: "Mon", visitors: 120, checkouts: 45 },
    { day: "Tue", visitors: 150, checkouts: 52 },
    { day: "Wed", visitors: 180, checkouts: 67 },
    { day: "Thu", visitors: 140, checkouts: 58 },
    { day: "Fri", visitors: 160, checkouts: 72 },
    { day: "Sat", visitors: 90, checkouts: 30 },
    { day: "Sun", visitors: 70, checkouts: 20 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Library Analytics</h1>
        <p className="text-muted-foreground">
          Detailed insights and metrics about library usage and performance.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Checkout Trends</CardTitle>
            <CardDescription>Monthly book checkouts and returns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={checkoutData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="checkouts" fill="#8884d8" name="Checkouts" />
                <Bar dataKey="returns" fill="#82ca9d" name="Returns" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Categories</CardTitle>
            <CardDescription>Most borrowed book categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={popularCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="books"
                  nameKey="category"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
          <CardDescription>Daily visitor count and checkout activity</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="visitors" stroke="#8884d8" name="Visitors" />
              <Line type="monotone" dataKey="checkouts" stroke="#82ca9d" name="Checkouts" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12,487</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3,241</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Overdue Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}