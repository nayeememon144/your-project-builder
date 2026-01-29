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
  faculty_id: string | null;
}

interface Program {
  id: string;
  name: string;
  degree_type: string;
  department_id: string | null;
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
            .select('id, name, short_name, faculty_id')
            .eq('is_active', true)
            .order('display_order', { ascending: true }),
          supabase
            .from('programs')
            .select('id, name, degree_type, department_id')
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

  return (
    <div className="py-6 px-4">
      {/* Top Row: Academic Information + Faculties */}
      <div className="grid grid-cols-12 gap-6 pb-6 border-b border-border">
        {/* Academic Information - 3 cols */}
        <div className="col-span-3">
          <SectionHeader href="/academic">Academic Information</SectionHeader>
          <div className="space-y-1">
            {academicInfoItems.map((item, idx) => (
              <MenuItem key={idx} href={item.href} label={item.label} />
            ))}
          </div>
        </div>

        {/* Faculties - 9 cols, 3 column grid */}
        <div className="col-span-9">
          <SectionHeader href="/faculties">Faculties</SectionHeader>
          {faculties.length > 0 ? (
            <div className="grid grid-cols-3 gap-x-6 gap-y-1">
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

      {/* Bottom Row: Departments + Programs */}
      <div className="grid grid-cols-12 gap-6 pt-6">
        {/* Departments - 8 cols, 2 column grid */}
        <div className="col-span-8 border-r border-border pr-6">
          <SectionHeader href="/departments">Departments</SectionHeader>
          {departments.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              {departments.map((dept) => (
                <MenuItem
                  key={dept.id}
                  href={`/departments/${dept.short_name?.toLowerCase() || dept.id}`}
                  label={dept.name}
                />
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No departments available</div>
          )}
        </div>

        {/* Programs - 4 cols */}
        <div className="col-span-4">
          <SectionHeader href="/academic">Programs</SectionHeader>
          {programs.length > 0 ? (
            <div className="space-y-1">
              {programs.slice(0, 8).map((program) => (
                <MenuItem
                  key={program.id}
                  href={`/programs/${program.id}`}
                  label={program.name}
                />
              ))}
              {programs.length > 8 && (
                <Link
                  to="/academic"
                  className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-primary hover:text-gold transition-colors"
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
