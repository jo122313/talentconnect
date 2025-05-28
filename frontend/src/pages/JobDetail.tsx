
"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Calendar,
  Users,
  GraduationCap,
  Check,
  Bookmark,
  Share2,
  Flag,
  ArrowLeft,
  Building,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { jobs, auth, savedJobs } from "@/services/api"

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
  viewsCount: number
  salary?: {
    min: number
    max: number
    currency: string
  }
  experience?: string
  education?: string
  skills?: string[]
  benefits?: string[]
  company: {
    _id: string
    fullName: string
    companyName?: string
    location?: string
    website?: string
    companyDescription?: string
  }
  applicationDeadline?: string
}

interface ApplicationStatus {
  hasApplied: boolean
  status?: string
  appliedDate?: string
}

const JobDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>({ hasApplied: false })
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [applying, setApplying] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  // Enhanced application form state
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    gpa: "",
    experienceLevel: "",
    education: "",
    university: "",
    graduationDate: "",
  })

  useEffect(() => {
    if (id) {
      loadJobDetails()
      checkCurrentUser()
    }
  }, [id])

  useEffect(() => {
    if (currentUser?.role === "jobseeker" && id) {
      checkSavedStatus()
    }
  }, [currentUser, id])

  const checkCurrentUser = async () => {
    try {
      const response = await auth.getCurrentUser()
      setCurrentUser(response.user)

      // Check application status if user is a job seeker
      if (response.user.role === "jobseeker" && id) {
        const appStatus = await jobs.getApplicationStatus(id)
        setApplicationStatus(appStatus)
      }
    } catch (error) {
      // User not logged in, that's okay
      console.log("User not logged in")
    }
  }

  const loadJobDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!id) {
        setError("Job ID not provided")
        return
      }

      const response = await jobs.getById(id)
      setJob(response.job)
    } catch (error: any) {
      console.error("Failed to load job details:", error)
      setError(error.response?.data?.message || "Failed to load job details")
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please login to apply for this job.",
        variant: "destructive",
      })
      navigate("/login")
      return
    }

    if (currentUser.role !== "jobseeker") {
      toast({
        title: "Access Denied",
        description: "Only job seekers can apply for jobs.",
        variant: "destructive",
      })
      return
    }

    // Validate required fields
    if (!applicationData.gpa || !applicationData.experienceLevel || !applicationData.education) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (GPA, Experience Level, Education).",
        variant: "destructive",
      })
      return
    }

    // Validate GPA format
    const gpaValue = parseFloat(applicationData.gpa)
    if (isNaN(gpaValue) || gpaValue < 0 || gpaValue > 4.0) {
      toast({
        title: "Invalid GPA",
        description: "Please enter a valid GPA between 0.0 and 4.0.",
        variant: "destructive",
      })
      return
    }

    setApplying(true)

    try {
      // Submit application with enhanced data
      await jobs.apply(id!, {
        coverLetter: applicationData.coverLetter,
        gpa: applicationData.gpa,
        experienceLevel: applicationData.experienceLevel,
        education: applicationData.education,
        university: applicationData.university,
        graduationDate: applicationData.graduationDate,
      })

      setApplicationStatus({ hasApplied: true, status: "applied", appliedDate: new Date().toISOString() })
      setShowApplicationForm(false)
      setApplicationData({
        coverLetter: "",
        gpa: "",
        experienceLevel: "",
        education: "",
        university: "",
        graduationDate: "",
      })

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
      })

      // Update applications count
      if (job) {
        setJob({ ...job, applicationsCount: job.applicationsCount + 1 })
      }
    } catch (error: any) {
      console.error("Failed to apply:", error)
      toast({
        title: "Application Failed",
        description: error.response?.data?.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setApplying(false)
    }
  }

  const handleApplicationDataChange = (field: string, value: string) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatSalary = (salary?: { min: number; max: number; currency: string }) => {
    if (!salary || !salary.min || !salary.max) return "Salary not specified"
    return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const posted = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} days ago`
    }
  }

  const checkSavedStatus = async () => {
    if (currentUser?.role === "jobseeker" && id) {
      try {
        const status = await savedJobs.checkStatus(id)
        setIsSaved(status.isSaved)
      } catch (error) {
        console.log("Error checking saved status:", error)
      }
    }
  }

  const handleSaveJob = async () => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please login to save jobs.",
        variant: "destructive",
      })
      navigate("/login")
      return
    }

    if (currentUser.role !== "jobseeker") {
      toast({
        title: "Access Denied",
        description: "Only job seekers can save jobs.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      if (isSaved) {
        await savedJobs.remove(id!)
        setIsSaved(false)
        toast({
          title: "Job Removed",
          description: "Job removed from your saved list.",
        })
      } else {
        await savedJobs.save(id!)
        setIsSaved(true)
        toast({
          title: "Job Saved",
          description: "Job added to your saved list.",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save job.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-job-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading job details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The job you're looking for doesn't exist."}</p>
            <Button onClick={() => navigate("/jobs")} className="bg-job-blue hover:bg-job-purple">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-job-blue/10 py-8">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="h-16 w-16 rounded-md bg-gray-100 p-3 shrink-0 flex items-center justify-center">
                  <Building className="h-8 w-8 text-gray-400" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                      <p className="text-lg text-job-blue">{job.company.companyName || job.company.fullName}</p>
                      {job.status !== "active" && (
                        <Badge variant="secondary" className="mt-2">
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={handleSaveJob}
                        disabled={saving}
                        aria-label={isSaved ? "Remove from saved jobs" : "Save job"}
                      >
                        <Bookmark size={18} className={isSaved ? "fill-current text-job-blue" : ""} />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full" aria-label="Share job">
                        <Share2 size={18} />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full" aria-label="Report job">
                        <Flag size={18} />
                      </Button>

                      {applicationStatus.hasApplied ? (
                        <Button disabled className="bg-green-600">
                          Applied ({applicationStatus.status})
                        </Button>
                      ) : job.status === "active" ? (
                        <Button
                          onClick={() => setShowApplicationForm(true)}
                          className="bg-job-blue hover:bg-job-purple"
                        >
                          Apply Now
                        </Button>
                      ) : (
                        <Button disabled>No Longer Accepting Applications</Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin size={18} className="mr-2 text-gray-400" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Briefcase size={18} className="mr-2 text-gray-400" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign size={18} className="mr-2 text-gray-400" />
                      <span>{formatSalary(job.salary)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock size={18} className="mr-2 text-gray-400" />
                      <span>Posted {getTimeAgo(job.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="description">
                <TabsList className="mb-6">
                  <TabsTrigger value="description">Job Description</TabsTrigger>
                  <TabsTrigger value="company">Company</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-4">Job Description</h3>
                    <div className="whitespace-pre-wrap text-gray-700 mb-6">{job.description}</div>

                    <h3 className="text-lg font-semibold mb-4">Requirements</h3>
                    <div className="whitespace-pre-wrap text-gray-700">{job.requirements}</div>
                  </div>
                </TabsContent>

                <TabsContent value="company" className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-4">
                      About {job.company.companyName || job.company.fullName}
                    </h3>

                    {job.company.companyDescription ? (
                      <div className="whitespace-pre-wrap text-gray-700 mb-6">{job.company.companyDescription}</div>
                    ) : (
                      <p className="text-gray-600 mb-6">Company information will be available soon.</p>
                    )}

                    {job.company.website && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Website</h4>
                        <a
                          href={job.company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-job-blue hover:underline"
                        >
                          {job.company.website}
                        </a>
                      </div>
                    )}

                    {job.company.location && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                        <p className="text-gray-700">{job.company.location}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {showApplicationForm && !applicationStatus.hasApplied && (
                <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Apply for this position</h3>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="gpa">GPA *</Label>
                        <Input
                          id="gpa"
                          type="number"
                          step="0.01"
                          min="0"
                          max="4.0"
                          value={applicationData.gpa}
                          onChange={(e) => handleApplicationDataChange("gpa", e.target.value)}
                          placeholder="3.50"
                          className="mt-1"
                          aria-describedby="gpa-help"
                        />
                        <p id="gpa-help" className="text-xs text-gray-500 mt-1">Enter your GPA on a 4.0 scale</p>
                      </div>

                      <div>
                        <Label htmlFor="experienceLevel">Experience Level *</Label>
                        <Select
                          value={applicationData.experienceLevel}
                          onValueChange={(value) => handleApplicationDataChange("experienceLevel", value)}
                        >
                          <SelectTrigger className="mt-1" id="experienceLevel">
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Entry Level">Entry Level (0-1 years)</SelectItem>
                            <SelectItem value="Junior">Junior (1-3 years)</SelectItem>
                            <SelectItem value="Mid-Level">Mid-Level (3-5 years)</SelectItem>
                            <SelectItem value="Senior">Senior (5-10 years)</SelectItem>
                            <SelectItem value="Expert">Expert (10+ years)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="education">Education Level *</Label>
                        <Select
                          value={applicationData.education}
                          onValueChange={(value) => handleApplicationDataChange("education", value)}
                        >
                          <SelectTrigger className="mt-1" id="education">
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High School">High School</SelectItem>
                            <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                            <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                            <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                            <SelectItem value="PhD">PhD</SelectItem>
                            <SelectItem value="Professional Certification">Professional Certification</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="university">University/Institution</Label>
                        <Input
                          id="university"
                          value={applicationData.university}
                          onChange={(e) => handleApplicationDataChange("university", e.target.value)}
                          placeholder="e.g., Stanford University"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="graduationDate">Graduation Date</Label>
                      <Input
                        id="graduationDate"
                        type="month"
                        value={applicationData.graduationDate}
                        onChange={(e) => handleApplicationDataChange("graduationDate", e.target.value)}
                        className="mt-1"
                        aria-label="Select graduation month and year"
                      />
                    </div>

                    <div>
                      <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                      <Textarea
                        id="coverLetter"
                        value={applicationData.coverLetter}
                        onChange={(e) => handleApplicationDataChange("coverLetter", e.target.value)}
                        placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                        rows={6}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={handleApply} disabled={applying} className="bg-job-blue hover:bg-job-purple">
                        {applying ? "Submitting..." : "Submit Application"}
                      </Button>
                      <Button variant="outline" onClick={() => setShowApplicationForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Overview</h3>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar size={18} className="mr-3 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Posted</p>
                      <p className="text-gray-700">{formatDate(job.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Users size={18} className="mr-3 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Applications</p>
                      <p className="text-gray-700">{job.applicationsCount} candidates</p>
                    </div>
                  </div>

                  {job.experience && (
                    <div className="flex items-start">
                      <Briefcase size={18} className="mr-3 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="text-gray-700">{job.experience}</p>
                      </div>
                    </div>
                  )}

                  {job.education && (
                    <div className="flex items-start">
                      <GraduationCap size={18} className="mr-3 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Education</p>
                        <p className="text-gray-700">{job.education}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start">
                    <Clock size={18} className="mr-3 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Views</p>
                      <p className="text-gray-700">{job.viewsCount} views</p>
                    </div>
                  </div>
                </div>

                {job.skills && job.skills.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h3>

                    <div className="space-y-2">
                      {job.skills.map((skill, index) => (
                        <div key={index} className="flex items-center">
                          <Check size={16} className="mr-2 text-green-500" />
                          <span className="text-gray-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {job.benefits && job.benefits.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h3>

                    <div className="space-y-2">
                      {job.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center">
                          <Check size={16} className="mr-2 text-green-500" />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default JobDetail