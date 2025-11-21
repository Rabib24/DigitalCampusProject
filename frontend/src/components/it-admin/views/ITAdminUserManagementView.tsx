"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Shield, 
  Key,
  Activity,
  Search,
  Filter
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function ITAdminUserManagementView() {
  const userStats = [
    {
      title: "Total Users",
      value: "4,287",
      change: "+142 from last week",
      icon: Users
    },
    {
      title: "Active Users",
      value: "3,156",
      change: "+89 from yesterday",
      icon: UserCheck
    },
    {
      title: "Inactive Users",
      value: "1,131",
      change: "-23 from cleanup",
      icon: UserX
    },
    {
      title: "Admin Users",
      value: "42",
      change: "+3 from new hires",
      icon: Shield
    }
  ];

  const userActivityData = [
    { day: "Mon", active: 2890, new: 42 },
    { day: "Tue", active: 3120, new: 38 },
    { day: "Wed", active: 2980, new: 56 },
    { day: "Thu", active: 3240, new: 31 },
    { day: "Fri", active: 3050, new: 47 },
    { day: "Sat", active: 1890, new: 12 },
    { day: "Sun", active: 1650, new: 8 }
  ];

  const userRoles = [
    { role: "Student", count: 3845, percentage: 90, color: "#3b82f6" },
    { role: "Faculty", count: 234, percentage: 5, color: "#10b981" },
    { role: "Admin", count: 42, percentage: 1, color: "#f59e0b" },
    { role: "Staff", count: 164, percentage: 4, color: "#ef4444" }
  ];

  const recentUsers = [
    { 
      id: "USR-001", 
      name: "John Doe", 
      email: "j.doe@iub.edu.bd", 
      role: "Student", 
      status: "Active", 
      joined: "2023-06-15" 
    },
    { 
      id: "USR-002", 
      name: "Jane Smith", 
      email: "j.smith@iub.edu.bd", 
      role: "Faculty", 
      status: "Active", 
      joined: "2023-06-14" 
    },
    { 
      id: "USR-003", 
      name: "Robert Johnson", 
      email: "r.johnson@iub.edu.bd", 
      role: "Admin", 
      status: "Active", 
      joined: "2023-06-14" 
    },
    { 
      id: "USR-004", 
      name: "Emily Davis", 
      email: "e.davis@iub.edu.bd", 
      role: "Student", 
      status: "Pending", 
      joined: "2023-06-13" 
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage user accounts, roles, and permissions across the system.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {userStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>
              Active users and new registrations over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userActivityData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="active" fill="#3b82f6" name="Active Users" />
                <Bar dataKey="new" fill="#10b981" name="New Registrations" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Roles Distribution</CardTitle>
            <CardDescription>
              Distribution of users by role type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userRoles.map((role, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{role.role}</span>
                    <span>{role.count} ({role.percentage}%)</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${role.percentage}%`, 
                        backgroundColor: role.color 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent User Activity</CardTitle>
          <CardDescription>
            Latest user registrations and account changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Role</p>
                    <p className="text-sm font-medium">{user.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="text-sm font-medium">{user.joined}</p>
                  </div>
                  <Badge 
                    variant={
                      user.status === "Active" 
                        ? "default" 
                        : user.status === "Pending" 
                        ? "secondary" 
                        : "destructive"
                    }
                  >
                    {user.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Management Tools</CardTitle>
          <CardDescription>
            Quick access to user management utilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Create New User
            </Button>
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Search Users
            </Button>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter by Role
            </Button>
            <Button variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              Manage Permissions
            </Button>
            <Button variant="outline">
              <Key className="mr-2 h-4 w-4" />
              Reset Passwords
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}