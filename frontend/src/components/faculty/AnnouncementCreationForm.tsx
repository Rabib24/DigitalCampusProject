"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Users, 
  Bell, 
  FileText, 
  Image as ImageIcon,
  Link as LinkIcon,
  X
} from "lucide-react";

interface AnnouncementTarget {
  id: string;
  name: string;
  type: "course" | "department" | "program" | "all_students";
}

export default function AnnouncementCreationForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTargets, setSelectedTargets] = useState<AnnouncementTarget[]>([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [allowReplies, setAllowReplies] = useState(true);
  const [sendNotifications, setSendNotifications] = useState(true);
  const [attachments, setAttachments] = useState<File[]>([]);
  
  // Mock data for targets
  const availableTargets: AnnouncementTarget[] = [
    { id: "1", name: "CS-101: Intro to Computer Science", type: "course" },
    { id: "2", name: "CS-205: Web Development", type: "course" },
    { id: "3", name: "Computer Science Department", type: "department" },
    { id: "4", name: "All Undergraduate Students", type: "all_students" },
    { id: "5", name: "Software Engineering Program", type: "program" }
  ];

  const handleAddTarget = (target: AnnouncementTarget) => {
    if (!selectedTargets.some(t => t.id === target.id)) {
      setSelectedTargets([...selectedTargets, target]);
    }
  };

  const handleRemoveTarget = (targetId: string) => {
    setSelectedTargets(selectedTargets.filter(t => t.id !== targetId));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      alert("Please enter a title for the announcement");
      return;
    }
    
    if (!content.trim()) {
      alert("Please enter the announcement content");
      return;
    }
    
    if (selectedTargets.length === 0) {
      alert("Please select at least one target audience");
      return;
    }
    
    // In a real app, this would be an API call
    console.log({
      title,
      content,
      targets: selectedTargets,
      scheduleDate,
      scheduleTime,
      priority,
      allowReplies,
      sendNotifications,
      attachments: attachments.map(f => f.name)
    });
    
    alert("Announcement created successfully!");
    
    // Reset form
    setTitle("");
    setContent("");
    setSelectedTargets([]);
    setScheduleDate("");
    setScheduleTime("");
    setPriority("medium");
    setAllowReplies(true);
    setSendNotifications(true);
    setAttachments([]);
  };

  const getTargetTypeIcon = (type: string) => {
    switch (type) {
      case "course": return <FileText size={16} />;
      case "department": return <Users size={16} />;
      case "program": return <FileText size={16} />;
      case "all_students": return <Users size={16} />;
      default: return <Users size={16} />;
    }
  };

  const getTargetTypeVariant = (type: string) => {
    switch (type) {
      case "course": return "default";
      case "department": return "secondary";
      case "program": return "outline";
      case "all_students": return "default";
      default: return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Create New Announcement
        </CardTitle>
        <CardDescription>
          Share important updates and information with your students and colleagues
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter announcement title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              placeholder="Enter your announcement content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label>Target Audience *</Label>
            <div className="border rounded-lg p-4">
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedTargets.map((target) => (
                  <Badge 
                    key={target.id} 
                    variant={getTargetTypeVariant(target.type)}
                    className="flex items-center gap-1 pr-2"
                  >
                    {getTargetTypeIcon(target.type)}
                    {target.name}
                    <button 
                      type="button"
                      onClick={() => handleRemoveTarget(target.id)}
                      className="ml-1 hover:bg-muted rounded-full p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
                {selectedTargets.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No targets selected. Select from the options below.
                  </p>
                )}
              </div>
              <div className="border-t pt-3">
                <p className="text-sm font-medium mb-2">Available Targets:</p>
                <div className="flex flex-wrap gap-2">
                  {availableTargets.map((target) => (
                    <Button
                      key={target.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleAddTarget(target)}
                      disabled={selectedTargets.some(t => t.id === target.id)}
                    >
                      {getTargetTypeIcon(target.type)}
                      {target.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduleDate">Schedule Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="scheduleDate"
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduleTime">Schedule Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="scheduleTime"
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                className="w-full p-2 border rounded"
                value={priority}
                onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="allowReplies">Allow Replies</Label>
              <Button
                type="button"
                variant={allowReplies ? "default" : "outline"}
                size="sm"
                onClick={() => setAllowReplies(!allowReplies)}
              >
                {allowReplies ? "Enabled" : "Disabled"}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sendNotifications">Send Notifications</Label>
              <Button
                type="button"
                variant={sendNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => setSendNotifications(!sendNotifications)}
              >
                {sendNotifications ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="border rounded-lg p-4">
              {attachments.length > 0 ? (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-muted-foreground" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAttachment(index)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-3">
                  No files attached
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <LinkIcon size={16} />
                  Add from Computer
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <ImageIcon size={16} />
                  Add from Cloud
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            Save Draft
          </Button>
          <Button type="submit" className="gap-2">
            <Bell size={16} />
            Publish Announcement
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}