"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus, Users, Edit } from "lucide-react"

export function UserManagementView() {
  const users = [
    { id: 1, name: "Ahmed Khan", email: "ahmed@iub.edu", role: "Student", status: "Active" },
    { id: 2, name: "Dr. Sarah", email: "sarah@iub.edu", role: "Faculty", status: "Active" },
    { id: 3, name: "Admin User", email: "admin@iub.edu", role: "Admin", status: "Active" },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">User Management</h2>
          <p className="text-muted-foreground mt-1">Provision and manage system users</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus size={18} />
          New User
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
        <Input placeholder="Search users..." className="pl-10" />
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="rounded-lg border border-border p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-primary" />
                  <div>
                    <h4 className="font-semibold text-foreground">{user.name}</h4>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Role</p>
                    <p className="font-medium">{user.role}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge>{user.status}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="bg-transparent gap-2">
                  <Edit size={16} />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
