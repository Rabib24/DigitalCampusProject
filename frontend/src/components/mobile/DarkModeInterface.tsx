"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Moon, 
  Sun, 
  Battery, 
  BatteryCharging,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function DarkModeInterface() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isCharging, setIsCharging] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Simulate battery level changes
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => {
        if (prev <= 10) return 100;
        return prev - 0.1;
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, this would update the theme
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Status Bar */}
      <div className={`flex justify-between items-center px-4 py-2 ${isDarkMode ? 'bg-black' : 'bg-gray-100'} text-xs`}>
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
          <span>{Math.round(batteryLevel)}%</span>
        </div>
      </div>

      {/* Header */}
      <div className={`flex justify-between items-center px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="font-bold">Dark Mode Settings</div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center mx-auto mb-4`}>
            {isDarkMode ? (
              <Moon className="h-8 w-8" />
            ) : (
              <Sun className="h-8 w-8" />
            )}
          </div>
          <h1 className="text-2xl font-bold mb-2">Dark Mode</h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Reduce eye strain and save battery
          </p>
        </div>

        {/* Dark Mode Toggle */}
        <div className={`rounded-lg p-4 border mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Dark Mode</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Enable dark theme for better battery life
              </div>
            </div>
            <Switch 
              checked={isDarkMode} 
              onCheckedChange={toggleDarkMode}
            />
          </div>
        </div>

        {/* Battery Saving Tips */}
        <div className={`rounded-lg p-4 border mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <h2 className="text-lg font-semibold mb-3">Battery Saving Tips</h2>
          <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <li className="flex items-start gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'} mt-1.5`}></div>
              <span>Dark mode can reduce battery consumption by up to 60% on OLED screens</span>
            </li>
            <li className="flex items-start gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'} mt-1.5`}></div>
              <span>Lower screen brightness to extend battery life</span>
            </li>
            <li className="flex items-start gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'} mt-1.5`}></div>
              <span>Turn off location services when not needed</span>
            </li>
            <li className="flex items-start gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'} mt-1.5`}></div>
              <span>Use Wi-Fi instead of cellular data when possible</span>
            </li>
          </ul>
        </div>

        {/* Battery Status */}
        <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <h2 className="text-lg font-semibold mb-3">Battery Status</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Battery Level</span>
                <span>{Math.round(batteryLevel)}%</span>
              </div>
              <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                <div 
                  className={`h-full rounded-full ${batteryLevel > 20 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                  style={{ width: `${batteryLevel}%` }}
                ></div>
              </div>
            </div>
            <div>
              {isCharging ? (
                <BatteryCharging className="h-8 w-8 text-green-500" />
              ) : (
                <Battery className="h-8 w-8" />
              )}
            </div>
          </div>
          <div className={`text-sm mt-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {isDarkMode ? (
              <span>Dark mode enabled - estimated 2 hours additional battery life</span>
            ) : (
              <span>Dark mode disabled - enable to save battery</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}