import { render, screen, fireEvent } from '@testing-library/react';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskStatus } from '@/types';

jest.mock('@/utils/constants', () => ({
  TASK_STATUSES: [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en progreso', label: 'En Progreso' },
    { value: 'completada', label: 'Completada' },
  ],
}));

describe('TaskFilters Component', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza todos los filtros correctamente', () => {
    render(
      <TaskFilters
        currentFilter={undefined}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.getByText('Todas')).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    expect(screen.getByText('En Progreso')).toBeInTheDocument();
    expect(screen.getByText('Completada')).toBeInTheDocument();
  });

  it('marca "Todas" como activo cuando currentFilter es undefined', () => {
    render(
      <TaskFilters
        currentFilter={undefined}
        onFilterChange={mockOnFilterChange}
      />
    );

    const todasButton = screen.getByText('Todas');
    expect(todasButton).toHaveClass('bg-blue-600', 'text-white');
  });

  it('marca el filtro correcto como activo', () => {
    render(
      <TaskFilters
        currentFilter={'pendiente' as TaskStatus}
        onFilterChange={mockOnFilterChange}
      />
    );

    const pendienteButton = screen.getByText('Pendiente');
    expect(pendienteButton).toHaveClass('bg-blue-600', 'text-white');
  });

  it('llama a onFilterChange con undefined cuando se hace click en "Todas"', () => {
    render(
      <TaskFilters
        currentFilter={'pendiente' as TaskStatus}
        onFilterChange={mockOnFilterChange}
      />
    );

    fireEvent.click(screen.getByText('Todas'));
    expect(mockOnFilterChange).toHaveBeenCalledWith(undefined);
  });

  it('llama a onFilterChange con el estado correcto', () => {
    render(
      <TaskFilters
        currentFilter={undefined}
        onFilterChange={mockOnFilterChange}
      />
    );

    fireEvent.click(screen.getByText('En Progreso'));
    expect(mockOnFilterChange).toHaveBeenCalledWith('en progreso');
  });

  it('permite cambiar entre diferentes filtros', () => {
    render(
      <TaskFilters
        currentFilter={undefined}
        onFilterChange={mockOnFilterChange}
      />
    );

    fireEvent.click(screen.getByText('Pendiente'));
    expect(mockOnFilterChange).toHaveBeenCalledWith('pendiente');

    fireEvent.click(screen.getByText('Completada'));
    expect(mockOnFilterChange).toHaveBeenCalledWith('completada');

    fireEvent.click(screen.getByText('Todas'));
    expect(mockOnFilterChange).toHaveBeenCalledWith(undefined);

    expect(mockOnFilterChange).toHaveBeenCalledTimes(3);
  });

  it('aplica estilos hover a botones inactivos', () => {
    render(
      <TaskFilters
        currentFilter={'pendiente' as TaskStatus}
        onFilterChange={mockOnFilterChange}
      />
    );

    const completadaButton = screen.getByText('Completada');
    expect(completadaButton).toHaveClass('hover:bg-gray-200');
  });
});

