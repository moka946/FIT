import { Toaster as HotToaster } from 'react-hot-toast';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Login from '@/pages/Login';
import ExerciseDaysOnboarding from '@/pages/ExerciseDaysOnboarding';
import { useExerciseDays } from '@/lib/useExerciseDays';
import { LanguageProvider } from '@/components/LanguageContext';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const FirebaseConfigErrorScreen = ({ authError }) => {
  const missingKeys = Array.isArray(authError?.missingKeys) ? authError.missingKeys : [];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-3">Configuration Error</h1>
        <p className="text-zinc-300 mb-4">
          Firebase settings are missing in your deployed environment, so the app cannot start authentication.
        </p>
        {missingKeys.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-zinc-400 mb-2">Missing keys:</p>
            <ul className="text-sm text-orange-400 space-y-1 list-disc list-inside">
              {missingKeys.map((key) => (
                <li key={key}>{key}</li>
              ))}
            </ul>
          </div>
        )}
        <p className="text-sm text-zinc-400">
          Add the `VITE_FIREBASE_*` secrets in your GitHub repository settings, then redeploy.
        </p>
      </div>
    </div>
  );
};

const AuthenticatedApp = () => {
  const { isAuthenticated, isLoadingAuth, authError, navigateToLogin } = useAuth();
  const { hasCompletedOnboarding, isLoading: isLoadingOnboarding } = useExerciseDays();

  if (isLoadingAuth || isLoadingOnboarding) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'firebase_config') {
      return <FirebaseConfigErrorScreen authError={authError} />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  // Show onboarding if user hasn't completed it
  if (!hasCompletedOnboarding) {
    return <ExerciseDaysOnboarding />;
  }

  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="/settings/schedule" element={<ExerciseDaysOnboarding />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <LanguageProvider>
          <Router>
            <NavigationTracker />
            <AuthenticatedApp />
          </Router>
        </LanguageProvider>
        <Toaster />
        <HotToaster position="top-center" />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App
