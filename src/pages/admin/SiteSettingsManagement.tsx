import { useState, useRef } from 'react';
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
  Info,
  Image as ImageIcon,
  User,
  Upload
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
  const glanceImageRef = useRef<HTMLInputElement>(null);
  const vcImageRef = useRef<HTMLInputElement>(null);
  const [uploadingGlance, setUploadingGlance] = useState(false);
  const [uploadingVC, setUploadingVC] = useState(false);

  // About/At a Glance settings
  const [aboutSettings, setAboutSettings] = useState({
    history: '',
    vision: '',
    mission: '',
    established_year: '2020',
    glance_image: '',
    glance_text: '',
  });

  // VC Message settings
  const [vcSettings, setVCSettings] = useState({
    vc_name: '',
    vc_designation: 'Vice-Chancellor',
    vc_image: '',
    vc_message: '',
  });

  // Contact settings
  const [contactSettings, setContactSettings] = useState({
    address: 'Shantiganj 3000, Sunamganj, Bangladesh',
    city: 'Sunamganj, Sylhet Division',
    phone1: '+880-831-52012',
    phone2: '',
    email1: 'info@sstu.ac.bd',
    email2: '',
    office_hours: 'Sunday - Thursday, 9:00 AM - 5:00 PM',
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
        if (setting.setting_key === 'vc_message' && value) {
          setVCSettings(prev => ({
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
        .maybeSingle();

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

  // Image upload handler
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'glance' | 'vc'
  ) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `site-settings/${type}-${Date.now()}.${fileExt}`;
    
    if (type === 'glance') setUploadingGlance(true);
    else setUploadingVC(true);
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('attachments')
        .getPublicUrl(fileName);
      
      if (type === 'glance') {
        setAboutSettings(prev => ({ ...prev, glance_image: publicUrl }));
      } else {
        setVCSettings(prev => ({ ...prev, vc_image: publicUrl }));
      }
      
      toast({ title: 'Image uploaded successfully' });
    } catch (error) {
      toast({ title: 'Failed to upload image', variant: 'destructive' });
    } finally {
      if (type === 'glance') setUploadingGlance(false);
      else setUploadingVC(false);
    }
  };

  const handleSaveAbout = () => {
    saveMutation.mutate({ key: 'about', value: aboutSettings });
  };

  const handleSaveVC = () => {
    saveMutation.mutate({ key: 'vc_message', value: vcSettings });
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
          <p className="text-muted-foreground">Manage university information, about page, VC message, and contact details</p>
        </div>

        <Tabs defaultValue="glance" className="space-y-6">
          <TabsList>
            <TabsTrigger value="glance" className="gap-2">
              <Info className="w-4 h-4" />
              At a Glance
            </TabsTrigger>
            <TabsTrigger value="vc" className="gap-2">
              <User className="w-4 h-4" />
              VC Message
            </TabsTrigger>
            <TabsTrigger value="about" className="gap-2">
              <Building2 className="w-4 h-4" />
              About
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2">
              <Phone className="w-4 h-4" />
              Contact
            </TabsTrigger>
          </TabsList>

          {/* SSTU At a Glance Settings */}
          <TabsContent value="glance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  SSTU At a Glance
                </CardTitle>
                <CardDescription>
                  Update the "At a Glance" section image and content on the homepage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Section Image</Label>
                  <div className="flex items-start gap-4">
                    <div className="w-48 h-32 bg-muted rounded-lg overflow-hidden border">
                      {aboutSettings.glance_image ? (
                        <img 
                          src={aboutSettings.glance_image} 
                          alt="At a Glance" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={glanceImageRef}
                        onChange={(e) => handleImageUpload(e, 'glance')}
                        className="hidden"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => glanceImageRef.current?.click()}
                        disabled={uploadingGlance}
                      >
                        {uploadingGlance ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Upload className="w-4 h-4 mr-2" />
                        )}
                        Upload Image
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended: 800x500px, JPG/PNG
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="glance_text">Section Content</Label>
                  <Textarea
                    id="glance_text"
                    value={aboutSettings.glance_text}
                    onChange={(e) => setAboutSettings({ ...aboutSettings, glance_text: e.target.value })}
                    rows={6}
                    placeholder="Enter the main description for the SSTU At a Glance section..."
                  />
                </div>

                <Button onClick={handleSaveAbout} disabled={saveMutation.isPending} className="gap-2">
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Save className="w-4 h-4" />
                  Save At a Glance Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* VC Message Settings */}
          <TabsContent value="vc" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Vice-Chancellor Message
                </CardTitle>
                <CardDescription>
                  Update the Vice-Chancellor's photo and message on the homepage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* VC Image Upload */}
                <div className="space-y-2">
                  <Label>Vice-Chancellor Photo</Label>
                  <div className="flex items-start gap-4">
                    <div className="w-32 h-32 bg-muted rounded-full overflow-hidden border-4 border-gold/30">
                      {vcSettings.vc_image ? (
                        <img 
                          src={vcSettings.vc_image} 
                          alt="Vice Chancellor" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <User className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={vcImageRef}
                        onChange={(e) => handleImageUpload(e, 'vc')}
                        className="hidden"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => vcImageRef.current?.click()}
                        disabled={uploadingVC}
                      >
                        {uploadingVC ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Upload className="w-4 h-4 mr-2" />
                        )}
                        Upload Photo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        Square image recommended (400x400px)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vc_name">VC Name</Label>
                    <Input
                      id="vc_name"
                      value={vcSettings.vc_name}
                      onChange={(e) => setVCSettings({ ...vcSettings, vc_name: e.target.value })}
                      placeholder="Prof. Dr. Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vc_designation">Designation</Label>
                    <Input
                      id="vc_designation"
                      value={vcSettings.vc_designation}
                      onChange={(e) => setVCSettings({ ...vcSettings, vc_designation: e.target.value })}
                      placeholder="Vice-Chancellor"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vc_message">Message</Label>
                  <Textarea
                    id="vc_message"
                    value={vcSettings.vc_message}
                    onChange={(e) => setVCSettings({ ...vcSettings, vc_message: e.target.value })}
                    rows={6}
                    placeholder="Enter the Vice-Chancellor's welcome message..."
                  />
                </div>

                <Button onClick={handleSaveVC} disabled={saveMutation.isPending} className="gap-2">
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Save className="w-4 h-4" />
                  Save VC Message
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

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
                  Update contact details - these will appear in the Contact page and Footer across the website
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
                      placeholder="e.g., Shantiganj 3000, Sunamganj, Bangladesh"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City/District</Label>
                    <Input
                      id="city"
                      value={contactSettings.city}
                      onChange={(e) => setContactSettings({ ...contactSettings, city: e.target.value })}
                      placeholder="e.g., Sunamganj, Sylhet Division"
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
                    <Label htmlFor="phone2">Phone 2 (Optional)</Label>
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
                    <Label htmlFor="email2">Email 2 (Optional)</Label>
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
