"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  Heart,
  MessageCircle,
  Calendar,
  BookOpen
} from "lucide-react";

interface IUBian {
  id: string;
  name: string;
  studentId: string;
  email: string;
  program: string;
  year: number;
  gpa: number;
  interests: string[];
  lastInteraction: string;
  notes?: string;
}

export default function MyIUBianPage() {
  const [iubians, setIubians] = useState<IUBian[]>([
    {
      id: "1",
      name: "Alex Johnson",
      studentId: "S123456",
      email: "alex.johnson@university.edu",
      program: "Computer Science",
      year: 3,
      gpa: 3.75,
      interests: ["Machine Learning", "Web Development", "Data Science"],
      lastInteraction: "2023-10-15T14:30:00Z",
      notes: "Excellent student, showing strong interest in research opportunities"
    },
    {
      id: "2",
      name: "Sarah Williams",
      studentId: "S123457",
      email: "sarah.williams@university.edu",
      program: "Mathematics",
      year: 2,
      gpa: 3.92,
      interests: ["Pure Mathematics", "Statistics", "Research"],
      lastInteraction: "2023-10-10T09:15:00Z",
      notes: "Outstanding academic performance, considering graduate studies"
    },
    {
      id: "3",
      name: "Michael Chen",
      studentId: "S123458",
      email: "michael.chen@university.edu",
      program: "Physics",
      year: 4,
      gpa: 3.68,
      interests: ["Quantum Physics", "Research", "Teaching"],
      lastInteraction: "2023-10-05T11:45:00Z"
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProgram, setFilterProgram] = useState("all");

  const [newIubian, setNewIubian] = useState({
    name: "",
    studentId: "",
    email: "",
    program: "",
    year: 1,
    gpa: 0,
    interests: ""
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<IUBian>>({});

  // Mock data for programs
  const programs = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Biology",
    "Chemistry",
    "Engineering",
    "Business",
    "Psychology"
  ];

  const years = [1, 2, 3, 4, 5];

  const handleAddIubian = () => {
    if (!newIubian.name || !newIubian.studentId || !newIubian.email) {
      alert("Please fill in required fields");
      return;
    }

    const iubian: IUBian = {
      id: (iubians.length + 1).toString(),
      name: newIubian.name,
      studentId: newIubian.studentId,
      email: newIubian.email,
      program: newIubian.program,
      year: newIubian.year,
      gpa: newIubian.gpa,
      interests: newIubian.interests.split(",").map(interest => interest.trim()).filter(interest => interest),
      lastInteraction: new Date().toISOString()
    };

    setIubians([iubian, ...iubians]);
    setNewIubian({
      name: "",
      studentId: "",
      email: "",
      program: "",
      year: 1,
      gpa: 0,
      interests: ""
    });
    setIsAdding(false);
  };

  const handleEditIubian = (iubian: IUBian) => {
    setEditingId(iubian.id);
    setEditData({
      name: iubian.name,
      studentId: iubian.studentId,
      email: iubian.email,
      program: iubian.program,
      year: iubian.year,
      gpa: iubian.gpa,
      interests: iubian.interests.join(", "),
      notes: iubian.notes
    });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;

    setIubians(iubians.map(iubian => 
      iubian.id === editingId 
        ? {
            ...iubian,
            name: editData.name || iubian.name,
            studentId: editData.studentId || iubian.studentId,
            email: editData.email || iubian.email,
            program: editData.program || iubian.program,
            year: editData.year || iubian.year,
            gpa: editData.gpa !== undefined ? editData.gpa : iubian.gpa,
            interests: editData.interests 
              ? editData.interests.split(",").map(interest => interest.trim()).filter(interest => interest)
              : iubian.interests,
            notes: editData.notes
          }
        : iubian
    ));

    setEditingId(null);
  };

  const handleDeleteIubian = (id: string) => {
    if (confirm("Are you sure you want to remove this student from your My IUBian list?")) {
      setIubians(iubians.filter(iubian => iubian.id !== id));
    }
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setIubians(iubians.map(iubian => 
      iubian.id === id ? { ...iubian, notes } : iubian
    ));
  };

  const filteredIubians = iubians.filter(iubian => {
    const matchesSearch = iubian.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         iubian.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         iubian.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         iubian.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterProgram === "all" || iubian.program === filterProgram;
    
    return matchesSearch && matchesFilter;
  });

  const getGpaColor = (gpa: number) => {
    if (gpa >= 3.5) return "text-green-500";
    if (gpa >= 3.0) return "text-blue-500";
    if (gpa >= 2.5) return "text-yellow-500";
    return "text-red-500";
  };

  const totalIubians = iubians.length;
  const avgGpa = iubians.reduce((sum, iubian) => sum + iubian.gpa, 0) / iubians.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My IUBian</h1>
          <p className="text-muted-foreground">Manage your list of students and track their progress</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus size={18} />
          Add Student
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalIubians}</div>
            <div className="text-muted-foreground">In your list</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={20} />
              Average GPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getGpaColor(avgGpa)}`}>
              {avgGpa.toFixed(2)}
            </div>
            <div className="text-muted-foreground">Across all students</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart size={20} />
              Recent Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <div className="text-muted-foreground">This week</div>
          </CardContent>
        </Card>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Student</CardTitle>
            <CardDescription>Add a student to your My IUBian list</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter student's full name"
                  value={newIubian.name}
                  onChange={(e) => setNewIubian({...newIubian, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID *</Label>
                <Input
                  id="studentId"
                  placeholder="Enter student ID"
                  value={newIubian.studentId}
                  onChange={(e) => setNewIubian({...newIubian, studentId: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter student email"
                  value={newIubian.email}
                  onChange={(e) => setNewIubian({...newIubian, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="program">Program</Label>
                <select
                  id="program"
                  className="w-full p-2 border rounded"
                  value={newIubian.program}
                  onChange={(e) => setNewIubian({...newIubian, program: e.target.value})}
                >
                  <option value="">Select a program</option>
                  {programs.map(program => (
                    <option key={program} value={program}>
                      {program}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <select
                  id="year"
                  className="w-full p-2 border rounded"
                  value={newIubian.year}
                  onChange={(e) => setNewIubian({...newIubian, year: parseInt(e.target.value)})}
                >
                  {years.map(year => (
                    <option key={year} value={year}>
                      Year {year}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gpa">Current GPA</Label>
                <Input
                  id="gpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  placeholder="Enter current GPA"
                  value={newIubian.gpa || ""}
                  onChange={(e) => setNewIubian({...newIubian, gpa: parseFloat(e.target.value) || 0})}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="interests">Interests (comma separated)</Label>
                <Input
                  id="interests"
                  placeholder="e.g., Machine Learning, Research, Teaching"
                  value={newIubian.interests}
                  onChange={(e) => setNewIubian({...newIubian, interests: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddIubian} className="gap-2">
                <Plus size={16} />
                Add Student
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
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
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                className="p-2 border rounded"
                value={filterProgram}
                onChange={(e) => setFilterProgram(e.target.value)}
              >
                <option value="all">All Programs</option>
                {programs.map(program => (
                  <option key={program} value={program}>{program}</option>
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
            {filteredIubians.length > 0 ? (
              filteredIubians.map((iubian) => (
                <Card key={iubian.id} className="hover:shadow-md transition-shadow">
                  {editingId === iubian.id ? (
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={editData.name || ""}
                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Student ID</Label>
                          <Input
                            value={editData.studentId || ""}
                            onChange={(e) => setEditData({...editData, studentId: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={editData.email || ""}
                            onChange={(e) => setEditData({...editData, email: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Program</Label>
                          <select
                            className="w-full p-2 border rounded"
                            value={editData.program || ""}
                            onChange={(e) => setEditData({...editData, program: e.target.value})}
                          >
                            <option value="">Select a program</option>
                            {programs.map(program => (
                              <option key={program} value={program}>
                                {program}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Year</Label>
                          <select
                            className="w-full p-2 border rounded"
                            value={editData.year || ""}
                            onChange={(e) => setEditData({...editData, year: parseInt(e.target.value) || 1})}
                          >
                            {years.map(year => (
                              <option key={year} value={year}>
                                Year {year}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>GPA</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max="4"
                            value={editData.gpa || ""}
                            onChange={(e) => setEditData({...editData, gpa: parseFloat(e.target.value) || 0})}
                          />
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label>Interests (comma separated)</Label>
                          <Input
                            value={editData.interests || ""}
                            onChange={(e) => setEditData({...editData, interests: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label>Notes</Label>
                          <Input
                            value={editData.notes || ""}
                            onChange={(e) => setEditData({...editData, notes: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button onClick={handleSaveEdit} className="gap-2">
                          <Edit size={16} />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  ) : (
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center">
                              {iubian.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">{iubian.name}</h3>
                              <p className="text-muted-foreground">{iubian.studentId} • {iubian.email}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="flex items-center gap-2">
                              <BookOpen size={16} className="text-muted-foreground" />
                              <span>{iubian.program} • Year {iubian.year}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${getGpaColor(iubian.gpa)}`}>
                                GPA: {iubian.gpa.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-muted-foreground" />
                              <span>
                                Last interaction: {new Date(iubian.lastInteraction).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            {iubian.interests.map((interest, index) => (
                              <Badge key={index} variant="secondary">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                          
                          {iubian.notes && (
                            <div className="mt-3 p-3 bg-muted rounded">
                              <p className="text-sm">{iubian.notes}</p>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 mt-3">
                            <Input
                              placeholder="Add a note about this student..."
                              defaultValue={iubian.notes}
                              onBlur={(e) => handleUpdateNotes(iubian.id, e.target.value)}
                              className="flex-1"
                            />
                            <Button variant="outline" size="sm" className="gap-2">
                              <MessageCircle size={16} />
                              Message
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditIubian(iubian)}
                            className="gap-2"
                          >
                            <Edit size={16} />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteIubian(iubian.id)}
                            className="gap-2"
                          >
                            <Trash2 size={16} />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <User className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No students found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filterProgram !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Add students to your My IUBian list to get started"}
                </p>
                <Button onClick={() => setIsAdding(true)} className="mt-4 gap-2">
                  <Plus size={16} />
                  Add Student
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}