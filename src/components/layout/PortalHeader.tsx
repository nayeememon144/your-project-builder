import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import sstuLogo from '@/assets/sstu-logo.png';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PortalHeaderProps {
  portalName: string;
  loginPath: string;
}

export const PortalHeader = ({ portalName, loginPath }: PortalHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Logout failed');
    } else {
      toast.success('Logged out successfully');
      navigate(loginPath);
    }
  };

  return (
    <header className="bg-primary text-primary-foreground py-3 px-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and Portal Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
            <img src={sstuLogo} alt="SSTU Logo" className="w-full h-full object-contain" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-serif text-sm font-semibold leading-tight">
              Sunamgonj Science and Technology University
            </h1>
            <p className="text-xs text-primary-foreground/80">{portalName}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="outline" size="sm" className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white">
              <Home className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Website</span>
              <span className="sm:hidden">Home</span>
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-white hover:bg-white/10 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
