import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, TrendingUp, Award, BookOpen } from 'lucide-react';

type SemesterResult = {
  semester: string;
  year: string;
  gpa: number;
  credits: number;
  courses: {
    code: string;
    name: string;
    credits: number;
    grade: string;
    gradePoint: number;
  }[];
};

const semesterResults: SemesterResult[] = [
  {
    semester: 'Fall',
    year: '2023',
    gpa: 3.75,
    credits: 15,
    courses: [
      { code: 'CSE-301', name: 'Database Systems', credits: 3, grade: 'A', gradePoint: 4.0 },
      { code: 'CSE-305', name: 'Software Engineering', credits: 3, grade: 'A-', gradePoint: 3.7 },
      { code: 'CSE-303', name: 'Operating Systems', credits: 3, grade: 'B+', gradePoint: 3.3 },
      { code: 'MATH-205', name: 'Linear Algebra', credits: 3, grade: 'A', gradePoint: 4.0 },
      { code: 'ENG-201', name: 'Technical Writing', credits: 3, grade: 'A-', gradePoint: 3.7 },
    ],
  },
  {
    semester: 'Spring',
    year: '2023',
    gpa: 3.65,
    credits: 15,
    courses: [
      { code: 'CSE-201', name: 'Data Structures', credits: 3, grade: 'A-', gradePoint: 3.7 },
      { code: 'CSE-203', name: 'Object Oriented Programming', credits: 3, grade: 'A', gradePoint: 4.0 },
      { code: 'MATH-201', name: 'Discrete Mathematics', credits: 3, grade: 'B+', gradePoint: 3.3 },
      { code: 'PHY-102', name: 'Physics II', credits: 3, grade: 'B+', gradePoint: 3.3 },
      { code: 'CSE-205', name: 'Digital Logic Design', credits: 3, grade: 'A-', gradePoint: 3.7 },
    ],
  },
  {
    semester: 'Fall',
    year: '2022',
    gpa: 3.55,
    credits: 15,
    courses: [
      { code: 'CSE-101', name: 'Introduction to Computer Science', credits: 3, grade: 'A', gradePoint: 4.0 },
      { code: 'CSE-103', name: 'Programming Fundamentals', credits: 3, grade: 'A-', gradePoint: 3.7 },
      { code: 'MATH-101', name: 'Calculus I', credits: 3, grade: 'B+', gradePoint: 3.3 },
      { code: 'PHY-101', name: 'Physics I', credits: 3, grade: 'B', gradePoint: 3.0 },
      { code: 'ENG-101', name: 'English Composition', credits: 3, grade: 'A-', gradePoint: 3.7 },
    ],
  },
];

const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return 'bg-green-500';
  if (grade.startsWith('B')) return 'bg-blue-500';
  if (grade.startsWith('C')) return 'bg-yellow-500';
  if (grade.startsWith('D')) return 'bg-orange-500';
  return 'bg-red-500';
};

export const ResultsView = () => {
  const [selectedSemester, setSelectedSemester] = useState('all');

  const totalCredits = semesterResults.reduce((sum, s) => sum + s.credits, 0);
  const cgpa = (semesterResults.reduce((sum, s) => sum + (s.gpa * s.credits), 0) / totalCredits).toFixed(2);

  const filteredResults = selectedSemester === 'all' 
    ? semesterResults 
    : semesterResults.filter(s => `${s.semester}-${s.year}` === selectedSemester);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-gold" />
            <p className="text-3xl font-bold text-primary">{cgpa}</p>
            <p className="text-sm text-muted-foreground">Cumulative GPA</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-3xl font-bold">{totalCredits}</p>
            <p className="text-sm text-muted-foreground">Credits Earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-3xl font-bold">{semesterResults.length}</p>
            <p className="text-sm text-muted-foreground">Semesters Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-3xl font-bold">{semesterResults[0].gpa.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Latest Semester GPA</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Download */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Academic Results</CardTitle>
          <div className="flex items-center gap-3">
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {semesterResults.map(s => (
                  <SelectItem key={`${s.semester}-${s.year}`} value={`${s.semester}-${s.year}`}>
                    {s.semester} {s.year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Transcript
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredResults.map((semester) => (
              <div key={`${semester.semester}-${semester.year}`} className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{semester.semester} {semester.year}</h3>
                    <p className="text-sm text-muted-foreground">{semester.credits} Credits</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Semester GPA</p>
                    <p className="text-2xl font-bold text-primary">{semester.gpa.toFixed(2)}</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-sm">Course Code</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Course Name</th>
                        <th className="text-center py-3 px-4 font-medium text-sm">Credits</th>
                        <th className="text-center py-3 px-4 font-medium text-sm">Grade</th>
                        <th className="text-center py-3 px-4 font-medium text-sm">Grade Point</th>
                      </tr>
                    </thead>
                    <tbody>
                      {semester.courses.map((course) => (
                        <tr key={course.code} className="border-t hover:bg-muted/30">
                          <td className="py-3 px-4 font-medium">{course.code}</td>
                          <td className="py-3 px-4">{course.name}</td>
                          <td className="py-3 px-4 text-center">{course.credits}</td>
                          <td className="py-3 px-4 text-center">
                            <Badge className={`${getGradeColor(course.grade)} text-white`}>
                              {course.grade}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-center font-medium">{course.gradePoint.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
