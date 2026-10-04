import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit3, AlertCircle } from 'lucide-react';
import TaskForm from '../components/TaskForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchTaskById, updateTask } from '../api/taskApi';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const loadTask = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const data = await fetchTaskById(id);
        setTask(data);
      } catch (err) {
        setFetchError(err.message || 'Task not found or failed to load');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTask();
    }
  }, [id]);

  const handleUpdate = async (updatedData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await updateTask(id, updatedData);
      navigate(`/tasks/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <LoadingSpinner message="Loading task details..." />
      </div>
    );
  }

  if (fetchError || !task) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Unable to Load Task</h2>
        <p className="text-sm text-slate-500 mb-6">{fetchError || 'Task does not exist'}</p>
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header & Back link */}
      <div className="mb-6">
        <Link
          to={`/tasks/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Task Details
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Task</h1>
            <p className="text-xs text-slate-500">Update deadline, priority, notes, or completion status.</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <TaskForm
          initialData={task}
          onSubmit={handleUpdate}
          isSubmitting={isSubmitting}
          error={error}
          isEdit={true}
        />
      </div>
    </div>
  );
};

export default EditTask;
