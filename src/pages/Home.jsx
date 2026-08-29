import { LanguageProvider } from "@/components/heaven/LanguageProvider";
import Nav from "@/components/heaven/Nav";
import Hero from "@/components/heaven/Hero";
import BrandIntro from "@/components/heaven/BrandIntro";
import WhyChoose from "@/components/heaven/WhyChoose";
import Collections from "@/components/heaven/Collections";
import Showroom from "@/components/heaven/Showroom";
import Bespoke from "@/components/heaven/Bespoke";
import CraftJourney from "@/components/heaven/CraftJourney";
import Configurator from "@/components/heaven/Configurator";
import Founder from "@/components/heaven/Founder";
import SocialProof from "@/components/heaven/SocialProof";
import Finale from "@/components/heaven/Finale";
import Footer from "@/components/heaven/Footer";
import CursorView from "@/components/heaven/CursorView";
import FloatingWhatsApp from "@/components/heaven/FloatingWhatsApp";

export default function Home() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-bone text-ink font-body">
        <CursorView />
        <Nav />
        <FloatingWhatsApp />
        <main>
          <Hero />
          <BrandIntro />
          <WhyChoose />
          <Collections />
          <CraftJourney />
          <Showroom />
          <Bespoke />
          <Configurator />
          <Founder />
          <SocialProof />
          <Finale />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}