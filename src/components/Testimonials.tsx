
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface TestimonialProps {
  id: number;
  name: string;
  position: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
}

const testimonialsData: TestimonialProps[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    position: "Software Engineer",
    company: "TechCorp",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    content:
      "TalentConnect helped me find my dream job within just 2 weeks of signing up! The platform is intuitive, and the job matching algorithm is incredibly accurate. I'm now working at a company that aligns perfectly with my skills and career goals.",
  },
  {
    id: 2,
    name: "Michael Chen",
    position: "Product Manager",
    company: "InnovateSoft",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    content:
      "After months of searching on other platforms, I found the perfect position through TalentConnect. The detailed job descriptions and company insights helped me make informed decisions. The application process was smooth and efficient.",
  },
  {
    id: 3,
    name: "Jessica Williams",
    position: "Marketing Director",
    company: "GrowthCo",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    rating: 4,
    content:
      "As someone who was looking to transition to a new industry, TalentConnect provided valuable resources and job recommendations that matched my transferable skills. The career advice section was particularly helpful in preparing for interviews.",
  },
];

const TestimonialCard = ({ name, position, company, avatar, rating, content }: TestimonialProps) => {
  return (
    <div className="bg-card text-card-foreground rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-start space-x-4">
        <div className="h-12 w-12 rounded-full overflow-hidden">
          <img src={avatar} alt={name} className="h-full w-full object-cover" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">{name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {position} at {company}
          </p>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}
                fill="currentColor"
              />
            ))}
          </div>
        </div>
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-300 italic">{content}</p>
    </div>
  );
};

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonialsData.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonialsData.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="py-16 bg-gradient-to-r from-job-blue to-job-purple relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Hear from the job seekers who found their perfect career match with us
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialsData.map((testimonial) => (
              <TestimonialCard key={testimonial.id} {...testimonial} />
            ))}
          </div>

          <div className="flex justify-center mt-10 space-x-4">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
