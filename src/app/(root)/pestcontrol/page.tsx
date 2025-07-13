
import Contact from "../pestcomponents/contact-us";
import Footer from "../pestcomponents/footer/footer";
import HeroSection from "../pestcomponents/hero-section";
import Navbar from "../pestcomponents/navbar/navbar";
import PestControlServices from "../pestcomponents/pest-control-services";
import WhyTrustHimalaya from "../pestcomponents/why-trust-himalaya";



export default function Page() {
  return (
    <main>
       <Navbar/>
      <HeroSection />
      <PestControlServices/>
      <WhyTrustHimalaya/>
      <Contact/>
      <Footer/>
    </main>
  )
}
