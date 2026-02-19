import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InfiniteGallery from './components/InfiniteGallery';
import SalesSection from './components/SalesSection';
import DraggableComparison from './components/DraggableComparison';
import SpaExperience from './components/SpaExperience';
import SpaIndications from './components/SpaIndications';
import SpaCTA from './components/SpaCTA';
import GeminiPetNamer from './components/GeminiPetNamer';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#E6E6FA] text-gray-900 font-sans selection:bg-purple-200 selection:text-purple-900">
      <Navbar />
      <Hero />
      <InfiniteGallery />
      <div id="spa-section" className="space-y-0">
        <DraggableComparison />
        <SpaExperience />
        <SpaIndications />
        <SpaCTA />
      </div>
      <SalesSection />
      <GeminiPetNamer />
      <div className="bg-white">
        <FAQ />
      </div>
      <Footer />
    </div>
  );
};

export default App;