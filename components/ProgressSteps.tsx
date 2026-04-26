'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  label: string;
  icon: React.ReactNode;
}

interface ProgressStepsProps {
  steps: Step[];
  current: number;
}

export default function ProgressSteps({ steps, current }: ProgressStepsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-100" aria-hidden />
        <div
          className="absolute top-5 left-0 h-0.5 bg-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${((current - 1) / (steps.length - 1)) * 100}%` }}
          aria-hidden
        />

        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < current;
          const isActive = stepNum === current;

          return (
            <div key={step.label} className="relative flex flex-col items-center z-10">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  isCompleted
                    ? 'bg-blue-600 border-blue-600 shadow-blue'
                    : isActive
                    ? 'bg-white border-blue-600 shadow-md shadow-blue-100'
                    : 'bg-white border-slate-200'
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                ) : (
                  <span
                    className={cn(
                      'text-sm font-bold',
                      isActive ? 'text-blue-600' : 'text-slate-300'
                    )}
                  >
                    {stepNum}
                  </span>
                )}
              </div>

              <span
                className={cn(
                  'mt-2 text-xs font-medium whitespace-nowrap transition-colors duration-300 hidden sm:block',
                  isActive
                    ? 'text-blue-600'
                    : isCompleted
                    ? 'text-slate-600'
                    : 'text-slate-300'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
