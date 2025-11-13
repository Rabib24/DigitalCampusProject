"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function BookDetailPage({ bookId }: { bookId: string }) {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Book Details</h2>
        <p className="text-muted-foreground mt-1">View and manage book information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Book Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Title</Label>
              <Input defaultValue="Data Science Fundamentals" className="mt-2" />
            </div>
            <div>
              <Label className="text-sm">Author</Label>
              <Input defaultValue="Smith, John" className="mt-2" />
            </div>
            <div>
              <Label className="text-sm">ISBN</Label>
              <Input defaultValue="978-1234567890" className="mt-2" />
            </div>
            <div>
              <Label className="text-sm">Edition</Label>
              <Input defaultValue="3rd Edition" className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded border border-border">
              <p className="text-sm text-muted-foreground">Total Copies</p>
              <p className="text-2xl font-bold mt-1">5</p>
            </div>
            <div className="p-3 rounded border border-border">
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-2xl font-bold mt-1 text-green-500">3</p>
            </div>
            <div className="p-3 rounded border border-border">
              <p className="text-sm text-muted-foreground">On Loan</p>
              <p className="text-2xl font-bold mt-1">2</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
        <Button variant="outline" className="bg-transparent">
          Cancel
        </Button>
      </div>
    </div>
  )
}
