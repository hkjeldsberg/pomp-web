'use client';

import { useState, useEffect } from 'react';
import { useStatistics } from '@/lib/hooks/useStatistics';
import { getExercises } from '@/lib/db/exercises';
import type { Exercise } from '@/supabase/types';
import type { ProgressionPoint, DateRange } from '@/lib/db/statistics';
import { AggregateStats } from '@/components/statistics/AggregateStats';
import { DurationChart } from '@/components/statistics/DurationChart';
import { VolumeChart } from '@/components/statistics/VolumeChart';
import { ExerciseProgressionChart } from '@/components/statistics/ExerciseProgressionChart';
import { ExercisePickerModal } from '@/components/statistics/ExercisePickerModal';
import { DateRangeFilter } from '@/components/statistics/DateRangeFilter';
import { Button } from '@/components/ui/Button';

export default function StatisticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const { aggregates, durationPoints, volumePoints, getExerciseData, isLoading, load } =
    useStatistics(true, dateRange);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [progressionData, setProgressionData] = useState<ProgressionPoint[]>([]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { getExercises().then(setExercises); }, []);

  async function handleSelectExercise(ex: Exercise) {
    setSelectedExercise(ex);
    const data = await getExerciseData(ex.id);
    setProgressionData(data);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-text-primary text-2xl font-bold">Statistics</h1>
        {isLoading && <span className="text-accent-muted text-sm">Loading…</span>}
      </div>

      <div className="mb-4">
        <DateRangeFilter selected={dateRange} onChange={(r) => { setDateRange(r); }} />
      </div>

      {aggregates && (
        <div className="mb-6">
          <AggregateStats stats={aggregates} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl bg-bg-card border border-border-teal p-4">
          <DurationChart data={durationPoints} />
        </div>
        <div className="rounded-xl bg-bg-card border border-border-teal p-4">
          <VolumeChart data={volumePoints} />
        </div>
      </div>

      <div className="rounded-xl bg-bg-card border border-border-teal p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-text-primary font-semibold">Exercise progression</p>
          <Button variant="secondary" size="sm" onClick={() => setPickerOpen(true)}>
            {selectedExercise ? selectedExercise.name : 'Select exercise'}
          </Button>
        </div>
        {selectedExercise ? (
          <ExerciseProgressionChart data={progressionData} exerciseName={selectedExercise.name} />
        ) : (
          <p className="text-accent-muted text-sm py-8 text-center">Select an exercise to see progression</p>
        )}
      </div>

      <ExercisePickerModal
        open={pickerOpen}
        exercises={exercises}
        selectedId={selectedExercise?.id}
        onSelect={handleSelectExercise}
        onClose={() => setPickerOpen(false)}
      />
    </div>
  );
}
