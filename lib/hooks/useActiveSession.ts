import { useState, useEffect } from 'react';
import { getOpenWorkout } from '../db/workouts';
import type { Workout } from '../../supabase/types';

interface UseActiveSessionReturn {
  activeWorkout: Workout | null;
  isLoading: boolean;
}

export function useActiveSession(): UseActiveSessionReturn {
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getOpenWorkout()
      .then(setActiveWorkout)
      .catch(() => setActiveWorkout(null))
      .finally(() => setIsLoading(false));
  }, []);

  return { activeWorkout, isLoading };
}
