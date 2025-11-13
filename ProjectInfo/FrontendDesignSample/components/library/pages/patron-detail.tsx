"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function PatronDetailPage({ patronId }: { patronId: string }) {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Patron Details</h2>
        <p className="text-muted-foreground mt-1">View patron information and borrowing history</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">Ahmed Khan</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">ahmed@iub.edu</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium">January 2024</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className="mt-1">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Borrowing Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded border border-border">
              <p className="text-sm text-muted-foreground">Total Loans</p>
              <p className="text-2xl font-bold mt-1">24</p>
            </div>
            <div className="p-3 rounded border border-border">
              <p className="text-sm text-muted-foreground">Currently Borrowed</p>
              <p className="text-2xl font-bold mt-1">3</p>
            </div>
            <div className="p-3 rounded border border-border">
              <p className="text-sm text-muted-foreground">Overdue Items</p>
              <p className="text-2xl font-bold mt-1 text-destructive">0</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Loans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="p-3 rounded border border-border text-sm">
            <p className="font-medium">Data Science Fundamentals</p>
            <p className="text-muted-foreground">Due: Nov 28, 2025</p>
          </div>
          <div className="p-3 rounded border border-border text-sm">
            <p className="font-medium">Web Development Guide</p>
            <p className="text-muted-foreground">Due: Dec 5, 2025</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
