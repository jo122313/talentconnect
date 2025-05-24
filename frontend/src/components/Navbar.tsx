
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, UserCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const renderAuthButtons = () => {
    if (!userRole) {
      return (
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="outline" className="border-job-blue text-job-blue hover:bg-job-blue hover:text-white">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-job-blue hover:bg-job-purple">
              Register
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-4">
        {userRole === 'admin' && (
          <Link to="/admin/dashboard" className="text-gray-600 hover:text-job-blue transition-colors">
            Dashboard
          </Link>
        )}
        <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:bg-red-50">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-job-blue to-job-purple bg-clip-text text-transparent">
              TalentConnect
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {(!userRole || userRole === 'jobseeker') && (
              <>
                <Link to="/jobs" className="text-gray-600 hover:text-job-blue transition-colors">
                  Find Jobs
                </Link>
                <Link to="/companies" className="text-gray-600 hover:text-job-blue transition-colors">
                  Companies
                </Link>
              </>
            )}
            {(!userRole || userRole === 'employer') && (
              <Link to="/employers" className="text-gray-600 hover:text-job-blue transition-colors">
                For Employers
              </Link>
            )}
            {renderAuthButtons()}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 focus:outline-none"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 border-t">
          <div className="flex flex-col space-y-3">
            {(!userRole || userRole === 'jobseeker') && (
              <>
                <Link
                  to="/jobs"
                  className="text-gray-600 hover:text-job-blue transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Find Jobs
                </Link>
                <Link
                  to="/companies"
                  className="text-gray-600 hover:text-job-blue transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Companies
                </Link>
              </>
            )}
            {(!userRole || userRole === 'employer') && (
              <Link
                to="/employers"
                className="text-gray-600 hover:text-job-blue transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                For Employers
              </Link>
            )}
            {userRole === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="text-gray-600 hover:text-job-blue transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {!userRole ? (
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-job-blue text-job-blue hover:bg-job-blue hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-job-blue hover:bg-job-purple">
                    Register
                  </Button>
                </Link>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
