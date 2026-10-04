import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock3,
  CalendarDays
} from 'lucide-react';
import { fetchTaskById, toggleTaskCompletion, deleteTask } from '../api/taskApi';
import PriorityBadge from '../components/PriorityBadge';
import CategoryBadge from '../components/CategoryBadge';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTaskById(id);
        setTask(data);
      } catch (err) {
        setError(err.message || 'Task not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTask();
    }
  }, [id]);

  const handleToggleStatus = async () => {
    if (!task) return;
    try {
      setIsUpdatingStatus(true);
      const updated = await toggleTaskCompletion(task._id, task.isCompleted);
      setTask(updated);
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTask(task._id);
      navigate('/');
    } catch (err) {
      setError(`Failed to delete task: ${err.message}`);
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const formatDateTime = (dateVal) => {
    if (!dateVal) return 'Not set';
    const date = new Date(dateVal);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDueDateDetails = (dateVal) => {
    if (!dateVal) return null;
    const date = new Date(dateVal);
    const now = new Date();
    const isPast = date < now;
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

    let label = '';
    if (diffDays === 0) label = 'Due today';
    else if (diffDays === 1) label = 'Due tomorrow';
    else if (diffDays === -1) label = 'Overdue by 1 day';
    else if (diffDays < -1) label = `Overdue by ${Math.abs(diffDays)} days`;
    else if (diffDays > 1) label = `In ${diffDays} days`;

    return {
      formatted: date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      isOverdue: isPast && !task?.isCompleted && diffDays < 0,
      label
    };
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <LoadingSpinner message="Loading task details..." />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Task Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">{error || 'The requested task does not exist or has been deleted.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const dueDetails = formatDueDateDetails(task.dueDate);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button and navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tasks
        </Link>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Link
            to={`/tasks/${task._id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Link>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Task Detail Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {/* Top Badges & Status Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={task.category} size="md" />
            <PriorityBadge priority={task.priority} size="md" />
            <StatusBadge isCompleted={task.isCompleted} size="md" />
          </div>

          {/* Quick toggle button */}
          <button
            onClick={handleToggleStatus}
            disabled={isUpdatingStatus}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 ${
              task.isCompleted
                ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            {task.isCompleted ? (
              <>
                <Circle className="w-4 h-4 text-amber-600" />
                <span>Mark as Pending</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Mark as Completed</span>
              </>
            )}
          </button>
        </div>

        {/* Task Title */}
        <div className="my-6">
          <h1
            className={`text-2xl sm:text-3xl font-bold text-slate-900 leading-snug ${
              task.isCompleted ? 'line-through text-slate-400' : ''
            }`}
          >
            {task.title}
          </h1>
        </div>

        {/* Due Date Alert / Details */}
        {dueDetails && (
          <div
            className={`p-4 rounded-xl border mb-6 flex items-start gap-3 ${
              dueDetails.isOverdue
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : task.isCompleted
                ? 'bg-slate-50 border-slate-200 text-slate-600'
                : 'bg-indigo-50/50 border-indigo-100 text-indigo-900'
            }`}
          >
            <CalendarDays className={`w-5 h-5 mt-0.5 shrink-0 ${dueDetails.isOverdue ? 'text-rose-600' : 'text-indigo-600'}`} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider opacity-75">Due Date</span>
                {dueDetails.label && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      dueDetails.isOverdue
                        ? 'bg-rose-200 text-rose-900'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {dueDetails.label}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold mt-0.5">{dueDetails.formatted}</p>
            </div>
          </div>
        )}

        {/* Description Section */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Description / Study Notes
          </h3>
          {task.description ? (
            <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {task.description}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">No additional description or study notes provided.</p>
          )}
        </div>

        {/* Metadata Footer: Created & Updated Timestamps */}
        <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Clock3 className="w-4 h-4 text-slate-400" />
            <span>Created on: <strong className="text-slate-600 font-medium">{formatDateTime(task.createdAt)}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Last updated: <strong className="text-slate-600 font-medium">{formatDateTime(task.updatedAt)}</strong></span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        taskTitle={task.title}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default TaskDetail;
