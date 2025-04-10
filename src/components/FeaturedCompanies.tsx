
import { Link } from "react-router-dom";
import { MapPin, Users, Star } from "lucide-react";

interface CompanyProps {
  id: string;
  name: string;
  logo: string;
  location: string;
  employeeCount: string;
  rating: number;
  openPositions: number;
}

const companiesData: CompanyProps[] = [
  {
    id: "1",
    name: "Google",
    logo: "https://randomuser.me/api/portraits/men/11.jpg",
    location: "Mountain View, CA",
    employeeCount: "10,000+",
    rating: 4.8,
    openPositions: 42,
  },
  {
    id: "2",
    name: "Microsoft",
    logo: "https://randomuser.me/api/portraits/men/12.jpg",
    location: "Redmond, WA",
    employeeCount: "10,000+",
    rating: 4.7,
    openPositions: 38,
  },
  {
    id: "3",
    name: "Amazon",
    logo: "https://randomuser.me/api/portraits/men/13.jpg",
    location: "Seattle, WA",
    employeeCount: "10,000+",
    rating: 4.2,
    openPositions: 67,
  },
  {
    id: "4",
    name: "Apple",
    logo: "https://randomuser.me/api/portraits/men/14.jpg",
    location: "Cupertino, CA",
    employeeCount: "10,000+",
    rating: 4.6,
    openPositions: 25,
  },
  {
    id: "5",
    name: "Facebook",
    logo: "https://randomuser.me/api/portraits/men/15.jpg",
    location: "Menlo Park, CA",
    employeeCount: "10,000+",
    rating: 4.5,
    openPositions: 30,
  },
  {
    id: "6",
    name: "Netflix",
    logo: "https://randomuser.me/api/portraits/men/16.jpg",
    location: "Los Gatos, CA",
    employeeCount: "5,000+",
    rating: 4.4,
    openPositions: 15,
  },
];

const CompanyCard = ({
  id,
  name,
  logo,
  location,
  employeeCount,
  rating,
  openPositions,
}: CompanyProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gray-100 p-1">
          <img src={logo} alt={`${name} logo`} className="h-full w-full object-cover" />
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 hover:text-job-blue transition-colors">
            <Link to={`/companies/${id}`}>{name}</Link>
          </h3>
          
          <div className="flex items-center mt-1">
            <div className="flex items-center mr-3">
              <Star size={14} className="text-yellow-400 mr-1" fill="currentColor" />
              <span className="text-sm text-gray-600">{rating}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin size={14} className="mr-1 text-gray-400" />
              {location}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <Users size={14} className="mr-1 text-gray-400" />
          {employeeCount} employees
        </div>
        <div className="text-job-blue font-medium">
          {openPositions} open positions
        </div>
      </div>
    </div>
  );
};

const FeaturedCompanies = () => {
  return (
    <section className="py-16 bg-job-lightGray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Top Companies Hiring
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore opportunities with these leading employers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companiesData.map((company) => (
            <CompanyCard key={company.id} {...company} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/companies"
            className="inline-flex items-center text-job-blue hover:text-job-purple transition-colors"
          >
            <span className="mr-2">Browse All Companies</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCompanies;
