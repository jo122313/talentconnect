"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { admin, auth } from "@/services/api"
import { Users, Building, Briefcase, Clock } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const AdminDashboard = () => {
  const { toast } = useToast()
  const navigate = useNavigate()

  // State for data
  const [stats, setStats] = useState<any>({})
  const [employers, setEmployers] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // State for UI
  const [selectedEmployer, setSelectedEmployer] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const response = await auth.getCurrentUser()
      if (response.user.role !== "admin") {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        })
        navigate("/")
        return
      }
      setCurrentUser(response.user)
      loadDashboardData()
    } catch (error) {
      console.error("Auth check failed:", error)
      navigate("/login")
    }
  }

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Load all data in parallel
      const [statsData, employersData, usersData, jobsData] = await Promise.all([
        admin.getDashboardStats(),
        admin.getEmployers({ limit: 50 }),
        admin.getUsers({ limit: 50 }),
        admin.getJobs({ limit: 50 }),
      ])

      setStats(statsData)
      setEmployers(employersData.employers || [])
      setUsers(usersData.users || [])
      setJobs(jobsData.jobs || [])
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (employerId: string, newStatus: string) => {
    try {
      console.log("Updating employer status:", { employerId, newStatus })
      await admin.updateEmployerStatus(employerId, newStatus)

      // Update local state
      setEmployers(employers.map((emp) => (emp._id === employerId ? { ...emp, status: newStatus } : emp)))

      setDialogOpen(false)

      toast({
        title: "Status Updated",
        description: `The employer account status has been updated to ${newStatus}.`,
      })

      // Reload stats to reflect changes
      const statsData = await admin.getDashboardStats()
      setStats(statsData)
    } catch (error) {
      console.error("Failed to update employer status:", error)
      const errorMessage = error.response?.data?.message || error.message || "Failed to update employer status"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const openDialog = (employer: any) => {
    setSelectedEmployer(employer)
    setDialogOpen(true)
  }

  const deleteJob = async (jobId: string) => {
    try {
      await admin.deleteJob(jobId)
      setJobs(jobs.filter((job) => job._id !== jobId))

      toast({
        title: "Job Deleted",
        description: "The job posting has been removed from the system.",
      })

      // Reload stats
      const statsData = await admin.getDashboardStats()
      setStats(statsData)
    } catch (error) {
      console.error("Failed to delete job:", error)
      toast({
        title: "Error",
        description: "Failed to delete job. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    try {
      await admin.deleteUser(userId)
      setUsers(users.filter((user) => user._id !== userId))

      toast({
        title: "User Deleted",
        description: "The user has been removed from the system.",
      })

      // Reload stats
      const statsData = await admin.getDashboardStats()
      setStats(statsData)
    } catch (error) {
      console.error("Failed to delete user:", error)
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete user"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const updateJobStatus = async (jobId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "closed" : "active"
      await admin.updateJobStatus(jobId, newStatus)

      // Update local state
      setJobs(jobs.map((job) => (job._id === jobId ? { ...job, status: newStatus } : job)))

      toast({
        title: "Job Status Updated",
        description: `Job status has been updated to ${newStatus}.`,
      })

      // Reload stats
      const statsData = await admin.getDashboardStats()
      setStats(statsData)
    } catch (error) {
      console.error("Failed to update job status:", error)
      const errorMessage = error.response?.data?.message || error.message || "Failed to update job status"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const viewDocument = (url: string) => {
    if (url) {
      window.open(url, "_blank")
    } else {
      toast({
        title: "Document Not Available",
        description: "No document was uploaded for this item.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-job-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage employers, users, and job postings</p>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Job Seekers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.jobSeekers || 0}</div>
                <p className="text-xs text-muted-foreground">Registered job seekers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Employers</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.approvedEmployers || 0}</div>
                <p className="text-xs text-muted-foreground">Active employers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingEmployers || 0}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeJobs || 0}</div>
                <p className="text-xs text-muted-foreground">Job postings</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="employers" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="employers">Employer Approvals</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="jobs">Job Postings</TabsTrigger>
            </TabsList>

            <TabsContent value="employers" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Employer Registrations</h2>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
                    {employers.filter((e) => e.status === "pending").length} Pending
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                    {employers.filter((e) => e.status === "approved").length} Approved
                  </Badge>
                  <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100">
                    {employers.filter((e) => e.status === "rejected").length} Rejected
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
                    <TableRow key={employer._id}>
                      <TableCell className="font-medium">{employer.fullName || employer.companyName}</TableCell>
                      <TableCell>{employer.email}</TableCell>
                      <TableCell>{employer.location}</TableCell>
                      <TableCell>{formatDate(employer.createdAt)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            employer.status === "approved"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : employer.status === "rejected"
                                ? "bg-red-100 text-red-800 hover:bg-red-200"
                                : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          }
                        >
                          {employer.status.charAt(0).toUpperCase() + employer.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => openDialog(employer)}>
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="users" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">User Management</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "employer"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.status === "active"
                              ? "bg-green-100 text-green-800"
                              : user.status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="mr-2">
                            Edit
                          </Button>
                          {user.role !== "admin" && (
                            <Button size="sm" variant="destructive" onClick={() => deleteUser(user._id)}>
                              Delete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="jobs" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Job Postings</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Posted Date</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job._id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.company?.fullName || job.company?.companyName}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            job.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }
                        >
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(job.createdAt)}</TableCell>
                      <TableCell>{job.applicationsCount || 0}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="mr-2"
                            onClick={() => updateJobStatus(job._id, job.status)}
                          >
                            {job.status === "active" ? "Deactivate" : "Activate"}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteJob(job._id)}>
                            Delete
                          </Button>
                        </div>
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
                      <p>{selectedEmployer.fullName || selectedEmployer.companyName}</p>
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
                      <p>{formatDate(selectedEmployer.createdAt)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Current Status</p>
                      <Badge
                        className={
                          selectedEmployer.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : selectedEmployer.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                        }
                      >
                        {selectedEmployer.status.charAt(0).toUpperCase() + selectedEmployer.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  {selectedEmployer.businessLicense && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <p className="text-sm font-medium text-gray-500 mb-1">Business License</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Business License Document</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewDocument(selectedEmployer.businessLicense)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <DialogFooter className="flex gap-2">
                {selectedEmployer?.status !== "rejected" && (
                  <Button variant="destructive" onClick={() => handleStatusChange(selectedEmployer?._id, "rejected")}>
                    Reject
                  </Button>
                )}
                {selectedEmployer?.status !== "approved" && (
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleStatusChange(selectedEmployer?._id, "approved")}
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
      </div>

      <Footer />
    </div>
  )
}

export default AdminDashboard
