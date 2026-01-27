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

const academicInfoItems = [
  { label: 'Academic Calendars', href: '/academic/calendar' },
  { label: 'Undergraduate Program', href: '/academic/undergraduate' },
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
            .order('display_order', { ascending: true })
            .limit(6),
          supabase
            .from('departments')
            .select('id, name, short_name, faculty_id')
            .eq('is_active', true)
            .order('display_order', { ascending: true })
            .limit(6),
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
      className="flex items-center gap-2 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
    >
      <ChevronRight className="w-3 h-3 text-gold" />
      {label}
    </Link>
  );

  if (loading) {
    return (
      <div className="py-4 px-6 flex justify-center">
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-1">
      <div className="grid grid-cols-3 divide-x divide-gray-100">
        {/* Academic Information */}
        <div className="py-1">
          <div className="px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wide">
            Academic Information
          </div>
          {academicInfoItems.map((item, idx) => (
            <MenuItem key={idx} href={item.href} label={item.label} />
          ))}
        </div>

        {/* Faculties */}
        <div className="py-1">
          <div className="px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wide">
            Faculties
          </div>
          {faculties.length > 0 ? (
            faculties.map((faculty) => (
              <MenuItem 
                key={faculty.id}
                href={`/faculties/${faculty.short_name?.toLowerCase() || faculty.id}`} 
                label={faculty.name} 
              />
            ))
          ) : (
            <div className="px-4 py-1.5 text-sm text-gray-400">No faculties</div>
          )}
          <MenuItem href="/faculties" label="View All →" />
        </div>

        {/* Departments */}
        <div className="py-1">
          <div className="px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wide">
            Departments
          </div>
          {departments.length > 0 ? (
            departments.slice(0, 4).map((dept) => (
              <MenuItem 
                key={dept.id}
                href={`/departments/${dept.short_name?.toLowerCase() || dept.id}`} 
                label={dept.short_name || dept.name} 
              />
            ))
          ) : (
            <div className="px-4 py-1.5 text-sm text-gray-400">No departments</div>
          )}
          <MenuItem href="/departments" label="View All →" />
        </div>
      </div>
    </div>
  );
};
