import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

const StatusBadge = ({ isCompleted, size = 'sm' }) => {
  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${
        isSmall ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      } ${
        isCompleted
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-amber-50 text-amber-700 border border-amber-200'
      }`}
    >
      {isCompleted ? (
        <>
          <CheckCircle2 className={isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          Completed
        </>
      ) : (
        <>
          <Clock className={isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          Pending
        </>
      )}
    </span>
  );
};

export default StatusBadge;
