import {
  STRUCTURE_SECTIONS,
  getCurrentPhase,
} from '../../lib/structureGuide';

interface StructureGuideProps {
  elapsedSeconds: number;
}

export function StructureGuide({ elapsedSeconds }: StructureGuideProps) {
  const currentPhase = getCurrentPhase(elapsedSeconds);

  return (
    <div className="flex gap-1 w-full">
      {STRUCTURE_SECTIONS.map((section) => {
        const isActive = section.phase === currentPhase;

        return (
          <div
            key={section.phase}
            className={`
              flex-1 rounded-lg border px-3 py-2
              text-center text-xs font-medium transition-colors
              ${isActive
                ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                : 'bg-slate-800 border-slate-700 text-slate-500'
              }
            `.trim()}
          >
            {section.label}
          </div>
        );
      })}
    </div>
  );
}
