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
  courses: any[];
  loading: boolean;
  error: string | null;
}

interface FacultyAssignmentsState {
  assignments: any[];
  loading: boolean;
  error: string | null;
}

interface FacultyState {
  profile: FacultyProfile | null;
  courses: FacultyCoursesState;
  assignments: FacultyAssignmentsState;
  notifications: any[];
  settings: any;
}

interface FacultyContextType {
  state: FacultyState;
  updateProfile: (profile: FacultyProfile) => void;
  updateCourses: (courses: any[]) => void;
  updateAssignments: (assignments: any[]) => void;
  addNotification: (notification: any) => void;
  updateSettings: (settings: any) => void;
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
    const userData = getUserData();
    if (userData) {
      setState(prev => ({
        ...prev,
        profile: {
          id: userData.id,
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          department: userData.department || "",
          role: userData.role,
        }
      }));
    }
  }, []);

  const updateProfile = (profile: FacultyProfile) => {
    setState(prev => ({
      ...prev,
      profile,
    }));
  };

  const updateCourses = (courses: any[]) => {
    setState(prev => ({
      ...prev,
      courses: {
        ...prev.courses,
        courses,
      },
    }));
  };

  const updateAssignments = (assignments: any[]) => {
    setState(prev => ({
      ...prev,
      assignments: {
        ...prev.assignments,
        assignments,
      },
    }));
  };

  const addNotification = (notification: any) => {
    setState(prev => ({
      ...prev,
      notifications: [...prev.notifications, notification],
    }));
  };

  const updateSettings = (settings: any) => {
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