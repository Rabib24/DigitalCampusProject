import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/dashboard/layout/DashboardLayout';

const CoursesPage = ({ user, onLogout }) => {
  const navigate = useNavigate();
  
  // Sample course data
  const courses = [
    {
      id: 1,
      code: "CS-203",
      name: "Data Structures and Algorithms",
      instructor: "Dr. Ahmed Khan",
      credits: 3,
      status: "Active",
      resources: 42,
    },
    {
      id: 2,
      code: "MA-101",
      name: "Calculus I",
      instructor: "Prof. Fatima Ali",
      credits: 4,
      status: "Active",
      resources: 38,
    },
    {
      id: 3,
      code: "EN-102",
      name: "English Literature",
      instructor: "Dr. Sarah Johnson",
      credits: 3,
      status: "Active",
      resources: 25,
    },
    {
      id: 4,
      code: "PH-203",
      name: "Physics II",
      instructor: "Prof. Hassan Malik",
      credits: 4,
      status: "Active",
      resources: 31,
    },
    {
      id: 5,
      code: "EC-101",
      name: "Principles of Economics",
      instructor: "Dr. Aisha Patel",
      credits: 3,
      status: "Active",
      resources: 29,
    },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout} title="My Courses">
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">My Courses</h2>
          <p className="text-gray-600 mt-1">You are enrolled in 5 courses this semester</p>
        </div>

        <div className="grid gap-4">
          {courses.map((course) => (
            <div key={course.id} className="rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📚</span>
                      <h3 className="text-lg font-semibold">{course.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {course.code} • {course.credits} Credits
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                    {course.status}
                  </span>
                </div>
              </div>
              <div className="px-6 pb-6">
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <p>
                      Instructor: <span className="font-medium text-gray-800">{course.instructor}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-lg bg-gray-50 p-2 flex items-center gap-2">
                      <span className="text-base">📥</span>
                      <span>{course.resources} Resources</span>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-2 flex items-center gap-2">
                      <span className="text-base">🎥</span>
                      <span>Video Lectures</span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-100 h-8 rounded-md px-3 gap-2"
                      onClick={() => navigate(`/student/course-${course.id}`)}
                    >
                      <span className="text-base">📥</span>
                      View Course
                    </button>
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-100 h-8 rounded-md px-3 gap-2">
                      <span className="text-base">📚</span>
                      Notes
                    </button>
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-100 h-8 rounded-md px-3 gap-2">
                      <span className="text-base">💬</span>
                      Discussion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoursesPage;