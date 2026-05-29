import React from 'react';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface GoalCardProps {
  title: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  priorityLevel?: PriorityLevel;
  nextMilestoneAmount?: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const PriorityBadge = ({ level }: { level: PriorityLevel }) => {
  const colors = {
    High: 'bg-rose-100 text-rose-700 border-rose-200',
    Medium: 'bg-amber-100 text-amber-700 border-amber-200',
    Low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${colors[level]}`}>
      {level} Priority
    </span>
  );
};

const GoalCard: React.FC<GoalCardProps> = ({
  title,
  targetAmount,
  currentAmount,
  icon,
  priorityLevel,
  nextMilestoneAmount,
}) => {
  const progressPercentage = Math.min(
    Math.round((currentAmount / targetAmount) * 100),
    100
  );

  return (
    <div className="bg-white border border-outline-variant rounded-xl p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-300 relative group overflow-hidden">
      {/* Top border highlight based on priority removed as requested */}

      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary transition-colors duration-300">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>{icon}</span>
          </div>
          <div>
            <h3 className="font-h3 text-h3 text-primary mb-0.5">{title}</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Target: {formatCurrency(targetAmount)}</p>
          </div>
        </div>
        
        {priorityLevel && <PriorityBadge level={priorityLevel} />}
      </div>
      
      <div className="flex justify-between items-end mt-2">
         <span className="font-numeric-data text-numeric-data text-primary">{progressPercentage}%</span>
      </div>

      <div className="w-full bg-surface-container-highest h-2 rounded-full mb-1 overflow-hidden">
        <div 
          className="progress-fill bg-primary h-full rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between items-center mb-2">
        {nextMilestoneAmount ? (
          <p className="font-label-caps text-label-caps text-secondary">{formatCurrency(nextMilestoneAmount)} to level up</p>
        ) : (
           <p className="font-label-caps text-label-caps text-transparent selection:bg-transparent">Spacer</p> 
        )}
      </div>

      <button className="w-full bg-secondary-fixed text-on-secondary-fixed py-2.5 rounded-lg font-body-md text-body-md hover:bg-secondary-fixed-dim active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-auto">
        <span className="material-symbols-outlined text-lg">payments</span>
        Contribute
      </button>
    </div>
  );
};

export default GoalCard;
