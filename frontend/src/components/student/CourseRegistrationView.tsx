"use client";

import { useState, useEffect } from "react";
import { CourseEnrollmentService, type Course, CourseEnrollmentError } from "@/lib/student/course-enrollment";
import { CourseCatalogBrowser } from "./CourseCatalogBrowser";
import { CourseSearchFilter } from "./CourseSearchFilter";
import { EnrollmentCart } from "./EnrollmentCart";
import { BookOpen, ShoppingCart, Filter, Search, Sparkles, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock function to simulate getting student profile
// In a real application, this would come from an authentication context or API
const getStudentProfile = async () => {
  // This is a mock implementation - in a real app, you would fetch this from an API
  // For now, we'll return a mock student profile with a default department
  return {
    department: "Computer Science"
  };
};

export function CourseRegistrationView() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [minCredits, setMinCredits] = useState<number | undefined>(undefined);
  const [maxCredits, setMaxCredits] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>("name");
  const [showCart, setShowCart] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"all" | "recommended">("all");

  // Load student profile and set default department
  useEffect(() => {
    const loadStudentProfile = async () => {
      try {
        const profile = await getStudentProfile();
        setSelectedDepartment(profile.department);
      } catch (err) {
        console.error("Failed to load student profile:", err);
        // Default to Computer Science if profile loading fails
        setSelectedDepartment("Computer Science");
      }
    };

    loadStudentProfile();
  }, []);

  // Load available courses on component mount
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const [availableCourses, recommended] = await Promise.all([
          CourseEnrollmentService.getAvailableCourses(),
          CourseEnrollmentService.getRecommendedCourses()
        ]);
        setCourses(availableCourses);
        setRecommendedCourses(recommended);
        setFilteredCourses(availableCourses);
      } catch (err) {
        if (err instanceof CourseEnrollmentError) {
          setError(err.message);
        } else {
          setError("Failed to load available courses");
        }
        console.error("Courses load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Load cart item count
  useEffect(() => {
    const loadCartCount = async () => {
      try {
        const cart = await CourseEnrollmentService.getCart();
        setCartItemCount(cart.length);
      } catch (err) {
        console.error("Failed to load cart count:", err);
      }
    };

    loadCartCount();
  }, []);

  // Filter and sort courses based on all criteria
  useEffect(() => {
    // For recommended tab, we'll use client-side filtering since these are already personalized
    if (activeTab === "recommended") {
      let result = recommendedCourses;

      // Text search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(course =>
          course.name.toLowerCase().includes(query) ||
          course.code.toLowerCase().includes(query) ||
          course.department.toLowerCase().includes(query)
        );
      }

      // Department filter
      if (selectedDepartment) {
        result = result.filter(course => course.department === selectedDepartment);
      }

      // Credit filters
      if (minCredits !== undefined) {
        result = result.filter(course => course.credits >= minCredits);
      }

      if (maxCredits !== undefined) {
        result = result.filter(course => course.credits <= maxCredits);
      }

      // Sort courses
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case "code":
            return a.code.localeCompare(b.code);
          case "department":
            return a.department.localeCompare(b.department);
          case "credits":
            return b.credits - a.credits;
          case "availability":
            return b.available_seats - a.available_seats;
          default: // name
            return a.name.localeCompare(b.name);
        }
      });

      setFilteredCourses(result);
    } else {
      // For all courses tab, use server-side search with advanced filtering
      const performSearch = async () => {
        try {
          setLoading(true);
          const searchParams: any = {};

          if (searchQuery) {
            searchParams.query = searchQuery;
          }

          if (selectedDepartment) {
            searchParams.department = selectedDepartment;
          }

          if (minCredits !== undefined) {
            searchParams.minCredits = minCredits;
          }

          if (maxCredits !== undefined) {
            searchParams.maxCredits = maxCredits;
          }

          if (sortBy) {
            searchParams.sortBy = sortBy;
          }

          const searchResults = await CourseEnrollmentService.searchCourses(searchParams);
          setFilteredCourses(searchResults);
        } catch (err) {
          if (err instanceof CourseEnrollmentError) {
            setError(err.message);
          } else {
            setError("Failed to search courses");
          }
          console.error("Search error:", err);
          // Fallback to client-side filtering
          let result = courses;

          // Text search filter
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(course =>
              course.name.toLowerCase().includes(query) ||
              course.code.toLowerCase().includes(query) ||
              course.department.toLowerCase().includes(query)
            );
          }

          // Department filter
          if (selectedDepartment) {
            result = result.filter(course => course.department === selectedDepartment);
          }

          // Credit filters
          if (minCredits !== undefined) {
            result = result.filter(course => course.credits >= minCredits);
          }

          if (maxCredits !== undefined) {
            result = result.filter(course => course.credits <= maxCredits);
          }

          // Sort courses
          result = [...result].sort((a, b) => {
            switch (sortBy) {
              case "code":
                return a.code.localeCompare(b.code);
              case "department":
                return a.department.localeCompare(b.department);
              case "credits":
                return b.credits - a.credits;
              case "availability":
                return b.available_seats - a.available_seats;
              default: // name
                return a.name.localeCompare(b.name);
            }
          });

          setFilteredCourses(result);
        } finally {
          setLoading(false);
        }
      };

      performSearch();
    }
  }, [searchQuery, selectedDepartment, minCredits, maxCredits, sortBy, courses, recommendedCourses, activeTab]);

  // Get unique departments for filter dropdown
  const departments = [...new Set(courses.map(course => course.department))];

  const handleAddToCart = async (courseId: string) => {
    try {
      await CourseEnrollmentService.addToCart(courseId);
      // Refresh cart count
      const cart = await CourseEnrollmentService.getCart();
      setCartItemCount(cart.length);
    } catch (err) {
      let errorMessage = "Failed to add course to cart";
      let retryable = false;

      if (err instanceof CourseEnrollmentError) {
        errorMessage = err.message;
        retryable = err.retryable || false;
      }

      setError(`${errorMessage}${retryable ? ' (Retry available)' : ''}`);
      console.error("Failed to add to cart:", err);

      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Course Registration</h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Browse and enroll in courses for the upcoming semester
            </p>
          </div>
        </div>
      </div>



      {/* Floating Cart Button at Bottom Right */}
      {cartItemCount > 0 && (
        <button
          type="button"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary p-3 md:p-4 text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:shadow-xl"
          onClick={() => setShowCart(!showCart)}
          aria-label="View enrollment cart"
        >
          <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
          <span className="font-bold text-base md:text-lg">{cartItemCount}</span>
        </button>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row border-b border-muted mb-6">
            <button
              type="button"
              className={`px-4 py-2 font-medium text-sm sm:text-base ${
                activeTab === "all"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All Courses
            </button>
            <button
              type="button"
              className={`px-4 py-2 font-medium text-sm sm:text-base flex items-center gap-2 ${
                activeTab === "recommended"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("recommended")}
            >
              <Sparkles className="h-4 w-4" />
              Recommended
            </button>
          </div>

          <div className="rounded-lg border bg-card p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Search & Filter</h3>
            </div>
            <CourseSearchFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedDepartment={selectedDepartment}
              onDepartmentChange={setSelectedDepartment}
              departments={departments}
              minCredits={minCredits}
              onMinCreditsChange={setMinCredits}
              maxCredits={maxCredits}
              onMaxCreditsChange={setMaxCredits}
              sortBy={sortBy}
              onSortByChange={setSortBy}
            />
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold">
                  {activeTab === "recommended" ? "Recommended Courses" : "Available Courses"}
                </h3>
              </div>
              <span className="text-sm text-muted-foreground">
                {filteredCourses.length} courses found
              </span>
            </div>

            <CourseCatalogBrowser
              courses={filteredCourses}
              loading={loading}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        <div className="lg:col-span-3 xl:col-span-1">
          <EnrollmentCart
            isOpen={showCart}
            onClose={() => setShowCart(false)}
            onEnroll={async () => {
              try {
                await CourseEnrollmentService.enrollFromCart();
                // Refresh cart and courses
                const cart = await CourseEnrollmentService.getCart();
                setCartItemCount(cart.length);
                // Reload courses to reflect enrollment changes
                const [availableCourses, recommended] = await Promise.all([
                  CourseEnrollmentService.getAvailableCourses(),
                  CourseEnrollmentService.getRecommendedCourses()
                ]);
                setCourses(availableCourses);
                setRecommendedCourses(recommended);
              } catch (err) {
                let errorMessage = "Failed to enroll from cart";
                let retryable = false;

                if (err instanceof CourseEnrollmentError) {
                  errorMessage = err.message;
                  retryable = err.retryable || false;
                }

                setError(`${errorMessage}${retryable ? ' (Retry available)' : ''}`);
                console.error("Failed to enroll from cart:", err);

                // Clear error after 5 seconds
                setTimeout(() => setError(null), 5000);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}