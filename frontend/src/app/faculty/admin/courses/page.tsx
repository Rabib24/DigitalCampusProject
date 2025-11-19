"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  Users,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle
} from "lucide-react";

interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  semester: string;
  year: number;
  instructor: string;
  enrollment: number;
  capacity: number;
  status: "active" | "pending" | "archived";
}

export default function DepartmentCourseManagementPage() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      code: "CS-101",
      name: "Introduction to Computer Science",
      department: "Computer Science",
      credits: 3,
      semester: "Fall",
      year: 2023,
      instructor: "Dr. Jane Smith",
      enrollment: 45,
      capacity: 50,
      status: "active"
    },
    {
      id: "2",
      code: "CS-205",
      name: "Web Development",
      department: "Computer Science",
      credits: 3,
      semester: "Fall",
      year: 2023,
      instructor: "Dr. John Doe",
      enrollment: 32,
      capacity: 40,
      status: "active"
    },
    {
      id: "3",
      code: "CS-301",
      name: "Data Science and Machine Learning",
      department: "Computer Science",
      credits: 4,
      semester: "Fall",
      year: 2023,
      instructor: "Prof. Alice Johnson",
      enrollment: 28,
      capacity: 35,
      status: "active"
    },
    {
      id: "4",
      code: "CS-401",
      name: "Capstone Project",
      department: "Computer Science",
      credits: 4,
      semester: "Fall",
      year: 2023,
      instructor: "Dr. Robert Brown",
      enrollment: 15,
      capacity: 20,
      status: "pending"
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [newCourse, setNewCourse] = useState({
    code: "",
    name: "",
    department: "Computer Science",
    credits: 3,
    semester: "Fall",
    year: 2023,
    instructor: "",
    capacity: 30
  });

  // Mock data for departments and instructors
  const departments = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Biology",
    "Chemistry",
    "Engineering"
  ];

  const instructors = [
    "Dr. Jane Smith",
    "Dr. John Doe",
    "Prof. Alice Johnson",
    "Dr. Robert Brown",
    "Prof. Emily Davis"
  ];

  const semesters = ["Spring", "Summer", "Fall"];
  const years = [2023, 2024, 2025];

  const handleCreateCourse = () => {
    if (!newCourse.code || !newCourse.name || !newCourse.instructor) {
      alert("Please fill in required fields");
      return;
    }

    const course: Course = {
      id: (courses.length + 1).toString(),
      code: newCourse.code,
      name: newCourse.name,
      department: newCourse.department,
      credits: newCourse.credits,
      semester: newCourse.semester,
      year: newCourse.year,
      instructor: newCourse.instructor,
      enrollment: 0,
      capacity: newCourse.capacity,
      status: "pending"
    };

    setCourses([course, ...courses]);
    setNewCourse({
      code: "",
      name: "",
      department: "Computer Science",
      credits: 3,
      semester: "Fall",
      year: 2023,
      instructor: "",
      capacity: 30
    });
    setIsCreating(false);
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  const handleApproveCourse = (id: string) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, status: "active" } : course
    ));
  };

  const handleArchiveCourse = (id: string) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, status: "archived" } : course
    ));
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "pending": return "secondary";
      case "archived": return "outline";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle size={16} className="text-green-500" />;
      case "pending": return <Clock size={16} className="text-yellow-500" />;
      case "archived": return <XCircle size={16} className="text-muted-foreground" />;
      default: return <Clock size={16} />;
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || course.department === filterDepartment;
    const matchesStatus = filterStatus === "all" || course.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const activeCourses = courses.filter(c => c.status === "active").length;
  const pendingCourses = courses.filter(c => c.status === "pending").length;
  const totalEnrollment = courses.reduce((sum, course) => sum + course.enrollment, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Department Course Management</h1>
          <p className="text-muted-foreground">Manage courses across all departments</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus size={18} />
          Add Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={20} />
              Total Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{courses.length}</div>
            <div className="text-muted-foreground">Across all departments</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-500" />
              Active Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{activeCourses}</div>
            <div className="text-muted-foreground">Currently running</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              Total Enrollment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalEnrollment}</div>
            <div className="text-muted-foreground">Students enrolled</div>
          </CardContent>
        </Card>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Course</CardTitle>
            <CardDescription>Create a new course for the department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Course Code *</Label>
                <Input
                  id="code"
                  placeholder="e.g., CS-101"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({...newCourse, code: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Course Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Introduction to Computer Science"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <select
                  id="department"
                  className="w-full p-2 border rounded"
                  value={newCourse.department}
                  onChange={(e) => setNewCourse({...newCourse, department: e.target.value})}
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="credits">Credits</Label>
                <select
                  id="credits"
                  className="w-full p-2 border rounded"
                  value={newCourse.credits}
                  onChange={(e) => setNewCourse({...newCourse, credits: parseInt(e.target.value)})}
                >
                  {[1, 2, 3, 4, 5, 6].map(credit => (
                    <option key={credit} value={credit}>{credit} credit{credit > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <select
                  id="semester"
                  className="w-full p-2 border rounded"
                  value={newCourse.semester}
                  onChange={(e) => setNewCourse({...newCourse, semester: e.target.value})}
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
                  value={newCourse.year}
                  onChange={(e) => setNewCourse({...newCourse, year: parseInt(e.target.value)})}
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor *</Label>
                <select
                  id="instructor"
                  className="w-full p-2 border rounded"
                  value={newCourse.instructor}
                  onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
                >
                  <option value="">Select an instructor</option>
                  {instructors.map(instructor => (
                    <option key={instructor} value={instructor}>
                      {instructor}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={newCourse.capacity}
                  onChange={(e) => setNewCourse({...newCourse, capacity: parseInt(e.target.value) || 30})}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleCreateCourse} className="gap-2">
                <Plus size={16} />
                Add Course
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
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                className="p-2 border rounded"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select
                className="p-2 border rounded"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="archived">Archived</option>
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
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <BookOpen size={20} className="text-primary" />
                          <CardTitle className="text-lg">{course.code}: {course.name}</CardTitle>
                        </div>
                        <CardDescription className="mt-1">
                          {course.department} • {course.semester} {course.year} • {course.instructor}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusVariant(course.status)}>
                        {course.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-muted-foreground" />
                        <span>{course.credits} credits</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-muted-foreground" />
                        <span>{course.enrollment}/{course.capacity} enrolled</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-muted-foreground" />
                        <span>{course.semester} {course.year}</span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(course.enrollment / course.capacity) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {course.status === "pending" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleApproveCourse(course.id)}
                          className="gap-2"
                        >
                          <CheckCircle size={16} />
                          Approve
                        </Button>
                      )}
                      {course.status === "active" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleArchiveCourse(course.id)}
                          className="gap-2"
                        >
                          <XCircle size={16} />
                          Archive
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="gap-2">
                        <Edit size={16} />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteCourse(course.id)}
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
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No courses found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filterDepartment !== "all" || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Add your first course to get started"}
                </p>
                <Button onClick={() => setIsCreating(true)} className="mt-4 gap-2">
                  <Plus size={16} />
                  Add Course
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}