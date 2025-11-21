"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageCircle, 
  Send,
  Paperclip,
  Smile,
  Search,
  Filter,
  MoreVertical,
  Phone,
  Video,
  User,
  Users
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  read: boolean;
}

interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isOnline: boolean;
  isGroup?: boolean;
  members?: string[];
}

export function ChatMessagingView() {
  const [contacts] = useState<ChatContact[]>([
    {
      id: "contact_001",
      name: "Dr. Sarah Johnson",
      lastMessage: "Thanks for submitting the assignment",
      lastMessageTime: new Date("2025-11-19T14:30:00"),
      unreadCount: 0,
      isOnline: true
    },
    {
      id: "contact_002",
      name: "Study Group",
      lastMessage: "Alex: See you tomorrow at the library",
      lastMessageTime: new Date("2025-11-19T12:15:00"),
      unreadCount: 3,
      isOnline: true,
      isGroup: true,
      members: ["Alex", "Sarah", "Mike"]
    },
    {
      id: "contact_003",
      name: "Michael Chen",
      lastMessage: "Did you finish the project?",
      lastMessageTime: new Date("2025-11-19T10:45:00"),
      unreadCount: 1,
      isOnline: false
    },
    {
      id: "contact_004",
      name: "Campus Support",
      lastMessage: "Your ticket has been resolved",
      lastMessageTime: new Date("2025-11-18T16:20:00"),
      unreadCount: 0,
      isOnline: true
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg_001",
      content: "Hi there! How can I help you today?",
      sender: {
        id: "contact_001",
        name: "Dr. Sarah Johnson"
      },
      timestamp: new Date("2025-11-19T14:25:00"),
      read: true
    },
    {
      id: "msg_002",
      content: "I had a question about the assignment due next week",
      sender: {
        id: "current_user",
        name: "You"
      },
      timestamp: new Date("2025-11-19T14:26:30"),
      read: true
    },
    {
      id: "msg_003",
      content: "Sure, what would you like to know?",
      sender: {
        id: "contact_001",
        name: "Dr. Sarah Johnson"
      },
      timestamp: new Date("2025-11-19T14:27:15"),
      read: true
    },
    {
      id: "msg_004",
      content: "Thanks for submitting the assignment. I'll review it and get back to you by Friday.",
      sender: {
        id: "contact_001",
        name: "Dr. Sarah Johnson"
      },
      timestamp: new Date("2025-11-19T14:30:00"),
      read: false
    }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState<ChatContact>(contacts[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: `msg_${Date.now()}`,
        content: newMessage,
        sender: {
          id: "current_user",
          name: "You"
        },
        timestamp: new Date(),
        read: false
      };
      
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] rounded-lg border">
      {/* Contacts Sidebar */}
      <div className="w-1/3 border-r flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Messages
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Search className="h-4 w-4 mr-2" />
                  Search Messages
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Contacts
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="h-4 w-4 mr-2" />
                  New Group Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-8"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            {contacts.map((contact) => (
              <div 
                key={contact.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted ${
                  selectedContact.id === contact.id ? "bg-muted" : ""
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="font-medium text-muted-foreground">
                      {contact.name.charAt(0)}
                    </span>
                  </div>
                  {contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  )}
                  {contact.isGroup && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-background flex items-center justify-center">
                      <Users className="h-2 w-2 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-medium truncate">{contact.name}</div>
                    {contact.lastMessageTime && (
                      <div className="text-xs text-muted-foreground">
                        {contact.lastMessageTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground truncate">
                      {contact.lastMessage}
                    </div>
                    {contact.unreadCount > 0 && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-xs text-primary-foreground font-medium">
                          {contact.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="font-medium text-muted-foreground">
                    {selectedContact.name.charAt(0)}
                  </span>
                </div>
                {selectedContact.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                )}
              </div>
              <div>
                <CardTitle>{selectedContact.name}</CardTitle>
                <CardDescription>
                  {selectedContact.isOnline ? "Online" : "Offline"}
                  {selectedContact.isGroup && selectedContact.members && (
                    <span> • {selectedContact.members.length} members</span>
                  )}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Filter className="h-4 w-4 mr-2" />
                    Mute Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Clear Chat
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender.id === "current_user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender.id === "current_user" 
                      ? "bg-primary text-primary-foreground rounded-br-none" 
                      : "bg-muted rounded-bl-none"
                  }`}
                >
                  {message.sender.id !== "current_user" && (
                    <div className="text-xs font-medium mb-1">{message.sender.name}</div>
                  )}
                  <div>{message.content}</div>
                  <div 
                    className={`text-xs mt-1 ${
                      message.sender.id === "current_user" 
                        ? "text-primary-foreground/70" 
                        : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          <div className="flex items-end gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="w-full min-h-[40px] max-h-[120px] p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}