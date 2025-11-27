import React from 'react';

export type ViewMode = 'list' | 'grid' | 'compact';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  const views: { mode: ViewMode; label: string }[] = [
    { mode: 'list', label: 'LIST' },
    { mode: 'grid', label: 'GRID' },
    { mode: 'compact', label: 'COMPACT' }
  ];

  return (
    <div className="inline-flex border-4 border-black bg-white">
      {views.map((view, index) => (
        <button
          key={view.mode}
          onClick={() => onViewChange(view.mode)}
          className={`
            px-6 py-3 font-mono font-bold uppercase tracking-wider text-sm
            transition-colors duration-200
            ${currentView === view.mode 
              ? 'bg-brutal-red text-white' 
              : 'bg-white text-black hover:bg-black hover:text-white'
            }
            ${index < views.length - 1 ? 'border-r-4 border-black' : ''}
          `}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
};
