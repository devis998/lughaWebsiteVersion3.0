import { ReactNode } from 'react';
import Footer from './Footer';
import Navigation from './Navigation';

interface InnerPageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function InnerPageLayout({ title, subtitle, children }: InnerPageLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{title}</h1>
            {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
          </header>
          <div className="space-y-8 text-gray-700 leading-relaxed">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
