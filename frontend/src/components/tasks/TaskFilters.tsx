'use client';

import React from 'react';
import { TaskStatus } from '@/types';
import { TASK_STATUSES } from '@/utils/constants';

interface TaskFiltersProps {
  currentFilter: TaskStatus | undefined;
  onFilterChange: (status: TaskStatus | undefined) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onFilterChange(undefined)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          currentFilter === undefined
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Todas
      </button>
      {TASK_STATUSES.map((status) => (
        <button
          key={status.value}
          onClick={() => onFilterChange(status.value as TaskStatus)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentFilter === status.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
};

