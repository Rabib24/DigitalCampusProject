"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  WifiOff, 
  Download, 
  BookOpen, 
  FileText, 
  Video, 
  Wifi,
  Refresh
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function OfflineModeInterface() {
  const [isOnline, setIsOnline] = useState(false);
  const [downloadedContent, setDownloadedContent] = useState([
    { id: 1, title: "Data Structures Lecture Notes", type: "document", size: "2.4 MB", downloaded: true },
    { id: 2, title: "Calculus II Chapter 5", type: "document", size: "1.8 MB", downloaded: true },
    { id: 3, title: "Physics Lecture 12 Video", type: "video", size: "45.2 MB", downloaded: false },
    { id: 4, title: "Economics Midterm Study Guide", type: "document", size: "3.1 MB", downloaded: true },
    { id: 5, title: "Programming Assignment 3", type: "document", size: "0.8 MB", downloaded: false },
  ]);

  const handleDownload = (id: number) => {
    setDownloadedContent(downloadedContent.map(item => 
      item.id === id ? { ...item, downloaded: true } : item
    ));
  };

  const handleGoOnline = () => {
    setIsOnline(true);
    // In a real app, this would trigger reconnection logic
    setTimeout(() => setIsOnline(false), 3000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5" />;
      case "document":
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getContentType = (type: string) => {
    switch (type) {
      case "video":
        return "Video";
      case "document":
        return "Document";
      default:
        return "File";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <div className="font-bold">Offline Mode</div>
        <Button variant="ghost" size="sm" onClick={handleGoOnline} disabled={isOnline}>
          {isOnline ? (
            <>
              <Refresh className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wifi className="h-4 w-4 mr-2" />
              Go Online
            </>
          )}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <WifiOff className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Offline Mode</h1>
          <p className="text-muted-foreground">
            You're currently offline. Access your downloaded content below.
          </p>
        </div>

        {/* Offline Content */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Downloaded Content</h2>
            <Badge variant="secondary">{downloadedContent.filter(item => item.downloaded).length} items</Badge>
          </div>
          
          <div className="space-y-3">
            {downloadedContent.map((item) => (
              <div key={item.id} className="bg-card rounded-lg p-4 border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  {getTypeIcon(item.type)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{getContentType(item.type)}</span>
                    <span>•</span>
                    <span>{item.size}</span>
                  </div>
                </div>
                {item.downloaded ? (
                  <Badge variant="secondary">Downloaded</Badge>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => handleDownload(item.id)}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Offline Tips */}
        <div className="bg-card rounded-lg p-4 border">
          <h2 className="text-lg font-semibold mb-3">Offline Tips</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></div>
              <span>Download content when you have a stable connection for offline access</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></div>
              <span>Your progress will sync automatically when you're back online</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></div>
              <span>Assignments can be worked on offline and submitted later</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}