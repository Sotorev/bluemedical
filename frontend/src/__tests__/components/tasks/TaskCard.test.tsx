import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Task } from '@/types';

const mockTask: Task = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  status: 'pendiente',
  userId: 1,
  createdAt: '2025-11-05T00:00:00.000Z',
  updatedAt: '2025-11-05T00:00:00.000Z',
};

describe('TaskCard Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza correctamente la información de la tarea', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('pendiente')).toBeInTheDocument();
  });

  it('muestra la fecha de creación formateada', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/Creada:/)).toBeInTheDocument();
  });

  it('muestra la fecha de actualización cuando es diferente a la de creación', () => {
    const updatedTask = {
      ...mockTask,
      updatedAt: '2025-11-06T00:00:00.000Z',
    };

    render(
      <TaskCard
        task={updatedTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/Actualizada:/)).toBeInTheDocument();
  });

  it('no muestra la fecha de actualización cuando es igual a la de creación', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByText(/Actualizada:/)).not.toBeInTheDocument();
  });

  it('llama a onEdit con la tarea correcta cuando se hace click en Editar', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('Editar'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('llama a onDelete con el id correcto cuando se hace click en Eliminar', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('Eliminar'));
    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('renderiza diferentes estados correctamente', () => {
    const statuses: Array<'pendiente' | 'en progreso' | 'completada'> = [
      'pendiente',
      'en progreso',
      'completada',
    ];

    statuses.forEach((status) => {
      const { unmount } = render(
        <TaskCard
          task={{ ...mockTask, status }}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText(status)).toBeInTheDocument();
      unmount();
    });
  });
});

