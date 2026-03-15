import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Languages,
  CalendarDays,
  Check,
  LogOut,
  Moon,
  Target
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import ProfileSetupModal from '@/components/ProfileSetupModal';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function SettingsMenu() {
  const navigate = useNavigate();
  const { t, language, setLanguage, supportedLanguages } = useLanguage();
  const { logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [ramadanMode, setRamadanMode] = useState(() => {
    return localStorage.getItem('fitegypt_ramadan_mode') === 'true';
  });

  const toggleRamadan = () => {
    const newValue = !ramadanMode;
    setRamadanMode(newValue);
    localStorage.setItem('fitegypt_ramadan_mode', String(newValue));
  };

  const openScheduleSettings = () => {
    navigate('/settings/schedule');
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    setShowLogoutDialog(false);
    logout();
  };

  return (
    <>
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
          className="w-48 bg-zinc-900 border-zinc-700 text-zinc-100"
        >
          <DropdownMenuLabel className="text-zinc-300">
            {t('settings')}
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-zinc-700" />

          {/* Ramadan Mode Toggle */}
          <DropdownMenuItem
            onSelect={toggleRamadan}
            className="focus:bg-zinc-800 focus:text-white"
          >
            <Moon className={`w-4 h-4 ${ramadanMode ? 'text-orange-500' : ''}`} />
            <span className="flex-1">{t('ramadanMode')}</span>
            {ramadanMode && <Check className="w-4 h-4 text-orange-500 shrink-0" />}
          </DropdownMenuItem>

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

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault(); // allow modal to show without instantly throwing away DOM if dropdown unmounts
              // Actually radix dropdown menu handles this well if we just let it close or we can let it close normally
              // But it's usually better to just set state
              setShowProfileModal(true);
            }}
            className="focus:bg-zinc-800 focus:text-white"
          >
            <Target className="w-4 h-4" />
            <span>{t('changeGoal')}</span>
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

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('logoutConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              {t('logoutConfirmMessage')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white">
              {t('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLogout}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {t('logout')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showProfileModal && (
        <ProfileSetupModal onClose={() => {
          setShowProfileModal(false);
          // Dispatch a custom event to update HOME or other pages listening instead of full reload, OR just reload
          window.dispatchEvent(new CustomEvent('fitegypt_profile_updated'));
        }} />
      )}
    </>
  );
}
