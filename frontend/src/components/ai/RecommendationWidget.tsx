import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star, BookOpen, TrendingUp, Lightbulb } from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  code: string;
  description: string;
  match_score: number;
  reason: string;
}

interface RecommendationWidgetProps {
  userId: string;
  userType: string;
}

const RecommendationWidget: React.FC<RecommendationWidgetProps> = ({ userId, userType }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, [userId, userType]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would call your AI service API
      // const response = await fetch('/api/v1/ai/recommendations/', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`,
      //   },
      //   body: JSON.stringify({}),
      // });
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockData = [
        {
          id: 'rec_001',
          title: 'Introduction to Machine Learning',
          code: 'CS451',
          description: 'Learn the fundamentals of machine learning algorithms',
          match_score: 0.92,
          reason: 'Based on your interest in Computer Science and previous coursework'
        },
        {
          id: 'rec_002',
          title: 'Data Visualization',
          code: 'DS301',
          description: 'Techniques for effective data visualization',
          match_score: 0.87,
          reason: 'Complements your Data Science major'
        },
        {
          id: 'rec_003',
          title: 'Ethics in Technology',
          code: 'PHIL210',
          description: 'Ethical considerations in modern technology',
          match_score: 0.78,
          reason: 'Recommended for all technology-focused students'
        }
      ];
      
      setRecommendations(mockData);
      setError(null);
    } catch (err) {
      setError('Failed to load recommendations');
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (recommendationId: string, rating: 'positive' | 'negative') => {
    // In a real implementation, this would send feedback to your AI service
    console.log(`Feedback for ${recommendationId}: ${rating}`);
    // You could update the UI to show that feedback was received
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading recommendations...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchRecommendations} variant="outline" className="mt-2">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <p>No recommendations available at this time.</p>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{rec.title}</h3>
                      <Badge variant="secondary">{rec.code}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-500">Match:</span>
                      <Progress value={rec.match_score * 100} className="w-24" />
                      <span className="text-xs font-medium">{Math.round(rec.match_score * 100)}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{rec.reason}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleFeedback(rec.id, 'positive')}
                      aria-label="Thumbs up"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <div className="text-xs text-gray-500 mt-2">
              These recommendations are based on your academic history and interests.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationWidget;