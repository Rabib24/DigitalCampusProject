"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  Send,
  History,
  Filter,
  Bell,
  Phone,
  MessageCircle,
  User,
  Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Alert {
  id: string;
  title: string;
  message: string;
  type: "emergency" | "warning" | "information";
  status: "draft" | "sent" | "scheduled";
  audience: string[];
  channels: ("sms" | "email" | "push" | "ivr")[];
  createdAt: Date;
  scheduledFor?: Date;
  sentAt?: Date;
  sentBy: string;
}

export function MassAlertSystemView() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "alert_001",
      title: "Campus Closure - Severe Weather",
      message: "Due to severe weather conditions, the campus will be closed for the remainder of today. All classes and activities are cancelled.",
      type: "emergency",
      status: "sent",
      audience: ["all"],
      channels: ["sms", "email", "push"],
      createdAt: new Date("2025-11-15"),
      sentAt: new Date("2025-11-15T08:30:00"),
      sentBy: "Dr. Sarah Johnson"
    },
    {
      id: "alert_002",
      title: "Fire Drill Reminder",
      message: "Reminder: Monthly fire drill will be conducted tomorrow at 10:00 AM. Please evacuate buildings when you hear the alarm.",
      type: "information",
      status: "sent",
      audience: ["all"],
      channels: ["email", "push"],
      createdAt: new Date("2025-11-10"),
      sentAt: new Date("2025-11-10T14:00:00"),
      sentBy: "Campus Security"
    },
    {
      id: "alert_003",
      title: "Water Main Repair",
      message: "The main water line will be shut down for repairs from 6:00 AM to 10:00 AM on Saturday. Some buildings may have limited water access.",
      type: "warning",
      status: "scheduled",
      audience: ["residents"],
      channels: ["sms", "email"],
      createdAt: new Date("2025-11-18"),
      scheduledFor: new Date("2025-11-22T06:00:00"),
      sentBy: "Facilities Management"
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: "",
    message: "",
    type: "information",
    audience: "all",
    channels: ["email"] as ("sms" | "email" | "push" | "ivr")[]
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "emergency":
        return <Badge className="bg-red-100 text-red-800">Emergency</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case "information":
        return <Badge className="bg-blue-100 text-blue-800">Information</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "sent":
        return <Badge className="bg-green-100 text-green-800">Sent</Badge>;
      case "scheduled":
        return <Badge className="bg-purple-100 text-purple-800">Scheduled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleCreateAlert = () => {
    if (newAlert.title && newAlert.message) {
      const alert: Alert = {
        id: `alert_${Date.now()}`,
        title: newAlert.title,
        message: newAlert.message,
        type: newAlert.type as any,
        status: "draft",
        audience: [newAlert.audience],
        channels: newAlert.channels,
        createdAt: new Date(),
        sentBy: "Current User" // This would be the actual user in a real app
      };
      
      setAlerts([alert, ...alerts]);
      setNewAlert({
        title: "",
        message: "",
        type: "information",
        audience: "all",
        channels: ["email"]
      });
      setShowCreateForm(false);
    }
  };

  const handleSendAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? {...alert, status: "sent", sentAt: new Date()} : alert
    ));
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mass Alert System</h1>
          <p className="text-muted-foreground mt-1">Send and manage campus-wide alerts and notifications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Send className="h-4 w-4 mr-2" />
            Send New Alert
          </Button>
        </div>
      </div>

      {showCreateForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Create New Alert</CardTitle>
            <CardDescription>
              Compose and send a new campus-wide alert
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Alert Title</Label>
              <Input
                id="title"
                value={newAlert.title}
                onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                placeholder="Enter a clear and concise title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={newAlert.message}
                onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                placeholder="Enter the alert message content"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Alert Type</Label>
                <Select 
                  value={newAlert.type} 
                  onValueChange={(value) => setNewAlert({...newAlert, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="information">Information</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Audience</Label>
                <Select 
                  value={newAlert.audience} 
                  onValueChange={(value) => setNewAlert({...newAlert, audience: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students & Staff</SelectItem>
                    <SelectItem value="students">Students Only</SelectItem>
                    <SelectItem value="faculty">Faculty Only</SelectItem>
                    <SelectItem value="residents">Dorm Residents</SelectItem>
                    <SelectItem value="commuters">Commuters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Delivery Channels</Label>
                <div className="space-y-2">
                  {(["sms", "email", "push", "ivr"] as const).map((channel) => (
                    <div key={channel} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`channel-${channel}`}
                        checked={newAlert.channels.includes(channel)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewAlert({
                              ...newAlert,
                              channels: [...newAlert.channels, channel]
                            });
                          } else {
                            setNewAlert({
                              ...newAlert,
                              channels: newAlert.channels.filter(c => c !== channel)
                            });
                          }
                        }}
                      />
                      <label htmlFor={`channel-${channel}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {channel.toUpperCase()}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAlert}>
                Save Draft
              </Button>
              <Button variant="outline">
                Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6">
        {alerts.map((alert) => (
          <Card key={alert.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    {alert.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {alert.message}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getTypeBadge(alert.type)}
                  {getStatusBadge(alert.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Sent By</div>
                      <div className="text-sm text-muted-foreground">
                        {alert.sentBy}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Created</div>
                      <div className="text-sm text-muted-foreground">
                        {alert.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium">Audience</div>
                    <div className="text-sm text-muted-foreground">
                      {alert.audience.join(", ")}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Channels</div>
                    <div className="text-sm text-muted-foreground">
                      {alert.channels.join(", ")}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Status</div>
                      <div className="text-sm text-muted-foreground">
                        {alert.status === "sent" && alert.sentAt 
                          ? `Sent on ${alert.sentAt.toLocaleDateString()} at ${alert.sentAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
                          : alert.status === "scheduled" && alert.scheduledFor
                          ? `Scheduled for ${alert.scheduledFor.toLocaleDateString()} at ${alert.scheduledFor.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
                          : "Not sent"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    {alert.status === "draft" && (
                      <Button onClick={() => handleSendAlert(alert.id)}>
                        <Send className="h-4 w-4 mr-2" />
                        Send Now
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <History className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {alerts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No alerts found</h3>
            <p className="text-muted-foreground mb-4 text-center">
              There are no alerts in the system. Send a new alert to get started.
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Send className="h-4 w-4 mr-2" />
              Send New Alert
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}