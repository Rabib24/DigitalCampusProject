"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  User
} from "lucide-react";

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  studentName?: string;
  studentId?: string;
  purpose?: string;
}

interface Appointment {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  purpose: string;
  status: "confirmed" | "pending" | "cancelled";
}

export default function AppointmentScheduler() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Mock data for time slots
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: "1",
      date: new Date().toISOString().split('T')[0],
      startTime: "09:00",
      endTime: "09:30",
      isBooked: true,
      studentName: "Alice Johnson",
      studentId: "S2023001",
      purpose: "Grade review for midterm"
    },
    {
      id: "2",
      date: new Date().toISOString().split('T')[0],
      startTime: "10:00",
      endTime: "10:30",
      isBooked: false
    },
    {
      id: "3",
      date: new Date().toISOString().split('T')[0],
      startTime: "11:00",
      endTime: "11:30",
      isBooked: true,
      studentName: "Bob Smith",
      studentId: "S2023002",
      purpose: "Project discussion"
    },
    {
      id: "4",
      date: new Date().toISOString().split('T')[0],
      startTime: "14:00",
      endTime: "14:30",
      isBooked: false
    },
    {
      id: "5",
      date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
      startTime: "10:00",
      endTime: "10:30",
      isBooked: false
    }
  ]);
  
  // Mock data for appointments
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      studentId: "S2023001",
      studentName: "Alice Johnson",
      date: new Date().toISOString().split('T')[0],
      time: "09:00-09:30",
      purpose: "Grade review for midterm",
      status: "confirmed"
    },
    {
      id: "2",
      studentId: "S2023002",
      studentName: "Bob Smith",
      date: new Date().toISOString().split('T')[0],
      time: "11:00-11:30",
      purpose: "Project discussion",
      status: "confirmed"
    },
    {
      id: "3",
      studentId: "S2023003",
      studentName: "Carol Davis",
      date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
      time: "15:00-15:30",
      purpose: "Course selection advice",
      status: "pending"
    }
  ]);
  
  const [newSlot, setNewSlot] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: "09:00",
    endTime: "09:30"
  });
  
  const handleAddTimeSlot = () => {
    const slot: TimeSlot = {
      id: (timeSlots.length + 1).toString(),
      date: newSlot.date,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      isBooked: false
    };
    
    setTimeSlots([...timeSlots, slot]);
    
    // Reset form
    setNewSlot({
      date: new Date().toISOString().split('T')[0],
      startTime: "09:00",
      endTime: "09:30"
    });
  };
  
  const handleCancelAppointment = (id: string) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: "cancelled" } : app
    ));
  };
  
  const handleConfirmAppointment = (id: string) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: "confirmed" } : app
    ));
  };
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "confirmed": return "default";
      case "pending": return "secondary";
      case "cancelled": return "destructive";
      default: return "default";
    }
  };
  
  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    // Days from previous month to show
    const prevMonthDays = firstDay.getDay();
    // Days from next month to show
    const nextMonthDays = 6 - lastDay.getDay();
    
    const days = [];
    
    // Previous month days
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push(date);
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push(date);
    }
    
    // Next month days
    for (let i = 1; i <= nextMonthDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push(date);
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarDays();
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };
  
  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(app => app.date === dateStr);
  };
  
  const getTimeSlotsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return timeSlots.filter(slot => slot.date === dateStr);
  };
  
  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         app.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointment Scheduler
            </CardTitle>
            <CardDescription>
              Manage your office hours and student appointments
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={view === "calendar" ? "default" : "outline"} 
              onClick={() => setView("calendar")}
            >
              Calendar View
            </Button>
            <Button 
              variant={view === "list" ? "default" : "outline"} 
              onClick={() => setView("list")}
            >
              List View
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {view === "calendar" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-bold">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, index) => {
                const dayAppointments = getAppointmentsForDate(day);
                const daySlots = getTimeSlotsForDate(day);
                const availableSlots = daySlots.filter(slot => !slot.isBooked).length;
                
                return (
                  <div 
                    key={index} 
                    className={`min-h-24 p-2 border rounded-lg ${
                      isToday(day) ? 'bg-primary/10 border-primary' : 
                      isCurrentMonth(day) ? 'bg-background' : 'bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    <div className={`text-right font-medium ${
                      isToday(day) ? 'text-primary' : ''
                    }`}>
                      {day.getDate()}
                    </div>
                    <div className="mt-1 space-y-1">
                      {dayAppointments.slice(0, 2).map(app => (
                        <div 
                          key={app.id} 
                          className="text-xs p-1 bg-primary/10 rounded truncate"
                        >
                          <Badge variant={getStatusVariant(app.status)} className="h-2 w-2 p-0 mr-1" />
                          {app.time}
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayAppointments.length - 2} more
                        </div>
                      )}
                      {availableSlots > 0 && (
                        <div className="text-xs text-green-500">
                          {availableSlots} slot{availableSlots > 1 ? 's' : ''} available
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Add New Time Slot</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <Label htmlFor="slot-date">Date</Label>
                  <Input
                    id="slot-date"
                    type="date"
                    value={newSlot.date}
                    onChange={(e) => setNewSlot({...newSlot, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="slot-start">Start Time</Label>
                  <Input
                    id="slot-start"
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="slot-end">End Time</Label>
                  <Input
                    id="slot-end"
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddTimeSlot} className="w-full gap-2">
                    <Plus size={16} />
                    Add Slot
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
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
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter size={16} />
                  Filter
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{appointment.studentName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {appointment.studentId}
                            </p>
                            <p className="text-sm mt-1">
                              {appointment.purpose}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(appointment.date).toLocaleDateString()}</span>
                              <Clock className="h-4 w-4" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={getStatusVariant(appointment.status)}>
                            {appointment.status}
                          </Badge>
                          <div className="flex gap-1">
                            {appointment.status === "pending" && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleConfirmAppointment(appointment.id)}
                              >
                                Confirm
                              </Button>
                            )}
                            {appointment.status !== "cancelled" && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleCancelAppointment(appointment.id)}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 font-medium">No appointments found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm || filterStatus !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "No appointments scheduled at this time"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}