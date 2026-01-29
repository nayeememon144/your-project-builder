import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, UserCheck, UserX, Eye, Plus, CheckCircle, Clock, ExternalLink, Loader2, Upload } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface TeacherProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  designation: string | null;
  employee_id: string | null;
  department_id: string | null;
  profile_photo: string | null;
  is_active: boolean | null;
  is_verified: boolean | null;
  academic_background: string | null;
  professional_experience: string | null;
  areas_of_interest: string[] | null;
  google_scholar_url: string | null;
  researchgate_url: string | null;
  created_at: string;
}

interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  journal_conference_name: string | null;
  publication_date: string | null;
  status: string | null;
  teacher_id: string;
  submitted_at: string | null;
  doi_link: string | null;
}

const TeachersManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherProfile | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [newTeacher, setNewTeacher] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    designation: '',
    employee_id: '',
    department_id: '',
    academic_background: '',
    professional_experience: '',
    profile_photo: '',
  });

  // Fetch teachers with their role
  const { data: teachers, isLoading: teachersLoading } = useQuery({
    queryKey: ['admin-teachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner(role)
        `)
        .eq('user_roles.role', 'teacher')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as TeacherProfile[];
    },
  });

  // Fetch departments for display
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name, short_name')
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
  });

  // Fetch research papers for selected teacher
  const { data: papers, isLoading: papersLoading } = useQuery({
    queryKey: ['teacher-papers', selectedTeacher?.user_id],
    queryFn: async () => {
      if (!selectedTeacher) return [];
      const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .eq('teacher_id', selectedTeacher.user_id)
        .order('submitted_at', { ascending: false });
      if (error) throw error;
      return data as ResearchPaper[];
    },
    enabled: !!selectedTeacher,
  });

  // Add new teacher mutation using edge function
  const addTeacherMutation = useMutation({
    mutationFn: async (data: typeof newTeacher) => {
      const { data: result, error } = await supabase.functions.invoke('add-teacher', {
        body: {
          email: data.email,
          password: data.password,
          full_name: data.full_name,
          phone: data.phone || null,
          designation: data.designation || null,
          employee_id: data.employee_id || null,
          department_id: data.department_id || null,
          academic_background: data.academic_background || null,
          professional_experience: data.professional_experience || null,
          profile_photo: data.profile_photo || null,
        }
      });

      if (error) throw error;
      if (!result.success) throw new Error(result.error);

      return result.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-teachers'] });
      setIsAddOpen(false);
      setNewTeacher({
        full_name: '',
        email: '',
        password: '',
        phone: '',
        designation: '',
        employee_id: '',
        department_id: '',
        academic_background: '',
        professional_experience: '',
        profile_photo: '',
      });
      toast({ title: 'Teacher added successfully! They can now login with their email and password.' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Failed to add teacher', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  // Verify/Unverify teacher
  const verifyMutation = useMutation({
    mutationFn: async ({ id, verified }: { id: string; verified: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: verified })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, { verified }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-teachers'] });
      toast({ title: verified ? 'Teacher verified successfully' : 'Teacher verification removed' });
    },
    onError: () => {
      toast({ title: 'Failed to update verification status', variant: 'destructive' });
    },
  });

  // Activate/Deactivate teacher
  const activateMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, { active }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-teachers'] });
      toast({ title: active ? 'Teacher activated' : 'Teacher deactivated' });
    },
    onError: () => {
      toast({ title: 'Failed to update status', variant: 'destructive' });
    },
  });

  // Approve/Reject paper
  const paperStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updates: Record<string, unknown> = { status };
      if (status === 'published') {
        updates.approved_at = new Date().toISOString();
      }
      const { error } = await supabase
        .from('research_papers')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-papers', selectedTeacher?.user_id] });
      toast({ title: 'Paper status updated' });
    },
    onError: () => {
      toast({ title: 'Failed to update paper status', variant: 'destructive' });
    },
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `teachers/${Date.now()}.${fileExt}`;
    
    setUploadingPhoto(true);
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('attachments')
        .getPublicUrl(fileName);
      
      setNewTeacher(prev => ({ ...prev, profile_photo: publicUrl }));
      toast({ title: 'Photo uploaded' });
    } catch (error) {
      toast({ title: 'Failed to upload photo', variant: 'destructive' });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.full_name || !newTeacher.email || !newTeacher.password) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    addTeacherMutation.mutate(newTeacher);
  };

  const getDepartmentName = (deptId: string | null) => {
    if (!deptId || !departments) return 'Not Assigned';
    const dept = departments.find(d => d.id === deptId);
    return dept?.short_name || dept?.name || 'Unknown';
  };

  const filteredTeachers = teachers?.filter(teacher => {
    const matchesSearch = teacher.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.employee_id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'verified') return matchesSearch && teacher.is_verified;
    if (filterStatus === 'unverified') return matchesSearch && !teacher.is_verified;
    if (filterStatus === 'active') return matchesSearch && teacher.is_active;
    if (filterStatus === 'inactive') return matchesSearch && !teacher.is_active;
    return matchesSearch;
  });

  const openDetails = (teacher: TeacherProfile) => {
    setSelectedTeacher(teacher);
    setIsDetailOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Teachers Management</h1>
            <p className="text-muted-foreground">Add, view, verify, and manage teacher profiles and publications</p>
          </div>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Teacher
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or employee ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teachers</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Teachers Table */}
        {teachersLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : filteredTeachers && filteredTeachers.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                          {teacher.profile_photo ? (
                            <img src={teacher.profile_photo} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-primary font-semibold">
                              {teacher.full_name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{teacher.full_name}</p>
                          <p className="text-sm text-muted-foreground">{teacher.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getDepartmentName(teacher.department_id)}</TableCell>
                    <TableCell>{teacher.designation || 'Not set'}</TableCell>
                    <TableCell>
                      <Badge variant={teacher.is_active ? 'default' : 'secondary'}>
                        {teacher.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {teacher.is_verified ? (
                        <Badge className="bg-green-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => openDetails(teacher)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {!teacher.is_verified ? (
                          <Button 
                            size="sm" 
                            onClick={() => verifyMutation.mutate({ id: teacher.id, verified: true })}
                            disabled={verifyMutation.isPending}
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => verifyMutation.mutate({ id: teacher.id, verified: false })}
                            disabled={verifyMutation.isPending}
                          >
                            <UserX className="w-4 h-4 mr-1" />
                            Unverify
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/50 rounded-xl">
            <UserCheck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No Teachers Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search query' : 'Add your first teacher to get started'}
            </p>
            <Button onClick={() => setIsAddOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Teacher
            </Button>
          </div>
        )}

        {/* Add Teacher Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleAddTeacher} className="space-y-4 mt-4">
              {/* Profile Photo */}
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed">
                  {newTeacher.profile_photo ? (
                    <img src={newTeacher.profile_photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-muted-foreground text-2xl">?</span>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={photoInputRef}
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={uploadingPhoto}
                  >
                    {uploadingPhoto ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    Upload Photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">Optional</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={newTeacher.full_name}
                    onChange={(e) => setNewTeacher({ ...newTeacher, full_name: e.target.value })}
                    placeholder="Prof. Dr. Name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                    placeholder="teacher@sstu.ac.bd"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newTeacher.password}
                    onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                    placeholder="Min 6 characters"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Teacher can change this later</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newTeacher.phone}
                    onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                    placeholder="+880-XXX-XXXXXXX"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Select
                    value={newTeacher.designation}
                    onValueChange={(value) => setNewTeacher({ ...newTeacher, designation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professor">Professor</SelectItem>
                      <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                      <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                      <SelectItem value="Lecturer">Lecturer</SelectItem>
                      <SelectItem value="Senior Lecturer">Senior Lecturer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee_id">Employee ID</Label>
                  <Input
                    id="employee_id"
                    value={newTeacher.employee_id}
                    onChange={(e) => setNewTeacher({ ...newTeacher, employee_id: e.target.value })}
                    placeholder="e.g., SSTU-FAC-001"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department_id">Department</Label>
                <Select
                  value={newTeacher.department_id}
                  onValueChange={(value) => setNewTeacher({ ...newTeacher, department_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments?.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="academic_background">Academic Background</Label>
                <Textarea
                  id="academic_background"
                  value={newTeacher.academic_background}
                  onChange={(e) => setNewTeacher({ ...newTeacher, academic_background: e.target.value })}
                  placeholder="PhD in Computer Science from..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="professional_experience">Professional Experience</Label>
                <Textarea
                  id="professional_experience"
                  value={newTeacher.professional_experience}
                  onChange={(e) => setNewTeacher({ ...newTeacher, professional_experience: e.target.value })}
                  placeholder="10+ years of teaching experience..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={addTeacherMutation.isPending} className="flex-1">
                  {addTeacherMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Add Teacher
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Teacher Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Teacher Profile</DialogTitle>
            </DialogHeader>
            
            {selectedTeacher && (
              <Tabs defaultValue="profile" className="mt-4">
                <TabsList>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="publications">Publications ({papers?.length || 0})</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6 mt-4">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {selectedTeacher.profile_photo ? (
                        <img src={selectedTeacher.profile_photo} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl text-primary font-semibold">
                          {selectedTeacher.full_name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{selectedTeacher.full_name}</h3>
                      <p className="text-muted-foreground">{selectedTeacher.designation || 'No designation'}</p>
                      <p className="text-sm text-muted-foreground">{getDepartmentName(selectedTeacher.department_id)}</p>
                      <div className="flex gap-2 mt-2">
                        {selectedTeacher.is_verified && (
                          <Badge className="bg-green-500">Verified</Badge>
                        )}
                        <Badge variant={selectedTeacher.is_active ? 'default' : 'secondary'}>
                          {selectedTeacher.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p>{selectedTeacher.email || 'Not provided'}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p>{selectedTeacher.phone || 'Not provided'}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
                      <p>{selectedTeacher.employee_id || 'Not assigned'}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Joined</label>
                      <p>{format(new Date(selectedTeacher.created_at), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>

                  {selectedTeacher.academic_background && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Academic Background</label>
                      <p className="text-sm">{selectedTeacher.academic_background}</p>
                    </div>
                  )}

                  {selectedTeacher.professional_experience && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">Professional Experience</label>
                      <p className="text-sm">{selectedTeacher.professional_experience}</p>
                    </div>
                  )}

                  {selectedTeacher.areas_of_interest && selectedTeacher.areas_of_interest.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Areas of Interest</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedTeacher.areas_of_interest.map((area, idx) => (
                          <Badge key={idx} variant="outline">{area}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    {selectedTeacher.google_scholar_url && (
                      <a href={selectedTeacher.google_scholar_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary flex items-center gap-1 hover:underline">
                        <ExternalLink className="w-3 h-3" />
                        Google Scholar
                      </a>
                    )}
                    {selectedTeacher.researchgate_url && (
                      <a href={selectedTeacher.researchgate_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary flex items-center gap-1 hover:underline">
                        <ExternalLink className="w-3 h-3" />
                        ResearchGate
                      </a>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="publications" className="mt-4">
                  {papersLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                      ))}
                    </div>
                  ) : papers && papers.length > 0 ? (
                    <div className="space-y-4">
                      {papers.map((paper) => (
                        <div key={paper.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold">{paper.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {paper.authors.join(', ')}
                              </p>
                              {paper.journal_conference_name && (
                                <p className="text-sm text-muted-foreground">
                                  {paper.journal_conference_name} • {paper.publication_date}
                                </p>
                              )}
                              {paper.doi_link && (
                                <a href={paper.doi_link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                  DOI Link →
                                </a>
                              )}
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                              <Badge variant={
                                paper.status === 'published' ? 'default' : 
                                paper.status === 'pending' ? 'outline' : 'secondary'
                              }>
                                {paper.status}
                              </Badge>
                              {paper.status === 'pending' && (
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => paperStatusMutation.mutate({ id: paper.id, status: 'published' })}
                                    disabled={paperStatusMutation.isPending}
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => paperStatusMutation.mutate({ id: paper.id, status: 'archived' })}
                                    disabled={paperStatusMutation.isPending}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No publications submitted yet
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="settings" className="mt-4 space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Active Status</h4>
                      <p className="text-sm text-muted-foreground">
                        Active teachers appear on the website
                      </p>
                    </div>
                    <Switch
                      checked={selectedTeacher.is_active ?? true}
                      onCheckedChange={(checked) => 
                        activateMutation.mutate({ id: selectedTeacher.id, active: checked })
                      }
                      disabled={activateMutation.isPending}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Verified Status</h4>
                      <p className="text-sm text-muted-foreground">
                        Verified teachers have a badge on their profile
                      </p>
                    </div>
                    <Switch
                      checked={selectedTeacher.is_verified ?? false}
                      onCheckedChange={(checked) => 
                        verifyMutation.mutate({ id: selectedTeacher.id, verified: checked })
                      }
                      disabled={verifyMutation.isPending}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default TeachersManagement;
