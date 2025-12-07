/**
 * UI Component Tests for Course Registration View
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CourseRegistrationView } from '../CourseRegistrationView';

// Mock the API service
jest.mock('@/lib/student/course-enrollment', () => ({
  CourseEnrollmentService: {
    getAvailableCourses: jest.fn(),
    getRecommendedCourses: jest.fn(),
    getCart: jest.fn(),
    searchCourses: jest.fn(),
    addToCart: jest.fn()
  }
}));

// Mock child components
jest.mock('../CourseCatalogBrowser', () => ({
  CourseCatalogBrowser: () => <div data-testid="course-catalog">Course Catalog</div>
}));

jest.mock('../CourseSearchFilter', () => ({
  CourseSearchFilter: () => <div data-testid="course-search-filter">Search Filter</div>
}));

jest.mock('../EnrollmentCart', () => ({
  EnrollmentCart: () => <div data-testid="enrollment-cart">Enrollment Cart</div>
}));

describe('CourseRegistrationView', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders the component correctly', async () => {
    // Mock API responses
    const mockCourses = [
      { id: '1', code: 'CS101', name: 'Intro to Computer Science', credits: 3, department: 'Computer Science' }
    ];
    
    require('@/lib/student/course-enrollment').CourseEnrollmentService.getAvailableCourses.mockResolvedValue(mockCourses);
    require('@/lib/student/course-enrollment').CourseEnrollmentService.getRecommendedCourses.mockResolvedValue([]);
    require('@/lib/student/course-enrollment').CourseEnrollmentService.getCart.mockResolvedValue([]);

    render(<CourseRegistrationView />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Course Registration')).toBeInTheDocument();
    });
    
    // Check that key elements are present
    expect(screen.getByText('Browse and enroll in courses for the upcoming semester')).toBeInTheDocument();
    expect(screen.getByText('View Cart')).toBeInTheDocument();
  });

  it('switches between All Courses and Recommended tabs', async () => {
    const mockCourses = [
      { id: '1', code: 'CS101', name: 'Intro to Computer Science', credits: 3, department: 'Computer Science' }
    ];
    
    require('@/lib/student/course-enrollment').CourseEnrollmentService.getAvailableCourses.mockResolvedValue(mockCourses);
    require('@/lib/student/course-enrollment').CourseEnrollmentService.getRecommendedCourses.mockResolvedValue(mockCourses);
    require('@/lib/student/course-enrollment').CourseEnrollmentService.getCart.mockResolvedValue([]);

    render(<CourseRegistrationView />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('All Courses')).toBeInTheDocument();
    });
    
    // Click on Recommended tab
    const recommendedTab = screen.getByText('Recommended');
    fireEvent.click(recommendedTab);
    
    // Both tabs should be present
    expect(screen.getByText('All Courses')).toBeInTheDocument();
    expect(screen.getByText('Recommended')).toBeInTheDocument();
  });

  it('handles search filter changes', async () => {
    const mockCourses = [
      { id: '1', code: 'CS101', name: 'Intro to Computer Science', credits: 3, department: 'Computer Science' }
    ];
    
    require('@/lib/student/course-enrollment').CourseEnrollmentService.getAvailableCourses.mockResolvedValue(mockCourses);
    require('@/lib/student/course-enrollment').CourseEnrollmentService.getRecommendedCourses.mockResolvedValue([]);
    require('@/lib/student/course-enrollment').CourseEnrollmentService.getCart.mockResolvedValue([]);
    require('@/lib/student/course-enrollment').CourseEnrollmentService.searchCourses.mockResolvedValue(mockCourses);

    render(<CourseRegistrationView />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('course-search-filter')).toBeInTheDocument();
    });
  });

  it('toggles cart visibility when View Cart button is clicked', async () => {
    const mockCourses = [
      { id: '1', code: 'CS101', name: 'Intro to Computer Science', credits: 3, department: 'Computer Science' }
    ];
    
    require('@/lib/student/course-enrollment').CourseEnrollmentService.getAvailableCourses.mockResolvedValue(mockCourses);
    require('@/lib/student/course-enrollment').CourseEnrollmentService.getRecommendedCourses.mockResolvedValue([]);
    require('@/lib/student/course-enrollment').CourseEnrollmentService.getCart.mockResolvedValue([]);

    render(<CourseRegistrationView />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('View Cart')).toBeInTheDocument();
    });
    
    // Initially cart should not be visible
    expect(screen.queryByText('Enrollment Cart')).not.toBeInTheDocument();
    
    // Click View Cart button
    const viewCartButton = screen.getByText('View Cart');
    fireEvent.click(viewCartButton);
    
    // Now cart should be visible
    await waitFor(() => {
      expect(screen.getByTestId('enrollment-cart')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    require('@/lib/student/course-enrollment').CourseEnrollmentService.getAvailableCourses.mockRejectedValue(new Error('API Error'));
    require('@/lib/student/course-enrollment').CourseEnrollmentService.getRecommendedCourses.mockRejectedValue(new Error('API Error'));
    require('@/lib/student/course-enrollment').CourseEnrollmentService.getCart.mockRejectedValue(new Error('API Error'));

    render(<CourseRegistrationView />);
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('Failed to load available courses')).toBeInTheDocument();
    });
  });
});