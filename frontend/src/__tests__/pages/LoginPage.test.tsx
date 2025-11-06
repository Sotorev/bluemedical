import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';
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

jest.mock('@/services/authService');

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza el formulario de login correctamente', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /iniciar sesión/i }).length).toBeGreaterThan(0);
  });

  it('muestra el enlace de registro', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    expect(screen.getByText('¿No tienes una cuenta?')).toBeInTheDocument();
    expect(screen.getByText('Regístrate aquí')).toBeInTheDocument();
  });

  it('valida campos vacíos', async () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    const buttons = screen.getAllByRole('button', { name: /iniciar sesión/i });
    const submitButton = buttons.find(btn => btn.getAttribute('type') === 'submit');
    fireEvent.click(submitButton!);

    await waitFor(() => {
      expect(screen.getByText('El email es requerido')).toBeInTheDocument();
    });
  });


  it('muestra placeholders correctos', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('muestra el texto descriptivo correcto', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    expect(
      screen.getByText('Ingresa tus credenciales para continuar')
    ).toBeInTheDocument();
  });
});

