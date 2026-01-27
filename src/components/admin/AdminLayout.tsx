import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  GraduationCap,
  Building2,
  Bell,
  Image,
  Settings,
  LogOut,
  ChevronRight,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { 
    title: 'Dashboard', 
    href: '/admin/dashboard', 
    icon: LayoutDashboard 
  },
  { 
    title: 'Notices', 
    href: '/admin/notices', 
    icon: Bell 
  },
  { 
    title: 'News', 
    href: '/admin/news', 
    icon: FileText 
  },
  { 
    title: 'Faculties', 
    href: '/admin/faculties', 
    icon: Building2 
  },
  { 
    title: 'Departments', 
    href: '/admin/departments', 
    icon: Building2 
  },
  { 
    title: 'Teachers', 
    href: '/admin/teachers', 
    icon: Users 
  },
  { 
    title: 'Students', 
    href: '/admin/students', 
    icon: GraduationCap 
  },
  { 
    title: 'Gallery', 
    href: '/admin/gallery', 
    icon: Image 
  },
  { 
    title: 'Settings', 
    href: '/admin/settings', 
    icon: Settings 
  },
];

interface AdminSidebarProps {
  children?: ReactNode;
}

const AdminSidebarContent = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar className={cn(collapsed ? "w-16" : "w-64", "border-r border-border bg-white")} collapsible="icon">
      {/* Logo */}
      <div className={cn(
        "h-16 flex items-center border-b border-border px-4",
        collapsed ? "justify-center" : "gap-3"
      )}>
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-6 h-6 text-gold" />
        </div>
        {!collapsed && (
          <div>
            <h2 className="font-display font-bold text-primary">SSTU Admin</h2>
            <p className="text-xs text-muted-foreground">Control Panel</p>
          </div>
        )}
      </div>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(collapsed && "sr-only")}>
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        location.pathname === item.href
                          ? "bg-primary text-white"
                          : "text-foreground hover:bg-secondary"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout */}
        <div className="mt-auto px-3 pt-4 border-t border-border">
          <Link
            to="/admin/login"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors",
              collapsed && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </Link>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebarContent />
        
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SidebarTrigger>
              <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link to="/admin/dashboard" className="hover:text-primary">Dashboard</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">Overview</span>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
