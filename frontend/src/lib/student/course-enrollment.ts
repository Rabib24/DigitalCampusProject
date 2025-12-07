import { apiGet, apiPost, apiDelete } from '@/lib/api';

// Course interfaces
export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  department: string;
  instructor_id: string;
  schedule: any;
  available_seats: number;
  total_seats: number;
  description: string;
  prerequisites?: string[];
  prereqs_met?: boolean;
}

export interface Enrollment {
  id: string;
  course_id: string;
  course_name: string;
  course_code: string;
  credits: number;
  grade: string | null;
  status: string;
  enrollment_date: string | null;
}

export interface WaitlistedCourse {
  course_id: string;
  course_name: string;
  course_code: string;
  waitlist_position: number;
  department: string;
}

export interface CartItem {
  course_id: string;
  course_name: string;
  course_code: string;
  credits: number;
  department: string;
  added_date: string;
}

// Custom error class for course enrollment errors
export class CourseEnrollmentError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any,
    public statusCode?: number,
    public retryable?: boolean
  ) {
    super(message);
    this.name = 'CourseEnrollmentError';
  }
}

// Helper function to handle API errors
async function handleApiError(response: Response, action: string): Promise<never> {
  let errorMessage = `Failed to ${action}`;
  let errorCode: string | undefined;
  let errorDetails: any;
  let retryable = false;

  // Determine if the error is retryable based on status code
  switch (response.status) {
    case 408: // Request Timeout
    case 429: // Too Many Requests
    case 500: // Internal Server Error
    case 502: // Bad Gateway
    case 503: // Service Unavailable
    case 504: // Gateway Timeout
      retryable = true;
      break;
    default:
      retryable = false;
  }

  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.detail || errorMessage;
    errorCode = errorData.code || response.status.toString();
    errorDetails = errorData;
  } catch {
    // If we can't parse JSON, use status text
    errorMessage = `${errorMessage}: ${response.statusText}`;
    errorCode = response.status.toString();
  }

  throw new CourseEnrollmentError(errorMessage, errorCode, errorDetails, response.status, retryable);
}

// Helper function to retry API calls
async function retryApiCall<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // If it's not a CourseEnrollmentError or not retryable, throw immediately
      if (!(error instanceof CourseEnrollmentError) || !error.retryable) {
        throw error;
      }
      
      // If we've exhausted retries, throw the error
      if (i === maxRetries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  
  throw lastError;
}

// Search parameters interface
interface SearchParams {
  query?: string;
  department?: string;
  minCredits?: number;
  maxCredits?: number;
  sortBy?: string;
}

// Course Enrollment API Service
export class CourseEnrollmentService {
  // Get all available courses for enrollment
  static async getAvailableCourses(): Promise<Course[]> {
    try {
      return await retryApiCall(async () => {
        const response = await apiGet('/student/courses/available/');
        if (!response.ok) {
          await handleApiError(response, 'fetch available courses');
        }
        const data = await response.json();
        return data.courses || [];
      });
    } catch (error) {
      if (error instanceof CourseEnrollmentError) {
        throw error;
      }
      console.error('Failed to fetch available courses:', error);
      throw new CourseEnrollmentError('Failed to fetch available courses', 'FETCH_COURSES_ERROR');
    }
  }

  // Search courses with advanced filtering
  static async searchCourses(params: SearchParams): Promise<Course[]> {
    try {
      return await retryApiCall(async () => {
        // Build query string
        const queryParams = new URLSearchParams();
        
        if (params.query) {
          queryParams.append('query', params.query);
        }
        
        if (params.department) {
          queryParams.append('department', params.department);
        }
        
        if (params.minCredits !== undefined) {
          queryParams.append('min_credits', params.minCredits.toString());
        }
        
        if (params.maxCredits !== undefined) {
          queryParams.append('max_credits', params.maxCredits.toString());
        }
        
        if (params.sortBy) {
          queryParams.append('sort_by', params.sortBy);
        }
        
        const queryString = queryParams.toString();
        const url = queryString 
          ? `/student/courses/search/?${queryString}`
          : '/student/courses/search/';
        
        const response = await apiGet(url);
        if (!response.ok) {
          await handleApiError(response, 'search courses');
        }
        const data = await response.json();
        return data.courses || [];
      });
    } catch (error) {
      if (error instanceof CourseEnrollmentError) {
        throw error;
      }
      console.error('Failed to search courses:', error);
      throw new CourseEnrollmentError('Failed to search courses', 'SEARCH_COURSES_ERROR');
    }
  }

  // Get recommended courses
  static async getRecommendedCourses(): Promise<Course[]> {
    try {
      return await retryApiCall(async () => {
        const response = await apiGet('/student/courses/recommended/');
        if (!response.ok) {
          await handleApiError(response, 'fetch recommended courses');
        }
        const data = await response.json();
        return data.courses || [];
      });
    } catch (error) {
      if (error instanceof CourseEnrollmentError) {
        throw error;
      }
      console.error('Failed to fetch recommended courses:', error);
      throw new CourseEnrollmentError('Failed to fetch recommended courses', 'FETCH_RECOMMENDED_ERROR');
    }
  }

  // Enroll in a course
  static async enrollInCourse(courseId: string): Promise<any> {
    try {
      return await retryApiCall(async () => {
        const response = await apiPost(`/student/courses/${courseId}/enroll/`, {});
        if (!response.ok) {
          await handleApiError(response, 'enroll in course');
        }
        const data = await response.json();
        return data;
      });
    } catch (error) {
      if (error instanceof CourseEnrollmentError) {
        throw error;
      }
      console.error('Failed to enroll in course:', error);
      throw new CourseEnrollmentError('Failed to enroll in course', 'ENROLL_COURSE_ERROR');
    }
  }

  // Drop a course
  static async dropCourse(courseId: string): Promise<any> {
    try {
      return await retryApiCall(async () => {
        const response = await apiPost(`/student/courses/${courseId}/drop/`, {});
        if (!response.ok) {
          await handleApiError(response, 'drop course');
        }
        const data = await response.json();
        return data;
      });
    } catch (error) {
      if (error instanceof CourseEnrollmentError) {
        throw error;
      }
      console.error('Failed to drop course:', error);
      throw new CourseEnrollmentError('Failed to drop course', 'DROP_COURSE_ERROR');
    }
  }

  // Get student's current enrollments
  static async getStudentEnrollments(): Promise<Enrollment[]> {
    try {
      return await retryApiCall(async () => {
        const response = await apiGet('/student/enrollments/');
        if (!response.ok) {
          await handleApiError(response, 'fetch student enrollments');
        }
        const data = await response.json();
        return data.enrollments || [];
      });
    } catch (error) {
      if (error instanceof CourseEnrollmentError) {
        throw error;
      }
      console.error('Failed to fetch student enrollments:', error);
      throw new CourseEnrollmentError('Failed to fetch student enrollments', 'FETCH_ENROLLMENTS_ERROR');
    }
  }

  // Get waitlisted courses
  static async getWaitlistedCourses(): Promise<WaitlistedCourse[]> {
    try {
      return await retryApiCall(async () => {
        const response = await apiGet('/student/courses/waitlist/');
        if (!response.ok) {
          await handleApiError(response, 'fetch waitlisted courses');
        }
        const data = await response.json();
        return data.waitlisted_courses || [];
      });
    } catch (error) {
      if (error instanceof CourseEnrollmentError) {
        throw error;
      }
      console.error('Failed to fetch waitlisted courses:', error);
      throw new CourseEnrollmentError('Failed to fetch waitlisted courses', 'FETCH_WAITLIST_ERROR');
    }
  }

  // Cart operations
  static async getCart(): Promise<CartItem[]> {
    try {
      return await retryApiCall(async () => {
        const response = await apiGet('/student/enrollment/cart/');
        if (!response.ok) {
          await handleApiError(response, 'fetch cart');
        }
        const data = await response.json();
        return data.cart_items || [];
      });
    } catch (error) {
      if (error instanceof CourseEnrollmentError) {
        throw error;
      }
      console.error('Failed to fetch cart:', error);
      throw new CourseEnrollmentError('Failed to fetch cart', 'FETCH_CART_ERROR');
    }
  }

  static async addToCart(courseId: string): Promise<any> {
    try {
      return await retryApiCall(async () => {
        const response = await apiPost(`/student/enrollment/cart/add/${courseId}/`, {});
        if (!response.ok) {
          await handleApiError(response, 'add course to cart');
        }
        const data = await response.json();
        return data;
      });
    } catch (error) {
      if (error instanceof CourseEnrollmentError) {
        throw error;
      }
      console.error('Failed to add course to cart:', error);
      throw new CourseEnrollmentError('Failed to add course to cart', 'ADD_TO_CART_ERROR');
    }
  }

  static async removeFromCart(courseId: string): Promise<any> {
    try {
      return await retryApiCall(async () => {
        const response = await apiPost(`/student/enrollment/cart/remove/${courseId}/`, {});
        if (!response.ok) {
          await handleApiError(response, 'remove course from cart');
        }
        const data = await response.json();
        return data;
      });
    } catch (error) {
      if (error instanceof CourseEnrollmentError) {
        throw error;
      }
      console.error('Failed to remove course from cart:', error);
      throw new CourseEnrollmentError('Failed to remove course from cart', 'REMOVE_FROM_CART_ERROR');
    }
  }

  static async clearCart(): Promise<any> {
    try {
      return await retryApiCall(async () => {
        const response = await apiPost('/student/enrollment/cart/clear/', {});
        if (!response.ok) {
          await handleApiError(response, 'clear cart');
        }
        const data = await response.json();
        return data;
      });
    } catch (error) {
      if (error instanceof CourseEnrollmentError) {
        throw error;
      }
      console.error('Failed to clear cart:', error);
      throw new CourseEnrollmentError('Failed to clear cart', 'CLEAR_CART_ERROR');
    }
  }

  static async enrollFromCart(): Promise<any> {
    try {
      return await retryApiCall(async () => {
        const response = await apiPost('/student/enrollment/cart/enroll/', {});
        if (!response.ok) {
          await handleApiError(response, 'enroll from cart');
        }
        const data = await response.json();
        return data;
      });
    } catch (error) {
      if (error instanceof CourseEnrollmentError) {
        throw error;
      }
      console.error('Failed to enroll from cart:', error);
      throw new CourseEnrollmentError('Failed to enroll from cart', 'ENROLL_FROM_CART_ERROR');
    }
  }
}