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

interface Program {
  id: string;
  name: string;
  degree_type: string;
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
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facultiesRes, departmentsRes, programsRes] = await Promise.all([
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
          supabase
            .from('programs')
            .select('id, name, degree_type')
            .eq('is_active', true)
            .order('name', { ascending: true }),
        ]);

        if (facultiesRes.data) setFaculties(facultiesRes.data);
        if (departmentsRes.data) setDepartments(departmentsRes.data);
        if (programsRes.data) setPrograms(programsRes.data);
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
      className="flex items-center gap-2 py-1 text-sm text-muted-foreground hover:text-primary transition-colors"
    >
      <ChevronRight className="w-3 h-3 text-gold flex-shrink-0" />
      <span className="leading-tight">{label}</span>
    </Link>
  );

  const SectionHeader = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      to={href}
      className="block text-sm font-bold text-primary hover:text-gold transition-colors border-b border-gold pb-1.5 mb-2"
    >
      {children}
    </Link>
  );

  if (loading) {
    return (
      <div className="w-[600px] py-8 flex justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-[600px] p-5">
      {/* Row 1: Academic Information + Faculties */}
      <div className="grid grid-cols-2 gap-6 pb-4 border-b border-border">
        {/* Academic Information */}
        <div>
          <SectionHeader href="/academic">Academic Information</SectionHeader>
          <div className="space-y-0.5">
            {academicInfoItems.map((item, idx) => (
              <MenuItem key={idx} href={item.href} label={item.label} />
            ))}
          </div>
        </div>

        {/* Faculties */}
        <div>
          <SectionHeader href="/faculties">Faculties</SectionHeader>
          {faculties.length > 0 ? (
            <div className="space-y-0.5">
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

      {/* Row 2: Departments + Programs */}
      <div className="grid grid-cols-2 gap-6 pt-4">
        {/* Departments */}
        <div>
          <SectionHeader href="/departments">Departments</SectionHeader>
          {departments.length > 0 ? (
            <div className="space-y-0.5">
              {departments.slice(0, 6).map((dept) => (
                <MenuItem
                  key={dept.id}
                  href={`/departments/${dept.short_name?.toLowerCase() || dept.id}`}
                  label={dept.name}
                />
              ))}
              {departments.length > 6 && (
                <Link
                  to="/departments"
                  className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-primary hover:text-gold transition-colors"
                >
                  View all departments
                  <ChevronRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No departments available</div>
          )}
        </div>

        {/* Programs */}
        <div>
          <SectionHeader href="/academic">Programs</SectionHeader>
          {programs.length > 0 ? (
            <div className="space-y-0.5">
              {programs.slice(0, 6).map((program) => (
                <MenuItem
                  key={program.id}
                  href={`/programs/${program.id}`}
                  label={program.name}
                />
              ))}
              {programs.length > 6 && (
                <Link
                  to="/academic"
                  className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-primary hover:text-gold transition-colors"
                >
                  View all programs
                  <ChevronRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No programs available</div>
          )}
        </div>
      </div>
    </div>
  );
};
