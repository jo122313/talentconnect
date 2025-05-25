"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Building, Briefcase, Globe } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { jobs } from "@/services/api"

interface Company {
  _id: string
  fullName?: string
  companyName?: string
  location?: string
  website?: string
  companyDescription?: string
  createdAt: string
  jobCount: number
  activeJobs: number
  recentJobs: any[]
}

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([])

  useEffect(() => {
    loadCompanies()
  }, [])

  useEffect(() => {
    // Filter companies based on search term
    if (searchTerm.trim()) {
      const filtered = companies.filter(
        (company) =>
          company.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.location?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredCompanies(filtered)
    } else {
      setFilteredCompanies(companies)
    }
  }, [searchTerm, companies])

  const loadCompanies = async () => {
    try {
      setLoading(true)

      // Get all jobs to extract company information
      const jobsResponse = await jobs.getAll({
        limit: 1000, // Get all jobs
      })

      // Group jobs by company and create company objects
      const companyMap = new Map()

      jobsResponse.jobs.forEach((job: any) => {
        const companyId = job.company._id
        const companyInfo = job.company

        if (!companyMap.has(companyId)) {
          companyMap.set(companyId, {
            _id: companyId,
            fullName: companyInfo.fullName,
            companyName: companyInfo.companyName,
            location: companyInfo.location,
            website: companyInfo.website,
            companyDescription: companyInfo.companyDescription,
            createdAt: companyInfo.createdAt || new Date().toISOString(),
            jobCount: 0,
            activeJobs: 0,
            recentJobs: [],
          })
        }

        const company = companyMap.get(companyId)
        company.jobCount++

        if (job.status === "active") {
          company.activeJobs++
        }

        // Add to recent jobs (limit to 3)
        if (company.recentJobs.length < 3) {
          company.recentJobs.push(job)
        }
      })

      const companiesArray = Array.from(companyMap.values())
      setCompanies(companiesArray)
      setFilteredCompanies(companiesArray)
    } catch (error) {
      console.error("Failed to load companies:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header Section */}
      <section className="bg-gradient-to-br from-job-blue to-job-purple text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Explore Companies</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover amazing companies and their job opportunities
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search companies by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCompanies.length > 0 ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {filteredCompanies.length} Companies Found
                </h2>
                <p className="text-gray-600 dark:text-gray-300">Browse through our network of verified employers</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.map((company) => (
                  <Card key={company._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{company.fullName || company.companyName}</h3>
                          {company.location && (
                            <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">{company.location}</span>
                            </div>
                          )}
                        </div>
                        <Building className="h-8 w-8 text-job-blue" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Company Stats */}
                        <div className="flex justify-between text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-job-blue">{company.activeJobs}</div>
                            <div className="text-gray-600 dark:text-gray-300">Active Jobs</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-job-blue">{company.jobCount}</div>
                            <div className="text-gray-600 dark:text-gray-300">Total Jobs</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-job-blue">{formatDate(company.createdAt)}</div>
                            <div className="text-gray-600 dark:text-gray-300">Joined</div>
                          </div>
                        </div>

                        {/* Company Description */}
                        {company.companyDescription && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {company.companyDescription}
                          </p>
                        )}

                        {/* Website */}
                        {company.website && (
                          <div className="flex items-center text-sm text-job-blue">
                            <Globe className="h-4 w-4 mr-1" />
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              Visit Website
                            </a>
                          </div>
                        )}

                        {/* Recent Jobs */}
                        {company.recentJobs && company.recentJobs.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recent Jobs:</h4>
                            <div className="space-y-1">
                              {company.recentJobs.map((job: any) => (
                                <Link
                                  key={job._id}
                                  to={`/jobs/${job._id}`}
                                  className="block text-sm text-job-blue hover:underline"
                                >
                                  {job.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* View Jobs Button */}
                        <Link to={`/jobs?search=${encodeURIComponent(company.fullName || company.companyName || "")}`}>
                          <Button className="w-full bg-job-blue hover:bg-job-purple">
                            <Briefcase className="h-4 w-4 mr-2" />
                            View All Jobs ({company.activeJobs})
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Companies Found</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "No companies have posted jobs yet. Check back soon!"}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Companies
