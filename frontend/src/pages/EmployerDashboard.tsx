
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Eye, Mail, FileText } from "lucide-react";

// Mock data for jobs
const mockJobs = [
  { 
    id: 1, 
    title: "Frontend Developer", 
    location: "New York, NY", 
    type: "Full-time",
    status: "active",
    postedDate: "2025-05-05",
    applications: 12 
  },
  { 
    id: 2, 
    title: "UX Designer", 
    location: "Remote", 
    type: "Contract",
    status: "active",
    postedDate: "2025-05-10",
    applications: 8 
  },
  { 
    id: 3, 
    title: "Backend Engineer", 
    location: "San Francisco, CA", 
    type: "Full-time",
    status: "closed",
    postedDate: "2025-04-15",
    applications: 20 
  }
];

// Mock data for applications
const mockApplications = [
  { 
    id: 1, 
    job: "Frontend Developer",
    candidate: "John Doe", 
    email: "john.doe@example.com",
    appliedDate: "2025-05-07",
    status: "review" 
  },
  { 
    id: 2, 
    job: "Frontend Developer",
    candidate: "Jane Smith", 
    email: "jane.smith@example.com",
    appliedDate: "2025-05-08",
    status: "review" 
  },
  { 
    id: 3, 
    job: "UX Designer",
    candidate: "Alice Johnson", 
    email: "alice.j@example.com",
    appliedDate: "2025-05-12",
    status: "interview" 
  },
  { 
    id: 4, 
    job: "Frontend Developer",
    candidate: "Bob Williams", 
    email: "bob.w@example.com",
    appliedDate: "2025-05-10",
    status: "rejected" 
  },
  { 
    id: 5, 
    job: "Backend Engineer",
    candidate: "Charlie Brown", 
    email: "charlie.b@example.com",
    appliedDate: "2025-04-20",
    status: "hired" 
  }
];

const EmployerDashboard = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState(mockJobs);
  const [applications, setApplications] = useState(mockApplications);
  const [newJobDialogOpen, setNewJobDialogOpen] = useState(false);
  const [candidateDetailsOpen, setCandidateDetailsOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  
  // Form states for new job
  const [jobTitle, setJobTitle] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [jobDescription, setJobDescription] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");
  const [jobSalary, setJobSalary] = useState("");
  
  const handleNewJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newJob = {
      id: jobs.length + 1,
      title: jobTitle,
      location: jobLocation,
      type: jobType,
      status: "active",
      postedDate: new Date().toISOString().split("T")[0],
      applications: 0
    };
    
    setJobs([...jobs, newJob]);
    setNewJobDialogOpen(false);
    
    // Reset form
    setJobTitle("");
    setJobLocation("");
    setJobType("Full-time");
    setJobDescription("");
    setJobRequirements("");
    setJobSalary("");
    
    toast({
      title: "Job Posted",
      description: "Your job has been published successfully.",
    });
  };
  
  const viewCandidate = (candidateId: number) => {
    const candidate = applications.find(app => app.id === candidateId);
    setSelectedCandidate(candidate);
    setCandidateDetailsOpen(true);
  };
  
  const updateCandidateStatus = (candidateId: number, newStatus: string) => {
    setApplications(applications.map(app => 
      app.id === candidateId ? { ...app, status: newStatus } : app
    ));
    
    toast({
      title: "Status Updated",
      description: `Candidate status changed to ${newStatus}.`,
    });
  };
  
  const sendInterviewInvite = (candidateEmail: string) => {
    toast({
      title: "Interview Invitation Sent",
      description: `An invitation email has been sent to ${candidateEmail}.`,
    });
  };
  
  const toggleJobStatus = (jobId: number) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: job.status === "active" ? "closed" : "active" } : job
    ));
    
    const job = jobs.find(j => j.id === jobId);
    toast({
      title: "Job Status Updated",
      description: `Job listing is now ${job?.status === "active" ? "closed" : "active"}.`,
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
          <p className="text-gray-600">Manage job postings and candidate applications</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Active Jobs</CardTitle>
              <CardDescription>Currently listed positions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{jobs.filter(job => job.status === "active").length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Total Applications</CardTitle>
              <CardDescription>Candidates who applied</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{applications.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Interviews Scheduled</CardTitle>
              <CardDescription>Candidates in interview stage</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{applications.filter(app => app.status === "interview").length}</p>
            </CardContent>
          </Card>
        </div>
        
        <Button 
          onClick={() => setNewJobDialogOpen(true)} 
          className="mb-8 bg-job-blue hover:bg-job-purple"
        >
          + Post New Job
        </Button>
        
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="jobs">Job Listings</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="jobs" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Job Listings</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Posted Date</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.type}</TableCell>
                    <TableCell>{job.postedDate}</TableCell>
                    <TableCell>{job.applications}</TableCell>
                    <TableCell>
                      <Badge className={job.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mr-2"
                        onClick={() => toggleJobStatus(job.id)}
                      >
                        {job.status === "active" ? "Close" : "Reopen"}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="applications" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Candidate Applications</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.candidate}</TableCell>
                    <TableCell>{application.email}</TableCell>
                    <TableCell>{application.job}</TableCell>
                    <TableCell>{application.appliedDate}</TableCell>
                    <TableCell>
                      <Badge className={
                        application.status === "hired" ? "bg-green-100 text-green-800" :
                        application.status === "rejected" ? "bg-red-100 text-red-800" :
                        application.status === "interview" ? "bg-purple-100 text-purple-800" :
                        "bg-blue-100 text-blue-800"
                      }>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => viewCandidate(application.id)}>
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        
                        {application.status === "review" && (
                          <Button 
                            size="sm" 
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={() => updateCandidateStatus(application.id, "interview")}
                          >
                            <Mail className="h-4 w-4 mr-1" /> Interview
                          </Button>
                        )}
                        
                        {application.status === "review" && (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => updateCandidateStatus(application.id, "rejected")}
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
        
        {/* Post New Job Dialog */}
        <Dialog open={newJobDialogOpen} onOpenChange={setNewJobDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Post a New Job</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleNewJobSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input 
                    id="jobTitle" 
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jobType">Job Type</Label>
                  <select 
                    id="jobType"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobLocation">Location</Label>
                  <Input 
                    id="jobLocation" 
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jobSalary">Salary Range (Optional)</Label>
                  <Input 
                    id="jobSalary" 
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    placeholder="e.g. $50,000 - $70,000"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea 
                  id="jobDescription" 
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobRequirements">Requirements</Label>
                <Textarea 
                  id="jobRequirements" 
                  value={jobRequirements}
                  onChange={(e) => setJobRequirements(e.target.value)}
                  rows={4}
                  required
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setNewJobDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-job-blue hover:bg-job-purple">
                  Post Job
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Candidate Details Sheet */}
        <Sheet open={candidateDetailsOpen} onOpenChange={setCandidateDetailsOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Candidate Details</SheetTitle>
              <SheetDescription>
                Review candidate information and resume
              </SheetDescription>
            </SheetHeader>
            
            {selectedCandidate && (
              <div className="py-6">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-gray-500">Name</h4>
                    <p className="text-base font-medium">{selectedCandidate.candidate}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-gray-500">Email</h4>
                    <p className="text-base">{selectedCandidate.email}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-gray-500">Applied For</h4>
                    <p className="text-base">{selectedCandidate.job}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-gray-500">Application Date</h4>
                    <p className="text-base">{selectedCandidate.appliedDate}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <Badge className={
                      selectedCandidate.status === "hired" ? "bg-green-100 text-green-800" :
                      selectedCandidate.status === "rejected" ? "bg-red-100 text-red-800" :
                      selectedCandidate.status === "interview" ? "bg-purple-100 text-purple-800" :
                      "bg-blue-100 text-blue-800"
                    }>
                      {selectedCandidate.status.charAt(0).toUpperCase() + selectedCandidate.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm font-medium">Resume</span>
                      </div>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-500">Actions</h4>
                    <div className="flex flex-col gap-2">
                      {selectedCandidate.status === "review" && (
                        <>
                          <Button 
                            onClick={() => {
                              updateCandidateStatus(selectedCandidate.id, "interview");
                              sendInterviewInvite(selectedCandidate.email);
                            }}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Mail className="h-4 w-4 mr-2" /> Send Interview Invitation
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={() => updateCandidateStatus(selectedCandidate.id, "rejected")}
                          >
                            Reject Application
                          </Button>
                        </>
                      )}
                      
                      {selectedCandidate.status === "interview" && (
                        <>
                          <Button 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => updateCandidateStatus(selectedCandidate.id, "hired")}
                          >
                            Hire Candidate
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={() => updateCandidateStatus(selectedCandidate.id, "rejected")}
                          >
                            Reject Candidate
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default EmployerDashboard;
