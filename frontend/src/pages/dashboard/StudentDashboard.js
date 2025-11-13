import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/layout/DashboardLayout';
import StudentDashboardContent from '../../components/dashboard/StudentDashboardContent';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('Checking authentication:', { token, userData });
    
    if (!token || !userData) {
      console.log('No token or user data found, redirecting to login');
      navigate('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      console.log('Parsed user:', parsedUser);
      
      if (parsedUser.role.toLowerCase() !== 'student') {
        console.log('User is not a student, redirecting to login');
        navigate('/login');
        return;
      }
      
      setUser(parsedUser);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-form-wrapper">
          <div className="loading">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout 
      user={user} 
      onLogout={handleLogout}
      title="Student Dashboard"
    >
      <StudentDashboardContent />
    </DashboardLayout>
  );
};

export default StudentDashboard;