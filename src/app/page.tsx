import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { LogoWall } from '@/components/landing/LogoWall';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Footer } from '@/components/landing/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Match My Sponsor - AI-Powered Event Sponsorship Platform',
  description: 'Connect event organizers with sponsors through AI-powered matching. Find perfect sponsorship opportunities for hackathons, conferences, sports events, and cultural festivals. 100% free platform.',
  keywords: ['event sponsorship', 'sponsor matching', 'hackathon sponsors', 'conference sponsorship', 'AI matching', 'event funding', 'startup events'],
  openGraph: {
    title: 'Match My Sponsor - AI-Powered Event Sponsorship Platform',
    description: 'Connect event organizers with sponsors through AI-powered matching. 100% free platform for hackathons, conferences, and events.',
    type: 'website',
    url: 'https://matchmysponsor.com',
  },
};
export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100">
      {/* Critical above-fold content first */}
      <section className="above-fold hero-section">
        <Hero />
      </section>
      

      
      {/* Below-fold content */}
      <div className="critical-resource">
        <section aria-label="Features">
          <Features />
        </section>
        <section aria-label="How it works">
          <HowItWorks />
        </section>
        <section aria-label="Trusted by">
          <LogoWall />
        </section>
        <section aria-label="Get started">
          <FinalCTA />
        </section>
        <footer>
          <Footer />
        </footer>
      </div>
    </main>
  );
}
