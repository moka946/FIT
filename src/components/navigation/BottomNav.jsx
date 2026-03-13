import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Dumbbell, Utensils, MessageCircle, Home, Menu, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageContext';

export default function BottomNav({ currentPage }) {
  const { t } = useLanguage();

  const navItems = [
    { nameKey: 'home', icon: Home, page: 'Home' },
    { nameKey: 'workouts', icon: Dumbbell, page: 'Workouts' },
    { nameKey: 'meals', icon: Utensils, page: 'Meals' },
    { nameKey: 'coach', icon: MessageCircle, page: 'Coach' },
    { nameKey: 'progress', icon: BarChart3, page: 'Progress' },
    { nameKey: 'more', icon: Menu, page: 'More' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-lg border-t border-zinc-800 z-50 safe-area-bottom">
      <div className="grid grid-cols-6 max-w-md mx-auto h-16">
        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          const Icon = item.icon;

          return (
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              className="relative flex flex-col items-center justify-center transition-all active:scale-95 px-1"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 w-10 h-1 rounded-b-full bg-orange-500 shadow-[0_2px_10px_rgba(249,115,22,0.5)]"
                />
              )}
              <div className={`transition-all duration-300 ${isActive ? 'scale-110 mb-0.5' : 'opacity-70'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-orange-500' : 'text-zinc-500'}`} />
              </div>
              <span className={`text-[10px] font-bold tracking-tight text-center truncate w-full px-0.5 ${isActive ? 'text-orange-500' : 'text-zinc-400 opacity-80'}`}>
                {t(item.nameKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}