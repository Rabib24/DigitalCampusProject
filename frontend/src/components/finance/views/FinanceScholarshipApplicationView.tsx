"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Upload,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Scholarship {
  id: string;
  name: string;
  description: string;
  amount: number;
  deadline: Date;
  eligibility: string[];
  status: "open" | "closed" | "applied";
}

interface ApplicationForm {
  personalInfo: {
    firstName: string;
    lastName: string;
    studentId: string;
    email: string;
    phone: string;
  };
  academicInfo: {
    gpa: string;
    major: string;
    year: string;
    expectedGraduation: string;
  };
  financialInfo: {
    householdIncome: string;
    familySize: string;
    specialCircumstances: string;
  };
  essay: string;
  documents: File[];
}

export function FinanceScholarshipApplicationView() {
  const [scholarships] = useState<Scholarship[]>([
    {
      id: "sch_001",
      name: "Merit-Based Academic Scholarship",
      description: "Awarded to students with exceptional academic performance",
      amount: 5000,
      deadline: new Date("2025-12-31"),
      eligibility: ["GPA 3.5+", "Full-time enrollment"],
      status: "open"
    },
    {
      id: "sch_002",
      name: "Need-Based Financial Aid",
      description: "Support for students with demonstrated financial need",
      amount: 3000,
      deadline: new Date("2025-12-15"),
      eligibility: ["Financial need documentation", "Enrollment verification"],
      status: "open"
    },
    {
      id: "sch_003",
      name: "STEM Excellence Award",
      description: "For students pursuing degrees in Science, Technology, Engineering, or Mathematics",
      amount: 7500,
      deadline: new Date("2025-11-30"),
      eligibility: ["STEM major", "Minimum 3.0 GPA"],
      status: "applied"
    },
    {
      id: "sch_004",
      name: "Community Service Scholarship",
      description: "Recognition for students with outstanding community service contributions",
      amount: 2500,
      deadline: new Date("2025-10-31"),
      eligibility: ["50+ community service hours", "Essay submission"],
      status: "closed"
    }
  ]);

  const [applicationForm, setApplicationForm] = useState<ApplicationForm>({
    personalInfo: {
      firstName: "",
      lastName: "",
      studentId: "",
      email: "",
      phone: ""
    },
    academicInfo: {
      gpa: "",
      major: "",
      year: "",
      expectedGraduation: ""
    },
    financialInfo: {
      householdIncome: "",
      familySize: "",
      specialCircumstances: ""
    },
    essay: "",
    documents: []
  });

  const [selectedScholarship, setSelectedScholarship] = useState<string>("sch_001");
  const [activeTab, setActiveTab] = useState<"browse" | "apply">("browse");

  const handleInputChange = (section: keyof ApplicationForm, field: string, value: string) => {
    setApplicationForm({
      ...applicationForm,
      [section]: {
        ...applicationForm[section],
        [field]: value
      }
    });
  };

  const handleSubmitApplication = () => {
    alert("Scholarship application submitted successfully!");
    // In a real app, this would send the data to the backend
    setActiveTab("browse");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-green-100 text-green-800">Open</Badge>;
      case "closed":
        return <Badge className="bg-red-100 text-red-800">Closed</Badge>;
      case "applied":
        return <Badge className="bg-blue-100 text-blue-800">Applied</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Scholarship Applications</h1>
        <p className="text-muted-foreground">
          Browse available scholarships and submit your applications
        </p>
      </div>

      <div className="flex gap-2">
        <Button 
          variant={activeTab === "browse" ? "default" : "outline"}
          onClick={() => setActiveTab("browse")}
        >
          Browse Scholarships
        </Button>
        <Button 
          variant={activeTab === "apply" ? "default" : "outline"}
          onClick={() => setActiveTab("apply")}
        >
          Apply for Scholarship
        </Button>
      </div>

      {activeTab === "browse" ? (
        <div className="grid gap-6 md:grid-cols-2">
          {scholarships.map((scholarship) => (
            <Card key={scholarship.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {scholarship.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {scholarship.description}
                    </CardDescription>
                  </div>
                  {getStatusBadge(scholarship.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">${scholarship.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Due: {scholarship.deadline.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Eligibility Requirements</div>
                    <div className="flex flex-wrap gap-1">
                      {scholarship.eligibility.map((req, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    {scholarship.status === "open" ? (
                      <Button 
                        className="flex-1"
                        onClick={() => {
                          setSelectedScholarship(scholarship.id);
                          setActiveTab("apply");
                        }}
                      >
                        Apply Now
                      </Button>
                    ) : scholarship.status === "applied" ? (
                      <Button variant="outline" className="flex-1" disabled>
                        Already Applied
                      </Button>
                    ) : (
                      <Button variant="outline" className="flex-1" disabled>
                        Application Closed
                      </Button>
                    )}
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Apply for Scholarship</CardTitle>
            <CardDescription>
              Complete the application form for {scholarships.find(s => s.id === selectedScholarship)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={applicationForm.personalInfo.firstName}
                      onChange={(e) => handleInputChange("personalInfo", "firstName", e.target.value)}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={applicationForm.personalInfo.lastName}
                      onChange={(e) => handleInputChange("personalInfo", "lastName", e.target.value)}
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      value={applicationForm.personalInfo.studentId}
                      onChange={(e) => handleInputChange("personalInfo", "studentId", e.target.value)}
                      placeholder="Enter your student ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={applicationForm.personalInfo.email}
                      onChange={(e) => handleInputChange("personalInfo", "email", e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={applicationForm.personalInfo.phone}
                      onChange={(e) => handleInputChange("personalInfo", "phone", e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Academic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gpa">Current GPA</Label>
                    <Input
                      id="gpa"
                      value={applicationForm.academicInfo.gpa}
                      onChange={(e) => handleInputChange("academicInfo", "gpa", e.target.value)}
                      placeholder="Enter your current GPA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="major">Major</Label>
                    <Input
                      id="major"
                      value={applicationForm.academicInfo.major}
                      onChange={(e) => handleInputChange("academicInfo", "major", e.target.value)}
                      placeholder="Enter your major"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select 
                      value={applicationForm.academicInfo.year}
                      onValueChange={(value) => handleInputChange("academicInfo", "year", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="freshman">Freshman</SelectItem>
                        <SelectItem value="sophomore">Sophomore</SelectItem>
                        <SelectItem value="junior">Junior</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="graduate">Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedGraduation">Expected Graduation</Label>
                    <Input
                      id="expectedGraduation"
                      type="month"
                      value={applicationForm.academicInfo.expectedGraduation}
                      onChange={(e) => handleInputChange("academicInfo", "expectedGraduation", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Financial Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="householdIncome">Household Annual Income</Label>
                    <Input
                      id="householdIncome"
                      value={applicationForm.financialInfo.householdIncome}
                      onChange={(e) => handleInputChange("financialInfo", "householdIncome", e.target.value)}
                      placeholder="Enter household annual income"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="familySize">Family Size</Label>
                    <Input
                      id="familySize"
                      value={applicationForm.financialInfo.familySize}
                      onChange={(e) => handleInputChange("financialInfo", "familySize", e.target.value)}
                      placeholder="Enter number of family members"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="specialCircumstances">Special Circumstances (Optional)</Label>
                    <Textarea
                      id="specialCircumstances"
                      value={applicationForm.financialInfo.specialCircumstances}
                      onChange={(e) => handleInputChange("financialInfo", "specialCircumstances", e.target.value)}
                      placeholder="Describe any special circumstances that may affect your financial situation"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Personal Essay</h3>
                <div className="space-y-2">
                  <Label htmlFor="essay">Why should you receive this scholarship? (500 words max)</Label>
                  <Textarea
                    id="essay"
                    value={applicationForm.essay}
                    onChange={(e) => handleInputChange("essay", "essay", e.target.value)}
                    placeholder="Write your personal essay here..."
                    rows={6}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Supporting Documents</h3>
                <div className="space-y-2">
                  <Label>Upload Required Documents</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Drag and drop files here or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX up to 10MB</p>
                    <Button variant="outline" className="mt-2">
                      <Upload className="h-4 w-4 mr-2" />
                      Select Files
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setActiveTab("browse")}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitApplication}>
                  Submit Application
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Application Status
          </CardTitle>
          <CardDescription>
            Track the status of your scholarship applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <div className="font-medium">STEM Excellence Award</div>
                <div className="text-sm text-muted-foreground">
                  Submitted on Nov 15, 2025
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <div className="font-medium">Need-Based Financial Aid</div>
                <div className="text-sm text-muted-foreground">
                  Submitted on Oct 30, 2025
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-green-100 text-green-800">Approved</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}