import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/ui/Input';

describe('Input Component', () => {
  it('renderiza correctamente sin props adicionales', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('renderiza con label', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renderiza con error', () => {
    render(<Input error="Campo requerido" />);
    expect(screen.getByText('Campo requerido')).toBeInTheDocument();
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500');
  });

  it('renderiza con helperText', () => {
    render(<Input helperText="Ingresa tu email" />);
    expect(screen.getByText('Ingresa tu email')).toBeInTheDocument();
  });

  it('no muestra helperText cuando hay error', () => {
    render(<Input error="Error" helperText="Helper" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
  });

  it('maneja onChange correctamente', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('acepta value y mantiene el estado controlado', () => {
    render(<Input value="test value" readOnly />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('test value');
  });

  it('acepta placeholder', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('maneja disabled correctamente', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('acepta type personalizado', () => {
    const { container } = render(<Input type="password" />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('acepta className personalizado', () => {
    render(<Input className="custom-input" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-input');
  });

  it('mantiene el estilo base junto con className personalizado', () => {
    render(<Input className="custom-input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('w-full', 'custom-input');
  });
});

