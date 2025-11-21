"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Fingerprint, 
  ScanFace, 
  Lock, 
  Unlock, 
  CheckCircle,
  XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function BiometricAuthInterface() {
  const [isScanning, setIsScanning] = useState(false);
  const [authMethod, setAuthMethod] = useState<"fingerprint" | "face">("fingerprint");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const startBiometricAuth = () => {
    setIsScanning(true);
    setAuthError(null);
    
    // Simulate biometric authentication process
    setTimeout(() => {
      // For demo purposes, we'll randomly succeed or fail
      const success = Math.random() > 0.3;
      
      if (success) {
        setIsAuthenticated(true);
        setIsScanning(false);
      } else {
        setAuthError("Authentication failed. Please try again.");
        setIsScanning(false);
      }
    }, 2000);
  };

  const resetAuth = () => {
    setIsAuthenticated(false);
    setAuthError(null);
    setIsScanning(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <div className="font-bold">Biometric Authentication</div>
        {isAuthenticated && (
          <Button variant="ghost" size="sm" onClick={resetAuth}>
            Logout
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {isAuthenticated ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Authenticated</h1>
            <p className="text-muted-foreground mb-6">
              You have been successfully authenticated
            </p>
            <Button onClick={resetAuth}>
              <Lock className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        ) : isScanning ? (
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
              {authMethod === "fingerprint" ? (
                <Fingerprint className="h-16 w-16 text-primary" />
              ) : (
                <ScanFace className="h-16 w-16 text-primary" />
              )}
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {authMethod === "fingerprint" ? "Scanning Fingerprint" : "Scanning Face"}
            </h2>
            <p className="text-muted-foreground">
              Please authenticate using your {authMethod}
            </p>
          </div>
        ) : (
          <div className="text-center w-full max-w-md">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Lock className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Biometric Authentication</h1>
            <p className="text-muted-foreground mb-8">
              Securely access your account using biometric authentication
            </p>
            
            {/* Auth Method Selection */}
            <div className="flex gap-4 mb-8">
              <Button 
                variant={authMethod === "fingerprint" ? "default" : "outline"} 
                className="flex-1 flex-col h-24 gap-2"
                onClick={() => setAuthMethod("fingerprint")}
              >
                <Fingerprint className="h-8 w-8" />
                <span>Fingerprint</span>
              </Button>
              <Button 
                variant={authMethod === "face" ? "default" : "outline"} 
                className="flex-1 flex-col h-24 gap-2"
                onClick={() => setAuthMethod("face")}
              >
                <ScanFace className="h-8 w-8" />
                <span>Face ID</span>
              </Button>
            </div>
            
            {/* Auth Button */}
            <Button 
              className="w-full h-12 mb-6" 
              onClick={startBiometricAuth}
              disabled={isScanning}
            >
              {authMethod === "fingerprint" ? (
                <>
                  <Fingerprint className="h-5 w-5 mr-2" />
                  Scan Fingerprint
                </>
              ) : (
                <>
                  <ScanFace className="h-5 w-5 mr-2" />
                  Scan Face
                </>
              )}
            </Button>
            
            {/* Error Message */}
            {authError && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-destructive">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Authentication Error</span>
                </div>
                <p className="text-sm text-destructive mt-1">{authError}</p>
              </div>
            )}
            
            {/* Security Info */}
            <div className="bg-card rounded-lg p-4 border">
              <h2 className="font-semibold mb-3">Security Information</h2>
              <ul className="space-y-2 text-sm text-left">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></div>
                  <span>Your biometric data is securely stored on your device</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></div>
                  <span>Biometric data is never sent to our servers</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></div>
                  <span>You can disable biometric auth anytime in settings</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}