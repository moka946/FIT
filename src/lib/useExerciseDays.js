import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ALL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const useExerciseDays = () => {
  const { user } = useAuth();
  const [exerciseDays, setExerciseDays] = useState(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load exercise days from localStorage
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const storageKey = `exercise_days_${user.uid}`;
    const onboardingKey = `onboarding_completed_${user.uid}`;

    const savedDays = localStorage.getItem(storageKey);
    const onboardingCompleted = localStorage.getItem(onboardingKey);

    if (savedDays) {
      setExerciseDays(JSON.parse(savedDays));
      setHasCompletedOnboarding(!!onboardingCompleted);
    }

    setIsLoading(false);
  }, [user]);

  const setUserExerciseDays = (days) => {
    if (!user) return;

    // Validate that days are valid
    const validDays = days.filter(day => ALL_DAYS.includes(day));

    const storageKey = `exercise_days_${user.uid}`;
    const onboardingKey = `onboarding_completed_${user.uid}`;

    localStorage.setItem(storageKey, JSON.stringify(validDays));
    localStorage.setItem(onboardingKey, 'true');

    setExerciseDays(validDays);
    setHasCompletedOnboarding(true);
  };

  const isTrainingDay = (dayName) => {
    if (!exerciseDays) return false;
    return exerciseDays.includes(dayName);
  };

  const getTrainingDays = () => {
    return exerciseDays || [];
  };

  return {
    exerciseDays,
    hasCompletedOnboarding,
    isLoading,
    setUserExerciseDays,
    isTrainingDay,
    getTrainingDays,
    ALL_DAYS
  };
};
