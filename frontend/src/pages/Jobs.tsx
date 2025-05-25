"use client"

import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Clock, Building, Filter, Briefcase } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { jobs } from "@/services/api"

interface Job {
  _id: string
  title: string
  description: string
  location: string
  type: string
  experience?: string
  salary?: {
    min: number
    max: number
    currency: string
  }
  skills?: string[]
  company: {
    _id: string
    fullName?: string
    companyName?: string
  }
  createdAt: string
  applicationsCount?: number
}

interface Filters {
  search: string
  location: string
  type: string
  company: string
}

interface Pagination {
  currentPage: number
  totalPages: number
  total: number
}

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobsList, setJobsList] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    type: searchParams.get("type") || "All Types",
    company: searchParams.get("company") || "",
  })
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  })

  useEffect(() => {
    loadJobs()
  }, [filters])

  const loadJobs = async (page = 1) => {
    try {
      setLoading(true)

      const params: any = {
        page,
        limit: 12,
        ...filters,
      }

      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (!params[key] || params[key] === "All Types") delete params[key]
      })

      const response = await jobs.getAll(params)

      setJobsList(response.jobs || [])
      setPagination({
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1,
        total: response.total || 0,
      })
    } catch (error) {
      console.error("Failed to load jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // Update URL params
    const newSearchParams = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== "All Types") newSearchParams.set(k, v)
    })
    setSearchParams(newSearchParams)
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      type: "All Types",
      company: "",
    })
    setSearchParams(new URLSearchParams())
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

      {/* Header Section */}
      <section className="bg-gradient-to-br from-job-blue to-job-purple text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Job</h1>
            <p className="text-xl text-blue-100">
              {loading ? "Loading..." : `${pagination.total} opportunities waiting for you`}
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Location..."
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Types">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={clearFilters} className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
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
          ) : jobsList.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{pagination.total} Jobs Found</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobsList.map((job) => (
                  <Card key={job._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Building className="h-4 w-4 mr-1" />
                        <span className="text-sm">{job.company?.fullName || job.company?.companyName}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{job.location}</span>
                        </div>

                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm">{formatDate(job.createdAt)}</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{job.type}</Badge>
                          {job.experience && <Badge variant="outline">{job.experience}</Badge>}
                        </div>

                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          <strong>Salary:</strong> {formatSalary(job.salary)}
                        </div>

                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {job.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {job.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{job.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {job.description.substring(0, 100)}...
                        </p>

                        <Link to={`/jobs/${job._id}`}>
                          <Button className="w-full bg-job-blue hover:bg-job-purple">View Details</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => loadJobs(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    Previous
                  </Button>

                  {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={pagination.currentPage === page ? "default" : "outline"}
                        onClick={() => loadJobs(page)}
                        className={pagination.currentPage === page ? "bg-job-blue" : ""}
                      >
                        {page}
                      </Button>
                    )
                  })}

                  <Button
                    variant="outline"
                    onClick={() => loadJobs(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Jobs Found</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {Object.values(filters).some((f) => f && f !== "All Types")
                  ? "Try adjusting your search criteria"
                  : "No jobs have been posted yet. Check back soon!"}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Jobs
