import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown, RotateCcw } from 'lucide-react';

const CATEGORIES = ['All', 'Study', 'Assignment', 'Exam', 'Personal', 'Other'];
const PRIORITIES = ['All', 'High', 'Medium', 'Low'];
const STATUS_OPTIONS = [
  { value: 'all', label: 'All Tasks' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' }
];

const FilterBar = ({
  search,
  setSearch,
  category,
  setCategory,
  priority,
  setPriority,
  status,
  setStatus,
  sortBy,
  setSortBy,
  order,
  setOrder,
  onReset
}) => {
  const hasActiveFilters =
    search !== '' ||
    category !== 'All' ||
    priority !== 'All' ||
    status !== 'all' ||
    sortBy !== 'createdAt' ||
    order !== 'desc';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-6">
      {/* Search Input & Status Pills Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        {/* Search bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks by title or description..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Pills */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl shrink-0 self-start lg:self-auto">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatus(opt.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                status === opt.value
                  ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dropdown Filters & Sorting Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <label htmlFor="category-select" className="font-medium text-slate-700">Category:</label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <label htmlFor="priority-select" className="font-medium text-slate-700">Priority:</label>
            <select
              id="priority-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {PRIORITIES.map((pri) => (
                <option key={pri} value={pri}>
                  {pri === 'All' ? 'All Priorities' : pri}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sorting and Reset Controls */}
        <div className="flex items-center gap-2">
          {/* Sort By Field */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <label htmlFor="sort-select" className="font-medium text-slate-700">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="createdAt">Date Created</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority Level</option>
            </select>
          </div>

          {/* Sort Order Toggle */}
          <button
            type="button"
            onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
            title={`Sort ${order === 'asc' ? 'Descending' : 'Ascending'}`}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="uppercase">{order}</span>
          </button>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
