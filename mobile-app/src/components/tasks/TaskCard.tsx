import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Task } from '../../types';
import { Card, CardBody, Badge, Button } from '../ui';
import { COLORS } from '../../utils/constants';

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
    <Card style={styles.card}>
      <CardBody>
        <View style={styles.header}>
          <Text style={styles.title}>{task.title}</Text>
          <Badge variant="status" status={task.status}>
            {task.status}
          </Badge>
        </View>

        <Text style={styles.description}>{task.description}</Text>

        <View style={styles.footer}>
          <View style={styles.dates}>
            <Text style={styles.dateText}>Creada: {formatDate(task.createdAt)}</Text>
            {task.updatedAt !== task.createdAt && (
              <Text style={styles.dateText}>
                Actualizada: {formatDate(task.updatedAt)}
              </Text>
            )}
          </View>

          <View style={styles.actions}>
            <Button variant="secondary" size="sm" onPress={() => onEdit(task)}>
              Editar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onPress={() => onDelete(task.id)}
              style={styles.deleteButton}
            >
              Eliminar
            </Button>
          </View>
        </View>
      </CardBody>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray[900],
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.gray[600],
    marginBottom: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
    paddingTop: 12,
  },
  dates: {
    marginBottom: 12,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  deleteButton: {
    marginLeft: 8,
  },
});

