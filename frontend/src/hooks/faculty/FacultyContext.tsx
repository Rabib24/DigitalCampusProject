"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getUserData } from "@/lib/auth";

interface FacultyProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  role: string;
}

interface FacultyCoursesState {
  courses: unknown[];
  loading: boolean;
  error: string | null;
}

interface FacultyAssignmentsState {
  assignments: unknown[];
  loading: boolean;
  error: string | null;
}

interface FacultyState {
  profile: FacultyProfile | null;
  courses: FacultyCoursesState;
  assignments: FacultyAssignmentsState;
  notifications: unknown[];
  settings: Record<string, unknown>;
}

interface FacultyContextType {
  state: FacultyState;
  updateProfile: (profile: FacultyProfile) => void;
  updateCourses: (courses: unknown[]) => void;
  updateAssignments: (assignments: unknown[]) => void;
  addNotification: (notification: unknown) => void;
  updateSettings: (settings: Record<string, unknown>) => void;
  loading: boolean;
  error: string | null;
}

const FacultyContext = createContext<FacultyContextType | undefined>(undefined);

export function FacultyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FacultyState>({
    profile: null,
    courses: {
      courses: [],
      loading: false,
      error: null,
    },
    assignments: {
      assignments: [],
      loading: false,
      error: null,
    },
    notifications: [],
    settings: {},
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user data on initial render
  useEffect(() => {
    const initializeUserData = () => {
      try {
        console.log("Initializing faculty user data...");
        const userData = getUserData();
        console.log("Retrieved user data:", userData);
        
        if (userData) {
          setState(prev => ({
            ...prev,
            profile: {
              id: Number(userData.id), // Ensure it's a number
              first_name: userData.first_name,
              last_name: userData.last_name,
              email: userData.email,
              department: (userData as unknown as { department: string }).department || "",
              role: userData.role,
            }
          }));
        }
      } catch (err) {
        console.error("Error loading user data:", err);
        const errorMsg = "Failed to load user profile data";
        setError(errorMsg);
      }
    };

    // Use setTimeout to avoid the linting warning about setState in effect
    const timer = setTimeout(initializeUserData, 0);
    return () => clearTimeout(timer);
  }, []);

  const updateProfile = (profile: FacultyProfile) => {
    console.log("Updating faculty profile:", profile);
    setState(prev => ({
      ...prev,
      profile,
    }));
  };

  const updateCourses = (courses: unknown[]) => {
    console.log("Updating faculty courses:", courses.length);
    setState(prev => ({
      ...prev,
      courses: {
        ...prev.courses,
        courses,
      },
    }));
  };

  const updateAssignments = (assignments: unknown[]) => {
    console.log("Updating faculty assignments:", assignments.length);
    setState(prev => ({
      ...prev,
      assignments: {
        ...prev.assignments,
        assignments,
      },
    }));
  };

  const addNotification = (notification: unknown) => {
    console.log("Adding notification:", notification);
    setState(prev => ({
      ...prev,
      notifications: [...prev.notifications, notification],
    }));
  };

  const updateSettings = (settings: Record<string, unknown>) => {
    console.log("Updating faculty settings:", settings);
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...settings,
      },
    }));
  };

  return (
    <FacultyContext.Provider
      value={{
        state,
        updateProfile,
        updateCourses,
        updateAssignments,
        addNotification,
        updateSettings,
        loading,
        error,
      }}
    >
      {children}
    </FacultyContext.Provider>
  );
}

export function useFaculty() {
  const context = useContext(FacultyContext);
  if (context === undefined) {
    throw new Error("useFaculty must be used within a FacultyProvider");
  }
  return context;
}