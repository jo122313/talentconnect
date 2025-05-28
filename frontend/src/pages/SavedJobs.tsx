"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Building, Bookmark, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { savedJobs } from "@/services/api"

interface SavedJob {
  _id: string
  job: {
    _id: string
    title: string
    description: string
    location: string
    type: string
    salary?: {
      min: number
      max: number
      currency: string
    }
    company: {
      fullName?: string
      companyName?: string
    }
    createdAt: string
  }
  createdAt: string
}

const SavedJobs = () => {
  const { toast } = useToast()
  const [savedJobsList, setSavedJobsList] = useState<SavedJob[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)

  useEffect(() => {
    loadSavedJobs()
  }, [])

  const loadSavedJobs = async () => {
    try {
      setLoading(true)
      const response = await savedJobs.getAll()
      setSavedJobsList(response.savedJobs || [])
    } catch (error) {
      console.error("Failed to load saved jobs:", error)
      toast({
        title: "Error",
        description: "Failed to load saved jobs.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (jobId: string) => {
    setRemoving(jobId)
    try {
      await savedJobs.remove(jobId)
      setSavedJobsList((prev) => prev.filter((item) => item.job._id !== jobId))
      toast({
        title: "Job Removed",
        description: "Job removed from your saved list.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove job.",
        variant: "destructive",
      })
    } finally {
      setRemoving(null)
    }
  }

  const formatSalary = (salary?: { min: number; max: number; currency: string }) => {
    if (!salary || !salary.min || !salary.max) return "Competitive"
    return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="bg-gradient-to-br from-job-blue to-job-purple text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Saved Jobs</h1>
            <p className="text-xl text-blue-100">
              {loading ? "Loading..." : `${savedJobsList.length} jobs saved for later`}
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50 dark:bg-gray-900 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : savedJobsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobsList.map((savedJob) => (
                <Card key={savedJob._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{savedJob.job.title}</CardTitle>
                        <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1">
                          <Building className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {savedJob.job.company?.fullName || savedJob.job.company?.companyName}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(savedJob.job._id)}
                        disabled={removing === savedJob.job._id}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{savedJob.job.location}</span>
                      </div>

                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">Posted {formatDate(savedJob.job.createdAt)}</span>
                      </div>

                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Bookmark className="h-4 w-4 mr-1" />
                        <span className="text-sm">Saved {formatDate(savedJob.createdAt)}</span>
                      </div>

                      <Badge variant="secondary">{savedJob.job.type}</Badge>

                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <strong>Salary:</strong> {formatSalary(savedJob.job.salary)}
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {savedJob.job.description.substring(0, 100)}...
                      </p>

                      <Link to={`/jobs/${savedJob.job._id}`}>
                        <Button className="w-full bg-job-blue hover:bg-job-purple">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Saved Jobs</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You haven't saved any jobs yet. Start browsing and save jobs you're interested in!
              </p>
              <Link to="/jobs">
                <Button className="bg-job-blue hover:bg-job-purple">Browse Jobs</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default SavedJobs
