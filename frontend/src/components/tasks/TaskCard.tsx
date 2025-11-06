'use client';

import React from 'react';
import { Task } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardBody className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
          <Badge variant="status" status={task.status}>
            {task.status}
          </Badge>
        </div>
        
        <p className="text-gray-600 text-sm">{task.description}</p>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            <p>Creada: {formatDate(task.createdAt)}</p>
            {task.updatedAt !== task.createdAt && (
              <p>Actualizada: {formatDate(task.updatedAt)}</p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(task)}
            >
              Editar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(task.id)}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

