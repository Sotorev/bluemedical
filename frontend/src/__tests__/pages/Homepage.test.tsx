import { render, screen } from '@testing-library/react';
import Homepage from '@/app/page';
import { AuthProvider } from '@/context/AuthContext';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/utils/storage', () => ({
  storage: {
    getToken: jest.fn(() => null),
    getUser: jest.fn(() => null),
    setToken: jest.fn(),
    setUser: jest.fn(),
    removeToken: jest.fn(),
    removeUser: jest.fn(),
  },
}));

describe('Homepage', () => {
  it('renderiza homepage correctamente', () => {
    render(
      <AuthProvider>
        <Homepage />
      </AuthProvider>
    );

    expect(screen.getByText('Gestor de tareas')).toBeInTheDocument();
  });

  it('muestra el botón de Comenzar ahora', () => {
    render(
      <AuthProvider>
        <Homepage />
      </AuthProvider>
    );

    expect(screen.getByText('Comenzar ahora')).toBeInTheDocument();
  });

  it('muestra el botón de Iniciar sesión', () => {
    render(
      <AuthProvider>
        <Homepage />
      </AuthProvider>
    );

    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
  });

  it('muestra la descripción de la aplicación', () => {
    render(
      <AuthProvider>
        <Homepage />
      </AuthProvider>
    );

    expect(
      screen.getByText(/Organiza tu trabajo de manera eficiente/i)
    ).toBeInTheDocument();
  });
});

