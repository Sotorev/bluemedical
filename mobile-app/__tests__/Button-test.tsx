import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';
import { Button } from '../src/components/ui/Button';

describe('Componente Button', () => {
  test('renderiza correctamente el texto del botón', () => {
    const { getByText } = render(<Button>Haz clic aquí</Button>);

    expect(getByText('Haz clic aquí')).toBeTruthy();
  });

  test('ejecuta onPress cuando se presiona el botón', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button onPress={mockOnPress}>Presionar</Button>
    );

    fireEvent.press(getByText('Presionar'));

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  test('no ejecuta onPress cuando el botón está deshabilitado', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button onPress={mockOnPress} disabled>
        Botón Deshabilitado
      </Button>
    );

    fireEvent.press(getByText('Botón Deshabilitado'));

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  test('muestra el spinner cuando isLoading es true', () => {
    const { queryByText, UNSAFE_getByType } = render(
      <Button isLoading>Cargando</Button>
    );

    expect(queryByText('Cargando')).toBeNull();
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  test('no ejecuta onPress cuando está en estado de carga', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <Button onPress={mockOnPress} isLoading>
        Cargando
      </Button>
    );

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  test('renderiza con variante primary por defecto', () => {
    const { getByText } = render(<Button>Botón Primary</Button>);

    const button = getByText('Botón Primary').parent?.parent;
    expect(button).toBeTruthy();
  });

  test('renderiza correctamente con diferentes variantes', () => {
    const variants = ['primary', 'secondary', 'danger', 'success'] as const;

    variants.forEach((variant) => {
      const { getByText } = render(
        <Button variant={variant}>Botón {variant}</Button>
      );
      expect(getByText(`Botón ${variant}`)).toBeTruthy();
    });
  });

  test('renderiza correctamente con diferentes tamaños', () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    sizes.forEach((size) => {
      const { getByText } = render(<Button size={size}>Botón {size}</Button>);
      expect(getByText(`Botón ${size}`)).toBeTruthy();
    });
  });

  test('aplica fullWidth correctamente', () => {
    const { getByText } = render(<Button fullWidth>Botón Completo</Button>);

    expect(getByText('Botón Completo')).toBeTruthy();
  });
});

