"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Eye, Mail, FileText, Plus, Briefcase, Users, Clock, TrendingUp } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { employer, auth } from "@/services/api"

interface Job {
  _id: string
  title: string
  description: string
  requirements: string
  location: string
  type: string
  status: string
  createdAt: string
  applicationsCount: number
  salary?: {
    min: number
    max: number
    currency: string
  }
  experience?: string
  education?: string
  skills?: string[]
  benefits?: string[]
}

interface Application {
  _id: string
  job: {
    _id: string
    title: string
    location: string
    type: string
  }
  applicant: {
    _id: string
    fullName: string
    email: string
    phone?: string
    resume?: string
    skills?: string[]
    experience?: string
    education?: string
  }
  status: string
  createdAt: string
  coverLetter?: string
  notes?: string
  interviewDate?: string
}

interface Stats {
  activeJobs: number
  totalJobs: number
  totalApplications: number
  interviewsScheduled: number
}

const EmployerDashboard = () => {
  const { toast } = useToast()
  const navigate = useNavigate()

  // State for data
  const [stats, setStats] = useState<Stats>({
    activeJobs: 0,
    totalJobs: 0,
    totalApplications: 0,
    interviewsScheduled: 0,
  })
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // UI State
  const [newJobDialogOpen, setNewJobDialogOpen] = useState(false)
  const [candidateDetailsOpen, setCandidateDetailsOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Application | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Form states for new job
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    type: "Full-time",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
    experience: "",
    education: "",
    skills: "",
    benefits: "",
  })

  useEffect(() => {
    checkEmployerAuth()
  }, [])

  const checkEmployerAuth = async () => {
    try {
      const response = await auth.getCurrentUser()
      if (response.user.role !== "employer") {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        })
        navigate("/")
        return
      }

      if (response.user.status === "pending") {
        navigate("/employer-pending")
        return
      }

      if (response.user.status !== "approved") {
        toast({
          title: "Account Not Approved",
          description: "Your employer account is not approved yet.",
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
      const [statsData, jobsData, applicationsData] = await Promise.all([
        employer.getDashboardStats(),
        employer.getJobs({ limit: 50 }),
        employer.getApplications({ limit: 50 }),
      ])

      setStats(statsData)
      setJobs(jobsData.jobs || [])
      setApplications(applicationsData.applications || [])
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

  const handleNewJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Prepare job data
      const jobData: any = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        type: formData.type,
      }

      // Add optional fields
      if (formData.experience) jobData.experience = formData.experience
      if (formData.education) jobData.education = formData.education

      if (formData.skills) {
        jobData.skills = formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      }

      if (formData.benefits) {
        jobData.benefits = formData.benefits
          .split(",")
          .map((benefit) => benefit.trim())
          .filter(Boolean)
      }

      // Add salary if provided
      if (formData.salaryMin && formData.salaryMax) {
        jobData.salary = {
          min: Number.parseInt(formData.salaryMin),
          max: Number.parseInt(formData.salaryMax),
          currency: "USD",
        }
      }

      await employer.createJob(jobData)

      setNewJobDialogOpen(false)

      // Reset form
      setFormData({
        title: "",
        location: "",
        type: "Full-time",
        description: "",
        requirements: "",
        salaryMin: "",
        salaryMax: "",
        experience: "",
        education: "",
        skills: "",
        benefits: "",
      })

      toast({
        title: "Job Posted",
        description: "Your job has been published successfully.",
      })

      // Reload data
      loadDashboardData()
    } catch (error) {
      console.error("Failed to post job:", error)
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const viewCandidate = (application: Application) => {
    setSelectedCandidate(application)
    setCandidateDetailsOpen(true)
  }

  const updateCandidateStatus = async (applicationId: string, newStatus: string, notes?: string) => {
    try {
      await employer.updateApplicationStatus(applicationId, newStatus, notes)

      // Update local state
      setApplications(
        applications.map((app) => (app._id === applicationId ? { ...app, status: newStatus, notes } : app)),
      )

      toast({
        title: "Status Updated",
        description: `Candidate status changed to ${newStatus}.`,
      })

      // Reload stats
      const statsData = await employer.getDashboardStats()
      setStats(statsData)
    } catch (error) {
      console.error("Failed to update application status:", error)
      toast({
        title: "Error",
        description: "Failed to update candidate status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleJobStatus = async (jobId: string, currentStatus: string) => {
    try {
      await employer.toggleJobStatus(jobId)

      // Update local state
      const newStatus = currentStatus === "active" ? "closed" : "active"
      setJobs(jobs.map((job) => (job._id === jobId ? { ...job, status: newStatus } : job)))

      toast({
        title: "Job Status Updated",
        description: `Job listing is now ${newStatus}.`,
      })

      // Reload stats
      const statsData = await employer.getDashboardStats()
      setStats(statsData)
    } catch (error) {
      console.error("Failed to toggle job status:", error)
      toast({
        title: "Error",
        description: "Failed to update job status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      return
    }

    try {
      await employer.deleteJob(jobId)

      // Update local state
      setJobs(jobs.filter((job) => job._id !== jobId))

      toast({
        title: "Job Deleted",
        description: "Job listing has been removed.",
      })

      // Reload stats
      const statsData = await employer.getDashboardStats()
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatSalary = (salary?: { min: number; max: number; currency: string }) => {
    if (!salary || !salary.min || !salary.max) return "Not specified"
    return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`
  }

  const viewResume = (resumeUrl?: string) => {
    if (resumeUrl) {
      window.open(resumeUrl, "_blank")
    } else {
      toast({
        title: "Resume Not Available",
        description: "No resume was uploaded by this candidate.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employer Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage job postings and candidate applications</p>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeJobs}</div>
                <p className="text-xs text-muted-foreground">Currently listed positions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalJobs}</div>
                <p className="text-xs text-muted-foreground">All job postings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalApplications}</div>
                <p className="text-xs text-muted-foreground">Candidates who applied</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.interviewsScheduled}</div>
                <p className="text-xs text-muted-foreground">Candidates in interview stage</p>
              </CardContent>
            </Card>
          </div>

          <Button onClick={() => setNewJobDialogOpen(true)} className="mb-8 bg-job-blue hover:bg-job-purple">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>

          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="jobs">Job Listings ({jobs.length})</TabsTrigger>
              <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Job Listings</h2>
              {jobs.length > 0 ? (
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
                      <TableRow key={job._id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>{job.type}</TableCell>
                        <TableCell>{formatDate(job.createdAt)}</TableCell>
                        <TableCell>{job.applicationsCount || 0}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              job.status === "active"
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }
                          >
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => toggleJobStatus(job._id, job.status)}>
                              {job.status === "active" ? "Close" : "Reopen"}
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
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Jobs Posted Yet</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Start by posting your first job to attract talented candidates.
                  </p>
                  <Button onClick={() => setNewJobDialogOpen(true)} className="bg-job-blue hover:bg-job-purple">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Your First Job
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="applications" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Candidate Applications</h2>
              {applications.length > 0 ? (
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
                      <TableRow key={application._id}>
                        <TableCell className="font-medium">{application.applicant.fullName}</TableCell>
                        <TableCell>{application.applicant.email}</TableCell>
                        <TableCell>{application.job.title}</TableCell>
                        <TableCell>{formatDate(application.createdAt)}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              application.status === "hired"
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : application.status === "rejected"
                                  ? "bg-red-100 text-red-800 hover:bg-red-200"
                                  : application.status === "interview"
                                    ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            }
                          >
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => viewCandidate(application)}>
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>

                            {application.status === "applied" && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-purple-600 hover:bg-purple-700"
                                  onClick={() => updateCandidateStatus(application._id, "interview")}
                                >
                                  <Mail className="h-4 w-4 mr-1" /> Interview
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateCandidateStatus(application._id, "rejected")}
                                >
                                  Reject
                                </Button>
                              </>
                            )}

                            {application.status === "interview" && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => updateCandidateStatus(application._id, "hired")}
                                >
                                  Hire
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateCandidateStatus(application._id, "rejected")}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Applications Yet</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Applications will appear here when candidates apply to your job postings.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Post New Job Dialog */}
          <Dialog open={newJobDialogOpen} onOpenChange={setNewJobDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Post a New Job</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleNewJobSubmit} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Job Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience Level</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => handleInputChange("experience", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entry Level">Entry Level</SelectItem>
                        <SelectItem value="1-3 years">1-3 years</SelectItem>
                        <SelectItem value="3-5 years">3-5 years</SelectItem>
                        <SelectItem value="5-10 years">5-10 years</SelectItem>
                        <SelectItem value="10+ years">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salaryMin">Min Salary (USD)</Label>
                    <Input
                      id="salaryMin"
                      type="number"
                      value={formData.salaryMin}
                      onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                      placeholder="50000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salaryMax">Max Salary (USD)</Label>
                    <Input
                      id="salaryMax"
                      type="number"
                      value={formData.salaryMax}
                      onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                      placeholder="80000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements *</Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => handleInputChange("requirements", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Required Skills (comma separated)</Label>
                  <Input
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => handleInputChange("skills", e.target.value)}
                    placeholder="JavaScript, React, Node.js"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="benefits">Benefits (comma separated)</Label>
                  <Input
                    id="benefits"
                    value={formData.benefits}
                    onChange={(e) => handleInputChange("benefits", e.target.value)}
                    placeholder="Health insurance, Remote work, Flexible hours"
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setNewJobDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="bg-job-blue hover:bg-job-purple">
                    {submitting ? "Posting..." : "Post Job"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Candidate Details Sheet */}
          <Sheet open={candidateDetailsOpen} onOpenChange={setCandidateDetailsOpen}>
            <SheetContent className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Candidate Details</SheetTitle>
                <SheetDescription>Review candidate information and resume</SheetDescription>
              </SheetHeader>

              {selectedCandidate && (
                <div className="py-6">
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-gray-500">Name</h4>
                      <p className="text-base font-medium">{selectedCandidate.applicant.fullName}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-gray-500">Email</h4>
                      <p className="text-base">{selectedCandidate.applicant.email}</p>
                    </div>

                    {selectedCandidate.applicant.phone && (
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                        <p className="text-base">{selectedCandidate.applicant.phone}</p>
                      </div>
                    )}

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-gray-500">Applied For</h4>
                      <p className="text-base">{selectedCandidate.job.title}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-gray-500">Application Date</h4>
                      <p className="text-base">{formatDate(selectedCandidate.createdAt)}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      <Badge
                        className={
                          selectedCandidate.status === "hired"
                            ? "bg-green-100 text-green-800"
                            : selectedCandidate.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : selectedCandidate.status === "interview"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                        }
                      >
                        {selectedCandidate.status.charAt(0).toUpperCase() + selectedCandidate.status.slice(1)}
                      </Badge>
                    </div>

                    {selectedCandidate.applicant.skills && selectedCandidate.applicant.skills.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-gray-500">Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedCandidate.applicant.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedCandidate.applicant.experience && (
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-gray-500">Experience</h4>
                        <p className="text-sm">{selectedCandidate.applicant.experience}</p>
                      </div>
                    )}

                    {selectedCandidate.coverLetter && (
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-gray-500">Cover Letter</h4>
                        <p className="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                          {selectedCandidate.coverLetter}
                        </p>
                      </div>
                    )}

                    {selectedCandidate.applicant.resume && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium">Resume</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewResume(selectedCandidate.applicant.resume)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-500">Actions</h4>
                      <div className="flex flex-col gap-2">
                        {selectedCandidate.status === "applied" && (
                          <>
                            <Button
                              onClick={() => updateCandidateStatus(selectedCandidate._id, "interview")}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              <Mail className="h-4 w-4 mr-2" /> Schedule Interview
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => updateCandidateStatus(selectedCandidate._id, "rejected")}
                            >
                              Reject Application
                            </Button>
                          </>
                        )}

                        {selectedCandidate.status === "interview" && (
                          <>
                            <Button
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => updateCandidateStatus(selectedCandidate._id, "hired")}
                            >
                              Hire Candidate
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => updateCandidateStatus(selectedCandidate._id, "rejected")}
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

      <Footer />
    </div>
  )
}

export default EmployerDashboard
