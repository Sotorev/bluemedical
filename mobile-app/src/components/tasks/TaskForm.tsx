import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Select, Button } from '../ui';
import { Task, TaskStatus } from '../../types';
import { TASK_STATUSES } from '../../utils/constants';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: { title: string; description: string; status: TaskStatus }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'pendiente');
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    status?: string;
  }>({});

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
    }
  }, [task]);

  const validateForm = (): boolean => {
    const newErrors: { title?: string; description?: string; status?: string } = {};

    if (!title) {
      newErrors.title = 'El título es requerido';
    } else if (title.length > 200) {
      newErrors.title = 'El título no puede exceder 200 caracteres';
    }

    if (!description) {
      newErrors.description = 'La descripción es requerida';
    } else if (description.length < 3) {
      newErrors.description = 'La descripción debe tener al menos 3 caracteres';
    } else if (description.length > 1000) {
      newErrors.description = 'La descripción no puede exceder 1000 caracteres';
    }

    if (!status) {
      newErrors.status = 'El estado es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      await onSubmit({ title, description, status });
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label="Título"
        value={title}
        onChangeText={setTitle}
        placeholder="Título de la tarea"
        error={errors.title}
      />

      <Input
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        placeholder="Descripción de la tarea"
        multiline
        numberOfLines={4}
        style={styles.textarea}
        error={errors.description}
      />

      <Select
        label="Estado"
        value={status}
        onValueChange={(value) => setStatus(value as TaskStatus)}
        options={TASK_STATUSES}
        error={errors.status}
      />

      <View style={styles.actions}>
        <Button
          variant="secondary"
          onPress={onCancel}
          disabled={isLoading}
          style={styles.button}
        >
          Cancelar
        </Button>
        <Button
          onPress={handleSubmit}
          isLoading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          {task ? 'Actualizar' : 'Crear'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  button: {
    flex: 1,
  },
});

