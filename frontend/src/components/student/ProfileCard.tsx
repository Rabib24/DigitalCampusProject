"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Edit, 
  Award, 
  Calendar, 
  MapPin,
  Mail,
  Phone
} from "lucide-react";

export function ProfileCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My IUBian Profile</CardTitle>
        <CardDescription>
          Your personal profile and achievements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                JD
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute bottom-0 right-0 rounded-full h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" className="mt-4">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
          
          <div className="flex-1">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold">John Doe</h3>
                <p className="text-muted-foreground">Computer Science Major</p>
                <p className="text-sm text-muted-foreground flex items-center mt-1">
                  <Calendar className="mr-1 h-4 w-4" />
                  Class of 2025
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">
                  <Award className="mr-1 h-3 w-3" />
                  Dean's List
                </Badge>
                <Badge variant="secondary">
                  <Award className="mr-1 h-3 w-3" />
                  Honor Society
                </Badge>
                <Badge variant="outline">
                  <Award className="mr-1 h-3 w-3" />
                  Research Assistant
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>j.doe@iub.edu.bd</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>+1234567890</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Dormitory Block A, Room 205</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Enrolled: September 2021</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Python</Badge>
                  <Badge variant="outline">JavaScript</Badge>
                  <Badge variant="outline">React</Badge>
                  <Badge variant="outline">Machine Learning</Badge>
                  <Badge variant="outline">Data Analysis</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}