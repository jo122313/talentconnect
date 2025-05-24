
import { useState } from "react";
import { Search, MapPin, Briefcase, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard, { JobProps } from "@/components/JobCard";

const jobsData: JobProps[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    logo: "https://randomuser.me/api/portraits/men/1.jpg",
    location: "San Francisco, CA",
    jobType: "Full-time",
    salary: "$120k - $150k",
    postedTime: "2 days ago",
    isFeatured: true,
  },
  {
    id: "2",
    title: "Product Manager",
    company: "InnovateSoft",
    logo: "https://randomuser.me/api/portraits/women/2.jpg",
    location: "New York, NY",
    jobType: "Full-time",
    salary: "$100k - $130k",
    postedTime: "1 day ago",
    isFeatured: true,
  },
  {
    id: "3",
    title: "DevOps Engineer",
    company: "CloudTech",
    logo: "https://randomuser.me/api/portraits/men/3.jpg",
    location: "Remote",
    jobType: "Full-time",
    salary: "$110k - $140k",
    postedTime: "3 days ago",
    isFeatured: true,
  },
  {
    id: "4",
    title: "UX/UI Designer",
    company: "DesignHub",
    logo: "https://randomuser.me/api/portraits/women/4.jpg",
    location: "Seattle, WA",
    jobType: "Full-time",
    salary: "$90k - $120k",
    postedTime: "Just now",
    isFeatured: true,
  },
  {
    id: "5",
    title: "Data Scientist",
    company: "DataWorks",
    logo: "https://randomuser.me/api/portraits/men/5.jpg",
    location: "Boston, MA",
    jobType: "Full-time",
    salary: "$130k - $160k",
    postedTime: "1 week ago",
    isFeatured: false,
  },
  {
    id: "6",
    title: "Marketing Manager",
    company: "GrowthCo",
    logo: "https://randomuser.me/api/portraits/women/6.jpg",
    location: "Chicago, IL",
    jobType: "Full-time",
    salary: "$85k - $110k",
    postedTime: "3 days ago",
    isFeatured: false,
  },
  {
    id: "7",
    title: "Backend Developer",
    company: "ServerTech",
    logo: "https://randomuser.me/api/portraits/men/7.jpg",
    location: "Austin, TX",
    jobType: "Full-time",
    salary: "$100k - $130k",
    postedTime: "4 days ago",
    isFeatured: false,
  },
  {
    id: "8",
    title: "Content Writer",
    company: "ContentCraft",
    logo: "https://randomuser.me/api/portraits/women/8.jpg",
    location: "Remote",
    jobType: "Part-time",
    salary: "$40k - $60k",
    postedTime: "1 week ago",
    isFeatured: false,
  },
];

const Jobs = () => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [salaryRange, setSalaryRange] = useState([40, 160]);
  
  const jobTypes = [
    { id: "full-time", label: "Full-time" },
    { id: "part-time", label: "Part-time" },
    { id: "contract", label: "Contract" },
    { id: "internship", label: "Internship" },
    { id: "remote", label: "Remote" },
  ];
  
  const experienceLevels = [
    { id: "entry", label: "Entry Level" },
    { id: "mid", label: "Mid Level" },
    { id: "senior", label: "Senior Level" },
    { id: "executive", label: "Executive" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    console.log({ keyword, location });
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Search Bar */}
        <div className="bg-job-blue">
          <div className="container mx-auto px-4 py-8">
            <form onSubmit={handleSearch} className="max-w-5xl mx-auto bg-white p-4 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="job-search-input pl-10"
                    placeholder="Job title, keywords, or company"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <MapPin size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="job-search-input pl-10"
                    placeholder="City or region"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div>
                  <Button type="submit" className="w-full bg-job-blue hover:bg-job-purple">
                    Search Jobs
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters - Desktop */}
            <div className="hidden lg:block w-64 shrink-0">
              <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-24">
                <h3 className="font-medium text-lg mb-4 text-gray-900">Filters</h3>

                <div className="space-y-6">
                  {/* Job Type */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Job Type</h4>
                    <div className="space-y-2">
                      {jobTypes.map((type) => (
                        <div key={type.id} className="flex items-center">
                          <Checkbox id={`type-${type.id}`} />
                          <label
                            htmlFor={`type-${type.id}`}
                            className="ml-2 text-sm text-gray-600"
                          >
                            {type.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Experience Level</h4>
                    <div className="space-y-2">
                      {experienceLevels.map((level) => (
                        <div key={level.id} className="flex items-center">
                          <Checkbox id={`level-${level.id}`} />
                          <label
                            htmlFor={`level-${level.id}`}
                            className="ml-2 text-sm text-gray-600"
                          >
                            {level.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Salary Range */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Salary Range ($K)</h4>
                    <Slider
                      defaultValue={[40, 160]}
                      max={200}
                      step={10}
                      value={salaryRange}
                      onValueChange={setSalaryRange}
                      className="my-4"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${salaryRange[0]}K</span>
                      <span>${salaryRange[1]}K</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>

            {/* Filter Button - Mobile */}
            <div className="lg:hidden mb-4">
              <Button
                onClick={toggleMobileFilter}
                variant="outline"
                className="flex items-center border-gray-300"
              >
                <Filter size={16} className="mr-2" />
                Filters
              </Button>
            </div>

            {/* Filters - Mobile */}
            {isMobileFilterOpen && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex justify-end">
                <div className="bg-white w-full max-w-xs h-full overflow-y-auto p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-medium text-lg text-gray-900">Filters</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMobileFilter}
                      className="text-gray-500"
                    >
                      <X size={20} />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Job Type */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Job Type</h4>
                      <div className="space-y-2">
                        {jobTypes.map((type) => (
                          <div key={type.id} className="flex items-center">
                            <Checkbox id={`mobile-type-${type.id}`} />
                            <label
                              htmlFor={`mobile-type-${type.id}`}
                              className="ml-2 text-sm text-gray-600"
                            >
                              {type.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Experience Level */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Experience Level</h4>
                      <div className="space-y-2">
                        {experienceLevels.map((level) => (
                          <div key={level.id} className="flex items-center">
                            <Checkbox id={`mobile-level-${level.id}`} />
                            <label
                              htmlFor={`mobile-level-${level.id}`}
                              className="ml-2 text-sm text-gray-600"
                            >
                              {level.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Salary Range */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Salary Range ($K)</h4>
                      <Slider
                        defaultValue={[40, 160]}
                        max={200}
                        step={10}
                        value={salaryRange}
                        onValueChange={setSalaryRange}
                        className="my-4"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>${salaryRange[0]}K</span>
                        <span>${salaryRange[1]}K</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Clear
                      </Button>
                      <Button
                        className="bg-job-blue hover:bg-job-purple"
                        onClick={toggleMobileFilter}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Job Listings */}
            <div className="flex-1">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {jobsData.length} Jobs Found
                </h2>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Sort by:</span>
                  <select 
                    className="text-sm border rounded-md border-gray-300 py-1 px-2"
                    aria-label="Sort jobs by"
                    id="sort-jobs"
                  >
                    <option>Most Relevant</option>
                    <option>Newest</option>
                    <option>Highest Salary</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                {jobsData.map((job) => (
                  <JobCard key={job.id} {...job} />
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <Button
                  variant="outline"
                  className="border-job-blue text-job-blue hover:bg-job-blue hover:text-white"
                >
                  Load More Jobs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Jobs;