import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TabOption {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabOption[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs = ({ tabs, activeTab, onChange, className }: TabsProps) => {
  return (
    <div className={cn("flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-xl w-fit", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group",
              isActive 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-muted hover:text-foreground hover:bg-white/5"
            )}
          >
            {tab.icon && (
              <span className={cn(
                "w-4 h-4 transition-transform duration-200",
                isActive ? "text-white" : "text-muted group-hover:text-primary",
                isActive && "scale-110"
              )}>
                {tab.icon}
              </span>
            )}
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                "ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold transition-colors",
                isActive ? "bg-white/20 text-white" : "bg-white/10 text-muted"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
