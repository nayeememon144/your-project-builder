import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Faculty {
  id: string;
  name: string;
  short_name: string | null;
}

interface Department {
  id: string;
  name: string;
  short_name: string | null;
}

const academicInfoItems = [
  { label: 'Academic Calendars', href: '/academic/calendar' },
  { label: 'Undergraduate Program', href: '/academic/undergraduate' },
  { label: 'Postgraduate Program', href: '/academic/postgraduate' },
  { label: 'International Students', href: '/academic/international' },
];

export const AcademicMegaMenu = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facultiesRes, departmentsRes] = await Promise.all([
          supabase
            .from('faculties')
            .select('id, name, short_name')
            .eq('is_active', true)
            .order('display_order', { ascending: true }),
          supabase
            .from('departments')
            .select('id, name, short_name')
            .eq('is_active', true)
            .order('display_order', { ascending: true }),
        ]);

        if (facultiesRes.data) setFaculties(facultiesRes.data);
        if (departmentsRes.data) setDepartments(departmentsRes.data);
      } catch (error) {
        console.error('Error fetching academic data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const MenuItem = ({ href, label }: { href: string; label: string }) => (
    <Link
      to={href}
      className="flex items-center gap-2 py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
    >
      <ChevronRight className="w-3 h-3 text-gold flex-shrink-0" />
      <span className="leading-tight">{label}</span>
    </Link>
  );

  const SectionHeader = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      to={href}
      className="block text-base font-bold text-primary hover:text-gold transition-colors border-b-2 border-gold pb-2 mb-3"
    >
      {children}
    </Link>
  );

  if (loading) {
    return (
      <div className="py-8 px-6 flex justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  // Split departments into two columns
  const midPoint = Math.ceil(departments.length / 2);
  const leftDepartments = departments.slice(0, midPoint);
  const rightDepartments = departments.slice(midPoint);

  return (
    <div className="py-5 px-6">
      {/* Top Row: Academic Information + Faculties (side by side) */}
      <div className="grid grid-cols-2 gap-8 pb-5 border-b border-border">
        {/* Academic Information */}
        <div className="border-l-4 border-gold pl-4">
          <SectionHeader href="/academic">Academic Information</SectionHeader>
          <div className="space-y-1">
            {academicInfoItems.map((item, idx) => (
              <MenuItem key={idx} href={item.href} label={item.label} />
            ))}
          </div>
        </div>

        {/* Faculties */}
        <div className="border-l-4 border-gold pl-4">
          <SectionHeader href="/faculties">Faculties</SectionHeader>
          {faculties.length > 0 ? (
            <div className="space-y-1">
              {faculties.map((faculty) => (
                <MenuItem
                  key={faculty.id}
                  href={`/faculties/${faculty.short_name?.toLowerCase() || faculty.id}`}
                  label={faculty.name}
                />
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No faculties available</div>
          )}
        </div>
      </div>

      {/* Bottom Row: Departments (2 columns) */}
      <div className="pt-5 border-l-4 border-gold pl-4">
        <SectionHeader href="/departments">Departments</SectionHeader>
        {departments.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-8">
            <div className="space-y-1">
              {leftDepartments.map((dept) => (
                <MenuItem
                  key={dept.id}
                  href={`/departments/${dept.short_name?.toLowerCase() || dept.id}`}
                  label={dept.name}
                />
              ))}
            </div>
            <div className="space-y-1">
              {rightDepartments.map((dept) => (
                <MenuItem
                  key={dept.id}
                  href={`/departments/${dept.short_name?.toLowerCase() || dept.id}`}
                  label={dept.name}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No departments available</div>
        )}
      </div>
    </div>
  );
};
