
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
    <div className={`bg-white rounded-lg border ${isFeatured ? 'border-job-purple shadow-md' : 'border-gray-200'} p-6 transition-all hover:shadow-md`}>
      {isFeatured && (
        <div className="mb-3">
          <span className="bg-job-purple/10 text-job-purple text-xs font-medium px-2.5 py-0.5 rounded-full">
            Featured
          </span>
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-gray-100 p-2">
          <img src={logo} alt={`${company} logo`} className="h-full w-full object-contain" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 hover:text-job-blue transition-colors">
            <a href={`/jobs/${id}`}>{title}</a>
          </h3>
          <p className="text-gray-600">{company}</p>
          
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin size={16} className="mr-1 text-gray-400" />
              {location}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Briefcase size={16} className="mr-1 text-gray-400" />
              {jobType}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <DollarSign size={16} className="mr-1 text-gray-400" />
              {salary}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={16} className="mr-1 text-gray-400" />
              {postedTime}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-job-blue">
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
