/**
 * Utility functions for faculty grade calculations and management
 */

export interface GradeDistribution {
  A: number;
  B: number;
  C: number;
  D: number;
  F: number;
}

export interface StudentGrade {
  studentId: string;
  studentName: string;
  score: number;
  grade?: string;
}

/**
 * Calculate letter grade based on numeric score
 * @param score Numeric score (0-100)
 * @returns Letter grade (A, B, C, D, F)
 */
export const calculateLetterGrade = (score: number): string => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

/**
 * Calculate grade distribution for a set of student grades
 * @param grades Array of student grades with scores
 * @returns Grade distribution object
 */
export const calculateGradeDistribution = (grades: StudentGrade[]): GradeDistribution => {
  const distribution: GradeDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  
  grades.forEach(grade => {
    const letterGrade = calculateLetterGrade(grade.score);
    if (letterGrade in distribution) {
      distribution[letterGrade as keyof GradeDistribution]++;
    }
  });
  
  return distribution;
};

/**
 * Calculate class average
 * @param grades Array of student grades with scores
 * @returns Average score
 */
export const calculateClassAverage = (grades: StudentGrade[]): number => {
  if (grades.length === 0) return 0;
  
  const total = grades.reduce((sum, grade) => sum + grade.score, 0);
  return Math.round((total / grades.length) * 100) / 100;
};

/**
 * Calculate median score
 * @param grades Array of student grades with scores
 * @returns Median score
 */
export const calculateMedianScore = (grades: StudentGrade[]): number => {
  if (grades.length === 0) return 0;
  
  const sortedScores = [...grades].sort((a, b) => a.score - b.score);
  const mid = Math.floor(sortedScores.length / 2);
  
  if (sortedScores.length % 2 === 0) {
    return (sortedScores[mid - 1].score + sortedScores[mid].score) / 2;
  }
  
  return sortedScores[mid].score;
};

/**
 * Get grade statistics
 * @param grades Array of student grades with scores
 * @returns Object with various grade statistics
 */
export const getGradeStatistics = (grades: StudentGrade[]) => {
  const distribution = calculateGradeDistribution(grades);
  const average = calculateClassAverage(grades);
  const median = calculateMedianScore(grades);
  const highest = grades.length > 0 ? Math.max(...grades.map(g => g.score)) : 0;
  const lowest = grades.length > 0 ? Math.min(...grades.map(g => g.score)) : 0;
  
  return {
    distribution,
    average,
    median,
    highest,
    lowest,
    totalStudents: grades.length
  };
};

/**
 * Assign letter grades to all students
 * @param grades Array of student grades with scores
 * @returns Array of student grades with assigned letter grades
 */
export const assignLetterGrades = (grades: StudentGrade[]): StudentGrade[] => {
  return grades.map(grade => ({
    ...grade,
    grade: calculateLetterGrade(grade.score)
  }));
};