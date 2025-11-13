"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, BookOpen, Users, FileText } from "lucide-react"

export function LibraryDashboardView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Library Staff Dashboard</h2>
        <p className="text-muted-foreground mt-1">Manage books, loans, and library resources</p>
      </div>

      <Alert className="border-accent/50 bg-accent/5">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Active Tasks</AlertTitle>
        <AlertDescription>45 overdue items, 12 pending reservations, 8 items to process</AlertDescription>
      </Alert>

      {/* Library Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">12,450</div>
            <p className="text-xs text-muted-foreground mt-1">In collection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Currently Loaned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">3,892</div>
            <p className="text-xs text-muted-foreground mt-1">31% of collection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">45</div>
            <p className="text-xs text-muted-foreground mt-1">Pending recovery</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Patrons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">2,847</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle size={20} />
              Urgent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start justify-between p-3 rounded-lg border border-border">
              <div>
                <h4 className="font-semibold text-sm">Process New Arrivals</h4>
                <p className="text-xs text-muted-foreground mt-1">8 books awaiting cataloging</p>
              </div>
              <Badge variant="destructive">Urgent</Badge>
            </div>
            <div className="flex items-start justify-between p-3 rounded-lg border border-border">
              <div>
                <h4 className="font-semibold text-sm">Overdue Reminders</h4>
                <p className="text-xs text-muted-foreground mt-1">Send notification to 45 patrons</p>
              </div>
              <Badge>Pending</Badge>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90">View All Tasks</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <BookOpen size={16} />
              Search Catalog
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Users size={16} />
              Patron Management
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <FileText size={16} />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
