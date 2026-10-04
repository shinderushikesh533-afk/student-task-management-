import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Layers } from 'lucide-react';

const StatsOverview = ({ tasks = [] }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.isCompleted).length;
  const pending = total - completed;

  const now = new Date();
  const overdueOrUrgent = tasks.filter((t) => {
    if (t.isCompleted || !t.dueDate) return false;
    const due = new Date(t.dueDate);
    const diffHours = (due - now) / (1000 * 60 * 60);
    return diffHours < 48; // Less than 48 hours or overdue
  }).length;

  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Total Tasks */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Tasks</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{total}</span>
          <span className="text-xs text-slate-400">items</span>
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Completed</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-emerald-700">{completed}</span>
          <span className="text-xs text-emerald-600 font-medium">{completionPercentage}% done</span>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending</span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-amber-700">{pending}</span>
          <span className="text-xs text-slate-400">in progress</span>
        </div>
      </div>

      {/* Urgent or Due Soon */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Due Soon / Overdue</span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold ${overdueOrUrgent > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {overdueOrUrgent}
          </span>
          <span className="text-xs text-slate-400">within 48h</span>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
