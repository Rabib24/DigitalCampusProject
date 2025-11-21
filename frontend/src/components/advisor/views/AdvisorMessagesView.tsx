"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  Plus, 
  Search, 
  Filter, 
  Archive,
  Trash2,
  Reply,
  Forward
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function AdvisorMessagesView() {
  const messageStats = [
    {
      title: "Total Messages",
      value: "142",
      change: "+12 from last week",
      icon: MessageCircle
    },
    {
      title: "Unread Messages",
      value: "8",
      change: "-3 from yesterday",
      icon: MessageCircle
    },
    {
      title: "Sent Messages",
      value: "56",
      change: "+8 from last week",
      icon: Send
    },
    {
      title: "Archived Messages",
      value: "78",
      change: "+5 from last week",
      icon: Archive
    }
  ];

  const messageActivity = [
    { day: "Mon", received: 12, sent: 8 },
    { day: "Tue", received: 15, sent: 10 },
    { day: "Wed", received: 8, sent: 6 },
    { day: "Thu", received: 18, sent: 12 },
    { day: "Fri", received: 14, sent: 9 },
    { day: "Sat", received: 5, sent: 3 },
    { day: "Sun", received: 3, sent: 2 }
  ];

  const conversations = [
    { 
      id: "MSG-001", 
      student: "John Doe", 
      subject: "Academic Progress Discussion", 
      excerpt: "I wanted to discuss my recent grades and...",
      time: "2023-06-15 14:30",
      unread: true,
      priority: "Normal"
    },
    { 
      id: "MSG-002", 
      student: "Jane Smith", 
      subject: "Research Project Update", 
      excerpt: "I've completed the initial phase of my...",
      time: "2023-06-15 11:45",
      unread: false,
      priority: "High"
    },
    { 
      id: "MSG-003", 
      student: "Robert Johnson", 
      subject: "Course Registration Help", 
      excerpt: "I'm having trouble registering for the...",
      time: "2023-06-14 16:20",
      unread: false,
      priority: "Normal"
    },
    { 
      id: "MSG-004", 
      student: "Emily Davis", 
      subject: "Internship Opportunity", 
      excerpt: "I wanted to share an internship opportunity...",
      time: "2023-06-14 10:15",
      unread: false,
      priority: "Low"
    },
    { 
      id: "MSG-005", 
      student: "Michael Wilson", 
      subject: "Graduation Requirements", 
      excerpt: "Could you clarify the requirements for...",
      time: "2023-06-13 13:45",
      unread: true,
      priority: "High"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">
          Communicate with your advisees and manage conversations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {messageStats.map((stat, index) => (
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
            <CardTitle>Message Activity</CardTitle>
            <CardDescription>
              Incoming and outgoing messages over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={messageActivity}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="received" fill="#3b82f6" name="Received" />
                <Bar dataKey="sent" fill="#10b981" name="Sent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common messaging tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Message
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Messages
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Priority
              </Button>
              <Button variant="outline">
                <Archive className="mr-2 h-4 w-4" />
                Archive Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Conversations</CardTitle>
          <CardDescription>
            Latest messages from your advisees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversations.map((conversation, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">{conversation.student}</p>
                    {conversation.unread && (
                      <Badge variant="destructive" className="h-2 w-2 p-0"></Badge>
                    )}
                    <Badge 
                      variant={
                        conversation.priority === "High" 
                          ? "destructive" 
                          : conversation.priority === "Normal" 
                          ? "secondary" 
                          : "outline"
                      }
                    >
                      {conversation.priority}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium mt-1">{conversation.subject}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-md">
                    {conversation.excerpt}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {conversation.time}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Reply className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Forward className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
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