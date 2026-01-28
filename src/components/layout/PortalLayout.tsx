import { ReactNode } from 'react';
import { PortalHeader } from './PortalHeader';

interface PortalLayoutProps {
  children: ReactNode;
  portalName: string;
  loginPath: string;
}

export const PortalLayout = ({ children, portalName, loginPath }: PortalLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <PortalHeader portalName={portalName} loginPath={loginPath} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};
