"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function BackupRecoveryView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Backup & Recovery</h2>
          <p className="text-muted-foreground mt-1">Manage data backups and recovery procedures</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">Start Backup</Button>
      </div>

      {/* Backup Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">Nov 13, 2:15 AM</div>
            <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Backup Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">485GB</div>
            <p className="text-xs text-muted-foreground mt-1">Incremental</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Backup Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-500">Successful</Badge>
            <p className="text-xs text-muted-foreground mt-2">Verified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">2.1TB</div>
            <p className="text-xs text-muted-foreground mt-1">of 4TB</p>
          </CardContent>
        </Card>
      </div>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Backups</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { date: "Nov 13, 2:15 AM", size: "485GB", status: "Successful", duration: "2h 34m" },
            { date: "Nov 12, 2:10 AM", size: "482GB", status: "Successful", duration: "2h 28m" },
            { date: "Nov 11, 2:05 AM", size: "478GB", status: "Successful", duration: "2h 31m" },
          ].map((backup, idx) => (
            <div key={idx} className="flex items-start justify-between p-3 rounded-lg border border-border">
              <div>
                <h4 className="font-semibold text-sm">{backup.date}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Size: {backup.size} • Duration: {backup.duration}
                </p>
              </div>
              <Badge>{backup.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
