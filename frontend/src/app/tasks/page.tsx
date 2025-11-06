'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types';
import { Navbar } from '@/components/layout/Navbar';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { TaskFormData } from '@/utils/validators';

export default function TasksPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const {
    tasks,
    isLoading,
    statusFilter,
    setStatusFilter,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleCreateTask = async (data: TaskFormData) => {
    await createTask(data);
    setIsCreateModalOpen(false);
  };

  const handleEditTask = async (data: TaskFormData) => {
    if (taskToEdit) {
      await updateTask(taskToEdit.id, data);
      setIsEditModalOpen(false);
      setTaskToEdit(undefined);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      await deleteTask(id);
    }
  };

  const openEditModal = (task: Task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setTaskToEdit(undefined);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Tareas</h1>
              <p className="text-gray-600 mt-1">
                Gestiona tus tareas de manera eficiente
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              + Nueva Tarea
            </Button>
          </div>

          <TaskFilters
            currentFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No hay tareas
              </h3>
              <p className="text-gray-500 mb-6">
                {statusFilter
                  ? `No tienes tareas con estado "${statusFilter}"`
                  : 'Comienza creando tu primera tarea'}
              </p>
              {!statusFilter && (
                <Button
                  variant="primary"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Crear Primera Tarea
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={openEditModal}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear Nueva Tarea"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Editar Tarea"
      >
        <TaskForm
          task={taskToEdit}
          onSubmit={handleEditTask}
          onCancel={closeEditModal}
        />
      </Modal>
    </div>
  );
}

