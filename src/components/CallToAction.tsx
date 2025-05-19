
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-secondary dark:bg-secondary rounded-2xl p-10 text-center relative overflow-hidden border border-gray-100 dark:border-gray-800">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Take the Next Step in Your Career?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have found their dream jobs through our platform. Upload your resume and start applying today!
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register">
                <Button className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                  Create an Account
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" className="w-full sm:w-auto border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">
                  Browse Jobs
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 flex justify-center space-x-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-black dark:text-white">3M+</p>
                <p className="text-gray-600 dark:text-gray-300">Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-black dark:text-white">100K+</p>
                <p className="text-gray-600 dark:text-gray-300">Jobs Posted</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-black dark:text-white">90%</p>
                <p className="text-gray-600 dark:text-gray-300">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
