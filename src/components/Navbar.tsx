
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-job-darkPurple dark:text-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-job-blue to-job-purple bg-clip-text text-transparent">
              TalentConnect
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/jobs" className="text-gray-600 hover:text-job-blue transition-colors dark:text-gray-300 dark:hover:text-job-blue">
              Find Jobs
            </Link>
            <Link to="/companies" className="text-gray-600 hover:text-job-blue transition-colors dark:text-gray-300 dark:hover:text-job-blue">
              Companies
            </Link>
            <Link to="/employers" className="text-gray-600 hover:text-job-blue transition-colors dark:text-gray-300 dark:hover:text-job-blue">
              For Employers
            </Link>
            
            {/* Show dashboard links based on user role */}
            {isAuthenticated && user?.role === "admin" && (
              <Link 
                to="/admin/dashboard" 
                className="text-gray-600 hover:text-job-blue transition-colors dark:text-gray-300 dark:hover:text-job-blue"
              >
                Admin Dashboard
              </Link>
            )}
            
            {isAuthenticated && user?.role === "employer" && (
              <Link 
                to="/employer/dashboard" 
                className="text-gray-600 hover:text-job-blue transition-colors dark:text-gray-300 dark:hover:text-job-blue"
              >
                Employer Dashboard
              </Link>
            )}
            
            {/* Authentication buttons */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              
              {!isAuthenticated ? (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="border-job-blue text-job-blue hover:bg-job-blue hover:text-white dark:border-job-purple dark:text-job-purple dark:hover:bg-job-purple">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-job-blue hover:bg-job-purple dark:bg-job-purple dark:hover:bg-job-blue">
                      Register
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/logout">
                  <Button variant="outline" className="border-job-blue text-job-blue hover:bg-job-blue hover:text-white dark:border-job-purple dark:text-job-purple dark:hover:bg-job-purple">
                    Logout
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 focus:outline-none ml-2"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-job-darkPurple px-4 pt-2 pb-4 border-t dark:border-gray-700">
          <div className="flex flex-col space-y-3">
            <Link
              to="/jobs"
              className="text-gray-600 hover:text-job-blue transition-colors py-2 dark:text-gray-300 dark:hover:text-job-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Jobs
            </Link>
            <Link
              to="/companies"
              className="text-gray-600 hover:text-job-blue transition-colors py-2 dark:text-gray-300 dark:hover:text-job-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              Companies
            </Link>
            <Link
              to="/employers"
              className="text-gray-600 hover:text-job-blue transition-colors py-2 dark:text-gray-300 dark:hover:text-job-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              For Employers
            </Link>
            
            {/* Show dashboard links based on user role */}
            {isAuthenticated && user?.role === "admin" && (
              <Link 
                to="/admin/dashboard" 
                className="text-gray-600 hover:text-job-blue transition-colors py-2 dark:text-gray-300 dark:hover:text-job-blue"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            
            {isAuthenticated && user?.role === "employer" && (
              <Link 
                to="/employer/dashboard" 
                className="text-gray-600 hover:text-job-blue transition-colors py-2 dark:text-gray-300 dark:hover:text-job-blue"
                onClick={() => setIsMenuOpen(false)}
              >
                Employer Dashboard
              </Link>
            )}
            
            <div className="flex flex-col space-y-2 pt-2">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-job-blue text-job-blue hover:bg-job-blue hover:text-white dark:border-job-purple dark:text-job-purple dark:hover:bg-job-purple">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-job-blue hover:bg-job-purple dark:bg-job-purple dark:hover:bg-job-blue">
                      Register
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/logout" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-job-blue text-job-blue hover:bg-job-blue hover:text-white dark:border-job-purple dark:text-job-purple dark:hover:bg-job-purple">
                    Logout
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
