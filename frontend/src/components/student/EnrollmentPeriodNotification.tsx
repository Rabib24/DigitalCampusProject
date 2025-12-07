'use client';

import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { StudentEnrollmentPeriodsService, EnrollmentPeriod } from '@/lib/student/enrollment-periods';
import { Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const EnrollmentPeriodNotification = () => {
  const [currentPeriod, setCurrentPeriod] = useState<EnrollmentPeriod | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrollmentPeriod = async () => {
      try {
        setLoading(true);
        const period = await StudentEnrollmentPeriodsService.getCurrentEnrollmentPeriod();
        setCurrentPeriod(period);
      } catch (err) {
        setError('Failed to load enrollment period information');
        console.error('Error fetching enrollment period:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentPeriod();
  }, []);

  if (loading) {
    return null; // Don't show anything while loading
  }

  if (error) {
    return null; // Don't show error to user
  }

  // If there's no current period, don't show anything
  if (!currentPeriod) {
    return null;
  }

  // Check if the period is ending soon (within 3 days)
  const endDate = new Date(currentPeriod.end_date);
  const today = new Date();
  const timeDiff = endDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  const isEndingSoon = daysLeft <= 3 && daysLeft > 0;

  return (
    <div className="mb-6">
      {isEndingSoon ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Enrollment Period Ending Soon!</AlertTitle>
          <AlertDescription>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  The current enrollment period "{currentPeriod.name}" ends in {daysLeft} day{daysLeft !== 1 ? 's' : ''}.
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 sm:mt-0"
                onClick={() => window.dispatchEvent(new CustomEvent('viewChange', { detail: 'course-registration' }))}
              >
                Register Now
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-green-500/10 border-green-500/30">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Enrollment Period Active</AlertTitle>
          <AlertDescription>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-500" />
                <span>
                  The enrollment period "{currentPeriod.name}" is currently active until {new Date(currentPeriod.end_date).toLocaleDateString()}.
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 sm:mt-0 border-green-500/30 text-green-500 hover:bg-green-500/20"
                onClick={() => window.dispatchEvent(new CustomEvent('viewChange', { detail: 'course-registration' }))}
              >
                Register Now
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EnrollmentPeriodNotification;