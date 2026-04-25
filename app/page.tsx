import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Capabilities from '@/components/sections/Capabilities';
import Locations from '@/components/sections/Locations';
import Culture from '@/components/sections/Culture';
import Careers from '@/components/sections/Careers';
import CareersFAQ from '@/components/sections/CareersFAQ';
import News from '@/components/sections/News';
import ESG from '@/components/sections/ESG';
import Contact from '@/components/sections/Contact';
import Stats from '@/components/sections/Stats';
import Leadership from '@/components/sections/Leadership';
import Awards from '@/components/sections/Awards';
import Gallery from '@/components/sections/Gallery';

export default function Home() {
  return (
    <div id="top">
      <Hero />
      <Stats />
      <About />
      <Capabilities />
      <Locations />
      <Culture />
      <Gallery />
      <Leadership />
      <Awards />
      <Careers />
      <CareersFAQ />
      <News />
      <ESG />
      <Contact />
    </div>
  );
}
