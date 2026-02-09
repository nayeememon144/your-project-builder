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
  Upload,
  FileText,
  Palette,
  BookOpen,
  Network,
  Video
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
  const organogramImageRef = useRef<HTMLInputElement>(null);
  const [uploadingGlance, setUploadingGlance] = useState(false);
  const [uploadingVC, setUploadingVC] = useState(false);
  const [uploadingOrganogram, setUploadingOrganogram] = useState(false);
  const [uploadingCampusLife, setUploadingCampusLife] = useState(false);
  const campusLifeImageRef = useRef<HTMLInputElement>(null);

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

  // ACT settings
  const [actSettings, setActSettings] = useState({
    description: '',
    content: '',
    pdf_url: '',
  });

  // Organogram settings
  const [organogramSettings, setOrganogramSettings] = useState({
    description: '',
    image_url: '',
    pdf_url: '',
  });

  // Bulletin settings
  const [bulletinSettings, setBulletinSettings] = useState({
    description: '',
    bulletins: [] as Array<{ title: string; year: string; pdf_url: string; description?: string }>,
  });

  // Monogram settings
  const [monogramSettings, setMonogramSettings] = useState({
    description: '',
    logo_meaning: '',
  });

  // Campus Map settings
  const [campusMapSettings, setCampusMapSettings] = useState({
    description: '',
    map_embed_url: '',
    google_maps_url: '',
  });

  // Campus Life settings
  const [campusLifeSettings, setCampusLifeSettings] = useState({
    video_url: '',
    video_thumbnail: '',
    campus_image: '',
    title: 'The Campus Life',
    description: '',
    description_2: '',
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
        if (setting.setting_key === 'about_act' && value) {
          setActSettings(prev => ({
            ...prev,
            ...value,
          }));
        }
        if (setting.setting_key === 'about_organogram' && value) {
          setOrganogramSettings(prev => ({
            ...prev,
            ...value,
          }));
        }
        if (setting.setting_key === 'about_bulletin' && value) {
          setBulletinSettings(prev => ({
            ...prev,
            ...value,
          }));
        }
        if (setting.setting_key === 'about_monogram' && value) {
          setMonogramSettings(prev => ({
            ...prev,
            ...value,
          }));
        }
        if (setting.setting_key === 'about_campus_map' && value) {
          setCampusMapSettings(prev => ({
            ...prev,
            ...value,
          }));
        }
        if (setting.setting_key === 'campus_life' && value) {
          setCampusLifeSettings(prev => ({
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
    type: 'glance' | 'vc' | 'organogram' | 'campus_life'
  ) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `site-settings/${type}-${Date.now()}.${fileExt}`;
    
    if (type === 'glance') setUploadingGlance(true);
    else if (type === 'vc') setUploadingVC(true);
    else if (type === 'organogram') setUploadingOrganogram(true);
    else setUploadingCampusLife(true);
    
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
      } else if (type === 'vc') {
        setVCSettings(prev => ({ ...prev, vc_image: publicUrl }));
      } else if (type === 'organogram') {
        setOrganogramSettings(prev => ({ ...prev, image_url: publicUrl }));
      } else {
        setCampusLifeSettings(prev => ({ ...prev, campus_image: publicUrl }));
      }
      
      toast({ title: 'Image uploaded successfully' });
    } catch (error) {
      toast({ title: 'Failed to upload image', variant: 'destructive' });
    } finally {
      if (type === 'glance') setUploadingGlance(false);
      else if (type === 'vc') setUploadingVC(false);
      else if (type === 'organogram') setUploadingOrganogram(false);
      else setUploadingCampusLife(false);
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

  const handleSaveAct = () => {
    saveMutation.mutate({ key: 'about_act', value: actSettings });
  };

  const handleSaveOrganogram = () => {
    saveMutation.mutate({ key: 'about_organogram', value: organogramSettings });
  };

  const handleSaveBulletin = () => {
    saveMutation.mutate({ key: 'about_bulletin', value: bulletinSettings as unknown as Record<string, string | number | boolean> });
  };

  const handleSaveMonogram = () => {
    saveMutation.mutate({ key: 'about_monogram', value: monogramSettings });
  };

  const handleSaveCampusMap = () => {
    saveMutation.mutate({ key: 'about_campus_map', value: campusMapSettings });
  };

  const handleSaveCampusLife = () => {
    saveMutation.mutate({ key: 'campus_life', value: campusLifeSettings });
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
          <TabsList className="flex flex-wrap h-auto gap-1">
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
            <TabsTrigger value="act" className="gap-2">
              <FileText className="w-4 h-4" />
              ACT
            </TabsTrigger>
            <TabsTrigger value="organogram" className="gap-2">
              <Network className="w-4 h-4" />
              Organogram
            </TabsTrigger>
            <TabsTrigger value="bulletin" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Bulletin
            </TabsTrigger>
            <TabsTrigger value="monogram" className="gap-2">
              <Palette className="w-4 h-4" />
              Monogram
            </TabsTrigger>
            <TabsTrigger value="campus-map" className="gap-2">
              <MapPin className="w-4 h-4" />
              Campus Map
            </TabsTrigger>
            <TabsTrigger value="campus-life" className="gap-2">
              <Video className="w-4 h-4" />
              Campus Life
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

          {/* ACT Settings */}
          <TabsContent value="act" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  SSTU ACT
                </CardTitle>
                <CardDescription>
                  Manage the SSTU Act page content and PDF document
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="act_description">Description</Label>
                  <Textarea
                    id="act_description"
                    value={actSettings.description}
                    onChange={(e) => setActSettings({ ...actSettings, description: e.target.value })}
                    rows={3}
                    placeholder="Brief description of the SSTU Act..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="act_content">Key Provisions</Label>
                  <Textarea
                    id="act_content"
                    value={actSettings.content}
                    onChange={(e) => setActSettings({ ...actSettings, content: e.target.value })}
                    rows={8}
                    placeholder="List the key provisions of the Act..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="act_pdf">PDF URL</Label>
                  <Input
                    id="act_pdf"
                    value={actSettings.pdf_url}
                    onChange={(e) => setActSettings({ ...actSettings, pdf_url: e.target.value })}
                    placeholder="https://example.com/sstu-act.pdf"
                  />
                </div>
                <Button onClick={handleSaveAct} disabled={saveMutation.isPending} className="gap-2">
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Save className="w-4 h-4" />
                  Save ACT Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Organogram Settings */}
          <TabsContent value="organogram" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  SSTU Organogram
                </CardTitle>
                <CardDescription>
                  Manage the organizational structure diagram
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organogram_description">Description</Label>
                  <Textarea
                    id="organogram_description"
                    value={organogramSettings.description}
                    onChange={(e) => setOrganogramSettings({ ...organogramSettings, description: e.target.value })}
                    rows={3}
                    placeholder="Description of the organizational structure..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Organogram Image</Label>
                  <div className="flex items-start gap-4">
                    <div className="w-48 h-32 bg-muted rounded-lg overflow-hidden border">
                      {organogramSettings.image_url ? (
                        <img 
                          src={organogramSettings.image_url} 
                          alt="Organogram" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Network className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={organogramImageRef}
                        onChange={(e) => handleImageUpload(e, 'organogram')}
                        className="hidden"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => organogramImageRef.current?.click()}
                        disabled={uploadingOrganogram}
                      >
                        {uploadingOrganogram ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Upload className="w-4 h-4 mr-2" />
                        )}
                        Upload Image
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organogram_pdf">PDF URL (Optional)</Label>
                  <Input
                    id="organogram_pdf"
                    value={organogramSettings.pdf_url}
                    onChange={(e) => setOrganogramSettings({ ...organogramSettings, pdf_url: e.target.value })}
                    placeholder="https://example.com/organogram.pdf"
                  />
                </div>
                <Button onClick={handleSaveOrganogram} disabled={saveMutation.isPending} className="gap-2">
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Save className="w-4 h-4" />
                  Save Organogram Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bulletin Settings */}
          <TabsContent value="bulletin" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  SSTU Bulletin
                </CardTitle>
                <CardDescription>
                  Manage university bulletins and academic publications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bulletin_description">Description</Label>
                  <Textarea
                    id="bulletin_description"
                    value={bulletinSettings.description}
                    onChange={(e) => setBulletinSettings({ ...bulletinSettings, description: e.target.value })}
                    rows={3}
                    placeholder="Description of the SSTU Bulletin..."
                  />
                </div>
                <div className="border rounded-lg p-4 bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    Note: For complex bulletin management with multiple entries, please contact the development team to set up the bulletins array in the database.
                  </p>
                </div>
                <Button onClick={handleSaveBulletin} disabled={saveMutation.isPending} className="gap-2">
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Save className="w-4 h-4" />
                  Save Bulletin Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monogram Settings */}
          <TabsContent value="monogram" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  SSTU Monogram
                </CardTitle>
                <CardDescription>
                  Manage the official logo and visual identity information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="monogram_description">Description</Label>
                  <Textarea
                    id="monogram_description"
                    value={monogramSettings.description}
                    onChange={(e) => setMonogramSettings({ ...monogramSettings, description: e.target.value })}
                    rows={3}
                    placeholder="Description of the SSTU monogram and its significance..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo_meaning">Symbolism & Meaning</Label>
                  <Textarea
                    id="logo_meaning"
                    value={monogramSettings.logo_meaning}
                    onChange={(e) => setMonogramSettings({ ...monogramSettings, logo_meaning: e.target.value })}
                    rows={6}
                    placeholder="Explain the symbolism and meaning of the logo elements..."
                  />
                </div>
                <Button onClick={handleSaveMonogram} disabled={saveMutation.isPending} className="gap-2">
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Save className="w-4 h-4" />
                  Save Monogram Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campus Map Settings */}
          <TabsContent value="campus-map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Campus Map
                </CardTitle>
                <CardDescription>
                  Manage campus location and map settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campus_description">Description</Label>
                  <Textarea
                    id="campus_description"
                    value={campusMapSettings.description}
                    onChange={(e) => setCampusMapSettings({ ...campusMapSettings, description: e.target.value })}
                    rows={3}
                    placeholder="Description of the campus location..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campus_map_embed">Google Maps Embed URL</Label>
                  <Textarea
                    id="campus_map_embed"
                    value={campusMapSettings.map_embed_url}
                    onChange={(e) => setCampusMapSettings({ ...campusMapSettings, map_embed_url: e.target.value })}
                    rows={2}
                    placeholder="https://www.google.com/maps/embed?..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="google_maps_url">Google Maps Link (for directions)</Label>
                  <Input
                    id="google_maps_url"
                    value={campusMapSettings.google_maps_url}
                    onChange={(e) => setCampusMapSettings({ ...campusMapSettings, google_maps_url: e.target.value })}
                    placeholder="https://goo.gl/maps/..."
                  />
                </div>
                <Button onClick={handleSaveCampusMap} disabled={saveMutation.isPending} className="gap-2">
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Save className="w-4 h-4" />
                  Save Campus Map Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campus Life Settings */}
          <TabsContent value="campus-life" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Campus Life Section
                </CardTitle>
                <CardDescription>
                  Manage the Campus Life section on the homepage with video and content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Campus Image Upload */}
                <div className="space-y-2">
                  <Label>Campus Life Image</Label>
                  <div className="flex items-start gap-4">
                    <div className="w-64 h-40 bg-muted rounded-lg overflow-hidden border">
                      {campusLifeSettings.campus_image ? (
                        <img 
                          src={campusLifeSettings.campus_image} 
                          alt="Campus Life" 
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
                        ref={campusLifeImageRef}
                        onChange={(e) => handleImageUpload(e, 'campus_life')}
                        className="hidden"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => campusLifeImageRef.current?.click()}
                        disabled={uploadingCampusLife}
                      >
                        {uploadingCampusLife ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Upload className="w-4 h-4 mr-2" />
                        )}
                        Upload Image
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended: 1200x800px, JPG/PNG<br />
                        This image appears on the left side with the play button overlay
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campus_life_title">Section Title</Label>
                  <Input
                    id="campus_life_title"
                    value={campusLifeSettings.title}
                    onChange={(e) => setCampusLifeSettings({ ...campusLifeSettings, title: e.target.value })}
                    placeholder="The Campus Life"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campus_life_video">YouTube Video URL</Label>
                  <Input
                    id="campus_life_video"
                    value={campusLifeSettings.video_url}
                    onChange={(e) => setCampusLifeSettings({ ...campusLifeSettings, video_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste the full YouTube video URL. When set, a play button will appear on the image to open the video modal.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campus_life_desc">Description Paragraph 1</Label>
                  <Textarea
                    id="campus_life_desc"
                    value={campusLifeSettings.description}
                    onChange={(e) => setCampusLifeSettings({ ...campusLifeSettings, description: e.target.value })}
                    rows={5}
                    placeholder="First paragraph about campus life..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campus_life_desc2">Description Paragraph 2</Label>
                  <Textarea
                    id="campus_life_desc2"
                    value={campusLifeSettings.description_2}
                    onChange={(e) => setCampusLifeSettings({ ...campusLifeSettings, description_2: e.target.value })}
                    rows={4}
                    placeholder="Second paragraph about campus life..."
                  />
                </div>
                <Button onClick={handleSaveCampusLife} disabled={saveMutation.isPending} className="gap-2">
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Save className="w-4 h-4" />
                  Save Campus Life Settings
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
