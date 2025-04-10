
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import FeaturedJobs from "@/components/FeaturedJobs";
import FeaturedCompanies from "@/components/FeaturedCompanies";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <FeaturedCategories />
        <FeaturedJobs />
        <FeaturedCompanies />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
