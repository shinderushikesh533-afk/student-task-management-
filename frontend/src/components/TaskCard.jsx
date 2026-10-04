import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Edit3, Trash2, Eye, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import CategoryBadge from './CategoryBadge';
import StatusBadge from './StatusBadge';

const TaskCard = ({ task, onToggleStatus, onDeleteClick }) => {
  // Format due date & calculate overdue status
  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    
    // Normalize to date comparison
    const isPast = date < now;
    const formatted = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });

    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

    let relativeLabel = '';
    if (diffDays === 0) relativeLabel = 'Due today';
    else if (diffDays === 1) relativeLabel = 'Due tomorrow';
    else if (diffDays === -1) relativeLabel = 'Overdue by 1 day';
    else if (diffDays < -1) relativeLabel = `Overdue by ${Math.abs(diffDays)} days`;
    else if (diffDays > 1 && diffDays <= 7) relativeLabel = `In ${diffDays} days`;

    return {
      formatted,
      isOverdue: isPast && !task.isCompleted && diffDays < 0,
      relativeLabel
    };
  };

  const dueDateInfo = formatDueDate(task.dueDate);

  return (
    <div
      className={`group relative bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
        task.isCompleted
          ? 'border-emerald-200/80 bg-slate-50/50'
          : dueDateInfo?.isOverdue
          ? 'border-rose-200 bg-rose-50/20'
          : 'border-slate-200 hover:border-indigo-200'
      }`}
    >
      <div>
        {/* Header row: Badges and quick complete button */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <CategoryBadge category={task.category} size="sm" />
            <PriorityBadge priority={task.priority} size="sm" />
          </div>

          {/* Quick complete toggle */}
          <button
            onClick={() => onToggleStatus(task)}
            title={task.isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
            className="p-1 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer shrink-0"
          >
            {task.isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
            ) : (
              <Circle className="w-6 h-6 text-slate-300 hover:text-indigo-600" />
            )}
          </button>
        </div>

        {/* Task Title */}
        <Link
          to={`/tasks/${task._id}`}
          className={`block font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2 ${
            task.isCompleted ? 'line-through text-slate-500' : ''
          }`}
        >
          {task.title}
        </Link>

        {/* Description snippet */}
        {task.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      <div>
        {/* Meta info: Due date & status */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mb-4">
          {dueDateInfo ? (
            <div
              className={`flex items-center gap-1.5 font-medium ${
                dueDateInfo.isOverdue
                  ? 'text-rose-600 font-semibold'
                  : task.isCompleted
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              {dueDateInfo.isOverdue ? (
                <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              ) : (
                <Calendar className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>{dueDateInfo.formatted}</span>
              {dueDateInfo.relativeLabel && (
                <span className="text-[11px] opacity-80">({dueDateInfo.relativeLabel})</span>
              )}
            </div>
          ) : (
            <span className="text-slate-400 italic">No due date</span>
          )}

          <StatusBadge isCompleted={task.isCompleted} size="sm" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-1">
          <Link
            to={`/tasks/${task._id}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-indigo-600 py-1 px-2 rounded-md hover:bg-slate-100 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              to={`/tasks/${task._id}/edit`}
              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Edit Task"
            >
              <Edit3 className="w-4 h-4" />
            </Link>
            <button
              onClick={() => onDeleteClick(task)}
              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
