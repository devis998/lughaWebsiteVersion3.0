import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Categories from './components/Categories';
import HowItWorks from './components/HowItWorks';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Comparisons from './components/Comparisons';
import Contact from './components/Contact';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <Categories />
      <HowItWorks />
      <About />
      <Testimonials />
      <Comparisons />
      <Contact />
      <CTA />
      <Footer />
    </div>
  );
}

export default App;
