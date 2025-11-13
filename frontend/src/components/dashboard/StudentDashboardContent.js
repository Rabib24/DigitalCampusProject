import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboardContent = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Welcome back, Student!</h2>
        <p className="text-gray-600 mt-1">Here's your academic overview</p>
      </div>

      {/* Alert Banner */}
      <div className="rounded-lg border border-yellow-100 bg-yellow-50 p-4">
        <div className="flex items-start gap-3">
          <span className="text-lg">⚠️</span>
          <div>
            <h3 className="font-medium">Important Reminder</h3>
            <p className="text-sm text-gray-600">Your CGPA is 3.45. You have 2 pending assignments due this week.</p>
          </div>
        </div>
      </div>

      {/* Academic Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="pb-3">
            <h3 className="text-sm font-medium text-gray-600">Current CGPA</h3>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">3.45</div>
            <p className="text-xs text-gray-600 mt-1">↑ 0.05 from last semester</p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="pb-3">
            <h3 className="text-sm font-medium text-gray-600">Completed Courses</h3>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">24</div>
            <p className="text-xs text-gray-600 mt-1">12 remaining</p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="pb-3">
            <h3 className="text-sm font-medium text-gray-600">Predicted Graduation</h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">Dec 2025</div>
            <p className="text-xs text-gray-600 mt-1">On track</p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="pb-3">
            <h3 className="text-sm font-medium text-gray-600">Attendance Rate</h3>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">92%</div>
            <p className="text-xs text-gray-600 mt-1">Excellent</p>
          </div>
        </div>
      </div>

      {/* Quick Actions and Upcoming */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Next Assignment */}
        <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white">
          <div className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-lg">📝</span>
              <h3 className="text-lg font-medium">Next Assignment</h3>
            </div>
            <p className="text-sm text-gray-600 mt-1">Due soon</p>
          </div>
          <div className="px-6 pb-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between rounded-lg border border-gray-200 p-3">
                <div>
                  <h4 className="font-semibold">Data Structures Project</h4>
                  <p className="text-sm text-gray-600 mt-1">CS-203 • Due in 2 days</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-600">
                  Urgent
                </span>
              </div>
              <div className="flex items-start justify-between rounded-lg border border-gray-200 p-3">
                <div>
                  <h4 className="font-semibold">Essay: Global Economics</h4>
                  <p className="text-sm text-gray-600 mt-1">EC-101 • Due in 5 days</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  Pending
                </span>
              </div>
            </div>
            <button
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              onClick={() => navigate('/student/assignments')}
            >
              View All Assignments
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="p-6">
            <h3 className="text-base font-medium">Quick Links</h3>
          </div>
          <div className="px-6 pb-6 space-y-2">
            <button className="w-full justify-start gap-2 rounded-md border border-transparent bg-transparent px-3 py-2 text-left text-sm hover:bg-gray-100">
              <span className="text-base">⏰</span>
              <span>Class Schedule</span>
            </button>
            <button className="w-full justify-start gap-2 rounded-md border border-transparent bg-transparent px-3 py-2 text-left text-sm hover:bg-gray-100">
              <span className="text-base">📚</span>
              <span>Course Materials</span>
            </button>
            <button className="w-full justify-start gap-2 rounded-md border border-transparent bg-transparent px-3 py-2 text-left text-sm hover:bg-gray-100">
              <span className="text-base">⚠️</span>
              <span>Emergency Contacts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Courses */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="p-6">
          <h3 className="text-lg font-medium">Enrolled Courses (This Semester)</h3>
          <p className="text-sm text-gray-600 mt-1">You are enrolled in 5 courses</p>
        </div>
        <div className="px-6 pb-6">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {[
              { id: 1, code: "CS-203", name: "Data Structures", progress: 85 },
              { id: 2, code: "MA-101", name: "Calculus I", progress: 78 },
              { id: 3, code: "EN-102", name: "English Literature", progress: 90 },
              { id: 4, code: "PH-203", name: "Physics II", progress: 72 },
              { id: 5, code: "EC-101", name: "Economics", progress: 88 },
            ].map((course) => (
              <div
                key={course.code}
                className="rounded-lg border border-gray-200 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/student/courses`)}
              >
                <h4 className="font-semibold text-sm">{course.code}</h4>
                <p className="text-xs text-gray-600 mt-1">{course.name}</p>
                <div className="mt-2 space-y-1">
                  <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all" style={{ width: `${course.progress}%` }} />
                  </div>
                  <span className="text-xs text-gray-600">{course.progress}% Complete</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardContent;