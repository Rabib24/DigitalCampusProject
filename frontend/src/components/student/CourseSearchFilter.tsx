"use client";

import { useState, useCallback } from "react";
import { Search, Filter, ChevronDown, CreditCard, Clock } from "lucide-react";

interface CourseSearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  departments: string[];
  minCredits?: number;
  onMinCreditsChange?: (credits: number) => void;
  maxCredits?: number;
  onMaxCreditsChange?: (credits: number) => void;
  sortBy?: string;
  onSortByChange?: (sort: string) => void;
}

export function CourseSearchFilter({
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  departments,
  minCredits,
  onMinCreditsChange,
  maxCredits,
  onMaxCreditsChange,
  sortBy,
  onSortByChange
}: CourseSearchFilterProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  const handleDepartmentChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onDepartmentChange(e.target.value);
  }, [onDepartmentChange]);

  const handleMinCreditsChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onMinCreditsChange?.(e.target.value ? parseInt(e.target.value) : 0);
  }, [onMinCreditsChange]);

  const handleMaxCreditsChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onMaxCreditsChange?.(e.target.value ? parseInt(e.target.value) : 0);
  }, [onMaxCreditsChange]);

  const handleSortByChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortByChange?.(e.target.value);
  }, [onSortByChange]);

  const toggleAdvancedFilters = useCallback(() => {
    setShowAdvancedFilters(prev => !prev);
  }, []);

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search courses by name, code, or department..."
            className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        {/* Department Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-muted-foreground" />
          </div>
          <select
            className="block w-full pl-10 pr-10 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
            value={selectedDepartment}
            onChange={handleDepartmentChange}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        
        {/* Advanced Filters Toggle */}
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-2 border border-input rounded-md bg-background text-foreground hover:bg-accent"
          onClick={toggleAdvancedFilters}
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="mt-4 pt-4 border-t border-muted">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Credit Range Filter */}
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <CreditCard className="h-4 w-4" />
                Min Credits
              </label>
              <select
                className="block w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={minCredits ?? ""}
                onChange={handleMinCreditsChange}
              >
                <option value="">Any</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <CreditCard className="h-4 w-4" />
                Max Credits
              </label>
              <select
                className="block w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={maxCredits ?? ""}
                onChange={handleMaxCreditsChange}
              >
                <option value="">Any</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            
            {/* Sort By Filter */}
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Sort By
              </label>
              <select
                className="block w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={sortBy ?? "name"}
                onChange={handleSortByChange}
              >
                <option value="name">Course Name</option>
                <option value="code">Course Code</option>
                <option value="department">Department</option>
                <option value="credits">Credits</option>
                <option value="availability">Availability</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}