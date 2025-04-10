
import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState("jobseeker");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic
    console.log({ accountType, fullName, email, password, agreeTerms });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
            <p className="text-gray-600 mt-2">Join our network of professionals</p>
          </div>
          
          <Tabs defaultValue="jobseeker" onValueChange={setAccountType} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="jobseeker">Job Seeker</TabsTrigger>
              <TabsTrigger value="employer">Employer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="jobseeker">
              <p className="text-sm text-gray-600 mt-2">
                Create an account to find and apply to jobs
              </p>
            </TabsContent>
            
            <TabsContent value="employer">
              <p className="text-sm text-gray-600 mt-2">
                Create an account to post jobs and find talent
              </p>
            </TabsContent>
          </Tabs>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Input
                  id="fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={accountType === "jobseeker" ? "Enter your full name" : "Enter company name"}
                  required
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Password should be at least 8 characters long with letters, numbers and symbols
                </p>
              </div>
              
              <div className="flex items-start">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  className="mt-1"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 text-sm text-gray-600"
                >
                  I agree to the{" "}
                  <Link to="/terms" className="text-job-blue hover:text-job-purple">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-job-blue hover:text-job-purple">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-job-blue hover:bg-job-purple"
                disabled={!agreeTerms}
              >
                Create Account
              </Button>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-job-blue hover:text-job-purple font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
