import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Task, TaskStatus } from '../../types';
import { TaskCard } from '../../components/tasks/TaskCard';
import { Select, Spinner, Modal } from '../../components/ui';
import { TaskForm } from '../../components/tasks/TaskForm';
import { COLORS, TASK_STATUSES } from '../../utils/constants';

interface TasksPresenterProps {
  tasks: Task[];
  filteredTasks: Task[];
  selectedTask: Task | null;
  isModalVisible: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  filterStatus: TaskStatus | '';
  onFilterChange: (status: TaskStatus | '') => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: (task: Task) => void;
  onCloseModal: () => void;
  onCreateTask: (data: { title: string; description: string; status: TaskStatus }) => Promise<void>;
  onUpdateTask: (data: { title: string; description: string; status: TaskStatus }) => Promise<void>;
  onDeleteTask: (id: number) => void;
  onRefresh: () => void;
  onLogout: () => void;
}

export const TasksPresenter: React.FC<TasksPresenterProps> = ({
  tasks,
  filteredTasks,
  selectedTask,
  isModalVisible,
  isLoading,
  isRefreshing,
  filterStatus,
  onFilterChange,
  onOpenCreateModal,
  onOpenEditModal,
  onCloseModal,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onRefresh,
  onLogout,
}) => {
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>Mis Tareas</Text>
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerActions}>
        <View style={styles.filterContainer}>
          <Select
            value={filterStatus}
            onValueChange={(value) => onFilterChange(value as TaskStatus | '')}
            options={[{ value: '', label: 'Todas' }, ...TASK_STATUSES]}
            placeholder="Filtrar por estado"
          />
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={onOpenCreateModal}
        >
          <Text style={styles.createButtonText}>+ Nueva Tarea</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        {filterStatus
          ? `No hay tareas ${filterStatus}`
          : 'No hay tareas aún. ¡Crea una nueva!'}
      </Text>
    </View>
  );

  if (isLoading && tasks.length === 0) {
    return <Spinner />;
  }

  return (
    <View style={styles.container}>
      {renderHeader()}

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onEdit={onOpenEditModal}
            onDelete={onDeleteTask}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      />

      <Modal
        visible={isModalVisible}
        onClose={onCloseModal}
        title={selectedTask ? 'Editar Tarea' : 'Nueva Tarea'}
      >
        <TaskForm
          task={selectedTask}
          onSubmit={selectedTask ? onUpdateTask : onCreateTask}
          onCancel={onCloseModal}
          isLoading={isLoading}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.gray[900],
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  headerActions: {
    gap: 12,
  },
  filterContainer: {
    marginBottom: 0,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.gray[500],
    textAlign: 'center',
  },
});

