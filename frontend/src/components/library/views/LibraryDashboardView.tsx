"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, FileText, BarChart3, Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LibraryDashboardView() {
  const stats = [
    {
      title: "Total Books",
      value: "12,487",
      description: "+2% from last month",
      icon: BookOpen,
    },
    {
      title: "Active Members",
      value: "3,241",
      description: "+5% from last month",
      icon: Users,
    },
    {
      title: "Books Issued",
      value: "1,247",
      description: "This month",
      icon: FileText,
    },
    {
      title: "Overdue Books",
      value: "89",
      description: "Needs attention",
      icon: Calendar,
    },
  ];

  const recentActivity = [
    { action: "Book issued", user: "John Doe", book: "Introduction to Algorithms", time: "2 minutes ago" },
    { action: "Book returned", user: "Jane Smith", book: "Data Structures in Python", time: "15 minutes ago" },
    { action: "New membership", user: "Robert Johnson", book: "", time: "1 hour ago" },
    { action: "Book renewed", user: "Emily Davis", book: "Machine Learning Basics", time: "2 hours ago" },
  ];

  const popularBooks = [
    { title: "Introduction to Algorithms", author: "Thomas H. Cormen", copies: 5, available: 2 },
    { title: "Clean Code", author: "Robert C. Martin", copies: 3, available: 0 },
    { title: "Design Patterns", author: "Gang of Four", copies: 4, available: 1 },
    { title: "Artificial Intelligence", author: "Stuart Russell", copies: 2, available: 2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Library Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening in the library today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest library transactions and events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{item.action}</p>
                    <p className="text-sm text-muted-foreground">{item.user}</p>
                    {item.book && <p className="text-xs">{item.book}</p>}
                  </div>
                  <div className="ml-auto text-xs text-muted-foreground">
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Books</CardTitle>
            <CardDescription>
              Most borrowed books this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularBooks.map((book, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{book.title}</p>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs">
                      {book.available} of {book.copies} available
                    </p>
                    <div className="w-20 bg-secondary rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-primary h-1.5 rounded-full" 
                        style={{ width: `${(book.available / book.copies) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common library management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button>
              <BookOpen className="mr-2 h-4 w-4" />
              Add New Book
            </Button>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Register Member
            </Button>
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Search Catalog
            </Button>
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Generate Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}