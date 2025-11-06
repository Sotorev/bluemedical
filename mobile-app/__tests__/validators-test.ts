import { loginSchema, registerSchema, taskSchema } from '../src/utils/validators';

describe('Validadores de formularios', () => {
  describe('loginSchema', () => {
    test('valida correctamente un email y password válidos', () => {
      const validData = {
        email: 'test@example.com',
        password: '123456',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('rechaza un email inválido', () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123456',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email inválido');
      }
    });

    test('rechaza una contraseña menor a 6 caracteres', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '12345',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'La contraseña debe tener al menos 6 caracteres'
        );
      }
    });

    test('rechaza un email vacío', () => {
      const invalidData = {
        email: '',
        password: '123456',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El email es requerido');
      }
    });
  });

  describe('registerSchema', () => {
    test('valida correctamente datos de registro válidos', () => {
      const validData = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('rechaza un nombre menor a 2 caracteres', () => {
      const invalidData = {
        name: 'A',
        email: 'juan@example.com',
        password: 'password123',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'El nombre debe tener al menos 2 caracteres'
        );
      }
    });

    test('rechaza un nombre mayor a 100 caracteres', () => {
      const invalidData = {
        name: 'A'.repeat(101),
        email: 'juan@example.com',
        password: 'password123',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'El nombre no puede exceder 100 caracteres'
        );
      }
    });

    test('rechaza una contraseña mayor a 100 caracteres', () => {
      const invalidData = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'A'.repeat(101),
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'La contraseña no puede exceder 100 caracteres'
        );
      }
    });
  });

  describe('taskSchema', () => {
    test('valida correctamente una tarea válida', () => {
      const validData = {
        title: 'Nueva tarea',
        description: 'Descripción de la tarea',
        status: 'pendiente' as const,
      };

      const result = taskSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('rechaza un título vacío', () => {
      const invalidData = {
        title: '',
        description: 'Descripción de la tarea',
        status: 'pendiente' as const,
      };

      const result = taskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El título es requerido');
      }
    });

    test('rechaza un título mayor a 200 caracteres', () => {
      const invalidData = {
        title: 'A'.repeat(201),
        description: 'Descripción de la tarea',
        status: 'pendiente' as const,
      };

      const result = taskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'El título no puede exceder 200 caracteres'
        );
      }
    });

    test('rechaza una descripción menor a 3 caracteres', () => {
      const invalidData = {
        title: 'Nueva tarea',
        description: 'AB',
        status: 'pendiente' as const,
      };

      const result = taskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'La descripción debe tener al menos 3 caracteres'
        );
      }
    });

    test('rechaza una descripción mayor a 1000 caracteres', () => {
      const invalidData = {
        title: 'Nueva tarea',
        description: 'A'.repeat(1001),
        status: 'pendiente' as const,
      };

      const result = taskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'La descripción no puede exceder 1000 caracteres'
        );
      }
    });

    test('rechaza un estado inválido', () => {
      const invalidData = {
        title: 'Nueva tarea',
        description: 'Descripción de la tarea',
        status: 'estado-invalido',
      };

      const result = taskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Estado inválido');
      }
    });

    test('acepta todos los estados válidos', () => {
      const statuses = ['pendiente', 'en progreso', 'completada'] as const;

      statuses.forEach((status) => {
        const validData = {
          title: 'Nueva tarea',
          description: 'Descripción de la tarea',
          status,
        };

        const result = taskSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });
  });
});

