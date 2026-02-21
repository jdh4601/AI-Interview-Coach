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
    <div className="flex flex-col gap-3 absolute left-8 top-1/2 -translate-y-1/2 w-48 z-10">
      {STRUCTURE_SECTIONS.map((section) => {
        const isActive = section.phase === currentPhase;

        return (
          <div
            key={section.phase}
            className={`
              rounded-2xl border px-5 py-4
              text-left transition-all duration-500 backdrop-blur-md
              ${isActive
                ? 'bg-white/10 border-electric-blue/50 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)] scale-105 opacity-100'
                : 'bg-white/5 border-white/10 text-ghost/40 opacity-40 scale-100'
              }
            `.trim().replace(/\s+/g, ' ')}
          >
            <p className={`text-xs font-data mb-1 ${isActive ? 'text-electric-blue' : 'text-ghost/40'}`}>PHASE {section.phase}</p>
            <h3 className={`font-semibold tracking-wide ${isActive ? 'text-white' : 'text-ghost/60'}`}>{section.label}</h3>
          </div>
        );
      })}
    </div>
  );
}
