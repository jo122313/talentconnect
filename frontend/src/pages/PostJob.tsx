"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { employer } from "@/services/api"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Briefcase, MapPin, DollarSign } from "lucide-react"

interface JobData {
  title: string
  description: string
  requirements: string
  location: string
  type: string
  experience: string
  education: string
  skills: string[]
  benefits: string[]
  salary?: {
    min: number
    max: number
    currency: string
  }
  applicationDeadline?: Date
}

const PostJob = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    type: "",
    salaryMin: "",
    salaryMax: "",
    experience: "",
    education: "",
    skills: "",
    benefits: "",
    applicationDeadline: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Prepare job data
      const jobData: JobData = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        type: formData.type,
        experience: formData.experience,
        education: formData.education,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        benefits: formData.benefits
          .split(",")
          .map((benefit) => benefit.trim())
          .filter(Boolean),
      }

      // Add salary if provided
      if (formData.salaryMin && formData.salaryMax) {
        jobData.salary = {
          min: Number.parseInt(formData.salaryMin),
          max: Number.parseInt(formData.salaryMax),
          currency: "USD",
        }
      }

      // Add application deadline if provided
      if (formData.applicationDeadline) {
        jobData.applicationDeadline = new Date(formData.applicationDeadline)
      }

      await employer.createJob(jobData)

      toast({
        title: "Success",
        description: "Job posted successfully!",
      })

      navigate("/employer/dashboard")
    } catch (error) {
      console.error("Failed to post job:", error)
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Post a New Job</h1>
            <p className="text-gray-600 dark:text-gray-300">Find the perfect candidate for your team</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="e.g. New York, NY"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Job Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
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

                  <div className="space-y-2">
                    <Label htmlFor="education">Education Level</Label>
                    <Select value={formData.education} onValueChange={(value) => handleInputChange("education", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High School">High School</SelectItem>
                        <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                        <SelectItem value="Bachelor Degree">Bachelor Degree</SelectItem>
                        <SelectItem value="Master Degree">Master Degree</SelectItem>
                        <SelectItem value="PhD">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="applicationDeadline">Application Deadline</Label>
                    <Input
                      id="applicationDeadline"
                      type="date"
                      value={formData.applicationDeadline}
                      onChange={(e) => handleInputChange("applicationDeadline", e.target.value)}
                    />
                  </div>
                </div>

                {/* Salary Range */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Salary Range (USD)
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Minimum salary"
                      type="number"
                      value={formData.salaryMin}
                      onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                    />
                    <Input
                      placeholder="Maximum salary"
                      type="number"
                      value={formData.salaryMax}
                      onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                    rows={6}
                    required
                  />
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements *</Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => handleInputChange("requirements", e.target.value)}
                    placeholder="List the required skills, qualifications, and experience..."
                    rows={4}
                    required
                  />
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <Label htmlFor="skills">Required Skills</Label>
                  <Input
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => handleInputChange("skills", e.target.value)}
                    placeholder="JavaScript, React, Node.js, Python (comma separated)"
                  />
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  <Label htmlFor="benefits">Benefits & Perks</Label>
                  <Input
                    id="benefits"
                    value={formData.benefits}
                    onChange={(e) => handleInputChange("benefits", e.target.value)}
                    placeholder="Health insurance, Remote work, Flexible hours (comma separated)"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/employer/dashboard")}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-job-blue hover:bg-job-purple">
                    {loading ? "Posting..." : "Post Job"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default PostJob
