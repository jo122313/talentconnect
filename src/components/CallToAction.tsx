
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-job-blue/10 to-job-purple/10 dark:from-job-blue/5 dark:to-job-purple/5 rounded-2xl p-10 text-center relative overflow-hidden border border-gray-100 dark:border-gray-800">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#6366F1_1px,transparent_1px)] dark:bg-[radial-gradient(#6366F1_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Ready to Take the Next Step in Your Career?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have found their dream jobs through our platform. Upload your resume and start applying today!
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register">
                <Button className="w-full sm:w-auto bg-job-blue hover:bg-job-purple">
                  Create an Account
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" className="w-full sm:w-auto border-job-blue text-job-blue hover:bg-job-blue hover:text-white dark:border-job-purple dark:text-job-purple dark:hover:bg-job-purple">
                  Browse Jobs
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 flex justify-center space-x-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-job-blue">3M+</p>
                <p className="text-gray-600 dark:text-gray-300">Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-job-blue">100K+</p>
                <p className="text-gray-600 dark:text-gray-300">Jobs Posted</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-job-blue">90%</p>
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
