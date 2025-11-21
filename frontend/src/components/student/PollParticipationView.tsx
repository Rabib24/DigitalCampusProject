"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Search,
  Filter,
  Check,
  User,
  Calendar,
  BarChart3
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  totalVotes: number;
  userVoted: boolean;
  userVoteId?: string;
  createdAt: Date;
  endDate: Date;
  status: "active" | "ended";
}

export function PollParticipationView() {
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: "poll_001",
      title: "Favorite Campus Food Spot",
      description: "Which campus food location do you visit most often?",
      options: [
        { id: "opt_1", text: "Campus Cafe", votes: 45 },
        { id: "opt_2", text: "Student Union Food Court", votes: 32 },
        { id: "opt_3", text: "Food Truck Park", votes: 28 },
        { id: "opt_4", text: "Library Coffee Bar", votes: 18 }
      ],
      totalVotes: 123,
      userVoted: true,
      userVoteId: "opt_1",
      createdAt: new Date("2025-11-01"),
      endDate: new Date("2025-12-01"),
      status: "active"
    },
    {
      id: "poll_002",
      title: "Preferred Study Location",
      description: "Where do you prefer to study on campus?",
      options: [
        { id: "opt_1", text: "Library", votes: 65 },
        { id: "opt_2", text: "Dorm Room", votes: 42 },
        { id: "opt_3", text: "Student Union", votes: 31 },
        { id: "opt_4", text: "Outdoor Spaces", votes: 19 }
      ],
      totalVotes: 157,
      userVoted: false,
      createdAt: new Date("2025-10-15"),
      endDate: new Date("2025-11-15"),
      status: "ended"
    },
    {
      id: "poll_003",
      title: "Campus Improvement Priorities",
      description: "What area of campus would you most like to see improved?",
      options: [
        { id: "opt_1", text: "Wi-Fi Connectivity", votes: 28 },
        { id: "opt_2", text: "Study Spaces", votes: 35 },
        { id: "opt_3", text: "Recreational Facilities", votes: 22 },
        { id: "opt_4", text: "Parking", votes: 17 }
      ],
      totalVotes: 102,
      userVoted: false,
      createdAt: new Date("2025-11-10"),
      endDate: new Date("2025-12-10"),
      status: "active"
    }
  ]);

  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);
  const [vote, setVote] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "ended":
        return <Badge className="bg-gray-100 text-gray-800">Ended</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleVote = (pollId: string, optionId: string) => {
    setPolls(polls.map(poll => {
      if (poll.id === pollId) {
        // Update the poll with the new vote
        const updatedOptions = poll.options.map(option => 
          option.id === optionId 
            ? { ...option, votes: option.votes + 1 } 
            : option
        );
        return {
          ...poll,
          options: updatedOptions,
          totalVotes: poll.totalVotes + 1,
          userVoted: true,
          userVoteId: optionId
        };
      }
      return poll;
    }));
    setVote(null);
    setSelectedPoll(null);
  };

  const getChartData = (poll: Poll) => {
    return poll.options.map(option => ({
      name: option.text.length > 15 ? option.text.substring(0, 15) + "..." : option.text,
      votes: option.votes
    }));
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campus Polls</h1>
          <p className="text-muted-foreground mt-1">Participate in polls and view results</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search polls..."
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {polls.map((poll) => (
          <Card key={poll.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    {poll.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {poll.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(poll.status)}
                  <Badge variant="secondary">
                    {poll.totalVotes} votes
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedPoll === poll.id ? (
                <div className="space-y-6">
                  <div className="space-y-3">
                    {poll.options.map((option) => (
                      <div 
                        key={option.id} 
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                          vote === option.id ? "border-primary bg-primary/5" : ""
                        }`}
                        onClick={() => setVote(option.id)}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          vote === option.id ? "border-primary bg-primary" : "border-muted-foreground"
                        }`}>
                          {vote === option.id && <Check className="h-3 w-3 text-primary-foreground" />}
                        </div>
                        <span>{option.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedPoll(null);
                        setVote(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => vote && handleVote(poll.id, vote)}
                      disabled={!vote}
                    >
                      Submit Vote
                    </Button>
                  </div>
                </div>
              ) : poll.userVoted || poll.status === "ended" ? (
                <div className="space-y-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={getChartData(poll)}
                        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="votes" fill="#3b82f6" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {poll.options.map((option) => {
                      const percentage = poll.totalVotes > 0 
                        ? Math.round((option.votes / poll.totalVotes) * 100) 
                        : 0;
                      return (
                        <div key={option.id} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="font-medium">{option.text}</span>
                            <span>{percentage}% ({option.votes})</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          {poll.userVoteId === option.id && (
                            <Badge variant="secondary" className="text-xs">
                              Your vote
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {poll.options.map((option) => (
                      <div key={option.id} className="flex items-center gap-3 p-2">
                        <div className="w-3 h-3 rounded-full bg-muted"></div>
                        <span>{option.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm text-muted-foreground">
                      Ends {poll.endDate.toLocaleDateString()}
                    </div>
                    <Button onClick={() => setSelectedPoll(poll.id)}>
                      Vote Now
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {polls.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No polls available</h3>
            <p className="text-muted-foreground mb-4 text-center">
              There are no polls available at the moment. Check back later for new polls.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}