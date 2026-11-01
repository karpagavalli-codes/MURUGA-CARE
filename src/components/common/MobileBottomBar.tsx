import React, { useState } from 'react';
import {
  Home,
  CheckSquare,
  Calendar,
  Target,
  Flame,
  Droplets,
  TrendingUp,
  Settings,
  MoreHorizontal,
  X,
} from 'lucide-react';

interface MobileBottomBarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ currentTab, onSelectTab }) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'planner', label: 'Planner', icon: Calendar },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'habits', label: 'Habits', icon: Flame },
  ];

  const moreTabs = [
    { id: 'hydration', label: 'Hydration', icon: Droplets, color: '#2455A4' },
    { id: 'insights', label: 'Insights', icon: TrendingUp, color: '#087F78' },
    { id: 'settings', label: 'Settings', icon: Settings, color: '#F28C28' },
  ];

  const isMoreActive = moreTabs.some((t) => t.id === currentTab);

  return (
    <>
      {/* More Popover Overlay */}
      {isMoreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end p-4 animate-fadeIn">
          <div className="bg-[#FFF2DC] border-2 border-[#D6A43B] rounded-3xl p-5 shadow-elevated space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#D6A43B]/20">
              <span className="text-xs font-bold text-[#49321F] uppercase tracking-wider font-display">
                Additional Sections
              </span>
              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="p-1 rounded-full text-[#49321F]/70 hover:bg-[#FFE0C2]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {moreTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      onSelectTab(tab.id);
                      setIsMoreOpen(false);
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? 'border-[#F28C28] bg-white shadow-xs font-bold text-[#F28C28]'
                        : 'border-[#D6A43B]/30 bg-[#FFF5EB] text-[#49321F]/80 hover:bg-white'
                    }`}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[11px] font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFF2DC]/95 backdrop-blur-md border-t border-[#D6A43B]/30 shadow-elevated">
        <div className="grid grid-cols-6 items-center h-16 max-w-lg mx-auto px-1">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
                  isActive ? 'text-[#F28C28] font-bold' : 'text-[#49321F]/70 hover:text-[#49321F]'
                }`}
              >
                <div
                  className={`p-1 rounded-xl transition-all ${
                    isActive ? 'bg-[#FFE0C2] scale-110 shadow-xs' : ''
                  }`}
                >
                  <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 truncate">{tab.label}</span>
              </button>
            );
          })}

          {/* More Button */}
          <button
            type="button"
            onClick={() => setIsMoreOpen(true)}
            className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
              isMoreActive ? 'text-[#F28C28] font-bold' : 'text-[#49321F]/70 hover:text-[#49321F]'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-all ${
                isMoreActive ? 'bg-[#FFE0C2] scale-110 shadow-xs' : ''
              }`}
            >
              <MoreHorizontal size={19} strokeWidth={isMoreActive ? 2.5 : 2} />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 truncate">More</span>
          </button>
        </div>
      </nav>
    </>
  );
};
