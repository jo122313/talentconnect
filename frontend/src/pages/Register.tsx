import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Phone, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { auth } from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState("jobseeker");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { toast } = useToast();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('fullName', fullName);
      submitData.append('email', email);
      submitData.append('phone', phone);
      submitData.append('password', password);
      
      if (accountType === 'employer') {
        submitData.append('location', location);
        if (licenseFile) {
          submitData.append('businessLicense', licenseFile);
        }
        await auth.registerEmployer(submitData);
        toast({
          title: "Registration Submitted",
          description: "Your employer account has been submitted for admin approval.",
        });
        navigate("/employer-pending");
      } else {
        if (resumeFile) {
          submitData.append('resume', resumeFile);
        }
        const response = await auth.registerJobSeeker(submitData);
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully.",
        });
        navigate("/jobs");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check if the file is a PDF or DOC
      if (file.type === "application/pdf" || 
          file.type === "application/msword" || 
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setResumeFile(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF or DOC file for your resume.",
          variant: "destructive",
        });
        e.target.value = "";
      }
    }
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check if the file is a PDF or JPG
      if (file.type === "application/pdf" || 
          file.type === "image/jpeg" || 
          file.type === "image/jpg") {
        setLicenseFile(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF or JPG file for your business license.",
          variant: "destructive",
        });
        e.target.value = "";
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'fullName') {
      setFullName(e.target.value);
    } else if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else if (e.target.name === 'phone') {
      setPhone(e.target.value);
    } else if (e.target.name === 'password') {
      setPassword(e.target.value);
    } else if (e.target.name === 'location') {
      setLocation(e.target.value);
    }
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
                <span className="block mt-1 text-amber-600 font-medium">
                  Note: Employer accounts require admin approval before access is granted
                </span>
              </p>
            </TabsContent>
          </Tabs>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                {accountType === "jobseeker" ? "Full Name" : "Company Name"}
              </label>
              <Input
                id="fullname"
                type="text"
                value={fullName}
                onChange={handleChange}
                placeholder={accountType === "jobseeker" ? "Enter your full name" : "Enter company name"}
                required
                className="w-full"
                name="fullName"
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
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full"
                name="email"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  className="w-full pl-10"
                  name="phone"
                />
              </div>
            </div>

            {accountType === "employer" && (
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="location"
                    type="text"
                    value={location}
                    onChange={handleChange}
                    placeholder="Enter company location"
                    required
                    className="w-full pl-10"
                    name="location"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="w-full pr-10"
                  name="password"
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

            {accountType === "jobseeker" && (
              <div>
                <Label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Resume (PDF, DOC)
                </Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FileText className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="resume-display"
                      type="text"
                      value={resumeFile?.name || ""}
                      readOnly
                      placeholder="No file chosen"
                      className="w-full pl-10 cursor-pointer"
                      onClick={() => document.getElementById("resume")?.click()}
                    />
                  </div>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => document.getElementById("resume")?.click()}
                  >
                    Browse
                  </Button>
                  <Input
                    id="resume"
                    type="file"
                    onChange={handleResumeChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Upload your CV/resume (PDF or DOC format)</p>
              </div>
            )}

            {accountType === "employer" && (
              <div>
                <Label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-1">
                  Business License (PDF, JPG)
                </Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FileText className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="license-display"
                      type="text"
                      value={licenseFile?.name || ""}
                      readOnly
                      placeholder="No file chosen"
                      className="w-full pl-10 cursor-pointer"
                      onClick={() => document.getElementById("license")?.click()}
                    />
                  </div>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => document.getElementById("license")?.click()}
                  >
                    Browse
                  </Button>
                  <Input
                    id="license"
                    type="file"
                    onChange={handleLicenseChange}
                    accept=".pdf,.jpg,.jpeg"
                    className="hidden"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Upload your business license (PDF or JPG format)</p>
              </div>
            )}
            
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
            
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            
            <Button
              type="submit"
              className="w-full bg-job-blue hover:bg-job-purple"
              disabled={!agreeTerms || loading}
            >
              {loading ? 'Registering...' : 'Create Account'}
            </Button>
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