import { body, query } from 'express-validator';
import { TaskStatus } from '../entities/Task';

export const createTaskValidator = [
  body('title')
    .notEmpty()
    .withMessage('El título es requerido')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('El título debe tener entre 3 y 255 caracteres'),
  body('description')
    .notEmpty()
    .withMessage('La descripción es requerida')
    .trim()
    .isLength({ min: 3 })
    .withMessage('La descripción debe tener al menos 3 caracteres'),
  body('status')
    .optional()
    .isIn(Object.values(TaskStatus))
    .withMessage(
      `El estado debe ser uno de: ${Object.values(TaskStatus).join(', ')}`
    ),
];

export const updateTaskValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('El título debe tener entre 3 y 255 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('La descripción debe tener al menos 3 caracteres'),
  body('status')
    .optional()
    .isIn(Object.values(TaskStatus))
    .withMessage(
      `El estado debe ser uno de: ${Object.values(TaskStatus).join(', ')}`
    ),
];

export const filterTasksValidator = [
  query('status')
    .optional()
    .isIn(Object.values(TaskStatus))
    .withMessage(
      `El estado debe ser uno de: ${Object.values(TaskStatus).join(', ')}`
    ),
];

