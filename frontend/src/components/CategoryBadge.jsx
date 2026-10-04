import React from 'react';
import { BookOpen, FileText, GraduationCap, User, Tag } from 'lucide-react';

const CategoryBadge = ({ category, size = 'sm' }) => {
  const isSmall = size === 'sm';

  const config = {
    Study: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: BookOpen
    },
    Assignment: {
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: FileText
    },
    Exam: {
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: GraduationCap
    },
    Personal: {
      bg: 'bg-teal-50 text-teal-700 border-teal-200',
      icon: User
    },
    Other: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: Tag
    }
  };

  const current = config[category] || config.Other;
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${
        isSmall ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
      } ${current.bg}`}
    >
      <Icon className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {category}
    </span>
  );
};

export default CategoryBadge;
