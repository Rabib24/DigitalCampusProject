"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Save, 
  FileText,
  Calendar,
  DollarSign,
  Users,
  BookOpen
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export function GrantApplicationPage() {
  const [application, setApplication] = useState({
    grantName: "",
    projectId: "",
    projectName: "",
    piName: "",
    piEmail: "",
    piDepartment: "",
    startDate: new Date(),
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    requestedAmount: 0,
    totalProjectCost: 0,
    fundingPeriod: 12,
    projectSummary: "",
    objectives: "",
    methodology: "",
    expectedOutcomes: "",
    budgetJustification: "",
    timeline: "",
    teamQualifications: "",
    institutionalSupport: "",
    previousFunding: "",
    otherSupport: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to the backend
    console.log("Grant application data to submit:", application);
    alert("Grant application submitted successfully!");
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Grant Application</h1>
        <p className="text-muted-foreground mt-1">Apply for research funding opportunities</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Grant Information
                </CardTitle>
                <CardDescription>
                  Details about the grant opportunity you're applying for
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="grantName">Grant Name/Program</Label>
                  <Input
                    id="grantName"
                    value={application.grantName}
                    onChange={(e) => setApplication({...application, grantName: e.target.value})}
                    placeholder="Enter the name of the grant program"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectId">Project ID (if applicable)</Label>
                    <Input
                      id="projectId"
                      value={application.projectId}
                      onChange={(e) => setApplication({...application, projectId: e.target.value})}
                      placeholder="Enter project ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      value={application.projectName}
                      onChange={(e) => setApplication({...application, projectName: e.target.value})}
                      placeholder="Enter project name"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Principal Investigator Information
                </CardTitle>
                <CardDescription>
                  Details about the lead researcher
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="piName">Full Name</Label>
                    <Input
                      id="piName"
                      value={application.piName}
                      onChange={(e) => setApplication({...application, piName: e.target.value})}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="piEmail">Email Address</Label>
                    <Input
                      id="piEmail"
                      type="email"
                      value={application.piEmail}
                      onChange={(e) => setApplication({...application, piEmail: e.target.value})}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="piDepartment">Department</Label>
                  <Input
                    id="piDepartment"
                    value={application.piDepartment}
                    onChange={(e) => setApplication({...application, piDepartment: e.target.value})}
                    placeholder="Enter department name"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Project Timeline and Budget
                </CardTitle>
                <CardDescription>
                  Duration and financial details of the project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={application.startDate.toISOString().split('T')[0]}
                      onChange={(e) => setApplication({...application, startDate: new Date(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={application.endDate.toISOString().split('T')[0]}
                      onChange={(e) => setApplication({...application, endDate: new Date(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fundingPeriod">Funding Period (months)</Label>
                    <Input
                      id="fundingPeriod"
                      type="number"
                      min="1"
                      value={application.fundingPeriod}
                      onChange={(e) => setApplication({...application, fundingPeriod: parseInt(e.target.value) || 0})}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requestedAmount">Requested Amount ($)</Label>
                    <Input
                      id="requestedAmount"
                      type="number"
                      min="0"
                      value={application.requestedAmount}
                      onChange={(e) => setApplication({...application, requestedAmount: parseInt(e.target.value) || 0})}
                      placeholder="Enter requested amount"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalProjectCost">Total Project Cost ($)</Label>
                    <Input
                      id="totalProjectCost"
                      type="number"
                      min="0"
                      value={application.totalProjectCost}
                      onChange={(e) => setApplication({...application, totalProjectCost: parseInt(e.target.value) || 0})}
                      placeholder="Enter total project cost"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Project Description
                </CardTitle>
                <CardDescription>
                  Detailed information about your research project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectSummary">Project Summary</Label>
                  <Textarea
                    id="projectSummary"
                    value={application.projectSummary}
                    onChange={(e) => setApplication({...application, projectSummary: e.target.value})}
                    placeholder="Provide a brief summary of your project (200-300 words)"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="objectives">Objectives</Label>
                  <Textarea
                    id="objectives"
                    value={application.objectives}
                    onChange={(e) => setApplication({...application, objectives: e.target.value})}
                    placeholder="List the specific objectives of your project"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="methodology">Methodology</Label>
                  <Textarea
                    id="methodology"
                    value={application.methodology}
                    onChange={(e) => setApplication({...application, methodology: e.target.value})}
                    placeholder="Describe the research methodology and approach"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expectedOutcomes">Expected Outcomes</Label>
                  <Textarea
                    id="expectedOutcomes"
                    value={application.expectedOutcomes}
                    onChange={(e) => setApplication({...application, expectedOutcomes: e.target.value})}
                    placeholder="Describe the expected outcomes and impact of your research"
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Budget and Justification
                </CardTitle>
                <CardDescription>
                  Financial details and justification for funding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="budgetJustification">Budget Justification</Label>
                  <Textarea
                    id="budgetJustification"
                    value={application.budgetJustification}
                    onChange={(e) => setApplication({...application, budgetJustification: e.target.value})}
                    placeholder="Provide detailed justification for the requested budget"
                    rows={5}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
                <CardDescription>
                  Detailed project schedule and milestones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timeline">Timeline and Milestones</Label>
                  <Textarea
                    id="timeline"
                    value={application.timeline}
                    onChange={(e) => setApplication({...application, timeline: e.target.value})}
                    placeholder="Provide a detailed timeline with key milestones and deliverables"
                    rows={5}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team and Support</CardTitle>
                <CardDescription>
                  Information about team qualifications and institutional support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teamQualifications">Team Qualifications</Label>
                  <Textarea
                    id="teamQualifications"
                    value={application.teamQualifications}
                    onChange={(e) => setApplication({...application, teamQualifications: e.target.value})}
                    placeholder="Describe the qualifications and experience of key team members"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="institutionalSupport">Institutional Support</Label>
                  <Textarea
                    id="institutionalSupport"
                    value={application.institutionalSupport}
                    onChange={(e) => setApplication({...application, institutionalSupport: e.target.value})}
                    placeholder="Describe the institutional support and resources available"
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Other Support</CardTitle>
                <CardDescription>
                  Information about other funding sources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="previousFunding">Previous Funding</Label>
                  <Textarea
                    id="previousFunding"
                    value={application.previousFunding}
                    onChange={(e) => setApplication({...application, previousFunding: e.target.value})}
                    placeholder="List any previous funding received for this project"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="otherSupport">Other Support</Label>
                  <Textarea
                    id="otherSupport"
                    value={application.otherSupport}
                    onChange={(e) => setApplication({...application, otherSupport: e.target.value})}
                    placeholder="List any other current or pending support for this project"
                    rows={2}
                  />
                </div>
                
                <Button type="submit" className="w-full mt-4">
                  <Save className="h-4 w-4 mr-2" />
                  Submit Application
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}