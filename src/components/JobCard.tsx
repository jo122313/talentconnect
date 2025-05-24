
import { MapPin, Briefcase, Clock, DollarSign, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface JobProps {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  jobType: string;
  salary: string;
  postedTime: string;
  isFeatured?: boolean;
}

const JobCard = ({
  id,
  title,
  company,
  logo,
  location,
  jobType,
  salary,
  postedTime,
  isFeatured,
}: JobProps) => {
  return (
    <div className={`glass-card text-card-foreground rounded-lg ${isFeatured ? 'border-job-blue dark:border-job-purple shadow-md' : 'border-white/20 dark:border-white/10'} p-6 transition-all hover:shadow-lg`}>
      {isFeatured && (
        <div className="mb-3">
          <span className="bg-job-blue/20 text-job-blue text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-job-purple/20 dark:text-job-purple">
            Featured
          </span>
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-white/50 dark:bg-white/10 p-2">
          <img src={logo} alt={`${company} logo`} className="h-full w-full object-contain" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white hover:text-job-blue dark:hover:text-job-purple transition-colors">
            <a href={`/jobs/${id}`}>{title}</a>
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{company}</p>
          
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPin size={16} className="mr-1 text-job-blue dark:text-job-purple" />
              {location}
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Briefcase size={16} className="mr-1 text-job-blue dark:text-job-purple" />
              {jobType}
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <DollarSign size={16} className="mr-1 text-job-blue dark:text-job-purple" />
              {salary}
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock size={16} className="mr-1 text-job-blue dark:text-job-purple" />
              {postedTime}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-job-blue dark:hover:text-job-purple">
            <Bookmark size={20} />
          </Button>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <a href={`/jobs/${id}`} className="animated-gradient-button">
          <span>Apply Now</span>
        </a>
      </div>
    </div>
  );
};

export default JobCard;
