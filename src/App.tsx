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
import AdminHeroSlides from "./pages/admin/HeroSlidesManagement";
import AdminNoticeCategories from "./pages/admin/NoticeCategoriesManagement";
import AdminGallery from "./pages/admin/GalleryManagement";
import AdminTeachers from "./pages/admin/TeachersManagement";
import AdminEvents from "./pages/admin/EventsManagement";
import AdminQuickStats from "./pages/admin/QuickStatsManagement";
import AdminPrograms from "./pages/admin/ProgramsManagement";
import AdminSiteSettings from "./pages/admin/SiteSettingsManagement";
import AdminFacilities from "./pages/admin/FacilitiesManagement";
import AdminStudents from "./pages/admin/StudentsManagement";
import AdminResearch from "./pages/admin/ResearchManagement";
import AdminAcademicCalendar from "./pages/admin/AcademicCalendarManagement";
import AdminHalls from "./pages/admin/HallsManagement";
import TeacherLogin from "./pages/teacher/Login";
import TeacherRegister from "./pages/teacher/Register";
import TeacherDashboard from "./pages/teacher/Dashboard";
import StudentLogin from "./pages/student/Login";
import StudentRegister from "./pages/student/Register";
import StudentDashboard from "./pages/student/Dashboard";
import NoticesPage from "./pages/Notices";
import NoticeDetailPage from "./pages/NoticeDetail";
import TeacherProfile from "./pages/TeacherProfile";
import Teachers from "./pages/Teachers";
import About from "./pages/About";
import AtAGlance from "./pages/about/AtAGlance";
import SSTUAct from "./pages/about/SSTUAct";
import Organogram from "./pages/about/Organogram";
import Bulletin from "./pages/about/Bulletin";
import Monogram from "./pages/about/Monogram";
import CampusMap from "./pages/about/CampusMap";
import CampusLife from "./pages/CampusLife";
import Academic from "./pages/Academic";
import AcademicCalendar from "./pages/AcademicCalendar";
import Admission from "./pages/Admission";
import Research from "./pages/Research";
import Departments from "./pages/Departments";
import DepartmentDetail from "./pages/DepartmentDetail";
import Faculties from "./pages/Faculties";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import ProgramDetail from "./pages/ProgramDetail";
import Events from "./pages/Events";
import Install from "./pages/Install";
import DSW from "./pages/facilities/DSW";
import Halls from "./pages/facilities/Halls";
import Organizations from "./pages/facilities/Organizations";
import EResources from "./pages/facilities/EResources";
import Library from "./pages/facilities/Library";
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
          <Route path="/about/at-a-glance" element={<AtAGlance />} />
          <Route path="/about/act" element={<SSTUAct />} />
          <Route path="/about/organogram" element={<Organogram />} />
          <Route path="/about/bulletin" element={<Bulletin />} />
          <Route path="/about/monogram" element={<Monogram />} />
          <Route path="/about/campus-map" element={<CampusMap />} />
          <Route path="/campus-life" element={<CampusLife />} />
          <Route path="/academic" element={<Academic />} />
          <Route path="/academic/calendar" element={<AcademicCalendar />} />
          <Route path="/academic/*" element={<Academic />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/admission/*" element={<Admission />} />
          <Route path="/research" element={<Research />} />
          <Route path="/research/*" element={<Research />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/departments/:slug" element={<DepartmentDetail />} />
          <Route path="/faculties" element={<Faculties />} />
          <Route path="/faculties/*" element={<Faculties />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/programs/:id" element={<ProgramDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/install" element={<Install />} />
          
          {/* Facilities Routes */}
          <Route path="/facilities/dsw" element={<DSW />} />
          <Route path="/facilities/halls" element={<Halls />} />
          <Route path="/facilities/organizations" element={<Organizations />} />
          <Route path="/facilities/e-resources" element={<EResources />} />
          <Route path="/facilities/e-resources/*" element={<EResources />} />
          <Route path="/facilities/library" element={<Library />} />
          <Route path="/facilities/*" element={<About />} />
          
          <Route path="/faq" element={<About />} />
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
          <Route 
            path="/admin/hero-slides" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminHeroSlides />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/notice-categories" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminNoticeCategories />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/gallery" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminGallery />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/teachers" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminTeachers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/events" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminEvents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/quick-stats" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminQuickStats />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/programs" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPrograms />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminSiteSettings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/facilities" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminFacilities />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/students" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminStudents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/research" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminResearch />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/academic-calendar" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminAcademicCalendar />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/halls" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminHalls />
              </ProtectedRoute>
            } 
          />
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* Public Teacher Pages */}
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teachers/:id" element={<TeacherProfile />} />
          
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
