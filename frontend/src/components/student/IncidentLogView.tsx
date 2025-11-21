"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Search,
  Filter,
  Plus,
  Eye,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Incident {
  id: string;
  title: string;
  description: string;
  type: "security" | "medical" | "fire" | "weather" | "technical" | "other";
  severity: "low" | "medium" | "high" | "critical";
  status: "reported" | "investigating" | "resolved" | "closed";
  reportedBy: string;
  reportedAt: Date;
  resolvedAt?: Date;
  location: string;
  responders: string[];
  notes: string;
}

export function IncidentLogView() {
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: "incident_001",
      title: "Fire Alarm Activation",
      description: "Fire alarm activated in Science Building wing B. All occupants evacuated safely.",
      type: "fire",
      severity: "medium",
      status: "closed",
      reportedBy: "Security Desk",
      reportedAt: new Date("2025-11-15T10:30:00"),
      resolvedAt: new Date("2025-11-15T11:15:00"),
      location: "Science Building, Wing B",
      responders: ["Fire Department", "Campus Security", "Facilities"],
      notes: "False alarm caused by overheated equipment in lab 205."
    },
    {
      id: "incident_002",
      title: "Medical Emergency",
      description: "Student reported chest pains during class. Medical team responded and transported to hospital.",
      type: "medical",
      severity: "high",
      status: "closed",
      reportedBy: "Professor Smith",
      reportedAt: new Date("2025-11-12T14:20:00"),
      resolvedAt: new Date("2025-11-12T15:45:00"),
      location: "Engineering Building, Room 101",
      responders: ["Campus Medical", "EMS", "Student Affairs"],
      notes: "Student released from hospital after evaluation. Follow-up counseling arranged."
    },
    {
      id: "incident_003",
      title: "Network Outage",
      description: "Campus-wide network outage affecting internet and internal systems.",
      type: "technical",
      severity: "high",
      status: "resolved",
      reportedBy: "IT Help Desk",
      reportedAt: new Date("2025-11-10T09:15:00"),
      resolvedAt: new Date("2025-11-10T12:30:00"),
      location: "IT Infrastructure",
      responders: ["IT Network Team", "Vendor Support"],
      notes: "Outage caused by failed core router. Backup systems restored service."
    },
    {
      id: "incident_004",
      title: "Suspicious Person Report",
      description: "Report of suspicious individual near dormitories. Security responded and investigated.",
      type: "security",
      severity: "medium",
      status: "closed",
      reportedBy: "Resident Advisor",
      reportedAt: new Date("2025-11-08T22:45:00"),
      resolvedAt: new Date("2025-11-08T23:30:00"),
      location: "North Dormitory Complex",
      responders: ["Campus Security", "Local Police"],
      notes: "Individual was a lost visitor. Proper identification verified and escorted off campus."
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "security":
        return <Badge className="bg-red-100 text-red-800">Security</Badge>;
      case "medical":
        return <Badge className="bg-pink-100 text-pink-800">Medical</Badge>;
      case "fire":
        return <Badge className="bg-orange-100 text-orange-800">Fire</Badge>;
      case "weather":
        return <Badge className="bg-blue-100 text-blue-800">Weather</Badge>;
      case "technical":
        return <Badge className="bg-purple-100 text-purple-800">Technical</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case "critical":
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "reported":
        return <Badge className="bg-gray-100 text-gray-800">Reported</Badge>;
      case "investigating":
        return <Badge className="bg-blue-100 text-blue-800">Investigating</Badge>;
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case "closed":
        return <Badge className="bg-purple-100 text-purple-800">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Incident Log</h1>
          <p className="text-muted-foreground mt-1">View and manage campus incident reports</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search incidents..."
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Report Incident
          </Button>
        </div>
      </div>

      {showCreateForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Report New Incident</CardTitle>
            <CardDescription>
              Document a new campus incident
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Incident Title</label>
                <Input
                  id="title"
                  placeholder="Brief description of the incident"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">Incident Type</label>
                <select 
                  id="type"
                  className="w-full p-2 border rounded-md"
                >
                  <option value="security">Security</option>
                  <option value="medical">Medical</option>
                  <option value="fire">Fire</option>
                  <option value="weather">Weather</option>
                  <option value="technical">Technical</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <textarea
                id="description"
                placeholder="Detailed description of what happened"
                rows={4}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">Location</label>
                <Input
                  id="location"
                  placeholder="Where the incident occurred"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="severity" className="text-sm font-medium">Severity</label>
                <select 
                  id="severity"
                  className="w-full p-2 border rounded-md"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <select 
                  id="status"
                  className="w-full p-2 border rounded-md"
                >
                  <option value="reported">Reported</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">Additional Notes</label>
              <textarea
                id="notes"
                placeholder="Any additional information or follow-up notes"
                rows={3}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button>
                Submit Report
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6">
        {incidents.map((incident) => (
          <Card key={incident.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {incident.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {incident.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getTypeBadge(incident.type)}
                  {getSeverityBadge(incident.severity)}
                  {getStatusBadge(incident.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Reported By</div>
                      <div className="text-sm text-muted-foreground">
                        {incident.reportedBy}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Reported At</div>
                      <div className="text-sm text-muted-foreground">
                        {incident.reportedAt.toLocaleDateString()} at {incident.reportedAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                  
                  {incident.resolvedAt && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Resolved At</div>
                        <div className="text-sm text-muted-foreground">
                          {incident.resolvedAt.toLocaleDateString()} at {incident.resolvedAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium">Location</div>
                    <div className="text-sm text-muted-foreground">
                      {incident.location}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Responders</div>
                    <div className="text-sm text-muted-foreground">
                      {incident.responders.join(", ")}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium">Notes</div>
                    <div className="text-sm text-muted-foreground">
                      {incident.notes}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {incidents.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No incidents found</h3>
            <p className="text-muted-foreground mb-4 text-center">
              There are no incident reports matching your search criteria. Report a new incident to get started.
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Report Incident
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Incident Statistics</CardTitle>
          <CardDescription>
            Overview of campus incidents by type and severity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { type: "Security", count: 12, color: "bg-red-100" },
              { type: "Medical", count: 8, color: "bg-pink-100" },
              { type: "Fire", count: 3, color: "bg-orange-100" },
              { type: "Technical", count: 5, color: "bg-purple-100" }
            ].map((stat, index) => (
              <div key={index} className={`p-4 rounded-lg ${stat.color}`}>
                <div className="text-2xl font-bold">{stat.count}</div>
                <div className="text-sm font-medium">{stat.type} Incidents</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}