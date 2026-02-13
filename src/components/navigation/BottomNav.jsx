import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Dumbbell, Utensils, MessageCircle, Home, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageContext';

export default function BottomNav({ currentPage }) {
  const { t } = useLanguage();

  const navItems = [
    { nameKey: 'home', icon: Home, page: 'Home' },
    { nameKey: 'workouts', icon: Dumbbell, page: 'Workouts' },
    { nameKey: 'meals', icon: Utensils, page: 'Meals' },
    { nameKey: 'coach', icon: MessageCircle, page: 'Coach' },
    { nameKey: 'more', icon: Menu, page: 'More' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-lg border-t border-zinc-800 px-4 py-2 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          const Icon = item.icon;

          return (
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              className="relative flex flex-col items-center py-2 px-4"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-2 w-12 h-1 rounded-full bg-orange-500"
                />
              )}
              <Icon className={`w-6 h-6 ${isActive ? 'text-orange-500' : 'text-zinc-500'} transition-colors`} />
              <span className={`text-xs mt-1 ${isActive ? 'text-orange-500 font-medium' : 'text-zinc-500'}`}>
                {t(item.nameKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}