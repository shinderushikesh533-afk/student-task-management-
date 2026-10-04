import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchTasks, toggleTaskCompletion, deleteTask } from '../api/taskApi';
import TaskCard from '../components/TaskCard';
import FilterBar from '../components/FilterBar';
import StatsOverview from '../components/StatsOverview';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [priority, setPriority] = useState('All');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    task: null,
    isDeleting: false
  });

  // Load tasks from API
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTasks({
        search,
        category,
        priority,
        status,
        sortBy,
        order
      });
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, category, priority, status, sortBy, order]);

  // Debounced search / filter reload
  useEffect(() => {
    const timer = setTimeout(() => {
      loadTasks();
    }, 250);

    return () => clearTimeout(timer);
  }, [loadTasks]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setPriority('All');
    setStatus('all');
    setSortBy('createdAt');
    setOrder('desc');
  };

  // Toggle complete / pending
  const handleToggleStatus = async (taskToToggle) => {
    try {
      // Optimistic UI update
      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskToToggle._id ? { ...t, isCompleted: !t.isCompleted } : t
        )
      );

      await toggleTaskCompletion(taskToToggle._id, taskToToggle.isCompleted);
    } catch (err) {
      // Revert on error
      setError(`Failed to update task status: ${err.message}`);
      loadTasks();
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (task) => {
    setDeleteModal({
      isOpen: true,
      task,
      isDeleting: false
    });
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteModal.task) return;

    try {
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
      await deleteTask(deleteModal.task._id);

      // Remove from state
      setTasks((prev) => prev.filter((t) => t._id !== deleteModal.task._id));
      setDeleteModal({ isOpen: false, task: null, isDeleting: false });
    } catch (err) {
      setError(`Failed to delete task: ${err.message}`);
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const hasActiveFilters =
    search !== '' ||
    category !== 'All' ||
    priority !== 'All' ||
    status !== 'all' ||
    sortBy !== 'createdAt' ||
    order !== 'desc';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Academic Tasks Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Organize study sessions, assignments, deadlines, and project milestones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadTasks}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh Tasks"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <Link
            to="/tasks/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs hover:shadow transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Task</span>
          </Link>
        </div>
      </div>

      {/* Error alert banner */}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-rose-700 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadTasks}
            className="text-xs font-semibold underline hover:no-underline ml-4 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Stats Summary Overview */}
      <StatsOverview tasks={tasks} />

      {/* Search, Filter & Sort Controls */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        priority={priority}
        setPriority={setPriority}
        status={status}
        setStatus={setStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
        order={order}
        setOrder={setOrder}
        onReset={handleResetFilters}
      />

      {/* Task Content Area */}
      {loading ? (
        <LoadingSpinner message="Fetching your study tasks..." />
      ) : tasks.length === 0 ? (
        <EmptyState
          type={hasActiveFilters ? 'no-results' : 'no-tasks'}
          onResetFilters={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onToggleStatus={handleToggleStatus}
              onDeleteClick={openDeleteModal}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        taskTitle={deleteModal.task?.title}
        isDeleting={deleteModal.isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, task: null, isDeleting: false })}
      />
    </div>
  );
};

export default Dashboard;
