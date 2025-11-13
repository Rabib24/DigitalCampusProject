"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus, Users } from "lucide-react"

export function PatronManagementView() {
  const patrons = [
    { id: 1, name: "Ahmed Khan", email: "ahmed@iub.edu", loans: 3, status: "Active" },
    { id: 2, name: "Fatima Ali", email: "fatima@iub.edu", loans: 1, status: "Active" },
    { id: 3, name: "Sara Smith", email: "sara@iub.edu", loans: 0, status: "Inactive" },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Patron Management</h2>
          <p className="text-muted-foreground mt-1">Manage library user accounts and access</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus size={18} />
          New Patron
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
        <Input placeholder="Search patrons..." className="pl-10" />
      </div>

      <div className="space-y-3">
        {patrons.map((patron) => (
          <div key={patron.id} className="rounded-lg border border-border p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-primary" />
                  <div>
                    <h4 className="font-semibold text-foreground">{patron.name}</h4>
                    <p className="text-sm text-muted-foreground">{patron.email}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Active Loans</p>
                    <p className="font-medium">{patron.loans}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge className="mt-1" variant={patron.status === "Active" ? "default" : "outline"}>
                      {patron.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline" className="bg-transparent">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
