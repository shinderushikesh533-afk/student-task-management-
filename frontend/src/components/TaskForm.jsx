import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, AlertCircle, Calendar, Flag, Tag, FileText, CheckCircle2 } from 'lucide-react';

const CATEGORIES = ['Study', 'Assignment', 'Exam', 'Personal', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const TaskForm = ({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  isEdit = false,
  error = null
}) => {
  const navigate = useNavigate();

  // Helper to format Date object or ISO string to YYYY-MM-DD for input[type="date"]
  const formatInputDate = (dateVal) => {
    if (!dateVal) return '';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || 'Study',
    priority: initialData.priority || 'Medium',
    dueDate: formatInputDate(initialData.dueDate),
    isCompleted: initialData.isCompleted || false
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'Study',
        priority: initialData.priority || 'Medium',
        dueDate: formatInputDate(initialData.dueDate),
        isCompleted: Boolean(initialData.isCompleted)
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear validation error on change
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 150) {
      errors.title = 'Title cannot exceed 150 characters';
    }

    if (formData.description && formData.description.length > 1000) {
      errors.description = 'Description cannot exceed 1000 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Package payload
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      isCompleted: formData.isCompleted
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error banner from API */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Task Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-slate-800 mb-1.5">
          Task Title <span className="text-rose-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Prepare Chapter 4 notes for CS101"
          className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors ${
            validationErrors.title ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
          }`}
        />
        {validationErrors.title && (
          <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            {validationErrors.title}
          </p>
        )}
      </div>

      {/* Category & Priority Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category */}
        <div>
          <label htmlFor="category" className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 mb-1.5">
            <Tag className="w-4 h-4 text-indigo-500" />
            Category <span className="text-rose-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority" className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 mb-1.5">
            <Flag className="w-4 h-4 text-indigo-500" />
            Priority Level <span className="text-rose-500">*</span>
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors cursor-pointer"
          >
            {PRIORITIES.map((pri) => (
              <option key={pri} value={pri}>
                {pri} Priority
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Due Date & Completion Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Due Date */}
        <div>
          <label htmlFor="dueDate" className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 mb-1.5">
            <Calendar className="w-4 h-4 text-indigo-500" />
            Due Date (Optional)
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors cursor-pointer"
          />
        </div>

        {/* Completion Status Toggle */}
        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-300 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
            <input
              type="checkbox"
              name="isCompleted"
              checked={formData.isCompleted}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className={`w-4 h-4 ${formData.isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="text-sm font-medium text-slate-800">
                Mark as Completed
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 mb-1.5">
          <FileText className="w-4 h-4 text-indigo-500" />
          Description / Study Notes (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Add details, chapters to cover, reference links, or assignment guidelines..."
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors resize-y"
        />
        <div className="flex justify-between items-center mt-1">
          {validationErrors.description ? (
            <p className="text-xs text-rose-600">{validationErrors.description}</p>
          ) : (
            <span />
          )}
          <span className="text-[11px] text-slate-400">
            {formData.description.length}/1000
          </span>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Task')}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
