import React from 'react';
import { AlertCircle, AlertTriangle, ArrowDownCircle } from 'lucide-react';

const PriorityBadge = ({ priority, size = 'sm' }) => {
  const isSmall = size === 'sm';

  const config = {
    High: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: AlertCircle,
      label: 'High Priority'
    },
    Medium: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: AlertTriangle,
      label: 'Medium Priority'
    },
    Low: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: ArrowDownCircle,
      label: 'Low Priority'
    }
  };

  const current = config[priority] || config.Medium;
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${
        isSmall ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      } ${current.bg}`}
    >
      <Icon className={isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      {current.label}
    </span>
  );
};

export default PriorityBadge;
