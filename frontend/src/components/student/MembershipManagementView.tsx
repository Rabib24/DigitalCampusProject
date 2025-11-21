"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Check,
  X,
  Pencil
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "member" | "officer" | "president" | "advisor";
  joinDate: Date;
  status: "active" | "pending" | "suspended";
  department?: string;
}

export function MembershipManagementView() {
  const [members, setMembers] = useState<Member[]>([
    {
      id: "mem_001",
      name: "Alex Johnson",
      email: "alex.johnson@iub.edu.bd",
      role: "president",
      joinDate: new Date("2024-09-01"),
      status: "active",
      department: "Computer Science"
    },
    {
      id: "mem_002",
      name: "Sarah Williams",
      email: "sarah.williams@iub.edu.bd",
      role: "officer",
      joinDate: new Date("2025-01-15"),
      status: "active",
      department: "Business Administration"
    },
    {
      id: "mem_003",
      name: "Michael Chen",
      email: "michael.chen@iub.edu.bd",
      role: "member",
      joinDate: new Date("2025-10-20"),
      status: "pending",
      department: "Engineering"
    },
    {
      id: "mem_004",
      name: "Emma Davis",
      email: "emma.davis@iub.edu.bd",
      role: "member",
      joinDate: new Date("2025-09-10"),
      status: "active",
      department: "Psychology"
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "president":
        return <Badge className="bg-purple-100 text-purple-800">President</Badge>;
      case "officer":
        return <Badge className="bg-blue-100 text-blue-800">Officer</Badge>;
      case "advisor":
        return <Badge className="bg-gray-100 text-gray-800">Advisor</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800">Member</Badge>;
    }
  };

  const handleApprove = (id: string) => {
    setMembers(members.map(member => 
      member.id === id ? {...member, status: "active"} : member
    ));
  };

  const handleReject = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Membership Management</h1>
          <p className="text-muted-foreground mt-1">Manage club members and their roles</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {members.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {member.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {member.email}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(member.status)}
                  {getRoleBadge(member.role)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium">Department</div>
                    <div className="text-sm text-muted-foreground">
                      {member.department || "Not specified"}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Join Date</div>
                    <div className="text-sm text-muted-foreground">
                      {member.joinDate.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium">Role</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {member.role}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Status</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {member.status}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-end justify-end">
                  {member.status === "pending" ? (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleApprove(member.id)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReject(member.id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Member
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="h-4 w-4 mr-2" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <X className="h-4 w-4 mr-2" />
                          Remove Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {members.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No members found</h3>
            <p className="text-muted-foreground mb-4 text-center">
              There are no members in this club yet. Add new members to get started.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}