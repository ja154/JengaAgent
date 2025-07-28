
import React from 'react';
import { PlanStepStatus } from '../types';
import { CheckCircleIcon } from './icons';

interface PlanStepProps {
  step: string;
  status: PlanStepStatus;
}

const PlanStep: React.FC<PlanStepProps> = ({ step, status }) => {
  const isCompleted = status === PlanStepStatus.Completed;

  const Icon = () => {
    switch (status) {
      case PlanStepStatus.Completed:
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case PlanStepStatus.Pending:
        return <div className="w-5 h-5 flex items-center justify-center"><div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div></div>;
      default:
        return null;
    }
  };

  return (
    <li className={`flex items-start gap-3 transition-all duration-300 text-sm ${isCompleted ? 'text-slate-400' : 'text-slate-300 font-medium'}`}>
      <div className="flex-shrink-0 mt-0.5">
        <Icon />
      </div>
      <span className={`${isCompleted ? 'line-through decoration-green-500/60' : ''}`}>
        {step}
      </span>
    </li>
  );
};

export default PlanStep;
