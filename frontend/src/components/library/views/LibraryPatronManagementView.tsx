"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Users } from "lucide-react";

export function LibraryPatronManagementView() {
  const patrons = [
    {
      id: "PAT-001",
      name: "John Doe",
      type: "Student",
      department: "Computer Science",
      email: "john.doe@university.edu",
      phone: "+1 (555) 123-4567",
      status: "active",
      booksCheckedOut: 3,
      overdueItems: 0,
    },
    {
      id: "PAT-002",
      name: "Jane Smith",
      type: "Faculty",
      department: "Mathematics",
      email: "jane.smith@university.edu",
      phone: "+1 (555) 234-5678",
      status: "active",
      booksCheckedOut: 1,
      overdueItems: 1,
    },
    {
      id: "PAT-003",
      name: "Robert Johnson",
      type: "Student",
      department: "Physics",
      email: "robert.j@university.edu",
      phone: "+1 (555) 345-6789",
      status: "suspended",
      booksCheckedOut: 0,
      overdueItems: 2,
    },
    {
      id: "PAT-004",
      name: "Emily Davis",
      type: "Staff",
      department: "Library",
      email: "emily.d@university.edu",
      phone: "+1 (555) 456-7890",
      status: "active",
      booksCheckedOut: 2,
      overdueItems: 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Patron Management</h1>
        <p className="text-muted-foreground">
          Manage library patrons, accounts, and privileges.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Patron Directory</CardTitle>
              <CardDescription>
                View and manage all library patrons.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patrons..."
                  className="pl-8 md:w-[200px] lg:w-[300px]"
                />
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Patron
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patron ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Checked Out</TableHead>
                <TableHead>Overdue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patrons.map((patron) => (
                <TableRow key={patron.id}>
                  <TableCell className="font-medium">{patron.id}</TableCell>
                  <TableCell>{patron.name}</TableCell>
                  <TableCell>{patron.type}</TableCell>
                  <TableCell>{patron.department}</TableCell>
                  <TableCell>{patron.email}</TableCell>
                  <TableCell>{patron.phone}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        patron.status === "active"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {patron.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{patron.booksCheckedOut}</TableCell>
                  <TableCell>
                    {patron.overdueItems > 0 ? (
                      <Badge variant="destructive">{patron.overdueItems}</Badge>
                    ) : (
                      "0"
                    )}
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
            <CardTitle>Patron Statistics</CardTitle>
            <CardDescription>
              Overview of patron distribution and activity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "Students", count: 2450, percentage: 78 },
                { type: "Faculty", count: 180, percentage: 6 },
                { type: "Staff", count: 120, percentage: 4 },
                { type: "Alumni", count: 350, percentage: 12 },
              ].map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{stat.type}</span>
                    <span>{stat.count} patrons ({stat.percentage}%)</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full">
                    <div 
                      className="h-2 bg-primary rounded-full" 
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Management</CardTitle>
            <CardDescription>
              Patron account actions and privileges.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Import Patrons from CSV
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Export Patron Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Suspend/Activate Accounts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}