
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Users, Star, Search, Building, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// Company data structure
interface CompanyProps {
  id: string;
  name: string;
  logo: string;
  location: string;
  employeeCount: string;
  rating: number;
  openPositions: number;
  industry?: string;
}

// Mock data for companies
const companiesData: CompanyProps[] = [
  {
    id: "1",
    name: "Google",
    logo: "https://randomuser.me/api/portraits/men/11.jpg",
    location: "Mountain View, CA",
    employeeCount: "10,000+",
    rating: 4.8,
    openPositions: 42,
    industry: "Technology",
  },
  {
    id: "2",
    name: "Microsoft",
    logo: "https://randomuser.me/api/portraits/men/12.jpg",
    location: "Redmond, WA",
    employeeCount: "10,000+",
    rating: 4.7,
    openPositions: 38,
    industry: "Technology",
  },
  {
    id: "3",
    name: "Amazon",
    logo: "https://randomuser.me/api/portraits/men/13.jpg",
    location: "Seattle, WA",
    employeeCount: "10,000+",
    rating: 4.2,
    openPositions: 67,
    industry: "E-commerce",
  },
  {
    id: "4",
    name: "Apple",
    logo: "https://randomuser.me/api/portraits/men/14.jpg",
    location: "Cupertino, CA",
    employeeCount: "10,000+",
    rating: 4.6,
    openPositions: 25,
    industry: "Technology",
  },
  {
    id: "5",
    name: "Facebook",
    logo: "https://randomuser.me/api/portraits/men/15.jpg",
    location: "Menlo Park, CA",
    employeeCount: "10,000+",
    rating: 4.5,
    openPositions: 30,
    industry: "Social Media",
  },
  {
    id: "6",
    name: "Netflix",
    logo: "https://randomuser.me/api/portraits/men/16.jpg",
    location: "Los Gatos, CA",
    employeeCount: "5,000+",
    rating: 4.4,
    openPositions: 15,
    industry: "Entertainment",
  },
  {
    id: "7",
    name: "Salesforce",
    logo: "https://randomuser.me/api/portraits/men/17.jpg",
    location: "San Francisco, CA",
    employeeCount: "8,000+",
    rating: 4.3,
    openPositions: 28,
    industry: "Enterprise Software",
  },
  {
    id: "8",
    name: "IBM",
    logo: "https://randomuser.me/api/portraits/men/18.jpg",
    location: "Armonk, NY",
    employeeCount: "10,000+",
    rating: 4.1,
    openPositions: 45,
    industry: "Technology",
  },
  {
    id: "9",
    name: "Adobe",
    logo: "https://randomuser.me/api/portraits/men/19.jpg",
    location: "San Jose, CA",
    employeeCount: "7,000+",
    rating: 4.5,
    openPositions: 20,
    industry: "Software",
  },
  {
    id: "10",
    name: "Intel",
    logo: "https://randomuser.me/api/portraits/men/20.jpg",
    location: "Santa Clara, CA",
    employeeCount: "10,000+",
    rating: 4.2,
    openPositions: 35,
    industry: "Semiconductor",
  },
  {
    id: "11",
    name: "Uber",
    logo: "https://randomuser.me/api/portraits/men/21.jpg",
    location: "San Francisco, CA",
    employeeCount: "6,000+",
    rating: 4.0,
    openPositions: 22,
    industry: "Transportation",
  },
  {
    id: "12",
    name: "Twitter",
    logo: "https://randomuser.me/api/portraits/men/22.jpg",
    location: "San Francisco, CA",
    employeeCount: "5,000+",
    rating: 4.1,
    openPositions: 18,
    industry: "Social Media",
  },
];

// Industries for filtering
const industries = [
  "Technology",
  "E-commerce",
  "Social Media",
  "Entertainment",
  "Enterprise Software",
  "Semiconductor",
  "Transportation",
];

// Company card component
const CompanyCard = ({
  id,
  name,
  logo,
  location,
  employeeCount,
  rating,
  openPositions,
  industry,
}: CompanyProps) => {
  return (
    <Card className="bg-white rounded-lg border border-gray-200 p-6 transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-100 p-1">
          <img src={logo} alt={`${name} logo`} className="h-full w-full object-cover" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 hover:text-job-blue transition-colors">
            <Link to={`/companies/${id}`}>{name}</Link>
          </h3>
          
          <div className="flex flex-wrap items-center mt-1 gap-2">
            <div className="flex items-center">
              <Star size={14} className="text-yellow-400 mr-1" fill="currentColor" />
              <span className="text-sm text-gray-600">{rating}</span>
            </div>
            {industry && (
              <div className="text-sm text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                {industry}
              </div>
            )}
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
    </Card>
  );
};

const Companies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  // Filter companies based on search query and selected industries
  const filteredCompanies = companiesData.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = 
      selectedIndustries.length === 0 || 
      (company.industry && selectedIndustries.includes(company.industry));
    
    return matchesSearch && matchesIndustry;
  });

  // Handle industry filter change
  const handleIndustryChange = (industry: string) => {
    setSelectedIndustries((prev) => {
      if (prev.includes(industry)) {
        return prev.filter((i) => i !== industry);
      } else {
        return [...prev, industry];
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section */}
        <div className="bg-gradient-to-r from-job-blue to-job-purple py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-white text-center mb-6">
              Top Companies Hiring Now
            </h1>
            <p className="text-center text-white/90 max-w-3xl mx-auto mb-8">
              Discover and connect with leading employers across various industries
            </p>
            
            {/* Search box */}
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-2 flex">
              <div className="flex-grow relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="Search companies by name..."
                  className="pl-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button className="bg-job-blue hover:bg-job-purple ml-2">
                Search
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters sidebar */}
            <div className="w-full md:w-64 shrink-0">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <Filter size={18} />
                    Filters
                  </h3>
                  <Button variant="ghost" size="sm" className="text-job-blue h-auto p-0"
                    onClick={() => setSelectedIndustries([])}>
                    Reset
                  </Button>
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Industry</h4>
                  <div className="space-y-2">
                    {industries.map((industry) => (
                      <div key={industry} className="flex items-center">
                        <Checkbox 
                          id={`industry-${industry}`}
                          checked={selectedIndustries.includes(industry)}
                          onCheckedChange={() => handleIndustryChange(industry)}
                        />
                        <label 
                          htmlFor={`industry-${industry}`}
                          className="text-sm text-gray-600 ml-2 cursor-pointer"
                        >
                          {industry}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Companies list */}
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2">
                  <Building size={20} />
                  Companies ({filteredCompanies.length})
                </h2>
                {/* Could add sorting options here */}
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
                    <CompanyCard key={company.id} {...company} />
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
                    <p className="text-gray-600">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </div>
              
              {/* Pagination */}
              {filteredCompanies.length > 0 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Companies;
