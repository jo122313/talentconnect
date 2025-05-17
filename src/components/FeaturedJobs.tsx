
import { useState } from "react";
import JobCard, { JobProps } from "./JobCard";
import { Button } from "@/components/ui/button";

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
];

const FeaturedJobs = () => {
  const [displayCount, setDisplayCount] = useState(4);
  const hasMoreJobs = displayCount < jobsData.length;

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => Math.min(prevCount + 4, jobsData.length));
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Jobs
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover your next career opportunity with these handpicked opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {jobsData.slice(0, displayCount).map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>

        {hasMoreJobs && (
          <div className="mt-10 text-center">
            <Button
              onClick={handleLoadMore}
              variant="outline"
              className="border-job-blue text-job-blue hover:bg-job-blue hover:text-white dark:border-job-purple dark:text-job-purple dark:hover:bg-job-purple dark:hover:text-white"
            >
              Load More Jobs
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedJobs;
