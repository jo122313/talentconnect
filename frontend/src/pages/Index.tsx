"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Clock, Building, Users, Briefcase, TrendingUp } from "lucide-react"
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
  company: {
    _id: string
    fullName?: string
    companyName?: string
  }
  createdAt: string
}

interface Stats {
  totalJobs: number
  totalCompanies: number
  totalApplications: number
  topLocations: Array<{
    _id: string
    count: number
  }>
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([])
  const [stats, setStats] = useState<Stats>({
    totalJobs: 0,
    totalCompanies: 0,
    totalApplications: 0,
    topLocations: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHomePageData()
  }, [])

  const loadHomePageData = async () => {
    try {
      setLoading(true)
      const [featuredJobsData, statsData] = await Promise.all([jobs.getFeatured(), jobs.getStats()])

      setFeaturedJobs(featuredJobsData.jobs || [])
      setStats(statsData)
    } catch (error) {
      console.error("Failed to load home page data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchTerm.trim()) {
      window.location.href = `/jobs?search=${encodeURIComponent(searchTerm.trim())}`
    } else {
      window.location.href = "/jobs"
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-job-blue to-job-purple text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Dream Job
              <span className="block text-job-yellow">Today</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Connect with top employers and discover opportunities that match your skills
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search for jobs, companies, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10 py-3 text-gray-900"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="bg-job-yellow text-job-blue hover:bg-yellow-400 font-semibold"
                >
                  Search Jobs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Briefcase className="h-12 w-12 text-job-blue" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? "..." : stats.totalJobs.toLocaleString()}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Active Jobs</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Building className="h-12 w-12 text-job-blue" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? "..." : stats.totalCompanies.toLocaleString()}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Companies</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-job-blue" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? "..." : stats.totalApplications.toLocaleString()}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Applications</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-job-blue" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">95%</h3>
              <p className="text-gray-600 dark:text-gray-300">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Featured Jobs</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Discover the latest opportunities from top companies
            </p>
          </div>

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
          ) : featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
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
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Jobs Available</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Be the first to post a job! Companies can register and start posting opportunities.
              </p>
            </div>
          )}

          {featuredJobs.length > 0 && (
            <div className="text-center mt-12">
              <Link to="/jobs">
                <Button variant="outline" size="lg">
                  View All Jobs
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Top Locations */}
      {stats.topLocations && stats.topLocations.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Top Job Locations</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">Explore opportunities in these popular cities</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {stats.topLocations.map((location, index) => (
                <Link
                  key={index}
                  to={`/jobs?location=${encodeURIComponent(location._id)}`}
                  className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{location._id}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{location.count} jobs</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-job-blue to-job-purple text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of professionals who found their dream jobs through our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-job-yellow text-job-blue hover:bg-yellow-400 font-semibold">
                Find Jobs
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-job-blue"
              >
                Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Index
