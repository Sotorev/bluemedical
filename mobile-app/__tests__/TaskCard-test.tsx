import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TaskCard } from '../src/components/tasks/TaskCard';
import { Task } from '../src/types';

const mockTask: Task = {
  id: 1,
  title: 'Tarea de prueba',
  description: 'Esta es una descripción de prueba',
  status: 'pendiente',
  userId: 1,
  createdAt: '2024-01-15T10:00:00.000Z',
  updatedAt: '2024-01-15T10:00:00.000Z',
};

describe('Componente TaskCard', () => {
  test('renderiza correctamente el título de la tarea', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    const { getByText } = render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(getByText('Tarea de prueba')).toBeTruthy();
  });

  test('renderiza correctamente la descripción de la tarea', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    const { getByText } = render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(getByText('Esta es una descripción de prueba')).toBeTruthy();
  });

  test('renderiza correctamente el estado de la tarea', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    const { getByText } = render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(getByText('pendiente')).toBeTruthy();
  });

  test('llama a onEdit con la tarea correcta al presionar el botón Editar', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    const { getByText } = render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    fireEvent.press(getByText('Editar'));

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  test('llama a onDelete con el ID correcto al presionar el botón Eliminar', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    const { getByText } = render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    fireEvent.press(getByText('Eliminar'));

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  test('muestra la fecha de creación formateada correctamente', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    const { getByText } = render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(getByText(/Creada:/)).toBeTruthy();
  });

  test('muestra la fecha de actualización solo cuando es diferente a la de creación', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    const { queryByText } = render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(queryByText(/Actualizada:/)).toBeNull();
  });

  test('muestra la fecha de actualización cuando es diferente a la de creación', () => {
    const updatedTask: Task = {
      ...mockTask,
      updatedAt: '2024-01-16T10:00:00.000Z',
    };

    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    const { getByText } = render(
      <TaskCard task={updatedTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(getByText(/Actualizada:/)).toBeTruthy();
  });

  test('renderiza correctamente con diferentes estados', () => {
    const statuses = ['pendiente', 'en progreso', 'completada'] as const;
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    statuses.forEach((status) => {
      const taskWithStatus: Task = {
        ...mockTask,
        status,
      };

      const { getByText } = render(
        <TaskCard
          task={taskWithStatus}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(getByText(status)).toBeTruthy();
    });
  });
});

