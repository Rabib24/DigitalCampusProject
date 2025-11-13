"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Edit, MoreVertical, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function FacultyManagementView() {
  const faculty = [
    { id: 1, name: "Dr. Ahmed Khan", email: "ahmed@iub.edu", courses: 3, status: "Active" },
    { id: 2, name: "Dr. Sarah Smith", email: "sarah@iub.edu", courses: 4, status: "Active" },
    { id: 3, name: "Dr. Fatima Ali", email: "fatima@iub.edu", courses: 2, status: "Active" },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Faculty Management</h2>
          <p className="text-muted-foreground mt-1">Manage faculty assignments and workload</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus size={18} />
          Assign Faculty
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
        <Input placeholder="Search faculty..." className="pl-10" />
      </div>

      {/* Faculty List */}
      <div className="space-y-3">
        {faculty.map((member) => (
          <div key={member.id} className="rounded-lg border border-border p-4 hover:bg-accent/5 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-primary" />
                  <div>
                    <h4 className="font-semibold text-foreground">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Courses</p>
                    <p className="font-medium">{member.courses} assigned</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge className="mt-1">{member.status}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="bg-transparent gap-2">
                  <Edit size={16} />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="bg-transparent">
                  <MoreVertical size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
