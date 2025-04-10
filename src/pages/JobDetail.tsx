
import { useParams } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Calendar,
  Users,
  GraduationCap,
  Check,
  Bookmark,
  Share2,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Mock job data
const jobData = {
  id: "1",
  title: "Senior Frontend Developer",
  company: "TechCorp",
  logo: "https://randomuser.me/api/portraits/men/1.jpg",
  location: "San Francisco, CA",
  jobType: "Full-time",
  salary: "$120k - $150k",
  postedTime: "2 days ago",
  deadline: "30 days remaining",
  companySize: "1,000-5,000 employees",
  experienceRequired: "5+ years",
  education: "Bachelor's degree",
  isFeatured: true,
  description: `
    <p class="mb-4">We are looking for a skilled Senior Frontend Developer to join our dynamic team at TechCorp. As a Senior Frontend Developer, you will be responsible for implementing visual elements and user interactions that users see and interact with in a web application.</p>
    
    <p class="mb-4">You'll be working with our design and backend teams to build robust and scalable frontend applications. The ideal candidate is passionate about building user-friendly interfaces and has a strong understanding of frontend development principles.</p>
    
    <h4 class="font-semibold text-lg mt-6 mb-3">Key Responsibilities:</h4>
    <ul class="list-disc list-inside space-y-2 mb-4">
      <li>Develop new user-facing features using React.js and modern frontend technologies</li>
      <li>Build reusable components and libraries for future use</li>
      <li>Translate designs and wireframes into high-quality code</li>
      <li>Optimize applications for maximum speed and scalability</li>
      <li>Collaborate with backend developers to integrate frontend and backend aspects</li>
      <li>Diagnose and fix bugs and performance bottlenecks</li>
      <li>Mentor junior developers and review their code</li>
    </ul>
    
    <h4 class="font-semibold text-lg mt-6 mb-3">Requirements:</h4>
    <ul class="list-disc list-inside space-y-2 mb-4">
      <li>5+ years experience in frontend development</li>
      <li>Proficiency in JavaScript, HTML, CSS</li>
      <li>Extensive experience with React.js and its core principles</li>
      <li>Experience with popular React workflows (Redux, Hooks)</li>
      <li>Familiarity with modern frontend build pipelines and tools</li>
      <li>Experience with code versioning tools like Git</li>
      <li>Good understanding of asynchronous request handling and partial page updates</li>
      <li>Basic knowledge of UI/UX design principles</li>
    </ul>
    
    <h4 class="font-semibold text-lg mt-6 mb-3">Preferred Skills:</h4>
    <ul class="list-disc list-inside space-y-2 mb-4">
      <li>Experience with TypeScript</li>
      <li>Familiarity with server-side rendering</li>
      <li>Understanding of accessibility standards</li>
      <li>Experience with testing frameworks such as Jest</li>
      <li>Knowledge of CI/CD practices</li>
    </ul>
    
    <h4 class="font-semibold text-lg mt-6 mb-3">Benefits:</h4>
    <ul class="list-disc list-inside space-y-2">
      <li>Competitive salary and equity package</li>
      <li>Health, dental, and vision insurance</li>
      <li>401(k) matching</li>
      <li>Flexible work schedule and remote work options</li>
      <li>Professional development stipend</li>
      <li>Company-wide retreats</li>
      <li>Paid time off and holidays</li>
    </ul>
  `,
  companyDescription: `
    <p class="mb-4">TechCorp is a leading technology company specializing in cloud-based solutions for businesses of all sizes. Founded in 2010, we've grown to over 3,000 employees across 12 global offices.</p>
    
    <p class="mb-4">We're passionate about creating innovative products that help our clients streamline their operations and achieve their business goals. Our platform processes over 10 million transactions daily for customers in 40+ countries.</p>
    
    <p class="mb-4">At TechCorp, we believe in fostering a collaborative and inclusive environment where diverse ideas are valued and innovation thrives. We're dedicated to providing our team members with the resources and support they need to grow their careers while making a meaningful impact.</p>
    
    <h4 class="font-semibold text-lg mt-6 mb-3">Our Core Values:</h4>
    <ul class="list-disc list-inside space-y-2">
      <li>Innovation: We're constantly exploring new ideas and approaches.</li>
      <li>Collaboration: We work together across teams to achieve common goals.</li>
      <li>Excellence: We strive for the highest quality in everything we do.</li>
      <li>Customer Focus: We put our customers at the center of all decisions.</li>
      <li>Diversity: We embrace diverse perspectives and backgrounds.</li>
    </ul>
  `,
};

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-job-blue/10 py-8">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="h-16 w-16 rounded-md bg-gray-100 p-3 shrink-0">
                  <img src={jobData.logo} alt={`${jobData.company} logo`} className="h-full w-full object-contain" />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{jobData.title}</h1>
                      <p className="text-lg text-job-blue">{jobData.company}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Bookmark size={18} />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Share2 size={18} />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Flag size={18} />
                      </Button>
                      <Button className="bg-job-blue hover:bg-job-purple">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin size={18} className="mr-2 text-gray-400" />
                      <span>{jobData.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Briefcase size={18} className="mr-2 text-gray-400" />
                      <span>{jobData.jobType}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign size={18} className="mr-2 text-gray-400" />
                      <span>{jobData.salary}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock size={18} className="mr-2 text-gray-400" />
                      <span>Posted {jobData.postedTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="description">
                <TabsList className="mb-6">
                  <TabsTrigger value="description">Job Description</TabsTrigger>
                  <TabsTrigger value="company">Company</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="bg-white rounded-lg border border-gray-200 p-6">
                  <div dangerouslySetInnerHTML={{ __html: jobData.description }} />
                </TabsContent>
                
                <TabsContent value="company" className="bg-white rounded-lg border border-gray-200 p-6">
                  <div dangerouslySetInnerHTML={{ __html: jobData.companyDescription }} />
                </TabsContent>
              </Tabs>
              
              <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Apply for this position</h3>
                <form>
                  <div className="mb-8">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <p className="text-gray-600 mb-2">Upload your resume/CV</p>
                      <p className="text-sm text-gray-500 mb-4">PDF, DOCX, TXT (Max 5MB)</p>
                      <Button variant="outline" className="border-job-blue text-job-blue hover:bg-job-blue hover:text-white">
                        Upload File
                      </Button>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-job-blue hover:bg-job-purple">
                    Apply Now
                  </Button>
                </form>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Overview</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar size={18} className="mr-3 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Deadline</p>
                      <p className="text-gray-700">{jobData.deadline}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users size={18} className="mr-3 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Company Size</p>
                      <p className="text-gray-700">{jobData.companySize}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Briefcase size={18} className="mr-3 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="text-gray-700">{jobData.experienceRequired}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <GraduationCap size={18} className="mr-3 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Education</p>
                      <p className="text-gray-700">{jobData.education}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Skills</h3>
                  
                  <div className="space-y-2">
                    {['React.js', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Redux'].map((skill) => (
                      <div key={skill} className="flex items-center">
                        <Check size={16} className="mr-2 text-green-500" />
                        <span className="text-gray-700">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Soft Skills</h3>
                  
                  <div className="space-y-2">
                    {['Communication', 'Problem Solving', 'Team Collaboration', 'Mentorship', 'Time Management'].map((skill) => (
                      <div key={skill} className="flex items-center">
                        <Check size={16} className="mr-2 text-green-500" />
                        <span className="text-gray-700">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JobDetail;
