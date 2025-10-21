import { useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import InstagramTestimonials from "../components/InstagramTestimonials";
import ConsortiumButtons from "../components/ConsortiumButtons";
import HowItWorks from "../components/HowItWorks";
import NewConsortiumSimulationForm from "../components/NewConsortiumSimulationForm";
import InstagramHighlights from "../components/InstagramHighlights";
import MissionVisionValues from "../components/MissionVisionValues";
import ComplaintsForm from "../components/ComplaintsForm";
import TrabalheConosco from "../components/TrabalheConosco";
import JobApplication from "../components/JobApplication";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import WhatsAppFloat from "../components/WhatsAppFloat";
import { ConsortiumCategory } from "@shared/consortiumTypes";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<ConsortiumCategory | undefined>();

  const handleCategorySelect = (category: ConsortiumCategory) => {
    setSelectedCategory(category);
  };

  return (
    <div className="font-sans bg-white">
      <Header />
      <Hero />
      <InstagramTestimonials />
      <ConsortiumButtons onCategorySelect={handleCategorySelect} />
      <HowItWorks />
      <NewConsortiumSimulationForm preSelectedCategory={selectedCategory} />
      <InstagramHighlights />
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
