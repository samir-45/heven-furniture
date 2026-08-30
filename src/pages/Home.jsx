import Nav from "@/components/heaven/Nav";
import Hero from "@/components/heaven/Hero";
import BrandIntro from "@/components/heaven/BrandIntro";
import WhyChoose from "@/components/heaven/WhyChoose";
import Collections from "@/components/heaven/Collections";
import BeforeAfter from "@/components/heaven/BeforeAfter";
import CraftJourney from "@/components/heaven/CraftJourney";
import Showroom from "@/components/heaven/Showroom";
import Bespoke from "@/components/heaven/Bespoke";
import Configurator from "@/components/heaven/Configurator";
import Founder from "@/components/heaven/Founder";
import SocialProof from "@/components/heaven/SocialProof";
import Finale from "@/components/heaven/Finale";
import Footer from "@/components/heaven/Footer";
import CursorView from "@/components/heaven/CursorView";
import FloatingWhatsApp from "@/components/heaven/FloatingWhatsApp";
import ConsultationDrawer from "@/components/heaven/ConsultationDrawer";

export default function Home() {
  return (
    <div className="min-h-screen bg-bone text-ink font-body">
      <CursorView />
      <Nav />
      <FloatingWhatsApp />
      <ConsultationDrawer />
      <main>
        <Hero />
        <BrandIntro />
        <WhyChoose />
        <Collections />
        <BeforeAfter />
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
  );
}