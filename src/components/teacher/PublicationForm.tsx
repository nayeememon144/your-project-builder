import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type ResearchPaper = Tables<'research_papers'>;

interface PublicationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publication?: ResearchPaper | null;
  teacherId: string;
}

export const PublicationForm = ({ open, onOpenChange, publication, teacherId }: PublicationFormProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    journal_conference_name: '',
    publication_date: '',
    publication_type: 'journal' as 'journal' | 'conference' | 'book_chapter' | 'patent' | 'other',
    doi_link: '',
    abstract: '',
    keywords: '',
    citation_count: 0,
  });

  useEffect(() => {
    if (publication) {
      setFormData({
        title: publication.title || '',
        authors: publication.authors?.join(', ') || '',
        journal_conference_name: publication.journal_conference_name || '',
        publication_date: publication.publication_date || '',
        publication_type: publication.publication_type || 'journal',
        doi_link: publication.doi_link || '',
        abstract: publication.abstract || '',
        keywords: publication.keywords?.join(', ') || '',
        citation_count: publication.citation_count || 0,
      });
    } else {
      setFormData({
        title: '',
        authors: '',
        journal_conference_name: '',
        publication_date: '',
        publication_type: 'journal',
        doi_link: '',
        abstract: '',
        keywords: '',
        citation_count: 0,
      });
    }
  }, [publication, open]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const authorsArray = data.authors.split(',').map(a => a.trim()).filter(Boolean);
      const keywordsArray = data.keywords.split(',').map(k => k.trim()).filter(Boolean);
      
      const payload = {
        title: data.title,
        authors: authorsArray,
        journal_conference_name: data.journal_conference_name || null,
        publication_date: data.publication_date || null,
        publication_type: data.publication_type,
        doi_link: data.doi_link || null,
        abstract: data.abstract || null,
        keywords: keywordsArray.length > 0 ? keywordsArray : null,
        citation_count: data.citation_count,
        teacher_id: teacherId,
        status: 'pending' as const,
      };

      if (publication) {
        const { error } = await supabase
          .from('research_papers')
          .update(payload)
          .eq('id', publication.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('research_papers')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-publications'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-stats'] });
      toast.success(publication ? 'Publication updated!' : 'Publication submitted for review!');
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save publication');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.authors) {
      toast.error('Please fill in title and authors');
      return;
    }
    saveMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{publication ? 'Edit Publication' : 'Add New Publication'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Publication title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Authors * (comma-separated)</label>
            <Input
              value={formData.authors}
              onChange={(e) => setFormData(prev => ({ ...prev, authors: e.target.value }))}
              placeholder="Author 1, Author 2, Author 3"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Publication Type</label>
              <Select
                value={formData.publication_type}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, publication_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="journal">Journal Article</SelectItem>
                  <SelectItem value="conference">Conference Paper</SelectItem>
                  <SelectItem value="book_chapter">Book Chapter</SelectItem>
                  <SelectItem value="patent">Patent</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Publication Date</label>
              <Input
                type="date"
                value={formData.publication_date}
                onChange={(e) => setFormData(prev => ({ ...prev, publication_date: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Journal/Conference Name</label>
            <Input
              value={formData.journal_conference_name}
              onChange={(e) => setFormData(prev => ({ ...prev, journal_conference_name: e.target.value }))}
              placeholder="Journal or Conference name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">DOI Link</label>
              <Input
                value={formData.doi_link}
                onChange={(e) => setFormData(prev => ({ ...prev, doi_link: e.target.value }))}
                placeholder="https://doi.org/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Citation Count</label>
              <Input
                type="number"
                min={0}
                value={formData.citation_count}
                onChange={(e) => setFormData(prev => ({ ...prev, citation_count: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Keywords (comma-separated)</label>
            <Input
              value={formData.keywords}
              onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
              placeholder="Machine Learning, AI, Deep Learning"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Abstract</label>
            <Textarea
              value={formData.abstract}
              onChange={(e) => setFormData(prev => ({ ...prev, abstract: e.target.value }))}
              placeholder="Publication abstract..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : publication ? 'Update' : 'Submit for Review'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
