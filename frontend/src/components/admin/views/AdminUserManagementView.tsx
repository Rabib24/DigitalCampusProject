"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, UserPlus } from "lucide-react";

export function AdminUserManagementView() {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@university.edu",
      role: "faculty",
      status: "active",
      lastLogin: "2023-06-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@university.edu",
      role: "student",
      status: "active",
      lastLogin: "2023-06-14",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert.j@university.edu",
      role: "admin",
      status: "active",
      lastLogin: "2023-06-15",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.d@university.edu",
      role: "faculty",
      status: "pending",
      lastLogin: "Never",
    },
    {
      id: 5,
      name: "Michael Wilson",
      email: "michael.w@university.edu",
      role: "student",
      status: "suspended",
      lastLogin: "2023-06-10",
    },
  ];

  const roles = [
    { value: "admin", label: "Administrator" },
    { value: "faculty", label: "Faculty" },
    { value: "student", label: "Student" },
    { value: "staff", label: "Staff" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage users, roles, and permissions across the system.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>User Directory</CardTitle>
              <CardDescription>
                View and manage all users in the system.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8 md:w-[200px] lg:w-[300px]"
                />
              </div>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {roles.find((role) => role.value === user.role)?.label || user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active"
                          ? "default"
                          : user.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
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
            <CardTitle>Bulk Actions</CardTitle>
            <CardDescription>
              Perform actions on multiple users at once.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Button variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Import Users from CSV
              </Button>
              <Button variant="outline">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected Users
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Statistics</CardTitle>
            <CardDescription>
              Overview of user distribution across roles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {roles.map((role) => (
                <div key={role.value} className="flex items-center justify-between">
                  <span>{role.label}</span>
                  <span className="font-medium">
                    {users.filter((user) => user.role === role.value).length}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}