import { useState, useEffect } from 'react';

interface FacultyCourse {
  id: string;
  code: string;
  name: string;
  semester: string;
  year: number;
  studentCount: number;
  department: string;
}

export const useFacultyCourses = (facultyId: string) => {
  const [courses, setCourses] = useState<FacultyCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call to fetch faculty courses
    const fetchCourses = async () => {
      try {
        // In a real application, this would be an API call
        // const response = await fetch(`/api/faculty/${facultyId}/courses`);
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockCourses: FacultyCourse[] = [
          {
            id: '1',
            code: 'CS-101',
            name: 'Introduction to Computer Science',
            semester: 'Fall',
            year: 2023,
            studentCount: 45,
            department: 'Computer Science'
          },
          {
            id: '2',
            code: 'CS-205',
            name: 'Web Development',
            semester: 'Fall',
            year: 2023,
            studentCount: 32,
            department: 'Computer Science'
          },
          {
            id: '3',
            code: 'CS-301',
            name: 'Data Science and Machine Learning',
            semester: 'Fall',
            year: 2023,
            studentCount: 28,
            department: 'Computer Science'
          }
        ];
        
        setCourses(mockCourses);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, [facultyId]);

  return { courses, loading, error };
};