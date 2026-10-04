import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
          <HelpCircle className="w-9 h-9" />
        </div>
        <span className="text-xs uppercase font-bold tracking-widest text-indigo-600">Error 404</span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1 mb-2">Page Not Found</h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          The page or study task you're looking for doesn't exist, has been removed, or the link is incorrect.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
