
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const EmployerPending = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-amber-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Pending Approval</h1>
          
          <p className="text-gray-600 mb-6">
            Your employer account has been submitted for review. Our admin team will verify your business details and approve your account shortly. You'll receive an email notification once your account is approved.
          </p>
          
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-6">
            <p className="text-amber-800 text-sm">
              Approval typically takes 1-2 business days. If you don't hear back from us, please check your spam folder or contact support.
            </p>
          </div>
          
          <Button asChild className="w-full bg-job-blue hover:bg-job-purple mb-4">
            <Link to="/">Return to Homepage</Link>
          </Button>
          
          <p className="text-gray-500 text-sm">
            Have questions? <Link to="/contact" className="text-job-blue hover:text-job-purple">Contact Support</Link>
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EmployerPending;
