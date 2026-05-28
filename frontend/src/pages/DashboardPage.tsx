import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { fetchTasks, createTask, updateTask } from '../store/slices/taskSlice';
import type { Task } from '../store/slices/taskSlice';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import FilterBar from '../components/FilterBar';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, isLoading, pages, total } = useSelector((state: RootState) => state.tasks);
  const { user } = useSelector((state: RootState) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchTasks({ page: currentPage, search, status: statusFilter }));
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, currentPage, dispatch]);

  const handleOpenModal = useCallback((task?: Task) => {
    if (task) setEditingTask(task);
    else setEditingTask(null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTask(null);
  }, []);

  const handleTaskSubmit = async (data: any) => {
    if (editingTask) {
      await dispatch(updateTask({ id: editingTask._id, ...data }));
    } else {
      await dispatch(createTask(data));
      if (currentPage !== 1) setCurrentPage(1);
    }
    handleCloseModal();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <p className="text-gray-500 mt-1">Manage your day efficiently</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-primary to-blue-500 text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:-translate-y-0.5"
        >
          <Plus size={20} className="stroke-[3]" />
          New Task
        </button>
      </div>

      <FilterBar 
        search={search} 
        setSearch={setSearch} 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
      />

      <TaskList 
        tasks={tasks} 
        isLoading={isLoading} 
        onEdit={handleOpenModal} 
        isAdmin={user?.role === 'admin'} 
      />

      {/* Pagination Controls */}
      {pages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border bg-card hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-medium text-sm">
            Page {currentPage} of {pages} (Total: {total})
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(pages, p + 1))}
            disabled={currentPage === pages}
            className="p-2 rounded-lg border bg-card hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      <TaskForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleTaskSubmit}
        isLoading={isLoading}
        initialData={editingTask}
      />
    </div>
  );
};

export default DashboardPage;
