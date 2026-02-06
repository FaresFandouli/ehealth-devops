import React from 'react';
import { LucideIcon, Plus } from 'lucide-react';
import Button from '../common/Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className || ''}`}>
      <div className="rounded-full bg-gray-100 p-3 mb-4">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-sm mb-6">{description}</p>
      {action && (
        <Button
          onClick={action.onClick}
          icon={<Plus className="h-4 w-4" />}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
