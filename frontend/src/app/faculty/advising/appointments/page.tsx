"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { FacultyAdvisee } from "@/types/faculty";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";

interface Appointment {
  id: string;
  advisee: FacultyAdvisee;
  date: string;
  time: string;
  duration: number; // in minutes
  type: "academic" | "career" | "personal" | "other";
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  notes?: string;
  location: string;
}

export default function AppointmentSchedulingPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [advisees, setAdvisees] = useState<FacultyAdvisee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const [newAppointment, setNewAppointment] = useState({
    adviseeId: "",
    date: "",
    time: "",
    duration: 30,
    type: "academic" as "academic" | "career" | "personal" | "other",
    notes: "",
    location: "Room 205, Building A"
  });

  // Fetch appointments and advisees from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch appointments
        const appointmentsResponse = await fetch('/api/faculty/appointments/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (appointmentsResponse.ok) {
          const appointmentsData = await appointmentsResponse.json();
          setAppointments(appointmentsData.appointments || []);
        }
        
        // Fetch advisees for the dropdown
        const adviseesResponse = await fetch('/api/faculty/advising/advisees/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (adviseesResponse.ok) {
          const adviseesData = await adviseesResponse.json();
          const mappedAdvisees = (adviseesData.advisees || []).map((advisee: any) => ({
            id: advisee.id,
            studentId: advisee.student_id,
            firstName: advisee.first_name,
            lastName: advisee.last_name,
            email: advisee.email,
            program: advisee.program || 'Unknown',
            year: advisee.year || 0,
            gpa: advisee.cgpa || 0
          }));
          setAdvisees(mappedAdvisees);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Mock advisees data - removed as we now fetch from API

  const handleCreateAppointment = async () => {
    if (!newAppointment.adviseeId || !newAppointment.date || !newAppointment.time) {
      alert("Please fill in all required fields");
      return;
    }

    const selectedAdvisee = advisees.find(a => a.id === newAppointment.adviseeId);
    if (!selectedAdvisee) {
      alert("Please select a valid advisee");
      return;
    }

    try {
      const response = await fetch('/api/faculty/appointments/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          student_id: newAppointment.adviseeId,
          date: newAppointment.date,
          time: newAppointment.time,
          duration: newAppointment.duration,
          title: `${newAppointment.type} appointment`,
          notes: newAppointment.notes,
          location: newAppointment.location
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create appointment');
      }

      const data = await response.json();
      
      // Add the new appointment to the list
      const newAppt: Appointment = {
        id: data.appointment.id,
        advisee: selectedAdvisee,
        date: newAppointment.date,
        time: newAppointment.time,
        duration: newAppointment.duration,
        type: newAppointment.type,
        status: "scheduled",
        notes: newAppointment.notes,
        location: newAppointment.location
      };
      
      setAppointments([newAppt, ...appointments]);
      setNewAppointment({
        adviseeId: "",
        date: "",
        time: "",
        duration: 30,
        type: "academic",
        notes: "",
        location: "Room 205, Building A"
      });
      setIsCreating(false);
      alert('Appointment created successfully!');
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment. Please try again.');
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "scheduled": return "default";
      case "completed": return "secondary";
      case "cancelled": return "destructive";
      case "no-show": return "outline";
      default: return "default";
    }
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case "academic": return "default";
      case "career": return "secondary";
      case "personal": return "outline";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled": return <Clock size={16} className="text-blue-500" />;
      case "completed": return <CheckCircle size={16} className="text-green-500" />;
      case "cancelled": return <XCircle size={16} className="text-red-500" />;
      case "no-show": return <AlertCircle size={16} className="text-yellow-500" />;
      default: return <Clock size={16} />;
    }
  };

  const handleUpdateStatus = async (id: string, status: Appointment["status"]) => {
    try {
      const response = await fetch(`/api/faculty/appointments/${id}/status/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment status');
      }

      setAppointments(appointments.map(app => 
        app.id === id ? { ...app, status } : app
      ));
      alert(`Appointment ${status} successfully!`);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Failed to update appointment status. Please try again.');
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      try {
        const response = await fetch(`/api/faculty/appointments/${id}/delete/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete appointment');
        }

        setAppointments(appointments.filter(app => app.id !== id));
        alert('Appointment deleted successfully!');
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Failed to delete appointment. Please try again.');
      }
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.advisee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          appointment.advisee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          appointment.advisee.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || appointment.status === filterStatus;
    const matchesType = filterType === "all" || appointment.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const upcomingAppointments = appointments.filter(a => a.status === "scheduled").length;
  const completedAppointments = appointments.filter(a => a.status === "completed").length;

  return (
    <FacultyProtectedRoute>
      <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Appointment Scheduling</h1>
          <p className="text-muted-foreground">Manage your advising appointments</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus size={18} />
          Schedule Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={20} />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{upcomingAppointments}</div>
            <div className="text-muted-foreground">Scheduled appointments</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle size={20} />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{completedAppointments}</div>
            <div className="text-muted-foreground">This month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">25 hours</div>
            <div className="text-muted-foreground">Available this week</div>
          </CardContent>
        </Card>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Schedule New Appointment</CardTitle>
            <CardDescription>Create a new advising appointment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="advisee">Advisee *</Label>
                <select
                  id="advisee"
                  className="w-full p-2 border rounded"
                  value={newAppointment.adviseeId}
                  onChange={(e) => setNewAppointment({...newAppointment, adviseeId: e.target.value})}
                >
                  <option value="">Select an advisee</option>
                  {advisees.map(advisee => (
                    <option key={advisee.id} value={advisee.id}>
                      {advisee.firstName} {advisee.lastName} ({advisee.studentId})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Appointment Type *</Label>
                <select
                  id="type"
                  className="w-full p-2 border rounded"
                  value={newAppointment.type}
                  onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value as any})}
                >
                  <option value="academic">Academic Advising</option>
                  <option value="career">Career Guidance</option>
                  <option value="personal">Personal Matters</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <select
                  id="duration"
                  className="w-full p-2 border rounded"
                  value={newAppointment.duration}
                  onChange={(e) => setNewAppointment({...newAppointment, duration: parseInt(e.target.value)})}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newAppointment.location}
                  onChange={(e) => setNewAppointment({...newAppointment, location: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                placeholder="Enter appointment notes..."
                value={newAppointment.notes}
                onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleCreateAppointment} className="gap-2">
                <Calendar size={16} />
                Schedule Appointment
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
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                className="p-2 border rounded"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
              </select>
              <select
                className="p-2 border rounded"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="academic">Academic</option>
                <option value="career">Career</option>
                <option value="personal">Personal</option>
                <option value="other">Other</option>
              </select>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter size={16} />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(appointment.status)}
                          <CardTitle className="text-lg">
                            {appointment.advisee.firstName} {appointment.advisee.lastName}
                          </CardTitle>
                        </div>
                        <CardDescription className="mt-1">
                          {appointment.advisee.studentId} • {appointment.advisee.program} Year {appointment.advisee.year}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={getStatusVariant(appointment.status)}>
                          {appointment.status}
                        </Badge>
                        <Badge variant={getTypeVariant(appointment.type)}>
                          {appointment.type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-muted-foreground" />
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-muted-foreground" />
                        <span>{appointment.time} ({appointment.duration} min)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{appointment.location}</span>
                      </div>
                    </div>
                    
                    {appointment.notes && (
                      <div className="mt-3 p-3 bg-muted rounded">
                        <p className="text-sm">{appointment.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {appointment.status === "scheduled" && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleUpdateStatus(appointment.id, "completed")}
                            className="gap-2"
                          >
                            <CheckCircle size={16} />
                            Mark Completed
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleUpdateStatus(appointment.id, "cancelled")}
                            className="gap-2"
                          >
                            <XCircle size={16} />
                            Cancel
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" className="gap-2">
                        <Edit size={16} />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteAppointment(appointment.id)}
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
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No appointments found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filterStatus !== "all" || filterType !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Schedule your first appointment to get started"}
                </p>
                <Button onClick={() => setIsCreating(true)} className="mt-4 gap-2">
                  <Plus size={16} />
                  Schedule Appointment
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    </FacultyProtectedRoute>
  );
}