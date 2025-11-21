"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  Scan, 
  Camera, 
  CameraOff, 
  CheckCircle, 
  XCircle,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function QRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startScanning = () => {
    setIsScanning(true);
    setIsCameraActive(true);
    // In a real app, this would initialize the camera and QR scanner
    // For demo purposes, we'll simulate a successful scan after 3 seconds
    setTimeout(() => {
      setScanResult("CS-203-2025-11-20-Lecture");
      setIsScanning(false);
      setIsCameraActive(false);
    }, 3000);
  };

  const stopScanning = () => {
    setIsScanning(false);
    setIsCameraActive(false);
    setScanResult(null);
  };

  const recordAttendance = () => {
    // In a real app, this would send the attendance data to the server
    alert(`Attendance recorded for ${scanResult}`);
    setScanResult(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <div className="font-bold">Attendance Scanner</div>
        <Button variant="ghost" size="icon" onClick={isCameraActive ? stopScanning : startScanning}>
          {isCameraActive ? (
            <CameraOff className="h-5 w-5" />
          ) : (
            <Camera className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {isScanning ? (
          <div className="text-center">
            <div className="w-64 h-64 border-4 border-primary rounded-lg flex items-center justify-center mb-6">
              <div className="w-48 h-48 border-2 border-dashed border-primary rounded flex items-center justify-center">
                <Scan className="h-12 w-12 text-primary animate-pulse" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Scanning for QR Code</h2>
            <p className="text-muted-foreground">Point your camera at the QR code</p>
          </div>
        ) : scanResult ? (
          <div className="text-center w-full max-w-md">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Scan Successful</h2>
            <p className="text-muted-foreground mb-6">Attendance code detected</p>
            
            <div className="bg-card rounded-lg p-4 border mb-6">
              <div className="font-medium mb-2">Course Information</div>
              <div className="text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Course:</span>
                  <span>Data Structures</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Code:</span>
                  <span>CS-203</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>November 20, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span>10:00 AM</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={stopScanning}>
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button className="flex-1" onClick={recordAttendance}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Record Attendance
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Scan className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Attendance Scanner</h1>
            <p className="text-muted-foreground mb-8">
              Scan QR codes to record your attendance
            </p>
            <Button 
              className="w-full max-w-xs h-12" 
              onClick={startScanning}
              disabled={isScanning}
            >
              <Camera className="h-5 w-5 mr-2" />
              Start Scanning
            </Button>
            
            <div className="mt-8 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-3">Recent Attendance</h2>
              <div className="space-y-3">
                {[
                  { course: "Data Structures", date: "Nov 18, 2025", time: "10:00 AM", status: "present" },
                  { course: "Calculus II", date: "Nov 17, 2025", time: "2:00 PM", status: "present" },
                  { course: "Physics II", date: "Nov 16, 2025", time: "11:00 AM", status: "late" },
                ].map((attendance, index) => (
                  <div key={index} className="bg-card rounded-lg p-3 border flex items-center justify-between">
                    <div>
                      <div className="font-medium">{attendance.course}</div>
                      <div className="text-sm text-muted-foreground">
                        {attendance.date} at {attendance.time}
                      </div>
                    </div>
                    <Badge variant={attendance.status === "present" ? "secondary" : "destructive"}>
                      {attendance.status === "present" ? "Present" : "Late"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}