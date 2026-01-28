import { ReactNode } from 'react';
import { Footer } from './Footer';
import { BackToTopButton } from '@/components/ui/BackToTopButton';

interface PortalLayoutProps {
  children: ReactNode;
}

export const PortalLayout = ({ children }: PortalLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};
