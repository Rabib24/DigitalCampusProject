"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, 
  Search, 
  Users, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Check,
  CheckCheck
} from "lucide-react";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  online?: boolean;
  role: "student" | "faculty" | "admin";
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: {
    id: string;
    name: string;
    type: string;
    size: string;
  }[];
}

export default function ChatMessagingPage() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Alex Johnson",
      lastMessage: "Thank you for the feedback on my assignment!",
      lastMessageTime: "10:30 AM",
      unreadCount: 0,
      online: true,
      role: "student"
    },
    {
      id: "2",
      name: "Sarah Williams",
      lastMessage: "I have a question about the midterm exam",
      lastMessageTime: "Yesterday",
      unreadCount: 2,
      online: false,
      role: "student"
    },
    {
      id: "3",
      name: "Dr. Jane Smith",
      lastMessage: "Let's schedule a meeting for next week",
      lastMessageTime: "Yesterday",
      unreadCount: 0,
      online: true,
      role: "faculty"
    },
    {
      id: "4",
      name: "Michael Chen",
      lastMessage: "Could you clarify the project requirements?",
      lastMessageTime: "2 days ago",
      unreadCount: 0,
      online: false,
      role: "student"
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      senderId: "2",
      senderName: "Sarah Williams",
      content: "Hi Professor, I have a question about the midterm exam",
      timestamp: "2023-10-15T09:30:00Z",
      read: true
    },
    {
      id: "2",
      senderId: "current",
      senderName: "You",
      content: "Hello Sarah, what would you like to know?",
      timestamp: "2023-10-15T09:32:00Z",
      read: true
    },
    {
      id: "3",
      senderId: "2",
      senderName: "Sarah Williams",
      content: "I'm not sure about the format of question 3. Is it multiple choice or essay?",
      timestamp: "2023-10-15T09:35:00Z",
      read: true
    },
    {
      id: "4",
      senderId: "current",
      senderName: "You",
      content: "Question 3 will be an essay question. Please make sure to show your work clearly.",
      timestamp: "2023-10-15T09:37:00Z",
      read: true
    },
    {
      id: "5",
      senderId: "2",
      senderName: "Sarah Williams",
      content: "Thank you for clarifying! That helps a lot.",
      timestamp: "2023-10-15T09:40:00Z",
      read: false
    }
  ]);

  const [activeContact, setActiveContact] = useState<Contact>(contacts[1]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: (messages.length + 1).toString(),
      senderId: "current",
      senderName: "You",
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Update contact's last message
    setContacts(contacts.map(contact => 
      contact.id === activeContact.id 
        ? { ...contact, lastMessage: newMessage, lastMessageTime: "Just now" } 
        : contact
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "student": return "bg-blue-100 text-blue-800";
      case "faculty": return "bg-green-100 text-green-800";
      case "admin": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <FacultyProtectedRoute>
      <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Communicate with students and colleagues</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {filteredContacts.map((contact) => (
                <div 
                  key={contact.id}
                  className={`flex items-center gap-3 p-4 border-b cursor-pointer hover:bg-muted/50 ${
                    activeContact.id === contact.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setActiveContact(contact)}
                >
                  <div className="relative">
                    <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center">
                      {contact.name.charAt(0)}
                    </div>
                    {contact.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{contact.name}</h3>
                      {contact.lastMessageTime && (
                        <span className="text-xs text-muted-foreground">
                          {contact.lastMessageTime}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {contact.lastMessage}
                      </p>
                      {contact.unreadCount && contact.unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {contact.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getRoleBadge(contact.role)}`}>
                    {contact.role}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center">
                    {activeContact.name.charAt(0)}
                  </div>
                  {activeContact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  )}
                </div>
                <div>
                  <CardTitle>{activeContact.name}</CardTitle>
                  <CardDescription>
                    {activeContact.online ? "Online" : "Offline"}
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreVertical size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.senderId === "current" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 ${
                      message.senderId === "current" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    }`}
                  >
                    <div className="font-medium text-sm mb-1">
                      {message.senderName}
                    </div>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="flex items-center justify-end mt-1">
                      <span className="text-xs opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.senderId === "current" && (
                        <span className="ml-1">
                          {message.read ? (
                            <CheckCheck size={12} className="opacity-70" />
                          ) : (
                            <Check size={12} className="opacity-70" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="border-t p-4">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="min-h-[40px]"
                  />
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm">
                    <Paperclip size={16} />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Smile size={16} />
                  </Button>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="sm"
                    className="gap-2"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </FacultyProtectedRoute>
  );
}