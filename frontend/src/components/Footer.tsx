
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
              JobConnect
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Connecting talented professionals with their dream careers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              For Job Seekers
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/jobs" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/career-advice" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  Career Advice
                </Link>
              </li>
              <li>
                <Link to="/resume-tips" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  Resume Tips
                </Link>
              </li>
              <li>
                <Link to="/interview-prep" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  Interview Prep
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              For Employers
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/employer/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/employer/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  schedule Interview
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-gray-700 dark:text-gray-400 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  Debre Berhan Univerity,Debre Berhan Ethiopia
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-gray-700 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">+2519-73-00-62-45</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-gray-700 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">natnaelgeletanegm.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-700 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} TalentConnect. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-700 dark:text-gray-400 text-sm hover:text-black dark:hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-700 dark:text-gray-400 text-sm hover:text-black dark:hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-700 dark:text-gray-400 text-sm hover:text-black dark:hover:text-white transition-colors">
                Cookies Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
