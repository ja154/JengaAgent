
import React from 'react';
import { PlanStepStatus, type PlanStep as PlanStepType } from '../types';
import PlanStep from './PlanStep';
import { ThinkingIcon, CheckCircleIcon } from './icons';

interface AgentPlanProps {
  plan: PlanStepType[];
  isLoading: boolean;
}

const AgentPlan: React.FC<AgentPlanProps> = ({ plan, isLoading }) => {
  const hasPendingSteps = plan.some(step => step.status === PlanStepStatus.Pending);

  return (
    <div className="bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 p-6 h-full flex flex-col">
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
        <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg p-2 mr-3">
            <ThinkingIcon className="w-5 h-5" />
        </div>
        Agent's Plan
      </h2>
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2">
        {plan.length === 0 && !isLoading && (
          <div className="text-slate-500 dark:text-slate-400 text-center pt-8 h-full flex flex-col items-center justify-center">
            <ThinkingIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4"/>
            <p className="font-medium">Waiting for a new task...</p>
            <p className="text-sm mt-1 text-slate-400 dark:text-slate-500">The agent's plan will appear here.</p>
          </div>
        )}
         {plan.length === 0 && isLoading && (
          <div className="text-slate-500 dark:text-slate-400 text-center pt-8 animate-pulse h-full flex flex-col items-center justify-center">
            <ThinkingIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4"/>
            <p className="font-medium">Formulating a plan...</p>
          </div>
        )}
        <ul className="space-y-3.5">
          {plan.map((step, index) => (
            <PlanStep key={index} step={step.step} status={step.status} />
          ))}
        </ul>
        {plan.length > 0 && !hasPendingSteps && (
           <div className="text-center mt-6 p-3 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800/80 rounded-lg text-green-700 dark:text-green-300 font-semibold flex items-center justify-center gap-2">
              <CheckCircleIcon className="w-5 h-5"/>
              Plan Executed Successfully!
           </div>
        )}
      </div>
    </div>
  );
};

export default AgentPlan;