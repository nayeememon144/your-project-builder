import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Building2,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface Department {
  id: string;
  name: string;
  name_bn: string | null;
  short_name: string | null;
  code: string | null;
  description: string | null;
  description_bn: string | null;
  faculty_id: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  office_location: string | null;
  established_year: number | null;
  is_active: boolean;
  display_order: number | null;
  created_at: string;
}

interface Faculty {
  id: string;
  name: string;
}

const DepartmentsManagement = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    name_bn: '',
    short_name: '',
    code: '',
    description: '',
    description_bn: '',
    faculty_id: '',
    contact_email: '',
    contact_phone: '',
    office_location: '',
    established_year: new Date().getFullYear(),
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    fetchDepartments();
    fetchFaculties();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast.error('Failed to fetch departments');
    } else {
      setDepartments(data || []);
    }
    setLoading(false);
  };

  const fetchFaculties = async () => {
    const { data } = await supabase
      .from('faculties')
      .select('id, name')
      .eq('is_active', true)
      .order('name');
    
    if (data) {
      setFaculties(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const departmentData = {
      ...formData,
      name_bn: formData.name_bn || null,
      short_name: formData.short_name || null,
      code: formData.code || null,
      description: formData.description || null,
      description_bn: formData.description_bn || null,
      faculty_id: formData.faculty_id || null,
      contact_email: formData.contact_email || null,
      contact_phone: formData.contact_phone || null,
      office_location: formData.office_location || null,
    };

    if (editingDepartment) {
      const { error } = await supabase
        .from('departments')
        .update(departmentData)
        .eq('id', editingDepartment.id);

      if (error) {
        toast.error('Failed to update department');
      } else {
        toast.success('Department updated successfully');
        setIsDialogOpen(false);
        fetchDepartments();
      }
    } else {
      const { error } = await supabase
        .from('departments')
        .insert([departmentData]);

      if (error) {
        toast.error('Failed to create department');
      } else {
        toast.success('Department created successfully');
        setIsDialogOpen(false);
        fetchDepartments();
      }
    }
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department? This will affect all related programs.')) return;
    
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete department');
    } else {
      toast.success('Department deleted successfully');
      fetchDepartments();
    }
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      name_bn: department.name_bn || '',
      short_name: department.short_name || '',
      code: department.code || '',
      description: department.description || '',
      description_bn: department.description_bn || '',
      faculty_id: department.faculty_id || '',
      contact_email: department.contact_email || '',
      contact_phone: department.contact_phone || '',
      office_location: department.office_location || '',
      established_year: department.established_year || new Date().getFullYear(),
      is_active: department.is_active,
      display_order: department.display_order || 0,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingDepartment(null);
    setFormData({
      name: '',
      name_bn: '',
      short_name: '',
      code: '',
      description: '',
      description_bn: '',
      faculty_id: '',
      contact_email: '',
      contact_phone: '',
      office_location: '',
      established_year: new Date().getFullYear(),
      is_active: true,
      display_order: 0,
    });
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFacultyName = (facultyId: string | null) => {
    if (!facultyId) return 'No Faculty';
    const faculty = faculties.find(f => f.id === facultyId);
    return faculty?.name || 'Unknown';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold">Departments Management</h1>
            <p className="text-muted-foreground">Manage university departments</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingDepartment ? 'Edit Department' : 'Create New Department'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name (English)</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name_bn">Name (Bengali)</Label>
                    <Input
                      id="name_bn"
                      value={formData.name_bn}
                      onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="short_name">Short Name</Label>
                    <Input
                      id="short_name"
                      value={formData.short_name}
                      onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
                      placeholder="e.g., CSE"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Code</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="e.g., 101"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="established_year">Established Year</Label>
                    <Input
                      id="established_year"
                      type="number"
                      value={formData.established_year}
                      onChange={(e) => setFormData({ ...formData, established_year: parseInt(e.target.value) || 2020 })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="faculty_id">Faculty</Label>
                  <Select
                    value={formData.faculty_id}
                    onValueChange={(value) => setFormData({ ...formData, faculty_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select faculty" />
                    </SelectTrigger>
                    <SelectContent>
                      {faculties.map((faculty) => (
                        <SelectItem key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (English)</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      placeholder="dept@sstu.ac.bd"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Contact Phone</Label>
                    <Input
                      id="contact_phone"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      placeholder="+880-XXX-XXXXXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="office_location">Office Location</Label>
                  <Input
                    id="office_location"
                    value={formData.office_location}
                    onChange={(e) => setFormData({ ...formData, office_location: e.target.value })}
                    placeholder="Building A, Room 101"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingDepartment ? 'Update' : 'Create'} Department
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search departments..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Departments Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center p-8 text-muted-foreground">
              Loading departments...
            </div>
          ) : filteredDepartments.length === 0 ? (
            <div className="col-span-full text-center p-8 text-muted-foreground">
              No departments found
            </div>
          ) : (
            filteredDepartments.map((dept) => (
              <Card key={dept.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-accent" />
                    </div>
                    <Badge variant={dept.is_active ? 'default' : 'secondary'}>
                      {dept.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-1">{dept.name}</h3>
                  {dept.short_name && (
                    <p className="text-muted-foreground text-sm mb-2">({dept.short_name})</p>
                  )}
                  <p className="text-sm text-primary mb-3">{getFacultyName(dept.faculty_id)}</p>
                  
                  <div className="space-y-1 text-sm text-muted-foreground mb-4">
                    {dept.contact_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {dept.contact_email}
                      </div>
                    )}
                    {dept.contact_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {dept.contact_phone}
                      </div>
                    )}
                    {dept.office_location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        {dept.office_location}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(dept)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDelete(dept.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default DepartmentsManagement;
