"use client"

import { Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function ScholarshipManagementView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex justify-between items-center flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-bold">Scholarship Management</h1>
          <p className="text-muted-foreground">Manage scholarships and financial aid</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Scholarship
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Scholarships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR 45.6M</div>
          </CardContent>
        </Card>
      </div>

      {/* Scholarships List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Scholarships</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "Merit-based Excellence", amount: "PKR 150K/semester", recipients: 45, status: "active" },
            { name: "Need-based Aid", amount: "PKR 100K/semester", recipients: 60, status: "active" },
            { name: "Minority Scholarships", amount: "PKR 120K/semester", recipients: 23, status: "active" },
          ].map((scholarship, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{scholarship.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{scholarship.recipients} recipients</p>
                </div>
                <Badge>{scholarship.status}</Badge>
              </div>
              <p className="text-sm font-medium mt-3">{scholarship.amount}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
