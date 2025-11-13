"use client"

import { Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function GrantManagementView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex justify-between items-center flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-bold">Grant Management</h1>
          <p className="text-muted-foreground">Track and manage research grants</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Grant
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Grants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR 2.3B</div>
            <p className="text-xs text-green-600">+5% this year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
          </CardContent>
        </Card>
      </div>

      {/* Grants List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Grants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { funder: "HEC Pakistan", amount: "PKR 10M", project: "AI Research", status: "active" },
            { funder: "World Bank", amount: "PKR 15M", project: "Education Tech", status: "approved" },
            { funder: "NSF International", amount: "PKR 8M", project: "Renewable Energy", status: "active" },
          ].map((grant, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{grant.funder}</p>
                  <p className="text-sm text-muted-foreground">{grant.project}</p>
                </div>
                <Badge variant={grant.status === "active" ? "default" : "secondary"}>{grant.status}</Badge>
              </div>
              <p className="text-sm font-medium mt-2">{grant.amount}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
