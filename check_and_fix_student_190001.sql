/*
SQL Script to check and fix enrollment for student 190001
Run these queries directly on your SQLite database
*/

-- 1. Check if student exists
SELECT student_id, user_id, degree_program, department 
FROM users_student 
WHERE student_id = '190001';

-- 2. Check current enrollments for student 190001
SELECT id, student_id, course_id, status, grade, enrollment_date
FROM courses_enrollment 
WHERE student_id = '190001'
ORDER BY enrollment_date DESC;

-- 3. Check available courses (to get valid course IDs)
SELECT id, code, name, department, credits, enrollment_limit
FROM courses_course
LIMIT 10;

-- 4. Check if student 190001 is in any course student lists
SELECT id, code, name, students
FROM courses_course
WHERE students LIKE '%190001%';

-- 5. FIX: Insert sample enrollments for student 190001
-- First delete any existing problematic enrollments (optional)
DELETE FROM courses_enrollment WHERE student_id = '190001';

-- Insert new enrollments (adjust course IDs based on available courses)
INSERT INTO courses_enrollment (id, student_id, course_id, section_id, enrollment_date, status, grade) VALUES
('enroll-190001-001', '190001', 'CS-101', '', datetime('now'), 'active', ''),
('enroll-190001-002', '190001', 'MA-101', '', datetime('now'), 'completed', 'B+'),
('enroll-190001-003', '190001', 'ENG-101', '', datetime('now'), 'completed', 'A-'),
('enroll-190001-004', '190001', 'PH-101', '', datetime('now'), 'active', ''),
('enroll-190001-005', '190001', 'CS-102', '', datetime('now'), 'dropped', '');

-- 6. Add student to course student lists (JSON format)
-- Note: This is more complex with JSON fields, better to use Django models

-- 7. Verify the fix worked
SELECT id, student_id, course_id, status, grade, enrollment_date
FROM courses_enrollment 
WHERE student_id = '190001'
ORDER BY enrollment_date DESC;

-- 8. Check total enrollment count
SELECT status, COUNT(*) as count
FROM courses_enrollment 
WHERE student_id = '190001'
GROUP BY status;

-- 9. Check if degree planning data will be populated
-- Completed courses should appear in degree planning
SELECT course_id, status, grade
FROM courses_enrollment 
WHERE student_id = '190001' AND status = 'completed';