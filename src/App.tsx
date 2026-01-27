import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminNotices from "./pages/admin/NoticesManagement";
import AdminNews from "./pages/admin/NewsManagement";
import AdminFaculties from "./pages/admin/FacultiesManagement";
import AdminDepartments from "./pages/admin/DepartmentsManagement";
import TeacherLogin from "./pages/teacher/Login";
import TeacherRegister from "./pages/teacher/Register";
import TeacherDashboard from "./pages/teacher/Dashboard";
import StudentLogin from "./pages/student/Login";
import StudentRegister from "./pages/student/Register";
import StudentDashboard from "./pages/student/Dashboard";
import NoticesPage from "./pages/Notices";
import NoticeDetailPage from "./pages/NoticeDetail";
import About from "./pages/About";
import Academic from "./pages/Academic";
import Admission from "./pages/Admission";
import Research from "./pages/Research";
import Departments from "./pages/Departments";
import Faculties from "./pages/Faculties";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/notices/:id" element={<NoticeDetailPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/*" element={<About />} />
          <Route path="/academic" element={<Academic />} />
          <Route path="/academic/*" element={<Academic />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/admission/*" element={<Admission />} />
          <Route path="/research" element={<Research />} />
          <Route path="/research/*" element={<Research />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/departments/*" element={<Departments />} />
          <Route path="/faculties" element={<Faculties />} />
          <Route path="/faculties/*" element={<Faculties />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/events" element={<NoticesPage />} />
          <Route path="/downloads" element={<NoticesPage />} />
          <Route path="/faq" element={<About />} />
          <Route path="/facilities/*" element={<About />} />
          <Route path="/centers/*" element={<Research />} />
          <Route path="/institutes/*" element={<Academic />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/notices" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminNotices />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/news" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminNews />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/faculties" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminFaculties />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/departments" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDepartments />
              </ProtectedRoute>
            } 
          />
          <Route path="/admin/*" element={<AdminDashboard />} />
          
          {/* Teacher Routes */}
          <Route path="/teacher/login" element={<TeacherLogin />} />
          <Route path="/teacher/register" element={<TeacherRegister />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/*" element={<TeacherDashboard />} />
          
          {/* Student Routes */}
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/*" element={<StudentDashboard />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
