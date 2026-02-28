import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ALL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const EXERCISE_DAYS_UPDATED_EVENT = 'exercise-days-updated';

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
    }
    setHasCompletedOnboarding(!!onboardingCompleted);

    setIsLoading(false);
  }, [user]);

  // Keep multiple hook instances in sync (e.g. onboarding + app shell).
  useEffect(() => {
    if (!user) return undefined;

    const storageKey = `exercise_days_${user.uid}`;
    const onboardingKey = `onboarding_completed_${user.uid}`;

    const handleExerciseDaysUpdated = (event) => {
      const detail = event?.detail || {};

      if (detail.userId && detail.userId !== user.uid) {
        return;
      }

      if (Array.isArray(detail.days)) {
        setExerciseDays(detail.days);
        setHasCompletedOnboarding(true);
        return;
      }

      // Fallback: reload from localStorage.
      const savedDays = localStorage.getItem(storageKey);
      const onboardingCompleted = localStorage.getItem(onboardingKey);
      setExerciseDays(savedDays ? JSON.parse(savedDays) : null);
      setHasCompletedOnboarding(!!onboardingCompleted);
    };

    window.addEventListener(EXERCISE_DAYS_UPDATED_EVENT, handleExerciseDaysUpdated);

    return () => {
      window.removeEventListener(EXERCISE_DAYS_UPDATED_EVENT, handleExerciseDaysUpdated);
    };
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

    window.dispatchEvent(new CustomEvent(EXERCISE_DAYS_UPDATED_EVENT, {
      detail: {
        userId: user.uid,
        days: validDays,
      }
    }));
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
