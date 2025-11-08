import Navigation from '@/components/shared/Navigation';
import Hero from '@/components/landing/Hero';
import ProjectAbstract from '@/components/landing/ProjectAbstract';
import HowItWorks from '@/components/landing/HowItWorks';
import Features from '@/components/landing/Features';
import TechnologyStack from '@/components/landing/TechnologyStack';
import TrustSecurity from '@/components/landing/TrustSecurity';
import TargetAudience from '@/components/landing/TargetAudience';
import TeamSection from '@/components/landing/TeamSection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen">
        <Hero />
        <ProjectAbstract />
        <HowItWorks />
        <Features />
        <TechnologyStack />
        <TrustSecurity />
        <TargetAudience />
        <TeamSection />
        <Footer />
      </div>
    </>
  );
}
