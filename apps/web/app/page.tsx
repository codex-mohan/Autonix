import { LandingHero } from "@/components/landing/hero";
import { LandingFeatures } from "@/components/landing/features";
import { LandingFooter } from "@/components/landing/footer";
import { FloatingNav } from "@/components/floating-nav";
import { LandingContact } from "@/components/landing/contact";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingContact />
      </main>
      <LandingFooter />
    </div>
  );
}
