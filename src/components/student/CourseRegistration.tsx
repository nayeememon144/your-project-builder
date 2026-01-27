import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Clock, Users, AlertCircle, CheckCircle } from 'lucide-react';

type AvailableCourse = {
  code: string;
  name: string;
  credits: number;
  instructor: string;
  schedule: string;
  seats: number;
  enrolled: number;
  prerequisite?: string;
};

const availableCourses: AvailableCourse[] = [
  { code: 'CSE-401', name: 'Artificial Intelligence', credits: 3, instructor: 'Dr. Rahman', schedule: 'Sun-Tue 10:00 AM', seats: 40, enrolled: 35, prerequisite: 'CSE-301' },
  { code: 'CSE-403', name: 'Computer Networks', credits: 3, instructor: 'Dr. Ahmed', schedule: 'Mon-Wed 2:00 PM', seats: 45, enrolled: 42 },
  { code: 'CSE-405', name: 'Machine Learning', credits: 3, instructor: 'Dr. Karim', schedule: 'Tue-Thu 11:00 AM', seats: 35, enrolled: 30, prerequisite: 'MATH-201' },
  { code: 'MATH-301', name: 'Numerical Analysis', credits: 3, instructor: 'Prof. Hasan', schedule: 'Sun-Tue 9:00 AM', seats: 50, enrolled: 25 },
  { code: 'CSE-407', name: 'Web Development', credits: 3, instructor: 'Dr. Islam', schedule: 'Wed-Thu 3:00 PM', seats: 40, enrolled: 38 },
];

const registeredCourses = ['CSE-401', 'CSE-403'];

export const CourseRegistration = () => {
  const { toast } = useToast();
  const [selectedCourses, setSelectedCourses] = useState<string[]>(registeredCourses);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalCredits = selectedCourses.reduce((sum, code) => {
    const course = availableCourses.find(c => c.code === code);
    return sum + (course?.credits || 0);
  }, 0);

  const handleCourseToggle = (code: string) => {
    setSelectedCourses(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const handleSubmit = async () => {
    if (totalCredits > 18) {
      toast({
        title: 'Credit limit exceeded',
        description: 'Maximum 18 credits allowed per semester',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    
    toast({
      title: 'Registration Submitted',
      description: 'Your course registration has been submitted for approval.',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <CardTitle>Course Registration - Spring 2024</CardTitle>
              <CardDescription>Registration Period: Jan 15 - Jan 25, 2024</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Selected Credits</p>
                <p className={`text-2xl font-bold ${totalCredits > 18 ? 'text-destructive' : 'text-primary'}`}>
                  {totalCredits} / 18
                </p>
              </div>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || selectedCourses.length === 0}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {totalCredits > 18 && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-sm text-destructive">Credit limit exceeded. Maximum 18 credits per semester.</p>
            </div>
          )}
          
          <div className="space-y-3">
            {availableCourses.map((course) => {
              const isSelected = selectedCourses.includes(course.code);
              const isFull = course.enrolled >= course.seats;
              const availableSeats = course.seats - course.enrolled;
              
              return (
                <div 
                  key={course.code}
                  className={`border rounded-lg p-4 transition-colors ${
                    isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  } ${isFull && !isSelected ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => !isFull && handleCourseToggle(course.code)}
                      disabled={isFull && !isSelected}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-semibold">{course.name}</h4>
                        <Badge variant="outline">{course.code}</Badge>
                        <Badge variant="secondary">{course.credits} Credits</Badge>
                        {isSelected && (
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Selected
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {course.instructor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.schedule}
                        </span>
                        <span className={`flex items-center gap-1 ${isFull ? 'text-destructive' : ''}`}>
                          <Users className="w-4 h-4" />
                          {availableSeats} seats available
                        </span>
                      </div>
                      {course.prerequisite && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Prerequisite: {course.prerequisite}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registration Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold text-primary">{selectedCourses.length}</p>
              <p className="text-sm text-muted-foreground">Courses Selected</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold text-primary">{totalCredits}</p>
              <p className="text-sm text-muted-foreground">Total Credits</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold text-gold">৳{(totalCredits * 3500).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Estimated Tuition</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
