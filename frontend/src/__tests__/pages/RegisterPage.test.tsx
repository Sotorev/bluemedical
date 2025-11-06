import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '@/app/register/page';
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

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza el formulario de registro correctamente', () => {
    render(
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    );

    expect(screen.getByText('Crear Cuenta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /registrarse/i }).length).toBeGreaterThan(0);
  });

  it('muestra el enlace de login', () => {
    render(
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    );

    expect(screen.getByText('¿Ya tienes una cuenta?')).toBeInTheDocument();
    expect(screen.getByText('Inicia sesión aquí')).toBeInTheDocument();
  });

  it('valida campos vacíos', async () => {
    render(
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    );

    const buttons = screen.getAllByRole('button', { name: /registrarse/i });
    const submitButton = buttons.find(btn => btn.getAttribute('type') === 'submit');
    fireEvent.click(submitButton!);

    await waitFor(() => {
      expect(
        screen.getByText('El nombre debe tener al menos 2 caracteres')
      ).toBeInTheDocument();
    });
  });

  it('valida nombre muy corto', async () => {
    render(
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    );

    const nameInput = screen.getByPlaceholderText('Juan Pérez');
    const buttons = screen.getAllByRole('button', { name: /registrarse/i });
    const submitButton = buttons.find(btn => btn.getAttribute('type') === 'submit');

    fireEvent.change(nameInput, { target: { value: 'J' } });
    fireEvent.click(submitButton!);

    await waitFor(() => {
      expect(
        screen.getByText('El nombre debe tener al menos 2 caracteres')
      ).toBeInTheDocument();
    });
  });


  it('muestra helper text para la contraseña', () => {
    render(
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    );

    expect(screen.getByText('Mínimo 6 caracteres')).toBeInTheDocument();
  });

  it('muestra placeholders correctos', () => {
    render(
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    );

    expect(screen.getByPlaceholderText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('muestra el texto descriptivo correcto', () => {
    render(
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    );

    expect(
      screen.getByText('Completa el formulario para registrarte')
    ).toBeInTheDocument();
  });
});

