"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageCircle, 
  Calendar, 
  Clock, 
  User, 
  Send, 
  Phone, 
  Video,
  BookOpen,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Advisor = {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  availability: string;
};

type Message = {
  id: string;
  sender: "student" | "advisor";
  content: string;
  timestamp: string;
  read: boolean;
};

type Appointment = {
  id: string;
  date: string;
  time: string;
  type: "in-person" | "video" | "phone";
  status: "scheduled" | "completed" | "cancelled";
  purpose: string;
};

export function AdvisorCommunicationView() {
  const [advisors] = useState<Advisor[]>([
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      title: "Professor of Computer Science",
      department: "Computer Science",
      email: "s.johnson@university.edu",
      phone: "+1 (555) 123-4567",
      availability: "Mon 2-4 PM, Wed 10-12 PM"
    },
    {
      id: "2",
      name: "Prof. Michael Chen",
      title: "Associate Professor",
      department: "Mathematics",
      email: "m.chen@university.edu",
      phone: "+1 (555) 234-5678",
      availability: "Tue 1-3 PM, Thu 3-5 PM"
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "advisor",
      content: "Thank you for your questions about the course selection. I recommend taking CS-301 next semester as it aligns well with your interests in software development.",
      timestamp: "2025-11-18 14:30",
      read: true
    },
    {
      id: "2",
      sender: "student",
      content: "Thank you, Dr. Johnson. I'll register for CS-301. I also wanted to discuss my internship opportunities for next summer.",
      timestamp: "2025-11-18 15:45",
      read: true
    },
    {
      id: "3",
      sender: "advisor",
      content: "That's great! Let's schedule a meeting to discuss internship opportunities. I have availability next Tuesday at 2 PM.",
      timestamp: "2025-11-19 09:15",
      read: true
    }
  ]);

  const [appointments] = useState<Appointment[]>([
    {
      id: "1",
      date: "2025-11-25",
      time: "14:00",
      type: "video",
      status: "scheduled",
      purpose: "Course selection for Spring 2026"
    },
    {
      id: "2",
      date: "2025-12-02",
      time: "10:00",
      type: "in-person",
      status: "scheduled",
      purpose: "Internship discussion"
    }
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: (messages.length + 1).toString(),
        sender: "student",
        content: newMessage,
        timestamp: new Date().toLocaleString(),
        read: false
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Advisor Communication</h2>
        <p className="text-muted-foreground mt-1">Connect with your academic advisors</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Messages
              </CardTitle>
              <CardDescription>
                Communicate with your advisors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 h-96 overflow-y-auto pr-2">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'student' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div 
                        className={`text-xs mt-1 ${
                          message.sender === 'student' 
                            ? 'text-primary-foreground/70' 
                            : 'text-muted-foreground'
                        }`}
                      >
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                My Advisors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {advisors.map((advisor) => (
                <div key={advisor.id} className="p-3 rounded-lg border">
                  <div className="font-medium">{advisor.name}</div>
                  <div className="text-sm text-muted-foreground">{advisor.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{advisor.department}</div>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="p-3 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">
                        {appointment.date} at {appointment.time}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {appointment.purpose}
                      </div>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    {getTypeIcon(appointment.type)}
                    <span className="capitalize">{appointment.type}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Video className="h-3 w-3 mr-1" />
                      Join
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      Notes
                    </Button>
                  </div>
                </div>
              ))}
              <Button className="w-full mt-2">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule New Appointment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}