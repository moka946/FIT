import React from 'react';
import { LanguageProvider } from '@/components/LanguageContext';

export default function Layout({ children }) {
  return (
    <LanguageProvider>
    <div className="min-h-screen bg-black">
      <style>{`
        :root {
          --background: 0 0% 0%;
          --foreground: 0 0% 100%;
          --card: 240 6% 10%;
          --card-foreground: 0 0% 100%;
          --primary: 24 100% 50%;
          --primary-foreground: 0 0% 0%;
          --secondary: 240 5% 18%;
          --secondary-foreground: 0 0% 100%;
          --muted: 240 5% 18%;
          --muted-foreground: 240 5% 65%;
          --accent: 24 100% 50%;
          --accent-foreground: 0 0% 0%;
          --destructive: 0 84% 60%;
          --destructive-foreground: 0 0% 100%;
          --border: 240 5% 18%;
          --input: 240 5% 18%;
          --ring: 24 100% 50%;
        }

        body {
          background-color: black;
          color: white;
        }

        /* Hide scrollbar for better mobile experience */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Custom scrollbar for chat */
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: #18181b;
        }
        ::-webkit-scrollbar-thumb {
          background: #3f3f46;
          border-radius: 2px;
        }

        /* Smooth transitions */
        * {
          transition-property: background-color, border-color;
          transition-duration: 150ms;
        }
      `}</style>
      {children}
    </div>
    </LanguageProvider>
  );
}