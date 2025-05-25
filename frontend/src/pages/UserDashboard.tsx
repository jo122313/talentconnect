
import { Link } from "react-router-dom";
import {
  Briefcase,
  Edit,
  FileText,
  Home,
  LayoutDashboard,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";

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
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UserDashboard = () => {
  // Mock data for the user profile
  const profile = {
    name: "Sarah Johnson",
    title: "Senior UX Designer",
    location: "New York, USA",
    profileCompletion: 85,
    about: "Creative UX/UI designer with 6+ years of experience in designing user interfaces for web and mobile applications. Proficient in Figma, Adobe XD, and Sketch.",
    skills: ["UI/UX Design", "Figma", "Adobe XD", "Sketch", "User Research", "Prototyping", "Wireframing"],
    experience: [
      {
        company: "Design Co.",
        title: "Senior UX Designer",
        period: "2023 - Present",
        description: "Lead designer for multiple high-profile clients."
      },
      {
        company: "Creative Agency",
        title: "UX Designer",
        period: "2020 - 2023",
        description: "Worked on user research and interface design for mobile apps."
      }
    ],
    education: [
      {
        institution: "Design University",
        degree: "Master's in Interaction Design",
        year: "2018 - 2020"
      },
      {
        institution: "State University",
        degree: "Bachelor's in Graphic Design",
        year: "2014 - 2018"
      }
    ]
  };

  // Mock data for job applications
  const applications = [
    {
      id: 1,
      company: "Tech Solutions Inc.",
      position: "Senior UX Designer",
      date: "2025-04-01",
      status: "Applied"
    },
    {
      id: 2,
      company: "Digital Innovations",
      position: "Lead Product Designer",
      date: "2025-03-28",
      status: "Interview Scheduled"
    },
    {
      id: 3,
      company: "Creative Studios",
      position: "UI/UX Designer",
      date: "2025-03-25",
      status: "Reviewed"
    },
    {
      id: 4,
      company: "Design Agency",
      position: "User Experience Lead",
      date: "2025-03-20",
      status: "Rejected"
    }
  ];

  // Mock data for saved jobs
  const savedJobs = [
    {
      id: 1,
      company: "Innovation Labs",
      position: "Senior Product Designer",
      location: "Remote",
      posted: "2 days ago"
    },
    {
      id: 2,
      company: "Tech Startup",
      position: "UI Designer",
      location: "San Francisco, CA",
      posted: "1 week ago"
    },
    {
      id: 3,
      company: "Design Collective",
      position: "UX Researcher",
      location: "Chicago, IL",
      posted: "3 days ago"
    }
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <UserSidebar />
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
                        <AvatarImage src="/placeholder.svg" alt={profile.name} />
                        <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <h2 className="mt-4 text-xl font-semibold">{profile.name}</h2>
                      <p className="text-muted-foreground">{profile.title}</p>
                      <p className="text-sm text-muted-foreground">{profile.location}</p>
                      
                      <div className="mt-6 w-full">
                        <div className="flex justify-between text-sm">
                          <span>Profile Completion</span>
                          <span>{profile.profileCompletion}%</span>
                        </div>
                        <Progress className="mt-2" value={profile.profileCompletion} />
                      </div>
                      
                      <Button className="mt-6 w-full">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
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
                        <div className="text-2xl font-bold">{applications.length}</div>
                        <p className="text-xs text-muted-foreground">Total Applications</p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-2xl font-bold">1</div>
                        <p className="text-xs text-muted-foreground">Interviews</p>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-2xl font-bold">{savedJobs.length}</div>
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
                        <p>{profile.about}</p>
                        
                        <div className="mt-6">
                          <h3 className="font-medium">Skills</h3>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {profile.skills.map((skill, i) => (
                              <div key={i} className="rounded-full bg-muted px-3 py-1 text-xs">
                                {skill}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Experience</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {profile.experience.map((exp, i) => (
                              <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                                <h3 className="font-medium">{exp.title}</h3>
                                <p className="text-sm text-muted-foreground">{exp.company} • {exp.period}</p>
                                <p className="mt-1 text-sm">{exp.description}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Education</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {profile.education.map((edu, i) => (
                              <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                                <h3 className="font-medium">{edu.degree}</h3>
                                <p className="text-sm text-muted-foreground">{edu.institution} • {edu.year}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="applications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="divide-y rounded-md border">
                        {applications.map((app) => (
                          <div key={app.id} className="flex items-center justify-between p-4">
                            <div className="space-y-1">
                              <h3 className="font-medium">{app.position}</h3>
                              <p className="text-sm text-muted-foreground">
                                {app.company} • Applied on {new Date(app.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm px-2 py-1 rounded-full ${
                                app.status === "Applied" 
                                  ? "bg-blue-100 text-blue-700" 
                                  : app.status === "Interview Scheduled" 
                                  ? "bg-green-100 text-green-700"
                                  : app.status === "Reviewed"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-red-100 text-red-700"
                              }`}>
                                {app.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="saved">
                  <Card>
                    <CardHeader>
                      <CardTitle>Saved Jobs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="divide-y rounded-md border">
                        {savedJobs.map((job) => (
                          <div key={job.id} className="flex items-center justify-between p-4">
                            <div className="space-y-1">
                              <h3 className="font-medium">{job.position}</h3>
                              <p className="text-sm text-muted-foreground">
                                {job.company} • {job.location}
                              </p>
                              <p className="text-xs text-muted-foreground">Posted {job.posted}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm">Apply Now</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

// Sidebar component for user dashboard
const UserSidebar = () => {
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
                <SidebarMenuButton>
                  <Briefcase className="h-4 w-4" />
                  <span>Find Jobs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <FileText className="h-4 w-4" />
                  <span>Applications</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <MessageSquare className="h-4 w-4" />
                  <span>Messages</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Home className="h-4 w-4" />
                  <span>Go to Home</span>
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
                <SidebarMenuButton>
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex flex-col gap-4 px-2">
          <div className="text-xs text-muted-foreground">
            Logged in as <span className="font-medium">Sarah Johnson</span>
          </div>
          <Button variant="outline" size="sm">
            Log out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default UserDashboard;
