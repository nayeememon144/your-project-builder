import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Loader2,
  Save,
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Info
} from 'lucide-react';

type SiteSetting = {
  id: string;
  setting_key: string;
  setting_value: unknown;
  setting_type: string | null;
  description: string | null;
  updated_at: string;
};

const SiteSettingsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // About settings
  const [aboutSettings, setAboutSettings] = useState({
    history: '',
    vision: '',
    mission: '',
    established_year: '2020',
  });

  // Contact settings
  const [contactSettings, setContactSettings] = useState({
    address: '',
    city: '',
    phone1: '',
    phone2: '',
    email1: '',
    email2: '',
    office_hours: '',
    map_embed_url: '',
  });

  // Fetch settings
  const { isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      
      // Parse settings into state
      data?.forEach((setting) => {
        const value = setting.setting_value as Record<string, string> | null;
        if (setting.setting_key === 'about' && value) {
          setAboutSettings(prev => ({
            ...prev,
            ...value,
          }));
        }
        if (setting.setting_key === 'contact' && value) {
          setContactSettings(prev => ({
            ...prev,
            ...value,
          }));
        }
      });
      
      return data as SiteSetting[];
    },
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: Record<string, string | number | boolean> }) => {
      // Check if setting exists
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('setting_key', key)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('site_settings')
          .update({ setting_value: value })
          .eq('setting_key', key);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert({
            setting_key: key,
            setting_value: value,
            setting_type: 'general',
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({ title: 'Settings saved successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    },
  });

  const handleSaveAbout = () => {
    saveMutation.mutate({ key: 'about', value: aboutSettings });
  };

  const handleSaveContact = () => {
    saveMutation.mutate({ key: 'contact', value: contactSettings });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Site Settings</h1>
          <p className="text-muted-foreground">Manage university information, about page, and contact details</p>
        </div>

        <Tabs defaultValue="about" className="space-y-6">
          <TabsList>
            <TabsTrigger value="about" className="gap-2">
              <Info className="w-4 h-4" />
              About
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2">
              <Phone className="w-4 h-4" />
              Contact
            </TabsTrigger>
          </TabsList>

          {/* About Settings */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  About University
                </CardTitle>
                <CardDescription>
                  Update the "About SSTU" page content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="established_year">Established Year</Label>
                  <Input
                    id="established_year"
                    value={aboutSettings.established_year}
                    onChange={(e) => setAboutSettings({ ...aboutSettings, established_year: e.target.value })}
                    placeholder="e.g., 2020"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="history">University History</Label>
                  <Textarea
                    id="history"
                    value={aboutSettings.history}
                    onChange={(e) => setAboutSettings({ ...aboutSettings, history: e.target.value })}
                    rows={4}
                    placeholder="Brief history of the university..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vision">Vision</Label>
                  <Textarea
                    id="vision"
                    value={aboutSettings.vision}
                    onChange={(e) => setAboutSettings({ ...aboutSettings, vision: e.target.value })}
                    rows={3}
                    placeholder="University vision statement..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mission">Mission</Label>
                  <Textarea
                    id="mission"
                    value={aboutSettings.mission}
                    onChange={(e) => setAboutSettings({ ...aboutSettings, mission: e.target.value })}
                    rows={3}
                    placeholder="University mission statement..."
                  />
                </div>
                <Button onClick={handleSaveAbout} disabled={saveMutation.isPending} className="gap-2">
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Save className="w-4 h-4" />
                  Save About Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Settings */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Update contact details displayed on the website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={contactSettings.address}
                      onChange={(e) => setContactSettings({ ...contactSettings, address: e.target.value })}
                      placeholder="e.g., Shantiganj"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City/District</Label>
                    <Input
                      id="city"
                      value={contactSettings.city}
                      onChange={(e) => setContactSettings({ ...contactSettings, city: e.target.value })}
                      placeholder="e.g., Sunamganj, Bangladesh"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone1">Phone 1</Label>
                    <Input
                      id="phone1"
                      value={contactSettings.phone1}
                      onChange={(e) => setContactSettings({ ...contactSettings, phone1: e.target.value })}
                      placeholder="e.g., +880-831-52012"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone2">Phone 2</Label>
                    <Input
                      id="phone2"
                      value={contactSettings.phone2}
                      onChange={(e) => setContactSettings({ ...contactSettings, phone2: e.target.value })}
                      placeholder="e.g., +880-831-52013"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email1">Email 1</Label>
                    <Input
                      id="email1"
                      type="email"
                      value={contactSettings.email1}
                      onChange={(e) => setContactSettings({ ...contactSettings, email1: e.target.value })}
                      placeholder="e.g., info@sstu.ac.bd"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email2">Email 2</Label>
                    <Input
                      id="email2"
                      type="email"
                      value={contactSettings.email2}
                      onChange={(e) => setContactSettings({ ...contactSettings, email2: e.target.value })}
                      placeholder="e.g., admission@sstu.ac.bd"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="office_hours">Office Hours</Label>
                  <Input
                    id="office_hours"
                    value={contactSettings.office_hours}
                    onChange={(e) => setContactSettings({ ...contactSettings, office_hours: e.target.value })}
                    placeholder="e.g., Sunday - Thursday, 9:00 AM - 5:00 PM"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="map_embed_url">Google Maps Embed URL</Label>
                  <Textarea
                    id="map_embed_url"
                    value={contactSettings.map_embed_url}
                    onChange={(e) => setContactSettings({ ...contactSettings, map_embed_url: e.target.value })}
                    rows={2}
                    placeholder="https://www.google.com/maps/embed?..."
                  />
                </div>

                <Button onClick={handleSaveContact} disabled={saveMutation.isPending} className="gap-2">
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Save className="w-4 h-4" />
                  Save Contact Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SiteSettingsManagement;
