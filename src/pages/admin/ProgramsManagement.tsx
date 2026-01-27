import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2,
  BookOpen,
  Search
} from 'lucide-react';

type Program = {
  id: string;
  department_id: string | null;
  name: string;
  name_bn: string | null;
  degree_type: string;
  duration_years: number | null;
  total_credits: number | null;
  description: string | null;
  admission_requirements: string | null;
  career_opportunities: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
};

type Department = {
  id: string;
  name: string;
};

const ProgramsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    department_id: '',
    name: '',
    name_bn: '',
    degree_type: 'undergraduate',
    duration_years: 4,
    total_credits: 160,
    description: '',
    admission_requirements: '',
    career_opportunities: '',
    is_active: true,
  });

  // Fetch programs
  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['admin-programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as Program[];
    },
  });

  // Fetch departments for dropdown
  const { data: departments = [] } = useQuery({
    queryKey: ['departments-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as Department[];
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        department_id: data.department_id || null,
        name: data.name,
        name_bn: data.name_bn || null,
        degree_type: data.degree_type,
        duration_years: data.duration_years,
        total_credits: data.total_credits,
        description: data.description || null,
        admission_requirements: data.admission_requirements || null,
        career_opportunities: data.career_opportunities || null,
        is_active: data.is_active,
      };

      if (editingProgram) {
        const { error } = await supabase
          .from('programs')
          .update(payload)
          .eq('id', editingProgram.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('programs').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
      toast({ title: editingProgram ? 'Program updated!' : 'Program created!' });
      closeDialog();
    },
    onError: (error) => {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('programs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
      toast({ title: 'Program deleted!' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    },
  });

  const openCreateDialog = () => {
    setEditingProgram(null);
    setFormData({
      department_id: '',
      name: '',
      name_bn: '',
      degree_type: 'undergraduate',
      duration_years: 4,
      total_credits: 160,
      description: '',
      admission_requirements: '',
      career_opportunities: '',
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      department_id: program.department_id || '',
      name: program.name,
      name_bn: program.name_bn || '',
      degree_type: program.degree_type,
      duration_years: program.duration_years || 4,
      total_credits: program.total_credits || 160,
      description: program.description || '',
      admission_requirements: program.admission_requirements || '',
      career_opportunities: program.career_opportunities || '',
      is_active: program.is_active ?? true,
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProgram(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast({ title: 'Error', description: 'Program name is required', variant: 'destructive' });
      return;
    }
    saveMutation.mutate(formData);
  };

  const filteredPrograms = programs.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.degree_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDepartmentName = (deptId: string | null) => {
    if (!deptId) return 'No Department';
    const dept = departments.find(d => d.id === deptId);
    return dept?.name || 'Unknown';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Programs</h1>
            <p className="text-muted-foreground">Manage academic programs and degrees</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Program
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProgram ? 'Edit Program' : 'Add New Program'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Program Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., B.Sc. in Computer Science"
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department_id}
                      onValueChange={(value) => setFormData({ ...formData, department_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="degree_type">Degree Type</Label>
                    <Select
                      value={formData.degree_type}
                      onValueChange={(value) => setFormData({ ...formData, degree_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="postgraduate">Postgraduate</SelectItem>
                        <SelectItem value="doctoral">Doctoral</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="certificate">Certificate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration_years">Duration (Years)</Label>
                    <Input
                      id="duration_years"
                      type="number"
                      min="1"
                      max="8"
                      value={formData.duration_years}
                      onChange={(e) => setFormData({ ...formData, duration_years: parseInt(e.target.value) || 4 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total_credits">Total Credits</Label>
                    <Input
                      id="total_credits"
                      type="number"
                      min="0"
                      value={formData.total_credits}
                      onChange={(e) => setFormData({ ...formData, total_credits: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admission_requirements">Admission Requirements</Label>
                  <Textarea
                    id="admission_requirements"
                    value={formData.admission_requirements}
                    onChange={(e) => setFormData({ ...formData, admission_requirements: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="career_opportunities">Career Opportunities</Label>
                  <Textarea
                    id="career_opportunities"
                    value={formData.career_opportunities}
                    onChange={(e) => setFormData({ ...formData, career_opportunities: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label>Active</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={closeDialog} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saveMutation.isPending} className="flex-1">
                    {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingProgram ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Programs List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredPrograms.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No programs found. Add your first program!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredPrograms.map((program) => (
              <Card key={program.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{program.name}</h3>
                        <Badge variant="outline" className="capitalize">
                          {program.degree_type}
                        </Badge>
                        <Badge variant={program.is_active ? 'default' : 'secondary'}>
                          {program.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getDepartmentName(program.department_id)} • {program.duration_years} Years • {program.total_credits} Credits
                      </p>
                      {program.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {program.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(program)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          if (confirm('Delete this program?')) {
                            deleteMutation.mutate(program.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProgramsManagement;
