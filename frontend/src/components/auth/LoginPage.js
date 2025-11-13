import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [step, setStep] = useState("role-select");
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const ROLES = [
    { id: "student", label: "Student", description: "Access courses and assignments" },
    { id: "faculty", label: "Faculty", description: "Manage classes and grades" },
    { id: "admin", label: "Department Admin", description: "Administrative control" },
    { id: "advisor", label: "Academic Advisor", description: "Student advising" },
    { id: "library", label: "Library Staff", description: "Library management" },
    { id: "finance", label: "Finance Admin", description: "Financial management" },
    { id: "research", label: "Research Admin", description: "Research management" },
    { id: "it-admin", label: "IT Admin", description: "System administration" },
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setStep("login");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      const roleMap = {
        student: "/student/dashboard",
        faculty: "/faculty/dashboard",
        advisor: "/advisor/dashboard",
        admin: "/admin/dashboard",
        finance: "/finance/dashboard",
        library: "/library/dashboard",
        research: "/research/dashboard",
        "it-admin": "/it-admin/dashboard",
      };
      navigate(roleMap[selectedRole || "student"] || "/student/dashboard");
    }, 1500);
  };

  const handleBackToRoles = () => {
    setStep("role-select");
    setSelectedRole(null);
    setEmail("");
    setPassword("");
  };

  const selectedRoleInfo = ROLES.find((r) => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === "role-select" ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Welcome Back</h1>
              <p className="text-gray-600">Select your role to continue</p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 text-left transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 min-w-[200px]"
                  style={{ flex: '1 1 calc(50% - 10px)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative space-y-1">
                    <p className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                      {role.label}
                    </p>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-600 hover:underline font-medium">
                Sign up here
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="space-y-3 p-6">
              <button
                onClick={handleBackToRoles}
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors mb-2"
              >
                ← Back to roles
              </button>
              <h2 className="text-2xl md:text-3xl font-bold">Sign In</h2>
              <p className="text-gray-600">
                Logging in as <span className="font-medium text-blue-600">{selectedRoleInfo?.label}</span>
              </p>
            </div>

            <div className="px-6 pb-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email or Username</label>
                  <input
                    id="email"
                    type="text"
                    placeholder="student@iub.edu.pk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <a href="/forgot-password" className="text-xs text-blue-600 hover:underline">
                      Forgot?
                    </a>
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <button 
                  type="submit" 
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="/register" className="text-blue-600 hover:underline font-medium">
                  Create one now
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;