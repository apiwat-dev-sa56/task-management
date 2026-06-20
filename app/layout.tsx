import type {Metadata} from 'next';
import {Noto_Sans_Thai} from 'next/font/google';
import './globals.css'; // Global styles

const noto_sans_thai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Task Management Workspace | Centralized Team Planner',
  description: 'A professional and intuitive task management application with daily dashboard tracker, prioritization matrices, and collaborative Kanban boards.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="th" className={`${noto_sans_thai.variable} ${noto_sans_thai.variable}`}>
      <body suppressHydrationWarning className="bg-slate-50 min-h-screen text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
