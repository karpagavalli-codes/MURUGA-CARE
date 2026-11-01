import React from 'react';
import { VelIcon } from './Decorations';
import { Bell, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  unreadCount?: number;
  onOpenJumpingPopup: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  unreadCount = 3,
  onOpenJumpingPopup,
  onOpenNotifications,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'planner', label: 'Daily Planner' },
    { id: 'goals', label: 'Goals' },
    { id: 'habits', label: 'Habits' },
    { id: 'hydration', label: 'Hydration' },
    { id: 'insights', label: 'Insights' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFF2DC]/95 backdrop-blur-md border-b border-[#D6A43B]/25 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark in display face */}
        <button
          type="button"
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-2.5 text-left text-[#49321F] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F28C28] to-[#D6A43B] flex items-center justify-center text-white shadow-sm border border-[#FFF2DC]/60">
            <VelIcon size={20} glow={true} />
          </div>
          <div>
            <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-[#49321F]">
              MURUGA CARE
            </span>
          </div>
        </button>

        {/* Zone 2: Concise single-line navigation links with clean hover styling */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#49321F]/80">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer font-sans ${
                  isActive
                    ? 'text-[#F28C28] font-bold border-b-2 border-[#F28C28]'
                    : 'hover:text-[#F28C28]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action Zone */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Parandhu Vaa Pop-Up Summoner */}
          <button
            type="button"
            onClick={onOpenJumpingPopup}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#F28C28] to-[#D6A43B] text-white text-xs sm:text-sm font-semibold shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
            title="Summon Parandhu Vaa Jumping Murugan"
          >
            <Sparkles size={14} className="animate-spin text-[#FFD166]" style={{ animationDuration: '6s' }} />
            <span>Parandhu Vaa</span>
          </button>

          {/* Notification bell with counter */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-[#FFE0C2]/80 hover:bg-[#FFE0C2] text-[#49321F] border border-[#D6A43B]/30 transition-colors cursor-pointer shrink-0"
            title="Notifications & Smart Reminders"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D94B83] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
