"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Send
} from "lucide-react";
import { FacultyAdvisee } from "@/types/faculty";

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  remindDate: string;
  adviseeId: string;
  adviseeName: string;
  adviseeEmail: string;
  status: "pending" | "reminded" | "completed" | "overdue";
  notificationSent: boolean;
  completionDate?: string;
}

export default function MilestoneReminderPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "1",
      title: "Declare Specialization",
      description: "Meet with advisor to declare specialization track",
      dueDate: "2024-03-01",
      remindDate: "2024-02-15",
      adviseeId: "S123456",
      adviseeName: "Alex Johnson",
      adviseeEmail: "alex.johnson@university.edu",
      status: "pending",
      notificationSent: false
    },
    {
      id: "2",
      title: "Internship Application",
      description: "Submit applications to at least 3 summer internship positions",
      dueDate: "2024-02-15",
      remindDate: "2024-02-01",
      adviseeId: "S123457",
      adviseeName: "Sarah Williams",
      adviseeEmail: "sarah.williams@university.edu",
      status: "reminded",
      notificationSent: true
    },
    {
      id: "3",
      title: "Thesis Proposal",
      description: "Submit senior thesis research proposal",
      dueDate: "2024-04-01",
      remindDate: "2024-03-15",
      adviseeId: "S123458",
      adviseeName: "Michael Chen",
      adviseeEmail: "michael.chen@university.edu",
      status: "completed",
      notificationSent: true,
      completionDate: "2023-10-15"
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    dueDate: "",
    remindDate: "",
    adviseeId: ""
  });

  // Mock advisees data
  const advisees: FacultyAdvisee[] = [
    {
      id: "1",
      studentId: "S123456",
      firstName: "Alex",
      lastName: "Johnson",
      email: "alex.johnson@university.edu",
      program: "Computer Science",
      year: 3,
      gpa: 3.75
    },
    {
      id: "2",
      studentId: "S123457",
      firstName: "Sarah",
      lastName: "Williams",
      email: "sarah.williams@university.edu",
      program: "Mathematics",
      year: 2,
      gpa: 3.92
    },
    {
      id: "3",
      studentId: "S123458",
      firstName: "Michael",
      lastName: "Chen",
      email: "michael.chen@university.edu",
      program: "Physics",
      year: 4,
      gpa: 3.68
    }
  ];

  const handleCreateMilestone = () => {
    if (!newMilestone.title || !newMilestone.description || !newMilestone.dueDate || !newMilestone.remindDate || !newMilestone.adviseeId) {
      alert("Please fill in all required fields");
      return;
    }

    const selectedAdvisee = advisees.find(a => a.id === newMilestone.adviseeId);
    if (!selectedAdvisee) {
      alert("Please select a valid advisee");
      return;
    }

    const milestone: Milestone = {
      id: (milestones.length + 1).toString(),
      title: newMilestone.title,
      description: newMilestone.description,
      dueDate: newMilestone.dueDate,
      remindDate: newMilestone.remindDate,
      adviseeId: newMilestone.adviseeId,
      adviseeName: `${selectedAdvisee.firstName} ${selectedAdvisee.lastName}`,
      adviseeEmail: selectedAdvisee.email,
      status: "pending",
      notificationSent: false
    };

    setMilestones([milestone, ...milestones]);
    setNewMilestone({
      title: "",
      description: "",
      dueDate: "",
      remindDate: "",
      adviseeId: ""
    });
    setIsCreating(false);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending": return "secondary";
      case "reminded": return "default";
      case "completed": return "default";
      case "overdue": return "destructive";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock size={16} className="text-yellow-500" />;
      case "reminded": return <Bell size={16} className="text-blue-500" />;
      case "completed": return <CheckCircle size={16} className="text-green-500" />;
      case "overdue": return <AlertCircle size={16} className="text-red-500" />;
      default: return <Clock size={16} />;
    }
  };

  const handleSendReminder = (id: string) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === id 
        ? { ...milestone, status: "reminded", notificationSent: true } 
        : milestone
    ));
    alert("Reminder sent to student!");
  };

  const handleMarkCompleted = (id: string) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === id 
        ? { ...milestone, status: "completed", completionDate: new Date().toISOString() } 
        : milestone
    ));
  };

  const handleDeleteMilestone = (id: string) => {
    if (confirm("Are you sure you want to delete this milestone?")) {
      setMilestones(milestones.filter(milestone => milestone.id !== id));
    }
  };

  const filteredMilestones = milestones.filter(milestone => {
    return filterStatus === "all" || milestone.status === filterStatus;
  });

  const pendingMilestones = milestones.filter(m => m.status === "pending").length;
  const remindedMilestones = milestones.filter(m => m.status === "reminded").length;
  const completedMilestones = milestones.filter(m => m.status === "completed").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Milestone Reminders</h1>
          <p className="text-muted-foreground">Track and remind students of important academic milestones</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus size={18} />
          Add Milestone
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={20} className="text-yellow-500" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{pendingMilestones}</div>
            <div className="text-muted-foreground">Milestones awaiting action</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={20} className="text-blue-500" />
              Reminded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{remindedMilestones}</div>
            <div className="text-muted-foreground">Notifications sent</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-500" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{completedMilestones}</div>
            <div className="text-muted-foreground">Milestones finished</div>
          </CardContent>
        </Card>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Milestone</CardTitle>
            <CardDescription>Create a new academic milestone for a student</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Milestone Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Declare Specialization"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                placeholder="Enter milestone description"
                value={newMilestone.description}
                onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newMilestone.dueDate}
                  onChange={(e) => setNewMilestone({...newMilestone, dueDate: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="remindDate">Reminder Date *</Label>
                <Input
                  id="remindDate"
                  type="date"
                  value={newMilestone.remindDate}
                  onChange={(e) => setNewMilestone({...newMilestone, remindDate: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="advisee">Advisee *</Label>
                <select
                  id="advisee"
                  className="w-full p-2 border rounded"
                  value={newMilestone.adviseeId}
                  onChange={(e) => setNewMilestone({...newMilestone, adviseeId: e.target.value})}
                >
                  <option value="">Select an advisee</option>
                  {advisees.map(advisee => (
                    <option key={advisee.id} value={advisee.id}>
                      {advisee.firstName} {advisee.lastName} ({advisee.studentId})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleCreateMilestone} className="gap-2">
                <Plus size={16} />
                Add Milestone
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <CardTitle>Milestone List</CardTitle>
              <CardDescription>View and manage academic milestones</CardDescription>
            </div>
            <div className="flex gap-2">
              <select
                className="p-2 border rounded"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="reminded">Reminded</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMilestones.length > 0 ? (
              filteredMilestones.map((milestone) => (
                <Card key={milestone.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(milestone.status)}
                          <CardTitle className="text-lg">{milestone.title}</CardTitle>
                        </div>
                        <CardDescription className="mt-1">
                          {milestone.description}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusVariant(milestone.status)}>
                        {milestone.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-muted-foreground" />
                        <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bell size={16} className="text-muted-foreground" />
                        <span>Remind: {new Date(milestone.remindDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{milestone.adviseeName}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {milestone.status === "pending" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleSendReminder(milestone.id)}
                          className="gap-2"
                        >
                          <Send size={16} />
                          Send Reminder
                        </Button>
                      )}
                      {milestone.status !== "completed" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleMarkCompleted(milestone.id)}
                          className="gap-2"
                        >
                          <CheckCircle size={16} />
                          Mark Completed
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="gap-2">
                        <Edit size={16} />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteMilestone(milestone.id)}
                        className="gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No milestones found</h3>
                <p className="text-sm text-muted-foreground">
                  {filterStatus !== "all"
                    ? "Try adjusting your filter criteria"
                    : "Add your first milestone to get started"}
                </p>
                <Button onClick={() => setIsCreating(true)} className="mt-4 gap-2">
                  <Plus size={16} />
                  Add Milestone
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}