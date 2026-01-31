import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

interface TeacherProfileFormProps {
  profile: Profile | null;
}

export const TeacherProfileForm = ({ profile }: TeacherProfileFormProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    full_name: '',
    full_name_bn: '',
    designation: '',
    email: '',
    phone: '',
    areas_of_interest: '',
    academic_background: '',
    professional_experience: '',
    google_scholar_url: '',
    researchgate_url: '',
    orcid_url: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        full_name_bn: profile.full_name_bn || '',
        designation: profile.designation || '',
        email: profile.email || '',
        phone: profile.phone || '',
        areas_of_interest: profile.areas_of_interest?.join(', ') || '',
        academic_background: profile.academic_background || '',
        professional_experience: profile.professional_experience || '',
        google_scholar_url: profile.google_scholar_url || '',
        researchgate_url: profile.researchgate_url || '',
        orcid_url: profile.orcid_url || '',
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!profile) throw new Error('No profile found');
      
      const areasArray = data.areas_of_interest.split(',').map(a => a.trim()).filter(Boolean);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          full_name_bn: data.full_name_bn || null,
          designation: data.designation || null,
          email: data.email || null,
          phone: data.phone || null,
          areas_of_interest: areasArray.length > 0 ? areasArray : null,
          academic_background: data.academic_background || null,
          professional_experience: data.professional_experience || null,
          google_scholar_url: data.google_scholar_url || null,
          researchgate_url: data.researchgate_url || null,
          orcid_url: data.orcid_url || null,
        })
        .eq('id', profile.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-profile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Loading profile...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Full Name (Bangla)</label>
              <Input
                value={formData.full_name_bn}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name_bn: e.target.value }))}
                className="bengali"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Designation</label>
              <Input
                value={formData.designation}
                onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Research Areas (comma-separated)</label>
            <Input
              value={formData.areas_of_interest}
              onChange={(e) => setFormData(prev => ({ ...prev, areas_of_interest: e.target.value }))}
              placeholder="Machine Learning, Natural Language Processing, IoT"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Academic Background</label>
            <Textarea
              value={formData.academic_background}
              onChange={(e) => setFormData(prev => ({ ...prev, academic_background: e.target.value }))}
              rows={3}
              placeholder="PhD in Computer Science from..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Professional Experience</label>
            <Textarea
              value={formData.professional_experience}
              onChange={(e) => setFormData(prev => ({ ...prev, professional_experience: e.target.value }))}
              rows={3}
              placeholder="Associate Professor at SSTU since..."
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Google Scholar URL</label>
              <Input
                value={formData.google_scholar_url}
                onChange={(e) => setFormData(prev => ({ ...prev, google_scholar_url: e.target.value }))}
                placeholder="https://scholar.google.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ResearchGate URL</label>
              <Input
                value={formData.researchgate_url}
                onChange={(e) => setFormData(prev => ({ ...prev, researchgate_url: e.target.value }))}
                placeholder="https://researchgate.net/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ORCID URL</label>
              <Input
                value={formData.orcid_url}
                onChange={(e) => setFormData(prev => ({ ...prev, orcid_url: e.target.value }))}
                placeholder="https://orcid.org/..."
              />
            </div>
          </div>

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
