import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Languages,
  CalendarDays,
  Check,
  LogOut
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function SettingsMenu() {
  const navigate = useNavigate();
  const { t, language, setLanguage, supportedLanguages } = useLanguage();
  const { logout } = useAuth();

  const openScheduleSettings = () => {
    navigate('/settings/schedule');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-10 h-10 rounded-xl bg-zinc-800/80 backdrop-blur flex items-center justify-center hover:bg-zinc-700 transition-colors"
          title={t('settings')}
          aria-label={t('settings')}
        >
          <Settings className="w-5 h-5 text-zinc-300" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        collisionPadding={10}
        className="w-44 bg-zinc-900 border-zinc-700 text-zinc-100"
      >
        <DropdownMenuLabel className="text-zinc-300">
          {t('settings')}
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-zinc-700" />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="focus:bg-zinc-800 focus:text-white">
            <Languages className="w-4 h-4" />
            <span>{t('language')}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent
              sideOffset={4}
              collisionPadding={10}
              className="w-36 bg-zinc-900 border-zinc-700 text-zinc-100"
            >
              {supportedLanguages.map((option) => (
                <DropdownMenuItem
                  key={option.code}
                  onSelect={() => setLanguage(option.code)}
                  className="flex items-center justify-between focus:bg-zinc-800 focus:text-white"
                >
                  <span className="truncate">{option.label}</span>
                  {language === option.code && <Check className="w-4 h-4 text-orange-500 shrink-0" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuItem
          onSelect={openScheduleSettings}
          className="focus:bg-zinc-800 focus:text-white"
        >
          <CalendarDays className="w-4 h-4" />
          <span>{t('changeSchedule')}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-zinc-700" />

        <DropdownMenuItem
          onSelect={handleLogout}
          className="focus:bg-red-500/10 focus:text-red-500 text-red-500"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
