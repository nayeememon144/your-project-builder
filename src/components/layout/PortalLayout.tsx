import { ReactNode } from 'react';

interface PortalLayoutProps {
  children: ReactNode;
}

export const PortalLayout = ({ children }: PortalLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};
