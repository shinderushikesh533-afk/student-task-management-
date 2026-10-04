import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import TaskForm from '../components/TaskForm';
import { createTask } from '../api/taskApi';

const AddTask = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async (taskData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await createTask(taskData);
      // Navigate to dashboard upon success
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button and page header */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Task</h1>
            <p className="text-xs text-slate-500">Plan your upcoming academic assignments, exams, or study goals.</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <TaskForm
          onSubmit={handleCreate}
          isSubmitting={isSubmitting}
          error={error}
          isEdit={false}
        />
      </div>
    </div>
  );
};

export default AddTask;
