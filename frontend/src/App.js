import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'; // Import Bootstrap CSS
import LoginPage from './components/auth/LoginPage';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import FacultyDashboard from './pages/dashboard/FacultyDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import DepartmentAdminDashboard from './pages/dashboard/DepartmentAdminDashboard';
import LibraryStaffDashboard from './pages/dashboard/LibraryStaffDashboard';
import ITAdminDashboard from './pages/dashboard/ITAdminDashboard';

// Student Dashboard Pages
import CoursesPage from './pages/dashboard/student/CoursesPage';
import ClassroomPage from './pages/dashboard/student/ClassroomPage';
import AssignmentsPage from './pages/dashboard/student/AssignmentsPage';
import GradesPage from './pages/dashboard/student/GradesPage';
import LibraryPage from './pages/dashboard/student/LibraryPage';
import CalendarPage from './pages/dashboard/student/CalendarPage';
import MessagesPage from './pages/dashboard/student/MessagesPage';
import SettingsPage from './pages/dashboard/student/SettingsPage';

// Flash Card Pages
import CampusEventPage from './pages/dashboard/student/CampusEventPage';
import CampusMapPage from './pages/dashboard/student/CampusMapPage';
import UpcomingExamPage from './pages/dashboard/student/UpcomingExamPage';
import MealPlanPage from './pages/dashboard/student/MealPlanPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/courses" element={<CoursesPage />} />
          <Route path="/student/classroom" element={<ClassroomPage />} />
          <Route path="/student/assignments" element={<AssignmentsPage />} />
          <Route path="/student/grades" element={<GradesPage />} />
          <Route path="/student/library" element={<LibraryPage />} />
          <Route path="/student/calendar" element={<CalendarPage />} />
          <Route path="/student/messages" element={<MessagesPage />} />
          <Route path="/student/settings" element={<SettingsPage />} />
          <Route path="/student/campus-event" element={<CampusEventPage />} />
          <Route path="/student/campus-map" element={<CampusMapPage />} />
          <Route path="/student/upcoming-exam" element={<UpcomingExamPage />} />
          <Route path="/student/meal-plan" element={<MealPlanPage />} />
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/department-admin/dashboard" element={<DepartmentAdminDashboard />} />
          <Route path="/library-staff/dashboard" element={<LibraryStaffDashboard />} />
          <Route path="/it-admin/dashboard" element={<ITAdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;