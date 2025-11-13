"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function DigitalResourcesView() {
  const resources = [
    { id: 1, title: "IEEE Digital Library", type: "Journal Database", access: 2450, status: "Active" },
    { id: 2, title: "ProQuest", type: "Research Database", access: 1890, status: "Active" },
    { id: 3, title: "Springer eBooks", type: "E-Books", access: 850, status: "Active" },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Digital Resources</h2>
        <p className="text-muted-foreground mt-1">Manage digital collections and subscriptions</p>
      </div>

      {/* Resource Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Databases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">15</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Monthly Accesses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">5,190</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">E-Books Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">8,450</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Journal Titles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">2,340</div>
          </CardContent>
        </Card>
      </div>

      {/* Resources List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {resources.map((resource) => (
            <div key={resource.id} className="flex items-start justify-between p-3 rounded-lg border border-border">
              <div>
                <h4 className="font-semibold text-sm">{resource.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{resource.type}</p>
              </div>
              <Badge>{resource.access} accesses</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
