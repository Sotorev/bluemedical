'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, TaskFormData } from '@/utils/validators';
import { Task, TaskStatus } from '@/types';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { TASK_STATUSES } from '@/utils/constants';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description,
          status: task.status,
        }
      : {
          status: 'pendiente' as TaskStatus,
        },
  });

  const handleFormSubmit = async (data: TaskFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Título"
        placeholder="Ingresa el título de la tarea"
        error={errors.title?.message}
        {...register('title')}
      />

      <Textarea
        label="Descripción"
        placeholder="Ingresa la descripción de la tarea"
        rows={4}
        error={errors.description?.message}
        {...register('description')}
      />

      <Select
        label="Estado"
        options={TASK_STATUSES}
        error={errors.status?.message}
        {...register('status')}
      />

      <div className="flex gap-2 justify-end pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {task ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};

