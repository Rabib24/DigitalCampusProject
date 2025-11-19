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
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  Users,
  BookOpen,
  Building
} from "lucide-react";

interface TimetableEntry {
  id: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  building: string;
  room: string;
  semester: string;
  year: number;
  studentCount: number;
  capacity: number;
}

export default function TimetableManagementPage() {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([
    {
      id: "1",
      courseCode: "CS-101",
      courseName: "Introduction to Computer Science",
      instructor: "Dr. Jane Smith",
      day: "Monday",
      startTime: "09:00",
      endTime: "10:30",
      location: "Room 205, Building A",
      building: "Building A",
      room: "205",
      semester: "Fall",
      year: 2023,
      studentCount: 45,
      capacity: 50
    },
    {
      id: "2",
      courseCode: "CS-205",
      courseName: "Web Development",
      instructor: "Dr. John Doe",
      day: "Tuesday",
      startTime: "11:00",
      endTime: "12:30",
      location: "Room 301, Building B",
      building: "Building B",
      room: "301",
      semester: "Fall",
      year: 2023,
      studentCount: 32,
      capacity: 40
    },
    {
      id: "3",
      courseCode: "CS-301",
      courseName: "Data Science and Machine Learning",
      instructor: "Prof. Alice Johnson",
      day: "Wednesday",
      startTime: "14:00",
      endTime: "15:30",
      location: "Room 102, Building C",
      building: "Building C",
      room: "102",
      semester: "Fall",
      year: 2023,
      studentCount: 28,
      capacity: 35
    },
    {
      id: "4",
      courseCode: "CS-401",
      courseName: "Capstone Project",
      instructor: "Dr. Robert Brown",
      day: "Thursday",
      startTime: "16:00",
      endTime: "17:30",
      location: "Room 201, Building A",
      building: "Building A",
      room: "201",
      semester: "Fall",
      year: 2023,
      studentCount: 15,
      capacity: 20
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDay, setFilterDay] = useState("all");
  const [filterBuilding, setFilterBuilding] = useState("all");

  const [newEntry, setNewEntry] = useState({
    courseCode: "",
    courseName: "",
    instructor: "",
    day: "Monday",
    startTime: "09:00",
    endTime: "10:30",
    building: "Building A",
    room: "",
    semester: "Fall",
    year: 2023,
    capacity: 30
  });

  // Mock data
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const buildings = ["Building A", "Building B", "Building C", "Building D"];
  const semesters = ["Spring", "Summer", "Fall"];
  const years = [2023, 2024, 2025];
  const hours = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8;
    return hour < 10 ? `0${hour}:00` : `${hour}:00`;
  });

  const handleCreateEntry = () => {
    if (!newEntry.courseCode || !newEntry.courseName || !newEntry.instructor || !newEntry.room) {
      alert("Please fill in required fields");
      return;
    }

    const entry: TimetableEntry = {
      id: (timetable.length + 1).toString(),
      courseCode: newEntry.courseCode,
      courseName: newEntry.courseName,
      instructor: newEntry.instructor,
      day: newEntry.day,
      startTime: newEntry.startTime,
      endTime: newEntry.endTime,
      location: `Room ${newEntry.room}, ${newEntry.building}`,
      building: newEntry.building,
      room: newEntry.room,
      semester: newEntry.semester,
      year: newEntry.year,
      studentCount: 0,
      capacity: newEntry.capacity
    };

    setTimetable([entry, ...timetable]);
    setNewEntry({
      courseCode: "",
      courseName: "",
      instructor: "",
      day: "Monday",
      startTime: "09:00",
      endTime: "10:30",
      building: "Building A",
      room: "",
      semester: "Fall",
      year: 2023,
      capacity: 30
    });
    setIsCreating(false);
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm("Are you sure you want to delete this timetable entry?")) {
      setTimetable(timetable.filter(entry => entry.id !== id));
    }
  };

  const filteredTimetable = timetable.filter(entry => {
    const matchesSearch = entry.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         entry.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDay = filterDay === "all" || entry.day === filterDay;
    const matchesBuilding = filterBuilding === "all" || entry.building === filterBuilding;
    
    return matchesSearch && matchesDay && matchesBuilding;
  });

  const totalClasses = timetable.length;
  const totalStudents = timetable.reduce((sum, entry) => sum + entry.studentCount, 0);
  const avgUtilization = timetable.length > 0 
    ? Math.round((totalStudents / timetable.reduce((sum, entry) => sum + entry.capacity, 0)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Timetable Management</h1>
          <p className="text-muted-foreground">Manage course schedules and classroom allocations</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus size={18} />
          Add Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Total Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalClasses}</div>
            <div className="text-muted-foreground">Scheduled this semester</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStudents}</div>
            <div className="text-muted-foreground">Enrolled across all classes</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building size={20} />
              Avg. Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgUtilization}%</div>
            <div className="text-muted-foreground">Classroom capacity usage</div>
          </CardContent>
        </Card>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Schedule</CardTitle>
            <CardDescription>Create a new timetable entry</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseCode">Course Code *</Label>
                <Input
                  id="courseCode"
                  placeholder="e.g., CS-101"
                  value={newEntry.courseCode}
                  onChange={(e) => setNewEntry({...newEntry, courseCode: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name *</Label>
                <Input
                  id="courseName"
                  placeholder="e.g., Introduction to Computer Science"
                  value={newEntry.courseName}
                  onChange={(e) => setNewEntry({...newEntry, courseName: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor *</Label>
                <Input
                  id="instructor"
                  placeholder="e.g., Dr. Jane Smith"
                  value={newEntry.instructor}
                  onChange={(e) => setNewEntry({...newEntry, instructor: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="day">Day *</Label>
                <select
                  id="day"
                  className="w-full p-2 border rounded"
                  value={newEntry.day}
                  onChange={(e) => setNewEntry({...newEntry, day: e.target.value})}
                >
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <select
                  id="startTime"
                  className="w-full p-2 border rounded"
                  value={newEntry.startTime}
                  onChange={(e) => setNewEntry({...newEntry, startTime: e.target.value})}
                >
                  {hours.map(hour => (
                    <option key={hour} value={hour}>{hour}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time *</Label>
                <select
                  id="endTime"
                  className="w-full p-2 border rounded"
                  value={newEntry.endTime}
                  onChange={(e) => setNewEntry({...newEntry, endTime: e.target.value})}
                >
                  {hours.map(hour => (
                    <option key={hour} value={hour}>{hour}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="building">Building *</Label>
                <select
                  id="building"
                  className="w-full p-2 border rounded"
                  value={newEntry.building}
                  onChange={(e) => setNewEntry({...newEntry, building: e.target.value})}
                >
                  {buildings.map(building => (
                    <option key={building} value={building}>{building}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="room">Room Number *</Label>
                <Input
                  id="room"
                  placeholder="e.g., 205"
                  value={newEntry.room}
                  onChange={(e) => setNewEntry({...newEntry, room: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <select
                  id="semester"
                  className="w-full p-2 border rounded"
                  value={newEntry.semester}
                  onChange={(e) => setNewEntry({...newEntry, semester: e.target.value})}
                >
                  {semesters.map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <select
                  id="year"
                  className="w-full p-2 border rounded"
                  value={newEntry.year}
                  onChange={(e) => setNewEntry({...newEntry, year: parseInt(e.target.value)})}
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Class Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={newEntry.capacity}
                  onChange={(e) => setNewEntry({...newEntry, capacity: parseInt(e.target.value) || 30})}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleCreateEntry} className="gap-2">
                <Plus size={16} />
                Add Schedule
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
                placeholder="Search timetable..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                className="p-2 border rounded"
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
              >
                <option value="all">All Days</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <select
                className="p-2 border rounded"
                value={filterBuilding}
                onChange={(e) => setFilterBuilding(e.target.value)}
              >
                <option value="all">All Buildings</option>
                {buildings.map(building => (
                  <option key={building} value={building}>{building}</option>
                ))}
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
            {filteredTimetable.length > 0 ? (
              filteredTimetable.map((entry) => (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <BookOpen size={20} className="text-primary" />
                          <CardTitle className="text-lg">{entry.courseCode}: {entry.courseName}</CardTitle>
                        </div>
                        <CardDescription className="mt-1">
                          {entry.instructor} • {entry.day} • {entry.startTime} - {entry.endTime}
                        </CardDescription>
                      </div>
                      <Badge variant="default">
                        {entry.semester} {entry.year}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Building size={16} className="text-muted-foreground" />
                        <span>{entry.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-muted-foreground" />
                        <span>{entry.studentCount}/{entry.capacity} students</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-muted-foreground" />
                        <span>{entry.startTime} - {entry.endTime}</span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(entry.studentCount / entry.capacity) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Edit size={16} />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteEntry(entry.id)}
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
                <h3 className="mt-4 font-medium">No timetable entries found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filterDay !== "all" || filterBuilding !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Add your first timetable entry to get started"}
                </p>
                <Button onClick={() => setIsCreating(true)} className="mt-4 gap-2">
                  <Plus size={16} />
                  Add Schedule
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}