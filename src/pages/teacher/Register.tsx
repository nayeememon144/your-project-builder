import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  BookOpen, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  AlertCircle,
  User,
  IdCard,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

const registerSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  employeeId: z.string().min(4, 'Employee ID must be at least 4 characters'),
  designation: z.string().min(2, 'Designation is required'),
  departmentId: z.string().min(1, 'Department is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

interface Department {
  id: string;
  name: string;
}

const TeacherRegister = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const { data } = await supabase
        .from('departments')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
      
      if (data) {
        setDepartments(data);
      }
    };
    fetchDepartments();
  }, []);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: signUpError } = await signUp(data.email, data.password, data.fullName, 'teacher');

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('This email is already registered. Please login instead.');
        } else {
          setError(signUpError.message);
        }
        return;
      }

      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/teacher/login');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-accent/95 to-accent/90 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-2">
              {/* Logo */}
              <div className="w-20 h-20 mx-auto mb-4 bg-accent rounded-full flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="font-display text-2xl">Teacher Registration</CardTitle>
              <CardDescription>
                Create your faculty account to access the portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10"
                      {...register('fullName')}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-sm text-destructive">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="employeeId"
                        type="text"
                        placeholder="e.g., T-001"
                        className="pl-10"
                        {...register('employeeId')}
                      />
                    </div>
                    {errors.employeeId && (
                      <p className="text-sm text-destructive">{errors.employeeId.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      type="text"
                      placeholder="e.g., Professor"
                      {...register('designation')}
                    />
                    {errors.designation && (
                      <p className="text-sm text-destructive">{errors.designation.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departmentId">Department</Label>
                  <Select onValueChange={(value) => setValue('departmentId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.departmentId && (
                    <p className="text-sm text-destructive">{errors.departmentId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="teacher@sstu.ac.bd"
                      className="pl-10"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      {...register('confirmPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-accent hover:bg-accent/90"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>
                  Already have an account?{' '}
                  <Link to="/teacher/login" className="text-accent hover:underline font-medium">
                    Sign In
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Other Portal Links */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm mb-4">Other Portals</p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/admin/login"
              className="text-white/80 hover:text-gold text-sm transition-colors"
            >
              Admin Portal
            </Link>
            <span className="text-white/40">|</span>
            <Link 
              to="/student/login"
              className="text-white/80 hover:text-gold text-sm transition-colors"
            >
              Student Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegister;
