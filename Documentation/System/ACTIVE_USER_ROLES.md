# Active User Roles - Quick Reference

## Last Updated: December 23, 2024

---

## Available Login Roles

The following user roles are available for login through the login page:

### 1. **Student** 
- **Role ID:** `student`
- **Dashboard:** `/student`
- **Login Endpoint:** `/api/v1/auth/login/`
- **Description:** Access courses, assignments, grades, and enrollment

### 2. **Faculty**
- **Role ID:** `faculty`
- **Dashboard:** `/faculty`
- **Login Endpoint:** `/api/v1/faculty/auth/login/`
- **Description:** Manage classes, assignments, grading, and research

### 3. **Department Admin**
- **Role ID:** `admin`
- **Dashboard:** `/admin`
- **Login Endpoint:** `/api/v1/auth/login/`
- **Description:** Administrative control over departments, users, and permissions

### 4. **Library Staff**
- **Role ID:** `library`
- **Dashboard:** `/library`
- **Login Endpoint:** `/api/v1/auth/login/`
- **Description:** Manage library catalog, patrons, and loans

### 5. **Finance Admin**
- **Role ID:** `finance`
- **Dashboard:** `/finance`
- **Login Endpoint:** `/api/v1/auth/login/`
- **Description:** Financial management, invoices, and transactions

### 6. **Research Admin**
- **Role ID:** `research`
- **Dashboard:** `/research`
- **Login Endpoint:** `/api/v1/auth/login/`
- **Description:** Research project management and ethics oversight

---

## Disabled Login Roles (Dashboards Still Exist)

These roles have been removed from the login page but their dashboards are fully functional:

### 7. **Academic Advisor** (HIDDEN)
- **Role ID:** `advisor`
- **Dashboard:** `/advisor` (accessible via direct URL)
- **Status:** Removed from login selection
- **Reason:** Per user request

### 8. **IT Admin** (HIDDEN)
- **Role ID:** `it-admin`
- **Dashboard:** `/it-admin` (accessible via direct URL)
- **Status:** Removed from login selection
- **Reason:** Per user request

---

## Login Credentials Format

### Email/Username
- University email: `username@iub.edu.bd`
- Or Student/Employee ID: `2221001`

### Test Accounts

| Role | Username/Email | Password |
|------|---------------|----------|
| Student | `2221001@iub.edu.bd` or `2221001` | `DigitalCampus123` |
| Faculty | `2221002@iub.edu.bd` or `2221002` | `DigitalCampus123` |
| Admin | `2221003@iub.edu.bd` or `2221003` | `DigitalCampus123` |

---

## Dashboard Status Summary

| Role | Login Available | Dashboard Exists | Backend API | Production Ready |
|------|----------------|------------------|-------------|------------------|
| Student | ✅ Yes | ✅ Yes | ✅ Full | ✅ Yes |
| Faculty | ✅ Yes | ✅ Yes | ✅ Full | ✅ Yes |
| Department Admin | ✅ Yes | ✅ Yes | ✅ Full | ✅ Yes |
| Library Staff | ✅ Yes | ✅ Yes | ⚠️ Partial | ⚠️ Needs API |
| Finance Admin | ✅ Yes | ✅ Yes | ⚠️ Partial | ⚠️ Needs API |
| Research Admin | ✅ Yes | ✅ Yes | ⚠️ Partial | ⚠️ Needs API |
| Academic Advisor | ❌ Hidden | ✅ Yes | ⚠️ Partial | ⚠️ Needs Config |
| IT Admin | ❌ Hidden | ✅ Yes | ⚠️ Partial | ⚠️ Needs Config |

---

## How to Re-enable Hidden Roles

If you need to make Academic Advisor or IT Admin available again:

1. Open: `frontend/src/app/login/page.tsx`
2. Find the `ROLES` array (around line 9)
3. Add the desired role(s):

```typescript
const ROLES = [
  { id: "student", label: "Student", description: "Access courses and assignments" },
  { id: "faculty", label: "Faculty", description: "Manage classes and grades" },
  { id: "admin", label: "Department Admin", description: "Administrative control" },
  { id: "advisor", label: "Academic Advisor", description: "Student advising" }, // ADD THIS
  { id: "library", label: "Library Staff", description: "Library management" },
  { id: "finance", label: "Finance Admin", description: "Financial management" },
  { id: "research", label: "Research Admin", description: "Research management" },
  { id: "it-admin", label: "IT Admin", description: "System administration" }, // ADD THIS
];
```

4. Save the file - no other changes needed!

---

## Notes

- All dashboards are protected by their respective `ProtectedRoute` components
- Role-based middleware ensures backend API security
- JWT tokens are used for authentication
- Tokens expire after 24 hours
- Users must have `status: 'active'` to login successfully
