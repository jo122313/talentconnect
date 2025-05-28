"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { user, auth } from "@/services/api"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { User } from "lucide-react"

const Profile = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    location: "",
    skills: "",
    experience: "",
    education: "",
    companyDescription: "",
    website: "",
  })

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const [authResponse, profileResponse] = await Promise.all([auth.getCurrentUser(), user.getProfile()])
      
      console.log('Auth Response:', authResponse)
      console.log('Profile Response:', profileResponse)

      if (!authResponse?.user) {
        throw new Error('No user data in auth response')
      }

      setCurrentUser(authResponse.user)
      
      // Ensure we have valid profile data
      if (!profileResponse) {
        throw new Error('No profile data received')
      }

      const userData = profileResponse

      setFormData({
        fullName: userData?.fullName || authResponse.user.fullName || "",
        phone: userData?.phone || "",
        location: userData?.location || "",
        skills: Array.isArray(userData?.skills) ? userData.skills.join(", ") : userData?.skills || "",
        experience: userData?.experience || "",
        education: userData?.education || "",
        companyDescription: userData?.companyDescription || "",
        website: userData?.website || "",
      })
    } catch (error) {
      console.error("Failed to load profile:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)

    try {
      const updateData = new FormData()
      
      // Append non-empty fields to FormData
      if (formData.fullName) updateData.append('fullName', formData.fullName)
      if (formData.phone) updateData.append('phone', formData.phone)
      if (formData.location) updateData.append('location', formData.location)
      if (formData.skills) updateData.append('skills', formData.skills)
      if (formData.experience) updateData.append('experience', formData.experience)
      if (formData.education) updateData.append('education', formData.education)
      if (formData.companyDescription) updateData.append('companyDescription', formData.companyDescription)
      if (formData.website) updateData.append('website', formData.website)

      await user.updateProfile(updateData)

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })

      // Reload profile data
      loadUserProfile()
    } catch (error: any) {
      console.error("Failed to update profile:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
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
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your account information</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {(currentUser?.role === "employer" || currentUser?.role === "jobseeker") && (
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="Enter your location"
                      />
                    </div>
                  )}

                  {currentUser?.role === "employer" && (
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        placeholder="https://yourcompany.com"
                      />
                    </div>
                  )}
                </div>

                {currentUser?.role === "jobseeker" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills</Label>
                      <Input
                        id="skills"
                        value={formData.skills}
                        onChange={(e) => handleInputChange("skills", e.target.value)}
                        placeholder="JavaScript, React, Node.js (comma separated)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience</Label>
                      <Textarea
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => handleInputChange("experience", e.target.value)}
                        placeholder="Describe your work experience"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="education">Education</Label>
                      <Textarea
                        id="education"
                        value={formData.education}
                        onChange={(e) => handleInputChange("education", e.target.value)}
                        placeholder="Describe your educational background"
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {currentUser?.role === "employer" && (
                  <div className="space-y-2">
                    <Label htmlFor="companyDescription">Company Description</Label>
                    <Textarea
                      id="companyDescription"
                      value={formData.companyDescription}
                      onChange={(e) => handleInputChange("companyDescription", e.target.value)}
                      placeholder="Describe your company"
                      rows={4}
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <Button type="submit" disabled={updating} className="bg-job-blue hover:bg-job-purple">
                    {updating ? "Updating..." : "Update Profile"}
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

export default Profile
