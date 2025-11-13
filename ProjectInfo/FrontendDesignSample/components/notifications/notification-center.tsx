"use client"

import { X, Bell, CheckCircle, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Notification {
  id: string
  type: "success" | "warning" | "info"
  title: string
  message: string
  timestamp: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Assignment Submitted",
    message: "Your CS301 assignment has been submitted successfully",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "warning",
    title: "Deadline Approaching",
    message: "Math101 assignment due in 24 hours",
    timestamp: "4 hours ago",
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "Grade Posted",
    message: "Your Physics201 midterm grade has been posted",
    timestamp: "1 day ago",
    read: true,
  },
  {
    id: "4",
    type: "info",
    title: "Course Announcement",
    message: "New study materials added to CS301",
    timestamp: "2 days ago",
    read: true,
  },
]

export function NotificationCenter({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const unreadCount = mockNotifications.filter((n) => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[600px] overflow-hidden flex flex-col">
        <DialogHeader className="flex items-center justify-between flex-row gap-2 pb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <DialogTitle>Notifications</DialogTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {unreadCount}
              </Badge>
            )}
          </div>
          <button onClick={onClose} className="ml-auto">
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-2">
          {mockNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 cursor-pointer transition-colors ${
                notification.read
                  ? "bg-muted/30 hover:bg-muted/50"
                  : "bg-primary/5 hover:bg-primary/10 border-primary/20"
              }`}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{notification.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                </div>
                {!notification.read && <div className="flex-shrink-0 h-2 w-2 rounded-full bg-primary mt-2" />}
              </div>
            </Card>
          ))}
        </div>

        <div className="border-t pt-4 mt-4 flex gap-2">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
            Close
          </Button>
          <Button className="flex-1">Mark All as Read</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
