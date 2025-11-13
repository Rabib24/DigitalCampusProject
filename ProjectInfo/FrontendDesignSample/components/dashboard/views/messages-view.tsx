"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Send } from "lucide-react"

export function MessagesView() {
  const conversations = [
    {
      id: 1,
      name: "Dr. Ahmed Khan",
      role: "Instructor - CS-203",
      lastMessage: "Please submit your project by Friday...",
      timestamp: "10 min ago",
      unread: 2,
      avatar: "AK",
    },
    {
      id: 2,
      name: "Prof. Fatima Ali",
      role: "Instructor - MA-101",
      lastMessage: "Great work on the last problem set!",
      timestamp: "2 hours ago",
      unread: 0,
      avatar: "FA",
    },
    {
      id: 3,
      name: "Student Support",
      role: "Administrative",
      lastMessage: "Your financial aid has been processed...",
      timestamp: "Yesterday",
      unread: 1,
      avatar: "SS",
    },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Messages</h2>
        <p className="text-muted-foreground mt-1">Communicate with instructors and staff</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {conversations.map((conv) => (
              <Button key={conv.id} variant="ghost" className="w-full justify-start h-auto p-3 hover:bg-accent/10">
                <div className="flex w-full items-start gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback>{conv.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">{conv.name}</p>
                      {conv.unread > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conv.role}</p>
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle size={20} />
              Chat with Dr. Ahmed Khan
            </CardTitle>
            <CardDescription>CS-203 - Data Structures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 h-96 flex flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto">
              <div className="flex gap-2 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AK</AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3 max-w-xs">
                  <p className="text-sm">Hi there! How are your assignments coming along?</p>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <div className="bg-primary rounded-lg p-3 max-w-xs">
                  <p className="text-sm text-primary-foreground">Hi Dr. Khan! Going well, should be done by Friday.</p>
                </div>
              </div>

              <div className="flex gap-2 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AK</AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3 max-w-xs">
                  <p className="text-sm">Perfect! Let me know if you have any questions.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 border-t border-border pt-3 mt-auto">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="icon" className="bg-primary hover:bg-primary/90">
                <Send size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
