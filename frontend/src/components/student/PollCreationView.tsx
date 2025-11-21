"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Plus,
  Trash2,
  Save,
  Eye,
  Calendar,
  User
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PollOption {
  id: string;
  text: string;
}

export function PollCreationView() {
  const [poll, setPoll] = useState({
    title: "",
    description: "",
    options: [
      { id: "opt_1", text: "" },
      { id: "opt_2", text: "" }
    ] as PollOption[],
    visibility: "public",
    endDate: ""
  });

  const addOption = () => {
    setPoll({
      ...poll,
      options: [...poll.options, { id: `opt_${Date.now()}`, text: "" }]
    });
  };

  const removeOption = (id: string) => {
    if (poll.options.length > 2) {
      setPoll({
        ...poll,
        options: poll.options.filter(option => option.id !== id)
      });
    }
  };

  const updateOption = (id: string, text: string) => {
    setPoll({
      ...poll,
      options: poll.options.map(option => 
        option.id === id ? { ...option, text } : option
      )
    });
  };

  const handleSubmit = () => {
    // In a real app, this would send the data to the backend
    alert("Poll created successfully!");
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create New Poll</h1>
        <p className="text-muted-foreground mt-1">Create a poll to gather opinions from the campus community</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Poll Details
          </CardTitle>
          <CardDescription>
            Fill in the details for your new poll
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Poll Title</Label>
            <Input
              id="title"
              value={poll.title}
              onChange={(e) => setPoll({...poll, title: e.target.value})}
              placeholder="Enter a clear and concise title for your poll"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={poll.description}
              onChange={(e) => setPoll({...poll, description: e.target.value})}
              placeholder="Provide additional context or explanation for your poll (optional)"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-3">
              {poll.options.map((option, index) => (
                <div key={option.id} className="flex gap-2">
                  <Input
                    value={option.text}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => removeOption(option.id)}
                    disabled={poll.options.length <= 2}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                onClick={addOption}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select 
                value={poll.visibility} 
                onValueChange={(value) => setPoll({...poll, visibility: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public (All students)</SelectItem>
                  <SelectItem value="club">Club Members Only</SelectItem>
                  <SelectItem value="department">Department Only</SelectItem>
                  <SelectItem value="private">Private (Specific users)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={poll.endDate}
                onChange={(e) => setPoll({...poll, endDate: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              Create Poll
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Poll Management</CardTitle>
          <CardDescription>
            Manage your existing polls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: "poll_001",
                title: "Favorite Campus Food Spot",
                status: "active",
                responses: 142,
                endDate: new Date("2025-12-01")
              },
              {
                id: "poll_002",
                title: "Preferred Study Location",
                status: "ended",
                responses: 87,
                endDate: new Date("2025-11-15")
              }
            ].map((existingPoll) => (
              <div key={existingPoll.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <div className="font-medium">{existingPoll.title}</div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{existingPoll.responses} responses</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Ends {existingPoll.endDate.toLocaleDateString()}</span>
                    </div>
                    <Badge 
                      variant={existingPoll.status === "active" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {existingPoll.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Results
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}