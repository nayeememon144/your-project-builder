import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Save, X, TrendingUp, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EditableStatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  change?: string;
  changeType?: 'positive' | 'negative';
  href: string;
  color: string;
  statKey: string; // Key to store in quick_stats table
  isEditable?: boolean;
}

export const EditableStatCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeType,
  color,
  statKey,
  isEditable = true,
}: EditableStatCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const saveMutation = useMutation({
    mutationFn: async (newValue: number) => {
      // Check if stat already exists
      const { data: existing } = await supabase
        .from('quick_stats')
        .select('id')
        .eq('label', statKey)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('quick_stats')
          .update({ value: newValue })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('quick_stats')
          .insert({
            label: statKey,
            value: newValue,
            is_active: true,
            display_order: getDisplayOrder(statKey),
            icon: getIconName(statKey),
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quick-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-quick-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      toast({ title: 'Stat updated successfully!' });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({ title: 'Error saving stat', description: String(error), variant: 'destructive' });
    },
  });

  const handleSave = () => {
    if (editValue < 0) {
      toast({ title: 'Error', description: 'Value cannot be negative', variant: 'destructive' });
      return;
    }
    saveMutation.mutate(editValue);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  value={editValue}
                  onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                  className="w-24 h-10 text-xl font-bold"
                  autoFocus
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={saveMutation.isPending}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-foreground">{value}</p>
                {isEditable && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditValue(value);
                      setIsEditing(true);
                    }}
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}

            {change && !isEditing && (
              <p className={`text-sm mt-1 ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="w-3 h-3 inline mr-1" />
                {change} from last month
              </p>
            )}
          </div>
          <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions
function getDisplayOrder(statKey: string): number {
  const orderMap: Record<string, number> = {
    'Students': 0,
    'Teachers': 1,
    'Departments': 2,
    'Faculties': 3,
    'Programs': 4,
    'Research': 5,
    'Graduates': 6,
    'Staffs': 7,
  };
  return orderMap[statKey] ?? 10;
}

function getIconName(statKey: string): string {
  const iconMap: Record<string, string> = {
    'Students': 'GraduationCap',
    'Teachers': 'Users',
    'Departments': 'Building2',
    'Faculties': 'Globe',
    'Programs': 'BookOpen',
    'Research': 'Award',
    'Graduates': 'Award',
    'Staffs': 'Users',
  };
  return iconMap[statKey] ?? 'Building2';
}
