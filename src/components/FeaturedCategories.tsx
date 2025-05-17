
import { CodeIcon, Landmark, BarChart2, ShoppingBag, LineChart, UserPlus, Stethoscope, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Information Technology",
    jobs: 2340,
    icon: CodeIcon,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    name: "Finance & Banking",
    jobs: 1203,
    icon: Landmark,
    color: "bg-green-100 text-green-600",
  },
  {
    id: 3,
    name: "Marketing & Sales",
    jobs: 1542,
    icon: BarChart2,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: 4,
    name: "Retail & Consumer",
    jobs: 980,
    icon: ShoppingBag,
    color: "bg-orange-100 text-orange-600",
  },
  {
    id: 5,
    name: "Business & Consulting",
    jobs: 872,
    icon: LineChart,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    id: 6,
    name: "Human Resources",
    jobs: 654,
    icon: UserPlus,
    color: "bg-pink-100 text-pink-600",
  },
  {
    id: 7,
    name: "Healthcare",
    jobs: 1432,
    icon: Stethoscope,
    color: "bg-red-100 text-red-600",
  },
  {
    id: 8,
    name: "Engineering",
    jobs: 1120,
    icon: Wrench,
    color: "bg-yellow-100 text-yellow-600",
  },
];

const FeaturedCategories = () => {
  return (
    <section className="py-16 bg-job-lightGray dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Popular Job Categories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find your career path in these top job categories with thousands of opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/jobs/category/${category.id}`}
              className="bg-card text-card-foreground rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${category.color}`}>
                  <category.icon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-job-blue transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{category.jobs} jobs available</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/jobs/categories"
            className="inline-flex items-center text-job-blue hover:text-job-purple transition-colors"
          >
            <span className="mr-2">Browse All Categories</span>
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

export default FeaturedCategories;
