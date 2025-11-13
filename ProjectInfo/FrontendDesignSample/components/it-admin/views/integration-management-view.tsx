"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"

export function IntegrationManagementView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Integration Management</h2>
          <p className="text-muted-foreground mt-1">Manage system integrations and APIs</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus size={18} />
          New Integration
        </Button>
      </div>

      {/* Integration Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">12</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">API Calls (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">248,532</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Failed Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">34</div>
            <p className="text-xs text-muted-foreground mt-1">0.01% rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Integrations List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Integrations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "Email Service", status: "Active", uptime: "100%" },
            { name: "SMS Gateway", status: "Active", uptime: "99.8%" },
            { name: "Stripe Payments", status: "Active", uptime: "99.9%" },
            { name: "Google OAuth", status: "Active", uptime: "100%" },
          ].map((integration) => (
            <div
              key={integration.name}
              className="flex items-start justify-between p-3 rounded-lg border border-border"
            >
              <div>
                <h4 className="font-semibold text-sm">{integration.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">Uptime: {integration.uptime}</p>
              </div>
              <Badge>{integration.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
