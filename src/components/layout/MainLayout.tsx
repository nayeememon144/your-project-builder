import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { BackToTopButton } from '@/components/ui/BackToTopButton';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-1 ${isHomePage ? '' : 'pt-[104px] lg:pt-[136px]'}`}>
        {children}
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
}
