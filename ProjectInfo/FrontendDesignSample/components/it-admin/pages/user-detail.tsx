"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function UserDetailPage({ userId }: { userId: string }) {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground">User Details</h2>
        <p className="text-muted-foreground mt-1">Manage user account and permissions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Name</Label>
              <Input defaultValue="Ahmed Khan" className="mt-2" />
            </div>
            <div>
              <Label className="text-sm">Email</Label>
              <Input defaultValue="ahmed@iub.edu" className="mt-2" />
            </div>
            <div>
              <Label className="text-sm">Role</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue defaultValue="student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className="mt-2">Active</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Login</p>
              <p className="font-medium mt-1">2 hours ago</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">MFA Enabled</p>
              <Badge variant="outline" className="mt-2">
                Yes
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button className="bg-primary hover:bg-primary/90">Update User</Button>
        <Button variant="outline" className="bg-transparent text-destructive">
          Disable Account
        </Button>
        <Button variant="outline" className="bg-transparent">
          Cancel
        </Button>
      </div>
    </div>
  )
}
