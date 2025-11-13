"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function SecurityIncidentPage({ incidentId }: { incidentId: string }) {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Security Incident Report</h2>
        <p className="text-muted-foreground mt-1">Review and manage security incidents</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incident Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Incident Type</p>
              <p className="font-medium mt-1">Port Scan Detected</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Severity</p>
              <Badge className="mt-1">Medium</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date/Time</p>
              <p className="font-medium mt-1">Nov 14, 2:45 PM</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Source IP</p>
              <p className="font-medium mt-1">203.0.113.45</p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Description</Label>
            <Textarea
              defaultValue="Port scan detected on external firewall targeting ports 22, 80, 443"
              className="mt-2"
              rows={4}
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Response Actions</Label>
            <Textarea placeholder="Document the actions taken to resolve this incident..." className="mt-2" rows={4} />
          </div>

          <div className="flex gap-3">
            <Button className="bg-primary hover:bg-primary/90">Mark as Resolved</Button>
            <Button variant="outline" className="bg-transparent">
              Block IP
            </Button>
            <Button variant="outline" className="bg-transparent">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
