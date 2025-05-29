"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Briefcase, Edit, FileText, Home, LayoutDashboard, MessageSquare, Settings, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { auth, user, savedJobs } from "@/services/api"

const UserDashboard = () => {
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [savedJobsList, setSavedJobsList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Loading dashboard data...")

      // Load user data
      const userResponse = await auth.getCurrentUser()
      console.log("User response:", userResponse)
      setCurrentUser(userResponse.user || userResponse)

      // Load dashboard stats
      try {
        const statsResponse = await user.getDashboardStats()
        console.log("Stats response:", statsResponse)
        setDashboardStats(statsResponse)
      } catch (statsError) {
        console.error("Failed to load stats:", statsError)
        // Continue without stats
      }

      // Load applications
      try {
        const appsResponse = await user.getApplications({ limit: 5 })
        console.log("Applications response:", appsResponse)
        setApplications(appsResponse.applications || [])
      } catch (appsError) {
        console.error("Failed to load applications:", appsError)
        // Continue without applications
      }

      // Load saved jobs
      try {
        const savedResponse = await savedJobs.getAll({ limit: 5 })
        console.log("Saved jobs response:", savedResponse)
        setSavedJobsList(savedResponse.savedJobs || [])
      } catch (savedError) {
        console.error("Failed to load saved jobs:", savedError)
        // Continue without saved jobs
      }
    } catch (error: any) {
      console.error("Failed to load dashboard data:", error)
      setError(error.response?.data?.message || "Failed to load dashboard data")
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateProfileCompletion = () => {
    if (!currentUser) return 0

    let completed = 0
    const total = 6

    if (currentUser.fullName) completed++
    if (currentUser.email) completed++
    if (currentUser.phone) completed++
    if (currentUser.resume) completed++
    if (currentUser.skills && currentUser.skills.length > 0) completed++
    if (currentUser.experience) completed++

    return Math.round((completed / total) * 100)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-full bg-gray-50 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => (window.location.href = "/")}>Go to Home</Button>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <UserSidebar currentUser={currentUser} />
        <div className="flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center justify-between">
              <h1 className="text-xl font-semibold">Candidate Dashboard</h1>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Link to="/">Go to Home</Link>
                </Button>
              </div>
            </div>
          </header>

          <main className="p-6">
            <div className="grid gap-6">
              <section className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={currentUser?.profilePicture || "/placeholder.svg"}
                          alt={currentUser?.fullName}
                        />
                        <AvatarFallback>
                          {currentUser?.fullName
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <h2 className="mt-4 text-xl font-semibold">{currentUser?.fullName || "User"}</h2>
                      <p className="text-muted-foreground">{currentUser?.experience || "Job Seeker"}</p>
                      <p className="text-sm text-muted-foreground">{currentUser?.location || "Location not set"}</p>

                      <div className="mt-6 w-full">
                        <div className="flex justify-between text-sm">
                          <span>Profile Completion</span>
                          <span>{calculateProfileCompletion()}%</span>
                        </div>
                        <Progress className="mt-2" value={calculateProfileCompletion()} />
                      </div>

                      <Button className="mt-6 w-full" asChild>
                        <Link to="/profile">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Application Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="rounded-lg border p-3">
                        <div className="text-2xl font-bold">{dashboardStats?.totalApplications || 0}</div>
                        <p className="text-xs text-muted-foreground">Total Applications</p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-2xl font-bold">{dashboardStats?.interviews || 0}</div>
                        <p className="text-xs text-muted-foreground">Interviews</p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-2xl font-bold">{savedJobsList?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">Saved Jobs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              <Tabs defaultValue="profile">
                <TabsList className="mb-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="applications">Applications</TabsTrigger>
                  <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>About Me</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{currentUser?.experience || "No experience information provided yet."}</p>

                        <div className="mt-6">
                          <h3 className="font-medium">Skills</h3>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {currentUser?.skills?.length > 0 ? (
                              currentUser.skills.map((skill: string, i: number) => (
                                <div key={i} className="rounded-full bg-muted px-3 py-1 text-xs">
                                  {skill}
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">No skills added yet.</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium">Email</h3>
                            <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                          </div>
                          <div>
                            <h3 className="font-medium">Phone</h3>
                            <p className="text-sm text-muted-foreground">{currentUser?.phone || "Not provided"}</p>
                          </div>
                          <div>
                            <h3 className="font-medium">Resume</h3>
                            {currentUser?.resume ? (
                              <a
                                href={currentUser.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                View Resume
                              </a>
                            ) : (
                              <p className="text-sm text-muted-foreground">No resume uploaded</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="applications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {applications.length > 0 ? (
                        <div className="divide-y rounded-md border">
                          {applications.map((app) => (
                            <div key={app._id} className="flex items-center justify-between p-4">
                              <div className="space-y-1">
                                <h3 className="font-medium">{app.job?.title || "Job Title"}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {app.job?.company?.companyName || app.job?.company?.fullName} • Applied on{" "}
                                  {new Date(app.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-sm px-2 py-1 rounded-full ${
                                    app.status === "applied"
                                      ? "bg-blue-100 text-blue-700"
                                      : app.status === "interview"
                                        ? "bg-green-100 text-green-700"
                                        : app.status === "review"
                                          ? "bg-purple-100 text-purple-700"
                                          : app.status === "hired"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-8">
                          No applications yet.{" "}
                          <Link to="/jobs" className="text-blue-600 hover:underline">
                            Browse jobs
                          </Link>{" "}
                          to get started!
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="saved">
                  <Card>
                    <CardHeader>
                      <CardTitle>Saved Jobs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {savedJobsList.length > 0 ? (
                        <div className="divide-y rounded-md border">
                          {savedJobsList.map((savedJob) => (
                            <div key={savedJob._id} className="flex items-center justify-between p-4">
                              <div className="space-y-1">
                                <h3 className="font-medium">{savedJob.job?.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {savedJob.job?.company?.companyName || savedJob.job?.company?.fullName} •{" "}
                                  {savedJob.job?.location}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Saved {new Date(savedJob.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" asChild>
                                  <Link to={`/jobs/${savedJob.job._id}`}>View Job</Link>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-8">
                          No saved jobs yet.{" "}
                          <Link to="/jobs" className="text-blue-600 hover:underline">
                            Browse jobs
                          </Link>{" "}
                          and save the ones you like!
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

// Sidebar component for user dashboard
const UserSidebar = ({ currentUser }: { currentUser: any }) => {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2">
          <User className="h-6 w-6" />
          <div className="font-semibold">Candidate Portal</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={true}>
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/jobs">
                    <Briefcase className="h-4 w-4" />
                    <span>Find Jobs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <Home className="h-4 w-4" />
                    <span>Go to Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/profile">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex flex-col gap-4 px-2">
          <div className="text-xs text-muted-foreground">
            Logged in as <span className="font-medium">{currentUser?.fullName || "User"}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              localStorage.removeItem("token")
              localStorage.removeItem("role")
              window.location.href = "/"
            }}
          >
            Log out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default UserDashboard
