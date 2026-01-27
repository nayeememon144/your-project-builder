import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Loader2,
  FileText,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  ExternalLink,
  Clock,
  User
} from 'lucide-react';

type ContentStatus = 'draft' | 'pending' | 'published' | 'archived';
type PublicationType = 'journal' | 'conference' | 'book_chapter' | 'patent' | 'other';

type ResearchPaper = {
  id: string;
  teacher_id: string;
  department_id: string | null;
  publication_type: PublicationType | null;
  title: string;
  authors: string[];
  is_corresponding_author: boolean | null;
  journal_conference_name: string | null;
  publisher: string | null;
  publication_date: string | null;
  volume: string | null;
  issue: string | null;
  pages: string | null;
  doi_link: string | null;
  google_scholar_link: string | null;
  abstract: string | null;
  keywords: string[] | null;
  citation_count: number | null;
  impact_factor: number | null;
  status: ContentStatus | null;
  review_notes: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
};

type TeacherProfile = {
  id: string;
  user_id: string;
  full_name: string;
};

const statusColors: Record<ContentStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-red-100 text-red-800',
};

const ResearchManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [reviewNotes, setReviewNotes] = useState('');

  // Fetch research papers
  const { data: papers = [], isLoading } = useQuery({
    queryKey: ['admin-research-papers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;
      return data as ResearchPaper[];
    },
  });

  // Fetch teacher profiles for names
  const { data: teachers = [] } = useQuery({
    queryKey: ['teacher-profiles'],
    queryFn: async () => {
      const { data: teacherRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'teacher');
      
      const teacherUserIds = teacherRoles?.map(r => r.user_id) || [];
      
      if (teacherUserIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, full_name')
        .in('user_id', teacherUserIds);
      
      if (error) throw error;
      return data as TeacherProfile[];
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: ContentStatus; notes?: string }) => {
      const updateData: Record<string, unknown> = { status };
      
      if (status === 'published') {
        updateData.approved_at = new Date().toISOString();
      }
      if (notes) {
        updateData.review_notes = notes;
      }

      const { error } = await supabase
        .from('research_papers')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-research-papers'] });
      toast({ title: 'Status updated!' });
      closeDialog();
    },
    onError: (error) => {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    },
  });

  const openReviewDialog = (paper: ResearchPaper) => {
    setSelectedPaper(paper);
    setReviewNotes(paper.review_notes || '');
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedPaper(null);
    setReviewNotes('');
  };

  const handleApprove = () => {
    if (!selectedPaper) return;
    updateStatusMutation.mutate({ id: selectedPaper.id, status: 'published', notes: reviewNotes });
  };

  const handleReject = () => {
    if (!selectedPaper || !reviewNotes) {
      toast({ title: 'Error', description: 'Please provide rejection notes', variant: 'destructive' });
      return;
    }
    updateStatusMutation.mutate({ id: selectedPaper.id, status: 'archived', notes: reviewNotes });
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.user_id === teacherId);
    return teacher?.full_name || 'Unknown Teacher';
  };

  const filteredPapers = papers.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const pendingCount = papers.filter(p => p.status === 'pending').length;
  const publishedCount = papers.filter(p => p.status === 'published').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Research Papers</h1>
          <p className="text-muted-foreground">Review and approve teacher-submitted research publications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{papers.length}</p>
              <p className="text-sm text-muted-foreground">Total Papers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{publishedCount}</p>
              <p className="text-sm text-muted-foreground">Published</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {papers.reduce((sum, p) => sum + (p.citation_count || 0), 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Citations</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Papers List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredPapers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No research papers found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredPapers.map((paper) => (
              <Card key={paper.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg leading-tight">{paper.title}</h3>
                        <Badge className={statusColors[paper.status || 'draft']}>
                          {paper.status || 'draft'}
                        </Badge>
                        {paper.publication_type && (
                          <Badge variant="outline" className="capitalize">
                            {paper.publication_type.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{paper.authors.join(', ')}</span>
                      </div>
                      
                      {paper.journal_conference_name && (
                        <p className="text-sm text-muted-foreground mt-1 italic">
                          {paper.journal_conference_name}
                          {paper.volume && `, Vol. ${paper.volume}`}
                          {paper.issue && `, Issue ${paper.issue}`}
                          {paper.publication_date && ` (${new Date(paper.publication_date).getFullYear()})`}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 mt-2 text-sm">
                        {paper.citation_count !== null && paper.citation_count > 0 && (
                          <span className="text-muted-foreground">
                            📊 {paper.citation_count} citations
                          </span>
                        )}
                        {paper.impact_factor && (
                          <span className="text-muted-foreground">
                            ⭐ IF: {paper.impact_factor}
                          </span>
                        )}
                        {paper.doi_link && (
                          <a
                            href={paper.doi_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            DOI <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        Submitted: {paper.submitted_at ? new Date(paper.submitted_at).toLocaleDateString() : 'N/A'}
                        {paper.approved_at && ` • Approved: ${new Date(paper.approved_at).toLocaleDateString()}`}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openReviewDialog(paper)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Review Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Review Research Paper</DialogTitle>
            </DialogHeader>
            
            {selectedPaper && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg">{selectedPaper.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    By: {selectedPaper.authors.join(', ')}
                  </p>
                </div>

                <Tabs defaultValue="details" className="w-full">
                  <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="abstract">Abstract</TabsTrigger>
                    <TabsTrigger value="links">Links</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Publication Type</Label>
                        <p className="capitalize">{selectedPaper.publication_type?.replace('_', ' ') || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Journal/Conference</Label>
                        <p>{selectedPaper.journal_conference_name || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Publisher</Label>
                        <p>{selectedPaper.publisher || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Publication Date</Label>
                        <p>{selectedPaper.publication_date || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Volume / Issue</Label>
                        <p>{selectedPaper.volume || '-'} / {selectedPaper.issue || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Pages</Label>
                        <p>{selectedPaper.pages || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Impact Factor</Label>
                        <p>{selectedPaper.impact_factor || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Citations</Label>
                        <p>{selectedPaper.citation_count || 0}</p>
                      </div>
                    </div>
                    {selectedPaper.keywords && selectedPaper.keywords.length > 0 && (
                      <div>
                        <Label className="text-muted-foreground">Keywords</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedPaper.keywords.map((kw, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">{kw}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="abstract">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm leading-relaxed">
                        {selectedPaper.abstract || 'No abstract provided.'}
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="links" className="space-y-2">
                    {selectedPaper.doi_link && (
                      <a href={selectedPaper.doi_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                        <ExternalLink className="w-4 h-4" /> DOI Link
                      </a>
                    )}
                    {selectedPaper.google_scholar_link && (
                      <a href={selectedPaper.google_scholar_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                        <ExternalLink className="w-4 h-4" /> Google Scholar
                      </a>
                    )}
                    {!selectedPaper.doi_link && !selectedPaper.google_scholar_link && (
                      <p className="text-muted-foreground">No external links provided.</p>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Review Notes */}
                <div className="space-y-2">
                  <Label htmlFor="review_notes">Review Notes</Label>
                  <Textarea
                    id="review_notes"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={3}
                    placeholder="Add notes for the author (required for rejection)..."
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={closeDialog} className="flex-1">
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleReject}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1"
                  >
                    {updateStatusMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button 
                    onClick={handleApprove}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {updateStatusMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ResearchManagement;
