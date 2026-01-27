import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/home/HeroSection';
import { QuickStatsSection } from '@/components/home/QuickStatsSection';
import { NoticesSection } from '@/components/home/NoticesSection';
import { VCMessageSection } from '@/components/home/VCMessageSection';
import { FacilitiesSection } from '@/components/home/FacilitiesSection';
import { NewsEventsSection } from '@/components/home/NewsEventsSection';
import { QuickLinksSection } from '@/components/home/QuickLinksSection';

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <QuickLinksSection />
      <QuickStatsSection />
      <NoticesSection />
      <VCMessageSection />
      <FacilitiesSection />
      <NewsEventsSection />
    </MainLayout>
  );
};

export default Index;
