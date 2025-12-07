import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, BookOpen, FileText, MessageCircle } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  type: 'course' | 'document' | 'forum';
  relevance: number;
  department?: string;
  credits?: number;
}

interface SearchFilters {
  type: 'all' | 'course' | 'document' | 'forum';
  department: string;
  minCredits: number;
  minRelevance: number;
}

interface SearchResultsDisplayProps {
  userId: string;
}

const SearchResultsDisplay: React.FC<SearchResultsDisplayProps> = ({ userId }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    department: 'all',
    minCredits: 0,
    minRelevance: 0.5
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      // In a real implementation, this would call your AI search API
      // const response = await fetch('/api/v1/ai/search/', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`,
      //   },
      //   body: JSON.stringify({
      //     query,
      //     filters: {
      //       type: filters.type !== 'all' ? filters.type : undefined,
      //       department: filters.department !== 'all' ? filters.department : undefined,
      //       min_credits: filters.minCredits,
      //       min_relevance: filters.minRelevance
      //     }
      //   }),
      // });
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockResults: SearchResult[] = [
        {
          id: 'res_001',
          title: `Resource related to '${query}'`,
          type: 'course',
          relevance: 0.95,
          department: 'Computer Science',
          credits: 3
        },
        {
          id: 'res_002',
          title: `Document about '${query}'`,
          type: 'document',
          relevance: 0.87,
          department: 'Mathematics'
        },
        {
          id: 'res_003',
          title: `Discussion on '${query}'`,
          type: 'forum',
          relevance: 0.78,
          department: 'Physics'
        },
        {
          id: 'res_004',
          title: `Advanced '${query}' Techniques`,
          type: 'course',
          relevance: 0.82,
          department: 'Computer Science',
          credits: 4
        },
        {
          id: 'res_005',
          title: `Introduction to '${query}'`,
          type: 'course',
          relevance: 0.75,
          department: 'Engineering',
          credits: 3
        }
      ];
      
      // Apply filters to mock data
      const filteredResults = mockResults.filter(result => {
        if (filters.type !== 'all' && result.type !== filters.type) return false;
        if (filters.department !== 'all' && result.department !== filters.department) return false;
        if (result.credits !== undefined && result.credits < filters.minCredits) return false;
        if (result.relevance < filters.minRelevance) return false;
        return true;
      });
      
      setResults(filteredResults);
      setError(null);
    } catch (err) {
      setError('Failed to perform search');
      console.error('Error performing search:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'forum': return <MessageCircle className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course': return 'bg-blue-100 text-blue-800';
      case 'document': return 'bg-green-100 text-green-800';
      case 'forum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for courses, documents, discussions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="type-filter">Type</Label>
                  <Select 
                    value={filters.type} 
                    onValueChange={(value) => handleFilterChange('type', value as any)}
                  >
                    <SelectTrigger id="type-filter">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="course">Courses</SelectItem>
                      <SelectItem value="document">Documents</SelectItem>
                      <SelectItem value="forum">Discussions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="department-filter">Department</Label>
                  <Select 
                    value={filters.department} 
                    onValueChange={(value) => handleFilterChange('department', value)}
                  >
                    <SelectTrigger id="department-filter">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="credits-filter">Min Credits: {filters.minCredits}</Label>
                  <Slider
                    id="credits-filter"
                    min={0}
                    max={6}
                    step={1}
                    value={[filters.minCredits]}
                    onValueChange={(value) => handleFilterChange('minCredits', value[0])}
                  />
                </div>
                
                <div>
                  <Label htmlFor="relevance-filter">Min Relevance: {Math.round(filters.minRelevance * 100)}%</Label>
                  <Slider
                    id="relevance-filter"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[filters.minRelevance]}
                    onValueChange={(value) => handleFilterChange('minRelevance', value[0])}
                  />
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button onClick={handleSearch}>Apply Filters</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Search Results */}
      {error && (
        <Card>
          <CardContent className="p-4">
            <p className="text-red-500">{error}</p>
            <Button onClick={handleSearch} variant="outline" className="mt-2">
              Retry
            </Button>
          </CardContent>
        </Card>
      )}
      
      {!error && results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results ({results.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result) => (
                <div key={result.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-md ${getTypeColor(result.type)}`}>
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{result.title}</h3>
                        <Badge variant="secondary">{result.type}</Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        {result.department && (
                          <span>{result.department}</span>
                        )}
                        {result.credits !== undefined && (
                          <span>{result.credits} credits</span>
                        )}
                        <span>Relevance: {Math.round(result.relevance * 100)}%</span>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {!error && results.length === 0 && query && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No results found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchResultsDisplay;