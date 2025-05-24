
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import FeaturedJobs from "@/components/FeaturedJobs";
import FeaturedCompanies from "@/components/FeaturedCompanies";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <div className="container mx-auto mt-8 mb-12 flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link to="/employer/dashboard">Employer Dashboard</Link>
          </Button>
          <Button asChild>
            <Link to="/user/dashboard">Candidate Dashboard</Link>
          </Button>
        </div>
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
