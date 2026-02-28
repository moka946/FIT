import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Languages,
  CalendarDays,
  Check
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
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

  const openScheduleSettings = () => {
    navigate('/settings/schedule');
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
        className="w-60 bg-zinc-900 border-zinc-700 text-zinc-100"
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
            <DropdownMenuSubContent className="w-48 bg-zinc-900 border-zinc-700 text-zinc-100">
              {supportedLanguages.map((option) => (
                <DropdownMenuItem
                  key={option.code}
                  onSelect={() => setLanguage(option.code)}
                  className="focus:bg-zinc-800 focus:text-white"
                >
                  <span>{option.label}</span>
                  {language === option.code && <Check className="w-4 h-4 ml-auto text-orange-500" />}
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
