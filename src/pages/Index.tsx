import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/home/HeroSection';
import { QuickIconsBar } from '@/components/home/QuickIconsBar';
import { AtAGlanceSection } from '@/components/home/AtAGlanceSection';
import { VCMessageSection } from '@/components/home/VCMessageSection';
import { NoticesSection } from '@/components/home/NoticesSection';
import { NewsCarouselSection } from '@/components/home/NewsCarouselSection';
import { StudentFacilitiesSection } from '@/components/home/StudentFacilitiesSection';
import { StatsSection } from '@/components/home/StatsSection';
import { CampusLifeSection } from '@/components/home/CampusLifeSection';

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <QuickIconsBar />
      <AtAGlanceSection />
      <VCMessageSection />
      <NoticesSection />
      <NewsCarouselSection />
      <StudentFacilitiesSection />
      <StatsSection />
      <CampusLifeSection />
    </MainLayout>
  );
};

export default Index;
