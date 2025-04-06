
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { EvaluationStatus } from '@/types/candidate';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: EvaluationStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = (status: EvaluationStatus) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'fail':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: EvaluationStatus) => {
    switch (status) {
      case 'pass':
        return 'Pass';
      case 'fail':
        return 'Fail';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn("font-medium rounded-full px-3 py-1", getStatusStyles(status))}
    >
      {getStatusText(status)}
    </Badge>
  );
};

export default StatusBadge;
