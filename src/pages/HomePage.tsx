import About from '../components/About';
import Categories from '../components/Categories';
import Comparisons from '../components/Comparisons';
import Contact from '../components/Contact';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Navigation from '../components/Navigation';
import OurTeam from '../components/OurTeam';
import Testimonials from '../components/Testimonials';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <Categories />
      <HowItWorks />
      <About />
      <Testimonials />
      <Comparisons />
      <OurTeam />
      <Contact />
      <CTA />
      <Footer />
    </div>
  );
}
