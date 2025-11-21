"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter,
  Download,
  Eye
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function AdvisorReviewsView() {
  const reviewStats = [
    {
      title: "Pending Reviews",
      value: "12",
      change: "-3 from yesterday",
      icon: Clock
    },
    {
      title: "Completed Reviews",
      value: "28",
      change: "+5 from last week",
      icon: CheckCircle
    },
    {
      title: "Overdue Reviews",
      value: "3",
      change: "-1 from yesterday",
      icon: AlertCircle
    },
    {
      title: "Avg. Review Time",
      value: "2.4 days",
      change: "-0.3 from last week",
      icon: FileText
    }
  ];

  const reviewTypes = [
    { type: "Assignment Reviews", pending: 8, completed: 15, overdue: 2 },
    { type: "Project Reviews", pending: 3, completed: 7, overdue: 1 },
    { type: "Thesis Reviews", pending: 1, completed: 6, overdue: 0 }
  ];

  const submissions = [
    { 
      id: "SUB-001", 
      student: "John Doe", 
      title: "Data Structures Assignment 3", 
      type: "Assignment",
      status: "Pending",
      submitted: "2023-06-15",
      deadline: "2023-06-20"
    },
    { 
      id: "SUB-002", 
      student: "Jane Smith", 
      title: "Machine Learning Project", 
      type: "Project",
      status: "Completed",
      submitted: "2023-06-14",
      deadline: "2023-06-18"
    },
    { 
      id: "SUB-003", 
      student: "Robert Johnson", 
      title: "Physics Lab Report", 
      type: "Assignment",
      status: "Overdue",
      submitted: "2023-06-10",
      deadline: "2023-06-12"
    },
    { 
      id: "SUB-004", 
      student: "Emily Davis", 
      title: "Biology Research Paper", 
      type: "Project",
      status: "Pending",
      submitted: "2023-06-16",
      deadline: "2023-06-25"
    },
    { 
      id: "SUB-005", 
      student: "Michael Wilson", 
      title: "Chemistry Problem Set", 
      type: "Assignment",
      status: "Completed",
      submitted: "2023-06-13",
      deadline: "2023-06-15"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Submission Reviews</h1>
        <p className="text-muted-foreground">
          Review and provide feedback on student submissions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reviewStats.map((stat, index) => (
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
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Review Distribution</CardTitle>
            <CardDescription>
              Pending, completed, and overdue reviews by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviewTypes.map((review, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{review.type}</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Pending</div>
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-yellow-500" 
                          style={{ width: `${(review.pending / 15) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs font-medium">{review.pending}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Completed</div>
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-green-500" 
                          style={{ width: `${(review.completed / 15) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs font-medium">{review.completed}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Overdue</div>
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-red-500" 
                          style={{ width: `${(review.overdue / 15) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs font-medium">{review.overdue}</div>
                    </div>
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
              Common review management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Review Submissions
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Reviews
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Status
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Reviews
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>
            Latest student submissions requiring review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submissions.map((submission, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{submission.title}</p>
                  <p className="text-xs text-muted-foreground">{submission.id} • {submission.student} • {submission.type}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Submitted</p>
                    <p className="text-sm font-medium">{submission.submitted}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Deadline</p>
                    <p className="text-sm font-medium">{submission.deadline}</p>
                  </div>
                  <Badge 
                    variant={
                      submission.status === "Completed" 
                        ? "default" 
                        : submission.status === "Pending" 
                        ? "secondary" 
                        : "destructive"
                    }
                  >
                    {submission.status}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}