
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-20 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto glass-card rounded-2xl p-10 text-center relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#4338ca_1px,transparent_1px)] dark:bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Take the Next Step in Your Career?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have found their dream jobs through our platform. Upload your resume and start applying today!
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-job-blue to-job-purple hover:from-job-purple hover:to-job-blue text-white border-0">
                  Create an Account
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" className="w-full sm:w-auto border-job-purple text-job-purple hover:bg-job-purple/10 dark:border-job-blue dark:text-job-blue dark:hover:bg-job-blue/10">
                  Browse Jobs
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 flex justify-center gap-8 sm:gap-16">
              <div className="text-center">
                <p className="text-3xl font-bold text-job-blue dark:text-job-purple">3M+</p>
                <p className="text-gray-600 dark:text-gray-300">Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-job-blue dark:text-job-purple">100K+</p>
                <p className="text-gray-600 dark:text-gray-300">Jobs Posted</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-job-blue dark:text-job-purple">90%</p>
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
