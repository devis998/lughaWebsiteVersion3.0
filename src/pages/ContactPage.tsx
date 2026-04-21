import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-28">
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
