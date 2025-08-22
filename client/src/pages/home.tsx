import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import SimulationForm from "@/components/SimulationForm";
import Testimonials from "@/components/Testimonials";
import MissionVisionValues from "@/components/MissionVisionValues";
import ComplaintsForm from "@/components/ComplaintsForm";
import JobApplication from "@/components/JobApplication";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <div className="font-sans bg-white">
      <Header />
      <Hero />
      <HowItWorks />
      <section className="py-16 bg-firme-light-gray">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-firme-gray mb-4">
            Junte-se a quem tem o mesmo sonho que você.
          </h2>
          <h3 className="text-2xl font-bold text-firme-blue mb-8">
            Faça seus investimentos na Firme INVESTIMENTOS!
          </h3>
          
          <button 
            onClick={() => document.getElementById('contatos')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-firme-blue text-white px-8 py-3 rounded-full font-medium hover:bg-firme-blue-light transition-colors"
            data-testid="button-learn-more"
          >
            Quero saber mais detalhes
          </button>
          
          <div className="mt-12">
            <img 
              src="https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=600" 
              alt="Equipe de investimentos trabalhando com dados financeiros" 
              className="rounded-xl shadow-lg w-full h-auto max-w-4xl mx-auto"
            />
          </div>
        </div>
      </section>
      <SimulationForm />
      <Testimonials />
      <MissionVisionValues />
      <ComplaintsForm />
      <JobApplication />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
