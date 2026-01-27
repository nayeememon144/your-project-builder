import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Eye,
  Pin,
  Calendar,
  Upload,
  FileText,
  X
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
import { format } from 'date-fns';

interface Attachment {
  name: string;
  url: string;
  type: string;
}

interface Notice {
  id: string;
  title: string;
  title_bn: string | null;
  description: string;
  description_bn: string | null;
  status: 'draft' | 'pending' | 'published' | 'archived';
  is_pinned: boolean;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
  views: number;
  category_id: string | null;
  attachments: Attachment[] | null;
}

interface NoticeCategory {
  id: string;
  name: string;
  slug: string;
}

const NoticesManagement = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [categories, setCategories] = useState<NoticeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    title_bn: '',
    description: '',
    description_bn: '',
    status: 'draft' as 'draft' | 'pending' | 'published' | 'archived',
    is_pinned: false,
    is_featured: false,
    category_id: '',
    attachments: [] as Attachment[],
  });

  useEffect(() => {
    fetchNotices();
    fetchCategories();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch notices');
    } else {
      // Cast the data to match our Notice interface
      const typedData = (data || []).map(notice => ({
        ...notice,
        attachments: notice.attachments as unknown as Attachment[] | null,
      })) as Notice[];
      setNotices(typedData);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('notice_categories')
      .select('id, name, slug')
      .eq('is_active', true);
    
    if (data) {
      setCategories(data);
    }
  };

  const uploadFile = async (file: File): Promise<Attachment> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `notice-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `notices/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('attachments').getPublicUrl(filePath);
    return {
      name: file.name,
      url: data.publicUrl,
      type: file.type,
    };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newAttachments: Attachment[] = [];
      for (const file of Array.from(files)) {
        const attachment = await uploadFile(file);
        newAttachments.push(attachment);
      }
      setFormData({
        ...formData,
        attachments: [...formData.attachments, ...newAttachments],
      });
      toast.success('Files uploaded successfully');
    } catch (error: any) {
      toast.error('Failed to upload file: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (index: number) => {
    const updated = [...formData.attachments];
    updated.splice(index, 1);
    setFormData({ ...formData, attachments: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const noticeData = {
      title: formData.title,
      title_bn: formData.title_bn || null,
      description: formData.description,
      description_bn: formData.description_bn || null,
      status: formData.status,
      is_pinned: formData.is_pinned,
      is_featured: formData.is_featured,
      category_id: formData.category_id || null,
      attachments: formData.attachments.length > 0 ? JSON.parse(JSON.stringify(formData.attachments)) : null,
      published_at: formData.status === 'published' ? new Date().toISOString() : null,
    };

    if (editingNotice) {
      const { error } = await supabase
        .from('notices')
        .update(noticeData)
        .eq('id', editingNotice.id);

      if (error) {
        toast.error('Failed to update notice');
      } else {
        toast.success('Notice updated successfully');
        setIsDialogOpen(false);
        fetchNotices();
      }
    } else {
      const { error } = await supabase
        .from('notices')
        .insert([noticeData]);

      if (error) {
        toast.error('Failed to create notice');
      } else {
        toast.success('Notice created successfully');
        setIsDialogOpen(false);
        fetchNotices();
      }
    }
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    
    const { error } = await supabase
      .from('notices')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete notice');
    } else {
      toast.success('Notice deleted successfully');
      fetchNotices();
    }
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    const attachments = notice.attachments 
      ? (Array.isArray(notice.attachments) ? notice.attachments : [])
      : [];
    setFormData({
      title: notice.title,
      title_bn: notice.title_bn || '',
      description: notice.description,
      description_bn: notice.description_bn || '',
      status: notice.status,
      is_pinned: notice.is_pinned,
      is_featured: notice.is_featured,
      category_id: notice.category_id || '',
      attachments: attachments as Attachment[],
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingNotice(null);
    setFormData({
      title: '',
      title_bn: '',
      description: '',
      description_bn: '',
      status: 'draft',
      is_pinned: false,
      is_featured: false,
      category_id: '',
      attachments: [],
    });
  };

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      published: 'default',
      draft: 'secondary',
      pending: 'outline',
      archived: 'destructive',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold">Notices Management</h1>
            <p className="text-muted-foreground">Create and manage university notices</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingNotice ? 'Edit Notice' : 'Create New Notice'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title (English)</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title_bn">Title (Bengali)</Label>
                    <Input
                      id="title_bn"
                      value={formData.title_bn}
                      onChange={(e) => setFormData({ ...formData, title_bn: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (English)</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_bn">Description (Bengali)</Label>
                  <Textarea
                    id="description_bn"
                    rows={4}
                    value={formData.description_bn}
                    onChange={(e) => setFormData({ ...formData, description_bn: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'draft' | 'pending' | 'published' | 'archived') => 
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_pinned"
                      checked={formData.is_pinned}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_pinned: checked })}
                    />
                    <Label htmlFor="is_pinned">Pin Notice</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                    />
                    <Label htmlFor="is_featured">Featured</Label>
                  </div>
                </div>

                {/* File Attachments */}
                <div className="space-y-2">
                  <Label>Attachments (PDF, Documents)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      multiple
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                    {uploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
                  </div>
                  {formData.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {formData.attachments.map((attachment, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                              {attachment.name}
                            </a>
                          </div>
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeAttachment(idx)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingNotice ? 'Update' : 'Create'} Notice
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
            placeholder="Search notices..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Notices Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Title</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Views</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center p-8 text-muted-foreground">
                        Loading notices...
                      </td>
                    </tr>
                  ) : filteredNotices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center p-8 text-muted-foreground">
                        No notices found
                      </td>
                    </tr>
                  ) : (
                    filteredNotices.map((notice) => (
                      <tr key={notice.id} className="border-t">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {notice.is_pinned && <Pin className="w-4 h-4 text-primary" />}
                            <span className="font-medium">{notice.title}</span>
                          </div>
                        </td>
                        <td className="p-4">{getStatusBadge(notice.status)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Eye className="w-4 h-4" />
                            {notice.views || 0}
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(notice.created_at), 'MMM dd, yyyy')}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(notice)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleDelete(notice.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default NoticesManagement;
