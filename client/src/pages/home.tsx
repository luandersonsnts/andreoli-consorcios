import { useEffect } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import InstagramTestimonials from "../components/InstagramTestimonials";
import ConsortiumButtons from "../components/ConsortiumButtons";
import HowItWorks from "../components/HowItWorks";
import { UnifiedConsortiumSimulator } from "../components/UnifiedConsortiumSimulator";
import MissionVisionValues from "../components/MissionVisionValues";
import ComplaintsForm from "../components/ComplaintsForm";
import TrabalheConosco from "../components/TrabalheConosco";
import JobApplication from "../components/JobApplication";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import WhatsAppFloat from "../components/WhatsAppFloat";

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { pathname, search, hash } = window.location;
      if (pathname === '/' && (search.includes('tipo=') || search.includes('categoria='))) {
        const newUrl = pathname + (hash || '');
        window.history.replaceState(null, '', newUrl);
      }
    }
  }, []);
  return (
    <div className="font-sans bg-white">
      <Header />
      <Hero />
      <InstagramTestimonials />
      <ConsortiumButtons />
      <HowItWorks />
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <UnifiedConsortiumSimulator />
          </div>
        </div>
      </div>
      <MissionVisionValues />
      <ComplaintsForm />
      <TrabalheConosco />
      <JobApplication />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
