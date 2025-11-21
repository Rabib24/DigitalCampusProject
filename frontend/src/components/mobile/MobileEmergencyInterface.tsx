"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  User, 
  Shield, 
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Volume2,
  VolumeX,
  Mic,
  MicOff
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function MobileEmergencyInterface() {
  const [isOffline, setIsOffline] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isCharging, setIsCharging] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isPanicActive, setIsPanicActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPanicActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (isPanicActive && countdown === 0) {
      // In a real app, this would trigger the emergency alert
      alert("Emergency alert sent to campus security!");
      setIsPanicActive(false);
      setCountdown(5);
    }
    return () => clearTimeout(timer);
  }, [isPanicActive, countdown]);

  const handlePanicButton = () => {
    setIsPanicActive(true);
  };

  const cancelPanic = () => {
    setIsPanicActive(false);
    setCountdown(5);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 bg-black text-white text-xs">
        <div>9:41</div>
        <div className="flex items-center gap-1">
          {isOffline ? (
            <WifiOff className="h-3 w-3" />
          ) : (
            <Wifi className="h-3 w-3" />
          )}
          {isCharging ? (
            <BatteryCharging className="h-3 w-3" />
          ) : (
            <Battery className="h-3 w-3" />
          )}
          <span>{batteryLevel}%</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <div className="font-bold">Emergency Services</div>
        <Button variant="ghost" size="icon">
          {isMuted ? (
            <VolumeX className="h-6 w-6" onClick={() => setIsMuted(false)} />
          ) : (
            <Volume2 className="h-6 w-6" onClick={() => setIsMuted(true)} />
          )}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {isPanicActive ? (
          <div className="text-center">
            <div className="text-6xl font-bold text-red-600 mb-4">{countdown}</div>
            <div className="text-xl font-semibold mb-2">Sending Emergency Alert</div>
            <div className="text-muted-foreground mb-8">Campus security will be notified</div>
            <Button 
              variant="outline" 
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              onClick={cancelPanic}
            >
              Cancel Alert
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold mb-2">Emergency Services</h1>
              <p className="text-muted-foreground">Quick access to campus safety resources</p>
            </div>

            {/* Panic Button */}
            <Button 
              className="w-48 h-48 rounded-full bg-red-600 hover:bg-red-700 text-white mb-8 flex flex-col items-center justify-center"
              onClick={handlePanicButton}
            >
              <Phone className="h-16 w-16 mb-2" />
              <span className="text-xl font-bold">PANIC</span>
              <span className="text-sm">Press and hold</span>
            </Button>

            {/* Emergency Contacts */}
            <div className="w-full max-w-md space-y-3">
              <div className="bg-card rounded-lg p-4 border flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Campus Security</div>
                  <div className="text-sm text-muted-foreground">911</div>
                </div>
                <Button variant="outline" size="sm">
                  Call
                </Button>
              </div>

              <div className="bg-card rounded-lg p-4 border flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Emergency Text</div>
                  <div className="text-sm text-muted-foreground">Send location + message</div>
                </div>
                <Button variant="outline" size="sm">
                  Text
                </Button>
              </div>

              <div className="bg-card rounded-lg p-4 border flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Share Location</div>
                  <div className="text-sm text-muted-foreground">Send current location</div>
                </div>
                <Button variant="outline" size="sm">
                  Share
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-around items-center border-t bg-background p-4">
        <Button variant="ghost" size="icon">
          {isRecording ? (
            <Mic className="h-6 w-6 text-red-600" onClick={() => setIsRecording(false)} />
          ) : (
            <MicOff className="h-6 w-6" onClick={() => setIsRecording(true)} />
          )}
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon">
          <Shield className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}