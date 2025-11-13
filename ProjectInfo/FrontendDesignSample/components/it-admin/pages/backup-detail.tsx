"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function BackupDetailPage({ backupId }: { backupId: string }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Backup Details</h2>
        <p className="text-muted-foreground mt-1">Review backup status and recovery options</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Backup Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Backup Date/Time</p>
              <p className="font-medium mt-1">November 13, 2:15 AM</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Backup Size</p>
              <p className="font-medium mt-1">485 GB</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className="mt-1">Successful</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium mt-1">2 hours 34 minutes</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Verification</p>
              <Badge variant="outline" className="mt-1">
                Verified
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button className="bg-primary hover:bg-primary/90">Restore from Backup</Button>
        <Button variant="outline" className="bg-transparent">
          Download
        </Button>
        <Button variant="outline" className="bg-transparent">
          Cancel
        </Button>
      </div>
    </div>
  )
}
