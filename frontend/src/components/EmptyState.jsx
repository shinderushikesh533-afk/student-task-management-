import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, SearchX, PlusCircle, RotateCcw } from 'lucide-react';

const EmptyState = ({ type = 'no-tasks', onResetFilters }) => {
  if (type === 'no-results') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm max-w-lg mx-auto my-8">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">No tasks found</h3>
        <p className="text-sm text-slate-500 mb-6">
          No tasks matched your current search and filter criteria. Try adjusting your filters or search terms.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reset all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm max-w-lg mx-auto my-8">
      <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
        <ClipboardList className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">No tasks yet</h3>
      <p className="text-sm text-slate-500 mb-6">
        You don't have any study tasks planned yet. Start organizing your study sessions, assignments, and exams now!
      </p>
      <Link
        to="/tasks/new"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all"
      >
        <PlusCircle className="w-4 h-4" />
        Add Your First Task
      </Link>
    </div>
  );
};

export default EmptyState;
