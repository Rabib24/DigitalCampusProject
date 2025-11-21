"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Award } from "lucide-react";

export function FinanceScholarshipManagementView() {
  const scholarships = [
    {
      id: "SCH-001",
      name: "Merit-Based Scholarship",
      type: "Academic",
      amount: "$5,000",
      recipients: 25,
      status: "active",
    },
    {
      id: "SCH-002",
      name: "Need-Based Scholarship",
      type: "Financial",
      amount: "$3,000",
      recipients: 42,
      status: "active",
    },
    {
      id: "SCH-003",
      name: "Athletic Scholarship",
      type: "Sports",
      amount: "$7,500",
      recipients: 18,
      status: "pending",
    },
    {
      id: "SCH-004",
      name: "Research Grant",
      type: "Academic",
      amount: "$10,000",
      recipients: 12,
      status: "active",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Scholarship Management</h1>
        <p className="text-muted-foreground">
          Manage scholarships, grants, and financial aid programs.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Scholarship Programs</CardTitle>
              <CardDescription>
                View and manage all scholarship and grant programs.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search scholarships..."
                  className="pl-8 md:w-[200px] lg:w-[300px]"
                />
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Scholarship
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scholarship ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scholarships.map((scholarship) => (
                <TableRow key={scholarship.id}>
                  <TableCell className="font-medium">{scholarship.id}</TableCell>
                  <TableCell>{scholarship.name}</TableCell>
                  <TableCell>{scholarship.type}</TableCell>
                  <TableCell>{scholarship.amount}</TableCell>
                  <TableCell>{scholarship.recipients}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        scholarship.status === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {scholarship.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Scholarship Statistics</CardTitle>
            <CardDescription>
              Overview of scholarship distribution and impact.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "Academic Scholarships", count: 18, amount: "$450,000", recipients: 125 },
                { type: "Financial Aid", count: 12, amount: "$280,000", recipients: 98 },
                { type: "Sports Scholarships", count: 6, amount: "$180,000", recipients: 42 },
                { type: "Research Grants", count: 8, amount: "$320,000", recipients: 32 },
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{stat.type}</p>
                    <p className="text-xs text-muted-foreground">{stat.count} programs, {stat.recipients} recipients</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{stat.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funding Sources</CardTitle>
            <CardDescription>
              Track scholarship funding and allocations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { source: "University Budget", percentage: 45, amount: "$550,000" },
                { source: "Government Grants", percentage: 30, amount: "$365,000" },
                { source: "Private Donations", percentage: 20, amount: "$245,000" },
                { source: "Corporate Sponsorships", percentage: 5, amount: "$60,000" },
              ].map((source, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{source.source}</span>
                    <span>{source.percentage}% ({source.amount})</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full">
                    <div 
                      className="h-2 bg-primary rounded-full" 
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}