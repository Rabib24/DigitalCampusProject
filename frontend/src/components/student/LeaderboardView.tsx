"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Trophy, 
  Medal,
  User,
  Calendar,
  Filter,
  Search
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Participant {
  id: string;
  name: string;
  rank: number;
  score: number;
  previousRank?: number;
  department: string;
  competition: string;
  avatar?: string;
}

export function LeaderboardView() {
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "part_001",
      name: "Alex Johnson",
      rank: 1,
      score: 950,
      previousRank: 2,
      department: "Computer Science",
      competition: "AI Challenge"
    },
    {
      id: "part_002",
      name: "Sarah Williams",
      rank: 2,
      score: 920,
      previousRank: 1,
      department: "Engineering",
      competition: "AI Challenge"
    },
    {
      id: "part_003",
      name: "Michael Chen",
      rank: 3,
      score: 890,
      previousRank: 4,
      department: "Mathematics",
      competition: "AI Challenge"
    },
    {
      id: "part_004",
      name: "Emma Davis",
      rank: 4,
      score: 875,
      previousRank: 3,
      department: "Physics",
      competition: "AI Challenge"
    },
    {
      id: "part_005",
      name: "James Wilson",
      rank: 5,
      score: 850,
      previousRank: 5,
      department: "Computer Science",
      competition: "AI Challenge"
    },
    {
      id: "part_006",
      name: "Olivia Brown",
      rank: 6,
      score: 820,
      previousRank: 7,
      department: "Engineering",
      competition: "AI Challenge"
    },
    {
      id: "part_007",
      name: "Daniel Taylor",
      rank: 7,
      score: 800,
      previousRank: 6,
      department: "Mathematics",
      competition: "AI Challenge"
    },
    {
      id: "part_008",
      name: "Sophia Martinez",
      rank: 8,
      score: 780,
      previousRank: 8,
      department: "Physics",
      competition: "AI Challenge"
    }
  ]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="font-bold text-muted-foreground">{rank}</span>;
    }
  };

  const getRankChange = (participant: Participant) => {
    if (participant.previousRank === undefined) return null;
    
    const change = participant.previousRank - participant.rank;
    if (change > 0) {
      return <span className="text-green-600 text-sm">↑{change}</span>;
    } else if (change < 0) {
      return <span className="text-red-600 text-sm">↓{Math.abs(change)}</span>;
    }
    return <span className="text-muted-foreground text-sm">-</span>;
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Competition Leaderboard</h1>
          <p className="text-muted-foreground mt-1">View rankings for campus competitions and challenges</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search participants..."
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Participants
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              +12 from last competition
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Competitions
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              2 ending soon
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Your Rank
            </CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#12</div>
            <p className="text-xs text-muted-foreground">
              Computer Science
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            AI Challenge Leaderboard
          </CardTitle>
          <CardDescription>
            Rankings based on performance in the AI Challenge competition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {participants.map((participant) => (
              <div 
                key={participant.id} 
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  participant.rank <= 3 ? "bg-muted/50" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(participant.rank)}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">{participant.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {participant.department}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Previous</div>
                    <div className="font-medium">
                      {participant.previousRank || "-"}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Change</div>
                    <div className="font-medium">
                      {getRankChange(participant)}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Score</div>
                    <div className="font-bold text-lg">
                      {participant.score}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {participant.rank === 1 && <Trophy className="h-5 w-5 text-yellow-500" />}
                    {participant.rank === 2 && <Trophy className="h-5 w-5 text-gray-400" />}
                    {participant.rank === 3 && <Trophy className="h-5 w-5 text-amber-700" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Departments</CardTitle>
            <CardDescription>
              Department rankings based on participant performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { department: "Computer Science", score: 2450, participants: 32 },
                { department: "Engineering", score: 1980, participants: 28 },
                { department: "Mathematics", score: 1720, participants: 18 },
                { department: "Physics", score: 1450, participants: 15 },
                { department: "Business", score: 980, participants: 12 }
              ].map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                      index === 0 ? "bg-yellow-100 text-yellow-800" :
                      index === 1 ? "bg-gray-100 text-gray-800" :
                      index === 2 ? "bg-amber-100 text-amber-800" :
                      "bg-muted"
                    }`}>
                      {index < 3 ? index + 1 : <span className="text-xs">{index + 1}</span>}
                    </div>
                    <div>
                      <div className="font-medium">{dept.department}</div>
                      <div className="text-sm text-muted-foreground">
                        {dept.participants} participants
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{dept.score}</div>
                    <div className="text-sm text-muted-foreground">points</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
            <CardDescription>
              Latest accomplishments from competition participants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Alex Johnson", achievement: "Solved bonus challenge", time: "2 hours ago" },
                { name: "Sarah Williams", achievement: "Fastest submission", time: "5 hours ago" },
                { name: "Michael Chen", achievement: "Perfect score on round 1", time: "1 day ago" },
                { name: "Emma Davis", achievement: "Best algorithm efficiency", time: "1 day ago" },
                { name: "James Wilson", achievement: "Creative solution award", time: "2 days ago" }
              ].map((achievement, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  <Trophy className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-medium">{achievement.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {achievement.achievement}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {achievement.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}