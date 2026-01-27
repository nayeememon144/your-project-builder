import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

const menuItemVariants = {
  initial: { x: 0 },
  hover: { x: 4 },
};

const iconVariants = {
  initial: { scale: 1, color: '#9ca3af' },
  hover: { scale: 1.2, color: 'hsl(var(--primary))' },
};

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
            .limit(8),
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
    <motion.div
      initial="initial"
      whileHover="hover"
      className="group"
    >
      <Link
        to={href}
        className="flex items-center gap-1.5 text-sm text-gray-600 group-hover:text-primary transition-colors py-0.5"
      >
        <motion.span variants={iconVariants} className="inline-flex">
          <ChevronRight className="w-3 h-3" />
        </motion.span>
        <motion.span variants={menuItemVariants}>
          {label}
        </motion.span>
      </Link>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4 flex justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-3 px-4">
      <div className="grid grid-cols-3 gap-4 max-w-3xl">
        {/* Academic Information */}
        <div>
          <h3 className="font-formal font-semibold text-primary text-xs uppercase tracking-wide border-b border-gold pb-1 mb-1.5">
            Academic Information
          </h3>
          <ul>
            {academicInfoItems.map((item, idx) => (
              <li key={idx}>
                <MenuItem href={item.href} label={item.label} />
              </li>
            ))}
          </ul>
        </div>

        {/* Faculties */}
        <div>
          <h3 className="font-formal font-semibold text-primary text-xs uppercase tracking-wide border-b border-gold pb-1 mb-1.5">
            Faculties
          </h3>
          <ul>
            {faculties.length > 0 ? (
              faculties.map((faculty) => (
                <li key={faculty.id}>
                  <MenuItem 
                    href={`/faculties/${faculty.short_name?.toLowerCase() || faculty.id}`} 
                    label={faculty.name} 
                  />
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-400 py-1">No faculties available</li>
            )}
            <li className="pt-1">
              <MenuItem href="/faculties" label="View All Faculties →" />
            </li>
          </ul>
        </div>

        {/* Departments */}
        <div>
          <h3 className="font-formal font-semibold text-primary text-xs uppercase tracking-wide border-b border-gold pb-1 mb-1.5">
            Departments
          </h3>
          <ul>
            {departments.length > 0 ? (
              departments.slice(0, 6).map((dept) => (
                <li key={dept.id}>
                  <MenuItem 
                    href={`/departments/${dept.short_name?.toLowerCase() || dept.id}`} 
                    label={dept.short_name || dept.name} 
                  />
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-400 py-1">No departments available</li>
            )}
            <li className="pt-1">
              <MenuItem href="/departments" label="View All Departments →" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
