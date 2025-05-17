
import { useState } from "react";
import { 
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockEmployers = [
  { id: 1, name: "Acme Corporation", email: "hr@acmecorp.com", phone: "555-123-4567", location: "New York, NY", status: "pending", appliedDate: "2025-05-15" },
  { id: 2, name: "TechGiant Inc", email: "jobs@techgiant.com", phone: "555-987-6543", location: "San Francisco, CA", status: "approved", appliedDate: "2025-05-14" },
  { id: 3, name: "Global Enterprises", email: "careers@globalent.com", phone: "555-456-7890", location: "Chicago, IL", status: "pending", appliedDate: "2025-05-17" },
  { id: 4, name: "Startup Hub", email: "team@startuphub.co", phone: "555-321-6547", location: "Austin, TX", status: "rejected", appliedDate: "2025-05-10" },
];

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "jobseeker", joinDate: "2025-04-12" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "jobseeker", joinDate: "2025-04-15" },
  { id: 3, name: "Acme Corporation", email: "hr@acmecorp.com", role: "employer", joinDate: "2025-05-15" },
  { id: 4, name: "Admin User", email: "admin@jobportal.com", role: "admin", joinDate: "2025-03-01" },
];

const mockJobs = [
  { id: 1, title: "Frontend Developer", company: "Acme Corporation", status: "active", postedDate: "2025-05-05", applications: 12 },
  { id: 2, title: "Backend Engineer", company: "TechGiant Inc", status: "active", postedDate: "2025-05-07", applications: 8 },
  { id: 3, title: "UX Designer", company: "Global Enterprises", status: "inactive", postedDate: "2025-04-28", applications: 20 },
  { id: 4, title: "Project Manager", company: "Startup Hub", status: "active", postedDate: "2025-05-16", applications: 5 },
];

const AdminDashboard = () => {
  const { toast } = useToast();
  const [employers, setEmployers] = useState(mockEmployers);
  const [users, setUsers] = useState(mockUsers);
  const [jobs, setJobs] = useState(mockJobs);
  const [selectedEmployer, setSelectedEmployer] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleStatusChange = (employerId: number, newStatus: string) => {
    setEmployers(employers.map(emp => 
      emp.id === employerId ? { ...emp, status: newStatus } : emp
    ));
    
    setDialogOpen(false);
    
    toast({
      title: "Status Updated",
      description: `The employer account status has been updated to ${newStatus}.`,
    });
  };
  
  const openDialog = (employer: any) => {
    setSelectedEmployer(employer);
    setDialogOpen(true);
  };
  
  const deleteJob = (jobId: number) => {
    setJobs(jobs.filter(job => job.id !== jobId));
    
    toast({
      title: "Job Deleted",
      description: "The job posting has been removed from the system.",
    });
  };
  
  const deleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
    
    toast({
      title: "User Deleted",
      description: "The user has been removed from the system.",
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage employers, users, and job postings</p>
      </header>
      
      <Tabs defaultValue="employers" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="employers">Employer Approvals</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="employers" className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Employer Registrations</h2>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
                {employers.filter(e => e.status === "pending").length} Pending
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                {employers.filter(e => e.status === "approved").length} Approved
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100">
                {employers.filter(e => e.status === "rejected").length} Rejected
              </Badge>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employers.map((employer) => (
                <TableRow key={employer.id}>
                  <TableCell className="font-medium">{employer.name}</TableCell>
                  <TableCell>{employer.email}</TableCell>
                  <TableCell>{employer.location}</TableCell>
                  <TableCell>{employer.appliedDate}</TableCell>
                  <TableCell>
                    <Badge className={
                      employer.status === "approved" ? "bg-green-100 text-green-800 hover:bg-green-200" :
                      employer.status === "rejected" ? "bg-red-100 text-red-800 hover:bg-red-200" :
                      "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    }>
                      {employer.status.charAt(0).toUpperCase() + employer.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => openDialog(employer)}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="users" className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={
                      user.role === "admin" ? "bg-purple-100 text-purple-800" :
                      user.role === "employer" ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-800"
                    }>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="jobs" className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Job Postings</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Posted Date</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>
                    <Badge className={job.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{job.postedDate}</TableCell>
                  <TableCell>{job.applications}</TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mr-2"
                    >
                      {job.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => deleteJob(job.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
      
      {/* Employer Review Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review Employer Application</DialogTitle>
            <DialogDescription>
              Review the employer details and decide whether to approve or reject.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmployer && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Company Name</p>
                  <p>{selectedEmployer.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{selectedEmployer.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p>{selectedEmployer.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p>{selectedEmployer.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Applied Date</p>
                  <p>{selectedEmployer.appliedDate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Current Status</p>
                  <Badge className={
                    selectedEmployer.status === "approved" ? "bg-green-100 text-green-800" :
                    selectedEmployer.status === "rejected" ? "bg-red-100 text-red-800" :
                    "bg-amber-100 text-amber-800"
                  }>
                    {selectedEmployer.status.charAt(0).toUpperCase() + selectedEmployer.status.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium text-gray-500 mb-1">Business License</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm">license-document.pdf</p>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex gap-2">
            {selectedEmployer?.status !== "rejected" && (
              <Button 
                variant="destructive" 
                onClick={() => handleStatusChange(selectedEmployer?.id, "rejected")}
              >
                Reject
              </Button>
            )}
            {selectedEmployer?.status !== "approved" && (
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleStatusChange(selectedEmployer?.id, "approved")}
              >
                Approve
              </Button>
            )}
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
