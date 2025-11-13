import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children, user, onLogout, title }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleProfileMenuToggle = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  const handleNotificationToggle = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };

  const toggleMenu = () => {
    setIsMenuCollapsed(!isMenuCollapsed);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const getMenuItems = () => {
    const userRole = user?.role?.toLowerCase();
    
    switch (userRole) {
      case 'student':
        return [
          { id: 'dashboard', icon: '📊', label: 'Dashboard' },
          { id: 'courses', icon: '📚', label: 'My Courses' },
          { id: 'classroom', icon: '👨‍🏫', label: 'Classroom' },
          { id: 'assignments', icon: '📝', label: 'Assignments' },
          { id: 'grades', icon: '📈', label: 'Grades' },
          { id: 'library', icon: '📖', label: 'Library' },
          { id: 'calendar', icon: '📅', label: 'Calendar' },
          { id: 'messages', icon: '💬', label: 'Messages' },
          { id: 'settings', icon: '⚙️', label: 'Settings' }
        ];
      case 'faculty':
        return [
          { id: 'dashboard', icon: '📊', label: 'Dashboard' },
          { id: 'courses', icon: '📚', label: 'My Classes' },
          { id: 'grades', icon: '📈', label: 'Gradebook' },
          { id: 'assignments', icon: '📝', label: 'Assignments' },
          { id: 'recordings', icon: '🎥', label: 'Recordings' },
          { id: 'advising', icon: '👥', label: 'Advising' },
          { id: 'research', icon: '🔬', label: 'Research' },
          { id: 'analytics', icon: '📊', label: 'Analytics' },
          { id: 'settings', icon: '⚙️', label: 'Settings' }
        ];
      case 'admin':
        return [
          { id: 'dashboard', icon: '📊', label: 'Dashboard' },
          { id: 'courses', icon: '📚', label: 'Courses' },
          { id: 'timetable', icon: '📅', label: 'Timetable' },
          { id: 'budget', icon: '💰', label: 'Budget' },
          { id: 'faculty', icon: '👨‍🏫', label: 'Faculty' },
          { id: 'students', icon: '👥', label: 'Students' },
          { id: 'requests', icon: '📋', label: 'Requests' },
          { id: 'analytics', icon: '📊', label: 'Analytics' },
          { id: 'settings', icon: '⚙️', label: 'Settings' }
        ];
      case 'advisor':
        return [
          { id: 'dashboard', icon: '📊', label: 'Dashboard' },
          { id: 'advisees', icon: '👥', label: 'My Advisees' },
          { id: 'appointments', icon: '📅', label: 'Appointments' },
          { id: 'cgpa-simulator', icon: '📈', label: 'CGPA Simulator' },
          { id: 'milestones', icon: '📋', label: 'Milestones' },
          { id: 'settings', icon: '⚙️', label: 'Settings' }
        ];
      case 'finance':
        return [
          { id: 'dashboard', icon: '📊', label: 'Dashboard' },
          { id: 'invoices', icon: '📄', label: 'Invoices' },
          { id: 'payments', icon: '💳', label: 'Payments' },
          { id: 'scholarships', icon: '🎓', label: 'Scholarships' },
          { id: 'billing', icon: '📋', label: 'Billing History' },
          { id: 'analytics', icon: '📊', label: 'Analytics' },
          { id: 'settings', icon: '⚙️', label: 'Settings' }
        ];
      case 'library':
        return [
          { id: 'dashboard', icon: '📊', label: 'Dashboard' },
          { id: 'catalog', icon: '📚', label: 'Catalog' },
          { id: 'loans', icon: '📋', label: 'Loans' },
          { id: 'patrons', icon: '👥', label: 'Patrons' },
          { id: 'digital', icon: '💻', label: 'Digital Resources' },
          { id: 'overdue', icon: '⚠️', label: 'Overdue Items' },
          { id: 'analytics', icon: '📊', label: 'Analytics' },
          { id: 'settings', icon: '⚙️', label: 'Settings' }
        ];
      case 'research':
        return [
          { id: 'dashboard', icon: '📊', label: 'Dashboard' },
          { id: 'approvals', icon: '✅', label: 'Project Approvals' },
          { id: 'grants', icon: '💰', label: 'Grants' },
          { id: 'publications', icon: '📚', label: 'Publications' },
          { id: 'ethics', icon: '🔒', label: 'Ethics Approval' },
          { id: 'analytics', icon: '📊', label: 'Analytics' },
          { id: 'settings', icon: '⚙️', label: 'Settings' }
        ];
      case 'it-admin':
        return [
          { id: 'dashboard', icon: '📊', label: 'Dashboard' },
          { id: 'users', icon: '👥', label: 'Users' },
          { id: 'security', icon: '🔒', label: 'Security' },
          { id: 'health', icon: '❤️', label: 'System Health' },
          { id: 'backup', icon: '💾', label: 'Backup' },
          { id: 'logs', icon: '📝', label: 'Logs' },
          { id: 'integrations', icon: '🔗', label: 'Integrations' },
          { id: 'settings', icon: '⚙️', label: 'Settings' }
        ];
      default:
        return [
          { id: 'dashboard', icon: '📊', label: 'Dashboard' },
          { id: 'profile', icon: '👤', label: 'My Profile' },
          { id: 'settings', icon: '⚙️', label: 'Settings' }
        ];
    }
  };

  const handleMenuItemClick = (itemId) => {
    const userRole = user?.role?.toLowerCase() || 'student';
    
    // Navigate based on user role and menu item
    if (userRole === 'student') {
      switch (itemId) {
        case 'dashboard':
          navigate('/student/dashboard');
          break;
        case 'courses':
          navigate('/student/courses');
          break;
        case 'classroom':
          navigate('/student/classroom');
          break;
        case 'assignments':
          navigate('/student/assignments');
          break;
        case 'grades':
          navigate('/student/grades');
          break;
        case 'library':
          navigate('/student/library');
          break;
        case 'calendar':
          navigate('/student/calendar');
          break;
        case 'messages':
          navigate('/student/messages');
          break;
        case 'settings':
          navigate('/student/settings');
          break;
        default:
          navigate('/student/dashboard');
      }
    } else if (userRole === 'faculty') {
      switch (itemId) {
        case 'dashboard':
          navigate('/faculty/dashboard');
          break;
        case 'courses':
          navigate('/faculty/courses');
          break;
        case 'grades':
          navigate('/faculty/gradebook');
          break;
        case 'assignments':
          navigate('/faculty/assignments');
          break;
        case 'recordings':
          navigate('/faculty/recordings');
          break;
        case 'advising':
          navigate('/faculty/advising');
          break;
        case 'research':
          navigate('/faculty/research');
          break;
        case 'analytics':
          navigate('/faculty/analytics');
          break;
        case 'settings':
          navigate('/faculty/settings');
          break;
        default:
          navigate('/faculty/dashboard');
      }
    } else if (userRole === 'admin') {
      switch (itemId) {
        case 'dashboard':
          navigate('/admin/dashboard');
          break;
        case 'courses':
          navigate('/admin/courses');
          break;
        case 'timetable':
          navigate('/admin/timetable');
          break;
        case 'budget':
          navigate('/admin/budget');
          break;
        case 'faculty':
          navigate('/admin/faculty');
          break;
        case 'students':
          navigate('/admin/students');
          break;
        case 'requests':
          navigate('/admin/requests');
          break;
        case 'analytics':
          navigate('/admin/analytics');
          break;
        case 'settings':
          navigate('/admin/settings');
          break;
        default:
          navigate('/admin/dashboard');
      }
    } else if (userRole === 'advisor') {
      switch (itemId) {
        case 'dashboard':
          navigate('/advisor/dashboard');
          break;
        case 'advisees':
          navigate('/advisor/advisees');
          break;
        case 'appointments':
          navigate('/advisor/appointments');
          break;
        case 'cgpa-simulator':
          navigate('/advisor/cgpa-simulator');
          break;
        case 'milestones':
          navigate('/advisor/milestones');
          break;
        case 'settings':
          navigate('/advisor/settings');
          break;
        default:
          navigate('/advisor/dashboard');
      }
    } else if (userRole === 'finance') {
      switch (itemId) {
        case 'dashboard':
          navigate('/finance/dashboard');
          break;
        case 'invoices':
          navigate('/finance/invoices');
          break;
        case 'payments':
          navigate('/finance/payments');
          break;
        case 'scholarships':
          navigate('/finance/scholarships');
          break;
        case 'billing':
          navigate('/finance/billing');
          break;
        case 'analytics':
          navigate('/finance/analytics');
          break;
        case 'settings':
          navigate('/finance/settings');
          break;
        default:
          navigate('/finance/dashboard');
      }
    } else if (userRole === 'library') {
      switch (itemId) {
        case 'dashboard':
          navigate('/library/dashboard');
          break;
        case 'catalog':
          navigate('/library/catalog');
          break;
        case 'loans':
          navigate('/library/loans');
          break;
        case 'patrons':
          navigate('/library/patrons');
          break;
        case 'digital':
          navigate('/library/digital');
          break;
        case 'overdue':
          navigate('/library/overdue');
          break;
        case 'analytics':
          navigate('/library/analytics');
          break;
        case 'settings':
          navigate('/library/settings');
          break;
        default:
          navigate('/library/dashboard');
      }
    } else if (userRole === 'research') {
      switch (itemId) {
        case 'dashboard':
          navigate('/research/dashboard');
          break;
        case 'approvals':
          navigate('/research/approvals');
          break;
        case 'grants':
          navigate('/research/grants');
          break;
        case 'publications':
          navigate('/research/publications');
          break;
        case 'ethics':
          navigate('/research/ethics');
          break;
        case 'analytics':
          navigate('/research/analytics');
          break;
        case 'settings':
          navigate('/research/settings');
          break;
        default:
          navigate('/research/dashboard');
      }
    } else if (userRole === 'it-admin') {
      switch (itemId) {
        case 'dashboard':
          navigate('/it-admin/dashboard');
          break;
        case 'users':
          navigate('/it-admin/users');
          break;
        case 'security':
          navigate('/it-admin/security');
          break;
        case 'health':
          navigate('/it-admin/health');
          break;
        case 'backup':
          navigate('/it-admin/backup');
          break;
        case 'logs':
          navigate('/it-admin/logs');
          break;
        case 'integrations':
          navigate('/it-admin/integrations');
          break;
        case 'settings':
          navigate('/it-admin/settings');
          break;
        default:
          navigate('/it-admin/dashboard');
      }
    } else {
      // For other roles, keep the default behavior for now
      console.log('Menu item clicked:', itemId);
    }
  };

  const getRoleTitle = () => {
    const userRole = user?.role?.toLowerCase();
    switch (userRole) {
      case 'faculty':
        return 'Faculty Portal';
      case 'admin':
        return 'Department Admin';
      case 'library':
        return 'Library Staff';
      case 'it-admin':
        return 'IT Administration';
      case 'advisor':
        return 'Academic Advisor';
      case 'finance':
        return 'Finance Administration';
      case 'research':
        return 'Research Administration';
      default:
        return 'IUB Campus';
    }
  };

  const handleSwitchRole = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleMenu} 
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
            >
              {isMenuCollapsed ? '☰' : '✕'}
            </button>
            <h1 className="text-xl font-bold text-blue-600 md:text-2xl">{getRoleTitle()}</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Notification Bell */};
            <button 
              className="relative rounded-md p-2 hover:bg-gray-100"
              onClick={handleNotificationToggle}
            >
              <span className="text-lg">🔔</span>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                className="relative h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-medium text-blue-800"
                onClick={handleProfileMenuToggle}
              >
                {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium">{user?.first_name} {user?.last_name}</p>
                    <p className="text-xs text-gray-500">{user?.email || `${user?.role}@iub.edu`}</p>
                  </div>
                  <div className="py-1">
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => { 
                        setShowProfileMenu(false); 
                      }}
                    >
                      Profile
                    </button>
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={handleSwitchRole}
                    >
                      Switch Role
                    </button>
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Notification Panel */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
          <div className="fixed inset-0 bg-black/50" onClick={handleNotificationToggle}></div>
          <div className="relative bg-white rounded-lg border border-gray-200 shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <button 
                className="rounded-md p-1 hover:bg-gray-100"
                onClick={handleNotificationToggle}
              >
                ✕
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                <div className="rounded-lg border border-gray-200 p-3">
                  <h4 className="font-medium">Assignment Due Soon</h4>
                  <p className="text-sm text-gray-600 mt-1">CS101 Assignment 3 is due tomorrow at 11:59 PM</p>
                  <span className="text-xs text-gray-500 mt-2 block">2 hours ago</span>
                </div>
                <div className="rounded-lg border border-gray-200 p-3">
                  <h4 className="font-medium">New Course Material</h4>
                  <p className="text-sm text-gray-600 mt-1">Professor Smith has uploaded new lecture notes for CS101</p>
                  <span className="text-xs text-gray-500 mt-2 block">1 day ago</span>
                </div>
                <div className="rounded-lg border border-gray-200 p-3">
                  <h4 className="font-medium">Campus Event</h4>
                  <p className="text-sm text-gray-600 mt-1">Tech Talk: Future of AI in Education - Today 3:00 PM</p>
                  <span className="text-xs text-gray-500 mt-2 block">2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-0 md:gap-4 p-0 md:p-4">
        {/* Sidebar Toggle Button (Visible on all screens when menu is collapsed) */}
        <button 
          onClick={toggleMenu}
          className={`absolute left-0 top-20 z-30 md:static md:z-auto p-2 rounded-r-md bg-white border border-gray-200 shadow-md md:hidden ${isMenuCollapsed ? 'block' : 'hidden'}`}
        >
          ☰
        </button>

        {/* Sidebar */}
        <div className={`${isMenuCollapsed ? 'hidden md:block' : 'block'} w-full md:w-64 flex-shrink-0 transition-all duration-300`}>
          <aside className="h-[calc(100vh-80px)] overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 md:sticky md:top-20">
            <nav className="space-y-2">
              {getMenuItems().map((item) => {
                // Determine if this menu item is active based on current route
                const isActive = location.pathname.includes(item.id);
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                    className={`w-full justify-start gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-gray-100 hover:text-gray-800'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {!isMenuCollapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-80px)] mt-4 md:mt-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;