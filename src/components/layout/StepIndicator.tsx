interface StepIndicatorProps {
  currentStep: number; // 1-4
  totalSteps?: number; // default 4
}

const STEP_LABELS = ['기업 선택', '이력서 업로드', '면접 설정', '면접 진행'] as const;

export function StepIndicator({
  currentStep,
  totalSteps = 4,
}: StepIndicatorProps) {
  const steps = STEP_LABELS.slice(0, totalSteps);

  return (
    <div className="flex items-center justify-center gap-0 w-full">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const isFuture = stepNumber > currentStep;

        return (
          <div key={label} className="flex items-center">
            {/* Step dot + label */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  text-xs font-bold transition-colors
                  ${isCompleted ? 'bg-blue-600 text-white' : ''}
                  ${isCurrent ? 'bg-blue-600 text-white ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900' : ''}
                  ${isFuture ? 'bg-slate-700 text-slate-400' : ''}
                `.trim()}
              >
                {isCompleted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={`
                  text-xs whitespace-nowrap
                  ${isCurrent ? 'text-blue-400 font-medium' : 'text-slate-500'}
                `.trim()}
              >
                {label}
              </span>
            </div>

            {/* Connecting line */}
            {stepNumber < totalSteps && (
              <div
                className={`
                  w-12 h-0.5 mx-2 mt-[-1.25rem]
                  ${stepNumber < currentStep ? 'bg-blue-600' : 'bg-slate-700'}
                `.trim()}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
